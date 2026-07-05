"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { LOAN_TYPE_LABELS, LoanType, formatChecklistAsWhatsApp } from "@/lib/document-checklists";
import toast from "react-hot-toast";

interface Props { record: any; onSent: () => void; }

export default function EmailPanel({ record, onSent }: Props) {
  const [to, setTo] = useState(record.email || "");
  const [subject, setSubject] = useState(`Regarding your ${LOAN_TYPE_LABELS[record.loanType as LoanType] || record.loanType} Application`);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const loanLabel = LOAN_TYPE_LABELS[record.loanType as LoanType] || record.loanType;

  function prefillChecklist() {
    const checklist = formatChecklistAsWhatsApp(record.loanType as LoanType, record.name);
    setBody(checklist.replace(/\*/g, "").replace(/_/g, ""));
    setSubject(`Document Checklist for ${loanLabel} Application`);
  }

  async function sendEmail() {
    if (!to || !subject || !body) { toast.error("Fill all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom",
          recordId: record.id,
          to,
          subject,
          html: `<div style="font-family:Arial;max-width:600px;margin:auto;padding:20px;">
            <div style="background:#0B1D3E;padding:16px;border-radius:8px 8px 0 0;">
              <h2 style="color:#C9A227;margin:0;">Srivastava Associates</h2>
            </div>
            <div style="background:#fff;border:1px solid #eee;padding:20px;border-radius:0 0 8px 8px;">
              <pre style="font-family:Arial;white-space:pre-wrap;">${body}</pre>
              <br>
              <div style="color:#888;font-size:12px;">— Srivastava Associates | 8306445333 | Kota, Rajasthan</div>
            </div>
          </div>`,
        }),
      });
      if (res.ok) {
        toast.success("Email sent successfully!");
        onSent();
      } else { toast.error("Failed to send email"); }
    } finally { setLoading(false); }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="font-bold text-navy flex items-center gap-2">
        <Mail className="w-5 h-5 text-purple-500" /> Send Email
      </h3>

      <div className="flex gap-2 flex-wrap">
        <button onClick={prefillChecklist} className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-navy transition-colors">
          Pre-fill Document Checklist
        </button>
        <button onClick={() => { setSubject(`Status Update: ${record.status}`); setBody(`Dear ${record.name},\n\nYour ${loanLabel} application status has been updated to: ${record.status}.\n\nPlease contact us for more details.\n\nRegards,\nSrivastava Associates\n8306445333`); }}
          className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-navy transition-colors">
          Status Update Template
        </button>
      </div>

      <div>
        <label className="label">To (Email)</label>
        <input className="input-field" type="email" placeholder="lead@email.com" value={to} onChange={(e) => setTo(e.target.value)} />
        {!record.email && <p className="text-xs text-orange-500 mt-1">No email saved for this lead</p>}
      </div>
      <div>
        <label className="label">Subject</label>
        <input className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div>
        <label className="label">Message</label>
        <textarea className="input-field resize-none" rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message..." />
      </div>

      <button onClick={sendEmail} disabled={loading || !to || !body} className="btn-primary w-full justify-center disabled:opacity-50">
        {loading ? "Sending..." : <><Send className="w-4 h-4" /> Send Email</>}
      </button>
    </div>
  );
}
