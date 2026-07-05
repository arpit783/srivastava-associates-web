"use client";

import { useState, useEffect } from "react";
import { Plus, Star, Trash2, Check, X } from "lucide-react";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import toast from "react-hot-toast";

interface Testimonial { id: string; name: string; loanType: LoanType; content: string; rating: number; approved: boolean; timestamp: string; }

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", loanType: "home-loan" as LoanType, content: "", rating: 5 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials").then((r) => r.json()).then((d) => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  async function save() {
    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, approved: true }),
    });
    if (res.ok) {
      const data = await res.json();
      setItems((prev) => [{ ...form, id: data.id, approved: true, timestamp: new Date().toISOString() }, ...prev]);
      toast.success("Testimonial added!");
      setAdding(false);
      setForm({ name: "", loanType: "home-loan", content: "", rating: 5 });
    } else { toast.error("Failed to save"); }
  }

  async function toggleApproved(id: string, current: boolean) {
    await fetch(`/api/testimonials/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved: !current }) });
    setItems((prev) => prev.map((t) => t.id === id ? { ...t, approved: !current } : t));
    toast.success(current ? "Hidden from website" : "Published to website");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Testimonials</h1>
          <p className="text-gray-500 text-sm">Manage client testimonials shown on the website</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-navy">New Testimonial</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Client Name</label><input className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div><label className="label">Loan Type</label>
              <select className="input-field bg-white" value={form.loanType} onChange={(e) => setForm((f) => ({ ...f, loanType: e.target.value as LoanType }))}>
                {Object.entries(LOAN_TYPE_LABELS).map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Review</label>
            <textarea className="input-field resize-none" rows={3} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
          </div>
          <div>
            <label className="label">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setForm((f) => ({ ...f, rating: s }))}>
                  <Star className={`w-6 h-6 ${s <= form.rating ? "fill-gold text-gold" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="btn-primary text-sm">Save & Publish</button>
            <button onClick={() => setAdding(false)} className="text-sm text-gray-500 hover:text-navy px-3">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? <div className="text-center py-8 text-gray-400">Loading...</div> : items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No testimonials yet</div>
        ) : items.map((t) => (
          <div key={t.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${t.approved ? "border-green-200" : "border-gray-100"}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-navy rounded-full flex items-center justify-center">
                    <span className="text-gold font-bold text-sm">{t.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-bold text-navy text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{LOAN_TYPE_LABELS[t.loanType] || t.loanType}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">&ldquo;{t.content}&rdquo;</p>
              </div>
              <button onClick={() => toggleApproved(t.id, t.approved)}
                className={`ml-4 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${t.approved ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600" : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700"}`}>
                {t.approved ? <><Check className="w-3.5 h-3.5" /> Published</> : <><X className="w-3.5 h-3.5" /> Hidden</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
