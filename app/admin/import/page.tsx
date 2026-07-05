"use client";

import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { generateCSVTemplate } from "@/lib/csv-parser";
import { LOAN_TYPE_LABELS, LoanType } from "@/lib/document-checklists";
import toast from "react-hot-toast";

export default function ImportPage() {
  const [csvText, setCsvText] = useState("");
  const [preview, setPreview] = useState<any | null>(null);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function downloadTemplate() {
    const csv = generateCSVTemplate();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer-import-template.csv";
    a.click();
  }

  async function parseFile(file: File) {
    const text = await file.text();
    setCsvText(text);
    const res = await fetch("/api/records/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csvText: text }),
    });
    const data = await res.json();
    setPreview(data);
  }

  async function confirmImport() {
    if (!csvText) return;
    setImporting(true);
    try {
      const res = await fetch("/api/records/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText, confirm: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${data.imported} customers imported successfully!`);
        setImported(true);
        setPreview(null);
        setCsvText("");
      } else {
        toast.error("Import failed");
      }
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-navy">Import Existing Customers</h1>
        <p className="text-gray-500 text-sm mt-1">Bulk import your existing customer data from Excel or a CSV file.</p>
      </div>

      {imported && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <div className="font-bold text-green-800">Import successful!</div>
            <div className="text-green-600 text-sm">All customers have been created with empty document vaults. You can now upload documents for each customer.</div>
          </div>
        </div>
      )}

      {/* Step 1: Download Template */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-gold font-bold">1</span>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-navy mb-1">Download the Template</h2>
            <p className="text-gray-500 text-sm mb-4">
              Download the CSV template, fill in your existing customer data in Excel or Google Sheets, then save as CSV.
            </p>
            <button onClick={downloadTemplate} className="btn-navy text-sm">
              <Download className="w-4 h-4" /> Download CSV Template
            </button>

            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-medium text-gray-500 mb-2">Expected columns:</div>
              <div className="flex flex-wrap gap-2">
                {["Name*", "Phone*", "Email", "LoanType", "LoanAmount", "BankName", "DisbursementDate", "LoanAccountNumber", "EMIAmount", "Tenure", "City", "Notes"].map((col) => (
                  <span key={col} className={`text-xs px-2 py-1 rounded ${col.includes("*") ? "bg-navy text-white" : "bg-gray-200 text-gray-600"}`}>{col}</span>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-2">* Required fields</div>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              <strong>Loan Types accepted:</strong>{" "}
              {Object.values(LOAN_TYPE_LABELS).join(", ")}
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Upload */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-gold font-bold">2</span>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-navy mb-1">Upload Your CSV File</h2>
            <p className="text-gray-500 text-sm mb-4">Upload the filled CSV file to preview and import.</p>

            <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) parseFile(f); }} />

            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-gold transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Click to upload CSV file</div>
              <div className="text-xs text-gray-400 mt-1">or drag and drop</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Preview & Confirm */}
      {preview && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-gold font-bold">3</span>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-navy mb-1">Preview & Confirm Import</h2>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" /> {preview.valid?.length} valid records
                </div>
                {preview.errors?.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" /> {preview.errors?.length} errors
                  </div>
                )}
              </div>

              {preview.errors?.length > 0 && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="font-medium text-red-700 mb-2">Rows with errors (will be skipped):</div>
                  {preview.errors.map((err: any, i: number) => (
                    <div key={i} className="text-xs text-red-600">Row {err.row}: {err.message}</div>
                  ))}
                </div>
              )}

              <div className="overflow-x-auto rounded-xl border border-gray-200 mb-5">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 text-gray-600">#</th>
                      <th className="text-left px-3 py-2 text-gray-600">Name</th>
                      <th className="text-left px-3 py-2 text-gray-600">Phone</th>
                      <th className="text-left px-3 py-2 text-gray-600">Loan Type</th>
                      <th className="text-left px-3 py-2 text-gray-600">Bank</th>
                      <th className="text-left px-3 py-2 text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(preview.valid || []).slice(0, 20).map((r: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2 font-medium">{r.name}</td>
                        <td className="px-3 py-2 text-gray-600">{r.phone}</td>
                        <td className="px-3 py-2 text-gray-600">{LOAN_TYPE_LABELS[r.loanType as LoanType] || r.loanType}</td>
                        <td className="px-3 py-2 text-gray-600">{r.bankName || "—"}</td>
                        <td className="px-3 py-2 text-gray-600">{r.amount ? `₹${r.amount.toLocaleString("en-IN")}` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.valid?.length > 20 && (
                  <div className="px-3 py-2 text-xs text-gray-400 text-center">
                    ...and {preview.valid.length - 20} more records
                  </div>
                )}
              </div>

              <button onClick={confirmImport} disabled={importing || preview.valid?.length === 0} className="btn-primary disabled:opacity-50">
                {importing ? "Importing..." : `Confirm: Import ${preview.valid?.length} Customers`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
