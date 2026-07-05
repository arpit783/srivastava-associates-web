"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Upload, UserCheck, Settings,
  Star, TrendingUp, LogOut, Menu, X, Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads & Customers", icon: Users },
  { href: "/admin/import", label: "Import Customers", icon: Upload },
  { href: "/admin/employees", label: "Work Tracker", icon: UserCheck },
  { href: "/admin/rates", label: "Bank Rates", icon: TrendingUp },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/referrals", label: "Referrals", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_authed");
    if (saved === "1") setAuthed(true);
  }, []);

  function login(e: React.FormEvent) {
    e.preventDefault();
    fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    }).then((r) => {
      if (r.ok) {
        sessionStorage.setItem("admin_authed", "1");
        setAuthed(true);
        setError(false);
      } else {
        setError(true);
      }
    }).catch(() => {
      // Fallback: client-side check (for dev)
      if (pw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || pw === "srivastava@admin2024") {
        sessionStorage.setItem("admin_authed", "1");
        setAuthed(true);
        setError(false);
      } else {
        setError(true);
      }
    });
  }

  function logout() {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <div className="relative w-11 h-11">
                <Image src="/images/logo.png" alt="SA Logo" fill className="object-contain" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-navy">Admin Portal</h1>
            <p className="text-gray-400 text-sm mt-1">Srivastava Associates</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className={cn("input-field", error && "border-red-400")}
                placeholder="Enter admin password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setError(false); }}
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mt-1">Incorrect password</p>}
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Login to Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-navy w-64 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
          <div className="p-5 border-b border-navy-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg overflow-hidden relative flex-shrink-0">
              <Image src="/images/logo.png" alt="SA Logo" fill className="object-contain p-0.5" />
            </div>
            <div>
              <div className="text-white font-bold text-xs">SRIVASTAVA</div>
              <div className="text-gold font-bold text-xs">ASSOCIATES</div>
            </div>
          </div>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all",
                  active
                    ? "bg-gold text-navy font-bold"
                    : "text-gray-300 hover:bg-navy-800 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-navy-800">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" /> View Website
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 transition-colors w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button className="lg:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-gray-500">Admin Panel</span>
            <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center">
              <span className="text-gold font-bold text-xs">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
