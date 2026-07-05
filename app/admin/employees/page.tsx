"use client";

import { useEffect, useState } from "react";
import { Phone, MessageSquare, FileText, RefreshCw, Clock, TrendingUp, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { timeAgo, formatDate } from "@/lib/utils";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";

const PAGE_SIZES = [10, 20, 50];

export default function EmployeePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("today");
  const [logPage, setLogPage] = useState(1);
  const [logPageSize, setLogPageSize] = useState(10);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/records?all=true&statsOnly=false");
        const json = await res.json();
        const recs: any[] = Array.isArray(json.records) ? json.records : [];
        setRecords(recs);

        // Gather all activity logs
        const logs: any[] = [];
        await Promise.all(
          recs.slice(0, 50).map(async (r: any) => {
            const logRes = await fetch(`/api/records/${r.id}`);
            const data = await logRes.json();
            (data.activityLog || []).forEach((entry: any) => {
              logs.push({ ...entry, leadName: r.name, leadPhone: r.phone, loanType: r.loanType, recordId: r.id });
            });
          })
        );
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setAllLogs(logs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const now = new Date();
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);

  function filterLogs(logs: any[]) {
    const cutoff = dateFilter === "today" ? today : dateFilter === "week" ? weekAgo : new Date(0);
    return logs.filter((l) => new Date(l.timestamp) >= cutoff);
  }

  const filteredLogs = filterLogs(allLogs);
  const logTotalPages = Math.max(1, Math.ceil(filteredLogs.length / logPageSize));
  const pagedLogs = filteredLogs.slice((logPage - 1) * logPageSize, logPage * logPageSize);
  const callLogs = filteredLogs.filter((l) => l.type === "call");
  const waLogs = filteredLogs.filter((l) => l.type === "whatsapp-sent");
  const docLogs = filteredLogs.filter((l) => l.type.includes("doc"));
  const statusChanges = filteredLogs.filter((l) => l.type === "status-change");

  // Pending actions
  const noActivityIn2Days = records.filter((r) => {
    if (r.status === "Disbursed" || r.status === "Rejected" || r.recordType === "customer") return false;
    if (!r.lastContactedAt) return true;
    const diff = (now.getTime() - new Date(r.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diff > 2;
  });

  const docsAwaited = records.filter((r) => r.status === "Documents Pending");

  const TYPE_ICONS: Record<string, any> = {
    call: Phone, "whatsapp-sent": MessageSquare, "doc-uploaded": FileText,
    "doc-received-whatsapp": FileText, "status-change": RefreshCw,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Work Tracker</h1>
          <p className="text-gray-500 text-sm">Activity summary for the team</p>
        </div>
        <div className="flex gap-2">
          {["today", "week", "all"].map((d) => (
            <button key={d} onClick={() => setDateFilter(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateFilter === d ? "bg-navy text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
              {d === "today" ? "Today" : d === "week" ? "This Week" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Calls Made", value: callLogs.length, icon: Phone, color: "text-blue-600 bg-blue-50" },
          { label: "WhatsApp Sent", value: waLogs.length, icon: MessageSquare, color: "text-green-600 bg-green-50" },
          { label: "Docs Handled", value: docLogs.length, icon: FileText, color: "text-purple-600 bg-purple-50" },
          { label: "Status Updates", value: statusChanges.length, icon: RefreshCw, color: "text-orange-600 bg-orange-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color.split(" ")[1]}`}>
              <Icon className={`w-5 h-5 ${color.split(" ")[0]}`} />
            </div>
            <div className="text-2xl font-bold text-navy">{loading ? "—" : value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-navy">Pending Actions</h2>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="p-4">
              <div className="text-sm font-medium text-gray-700 mb-2">No activity in 2+ days ({noActivityIn2Days.length})</div>
              <div className="space-y-2">
                {noActivityIn2Days.slice(0, 5).map((r: any) => (
                  <a key={r.id} href={`/admin/leads/${r.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-7 h-7 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gold text-xs font-bold">{r.name?.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-navy truncate">{r.name}</div>
                      <div className="text-xs text-gray-400">{LOAN_TYPE_LABELS[r.loanType as LoanType] || r.loanType}</div>
                    </div>
                    <span className="text-xs text-orange-500">{r.lastContactedAt ? timeAgo(r.lastContactedAt) : "Never"}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="p-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Documents Pending ({docsAwaited.length})</div>
              <div className="space-y-2">
                {docsAwaited.slice(0, 5).map((r: any) => {
                  const pending = (r.requiredDocs || []).filter((d: any) => d.status === "Pending").length;
                  return (
                    <a key={r.id} href={`/admin/leads/${r.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-navy truncate">{r.name}</div>
                        <div className="text-xs text-gray-400">{pending} docs pending</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-navy">
              Activity Log
              {!loading && <span className="ml-2 text-xs font-normal text-gray-400">({filteredLogs.length} entries)</span>}
            </h2>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Show:</span>
              {PAGE_SIZES.map((s) => (
                <button key={s} onClick={() => { setLogPageSize(s); setLogPage(1); }}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${logPageSize === s ? "bg-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : pagedLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No activity in this period</div>
            ) : pagedLogs.map((log, i) => {
              const Icon = TYPE_ICONS[log.type];
              return (
                <a key={i} href={`/admin/leads/${log.recordId}`}
                  className="flex items-start gap-3 p-3.5 hover:bg-gray-50 transition-colors">
                  {Icon && (
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-navy">{log.leadName}</div>
                    <div className="text-xs text-gray-500 truncate">{log.note}</div>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">{timeAgo(log.timestamp)}</div>
                </a>
              );
            })}
          </div>
          {/* Pagination */}
          {!loading && filteredLogs.length > logPageSize && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-500">
                {(logPage - 1) * logPageSize + 1}–{Math.min(logPage * logPageSize, filteredLogs.length)} of {filteredLogs.length}
              </span>
              <div className="flex gap-1">
                <button onClick={() => setLogPage((p) => Math.max(1, p - 1))} disabled={logPage === 1}
                  className="p-1.5 rounded border border-gray-200 hover:border-navy disabled:opacity-40 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 py-1 text-xs text-gray-600">Page {logPage} of {logTotalPages}</span>
                <button onClick={() => setLogPage((p) => Math.min(logTotalPages, p + 1))} disabled={logPage === logTotalPages}
                  className="p-1.5 rounded border border-gray-200 hover:border-navy disabled:opacity-40 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
