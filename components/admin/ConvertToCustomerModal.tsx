"use client";

import { useState } from "react";
import { X, ArrowRight, CheckCircle } from "lucide-react";
import type { LoanRecord } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import toast from "react-hot-toast";

interface Props {
  record: LoanRecord;
  open: boolean;
  onClose: () => void;
  onConverted: () => void;
}

export default function ConvertToCustomerModal({ record, open, onClose, onConverted }: Props) {
  const [form, setForm] = useState({
    bankName: record.bankName || "",
    loanAccountNumber: record.loanAccountNumber || "",
    disbursementDate: "",
    sanctionedAmount: record.amount ? String(record.amount) : "",
    emiAmount: record.emiAmount ? String(record.emiAmount) : "",
    tenure: record.tenure ? String(record.tenure) : "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function convert() {
    if (!form.bankName.trim()) { toast.error("Bank name is required"); return; }
    if (!form.disbursementDate) { toast.error("Disbursement date is required"); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/records/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordType: "customer",
          status: "Active",
          bankName: form.bankName.trim(),
          loanAccountNumber: form.loanAccountNumber.trim() || null,
          disbursementDate: form.disbursementDate,
          sanctionedAmount: form.sanctionedAmount ? Number(form.sanctionedAmount) : null,
          emiAmount: form.emiAmount ? Number(form.emiAmount) : null,
          tenure: form.tenure ? Number(form.tenure) : null,
          notes: form.notes.trim() || null,
          performedBy: "admin",
          activityEntry: {
            type: "status-change",
            note: `🎉 Lead converted to Customer — Loan disbursed via ${form.bankName.trim()}${form.sanctionedAmount ? ` for ${formatINR(Number(form.sanctionedAmount))}` : ""}. All documents and history migrated.`,
            performedBy: "admin",
          },
        }),
      });

      if (res.ok) {
        toast.success(`${record.name} converted to Customer!`);
        onConverted();
        onClose();
      } else {
        toast.error("Conversion failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy to-navy/80 rounded-t-2xl p-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-gold" />
              <h3 className="text-white font-bold">Convert to Customer</h3>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">Loan approved — fill disbursement details</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Summary banner */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800">Congratulations on the disbursement!</p>
              <p className="text-xs text-green-700 mt-1">
                <strong>{record.name}</strong> ({LOAN_TYPE_LABELS[record.loanType as LoanType] || record.loanType}
                {record.amount ? `, ${formatINR(record.amount)}` : ""}) will be moved to Customers.
                All existing documents, notes, and activity history will be fully preserved.
              </p>
            </div>
          </div>

          {/* What gets migrated */}
          <div className="bg-navy/5 rounded-xl p-4">
            <p className="text-xs font-semibold text-navy uppercase tracking-wider mb-3">What carries over</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              {["All uploaded documents", "Complete activity log", "WhatsApp & email history", "Loan details & amount", "Referral information", "Notes & contact info"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Disbursement details */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Disbursement Details</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">Bank / Lender *</label>
              <input className="input-field" value={form.bankName} onChange={(e) => set("bankName", e.target.value)} placeholder="SBI, HDFC, ICICI..." />
            </div>
            <div className="col-span-2">
              <label className="label">Loan Account Number</label>
              <input className="input-field font-mono" value={form.loanAccountNumber} onChange={(e) => set("loanAccountNumber", e.target.value)} placeholder="Optional" />
            </div>
            <div>
              <label className="label">Disbursement Date *</label>
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
            <div className="col-span-2">
              <label className="label">Conversion Notes</label>
              <textarea className="input-field resize-none" rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any remarks for this conversion..." />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:border-navy transition-colors">
              Cancel
            </button>
            <button onClick={convert} disabled={loading} className="flex-1 btn-primary justify-center disabled:opacity-50 gap-2">
              {loading ? "Converting..." : (
                <><CheckCircle className="w-4 h-4" /> Convert to Customer</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
