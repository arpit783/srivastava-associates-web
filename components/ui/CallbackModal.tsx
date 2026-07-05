"use client";

import { useState } from "react";
import { X, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CallbackModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    loanType: "" as LoanType | "",
    preferredTime: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/callbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Callback scheduled! We'll call you at your preferred time.");
        onClose();
        setForm({ name: "", phone: "", loanType: "", preferredTime: "", city: "" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-navy rounded-t-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="text-white font-bold">Request a Callback</h3>
              <p className="text-gray-400 text-xs">We'll call you within 2 hours</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input
              className="input-field"
              placeholder="Amit Sharma"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">Phone Number *</label>
            <input
              className="input-field"
              placeholder="9876543210"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">Loan Type *</label>
            <select
              className="input-field bg-white"
              value={form.loanType}
              onChange={(e) => setForm((f) => ({ ...f, loanType: e.target.value as LoanType }))}
              required
            >
              <option value="">Select loan type</option>
              {Object.entries(LOAN_TYPE_LABELS).map(([slug, label]) => (
                <option key={slug} value={slug}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Preferred Call Time</label>
            <select
              className="input-field bg-white"
              value={form.preferredTime}
              onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))}
            >
              <option value="">Anytime during business hours</option>
              <option>Morning (9 AM – 12 PM)</option>
              <option>Afternoon (12 PM – 3 PM)</option>
              <option>Evening (3 PM – 7 PM)</option>
            </select>
          </div>
          <div>
            <label className="label">City</label>
            <input
              className="input-field"
              placeholder="Kota"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-50 mt-2"
          >
            {loading ? "Scheduling..." : "Schedule Callback"}
          </button>
        </form>
      </div>
    </div>
  );
}
