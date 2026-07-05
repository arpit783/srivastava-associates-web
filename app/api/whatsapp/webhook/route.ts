export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebase-admin";
import {
  downloadWhatsAppMedia,
  downloadMediaBuffer,
  sendWhatsAppText,
  buildDocAckMessage,
} from "@/lib/whatsapp";
import { matchDocumentFromCaption, getFileExtension } from "@/lib/document-matcher";

// GET — webhook verification (Meta requires this)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// POST — receive incoming messages
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Process each message entry
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;
        if (!value?.messages) continue;

        for (const message of value.messages) {
          await processIncomingMessage(message, value);
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

async function processIncomingMessage(message: any, value: any) {
  const senderPhone = message.from?.replace(/^91/, "").slice(-10);
  const caption = message.image?.caption || message.document?.caption || "";
  const now = new Date().toISOString();

  // Find lead by phone number
  const snap = await adminDb
    .collection("records")
    .where("phone", "==", senderPhone)
    .limit(1)
    .get();

  // Handle text messages (replies to follow-ups)
  if (message.type === "text") {
    if (!snap.empty) {
      const docRef = snap.docs[0].ref;
      const record = snap.docs[0].data();
      await docRef.collection("activityLog").add({
        recordId: snap.docs[0].id,
        type: "whatsapp-received",
        note: `WhatsApp reply received: "${message.text?.body?.slice(0, 100)}"`,
        performedBy: "lead",
        timestamp: now,
      });
      // Mark as responded to stop follow-ups
      if (record.status === "Contacted" || record.followUpCount > 0) {
        await docRef.update({
          followUpStoppedAt: now,
          lastUpdatedAt: now,
        });
      }
    }
    return;
  }

  // Handle media messages (photos, PDFs)
  if (message.type !== "image" && message.type !== "document") return;

  const mediaId = message.image?.id || message.document?.id;
  const mimeType = message.image?.mime_type || message.document?.mime_type || "application/octet-stream";
  const fileName = message.document?.filename || `document_${Date.now()}.${getFileExtension(mimeType)}`;

  if (!mediaId) return;

  // If sender not found, create alert on admin dashboard
  if (snap.empty) {
    await adminDb.collection("unknownWhatsAppSenders").add({
      phone: senderPhone,
      mediaId,
      caption,
      mimeType,
      timestamp: now,
    });
    return;
  }

  const leadDoc = snap.docs[0];
  const leadData = leadDoc.data();
  const leadId = leadDoc.id;

  // Download media from WhatsApp CDN
  const mediaInfo = await downloadWhatsAppMedia(mediaId);
  if (!mediaInfo) {
    console.error("Could not get media URL for", mediaId);
    return;
  }

  const buffer = await downloadMediaBuffer(mediaInfo.url);
  if (!buffer) {
    console.error("Could not download media buffer");
    return;
  }

  // Upload to Firebase Storage
  const ext = getFileExtension(mimeType);
  const matchedSlug = matchDocumentFromCaption(caption);
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();

  let storagePath: string;
  if (matchedSlug) {
    storagePath = `records/${leadId}/required-docs/${matchedSlug}/${timestamp}_${safeFileName}`;
  } else {
    storagePath = `records/${leadId}/unmatched/${timestamp}_${safeFileName}`;
  }

  const bucket = adminStorage.bucket();
  const fileRef = bucket.file(storagePath);
  await fileRef.save(buffer, {
    metadata: { contentType: mimeType },
  });

  const [signedUrl] = await fileRef.getSignedUrl({
    action: "read",
    expires: "01-01-2100",
  });

  const fileEntry = {
    fileRef: storagePath,
    fileUrl: signedUrl,
    fileName: safeFileName,
    fileType: mimeType,
    uploadedAt: now,
    uploadedVia: "whatsapp",
  };

  // Update Firestore
  const docRef = leadDoc.ref;
  const record = leadData;

  if (matchedSlug) {
    const requiredDocs: any[] = record.requiredDocs || [];
    const idx = requiredDocs.findIndex((d: any) => d.slug === matchedSlug);
    const docLabel = idx >= 0 ? requiredDocs[idx].label : matchedSlug;

    if (idx >= 0) {
      requiredDocs[idx].files = [...(requiredDocs[idx].files || []), fileEntry];
      requiredDocs[idx].status = "Received";
      await docRef.update({ requiredDocs, lastUpdatedAt: now });
    }

    // Send acknowledgement
    try {
      const ackMsg = buildDocAckMessage(record.name, docLabel);
      await sendWhatsAppText(senderPhone, ackMsg);
    } catch {}

    await docRef.collection("activityLog").add({
      recordId: leadId,
      type: "doc-received-whatsapp",
      note: `Document received via WhatsApp: ${matchedSlug} (${caption || "no caption"})`,
      performedBy: "lead",
      timestamp: now,
    });
  } else {
    // Add to unmatched docs
    const unmatchedDocs: any[] = record.unmatchedDocs || [];
    unmatchedDocs.push({
      id: `${timestamp}`,
      ...fileEntry,
      caption: caption || "",
      receivedAt: now,
      receivedVia: "whatsapp",
    });
    await docRef.update({ unmatchedDocs, lastUpdatedAt: now });

    // Ack with note about uncategorised doc
    try {
      const ackMsg = `✅ Hi ${record.name}! We received your document. Since we couldn't identify it automatically, our team will categorise it shortly.\n\n_Tip: Send the document name in the caption (e.g., "PAN Card") for automatic matching._\n\n— Srivastava Associates`;
      await sendWhatsAppText(senderPhone, ackMsg);
    } catch {}

    await docRef.collection("activityLog").add({
      recordId: leadId,
      type: "doc-received-whatsapp",
      note: `Unmatched document received via WhatsApp (caption: "${caption || "none"}")`,
      performedBy: "lead",
      timestamp: now,
    });
  }
}
