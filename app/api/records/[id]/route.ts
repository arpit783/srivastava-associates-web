export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendStatusUpdateEmail } from "@/lib/mailer";

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

    // Fields allowed to be directly updated
    const EDITABLE_FIELDS = [
      "name", "phone", "email", "loanType", "amount", "city", "source",
      "bankName", "loanAccountNumber", "disbursementDate", "emiAmount",
      "tenure", "sanctionedAmount", "notes", "referrerName", "referrerPhone",
      "recordType", "status",
    ];

    const updates: Record<string, any> = { lastUpdatedAt: now };

    // Copy only allowed fields from body
    for (const field of EDITABLE_FIELDS) {
      if (field in body) updates[field] = body[field];
    }

    // Handle status change logging + email
    if (body.status && body.status !== current.status) {
      await docRef.collection("activityLog").add({
        recordId: params.id,
        type: "status-change",
        note: `Status changed: ${current.status} → ${body.status}`,
        performedBy: body.performedBy || "admin",
        timestamp: now,
        metadata: { oldStatus: current.status, newStatus: body.status },
      });

      try {
        await sendStatusUpdateEmail({ id: params.id, ...current }, current.status, body.status);
      } catch {}
    }

    // Handle recordType change (lead → customer conversion)
    if (body.recordType && body.recordType !== current.recordType) {
      // If not already logged via status change
      if (!(body.status && body.status !== current.status)) {
        await docRef.collection("activityLog").add({
          recordId: params.id,
          type: "status-change",
          note: `Record type changed: ${current.recordType} → ${body.recordType}`,
          performedBy: body.performedBy || "admin",
          timestamp: now,
        });
      }
    }

    // Handle inline activity log entry
    if (body.activityEntry) {
      await docRef.collection("activityLog").add({
        recordId: params.id,
        ...body.activityEntry,
        timestamp: now,
      });
      if (body.activityEntry.type === "call") {
        updates.lastContactedAt = now;
      }
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
