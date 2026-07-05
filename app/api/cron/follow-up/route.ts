import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendWhatsAppText, buildFollowUpMessage } from "@/lib/whatsapp";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";

// Vercel cron: runs daily at 10 AM IST (04:30 UTC)
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Secure the cron endpoint
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const results = { sent: 0, skipped: 0, errors: 0 };

    // Query leads that need follow-up
    const snap = await adminDb
      .collection("records")
      .where("recordType", "==", "lead")
      .where("status", "==", "Contacted")
      .get();

    for (const doc of snap.docs) {
      const record = doc.data();

      // Skip if follow-ups stopped
      if (record.followUpStoppedAt) { results.skipped++; continue; }
      // Skip if no last contacted date
      if (!record.lastContactedAt) { results.skipped++; continue; }

      const lastContact = new Date(record.lastContactedAt);
      const daysSinceContact = Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
      const followUpCount = record.followUpCount || 0;

      // Check if it's a follow-up day (3, 6, or 9 days after last contact)
      const nextFollowUpDay = (followUpCount + 1) * 3;
      if (daysSinceContact < nextFollowUpDay) { results.skipped++; continue; }

      // Max 3 follow-ups
      if (followUpCount >= 3) {
        await doc.ref.update({
          status: "Unresponsive",
          followUpStoppedAt: now.toISOString(),
          lastUpdatedAt: now.toISOString(),
        });
        await doc.ref.collection("activityLog").add({
          recordId: doc.id,
          type: "status-change",
          note: "Marked Unresponsive after 3 follow-ups with no response",
          performedBy: "system",
          timestamp: now.toISOString(),
        });
        results.skipped++;
        continue;
      }

      // Send follow-up WhatsApp message
      const loanLabel = LOAN_TYPE_LABELS[record.loanType as LoanType] || record.loanType;
      const message = buildFollowUpMessage(record.name, loanLabel, followUpCount + 1);

      try {
        const sendResult = await sendWhatsAppText(record.phone, message);
        if (sendResult.success) {
          await doc.ref.update({
            followUpCount: followUpCount + 1,
            lastContactedAt: now.toISOString(),
            lastUpdatedAt: now.toISOString(),
          });
          await doc.ref.collection("activityLog").add({
            recordId: doc.id,
            type: "follow-up",
            note: `Auto follow-up #${followUpCount + 1} sent via WhatsApp`,
            performedBy: "system",
            timestamp: now.toISOString(),
            metadata: { followUpNumber: String(followUpCount + 1), messageId: sendResult.messageId || "" },
          });
          results.sent++;
        } else {
          results.errors++;
          console.error(`Follow-up send failed for ${doc.id}:`, sendResult.error);
        }
      } catch (err) {
        results.errors++;
        console.error(`Error for ${doc.id}:`, err);
      }
    }

    // Send daily digest email
    try {
      const { sendDailyDigest } = await import("@/lib/mailer");
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const newLeadsSnap = await adminDb
        .collection("records")
        .where("createdAt", ">=", todayStart.toISOString())
        .get();

      const pendingFollowUpsSnap = await adminDb
        .collection("records")
        .where("status", "==", "Contacted")
        .get();

      const docsAwaitedSnap = await adminDb
        .collection("records")
        .where("status", "==", "Documents Pending")
        .get();

      await sendDailyDigest({
        newLeads: newLeadsSnap.size,
        pendingFollowUps: pendingFollowUpsSnap.size,
        docsAwaited: docsAwaitedSnap.size,
        leadsToday: newLeadsSnap.docs.map((d) => {
          const data = d.data();
          return {
            name: data.name,
            phone: data.phone,
            loanType: LOAN_TYPE_LABELS[data.loanType as LoanType] || data.loanType,
          };
        }),
      });
    } catch (digestErr) {
      console.error("Digest email failed:", digestErr);
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("Cron error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
