"use client";

import { useState } from "react";
import { ArrowRight, Shield, Star, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import type { Metadata } from "next";

export default function CreditScorePage() {
  const [form, setForm] = useState({ name: "", phone: "", pan: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/callbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          loanType: "credit-score-check",
          source: "credit-score-page",
          preferredTime: "N/A",
          city: "N/A",
        }),
      });
      setDone(true);
      setTimeout(() => {
        window.open("https://myscore.cibil.com/CreditView/login.page", "_blank");
      }, 1500);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left info */}
          <div>
            <span className="section-subtitle block mb-3">FREE TOOL</span>
            <h1 className="section-title mb-4">Check Your CIBIL Score Free</h1>
            <p className="text-gray-500 mb-6">
              Your CIBIL score is one of the most important factors in loan approval.
              Check it for free — it won&apos;t affect your score!
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Completely free, no credit card needed",
                "Does NOT lower your CIBIL score",
                "Instant result via official CIBIL portal",
                "Helps us suggest the best loan for you",
                "Score above 750 gets the best interest rates",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-navy rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Score Guide</div>
                  <div className="text-gray-400 text-xs">What does your score mean?</div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { range: "750 – 900", label: "Excellent", color: "bg-green-500" },
                  { range: "700 – 749", label: "Good", color: "bg-blue-500" },
                  { range: "650 – 699", label: "Fair", color: "bg-yellow-500" },
                  { range: "300 – 649", label: "Poor", color: "bg-red-500" },
                ].map((s) => (
                  <div key={s.range} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.color}`} />
                    <span className="text-gray-300 text-xs w-24">{s.range}</span>
                    <span className="text-gray-400 text-xs">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right form */}
          <div>
            {done ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-navy mb-3">Redirecting to CIBIL...</h2>
                <p className="text-gray-500 text-sm mb-6">
                  We&apos;ve saved your details. You&apos;re being redirected to the official
                  CIBIL portal to check your score for free.
                </p>
                <a
                  href="https://myscore.cibil.com/CreditView/login.page"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary justify-center w-full"
                >
                  Open CIBIL Portal <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h2 className="font-bold text-navy">Quick Details</h2>
                    <p className="text-gray-400 text-xs">We&apos;ll help you understand your score</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input className="input-field" placeholder="Amit Sharma"
                      value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="label">Mobile Number *</label>
                    <input className="input-field" placeholder="9876543210" type="tel"
                      value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="label">PAN Number (optional)</label>
                    <input className="input-field uppercase" placeholder="ABCDE1234F"
                      value={form.pan} onChange={(e) => setForm((f) => ({ ...f, pan: e.target.value.toUpperCase() }))} />
                    <p className="text-xs text-gray-400 mt-1">Optional — helps us provide better loan suggestions</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
                    <Shield className="w-3 h-3 inline mr-1 text-gold" />
                    Your data is 100% secure and will only be used to help you with your loan requirements.
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
                    {loading ? "Processing..." : "Check My CIBIL Score Free"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
