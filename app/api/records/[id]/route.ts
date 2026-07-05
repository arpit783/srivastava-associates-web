export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendStatusUpdateEmail } from "@/lib/mailer";
import { sendWhatsAppText } from "@/lib/whatsapp";
import { LOAN_TYPE_LABELS } from "@/lib/document-checklists";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docSnap = await adminDb.collection("records").doc(params.id).get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get activity log
    const logSnap = await adminDb
      .collection("records")
      .doc(params.id)
      .collection("activityLog")
      .orderBy("timestamp", "desc")
      .limit(100)
      .get();

    const activityLog = logSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data(),
      activityLog,
    });
  } catch (err) {
    console.error("Record GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();

    const docRef = adminDb.collection("records").doc(params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const current = docSnap.data() as any;
    const updates: Record<string, any> = { ...body, lastUpdatedAt: now };

    // Handle status change
    if (body.status && body.status !== current.status) {
      const logEntry = {
        recordId: params.id,
        type: "status-change",
        note: `Status changed: ${current.status} → ${body.status}`,
        performedBy: body.performedBy || "admin",
        timestamp: now,
        metadata: { oldStatus: current.status, newStatus: body.status },
      };
      await docRef.collection("activityLog").add(logEntry);

      // Email notification
      try {
        await sendStatusUpdateEmail(
          { id: params.id, ...current },
          current.status,
          body.status
        );
      } catch {}

      // Auto-promote lead to customer on Disbursed
      if (body.status === "Disbursed" && current.recordType === "lead") {
        updates.recordType = "customer";
      }
    }

    // Handle activity log entry
    if (body.activityEntry) {
      await docRef.collection("activityLog").add({
        recordId: params.id,
        ...body.activityEntry,
        timestamp: now,
      });

      // Track lastContactedAt for follow-up scheduler
      if (body.activityEntry.type === "call") {
        updates.lastContactedAt = now;
        if (body.activityEntry.outcome === "No Response") {
          updates.followUpCount = (current.followUpCount || 0);
        }
      }
      delete updates.activityEntry;
    }

    await docRef.update(updates);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Record PATCH error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await adminDb.collection("records").doc(params.id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
