export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const recordId = formData.get("recordId") as string;
    const folder = formData.get("folder") as string; // "required-docs", "application-package", "bank-docs"
    const docSlug = formData.get("docSlug") as string | null;
    const docLabel = formData.get("docLabel") as string | null;
    const uploadedVia = (formData.get("uploadedVia") as string) || "admin";

    if (!file || !recordId || !folder) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "bin";
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    let storagePath = `records/${recordId}/${folder}/${timestamp}_${safeName}`;
    if (docSlug) {
      storagePath = `records/${recordId}/${folder}/${docSlug}/${timestamp}_${safeName}`;
    }

    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(storagePath);
    await fileRef.save(buffer, {
      metadata: { contentType: file.type },
    });

    // Make publicly readable via signed URL
    const [signedUrl] = await fileRef.getSignedUrl({
      action: "read",
      expires: "01-01-2100",
    });

    const now = new Date().toISOString();
    const docRef = adminDb.collection("records").doc(recordId);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const record = snap.data() as any;
    const fileEntry = {
      fileRef: storagePath,
      fileUrl: signedUrl,
      fileName: safeName,
      fileType: file.type,
      uploadedAt: now,
      uploadedVia,
    };

    if (folder === "required-docs" && docSlug) {
      // Update the specific document slot
      const requiredDocs = record.requiredDocs || [];
      const idx = requiredDocs.findIndex((d: any) => d.slug === docSlug);
      if (idx >= 0) {
        requiredDocs[idx].files = [...(requiredDocs[idx].files || []), fileEntry];
        requiredDocs[idx].status = "Received";
        await docRef.update({ requiredDocs, lastUpdatedAt: now });
      }
    } else {
      // Bank docs or application package
      const existingDocs = record.bankDocs || [];
      existingDocs.push({
        id: `${timestamp}`,
        label: docLabel || file.name,
        folder,
        ...fileEntry,
      });
      await docRef.update({ bankDocs: existingDocs, lastUpdatedAt: now });
    }

    // Log in activity
    await docRef.collection("activityLog").add({
      recordId,
      type: "doc-uploaded",
      note: `Document uploaded: ${docLabel || docSlug || file.name} (${folder})`,
      performedBy: uploadedVia === "admin" ? "admin" : "lead",
      timestamp: now,
    });

    return NextResponse.json({ success: true, fileUrl: signedUrl, storagePath });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
