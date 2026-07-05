import LoanProcess from "@/components/home/LoanProcess";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loan Process",
  description: "Simple 5-step loan process at Srivastava Associates. From document submission to loan disbursal — we make it smooth and transparent.",
};

export default function LoanProcessPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-navy py-16 px-4 text-center">
        <span className="text-gold text-sm font-semibold tracking-widest uppercase">How It Works</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-3 mb-3">Our Loan Process</h1>
        <p className="text-gray-300 max-w-xl mx-auto">Simple, transparent, and fast. From your first enquiry to loan disbursal — here's how we work.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <LoanProcess />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-navy mb-4">Ready to start?</h2>
        <Link href="/apply" className="btn-primary inline-flex">
          Apply Now <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
