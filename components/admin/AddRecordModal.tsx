"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import toast from "react-hot-toast";

interface Props { open: boolean; onClose: () => void; onSaved: () => void; }

export default function AddRecordModal({ open, onClose, onSaved }: Props) {
  const [type, setType] = useState<"lead" | "customer">("lead");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", loanType: "" as LoanType | "",
    amount: "", city: "", source: "Manual Entry",
    bankName: "", loanAccountNumber: "", disbursementDate: "",
    emiAmount: "", tenure: "", notes: "",
    referrerName: "", referrerPhone: "",
  });

  const isReferral = form.source === "Referral" || form.source === "Existing Customer Referral";
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    if (!form.name || !form.phone || !form.loanType) { toast.error("Name, phone & loan type required"); return; }
    if (isReferral && !form.referrerName) { toast.error("Referrer name is required"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          recordType: type,
          amount: form.amount ? Number(form.amount) : undefined,
          emiAmount: form.emiAmount ? Number(form.emiAmount) : undefined,
          tenure: form.tenure ? Number(form.tenure) : undefined,
        }),
      });
      if (res.ok) { toast.success("Record created!"); onSaved(); }
      else { toast.error("Failed to create record"); }
    } finally { setLoading(false); }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-navy rounded-t-2xl p-5 flex items-center justify-between sticky top-0">
          <h3 className="text-white font-bold">Add New Record</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2">
            <button onClick={() => setType("lead")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${type === "lead" ? "bg-navy text-white" : "bg-gray-100 text-gray-600"}`}>Lead</button>
            <button onClick={() => setType("customer")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${type === "customer" ? "bg-navy text-white" : "bg-gray-100 text-gray-600"}`}>Existing Customer</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="label">Full Name *</label><input className="input-field" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Amit Sharma" /></div>
            <div><label className="label">Phone *</label><input className="input-field" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="9876543210" /></div>
            <div><label className="label">Email</label><input className="input-field" value={form.email} onChange={(e) => set("email", e.target.value)} type="email" /></div>
            <div className="col-span-2"><label className="label">Loan Type *</label>
              <select className="input-field bg-white" value={form.loanType} onChange={(e) => set("loanType", e.target.value)}>
                <option value="">Select...</option>
                {Object.entries(LOAN_TYPE_LABELS).map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}
              </select>
            </div>
            <div><label className="label">Loan Amount (₹)</label><input className="input-field" type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} /></div>
            <div><label className="label">City</label><input className="input-field" value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
            <div className="col-span-2"><label className="label">Source</label>
              <select className="input-field bg-white" value={form.source} onChange={(e) => set("source", e.target.value)}>
                {["Website Form","WhatsApp","Phone Call","Walk-in","Referral","Existing Customer Referral","Manual Entry"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {isReferral && (
              <div className="col-span-2 bg-gold/5 border border-gold/30 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-navy uppercase tracking-wide">Referred By</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Referrer Name *</label>
                    <input className="input-field" value={form.referrerName} onChange={(e) => set("referrerName", e.target.value)} placeholder="Who referred this client?" />
                  </div>
                  <div>
                    <label className="label">Referrer Phone</label>
                    <input className="input-field" value={form.referrerPhone} onChange={(e) => set("referrerPhone", e.target.value)} placeholder="9876543210" />
                  </div>
                </div>
              </div>
            )}

            {type === "customer" && (
              <>
                <div><label className="label">Bank Name</label><input className="input-field" value={form.bankName} onChange={(e) => set("bankName", e.target.value)} placeholder="SBI" /></div>
                <div><label className="label">Loan Account No.</label><input className="input-field" value={form.loanAccountNumber} onChange={(e) => set("loanAccountNumber", e.target.value)} /></div>
                <div><label className="label">Disbursement Date</label><input className="input-field" type="date" value={form.disbursementDate} onChange={(e) => set("disbursementDate", e.target.value)} /></div>
                <div><label className="label">EMI Amount (₹)</label><input className="input-field" type="number" value={form.emiAmount} onChange={(e) => set("emiAmount", e.target.value)} /></div>
                <div className="col-span-2"><label className="label">Tenure (months)</label><input className="input-field" type="number" value={form.tenure} onChange={(e) => set("tenure", e.target.value)} /></div>
              </>
            )}

            <div className="col-span-2"><label className="label">Notes</label><textarea className="input-field resize-none" rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:border-navy transition-colors">Cancel</button>
            <button onClick={save} disabled={loading} className="flex-1 btn-primary justify-center disabled:opacity-50">
              {loading ? "Saving..." : "Create Record"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
