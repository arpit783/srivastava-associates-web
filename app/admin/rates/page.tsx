"use client";

import { useState, useEffect } from "react";
import { Plus, Save, Trash2, Edit2 } from "lucide-react";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import toast from "react-hot-toast";

interface BankRate { id: string; bank: string; loanType: LoanType; minRate: number; maxRate: number; updatedAt: string; }

const DEFAULT_RATES: Omit<BankRate, "id" | "updatedAt">[] = [
  { bank: "SBI", loanType: "home-loan", minRate: 8.5, maxRate: 9.5 },
  { bank: "HDFC Bank", loanType: "home-loan", minRate: 8.75, maxRate: 9.75 },
  { bank: "ICICI Bank", loanType: "home-loan", minRate: 8.9, maxRate: 9.9 },
  { bank: "Axis Bank", loanType: "home-loan", minRate: 8.75, maxRate: 9.65 },
  { bank: "PNB Housing", loanType: "home-loan", minRate: 8.5, maxRate: 11.0 },
  { bank: "SBI", loanType: "new-car-loan", minRate: 8.75, maxRate: 10.5 },
  { bank: "HDFC Bank", loanType: "new-car-loan", minRate: 8.9, maxRate: 10.75 },
];

export default function RatesPage() {
  const [rates, setRates] = useState<BankRate[]>([]);
  const [adding, setAdding] = useState(false);
  const [newRate, setNewRate] = useState({ bank: "", loanType: "home-loan" as LoanType, minRate: 8.5, maxRate: 10 });

  useEffect(() => {
    fetch("/api/admin/rates").then((r) => r.ok ? r.json() : DEFAULT_RATES.map((r, i) => ({ ...r, id: String(i), updatedAt: new Date().toISOString() })))
      .then(setRates).catch(() => setRates(DEFAULT_RATES.map((r, i) => ({ ...r, id: String(i), updatedAt: new Date().toISOString() }))));
  }, []);

  async function saveRate() {
    if (!newRate.bank || !newRate.loanType) { toast.error("Fill all fields"); return; }
    const res = await fetch("/api/admin/rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRate),
    });
    if (res.ok) {
      toast.success("Rate saved");
      const data = await res.json();
      setRates((prev) => [...prev, { ...newRate, id: data.id, updatedAt: new Date().toISOString() }]);
      setAdding(false);
    } else { toast.error("Save failed"); }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Bank Interest Rates</h1>
          <p className="text-gray-500 text-sm">Manage current interest rates from partner banks & NBFCs</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Rate
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-navy mb-4">Add New Rate</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><label className="label">Bank Name</label><input className="input-field" placeholder="SBI" value={newRate.bank} onChange={(e) => setNewRate((n) => ({ ...n, bank: e.target.value }))} /></div>
            <div><label className="label">Loan Type</label>
              <select className="input-field bg-white" value={newRate.loanType} onChange={(e) => setNewRate((n) => ({ ...n, loanType: e.target.value as LoanType }))}>
                {Object.entries(LOAN_TYPE_LABELS).map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}
              </select>
            </div>
            <div><label className="label">Min Rate (%)</label><input type="number" step="0.1" className="input-field" value={newRate.minRate} onChange={(e) => setNewRate((n) => ({ ...n, minRate: Number(e.target.value) }))} /></div>
            <div><label className="label">Max Rate (%)</label><input type="number" step="0.1" className="input-field" value={newRate.maxRate} onChange={(e) => setNewRate((n) => ({ ...n, maxRate: Number(e.target.value) }))} /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={saveRate} className="btn-primary text-sm"><Save className="w-4 h-4" /> Save</button>
            <button onClick={() => setAdding(false)} className="text-sm text-gray-500 hover:text-navy px-3">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-600">Bank</th>
              <th className="text-left px-5 py-3 text-gray-600">Loan Type</th>
              <th className="text-left px-5 py-3 text-gray-600">Rate Range</th>
              <th className="text-left px-5 py-3 text-gray-600">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rates.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-navy">{r.bank}</td>
                <td className="px-5 py-3 text-gray-600">{LOAN_TYPE_LABELS[r.loanType] || r.loanType}</td>
                <td className="px-5 py-3">
                  <span className="bg-gold/10 text-gold-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    {r.minRate}% – {r.maxRate}%
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs">{new Date(r.updatedAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
