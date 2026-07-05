export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendWhatsAppText, sendWhatsAppMedia } from "@/lib/whatsapp";
import { formatChecklistAsWhatsApp, LoanType, LOAN_TYPE_LABELS } from "@/lib/document-checklists";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recordId, type, phone, message, mediaUrl, mediaType, loanType, customMessage } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    let finalMessage = "";
    let result;

    switch (type) {
      case "checklist": {
        const record = recordId
          ? await adminDb.collection("records").doc(recordId).get()
          : null;
        const name = record?.data()?.name || "there";
        const lt = (loanType || record?.data()?.loanType) as LoanType;
        finalMessage = formatChecklistAsWhatsApp(lt, name);
        result = await sendWhatsAppText(phone, finalMessage);
        break;
      }
      case "emi": {
        finalMessage = message || customMessage || "Please find your EMI details below.";
        result = await sendWhatsAppText(phone, finalMessage);
        break;
      }
      case "media": {
        if (!mediaUrl) {
          return NextResponse.json({ error: "mediaUrl required" }, { status: 400 });
        }
        result = await sendWhatsAppMedia(
          phone,
          mediaUrl,
          message || "",
          (mediaType || "document") as "image" | "document"
        );
        break;
      }
      case "status-update": {
        finalMessage = message || customMessage || "";
        result = await sendWhatsAppText(phone, finalMessage);
        break;
      }
      case "upload-reminder": {
        const record = recordId
          ? await adminDb.collection("records").doc(recordId).get()
          : null;
        const name = record?.data()?.name || "there";
        finalMessage =
          customMessage ||
          `Hi ${name}! 📋 Please share the pending documents for your loan application. You can send them here on WhatsApp or use the upload link we sent you.\n\n— Srivastava Associates\n📞 8306445333`;
        result = await sendWhatsAppText(phone, finalMessage);
        break;
      }
      case "custom": {
        finalMessage = customMessage || message || "";
        result = await sendWhatsAppText(phone, finalMessage);
        break;
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Log in activity
    if (recordId) {
      const now = new Date().toISOString();
      await adminDb
        .collection("records")
        .doc(recordId)
        .collection("activityLog")
        .add({
          recordId,
          type: "whatsapp-sent",
          note: `WhatsApp sent [${type}]: ${finalMessage.slice(0, 80)}${finalMessage.length > 80 ? "..." : ""}`,
          performedBy: "admin",
          timestamp: now,
          metadata: { messageType: type, success: String(result?.success) },
        });
      await adminDb.collection("records").doc(recordId).update({
        lastUpdatedAt: now,
      });
    }

    if (result?.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    } else {
      return NextResponse.json({ error: result?.error || "Send failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("WA send error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
