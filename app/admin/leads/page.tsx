"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Plus, Search, Download, RefreshCw, User, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import { formatDate, timeAgo } from "@/lib/utils";
import AddRecordModal from "@/components/admin/AddRecordModal";

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  "Documents Pending": "bg-orange-100 text-orange-700",
  "Documents Received": "bg-purple-100 text-purple-700",
  Processing: "bg-indigo-100 text-indigo-700",
  Sanctioned: "bg-teal-100 text-teal-700",
  Disbursed: "bg-green-100 text-green-700",
  Active: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  "Not Interested": "bg-gray-100 text-gray-500",
  Unresponsive: "bg-gray-100 text-gray-400",
  Closed: "bg-gray-100 text-gray-500",
};

const PAGE_SIZES = [10, 20, 50];

export default function LeadsPage() {
  const [records, setRecords]       = useState<any[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);

  const [tab, setTab]                   = useState<"leads" | "customers">("leads");
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loanTypeFilter, setLoanTypeFilter] = useState("all");
  const [page, setPage]                 = useState(1);
  const [pageSize, setPageSize]         = useState(10);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Tab counts (loaded once from statsOnly)
  const [tabCounts, setTabCounts] = useState({ leads: 0, customers: 0 });

  // Debounce search
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
  }, [search]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [tab, statusFilter, loanTypeFilter]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        recordType: tab === "leads" ? "lead" : "customer",
        page: String(page),
        pageSize: String(pageSize),
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (loanTypeFilter !== "all") params.set("loanType", loanTypeFilter);

      const res = await fetch(`/api/records?${params}`);
      const data = await res.json();
      setRecords(Array.isArray(data.records) ? data.records : []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [tab, page, pageSize, debouncedSearch, statusFilter, loanTypeFilter]);

  // Fetch tab counts separately (unaffected by filters)
  const fetchCounts = useCallback(async () => {
    const res = await fetch("/api/records?statsOnly=true");
    const d = await res.json();
    if (d.totalLeads !== undefined) {
      setTabCounts({ leads: d.totalLeads, customers: d.totalCustomers });
    }
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);
  useEffect(() => { fetchCounts(); }, [fetchCounts]);

  async function exportCSV() {
    const params = new URLSearchParams({
      recordType: tab === "leads" ? "lead" : "customer",
      all: "true",
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (loanTypeFilter !== "all") params.set("loanType", loanTypeFilter);

    const res = await fetch(`/api/records?${params}`);
    const data = await res.json();
    const allRecords = data.records ?? [];

    const headers = ["Name", "Phone", "Email", "Loan Type", "Amount", "City", "Status", "Source", "Created"];
    const rows = allRecords.map((r: any) => [
      r.name, r.phone, r.email || "", LOAN_TYPE_LABELS[r.loanType as LoanType] || r.loanType,
      r.amount || "", r.city || "", r.status, r.source, formatDate(r.createdAt),
    ]);
    const csv = [headers, ...rows].map((row: any[]) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const leadStatuses = ["New", "Contacted", "Documents Pending", "Documents Received", "Processing", "Sanctioned", "Disbursed", "Rejected", "Not Interested", "Unresponsive"];
  const customerStatuses = ["Active", "Closed", "Foreclosed", "Written Off"];
  const statuses = tab === "leads" ? leadStatuses : customerStatuses;

  const startRecord = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRecord   = Math.min(page * pageSize, total);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Leads & Customers</h1>
          <p className="text-gray-500 text-sm">
            {loading ? "Loading..." : `${total} record${total !== 1 ? "s" : ""} found`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { fetchRecords(); fetchCounts(); }}
            className="p-2 border border-gray-200 rounded-lg hover:border-navy transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-navy transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setAddModalOpen(true)} className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(["leads", "customers"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
              tab === t ? "border-gold text-navy" : "border-transparent text-gray-500"
            }`}
          >
            {t === "leads" ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
            <span className="ml-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
              {t === "leads" ? tabCounts.leads : tabCounts.customers}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input-field pl-9 py-2"
            placeholder="Search name, phone, city… (searches all records)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field py-2 bg-white min-w-40"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          className="input-field py-2 bg-white min-w-40"
          value={loanTypeFilter}
          onChange={(e) => setLoanTypeFilter(e.target.value)}
        >
          <option value="all">All Loan Types</option>
          {Object.entries(LOAN_TYPE_LABELS).map(([slug, label]) => (
            <option key={slug} value={slug}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Phone</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Loan Type</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Docs</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Created</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">Loading…</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No records found</td></tr>
              ) : (
                records.map((r) => {
                  const received = (r.requiredDocs || []).filter((d: any) => d.status !== "Pending").length;
                  const total_d  = (r.requiredDocs || []).length;
                  const unmatched = (r.unmatchedDocs || []).length;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-gold font-bold text-xs">{r.name?.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-navy">{r.name}</div>
                            <div className="text-gray-400 text-xs">{r.city || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{r.phone}</td>
                      <td className="px-5 py-3 text-gray-600">{LOAN_TYPE_LABELS[r.loanType as LoanType] || r.loanType}</td>
                      <td className="px-5 py-3">
                        <span className={`badge-status ${STATUS_COLORS[r.status] || "bg-gray-100"}`}>{r.status}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-600">{received}/{total_d}</div>
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full w-12">
                            <div className="h-1.5 bg-gold rounded-full"
                              style={{ width: total_d > 0 ? `${(received / total_d) * 100}%` : "0%" }} />
                          </div>
                          {unmatched > 0 && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">
                              {unmatched} new
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{timeAgo(r.createdAt)}</td>
                      <td className="px-5 py-3">
                        <Link href={`/admin/leads/${r.id}`} className="text-gold hover:underline text-xs font-medium">
                          Open →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Rows per page:</span>
            {PAGE_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => { setPageSize(s); setPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  pageSize === s ? "bg-navy text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-navy"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{total === 0 ? "0" : `${startRecord}–${endRecord} of ${total}`}</span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="p-1.5 rounded-lg border border-gray-200 hover:border-navy disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      page === p ? "bg-navy text-white" : "border border-gray-200 text-gray-600 hover:border-navy"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="p-1.5 rounded-lg border border-gray-200 hover:border-navy disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {addModalOpen && (
        <AddRecordModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSaved={() => { setAddModalOpen(false); fetchRecords(); fetchCounts(); }}
        />
      )}
    </div>
  );
}
