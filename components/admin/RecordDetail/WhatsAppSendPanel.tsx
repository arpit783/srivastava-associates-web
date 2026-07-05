"use client";

import { useState } from "react";
import { Send, MessageSquare, FileText, Calculator, Bell, Edit } from "lucide-react";
import { formatChecklistAsWhatsApp, LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import { formatINR } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props { record: any; onSent: () => void; }

export default function WhatsAppSendPanel({ record, onSent }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [customMsg, setCustomMsg] = useState("");
  const [emiPrincipal, setEmiPrincipal] = useState(record.amount || 2000000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiTenure, setEmiTenure] = useState(240);

  function calcEMI(p: number, r: number, t: number) {
    const mr = r / 12 / 100;
    return (p * mr * Math.pow(1 + mr, t)) / (Math.pow(1 + mr, t) - 1);
  }

  const emi = calcEMI(emiPrincipal, emiRate, emiTenure);
  const totalAmount = emi * emiTenure;
  const totalInterest = totalAmount - emiPrincipal;

  async function send(type: string, extraData?: object) {
    setLoading(type);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordId: record.id,
          phone: record.phone,
          type,
          loanType: record.loanType,
          ...extraData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message sent on WhatsApp!");
        onSent();
      } else {
        toast.error(data.error || "Send failed");
      }
    } finally {
      setLoading(null);
    }
  }

  function buildEMIMessage() {
    return (
      `📊 *EMI Calculation for ${record.name}*\n\n` +
      `Loan Amount: ${formatINR(emiPrincipal)}\n` +
      `Interest Rate: ${emiRate}% p.a.\n` +
      `Tenure: ${emiTenure / 12} years\n\n` +
      `*Monthly EMI: ${formatINR(Math.round(emi))}*\n` +
      `Total Interest: ${formatINR(Math.round(totalInterest))}\n` +
      `Total Payable: ${formatINR(Math.round(totalAmount))}\n\n` +
      `Please contact us for the best rates from 30+ banks!\n\n— Srivastava Associates\n📞 8306445333`
    );
  }

  const checklist = formatChecklistAsWhatsApp(record.loanType as LoanType, record.name);

  const quickActions = [
    {
      id: "checklist",
      label: "Send Document Checklist",
      icon: FileText,
      desc: "Send the required documents list for their loan type",
      preview: checklist,
      action: () => send("checklist"),
    },
    {
      id: "upload-reminder",
      label: "Send Upload Reminder",
      icon: Bell,
      desc: "Remind lead to share pending documents",
      action: () => send("upload-reminder"),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#25D366]" /> Quick Send
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {quickActions.map(({ id, label, icon: Icon, desc, action, preview }) => (
            <div key={id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <Icon className="w-5 h-5 text-[#25D366] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm text-navy">{label}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
              </div>
              {preview && (
                <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600 max-h-24 overflow-y-auto mb-3 font-mono whitespace-pre-wrap">
                  {preview.slice(0, 200)}...
                </div>
              )}
              <button
                onClick={action}
                disabled={!!loading}
                className="w-full bg-[#25D366] text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-[#1ebe5d] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {loading === id ? "Sending..." : <><Send className="w-3.5 h-3.5" /> Send on WhatsApp</>}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* EMI Calculator + Send */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-gold" /> Send EMI Calculation
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="label text-xs">Loan Amount (₹)</label>
              <input type="number" className="input-field text-sm py-2" value={emiPrincipal}
                onChange={(e) => setEmiPrincipal(Number(e.target.value))} />
            </div>
            <div>
              <label className="label text-xs">Interest Rate (%)</label>
              <input type="number" step="0.1" className="input-field text-sm py-2" value={emiRate}
                onChange={(e) => setEmiRate(Number(e.target.value))} />
            </div>
            <div>
              <label className="label text-xs">Tenure (months)</label>
              <input type="number" className="input-field text-sm py-2" value={emiTenure}
                onChange={(e) => setEmiTenure(Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-navy rounded-xl p-4 text-center">
              <div className="text-gray-400 text-xs mb-1">Monthly EMI</div>
              <div className="text-2xl font-bold text-gold">{formatINR(Math.round(emi))}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-400">Interest</div>
                <div className="font-bold text-sm text-navy">{formatINR(Math.round(totalInterest))}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-400">Total</div>
                <div className="font-bold text-sm text-navy">{formatINR(Math.round(totalAmount))}</div>
              </div>
            </div>
            <button
              onClick={() => send("emi", { message: buildEMIMessage() })}
              disabled={!!loading}
              className="w-full bg-[#25D366] text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-[#1ebe5d] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading === "emi" ? "Sending..." : <><Send className="w-3.5 h-3.5" /> Send EMI to WhatsApp</>}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Message */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
          <Edit className="w-5 h-5 text-gray-500" /> Custom Message
        </h3>
        <textarea
          className="input-field resize-none text-sm"
          rows={5}
          placeholder={`Hi ${record.name}! ...`}
          value={customMsg}
          onChange={(e) => setCustomMsg(e.target.value)}
        />
        <button
          onClick={() => send("custom", { customMessage: customMsg })}
          disabled={!customMsg.trim() || !!loading}
          className="mt-3 w-full bg-[#25D366] text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-[#1ebe5d] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading === "custom" ? "Sending..." : <><Send className="w-3.5 h-3.5" /> Send Custom Message</>}
        </button>
      </div>
    </div>
  );
}
