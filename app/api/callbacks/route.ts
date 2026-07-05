export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendCallbackEmail } from "@/lib/mailer";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, loanType, preferredTime, city, message, source } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const docRef = await adminDb.collection("callbacks").add({
      name: name.trim(),
      phone: phone.replace(/\D/g, "").slice(-10),
      loanType: loanType || "general",
      preferredTime: preferredTime || "Anytime",
      city: city?.trim() || "",
      message: message?.trim() || "",
      source: source || "website",
      timestamp: now,
      status: "New",
    });

    // Send email alert
    try {
      await sendCallbackEmail({
        name,
        phone,
        loanType: LOAN_TYPE_LABELS[loanType as LoanType] || loanType || "General Inquiry",
        preferredTime: preferredTime || "Anytime",
        city: city || "Not specified",
      });
    } catch (emailErr) {
      console.error("Email failed:", emailErr);
    }

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("Callback API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const snap = await adminDb
      .collection("callbacks")
      .orderBy("timestamp", "desc")
      .limit(100)
      .get();

    const callbacks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(callbacks);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
