export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getChecklist, LoanType } from "@/lib/document-checklists";
import { sendNewLeadEmail } from "@/lib/mailer";
import { LoanRecord, LeadSource } from "@/lib/types";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, phone, email, loanType, amount, city, source,
      bankName, loanAccountNumber, disbursementDate, emiAmount, tenure,
      recordType = "lead", notes,
      referrerName, referrerPhone,
    } = body;

    if (!name || !phone || !loanType) {
      return NextResponse.json({ error: "Name, phone, and loanType are required" }, { status: 400 });
    }

    const checklist = getChecklist(loanType as LoanType);
    const now = new Date().toISOString();

    const isReferral = source === "Referral" || source === "Existing Customer Referral";

    const recordData: Omit<LoanRecord, "id"> = {
      recordType: recordType as "lead" | "customer",
      name: name.trim(),
      phone: phone.replace(/\D/g, "").slice(-10),
      email: email?.trim() || null,
      loanType: loanType as LoanType,
      amount: amount ? Number(amount) : null,
      city: city?.trim() || null,
      source: (source || "Website Form") as LeadSource,
      referrerName: referrerName?.trim() || null,
      referrerPhone: referrerPhone?.trim() || null,
      status: recordType === "customer" ? "Active" : "New",
      createdAt: now,
      lastUpdatedAt: now,
      followUpCount: 0,
      requiredDocs: checklist.map((item) => ({
        slug: item.slug,
        label: item.label,
        status: "Pending" as const,
        files: [],
      })),
      bankDocs: [],
      unmatchedDocs: [],
      notes: notes?.trim() || null,
      bankName: bankName?.trim() || null,
      loanAccountNumber: loanAccountNumber?.trim() || null,
      disbursementDate: disbursementDate || null,
      emiAmount: emiAmount ? Number(emiAmount) : null,
      tenure: tenure ? Number(tenure) : null,
    };

    const docRef = await adminDb.collection("records").add(recordData);

    // Log creation in activity log
    await adminDb
      .collection("records")
      .doc(docRef.id)
      .collection("activityLog")
      .add({
        recordId: docRef.id,
        type: "note",
        note: `Record created via ${source || "Website Form"}`,
        performedBy: "system",
        timestamp: now,
      });

    // Create referral record if source is referral
    if (isReferral && referrerName?.trim()) {
      await adminDb.collection("referrals").add({
        referrerName: referrerName.trim(),
        referrerPhone: referrerPhone?.trim() || null,
        clientName: name.trim(),
        clientPhone: phone.replace(/\D/g, "").slice(-10),
        loanType,
        recordId: docRef.id,
        source,
        timestamp: now,
        status: "New",
      });
    }

    // Send email alert for leads
    if (recordType !== "customer") {
      try {
        await sendNewLeadEmail({ id: docRef.id, ...recordData } as LoanRecord);
      } catch (emailErr) {
        console.error("Email failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("Records POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recordType = searchParams.get("recordType");
    const status      = searchParams.get("status");
    const loanType    = searchParams.get("loanType");
    const search      = searchParams.get("search")?.trim().toLowerCase() || "";
    const all         = searchParams.get("all") === "true";   // CSV export
    const statsOnly   = searchParams.get("statsOnly") === "true";
    const page        = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize    = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "10")));

    // Fetch all records from Firestore (needed for search + accurate counts)
    const snap = await adminDb.collection("records").orderBy("createdAt", "desc").limit(2000).get();
    let records: any[] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Stats mode — return counts only (for dashboard)
    if (statsOnly) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      return NextResponse.json({
        totalLeads:      records.filter((r) => r.recordType === "lead").length,
        totalCustomers:  records.filter((r) => r.recordType === "customer").length,
        newToday:        records.filter((r) => new Date(r.createdAt) >= today).length,
        pendingFollowUps:records.filter((r) => r.recordType === "lead" && r.status === "Contacted" && !r.followUpStoppedAt).length,
        docsAwaited:     records.filter((r) => r.status === "Documents Pending").length,
        recentLeads:     records.slice(0, 10),
      });
    }

    // Apply filters
    if (recordType) records = records.filter((r) => r.recordType === recordType);
    if (status)     records = records.filter((r) => r.status === status);
    if (loanType)   records = records.filter((r) => r.loanType === loanType);
    if (search)     records = records.filter((r) =>
      r.name?.toLowerCase().includes(search) ||
      r.phone?.includes(search) ||
      r.email?.toLowerCase().includes(search) ||
      r.city?.toLowerCase().includes(search) ||
      r.loanType?.toLowerCase().includes(search)
    );

    const total      = records.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    // Return all for CSV export
    if (all) return NextResponse.json({ records, total, page: 1, pageSize: total, totalPages: 1 });

    // Paginate
    const start   = (page - 1) * pageSize;
    const paged   = records.slice(start, start + pageSize);

    return NextResponse.json({ records: paged, total, page, pageSize, totalPages });
  } catch (err) {
    console.error("Records GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
