export type DocSlug =
  | "pan-card"
  | "aadhaar-card"
  | "photo"
  | "car-quotation"
  | "vehicle-quotation"
  | "itr-2yr"
  | "itr-3yr"
  | "agriculture-copy"
  | "electricity-bill"
  | "bank-statement-6m"
  | "bank-statement-1yr"
  | "rc"
  | "driving-licence"
  | "guarantor-pan"
  | "guarantor-aadhaar"
  | "guarantor-rc"
  | "property-papers"
  | "form16-salary-slips"
  | "previous-loan-statement"
  | "sanction-letter"
  | "document-list";

export interface DocItem {
  slug: DocSlug;
  label: string;
  description?: string;
  required: boolean;
  conditional?: string;
}

export type LoanType =
  | "new-car-loan"
  | "used-car-loan"
  | "hcv-loan"
  | "used-hcv-loan"
  | "home-loan"
  | "mortgage-loan"
  | "business-loan"
  | "msme-loan"
  | "personal-loan"
  | "equipment-loan"
  | "general-insurance"
  | "life-insurance"
  | "cc-od-limit";

export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  "new-car-loan": "New Car Loan",
  "used-car-loan": "Used Car Loan",
  "hcv-loan": "HCV Loan (New)",
  "used-hcv-loan": "Used HCV Loan",
  "home-loan": "Home Loan",
  "mortgage-loan": "Mortgage Loan (LAP)",
  "business-loan": "Business Loan",
  "msme-loan": "MSME Loan",
  "personal-loan": "Personal Loan",
  "equipment-loan": "Equipment Loan",
  "general-insurance": "General Insurance",
  "life-insurance": "Life Insurance",
  "cc-od-limit": "CC / OD Limit",
};

