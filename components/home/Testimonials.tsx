"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Amit Sharma",
    loanType: "Home Loan",
    rating: 5,
    text: "Very professional and supportive team. Got my home loan at the best rate. Highly recommended! The entire process was smooth and transparent.",
    initials: "AS",
  },
  {
    name: "Rohit Verma",
    loanType: "Business Loan",
    rating: 5,
    text: "They helped me get business loan quickly. Transparent process and great documentation support. Suresh ji guided me through every step.",
    initials: "RV",
  },
  {
    name: "Neha Singh",
    loanType: "Car Loan",
    rating: 5,
    text: "Excellent service! Got the best car loan with minimum documentation. The team was responsive and got my loan approved in just 3 days!",
    initials: "NS",
  },
  {
    name: "Rajesh Kumar",
    loanType: "MSME Loan",
    rating: 5,
    text: "Srivastava Associates helped my business grow with the right MSME loan. Their knowledge of various bank schemes is excellent.",
    initials: "RK",
  },
  {
    name: "Priya Jain",
    loanType: "Mortgage Loan",
    rating: 5,
    text: "Got the best interest rate for my mortgage loan. The team's expertise in documentation saved me a lot of time. Truly professional service.",
    initials: "PJ",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);

  const visible = [
    TESTIMONIALS[current],
    TESTIMONIALS[(current + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(current + 2) % TESTIMONIALS.length],
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-20 bg-gold" />
            <span className="section-subtitle">WHAT OUR CLIENTS SAY</span>
            <div className="h-px flex-1 max-w-20 bg-gold" />
          </div>
          <h2 className="section-title">1000+ Happy Clients</h2>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visible.map((t, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-7 shadow-sm border transition-all duration-300 ${
                  i === 0 ? "border-gold/40 shadow-gold/10" : "border-gray-100"
                }`}
              >
                <Quote className="w-8 h-8 text-gold/30 mb-4" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gold font-bold text-sm">{t.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.loanType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-gold w-6" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
