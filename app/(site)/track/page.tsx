"use client";

import { useState } from "react";
import { Search, CheckCircle, Clock, FileText, Phone } from "lucide-react";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import { formatDate } from "@/lib/utils";

const STATUS_STEPS = [
  "New", "Contacted", "Documents Pending", "Documents Received",
  "Processing", "Sanctioned", "Disbursed",
];

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/records?limit=500`);
      const all = await res.json();
      const clean = phone.replace(/\D/g, "").slice(-10);
      const found = all.filter((r: any) => r.phone === clean);
      setRecords(found);
      setSearched(true);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="section-subtitle block mb-2">APPLICATION TRACKER</span>
          <h1 className="section-title">Track Your Application</h1>
          <p className="text-gray-500 mt-2">Enter your mobile number to see your loan application status.</p>
        </div>

        <form onSubmit={search} className="flex gap-3 mb-8">
          <input className="input-field flex-1" placeholder="Enter your 10-digit mobile number" type="tel"
            value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
            <Search className="w-5 h-5" /> {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {searched && records.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
            <Phone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h2 className="font-bold text-navy mb-2">No application found</h2>
            <p className="text-gray-500 text-sm">We couldn&apos;t find any application with this number. Please check the number or contact us.</p>
            <a href="https://wa.me/message/FMB4BVPRQLMUC1" target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 justify-center">Contact Us on WhatsApp</a>
          </div>
        )}

        {records.map((record) => {
          const stepIdx = STATUS_STEPS.indexOf(record.status);
          const docReceived = (record.requiredDocs || []).filter((d: any) => d.status !== "Pending").length;
          const docTotal = (record.requiredDocs || []).length;

          return (
            <div key={record.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-navy rounded-2xl flex items-center justify-center">
                  <span className="text-gold font-bold text-lg">{record.name?.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-bold text-navy">{record.name}</div>
                  <div className="text-sm text-gray-500">{LOAN_TYPE_LABELS[record.loanType as LoanType] || record.loanType}</div>
                  <div className="text-xs text-gray-400">Applied: {formatDate(record.createdAt)}</div>
                </div>
              </div>

              {/* Status steps */}
              {stepIdx >= 0 ? (
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>Application Progress</span>
                    <span className="font-medium text-navy">{record.status}</span>
                  </div>
                  <div className="flex gap-1">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className="flex-1">
                        <div className={`h-2 rounded-full transition-all ${i <= stepIdx ? "bg-gold" : "bg-gray-100"}`} />
                        <div className={`text-[9px] mt-1 text-center ${i <= stepIdx ? "text-gold" : "text-gray-300"}`}>
                          {step.split(" ")[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-5 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 text-center">
                  Status: <strong>{record.status}</strong>
                </div>
              )}

              {/* Documents */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FileText className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-navy">Documents</div>
                  <div className="text-xs text-gray-400">{docReceived} of {docTotal} submitted</div>
                </div>
                <div className="w-20 h-1.5 bg-gray-200 rounded-full">
                  <div className="h-1.5 bg-gold rounded-full" style={{ width: `${docTotal > 0 ? (docReceived / docTotal) * 100 : 0}%` }} />
                </div>
              </div>

              <div className="mt-4 text-center">
                <a href={`https://wa.me/918306445333?text=${encodeURIComponent(`Hi, I want to enquire about my ${LOAN_TYPE_LABELS[record.loanType as LoanType] || record.loanType} application. My name is ${record.name}.`)}`}
                  className="text-sm text-gold hover:underline">
                  Questions? Chat with us on WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