export const DOCUMENT_CHECKLISTS: Record<LoanType, DocItem[]> = {
  "new-car-loan": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
    { slug: "photo", label: "Passport Size Photo", required: true },
    { slug: "car-quotation", label: "Quotation of Car", required: true },
    {
      slug: "itr-2yr",
      label: "2 Year ITR or Agriculture Copy",
      description: "Last 2 years Income Tax Returns or Agriculture Land Copy",
      required: true,
    },
    {
      slug: "electricity-bill",
      label: "Electricity Bill",
      description: "Recent electricity bill for address proof",
      required: true,
    },
    {
      slug: "bank-statement-6m",
      label: "6 Month Bank Statement (Till Date)",
      description: "Latest 6 months bank statement",
      required: true,
    },
  ],
  "used-car-loan": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
    { slug: "photo", label: "Passport Size Photo", required: true },
    {
      slug: "rc",
      label: "RC (Registration Certificate)",
      description: "Vehicle Registration Certificate",
      required: true,
    },
    {
      slug: "itr-2yr",
      label: "2 Year ITR or Agriculture Copy",
      required: true,
    },
    { slug: "electricity-bill", label: "Electricity Bill", required: true },
    {
      slug: "bank-statement-6m",
      label: "6 Month Bank Statement (Till Date)",
      required: true,
    },
  ],
  "hcv-loan": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
    {
      slug: "driving-licence",
      label: "Driving Licence (Min. 1 Year Old or ITR)",
      description:
        "Driving licence must be at least 1 year old, or ITR in lieu",
      required: true,
    },
    { slug: "photo", label: "Passport Size Photo", required: true },
    {
      slug: "vehicle-quotation",
      label: "Quotation of Vehicle",
      required: true,
    },
    {
      slug: "rc",
      label: "Previous Vehicle RC",
      description: "RC of previous/existing vehicle",
      required: false,
      conditional: "If applicable",
    },
    {
      slug: "guarantor-pan",
      label: "Guarantor – PAN Card",
      description: "Guarantor's PAN Card",
      required: false,
      conditional: "If guarantor required",
    },
    {
      slug: "guarantor-aadhaar",
      label: "Guarantor – Aadhaar Card",
      required: false,
      conditional: "If guarantor required",
    },
    {
      slug: "guarantor-rc",
      label: "Guarantor – Vehicle RC",
      description: "Guarantor's vehicle RC",
      required: false,
      conditional: "If guarantor required",
    },
    { slug: "electricity-bill", label: "Electricity Bill", required: true },
    {
      slug: "bank-statement-6m",
      label: "6 Month Bank Statement (Till Date)",
      required: true,
    },
  ],
  "used-hcv-loan": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
    {
      slug: "driving-licence",
      label: "Driving Licence (Min. 1 Year Old or ITR)",
      required: true,
    },
    { slug: "photo", label: "Passport Size Photo", required: true },
    {
      slug: "vehicle-quotation",
      label: "Quotation of Vehicle",
      required: true,
    },
    {
      slug: "rc",
      label: "Previous Vehicle RC",
      required: false,
      conditional: "If applicable",
    },
    {
      slug: "guarantor-pan",
      label: "Guarantor – PAN Card",
      required: false,
      conditional: "If guarantor required",
    },
    {
      slug: "guarantor-aadhaar",
      label: "Guarantor – Aadhaar Card",
      required: false,
      conditional: "If guarantor required",
    },
    {
      slug: "guarantor-rc",
      label: "Guarantor – Vehicle RC",
      required: false,
      conditional: "If guarantor required",
    },
    { slug: "electricity-bill", label: "Electricity Bill", required: true },
    {
      slug: "bank-statement-6m",
      label: "6 Month Bank Statement (Till Date)",
      required: true,
    },
  ],
  "home-loan": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
    { slug: "photo", label: "Passport Size Photo", required: true },
    {
      slug: "itr-3yr",
      label: "3 Year ITR",
      description: "Last 3 years Income Tax Returns",
      required: false,
      conditional: "For self-employed",
    },
    {
      slug: "form16-salary-slips",
      label: "Form 16 + 3 Month Salary Slips",
      description: "Form 16 and last 3 months salary slips",
      required: false,
      conditional: "For salaried",
    },
    {
      slug: "bank-statement-1yr",
      label: "1 Year Bank Statement",
      required: true,
    },
    {
      slug: "property-papers",
      label: "Property Papers (Xerox)",
      description: "Photocopy of property documents",
      required: true,
    },
    {
      slug: "previous-loan-statement",
      label: "Previous Loan Statement",
      required: false,
      conditional: "For Balance Transfer (BT) cases only",
    },
    {
      slug: "sanction-letter",
      label: "Sanction Letter (Previous Bank)",
      required: false,
      conditional: "For Balance Transfer (BT) cases only",
    },
    {
      slug: "document-list",
      label: "List of Documents (Previous Bank)",
      required: false,
      conditional: "For Balance Transfer (BT) cases only",
    },
  ],
  "mortgage-loan": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
    { slug: "photo", label: "Passport Size Photo", required: true },
    {
      slug: "itr-3yr",
      label: "3 Year ITR",
      required: false,
      conditional: "For self-employed",
    },
    {
      slug: "form16-salary-slips",
      label: "Form 16 + 3 Month Salary Slips",
      required: false,
      conditional: "For salaried",
    },
    {
      slug: "bank-statement-1yr",
      label: "1 Year Bank Statement",
      required: true,
    },
    {
      slug: "property-papers",
      label: "Property Papers (Xerox)",
      required: true,
    },
  ],
  "business-loan": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
    { slug: "photo", label: "Passport Size Photo", required: true },
    {
      slug: "itr-3yr",
      label: "3 Year ITR with Business Financials",
      required: true,
    },
    { slug: "bank-statement-1yr", label: "1 Year Bank Statement", required: true },
    { slug: "electricity-bill", label: "Electricity Bill", required: true },
  ],
  "msme-loan": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
    { slug: "photo", label: "Passport Size Photo", required: true },
    {
      slug: "itr-2yr",
      label: "2 Year ITR with Business Financials",
      required: true,
    },
    {
      slug: "bank-statement-6m",
      label: "6 Month Bank Statement",
      required: true,
    },
    { slug: "electricity-bill", label: "Electricity Bill", required: true },
  ],
  "personal-loan": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
    { slug: "photo", label: "Passport Size Photo", required: true },
    {
      slug: "form16-salary-slips",
      label: "Form 16 + 3 Month Salary Slips",
      required: true,
    },
    {
      slug: "bank-statement-6m",
      label: "6 Month Bank Statement",
      required: true,
    },
    { slug: "electricity-bill", label: "Electricity Bill", required: true },
  ],
  "equipment-loan": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
    { slug: "photo", label: "Passport Size Photo", required: true },
    {
      slug: "vehicle-quotation",
      label: "Equipment Quotation",
      required: true,
    },
    {
      slug: "itr-2yr",
      label: "2 Year ITR or Business Financials",
      required: true,
    },
    {
      slug: "bank-statement-6m",
      label: "6 Month Bank Statement",
      required: true,
    },
    { slug: "electricity-bill", label: "Electricity Bill", required: true },
  ],
  "general-insurance": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
  ],
  "life-insurance": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
    { slug: "photo", label: "Passport Size Photo", required: true },
  ],
  "cc-od-limit": [
    { slug: "pan-card", label: "PAN Card", required: true },
    { slug: "aadhaar-card", label: "Aadhaar Card", required: true },
    { slug: "photo", label: "Passport Size Photo", required: true },
    { slug: "itr-2yr", label: "2 Year ITR with CA Certified Financials", required: true },
    { slug: "bank-statement-1yr", label: "1 Year Bank Statement", required: true },
    { slug: "electricity-bill", label: "Electricity Bill / Shop Act Licence", required: true },
  ],
};

export function getChecklist(loanType: LoanType): DocItem[] {
  return DOCUMENT_CHECKLISTS[loanType] ?? [];
}

export function formatChecklistAsWhatsApp(
  loanType: LoanType,
  leadName: string
): string {
  const items = getChecklist(loanType);
  const label = LOAN_TYPE_LABELS[loanType];
  const requiredItems = items.filter((i) => i.required);
  const conditionalItems = items.filter((i) => !i.required);

  let message = `📋 *Document Checklist – ${label}*\n`;
  message += `Hi ${leadName},\n\n`;
  message += `Please arrange the following documents for your ${label} application:\n\n`;
  message += `*Required Documents:*\n`;
  requiredItems.forEach((item, idx) => {
    message += `${idx + 1}. ${item.label}`;
    if (item.description) message += `\n   _(${item.description})_`;
    message += `\n`;
  });

  if (conditionalItems.length > 0) {
    message += `\n*Additional Documents (if applicable):*\n`;
    conditionalItems.forEach((item, idx) => {
      message += `${idx + 1}. ${item.label}`;
      if (item.conditional) message += ` _(${item.conditional})_`;
      message += `\n`;
    });
  }

  message += `\nPlease share these documents with us on WhatsApp.\n\n— Srivastava Associates\n📞 8306445333`;
  return message;
}
