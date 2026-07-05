import EMICalculator from "@/components/calculators/EMICalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EMI Calculator",
  description: "Calculate your loan EMI, check eligibility, compare loan scenarios, and view amortization schedule. Free tool by Srivastava Associates.",
};

export default function EMICalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="section-subtitle block mb-2">FINANCIAL TOOLS</span>
          <h1 className="section-title">EMI Calculator</h1>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Plan your loan smartly. Calculate EMI, check eligibility, compare scenarios,
            and view month-by-month amortization schedule.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <EMICalculator />
        </div>
      </div>
    </div>
  );
}
