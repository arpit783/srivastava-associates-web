import { DocSlug } from "./document-checklists";

interface MatchRule {
  slugs: DocSlug[];
  keywords: string[];
}

const MATCH_RULES: MatchRule[] = [
  {
    slugs: ["pan-card"],
    keywords: ["pan card", "pan", "income tax card", "pan number", "pancard"],
  },
  {
    slugs: ["aadhaar-card"],
    keywords: [
      "aadhar",
      "aadhaar",
      "adhar",
      "aadhar card",
      "aadhaar card",
      "uid",
      "unique id",
    ],
  },
  {
    slugs: ["photo"],
    keywords: [
      "photo",
      "photograph",
      "passport photo",
      "passport size",
      "pic",
      "picture",
      "image",
      "फोटो",
    ],
  },
  {
    slugs: ["car-quotation", "vehicle-quotation"],
    keywords: [
      "quotation",
      "quote",
      "car quote",
      "vehicle quote",
      "quotation of car",
      "कोटेशन",
    ],
  },
  {
    slugs: ["itr-2yr", "itr-3yr"],
    keywords: [
      "itr",
      "income tax return",
      "income tax",
      "tax return",
      "it return",
      "itr2",
      "itr3",
      "आयकर",
    ],
  },
  {
    slugs: ["agriculture-copy"],
    keywords: [
      "agriculture",
      "agri",
      "kisan",
      "farm",
      "agricultural",
      "किसान",
      "कृषि",
    ],
  },
  {
    slugs: ["electricity-bill"],
    keywords: [
      "electricity",
      "electric bill",
      "light bill",
      "bijli",
      "bijli bill",
      "electricity bill",
      "बिजली",
    ],
  },
  {
    slugs: ["bank-statement-6m", "bank-statement-1yr"],
    keywords: [
      "bank statement",
      "statement",
      "passbook",
      "bank passbook",
      "account statement",
      "बैंक स्टेटमेंट",
    ],
  },
  {
    slugs: ["rc"],
    keywords: ["rc", "registration certificate", "vehicle registration", "rc book", "आर सी"],
  },
  {
    slugs: ["driving-licence"],
    keywords: [
      "driving licence",
      "driving license",
      "dl",
      "licence",
      "license",
      "ड्राइविंग लाइसेंस",
    ],
  },
  {
    slugs: ["property-papers"],
    keywords: [
      "property",
      "property papers",
      "property document",
      "land document",
      "registry",
      "sale deed",
      "जमीन",
      "संपत्ति",
    ],
  },
  {
    slugs: ["form16-salary-slips"],
    keywords: [
      "form 16",
      "form16",
      "salary slip",
      "salary",
      "pay slip",
      "payslip",
      "सैलरी",
    ],
  },
  {
    slugs: ["sanction-letter"],
    keywords: [
      "sanction letter",
      "sanction",
      "approval letter",
      "loan approval",
      "स्वीकृति पत्र",
    ],
  },
];

export function matchDocumentFromCaption(
  caption: string
): DocSlug | null {
  if (!caption) return null;
  const lower = caption.toLowerCase().trim();

  for (const rule of MATCH_RULES) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword)) {
        return rule.slugs[0];
      }
    }
  }
  return null;
}

export function getFileExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
    "image/heic": "heic",
  };
  return map[mimeType] || "bin";
}
