export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendNewLeadEmail, sendStatusUpdateEmail, sendCallbackEmail } from "@/lib/mailer";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, recordId, to, subject, html, text } = body;

    if (type === "custom") {
      if (!to || !subject || !(html || text)) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
      await transporter.sendMail({
        from: `"Srivastava Associates" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html: html || `<p>${text}</p>`,
        text,
      });

      if (recordId) {
        await adminDb
          .collection("records")
          .doc(recordId)
          .collection("activityLog")
          .add({
            recordId,
            type: "email-sent",
            note: `Custom email sent to ${to}: ${subject}`,
            performedBy: "admin",
            timestamp: new Date().toISOString(),
          });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
