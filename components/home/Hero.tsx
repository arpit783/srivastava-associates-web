"use client";

import Link from "next/link";
import { ArrowRight, Shield, Award, Users } from "lucide-react";
import CallbackModal from "@/components/ui/CallbackModal";
import { useState } from "react";

export default function Hero() {
  const [callbackOpen, setCallbackOpen] = useState(false);
  const waLink = "https://wa.me/message/FMB4BVPRQLMUC1";

  return (
    <section className="relative bg-navy min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-4 items-center overflow-visible">
          {/* Left */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 text-gold text-sm mb-6">
              <Shield className="w-4 h-4" /> Trusted Since 1998
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              Making Your{" "}
              <span className="text-gold">Dreams</span>{" "}
              Possible
            </h1>
            <p className="text-xl text-gray-300 font-light mb-8">
              Easy Loan, Happy Life
            </p>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-lg">
              Srivastava Associates is Kota&apos;s most trusted loan consultancy.
              We connect you with 30+ banks & NBFCs for the best rates on Home
              Loans, Car Loans, Business Loans, and more.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { icon: Award, label: "Since 1998", sub: "25+ Years" },
                { icon: Shield, label: "Bank Tie-ups", sub: "30+ Banks" },
                { icon: Users, label: "Happy Clients", sub: "1000+" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{sub}</div>
                    <div className="text-gray-400 text-xs">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loan type tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {["Home Loan", "Business Loan", "Car Loan", "Personal Loan", "More"].map((t) => (
                <span
                  key={t}
                  className="text-xs bg-navy-800 border border-navy-700 text-gray-300 px-3 py-1.5 rounded-full hover:border-gold hover:text-gold cursor-pointer transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/apply"
                className="btn-primary text-base shadow-lg shadow-gold/20"
              >
                APPLY NOW <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border-2 border-[#25D366] text-[#25D366] font-semibold px-6 py-3 rounded-lg hover:bg-[#25D366] hover:text-white transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WHATSAPP US
              </a>
              <button
                onClick={() => setCallbackOpen(true)}
                className="text-gray-300 underline underline-offset-2 text-sm hover:text-gold transition-colors"
              >
                Request a Callback
              </button>
            </div>
          </div>

          {/* Right — combined founders image (background removed) */}
          <div className="hidden lg:block relative -mr-8" style={{ width: "130%", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/founders-nobg.png"
              alt="Shashank Srivastava & Suresh Srivastava — Srivastava Associates"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </section>
  );
}
