import Papa from "papaparse";
import { LoanType, LOAN_TYPE_LABELS, getChecklist } from "./document-checklists";
import { LoanRecord, LeadSource } from "./types";

export interface CSVRow {
  name: string;
  phone: string;
  email?: string;
  loanType: string;
  amount?: string;
  bankName?: string;
  disbursementDate?: string;
  loanAccountNumber?: string;
  emiAmount?: string;
  tenure?: string;
  status?: string;
  city?: string;
  notes?: string;
}

export interface ParseResult {
  valid: ImportRecord[];
  errors: Array<{ row: number; message: string; data: object }>;
}

export interface ImportRecord {
  name: string;
  phone: string;
  email?: string;
  loanType: LoanType;
  amount?: number;
  bankName?: string;
  disbursementDate?: string;
  loanAccountNumber?: string;
  emiAmount?: number;
  tenure?: number;
  city?: string;
  notes?: string;
}

const LOAN_TYPE_MAP: Record<string, LoanType> = {};
Object.entries(LOAN_TYPE_LABELS).forEach(([slug, label]) => {
  LOAN_TYPE_MAP[label.toLowerCase()] = slug as LoanType;
  LOAN_TYPE_MAP[slug.toLowerCase()] = slug as LoanType;
});

export function parseCSV(csvText: string): ParseResult {
  const result = Papa.parse<CSVRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, ""),
  });

  const valid: ImportRecord[] = [];
  const errors: ParseResult["errors"] = [];

  result.data.forEach((row, idx) => {
    const rowNum = idx + 2;
    const r = row as unknown as { [key: string]: string };

    const name = (r["name"] || r["customername"] || "").trim();
    const phone = (r["phone"] || r["mobileno"] || r["mobile"] || "").replace(/\D/g, "");
    const loanTypeRaw = (r["loantype"] || r["loan"] || "").trim().toLowerCase();

    if (!name) {
      errors.push({ row: rowNum, message: "Name is required", data: row });
      return;
    }
    if (!phone || phone.length < 10) {
      errors.push({ row: rowNum, message: "Valid phone is required", data: row });
      return;
    }

    const loanType = LOAN_TYPE_MAP[loanTypeRaw] || "home-loan";

    valid.push({
      name,
      phone: phone.slice(-10),
      email: (r["email"] || "").trim() || undefined,
      loanType,
      amount: parseFloat(r["loanamount"] || r["amount"] || "0") || undefined,
      bankName: (r["bankname"] || r["bank"] || "").trim() || undefined,
      disbursementDate: (r["disbursementdate"] || "").trim() || undefined,
      loanAccountNumber: (r["loanaccountnumber"] || r["accountno"] || "").trim() || undefined,
      emiAmount: parseFloat(r["emiamount"] || r["emi"] || "0") || undefined,
      tenure: parseInt(r["tenure"] || "0") || undefined,
      city: (r["city"] || "").trim() || undefined,
      notes: (r["notes"] || "").trim() || undefined,
    });
  });

  return { valid, errors };
}

export function toFirestoreRecord(
  importRecord: ImportRecord,
  now: string
): Omit<LoanRecord, "id"> {
  const checklist = getChecklist(importRecord.loanType);
  return {
    recordType: "customer",
    name: importRecord.name,
    phone: importRecord.phone,
    email: importRecord.email,
    loanType: importRecord.loanType,
    amount: importRecord.amount,
    city: importRecord.city,
    source: "CSV Import" as LeadSource,
    status: "Active",
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
    notes: importRecord.notes,
    bankName: importRecord.bankName,
    loanAccountNumber: importRecord.loanAccountNumber,
    disbursementDate: importRecord.disbursementDate,
    emiAmount: importRecord.emiAmount,
    tenure: importRecord.tenure,
    sanctionedAmount: importRecord.amount,
  };
}

export const CSV_TEMPLATE_HEADERS = [
  "Name",
  "Phone",
  "Email",
  "LoanType",
  "LoanAmount",
  "BankName",
  "DisbursementDate",
  "LoanAccountNumber",
  "EMIAmount",
  "Tenure",
  "City",
  "Notes",
];

export function generateCSVTemplate(): string {
  const sampleRow = [
    "Amit Sharma",
    "9876543210",
    "amit@example.com",
    "Home Loan",
    "3500000",
    "SBI",
    "2024-01-15",
    "SBI12345678",
    "28000",
    "240",
    "Kota",
    "Existing customer since 2024",
  ];
  return CSV_TEMPLATE_HEADERS.join(",") + "\n" + sampleRow.join(",");
}
