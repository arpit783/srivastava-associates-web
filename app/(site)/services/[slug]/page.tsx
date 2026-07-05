import { notFound } from "next/navigation";
import Link from "next/link";
import { LOAN_TYPE_LABELS, LoanType, getChecklist } from "@/lib/document-checklists";
import { CheckCircle, ArrowRight, Phone } from "lucide-react";
import type { Metadata } from "next";

const SLUG_MAP: Record<string, LoanType> = {
  "home-loan": "home-loan", "mortgage-loan": "mortgage-loan",
  "business-loan": "business-loan", "new-car-loan": "new-car-loan",
  "used-car-loan": "used-car-loan", "msme-loan": "msme-loan",
  "personal-loan": "personal-loan", "cc-od-limit": "cc-od-limit",
  "hcv-loan": "hcv-loan", "used-hcv-loan": "used-hcv-loan",
  "equipment-loan": "equipment-loan", "general-insurance": "general-insurance",
  "life-insurance": "life-insurance",
};

const SERVICE_DESCRIPTIONS: Record<LoanType, { tagline: string; description: string; benefits: string[] }> = {
  "home-loan": {
    tagline: "Make your dream home a reality",
    description: "Get the best home loan rates from 30+ banks and NBFCs. Whether it's buying a new home, constructing your own, or transferring your existing home loan, we ensure you get the best deal.",
    benefits: ["Lowest interest rates from 8.5% p.a.", "Loan tenure up to 30 years", "Up to 90% of property value", "Quick approval in 5-7 days", "Balance transfer with top-up available"],
  },
  "mortgage-loan": {
    tagline: "Unlock the value of your property",
    description: "Loan Against Property (Mortgage Loan) helps you leverage your existing property to meet your financial needs — business expansion, education, medical emergencies, or any personal requirement.",
    benefits: ["Up to 60-70% of property value", "Lower interest than personal loans", "Flexible repayment tenure", "Residential & commercial property accepted", "Quick processing"],
  },
  "business-loan": {
    tagline: "Fuel your business growth",
    description: "Whether you need working capital, want to expand operations, or buy equipment — our business loan solutions from top banks and NBFCs give your business the fuel it needs.",
    benefits: ["Collateral-free options available", "Quick disbursal for urgent needs", "Flexible EMI options", "Multiple lenders for best rates", "Dedicated relationship manager"],
  },
  "new-car-loan": {
    tagline: "Drive your dream car today",
    description: "Get a new car loan at the best interest rates. We compare offers from 15+ banks to ensure you get the lowest EMI and fastest approval for your dream car.",
    benefits: ["Up to 100% on-road price financing", "Attractive interest rates from 8.5%", "Tenure up to 7 years", "Fast approval in 24-48 hours", "Doorstep service available"],
  },
  "used-car-loan": {
    tagline: "Quality vehicles at affordable EMIs",
    description: "Finance your pre-owned vehicle purchase with our used car loan solutions. We help you get financing for quality second-hand vehicles at competitive rates.",
    benefits: ["Finance up to 85% of vehicle value", "Competitive interest rates", "Tenure up to 5 years", "Quick evaluation and approval", "All car models accepted"],
  },
  "hcv-loan": {
    tagline: "Power your transport business",
    description: "Finance your new commercial vehicle — trucks, buses, tankers — with our HCV loan solutions designed specifically for transport entrepreneurs.",
    benefits: ["Finance for all major truck brands", "Up to 90% of vehicle cost", "Flexible repayment options", "Fast approvals for fleet owners", "New & established operators welcome"],
  },
  "used-hcv-loan": {
    tagline: "Grow your fleet affordably",
    description: "Finance pre-owned heavy commercial vehicles to grow your transport business without the premium price tag of new vehicles.",
    benefits: ["Finance for quality used HCVs", "Competitive interest rates", "Flexible tenure options", "Quick vehicle evaluation", "All transport types covered"],
  },
  "msme-loan": {
    tagline: "Empowering small business growth",
    description: "MSME loans designed for small and medium enterprises to access credit for machinery, inventory, working capital, and business expansion under government schemes.",
    benefits: ["Under MUDRA and other govt. schemes", "Interest subvention available", "Collateral-free options", "Quick processing for MSME registered units", "Working capital & term loans"],
  },
  "personal-loan": {
    tagline: "For every personal need",
    description: "Quick personal loans for salaried individuals. Whether it's a wedding, travel, medical emergency, or home renovation — we get you funded fast.",
    benefits: ["Quick disbursal in 24-48 hours", "No collateral required", "Flexible tenure 1-5 years", "Attractive rates for good CIBIL", "Minimum documentation"],
  },
  "cc-od-limit": {
    tagline: "Working capital on demand",
    description: "Cash Credit and Overdraft limits give your business ready access to working capital. Draw funds as needed and pay interest only on the amount used.",
    benefits: ["Revolving credit facility", "Interest only on drawn amount", "Linked to current account", "Suitable for trading & manufacturing", "Competitive rates from leading banks"],
  },
  "equipment-loan": {
    tagline: "Finance your machinery and equipment",
    description: "Purchase machinery, equipment, and tools for your business with our equipment financing solutions from top banks and NBFCs.",
    benefits: ["Up to 80-90% of equipment cost", "Competitive interest rates", "Tenure up to 5 years", "All equipment types covered", "Tie-ups with major manufacturers"],
  },
  "general-insurance": {
    tagline: "Protect what matters most",
    description: "Comprehensive general insurance solutions — vehicle insurance, property insurance, health insurance, and more from leading insurance companies.",
    benefits: ["All major insurance companies", "Quick policy issuance", "Competitive premiums", "Claims assistance", "Renewal reminders"],
  },
  "life-insurance": {
    tagline: "Secure your family's future",
    description: "Life insurance plans from leading companies to secure your family's financial future. Term plans, endowment plans, ULIPs, and more.",
    benefits: ["Term plans with high coverage", "Investment-linked plans", "Tax benefits under 80C", "Competitive premiums", "Claim settlement assistance"],
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const loanType = SLUG_MAP[params.slug];
  if (!loanType) return {};
  const label = LOAN_TYPE_LABELS[loanType];
  return {
    title: `${label} in Kota, Rajasthan`,
    description: `Best ${label} in Kota with lowest interest rates. 30+ banks & NBFCs. Expert guidance by Srivastava Associates.`,
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const loanType = SLUG_MAP[params.slug];
  if (!loanType) notFound();

  const label = LOAN_TYPE_LABELS[loanType];
  const info = SERVICE_DESCRIPTIONS[loanType];
  const checklist = getChecklist(loanType);
  const waMsg = encodeURIComponent(`Hi, I'm interested in a ${label}. Can you help me?`);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="bg-navy py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Our Services</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-3 mb-4">{label}</h1>
          <p className="text-gray-300 text-lg mb-8">{info.tagline}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/apply" className="btn-primary">Apply Now <ArrowRight className="w-5 h-5" /></Link>
            <a href={`https://wa.me/918306445333?text=${waMsg}`} target="_blank"
              className="flex items-center gap-2 border-2 border-[#25D366] text-[#25D366] font-semibold px-6 py-3 rounded-lg hover:bg-[#25D366] hover:text-white transition-all">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-navy mb-4">About {label}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{info.description}</p>
            <h3 className="font-bold text-navy mb-3">Key Benefits</h3>
            <ul className="space-y-3">
              {info.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {checklist.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-navy mb-4">Documents Required</h3>
                <ul className="space-y-2">
                  {checklist.map((doc) => (
                    <li key={doc.slug} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${doc.required ? "bg-gold" : "bg-gray-300"}`} />
                      <span>{doc.label}{doc.conditional ? ` (${doc.conditional})` : ""}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/apply" className="btn-primary mt-5 w-full justify-center text-sm">
                  Apply for {label} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 bg-navy rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Apply?</h2>
          <p className="text-gray-400 mb-6">Call us now or WhatsApp — our team will guide you step by step.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:8306445333" className="flex items-center gap-2 bg-gold text-navy font-bold px-6 py-3 rounded-lg hover:bg-gold-400 transition-colors">
              <Phone className="w-5 h-5" /> Call 8306445333
            </a>
            <Link href="/apply" className="btn-outline">Apply Online</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(SLUG_MAP).map((slug) => ({ slug }));
}
