export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await adminDb.collection("referrals").doc(params.id).update(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Referral PATCH error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
