"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import toast from "react-hot-toast";

export default function UploadPage() {
  const { token } = useParams<{ token: string }>();
  const [tokenData, setTokenData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/upload-token?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) setTokenData(data);
        else setError(data.error || "Invalid link");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [token]);

  async function uploadFile(file: File, slug: string, label: string) {
    setUploading(slug);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("recordId", tokenData.recordId);
      fd.append("folder", "required-docs");
      fd.append("docSlug", slug);
      fd.append("docLabel", label);
      fd.append("uploadedVia", "browser");

      const res = await fetch("/api/documents/upload", { method: "POST", body: fd });
      if (res.ok) {
        toast.success(`${label} uploaded!`);
        setUploaded((prev) => ({ ...prev, [slug]: true }));
      } else { toast.error("Upload failed. Please try again."); }
    } finally { setUploading(null); }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm text-center shadow-lg">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-navy mb-2">Invalid Link</h2>
        <p className="text-gray-500 text-sm">{error === "Token expired" ? "This upload link has expired. Please request a new one from Srivastava Associates." : "This link is not valid. Please contact Srivastava Associates."}</p>
        <a href="https://wa.me/message/FMB4BVPRQLMUC1" target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 justify-center">Contact on WhatsApp</a>
      </div>
    </div>
  );

  const record = tokenData.record;
  const docs = record.requiredDocs || [];
  const uploadedCount = docs.filter((d: any) => d.status !== "Pending" || uploaded[d.slug]).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy py-6 px-4 text-center">
        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden relative mx-auto mb-2">
          <img src="/images/logo.png" alt="SA Logo" className="w-full h-full object-contain p-1" />
        </div>
        <h1 className="text-white font-bold">Srivastava Associates</h1>
        <p className="text-gray-400 text-sm mt-1">Secure Document Upload</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center">
              <span className="text-gold font-bold">{record.name?.charAt(0)}</span>
            </div>
            <div>
              <div className="font-bold text-navy">{record.name}</div>
              <div className="text-sm text-gray-500">{LOAN_TYPE_LABELS[record.loanType as LoanType] || record.loanType}</div>
            </div>
          </div>
          <div className="text-xs text-gray-400 mb-2">Documents uploaded: {uploadedCount}/{docs.length}</div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div className="h-2 bg-gold rounded-full transition-all" style={{ width: `${(uploadedCount / docs.length) * 100}%` }} />
          </div>
        </div>

        <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file || !activeSlot) return;
            const doc = docs.find((d: any) => d.slug === activeSlot);
            uploadFile(file, activeSlot, doc?.label || activeSlot);
            e.target.value = "";
          }} />

        <div className="space-y-3">
          {docs.map((doc: any) => {
            const isDone = doc.status !== "Pending" || uploaded[doc.slug];
            return (
              <div key={doc.slug} className={`bg-white rounded-xl border p-4 flex items-center gap-3 ${isDone ? "border-green-200" : "border-gray-100"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? "bg-green-100" : "bg-gray-100"}`}>
                  {isDone ? <CheckCircle className="w-4 h-4 text-green-600" /> : <FileText className="w-4 h-4 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isDone ? "text-green-700" : "text-navy"}`}>{doc.label}</div>
                  {doc.description && <div className="text-xs text-gray-400">{doc.description}</div>}
                </div>
                {!isDone && (
                  <button
                    onClick={() => { setActiveSlot(doc.slug); fileRef.current?.click(); }}
                    disabled={uploading === doc.slug}
                    className="btn-primary text-xs py-2 px-3 whitespace-nowrap"
                  >
                    {uploading === doc.slug ? "Uploading..." : <><Upload className="w-3.5 h-3.5" /> Upload</>}
                  </button>
                )}
                {isDone && <span className="text-xs text-green-600 font-medium">Uploaded</span>}
              </div>
            );
          })}
        </div>

        {uploadedCount === docs.length && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
            <div className="font-bold text-green-800">All documents uploaded!</div>
            <div className="text-green-600 text-sm mt-1">Our team will review and get back to you shortly.</div>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-400">
          Files are encrypted and securely stored. Questions?{" "}
          <a href="https://wa.me/message/FMB4BVPRQLMUC1" target="_blank" rel="noopener noreferrer" className="text-gold">WhatsApp us</a>
        </div>
      </div>
    </div>
  );
}
