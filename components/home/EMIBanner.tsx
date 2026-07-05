import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";

export default function EMIBanner() {
  return (
    <section className="py-16 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Calculator className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Calculate Your EMI
              </h2>
              <p className="text-gray-400 mt-1">
                Plan your loan with our easy EMI Calculator & check your monthly instalments.
              </p>
            </div>
          </div>
          <Link href="/emi-calculator" className="btn-primary whitespace-nowrap flex-shrink-0">
            CALCULATE EMI <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
