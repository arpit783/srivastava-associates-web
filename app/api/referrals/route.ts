export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  const snap = await adminDb.collection("referrals").orderBy("timestamp", "desc").limit(100).get();
  return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const ref = await adminDb.collection("referrals").add({ ...body, timestamp: new Date().toISOString(), status: "New" });
  return NextResponse.json({ id: ref.id });
}
