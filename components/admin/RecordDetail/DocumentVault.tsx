"use client";

import { useState, useRef } from "react";
import { Upload, Eye, Download, Printer, Send, Check, X, AlertCircle, FolderOpen, Plus } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

const DOC_STATUS_COLORS: Record<string, string> = {
  Pending: "bg-gray-100 text-gray-500", Received: "bg-blue-100 text-blue-700",
  Verified: "bg-green-100 text-green-700", Rejected: "bg-red-100 text-red-700",
};

function DocPreviewModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const isPDF = name.toLowerCase().endsWith(".pdf") || url.includes("application/pdf");
  return (
    <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-navy truncate">{name}</h3>
          <div className="flex gap-2">
            <a href={url} download={name} className="btn-navy text-xs">
              <Download className="w-3.5 h-3.5" /> Download
            </a>
            <button onClick={() => window.print()} className="btn-outline text-xs">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="h-[calc(90vh-80px)] overflow-auto bg-gray-100 flex items-center justify-center p-4">
          {isPDF ? (
            <iframe src={url} className="w-full h-full rounded" title={name} />
          ) : (
            <img src={url} alt={name} className="max-w-full max-h-full object-contain rounded shadow" />
          )}
        </div>
      </div>
    </div>
  );
}

interface Props { record: any; onUpdate: () => void; }

