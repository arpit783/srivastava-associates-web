"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import type { LoanRecord } from "@/lib/types";
import toast from "react-hot-toast";

interface Props {
  record: LoanRecord;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditRecordModal({ record, open, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", loanType: "" as LoanType | "",
    amount: "", city: "", source: "",
    bankName: "", loanAccountNumber: "", disbursementDate: "",
    emiAmount: "", tenure: "", sanctionedAmount: "",
    notes: "", referrerName: "", referrerPhone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record && open) {
      setForm({
        name: record.name || "",
        phone: record.phone || "",
        email: record.email || "",
        loanType: record.loanType || "",
        amount: record.amount != null ? String(record.amount) : "",
        city: record.city || "",
        source: record.source || "",
        bankName: record.bankName || "",
        loanAccountNumber: record.loanAccountNumber || "",
        disbursementDate: record.disbursementDate || "",
        emiAmount: record.emiAmount != null ? String(record.emiAmount) : "",
        tenure: record.tenure != null ? String(record.tenure) : "",
        sanctionedAmount: record.sanctionedAmount != null ? String(record.sanctionedAmount) : "",
        notes: record.notes || "",
        referrerName: record.referrerName || "",
        referrerPhone: record.referrerPhone || "",
      });
    }
  }, [record, open]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const isCustomer = record.recordType === "customer";
  const isReferral = form.source === "Referral" || form.source === "Existing Customer Referral";

  async function save() {
    if (!form.name.trim() || !form.phone.trim() || !form.loanType) {
      toast.error("Name, phone & loan type are required");
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, any> = {
        name: form.name.trim(),
        phone: form.phone.replace(/\D/g, "").slice(-10),
        email: form.email.trim() || null,
        loanType: form.loanType,
        amount: form.amount ? Number(form.amount) : null,
        city: form.city.trim() || null,
        source: form.source,
        bankName: form.bankName.trim() || null,
        notes: form.notes.trim() || null,
        referrerName: form.referrerName.trim() || null,
        referrerPhone: form.referrerPhone.trim() || null,
        performedBy: "admin",
      };

      if (isCustomer) {
        payload.loanAccountNumber = form.loanAccountNumber.trim() || null;
        payload.disbursementDate = form.disbursementDate || null;
        payload.emiAmount = form.emiAmount ? Number(form.emiAmount) : null;
        payload.tenure = form.tenure ? Number(form.tenure) : null;
        payload.sanctionedAmount = form.sanctionedAmount ? Number(form.sanctionedAmount) : null;
      }

      const res = await fetch(`/api/records/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Record updated successfully");
        onSaved();
        onClose();
      } else {
        toast.error("Failed to update record");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-navy rounded-t-2xl p-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h3 className="text-white font-bold">Edit {isCustomer ? "Customer" : "Lead"}</h3>
            <p className="text-gray-400 text-xs mt-0.5">{record.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Basic Info</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">Full Name *</label>
              <input className="input-field" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className="label">Phone *</label>
              <input className="input-field" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input-field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input-field" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <label className="label">Source</label>
              <select className="input-field bg-white" value={form.source} onChange={(e) => set("source", e.target.value)}>
                {["Website Form","WhatsApp","Phone Call","Walk-in","Referral","Existing Customer Referral","Manual Entry","CSV Import"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {isReferral && (
              <div className="col-span-2 bg-gold/5 border border-gold/30 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-navy uppercase tracking-wide">Referred By</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Referrer Name</label>
                    <input className="input-field" value={form.referrerName} onChange={(e) => set("referrerName", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Referrer Phone</label>
                    <input className="input-field" value={form.referrerPhone} onChange={(e) => set("referrerPhone", e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loan Info */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Loan Details</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">Loan Type *</label>
              <select className="input-field bg-white" value={form.loanType} onChange={(e) => set("loanType", e.target.value)}>
                <option value="">Select...</option>
                {Object.entries(LOAN_TYPE_LABELS).map(([slug, label]) => (
                  <option key={slug} value={slug}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Loan Amount (₹)</label>
              <input className="input-field" type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
            </div>
            <div>
              <label className="label">Bank / Lender</label>
              <input className="input-field" value={form.bankName} onChange={(e) => set("bankName", e.target.value)} placeholder="SBI, HDFC..." />
            </div>
          </div>

          {/* Customer-only fields */}
          {isCustomer && (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Loan Account Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="label">Loan Account Number</label>
                  <input className="input-field font-mono" value={form.loanAccountNumber} onChange={(e) => set("loanAccountNumber", e.target.value)} />
                </div>
                <div>
                  <label className="label">Disbursement Date</label>
                  <input className="input-field" type="date" value={form.disbursementDate} onChange={(e) => set("disbursementDate", e.target.value)} />
                </div>
                <div>
                  <label className="label">Sanctioned Amount (₹)</label>
                  <input className="input-field" type="number" value={form.sanctionedAmount} onChange={(e) => set("sanctionedAmount", e.target.value)} />
                </div>
                <div>
                  <label className="label">Monthly EMI (₹)</label>
                  <input className="input-field" type="number" value={form.emiAmount} onChange={(e) => set("emiAmount", e.target.value)} />
                </div>
                <div>
                  <label className="label">Tenure (months)</label>
                  <input className="input-field" type="number" value={form.tenure} onChange={(e) => set("tenure", e.target.value)} />
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Internal notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:border-navy transition-colors">
              Cancel
            </button>
            <button onClick={save} disabled={loading} className="flex-1 btn-primary justify-center disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
