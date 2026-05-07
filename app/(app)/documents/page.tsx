"use client";
import { useState, useRef } from "react";
import { analyzeDocument } from "../lib/api";

export default function DocumentsPage() {
  const [file, setFile]       = useState<File | null>(null);
  const [symbol, setSymbol]   = useState("");
  const [question, setQuestion] = useState("");
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function run() {
    if (!file) return;
    setLoading(true); setError(""); setData(null);
    try {
      const res = await analyzeDocument(file, symbol || undefined, question || undefined);
      setData(res);
    } catch (e: any) {
      setError(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-100 p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Document Intelligence</h1>
        <p className="text-slate-400 text-sm">Upload PDFs, screenshots, broker statements — Perseus extracts what matters</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors mb-6 ${
          dragging ? "border-teal-400 bg-teal-500/5" : "border-slate-700 hover:border-slate-500"
        }`}
      >
        <input ref={fileRef} type="file" className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.csv"
          onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} />
        {file ? (
          <div>
            <div className="text-teal-400 text-2xl mb-2">📄</div>
            <div className="text-white font-medium">{file.name}</div>
            <div className="text-slate-500 text-xs mt-1">{(file.size / 1024).toFixed(0)} KB</div>
          </div>
        ) : (
          <div>
            <div className="text-slate-500 text-4xl mb-3">↑</div>
            <div className="text-slate-300 font-medium mb-1">Drop file or click to upload</div>
            <div className="text-slate-500 text-xs">PDF, PNG, JPG, WEBP, CSV — max 20MB</div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <input value={symbol} onChange={e => setSymbol(e.target.value)}
          placeholder="Symbol (optional — e.g. RELIANCE.NS)"
          className="bg-[#111827] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500" />
        <input value={question} onChange={e => setQuestion(e.target.value)}
          placeholder="Question (optional — e.g. What are the key risks?)"
          className="bg-[#111827] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500" />
      </div>

      <button onClick={run} disabled={!file || loading}
        className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 rounded-lg text-sm font-medium transition-colors mb-8">
        {loading ? "Analyzing document..." : "Analyze"}
      </button>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm mb-6">{error}</div>}

      {data && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs px-2 py-1 bg-teal-500/20 text-teal-300 rounded">{data.doc_type}</span>
              <span className="text-xs text-slate-500">{data.page_count} pages • {data.table_count} tables</span>
              <span className="ml-auto text-xs text-slate-500">Confidence {((data.confidence || 0) * 100).toFixed(0)}%</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{data.summary}</p>
          </div>

          {/* Key metrics */}
          {data.finance_schema?.metrics && Object.keys(data.finance_schema.metrics).length > 0 && (
            <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-5">
              <div className="text-xs font-semibold text-slate-400 mb-3">KEY METRICS</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(data.finance_schema.metrics).map(([k, v]: [string, any]) => (
                  <div key={k} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500 capitalize mb-1">{k.replace(/_/g, " ")}</div>
                    <div className="text-sm font-mono font-semibold text-white">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entities */}
          {data.entities?.length > 0 && (
            <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-5">
              <div className="text-xs font-semibold text-slate-400 mb-3">DETECTED ENTITIES</div>
              <div className="flex flex-wrap gap-2">
                {data.entities.slice(0, 20).map((e: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">{e}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
