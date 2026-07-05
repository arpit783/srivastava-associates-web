import Link from "next/link";
import Image from "next/image";
import { Award, Users, Building2, Shield, CheckCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Srivastava Associates — trusted loan consultants since 1998. Meet the team behind 1000+ successful loan disbursals in Kota, Rajasthan.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-navy py-16 px-4 text-center">
        <span className="text-gold text-sm font-semibold tracking-widest uppercase">Our Story</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-3 mb-3">About Srivastava Associates</h1>
        <p className="text-gray-300 max-w-xl mx-auto">Trusted financial advisors since 1998, helping thousands of families and businesses in Rajasthan achieve their dreams through the right loans.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold text-navy mb-4">Our Journey Since 1998</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Srivastava Associates was founded in 1998 with a simple vision: to make quality financial services accessible to every person in Rajasthan — whether a salaried employee dreaming of their first home, a farmer needing a tractor, or an entrepreneur wanting to expand their business.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Over 25 years, we have grown from a small advisory firm to a trusted financial partner with tie-ups across 30+ banks and NBFCs, helping 1000+ clients get the right loan at the right rate.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Award, label: "25+ Years", sub: "of trusted service" },
              { icon: Users, label: "1000+", sub: "happy clients" },
              { icon: Building2, label: "30+", sub: "bank tie-ups" },
              { icon: Shield, label: "100%", sub: "transparent" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="bg-gray-50 rounded-2xl p-5 text-center">
                <Icon className="w-8 h-8 text-gold mx-auto mb-2" />
                <div className="text-xl font-bold text-navy">{label}</div>
                <div className="text-xs text-gray-500">{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <h2 className="text-2xl font-bold text-navy mb-8 text-center">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            {
              name: "Suresh Srivastava",
              role: "Founder & Senior Advisor",
              exp: "25+ years in financial advisory. Deep expertise in home loans, business loans, and MSME finance.",
              img: "/images/suresh-srivastava-cut.png",
              bg: "bg-gradient-to-b from-blue-50 to-slate-100",
            },
            {
              name: "Shashank Srivastava",
              role: "Lead Financial Consultant",
              exp: "Expert in vehicle loans, equipment finance, and insurance products. Handles 30+ bank relationships.",
              img: "/images/shashank-srivastava-cut.png",
              bg: "bg-gradient-to-b from-navy/5 to-navy/10",
            },
          ].map((person) => (
            <div key={person.name} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className={`relative h-80 w-full ${person.bg} flex items-end justify-center`}>
                <Image
                  src={person.img}
                  alt={person.name}
                  fill
                  className="object-contain object-bottom drop-shadow-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <div className="font-bold text-navy text-lg">{person.name}</div>
                <div className="text-gold text-sm font-semibold mb-2">{person.role}</div>
                <p className="text-gray-600 text-sm">{person.exp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <h2 className="text-2xl font-bold text-navy mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {[
            { title: "Transparency", desc: "No hidden charges, no surprises. Every step of the process is communicated clearly." },
            { title: "Client First", desc: "Your financial success is our success. We always recommend what's best for your situation." },
            { title: "Expert Guidance", desc: "25+ years of expertise means we know which bank, which scheme, and which product is right for you." },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-2xl p-6 text-center">
              <CheckCircle className="w-8 h-8 text-gold mx-auto mb-3" />
              <h3 className="font-bold text-navy mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-navy rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Work With Us?</h2>
          <p className="text-gray-400 mb-6">Let's find the right financial solution for your needs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:8306445333" className="btn-primary"><Phone className="w-5 h-5" /> 8306445333</a>
            <Link href="/apply" className="btn-outline">Apply Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
