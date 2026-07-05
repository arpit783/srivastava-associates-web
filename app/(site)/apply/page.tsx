"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import Link from "next/link";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    loanType: "" as LoanType | "",
    amount: "",
    city: "",
    income: "",
    employment: "",
    existingEmi: "",
    notes: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: form.amount ? Number(form.amount) * 100000 : undefined,
          source: "Website Form",
          notes: `Income: ₹${form.income}/mo | Employment: ${form.employment} | Existing EMI: ₹${form.existingEmi}/mo${form.notes ? ` | ${form.notes}` : ""}`,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-navy mb-3">Application Received!</h2>
          <p className="text-gray-500 mb-6">
            Thank you, {form.name}! Our team will review your application and call you
            within 2 working hours. You can also WhatsApp us for faster support.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/918306445333?text=${encodeURIComponent(`Hi, I just applied for a ${LOAN_TYPE_LABELS[form.loanType as LoanType] || form.loanType} on your website. My name is ${form.name}.`)}`}
              target="_blank"
              className="btn-primary justify-center"
            >
              Continue on WhatsApp
            </a>
            <Link href="/" className="text-gray-500 text-sm hover:text-navy transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="section-subtitle block mb-2">LOAN APPLICATION</span>
          <h1 className="section-title">Apply for a Loan</h1>
          <p className="text-gray-500 mt-2">Fill the form below and we'll get back to you within 2 hours.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${step >= s ? "bg-gold text-navy" : "bg-gray-200 text-gray-400"}`}>
                {s}
              </div>
              <div className={`text-sm font-medium flex-1 ${step >= s ? "text-navy" : "text-gray-400"}`}>
                {s === 1 ? "Basic Details" : "Loan Details"}
              </div>
              {s < 2 && <div className={`h-0.5 flex-1 ${step > s ? "bg-gold" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-navy mb-2">Personal Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Full Name *</label>
                  <input className="input-field" placeholder="Amit Sharma" value={form.name} onChange={(e) => set("name", e.target.value)} required />
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input className="input-field" placeholder="9876543210" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input-field" placeholder="amit@email.com" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="label">City *</label>
                  <input className="input-field" placeholder="Kota" value={form.city} onChange={(e) => set("city", e.target.value)} required />
                </div>
                <div className="col-span-2">
                  <label className="label">Employment Type</label>
                  <select className="input-field bg-white" value={form.employment} onChange={(e) => set("employment", e.target.value)}>
                    <option value="">Select type</option>
                    <option>Salaried</option>
                    <option>Self-Employed / Business</option>
                    <option>Farmer / Agriculture</option>
                    <option>Professional (Doctor/CA/Lawyer)</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <button type="button" onClick={() => form.name && form.phone ? setStep(2) : toast.error("Fill required fields")} className="btn-primary w-full justify-center">
                Next: Loan Details <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-navy mb-2">Loan Requirements</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Loan Type *</label>
                  <select className="input-field bg-white" value={form.loanType} onChange={(e) => set("loanType", e.target.value)} required>
                    <option value="">Select loan type</option>
                    {Object.entries(LOAN_TYPE_LABELS).map(([slug, label]) => (
                      <option key={slug} value={slug}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Loan Amount (in Lakhs)</label>
                  <input className="input-field" placeholder="25" type="number" min="1" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
                </div>
                <div>
                  <label className="label">Monthly Income (₹)</label>
                  <input className="input-field" placeholder="50000" type="number" value={form.income} onChange={(e) => set("income", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="label">Existing Monthly EMI (₹, if any)</label>
                  <input className="input-field" placeholder="0" type="number" value={form.existingEmi} onChange={(e) => set("existingEmi", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="label">Additional Notes</label>
                  <textarea className="input-field resize-none" rows={3} placeholder="Any specific requirements, property location, etc." value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-lg font-medium hover:border-navy transition-colors">
                  Back
                </button>
                <button type="submit" disabled={loading || !form.loanType} className="flex-1 btn-primary justify-center disabled:opacity-50">
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
