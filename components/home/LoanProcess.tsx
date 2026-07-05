import { Upload, CheckCircle, Building, ThumbsUp, Banknote, ArrowRight } from "lucide-react";

const STEPS = [
  { icon: Upload, title: "Share Documents", desc: "Share your basic documents with us via WhatsApp or our portal" },
  { icon: CheckCircle, title: "Eligibility Check", desc: "We check your eligibility with multiple banks & NBFCs" },
  { icon: Building, title: "Best Bank Selection", desc: "We select the best bank with lowest interest rate for you" },
  { icon: ThumbsUp, title: "Loan Approval", desc: "Quick approval & sanction from the selected bank" },
  { icon: Banknote, title: "Loan Disbursement", desc: "Loan disbursed to your account on time, hassle-free" },
];

export default function LoanProcess() {
  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-20 bg-gold" />
            <span className="section-subtitle">OUR LOAN PROCESS</span>
            <div className="h-px flex-1 max-w-20 bg-gold" />
          </div>
          <h2 className="section-title">Simple 5-Step Process</h2>
          <p className="text-gray-500 mt-3">
            From application to disbursement — we make it smooth and transparent.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-gold/20 via-gold to-gold/20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {STEPS.map(({ icon: Icon, title, desc }, idx) => (
              <div key={title} className="relative text-center group">
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gold text-navy rounded-full text-xs font-bold flex items-center justify-center z-10">
                  {idx + 1}
                </div>

                <div className="w-20 h-20 bg-navy/5 group-hover:bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-4 transition-colors border-2 border-transparent group-hover:border-gold/30">
                  <Icon className="w-9 h-9 text-navy group-hover:text-gold transition-colors" />
                </div>

                <h3 className="font-bold text-navy text-sm mb-2">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>

                {idx < STEPS.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-14 -right-4 w-5 h-5 text-gold/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
