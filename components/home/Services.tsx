import Link from "next/link";
import {
  Home,
  Building2,
  Briefcase,
  Car,
  Truck,
  UserCheck,
  CreditCard,
  Wrench,
  Shield,
  Heart,
  Factory,
  ArrowRight,
} from "lucide-react";

const SERVICES = [
  { icon: Home, label: "Home Loan", href: "/services/home-loan", desc: "Best rates for your dream home" },
  { icon: Building2, label: "Mortgage Loan", href: "/services/mortgage-loan", desc: "Loan Against Property" },
  { icon: Briefcase, label: "Business Loan", href: "/services/business-loan", desc: "Grow your business" },
  { icon: CreditCard, label: "CC / OD Limit", href: "/services/cc-od-limit", desc: "Cash Credit / Overdraft" },
  { icon: Factory, label: "MSME Loan", href: "/services/msme-loan", desc: "For small & medium enterprises" },
  { icon: UserCheck, label: "Personal Loan", href: "/services/personal-loan", desc: "Quick personal finance" },
  { icon: Car, label: "New Car Loan", href: "/services/new-car-loan", desc: "Drive your dream car" },
  { icon: Car, label: "Used Car Loan", href: "/services/used-car-loan", desc: "Pre-owned vehicle finance" },
  { icon: Truck, label: "Commercial Vehicle", href: "/services/hcv-loan", desc: "HCV & transport loans" },
  { icon: Wrench, label: "Equipment Loan", href: "/services/equipment-loan", desc: "Machinery & equipment finance" },
  { icon: Shield, label: "General Insurance", href: "/services/general-insurance", desc: "Protect your assets" },
  { icon: Heart, label: "Life Insurance", href: "/services/life-insurance", desc: "Secure your family's future" },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-20 bg-gold" />
            <span className="section-subtitle text-gold">OUR SERVICES</span>
            <div className="h-px flex-1 max-w-20 bg-gold" />
          </div>
          <h2 className="section-title">Loan Solutions for Every Need</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            From home loans to commercial vehicle finance, we have the right solution
            for you with 30+ banking partners.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {SERVICES.map(({ icon: Icon, label, href, desc }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-navy/5 group-hover:bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <Icon className="w-7 h-7 text-navy group-hover:text-gold transition-colors" />
              </div>
              <h3 className="font-semibold text-navy text-sm group-hover:text-gold transition-colors">
                {label}
              </h3>
              <p className="text-gray-400 text-xs mt-1">{desc}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/services/home-loan" className="btn-outline">
            VIEW ALL SERVICES <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
