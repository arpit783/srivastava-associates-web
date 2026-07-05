"use client";

import { useState } from "react";
import { Phone, MessageSquare, Mail, FileText, RefreshCw, Info, Plus, Send } from "lucide-react";
import { formatDateTime, timeAgo } from "@/lib/utils";
import { CallOutcome } from "@/lib/types";
import toast from "react-hot-toast";

const TYPE_ICONS: Record<string, any> = {
  call: Phone, "whatsapp-sent": MessageSquare, "whatsapp-received": MessageSquare,
  "email-sent": Mail, "status-change": RefreshCw, "doc-uploaded": FileText,
  "doc-received-whatsapp": FileText, "follow-up": MessageSquare, import: Info, note: Info,
};
const TYPE_COLORS: Record<string, string> = {
  call: "bg-blue-100 text-blue-600", "whatsapp-sent": "bg-green-100 text-green-600",
  "whatsapp-received": "bg-green-100 text-green-700", "email-sent": "bg-purple-100 text-purple-600",
  "status-change": "bg-orange-100 text-orange-600", "doc-uploaded": "bg-teal-100 text-teal-600",
  "doc-received-whatsapp": "bg-teal-100 text-teal-700", "follow-up": "bg-yellow-100 text-yellow-600",
  import: "bg-gray-100 text-gray-500", note: "bg-gray-100 text-gray-500",
};

const OUTCOMES: CallOutcome[] = ["Answered", "No Response", "Callback Requested", "Not Interested", "Busy", "Wrong Number"];
const OUTCOME_COLORS: Record<string, string> = {
  Answered: "text-green-600", "No Response": "text-orange-500", "Callback Requested": "text-blue-600",
  "Not Interested": "text-red-500", Busy: "text-yellow-600", "Wrong Number": "text-gray-500",
};

interface Props { recordId: string; entries: any[]; onEntryAdded: () => void; }

export default function ActivityLog({ recordId, entries, onEntryAdded }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [type, setType] = useState<"call" | "note">("call");
  const [outcome, setOutcome] = useState<CallOutcome>("Answered");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function addEntry() {
    if (!note.trim() && type === "note") { toast.error("Add a note"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/records/${recordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityEntry: {
            type,
            outcome: type === "call" ? outcome : undefined,
            note: note.trim() || (type === "call" ? `Call logged: ${outcome}` : ""),
            performedBy: "admin",
          },
          ...(type === "call" ? { lastContactedAt: new Date().toISOString() } : {}),
        }),
      });
      if (res.ok) {
        toast.success("Entry added");
        setNote(""); setShowAdd(false);
        onEntryAdded();
      } else { toast.error("Failed to add entry"); }
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      {/* Add Entry */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-navy">Activity Log</h3>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-xs">
            <Plus className="w-3.5 h-3.5" /> Log Activity
          </button>
        </div>

        {showAdd && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
            <div className="flex gap-2">
              <button onClick={() => setType("call")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${type === "call" ? "bg-navy text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
                Log Call
              </button>
              <button onClick={() => setType("note")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${type === "note" ? "bg-navy text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
                Add Note
              </button>
            </div>
            {type === "call" && (
              <div>
                <label className="label text-xs">Call Outcome</label>
                <div className="flex flex-wrap gap-2">
                  {OUTCOMES.map((o) => (
                    <button key={o} onClick={() => setOutcome(o)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${outcome === o ? "bg-navy text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-navy"}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <textarea className="input-field resize-none text-sm" rows={3}
              placeholder={type === "call" ? "Notes about this call..." : "Enter your note..."}
              value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={addEntry} disabled={loading} className="btn-primary text-xs">
                <Send className="w-3.5 h-3.5" /> {loading ? "Saving..." : "Save Entry"}
              </button>
              <button onClick={() => setShowAdd(false)} className="text-xs text-gray-500 hover:text-navy px-3">Cancel</button>
            </div>
          </div>
        )}

        {/* Log Timeline */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No activity logged yet</div>
          ) : (
            entries.map((entry: any) => {
              const Icon = TYPE_ICONS[entry.type] || Info;
              const colorClass = TYPE_COLORS[entry.type] || "bg-gray-100 text-gray-500";
              return (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-navy capitalize">
                        {entry.type.replace(/-/g, " ")}
                      </span>
                      {entry.outcome && (
                        <span className={`text-xs font-medium ${OUTCOME_COLORS[entry.outcome] || "text-gray-500"}`}>
                          — {entry.outcome}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">{timeAgo(entry.timestamp)}</span>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{entry.note}</p>
                    )}
                    <div className="text-xs text-gray-400 mt-0.5">{formatDateTime(entry.timestamp)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
