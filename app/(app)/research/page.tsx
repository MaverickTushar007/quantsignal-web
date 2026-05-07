"use client";
import { useState } from "react";
import { fetchResearch } from "../lib/api";

type RiskFlag = { category: string; severity: string; description: string; invalidation_trigger?: string };
type EvidenceItem = { source: string; content: string; weight: number; timestamp: string; url?: string };

export default function ResearchPage() {
  const [symbol, setSymbol]   = useState("");
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [tab, setTab]         = useState<"evidence"|"risks"|"questions">("evidence");

  async function run() {
    if (!symbol.trim()) return;
    setLoading(true); setError(""); setData(null);
    try {
      const res = await fetchResearch(symbol.trim().toUpperCase());
      setData(res);
    } catch (e: any) {
      setError(e.message || "Research failed");
    } finally {
      setLoading(false);
    }
  }

  const confidenceColor = (c: string) =>
    c === "high" ? "text-emerald-400" : c === "moderate" ? "text-amber-400" : "text-red-400";

  const severityColor = (s: string) =>
    s === "high" ? "bg-red-500/20 border-red-500/40 text-red-300" :
    s === "medium" ? "bg-amber-500/20 border-amber-500/40 text-amber-300" :
    "bg-slate-500/20 border-slate-500/40 text-slate-300";

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-100 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Perseus Research</h1>
        <p className="text-slate-400 text-sm">Evidence-grounded intelligence for any ticker</p>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-8">
        <input
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
          onKeyDown={e => e.key === "Enter" && run()}
          placeholder="RELIANCE.NS, BTC-USD, NIFTY50..."
          className="flex-1 bg-[#111827] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
        <button
          onClick={run}
          disabled={loading}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? "Analyzing..." : "Research"}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm mb-6">{error}</div>}

      {data && (
        <div className="space-y-4">
          {/* Thesis hero */}
          <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-xl font-bold text-white">{data.symbol}</span>
              {data.direction && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  data.direction === "BUY"
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : data.direction === "SELL"
                    ? "bg-red-500/20 border-red-500/40 text-red-300"
                    : "bg-slate-500/20 border-slate-500/40 text-slate-300"
                }`}>{data.direction}</span>
              )}
              <span className={`text-sm font-medium ${confidenceColor(data.confidence)}`}>
                {data.confidence?.toUpperCase()} CONFIDENCE
              </span>
              {data.regime && (
                <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300">
                  {data.regime}
                </span>
              )}
              <span className="ml-auto text-xs text-slate-500">
                {new Date(data.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed">{data.summary}</p>
          </div>

          {/* Decision strip */}
          {(data.probability || data.expected_value || data.kelly_size) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {data.probability && (
                <div className="bg-[#111827] border border-slate-700/50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-1">Probability</div>
                  <div className="text-lg font-mono font-semibold text-white">{(data.probability * 100).toFixed(1)}%</div>
                </div>
              )}
              {data.expected_value && (
                <div className="bg-[#111827] border border-slate-700/50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-1">Expected Value</div>
                  <div className="text-lg font-mono font-semibold text-white">{data.expected_value}</div>
                </div>
              )}
              {data.kelly_size && (
                <div className="bg-[#111827] border border-slate-700/50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-1">Kelly Size</div>
                  <div className="text-lg font-mono font-semibold text-white">{(data.kelly_size * 100).toFixed(1)}%</div>
                </div>
              )}
              {data.stop_loss && (
                <div className="bg-[#111827] border border-slate-700/50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-1">Stop Loss</div>
                  <div className="text-lg font-mono font-semibold text-red-300">{data.stop_loss}</div>
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 bg-[#111827] border border-slate-700/50 rounded-lg p-1 w-fit">
            {(["evidence","risks","questions"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-colors capitalize ${
                  tab === t ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                }`}>{t}
                {t === "risks" && data.risk_flags?.length ? ` (${data.risk_flags.length})` : ""}
                {t === "evidence" && data.evidence?.length ? ` (${data.evidence.length})` : ""}
              </button>
            ))}
          </div>

          {/* Evidence */}
          {tab === "evidence" && (
            <div className="space-y-2">
              {data.evidence?.length ? data.evidence.map((e: EvidenceItem, i: number) => (
                <div key={i} className="bg-[#111827] border border-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded">{e.source}</span>
                    <span className="text-xs text-slate-500">{new Date(e.timestamp).toLocaleString()}</span>
                    <div className="ml-auto flex items-center gap-1">
                      <div className="h-1 w-16 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${e.weight * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">{e.content}</p>
                  {e.url && <a href={e.url} target="_blank" className="text-xs text-teal-400 hover:underline mt-1 block">Source →</a>}
                </div>
              )) : <p className="text-slate-500 text-sm">No evidence items available.</p>}
            </div>
          )}

          {/* Risks */}
          {tab === "risks" && (
            <div className="space-y-2">
              {data.risk_flags?.length ? data.risk_flags.map((r: RiskFlag, i: number) => (
                <div key={i} className={`border rounded-lg p-4 ${severityColor(r.severity)}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase">{r.severity}</span>
                    <span className="text-xs opacity-70">{r.category}</span>
                  </div>
                  <p className="text-sm">{r.description}</p>
                  {r.invalidation_trigger && (
                    <p className="text-xs opacity-60 mt-1">Invalidation: {r.invalidation_trigger}</p>
                  )}
                </div>
              )) : <p className="text-slate-500 text-sm">No risk flags.</p>}
              {data.contradictions?.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mt-2">
                  <div className="text-xs font-semibold text-orange-300 mb-2">CONTRADICTIONS</div>
                  {data.contradictions.map((c: string, i: number) => (
                    <p key={i} className="text-sm text-orange-200">{c}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Open questions */}
          {tab === "questions" && (
            <div className="bg-[#111827] border border-slate-700/50 rounded-lg p-5">
              <div className="text-xs font-semibold text-slate-400 mb-3">OPEN QUESTIONS</div>
              {data.open_questions?.length ? data.open_questions.map((q: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2">
                  <span className="text-slate-600 text-sm">•</span>
                  <p className="text-sm text-slate-300">{q}</p>
                </div>
              )) : <p className="text-slate-500 text-sm">No open questions.</p>}
            </div>
          )}

          {/* Trust banner */}
          <div className="bg-[#0d1520] border border-slate-700/50 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-500 mb-3 tracking-wider">TRUST SIGNALS</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* Freshness */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Freshness</span>
                <span className={`text-xs font-semibold ${
                  (data.freshness_seconds || 9999) < 120 ? "text-emerald-400" :
                  (data.freshness_seconds || 9999) < 3600 ? "text-amber-400" : "text-red-400"
                }`}>
                  {(data.freshness_seconds || 0) < 120 ? "● Live" :
                   (data.freshness_seconds || 0) < 3600 ? `● ${Math.round((data.freshness_seconds||0)/60)}m old` :
                   `● ${Math.round((data.freshness_seconds||0)/3600)}h old`}
                </span>
              </div>
              {/* Verifier */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Verifier</span>
                <span className={`text-xs font-semibold ${
                  data.verification?.passed ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {data.verification?.passed ? "✓ Passed" : "⚠ Review"}
                  {" "}({((data.verification?.score || 0) * 100).toFixed(0)}%)
                </span>
              </div>
              {/* Citation coverage */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Citations</span>
                <span className="text-xs font-semibold text-slate-300">
                  {((data.verification?.citation_coverage || 0) * 100).toFixed(0)}% covered
                </span>
              </div>
              {/* Model */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Model</span>
                <span className="text-xs font-semibold text-slate-300 truncate">
                  {data.model_used || "ensemble_v2"}
                </span>
              </div>
              {/* Issues */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Issues</span>
                <span className={`text-xs font-semibold ${
                  (data.verification?.issues?.length || 0) === 0 ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {(data.verification?.issues?.length || 0) === 0
                    ? "None"
                    : data.verification.issues.join(", ")}
                </span>
              </div>
            </div>
            {/* Stale warning */}
            {(data.freshness_seconds || 0) > 14400 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                <span>⚠</span>
                <span>Data is {Math.round((data.freshness_seconds||0)/3600)}h old — confidence may be reduced</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
