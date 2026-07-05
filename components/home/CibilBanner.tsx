import Link from "next/link";
import { TrendingUp, CheckCircle, ArrowRight, ExternalLink } from "lucide-react";

const SCORE_RANGES = [
  { range: "300–549", label: "Poor", color: "bg-red-500", width: "w-[20%]" },
  { range: "550–649", label: "Fair", color: "bg-orange-400", width: "w-[15%]" },
  { range: "650–749", label: "Good", color: "bg-yellow-400", width: "w-[20%]" },
  { range: "750–849", label: "Very Good", color: "bg-lime-500", width: "w-[20%]" },
  { range: "850–900", label: "Excellent", color: "bg-green-500", width: "w-[25%]" },
];

export default function CibilBanner() {
  return (
    <section className="py-16 bg-gradient-to-br from-navy via-navy-900 to-[#0d2451]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — info */}
          <div>
            <span className="inline-flex items-center gap-2 text-gold text-sm font-semibold tracking-widest uppercase mb-4">
              <TrendingUp className="w-4 h-4" /> Free Credit Health Check
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Know Your CIBIL Score<br />
              <span className="text-gold">Before Applying for a Loan</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Your CIBIL score determines your loan eligibility and interest rate.
              Check it for free — it won&apos;t impact your score — and let us help
              you get the best deal based on your credit profile.
            </p>

            {/* Score bar */}
            <div className="mb-6">
              <div className="flex rounded-full overflow-hidden h-3 mb-2">
                {SCORE_RANGES.map((s) => (
                  <div key={s.range} className={`${s.color} ${s.width} h-full`} />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>300</span>
                <span>549</span>
                <span>649</span>
                <span>749</span>
                <span>849</span>
                <span>900</span>
              </div>
              <div className="flex gap-4 mt-3 flex-wrap">
                {SCORE_RANGES.map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span className="text-xs text-gray-400">{s.label} ({s.range})</span>
                  </div>
                ))}
              </div>
            </div>

            <ul className="space-y-2 mb-8">
              {[
                "100% free — no credit card required",
                "Does not affect your CIBIL score",
                "Get personalised loan advice based on your score",
                "750+ score? Get lowest interest rates",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/credit-score"
                className="btn-primary text-base shadow-lg shadow-gold/20"
              >
                Check My CIBIL Score <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://myscore.cibil.com/CreditView/login.page"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-gray-600 text-gray-300 hover:border-gold hover:text-gold px-5 py-3 rounded-lg text-sm font-medium transition-all"
              >
                Go to CIBIL Directly <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right — score card visual */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-gold/10 rounded-3xl blur-2xl scale-110" />
              <div className="relative bg-navy-800 border border-navy-700 rounded-3xl p-8 w-72 text-center shadow-2xl">
                <div className="text-gray-400 text-sm mb-2">Your CIBIL Score</div>
                {/* Gauge-style display */}
                <div className="relative w-44 h-24 mx-auto mb-4">
                  <svg viewBox="0 0 200 110" className="w-full">
                    {/* Background arc */}
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e3a6e" strokeWidth="16" strokeLinecap="round" />
                    {/* Gold arc — 750 score = ~75% */}
                    <path d="M 20 100 A 80 80 0 0 1 156 38" fill="none" stroke="#C9A227" strokeWidth="16" strokeLinecap="round" />
                    {/* Needle dot */}
                    <circle cx="156" cy="38" r="8" fill="#C9A227" />
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 text-center">
                    <span className="text-4xl font-extrabold text-gold">750</span>
                    <span className="text-gray-400 text-xs block">example score</span>
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold rounded-xl px-4 py-2 mb-5">
                  Excellent — Loan Ready!
                </div>
                <div className="space-y-2 text-left text-xs">
                  {[
                    { label: "Home Loan Eligibility", val: "High ✓" },
                    { label: "Best Interest Rate", val: "~8.5% p.a." },
                    { label: "Approval Chances", val: "Very High" },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between text-gray-400">
                      <span>{label}</span>
                      <span className="text-gold font-medium">{val}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/credit-score"
                  className="mt-5 block w-full bg-gold text-navy font-bold text-sm py-2.5 rounded-xl hover:bg-gold-400 transition-colors text-center"
                >
                  Check My Score Free →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
