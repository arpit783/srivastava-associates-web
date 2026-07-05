import { Award, Building2, FileSearch, User, Eye } from "lucide-react";

const REASONS = [
  {
    icon: Award,
    title: "25+ Years of Experience",
    desc: "Trusted since 1993 for reliable financial advising. Our expertise helps you get the best loan deals.",
  },
  {
    icon: Building2,
    title: "30+ Banks & NBFC Tie-ups",
    desc: "Get the best options from leading banks & NBFCs. We compare to find you the lowest interest rates.",
  },
  {
    icon: FileSearch,
    title: "Expert Document Analysis",
    desc: "We analyse your documents carefully for maximum approval chances. No surprises during processing.",
  },
  {
    icon: User,
    title: "Personalised Solutions",
    desc: "Customised loan solutions as per your needs & eligibility. Your financial situation is unique.",
  },
  {
    icon: Eye,
    title: "Transparent Process",
    desc: "Complete transparency at every step with no hidden charges. What you see is what you get.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-20 bg-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gold rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gold rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-20 bg-gold" />
            <span className="text-gold font-semibold text-sm tracking-widest uppercase">WHY CHOOSE US?</span>
            <div className="h-px flex-1 max-w-20 bg-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Why Srivastava Associates?
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            Over 25 years of trust, expertise, and results. Here&apos;s why 1000+
            clients choose us for their loan needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-navy-800 border border-navy-700 rounded-2xl p-6 text-center hover:border-gold/50 hover:bg-navy-700 transition-all group"
            >
              <div className="w-14 h-14 bg-gold/10 group-hover:bg-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <Icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
