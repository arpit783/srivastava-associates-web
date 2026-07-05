"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, FileText, Clock, AlertCircle, TrendingUp, CheckCircle, Plus, ArrowRight } from "lucide-react";
import { formatDate, timeAgo } from "@/lib/utils";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";

interface DashboardStats {
  totalLeads: number;
  totalCustomers: number;
  newToday: number;
  pendingFollowUps: number;
  docsAwaited: number;
  recentLeads: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/records?statsOnly=true");
        const data = await res.json();
        if (data.totalLeads !== undefined) {
          setStats({
            totalLeads:       data.totalLeads,
            totalCustomers:   data.totalCustomers,
            newToday:         data.newToday,
            pendingFollowUps: data.pendingFollowUps,
            docsAwaited:      data.docsAwaited,
            recentLeads:      Array.isArray(data.recentLeads) ? data.recentLeads : [],
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    { label: "Total Leads", value: stats?.totalLeads ?? "—", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Customers", value: stats?.totalCustomers ?? "—", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "New Today", value: stats?.newToday ?? "—", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Follow-ups Due", value: stats?.pendingFollowUps ?? "—", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Docs Awaited", value: stats?.docsAwaited ?? "—", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  const statusColor: Record<string, string> = {
    New: "bg-blue-100 text-blue-700",
    Contacted: "bg-yellow-100 text-yellow-700",
    "Documents Pending": "bg-orange-100 text-orange-700",
    "Documents Received": "bg-purple-100 text-purple-700",
    Processing: "bg-indigo-100 text-indigo-700",
    Sanctioned: "bg-teal-100 text-teal-700",
    Disbursed: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    "Not Interested": "bg-gray-100 text-gray-600",
    Active: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <Link href="/admin/leads" className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Lead
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-navy">{loading ? "—" : value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-navy">Recent Activity</h2>
            <Link href="/admin/leads" className="text-sm text-gold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : stats?.recentLeads.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No records yet</div>
            ) : (
              stats?.recentLeads.map((r) => (
                <Link
                  key={r.id}
                  href={`/admin/leads/${r.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gold font-bold text-xs">
                      {r.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-navy text-sm truncate">{r.name}</div>
                    <div className="text-gray-400 text-xs">
                      {LOAN_TYPE_LABELS[r.loanType as LoanType] || r.loanType} • {r.phone}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`badge-status ${statusColor[r.status] || "bg-gray-100 text-gray-600"}`}>
                      {r.status}
                    </span>
                    <span className="text-gray-400 text-xs">{timeAgo(r.createdAt)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-navy mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Add New Lead", href: "/admin/leads", icon: Plus },
                { label: "Import Customers", href: "/admin/import", icon: FileText },
                { label: "View Work Log", href: "/admin/employees", icon: Clock },
                { label: "Bank Rates", href: "/admin/rates", icon: TrendingUp },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-navy"
                >
                  <Icon className="w-4 h-4 text-gold" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-navy rounded-xl p-5">
            <h3 className="text-white font-bold text-sm mb-3">Need Help?</h3>
            <p className="text-gray-400 text-xs mb-4">
              Documents sent by leads on WhatsApp are automatically captured in their record.
            </p>
            <a
              href="https://wa.me/message/FMB4BVPRQLMUC1"
              className="btn-primary text-xs w-full justify-center"
              target="_blank"
            >
              Open WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
