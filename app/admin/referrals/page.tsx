"use client";

import { useState, useEffect } from "react";
import { Users, Phone, ArrowRight, ExternalLink } from "lucide-react";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import { formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Converted: "bg-green-100 text-green-700",
  "Not Interested": "bg-gray-100 text-gray-500",
};

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referrals")
      .then((r) => r.json())
      .then((d) => setReferrals(Array.isArray(d) ? d : []))
      .catch(() => setReferrals([]))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/referrals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setReferrals((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  }

  const total      = referrals.length;
  const converted  = referrals.filter((r) => r.status === "Converted").length;
  const pending    = referrals.filter((r) => r.status === "New").length;

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-navy">Referrals</h1>
        <p className="text-gray-500 text-sm">Leads referred by existing clients — from website form and manual entries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Referrals", value: total, color: "text-navy bg-navy/5" },
          { label: "Converted",       value: converted, color: "text-green-700 bg-green-50" },
          { label: "Pending Action",  value: pending,   color: "text-orange-600 bg-orange-50" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-4 text-center ${color.split(" ")[1]}`}>
            <div className={`text-2xl font-bold ${color.split(" ")[0]}`}>{loading ? "—" : value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-600 font-medium">Referred By</th>
              <th className="text-left px-5 py-3 text-gray-600 font-medium">Client</th>
              <th className="text-left px-5 py-3 text-gray-600 font-medium">Loan Type</th>
              <th className="text-left px-5 py-3 text-gray-600 font-medium">Status</th>
              <th className="text-left px-5 py-3 text-gray-600 font-medium">Date</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">Loading…</td></tr>
            ) : referrals.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No referrals yet</p>
                  <p className="text-gray-400 text-xs mt-1">They appear here when a lead is added with source "Referral" or via the website referral form</p>
                </td>
              </tr>
            ) : referrals.map((r: any) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gold font-bold text-xs">{r.referrerName?.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-navy">{r.referrerName}</div>
                      {r.referrerPhone && (
                        <a href={`tel:${r.referrerPhone}`} className="text-gray-400 text-xs flex items-center gap-1 hover:text-gold">
                          <Phone className="w-3 h-3" /> {r.referrerPhone}
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="font-medium text-navy">{r.clientName}</div>
                  {r.clientPhone && (
                    <a href={`tel:${r.clientPhone}`} className="text-gray-400 text-xs flex items-center gap-1 hover:text-gold">
                      <Phone className="w-3 h-3" /> {r.clientPhone}
                    </a>
                  )}
                </td>
                <td className="px-5 py-3 text-gray-600">{LOAN_TYPE_LABELS[r.loanType as LoanType] || r.loanType || "—"}</td>
                <td className="px-5 py-3">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-500"}`}
                  >
                    {["New", "Contacted", "Converted", "Not Interested"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs">{formatDate(r.timestamp)}</td>
                <td className="px-5 py-3">
                  {r.recordId && (
                    <a
                      href={`/admin/leads/${r.recordId}`}
                      className="flex items-center gap-1 text-gold hover:underline text-xs font-medium"
                    >
                      View Lead <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
