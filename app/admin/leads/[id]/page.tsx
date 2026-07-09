"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Pencil, ArrowRightCircle } from "lucide-react";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import { formatDate, formatINR } from "@/lib/utils";
import type { LeadStatus, CustomerStatus } from "@/lib/types";
import ActivityLog from "@/components/admin/RecordDetail/ActivityLog";
import DocumentVault from "@/components/admin/RecordDetail/DocumentVault";
import WhatsAppSendPanel from "@/components/admin/RecordDetail/WhatsAppSendPanel";
import EmailPanel from "@/components/admin/RecordDetail/EmailPanel";
import EditRecordModal from "@/components/admin/EditRecordModal";
import ConvertToCustomerModal from "@/components/admin/ConvertToCustomerModal";
import toast from "react-hot-toast";

const LEAD_STATUSES: LeadStatus[] = [
  "New", "Contacted", "Documents Pending", "Documents Received",
  "Processing", "Sanctioned", "Disbursed", "Rejected", "Not Interested", "Unresponsive",
];
const CUSTOMER_STATUSES: CustomerStatus[] = ["Active", "Closed", "Foreclosed", "Written Off"];

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-700", Contacted: "bg-yellow-100 text-yellow-700",
  "Documents Pending": "bg-orange-100 text-orange-700", "Documents Received": "bg-purple-100 text-purple-700",
  Processing: "bg-indigo-100 text-indigo-700", Sanctioned: "bg-teal-100 text-teal-700",
  Disbursed: "bg-green-100 text-green-700", Active: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700", "Not Interested": "bg-gray-100 text-gray-500",
  Unresponsive: "bg-gray-100 text-gray-400", Closed: "bg-gray-100 text-gray-500",
};

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<any>(null);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("documents");
  const [savingStatus, setSavingStatus] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/records/${id}`);
      const data = await res.json();
      setRecord(data);
      setActivityLog(data.activityLog || []);
    } catch (err) {
      toast.error("Failed to load record");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(newStatus: string) {
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/records/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, performedBy: "admin" }),
      });
      if (res.ok) {
        setRecord((r: any) => ({ ...r, status: newStatus }));
        toast.success(`Status updated to: ${newStatus}`);
        load();
      } else {
        toast.error("Failed to update status");
      }
    } finally {
      setSavingStatus(false);
    }
  }

  async function generateUploadLink() {
    const res = await fetch("/api/upload-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId: id }),
    });
    const data = await res.json();
    if (data.uploadUrl) {
      await navigator.clipboard.writeText(data.uploadUrl);
      toast.success("Upload link copied to clipboard! Share with lead.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!record) {
    return <div className="text-center py-20 text-gray-400">Record not found</div>;
  }

  const isCustomer = record.recordType === "customer";
  const statuses = isCustomer ? CUSTOMER_STATUSES : LEAD_STATUSES;
  const docReceived = (record.requiredDocs || []).filter((d: any) => d.status !== "Pending").length;
  const docTotal = (record.requiredDocs || []).length;
  const unmatched = (record.unmatchedDocs || []).length;

  const TABS = [
    { id: "documents", label: `Documents${unmatched > 0 ? ` (${unmatched} unmatched)` : ""}` },
    { id: "activity", label: `Activity Log (${activityLog.length})` },
    { id: "whatsapp", label: "Send WhatsApp" },
    { id: "email", label: "Send Email" },
  ];

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Back */}
      <Link href="/admin/leads" className="flex items-center gap-2 text-gray-500 hover:text-navy transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Leads
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-wrap items-start gap-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-gold font-bold text-2xl">{record.name?.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">{record.name}</h1>
              <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                <a href={`tel:${record.phone}`} className="flex items-center gap-1 hover:text-navy">
                  <Phone className="w-3.5 h-3.5" /> {record.phone}
                </a>
                {record.email && (
                  <a href={`mailto:${record.email}`} className="flex items-center gap-1 hover:text-navy">
                    <Mail className="w-3.5 h-3.5" /> {record.email}
                  </a>
                )}
                {record.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {record.city}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(record.createdAt)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="badge-status bg-navy/10 text-navy">
                  {LOAN_TYPE_LABELS[record.loanType as LoanType] || record.loanType}
                </span>
                {record.amount && (
                  <span className="badge-status bg-gold/10 text-gold-600">
                    {formatINR(record.amount)}
                  </span>
                )}
                <span className="badge-status bg-gray-100 text-gray-600">{record.source}</span>
                {record.bankName && (
                  <span className="badge-status bg-blue-100 text-blue-700">{record.bankName}</span>
                )}
              </div>
            </div>
          </div>

          {/* Status + doc progress */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <span className={`badge-status text-sm py-1 px-3 ${STATUS_COLORS[record.status] || "bg-gray-100"}`}>
                {record.status}
              </span>
              <select
                className="input-field py-1.5 text-sm bg-white min-w-48"
                value={record.status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={savingStatus}
              >
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1.5">Documents: {docReceived}/{docTotal}</div>
              <div className="w-32 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-gold rounded-full transition-all"
                  style={{ width: docTotal > 0 ? `${(docReceived / docTotal) * 100}%` : "0%" }}
                />
              </div>
              {unmatched > 0 && (
                <div className="text-xs text-orange-500 mt-1">{unmatched} unmatched doc(s)</div>
              )}
            </div>

            <button
              onClick={generateUploadLink}
              className="text-xs text-gold border border-gold/30 px-3 py-1.5 rounded-lg hover:bg-gold/5 transition-colors"
            >
              Generate Upload Link
            </button>

            {/* Edit + Convert buttons */}
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 text-xs text-navy border border-navy/30 px-3 py-1.5 rounded-lg hover:bg-navy/5 transition-colors font-medium"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit Details
              </button>
              {!isCustomer && (
                <button
                  onClick={() => setConvertOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  <ArrowRightCircle className="w-3.5 h-3.5" /> Convert to Customer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Customer-specific info */}
        {isCustomer && (record.bankName || record.loanAccountNumber || record.emiAmount) && (
          <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            {record.bankName && (
              <div><div className="text-xs text-gray-400">Bank</div><div className="font-medium text-navy text-sm">{record.bankName}</div></div>
            )}
            {record.loanAccountNumber && (
              <div><div className="text-xs text-gray-400">Account No.</div><div className="font-medium text-navy text-sm font-mono">{record.loanAccountNumber}</div></div>
            )}
            {record.emiAmount && (
              <div><div className="text-xs text-gray-400">Monthly EMI</div><div className="font-medium text-navy text-sm">{formatINR(record.emiAmount)}</div></div>
            )}
            {record.disbursementDate && (
              <div><div className="text-xs text-gray-400">Disbursed On</div><div className="font-medium text-navy text-sm">{formatDate(record.disbursementDate)}</div></div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {TABS.map(({ id: tabId, label }) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tabId ? "border-gold text-navy" : "border-transparent text-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "documents" && (
        <DocumentVault record={record} onUpdate={load} />
      )}
      {activeTab === "activity" && (
        <ActivityLog
          recordId={id}
          entries={activityLog}
          onEntryAdded={load}
        />
      )}
      {activeTab === "whatsapp" && (
        <WhatsAppSendPanel record={record} onSent={load} />
      )}
      {activeTab === "email" && (
        <EmailPanel record={record} onSent={load} />
      )}

      {/* Edit modal */}
      <EditRecordModal
        record={record}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={load}
      />

      {/* Convert to Customer modal */}
      {!isCustomer && (
        <ConvertToCustomerModal
          record={record}
          open={convertOpen}
          onClose={() => setConvertOpen(false)}
          onConverted={() => { load(); }}
        />
      )}
    </div>
  );
}
