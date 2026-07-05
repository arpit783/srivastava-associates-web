export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { parseCSV, toFirestoreRecord } from "@/lib/csv-parser";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { csvText, confirm } = body;

    if (!csvText) {
      return NextResponse.json({ error: "CSV text required" }, { status: 400 });
    }

    const { valid, errors } = parseCSV(csvText);

    // If not confirming, just return the parse result for preview
    if (!confirm) {
      return NextResponse.json({ valid, errors, total: valid.length + errors.length });
    }

    // Perform the actual import
    const now = new Date().toISOString();
    const batch = adminDb.batch();
    const createdIds: string[] = [];

    for (const record of valid) {
      const ref = adminDb.collection("records").doc();
      const data = toFirestoreRecord(record, now);
      batch.set(ref, data);
      createdIds.push(ref.id);
    }

    await batch.commit();

    // Add activity log entries for imported records
    const logBatch = adminDb.batch();
    createdIds.forEach((id) => {
      const logRef = adminDb.collection("records").doc(id).collection("activityLog").doc();
      logBatch.set(logRef, {
        recordId: id,
        type: "import",
        note: "Record imported from CSV",
        performedBy: "admin",
        timestamp: now,
      });
    });
    await logBatch.commit();

    return NextResponse.json({
      success: true,
      imported: createdIds.length,
      errors: errors.length,
      ids: createdIds,
    });
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
