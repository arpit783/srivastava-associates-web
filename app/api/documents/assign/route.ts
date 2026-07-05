export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { recordId, unmatchedDocId, targetSlug, targetFolder } = await req.json();

    if (!recordId || !unmatchedDocId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const docRef = adminDb.collection("records").doc(recordId);
    const snap = await docRef.get();
    if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const record = snap.data() as any;
    const unmatchedDocs: any[] = record.unmatchedDocs || [];
    const docToAssign = unmatchedDocs.find((d: any) => d.id === unmatchedDocId);

    if (!docToAssign) {
      return NextResponse.json({ error: "Unmatched doc not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updates: any = {
      unmatchedDocs: unmatchedDocs.filter((d: any) => d.id !== unmatchedDocId),
      lastUpdatedAt: now,
    };

    if (targetSlug) {
      // Assign to required-docs slot
      const requiredDocs: any[] = record.requiredDocs || [];
      const idx = requiredDocs.findIndex((d: any) => d.slug === targetSlug);
      if (idx >= 0) {
        requiredDocs[idx].files = [
          ...(requiredDocs[idx].files || []),
          {
            fileRef: docToAssign.fileRef,
            fileUrl: docToAssign.fileUrl,
            fileName: docToAssign.fileName,
            fileType: docToAssign.fileType,
            uploadedAt: docToAssign.receivedAt,
            uploadedVia: docToAssign.receivedVia,
          },
        ];
        requiredDocs[idx].status = "Received";
        updates.requiredDocs = requiredDocs;
      }
    } else if (targetFolder) {
      // Move to bank docs
      const bankDocs: any[] = record.bankDocs || [];
      bankDocs.push({
        id: `assigned_${Date.now()}`,
        label: docToAssign.caption || docToAssign.fileName,
        folder: targetFolder,
        fileRef: docToAssign.fileRef,
        fileUrl: docToAssign.fileUrl,
        fileName: docToAssign.fileName,
        fileType: docToAssign.fileType,
        uploadedAt: now,
        uploadedVia: docToAssign.receivedVia,
      });
      updates.bankDocs = bankDocs;
    }

    await docRef.update(updates);
    await docRef.collection("activityLog").add({
      recordId,
      type: "doc-uploaded",
      note: `Unmatched document assigned to ${targetSlug || targetFolder}`,
      performedBy: "admin",
      timestamp: now,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Assign error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
