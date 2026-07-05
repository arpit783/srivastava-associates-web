export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { recordId } = await req.json();
    if (!recordId) return NextResponse.json({ error: "recordId required" }, { status: 400 });

    const token = `${recordId}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    await adminDb.collection("uploadTokens").doc(token).set({
      recordId,
      token,
      expiresAt,
      createdAt: new Date().toISOString(),
      used: false,
    });

    const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/upload/${token}`;
    return NextResponse.json({ success: true, token, uploadUrl, expiresAt });
  } catch (err) {
    console.error("Upload token error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  const snap = await adminDb.collection("uploadTokens").doc(token).get();
  if (!snap.exists) return NextResponse.json({ error: "Invalid token" }, { status: 404 });

  const data = snap.data()!;
  if (new Date(data.expiresAt) < new Date()) {
    return NextResponse.json({ error: "Token expired" }, { status: 410 });
  }

  // Fetch the associated record
  const recordSnap = await adminDb.collection("records").doc(data.recordId).get();
  if (!recordSnap.exists) return NextResponse.json({ error: "Record not found" }, { status: 404 });

  return NextResponse.json({
    valid: true,
    recordId: data.recordId,
    record: { id: recordSnap.id, ...recordSnap.data() },
  });
}