export default function DocumentVault({ record, onUpdate }: Props) {
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [bankDocLabel, setBankDocLabel] = useState("");
  const [bankDocFolder, setBankDocFolder] = useState("bank-docs");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadSlot, setActiveUploadSlot] = useState<string | null>(null);

  async function uploadFile(file: File, folder: string, docSlug?: string, docLabel?: string) {
    setUploading(docSlug || folder);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("recordId", record.id);
      fd.append("folder", folder);
      if (docSlug) fd.append("docSlug", docSlug);
      if (docLabel) fd.append("docLabel", docLabel);
      fd.append("uploadedVia", "admin");

      const res = await fetch("/api/documents/upload", { method: "POST", body: fd });
      if (res.ok) {
        toast.success("Document uploaded successfully");
        onUpdate();
      } else { toast.error("Upload failed"); }
    } finally { setUploading(null); setBankDocLabel(""); }
  }

  function triggerUpload(slot: string) {
    setActiveUploadSlot(slot);
    fileInputRef.current?.click();
  }

  async function assignUnmatched(unmatchedId: string, targetSlug: string) {
    const res = await fetch("/api/documents/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId: record.id, unmatchedDocId: unmatchedId, targetSlug }),
    });
    if (res.ok) { toast.success("Document assigned"); onUpdate(); }
    else { toast.error("Assignment failed"); }
  }

  async function updateDocStatus(slug: string, status: string) {
    const requiredDocs = [...(record.requiredDocs || [])];
    const idx = requiredDocs.findIndex((d: any) => d.slug === slug);
    if (idx >= 0) {
      requiredDocs[idx].status = status;
      await fetch(`/api/records/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requiredDocs }),
      });
      toast.success("Status updated");
      onUpdate();
    }
  }

  function sendDocOnWhatsApp(fileUrl: string, fileName: string) {
    const msg = encodeURIComponent(`Please find your document: ${fileName}`);
    const waUrl = `https://wa.me/91${record.phone}?text=${msg}`;
    window.open(waUrl, "_blank");
  }

  const unmatched = record.unmatchedDocs || [];

  return (
    <div className="space-y-5">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file || !activeUploadSlot) return;
          if (activeUploadSlot.startsWith("req:")) {
            const slug = activeUploadSlot.slice(4);
            const docItem = record.requiredDocs?.find((d: any) => d.slug === slug);
            uploadFile(file, "required-docs", slug, docItem?.label);
          } else {
            uploadFile(file, bankDocFolder, undefined, bankDocLabel || file.name);
          }
          e.target.value = "";
        }}
      />

      {/* Unmatched Documents */}
      {unmatched.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-orange-800">Unmatched Documents ({unmatched.length})</h3>
            <span className="text-xs text-orange-600">Received via WhatsApp — assign to correct slot</span>
          </div>
          <div className="space-y-3">
            {unmatched.map((doc: any) => (
              <div key={doc.id} className="bg-white rounded-xl p-4 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-navy truncate">{doc.fileName}</div>
                  <div className="text-xs text-gray-400">{doc.caption || "No caption"} • {formatDateTime(doc.receivedAt)}</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => setPreview({ url: doc.fileUrl, name: doc.fileName })} className="text-xs border border-gray-200 px-2.5 py-1.5 rounded-lg hover:border-navy transition-colors">
                    <Eye className="w-3.5 h-3.5 inline mr-1" />Preview
                  </button>
                  <select className="input-field py-1.5 text-xs bg-white"
                    onChange={(e) => { if (e.target.value) assignUnmatched(doc.id, e.target.value); }}>
                    <option value="">Assign to slot...</option>
                    {(record.requiredDocs || []).map((d: any) => (
                      <option key={d.slug} value={d.slug}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Folder 1: Required Documents */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-gold" />
              <h3 className="font-bold text-navy">Required Documents</h3>
            </div>
            <div className="text-sm text-gray-500">
              {(record.requiredDocs || []).filter((d: any) => d.status !== "Pending").length} / {(record.requiredDocs || []).length} received
            </div>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full">
            <div
              className="h-2 bg-gold rounded-full transition-all"
              style={{
                width: (record.requiredDocs || []).length > 0
                  ? `${((record.requiredDocs || []).filter((d: any) => d.status !== "Pending").length / (record.requiredDocs || []).length) * 100}%`
                  : "0%"
              }}
            />
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {(record.requiredDocs || []).map((doc: any) => (
            <div key={doc.slug} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${doc.status === "Verified" ? "bg-green-500" : doc.status === "Received" ? "bg-blue-500" : doc.status === "Rejected" ? "bg-red-500" : "bg-gray-300"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-navy">{doc.label}</span>
                    <span className={`badge-status text-xs ${DOC_STATUS_COLORS[doc.status] || "bg-gray-100"}`}>{doc.status}</span>
                    {doc.status !== "Verified" && (
                      <select className="text-xs border border-gray-200 rounded px-2 py-0.5 bg-white"
                        value={doc.status}
                        onChange={(e) => updateDocStatus(doc.slug, e.target.value)}>
                        <option>Pending</option>
                        <option>Received</option>
                        <option>Verified</option>
                        <option>Rejected</option>
                      </select>
                    )}
                  </div>

                  {/* Uploaded files */}
                  {(doc.files || []).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doc.files.map((f: any, fi: number) => (
                        <div key={fi} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                          <span className="text-xs text-gray-600 max-w-28 truncate">{f.fileName}</span>
                          <button onClick={() => setPreview({ url: f.fileUrl, name: f.fileName })} className="text-blue-500 hover:text-blue-700"><Eye className="w-3 h-3" /></button>
                          <a href={f.fileUrl} download={f.fileName} className="text-gray-500 hover:text-navy"><Download className="w-3 h-3" /></a>
                          <button onClick={() => sendDocOnWhatsApp(f.fileUrl, f.fileName)} className="text-green-500 hover:text-green-700"><Send className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => triggerUpload(`req:${doc.slug}`)}
                    disabled={uploading === doc.slug}
                    className="mt-2 text-xs text-gold border border-gold/30 px-3 py-1.5 rounded-lg hover:bg-gold/5 transition-colors disabled:opacity-50"
                  >
                    {uploading === doc.slug ? "Uploading..." : (doc.files?.length > 0 ? "+ Add More" : "+ Upload")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Folder 2 & 3: Bank Docs / Application Package */}
      {["application-package", "bank-docs"].map((folder) => {
        const folderDocs = (record.bankDocs || []).filter((d: any) => d.folder === folder);
        const title = folder === "application-package" ? "Application Package" : "Bank Documents";
        const subtitle = folder === "application-package"
          ? "Documents submitted to bank"
          : "Documents received from bank (post-disbursal, ITR certs, NOC, etc.)";

        return (
          <div key={folder} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-navy" />
                <div>
                  <h3 className="font-bold text-navy">{title}</h3>
                  <p className="text-xs text-gray-400">{subtitle}</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {folderDocs.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm">No documents yet</div>
              )}
              {folderDocs.map((doc: any) => (
                <div key={doc.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-navy truncate">{doc.label || doc.fileName}</div>
                    <div className="text-xs text-gray-400">{formatDateTime(doc.uploadedAt)}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setPreview({ url: doc.fileUrl, name: doc.fileName })} className="text-xs border border-gray-200 px-2.5 py-1.5 rounded-lg hover:border-navy transition-colors">
                      <Eye className="w-3.5 h-3.5 inline" />
                    </button>
                    <a href={doc.fileUrl} download={doc.fileName} className="text-xs border border-gray-200 px-2.5 py-1.5 rounded-lg hover:border-navy transition-colors">
                      <Download className="w-3.5 h-3.5 inline" />
                    </a>
                    <button onClick={() => sendDocOnWhatsApp(doc.fileUrl, doc.label || doc.fileName)} className="text-xs border border-green-200 text-green-600 px-2.5 py-1.5 rounded-lg hover:bg-green-50 transition-colors">
                      <Send className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Upload new bank doc */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <input className="input-field py-2 text-sm flex-1" placeholder="Document label (e.g., NOC Certificate)"
                  value={bankDocLabel} onChange={(e) => setBankDocLabel(e.target.value)} />
                <button
                  onClick={() => { setBankDocFolder(folder); triggerUpload(`bank:${folder}`); }}
                  disabled={uploading === folder}
                  className="btn-primary text-xs whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {uploading === folder ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Preview Modal */}
      {preview && <DocPreviewModal url={preview.url} name={preview.name} onClose={() => setPreview(null)} />}
    </div>
  );
}
