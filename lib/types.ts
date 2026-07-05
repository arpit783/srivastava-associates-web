import { LoanType, DocSlug } from "./document-checklists";

export type RecordType = "lead" | "customer";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Documents Pending"
  | "Documents Received"
  | "Processing"
  | "Sanctioned"
  | "Disbursed"
  | "Rejected"
  | "Not Interested"
  | "Unresponsive";

export type CustomerStatus = "Active" | "Closed" | "Foreclosed" | "Written Off";

export type RecordStatus = LeadStatus | CustomerStatus;

export type LeadSource =
  | "Website Form"
  | "WhatsApp"
  | "Phone Call"
  | "Walk-in"
  | "Referral"
  | "Existing Customer Referral"
  | "CSV Import"
  | "Manual Entry";

export type DocStatus = "Pending" | "Received" | "Verified" | "Rejected";

export interface DocFile {
  fileRef: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  uploadedVia?: "whatsapp" | "browser" | "admin";
}

export interface RequiredDoc {
  slug: DocSlug;
  label: string;
  status: DocStatus;
  files: DocFile[];
  notes?: string;
}

export interface BankDoc {
  id: string;
  label: string;
  fileRef: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  folder: "application-package" | "bank-docs";
}

export interface UnmatchedDoc {
  id: string;
  fileRef: string;
  fileName: string;
  fileType: string;
  caption?: string;
  receivedAt: string;
  receivedVia: "whatsapp" | "browser";
}

export interface LoanRecord {
  id: string;
  recordType: RecordType;
  name: string;
  phone: string;
  email?: string | null;
  loanType: LoanType;
  amount?: number | null;
  city?: string | null;
  source: LeadSource;
  status: RecordStatus;
  createdAt: string;
  lastUpdatedAt: string;
  lastContactedAt?: string | null;
  followUpCount: number;
  followUpStoppedAt?: string | null;
  requiredDocs: RequiredDoc[];
  bankDocs: BankDoc[];
  unmatchedDocs: UnmatchedDoc[];
  notes?: string | null;
  referrerName?: string | null;
  referrerPhone?: string | null;
  // Customer-specific fields
  bankName?: string | null;
  loanAccountNumber?: string | null;
  disbursementDate?: string | null;
  emiAmount?: number | null;
  tenure?: number | null;
  sanctionedAmount?: number | null;
}

export type ActivityType =
  | "call"
  | "whatsapp-sent"
  | "whatsapp-received"
  | "email-sent"
  | "status-change"
  | "doc-uploaded"
  | "doc-received-whatsapp"
  | "follow-up"
  | "import"
  | "note";

export type CallOutcome =
  | "Answered"
  | "No Response"
  | "Callback Requested"
  | "Not Interested"
  | "Busy"
  | "Wrong Number";

export interface ActivityEntry {
  id: string;
  recordId: string;
  type: ActivityType;
  outcome?: CallOutcome;
  note?: string;
  performedBy?: string;
  timestamp: string;
  metadata?: { [key: string]: string };
}

export interface Callback {
  id: string;
  name: string;
  phone: string;
  loanType: LoanType;
  preferredTime: string;
  city: string;
  timestamp: string;
  status: "New" | "Called" | "Converted";
}

export interface CreditEnquiry {
  id: string;
  name: string;
  phone: string;
  pan?: string;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  name: string;
  loanType: LoanType;
  content: string;
  rating: number;
  approved: boolean;
  timestamp: string;
  photoUrl?: string;
}

export interface BankRate {
  id: string;
  bank: string;
  loanType: LoanType;
  minRate: number;
  maxRate: number;
  updatedAt: string;
}

export interface Referral {
  id: string;
  referrerName: string;
  referrerPhone: string;
  clientName: string;
  clientPhone: string;
  loanType: LoanType;
  timestamp: string;
  status: "New" | "Contacted" | "Converted";
  notes?: string;
}
