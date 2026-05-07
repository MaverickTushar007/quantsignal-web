"use client";
import { useState } from "react";
import { fetchPortfolioXRay } from "../lib/api";

type Holding = { symbol: string; value: string; side: string; sector: string };

export default function XRayPage() {
  const [holdings, setHoldings] = useState<Holding[]>([
    { symbol: "", value: "", side: "LONG", sector: "" }
  ]);
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  function addRow() {
    setHoldings(h => [...h, { symbol: "", value: "", side: "LONG", sector: "" }]);
  }
  function updateRow(i: number, field: keyof Holding, val: string) {
    setHoldings(h => h.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }
  function removeRow(i: number) {
    setHoldings(h => h.filter((_, idx) => idx !== i));
  }

  async function run() {
    const valid = holdings.filter(h => h.symbol && h.value);
    if (!valid.length) return;
    setLoading(true); setError(""); setData(null);
    try {
      const payload = valid.map(h => ({
        symbol: h.symbol.toUpperCase(),
        value: parseFloat(h.value),
        side: h.side,
        sector: h.sector || undefined,
      }));
      const res = await fetchPortfolioXRay(payload, true);
      setData(res);
    } catch (e: any) {
      setError(e.message || "X-Ray failed");
    } finally {
      setLoading(false);
    }
  }

  const severityColor = (s: string) =>
    s === "high" ? "border-red-500/40 bg-red-500/10 text-red-300" :
    s === "medium" ? "border-amber-500/40 bg-amber-500/10 text-amber-300" :
    "border-slate-600 bg-slate-800 text-slate-300";

  const fitColor = (score: number) =>
    score >= 0.7 ? "text-emerald-400" : score >= 0.4 ? "text-amber-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-100 p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Portfolio X-Ray</h1>
        <p className="text-slate-400 text-sm">Concentration, regime alignment, sector risk, and suggested actions</p>
      </div>

      {/* Holdings input */}
      <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-5 mb-6">
        <div className="text-xs font-semibold text-slate-400 mb-4">YOUR HOLDINGS</div>
        <div className="space-y-2">
          {holdings.map((h, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input value={h.symbol} onChange={e => updateRow(i, "symbol", e.target.value)}
                placeholder="RELIANCE.NS"
                className="col-span-3 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500" />
              <input value={h.value} onChange={e => updateRow(i, "value", e.target.value)}
                placeholder="₹50000"
                className="col-span-3 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500" />
              <select value={h.side} onChange={e => updateRow(i, "side", e.target.value)}
                className="col-span-2 bg-slate-800 border border-slate-700 rounded px-2 py-2 text-sm text-white focus:outline-none">
                <option>LONG</option><option>SHORT</option>
              </select>
              <input value={h.sector} onChange={e => updateRow(i, "sector", e.target.value)}
                placeholder="Sector"
                className="col-span-3 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500" />
              <button onClick={() => removeRow(i)} className="col-span-1 text-slate-600 hover:text-red-400 text-lg">×</button>
            </div>
          ))}
        </div>
        <button onClick={addRow} className="mt-3 text-xs text-teal-400 hover:text-teal-300">+ Add holding</button>
      </div>

      <button onClick={run} disabled={loading}
        className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 rounded-lg text-sm font-medium transition-colors mb-8">
        {loading ? "Running X-Ray..." : "Run X-Ray"}
      </button>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm mb-6">{error}</div>}

      {data && (
        <div className="space-y-4">
          {/* Overview cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Total Value", val: `₹${data.total_value?.toLocaleString()}` },
              { label: "Net Exposure", val: `${((data.net_exposure_pct || 0) * 100).toFixed(1)}%` },
              { label: "Top 5 Concentration", val: `${((data.top5_concentration || 0) * 100).toFixed(1)}%` },
              { label: "Est. Annual Vol", val: `${((data.estimated_annual_vol || 0) * 100).toFixed(1)}%` },
              { label: "Holdings", val: data.holdings_count },
              { label: "Regime Fit", val: <span className={fitColor(data.regime_fit_score || 0)}>{((data.regime_fit_score || 0) * 100).toFixed(0)}%</span> },
            ].map((c, i) => (
              <div key={i} className="bg-[#111827] border border-slate-700/50 rounded-lg p-4">
                <div className="text-xs text-slate-500 mb-1">{c.label}</div>
                <div className="text-lg font-mono font-semibold text-white">{c.val}</div>
              </div>
            ))}
          </div>

          {/* Regime */}
          {data.current_regime && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-3 text-sm text-blue-300">
              Current regime: <span className="font-semibold">{data.current_regime}</span>
              {data.misaligned_count > 0 && <span className="ml-3 text-amber-300">⚠ {data.misaligned_count} position(s) misaligned</span>}
            </div>
          )}

          {/* Alerts */}
          {data.alerts?.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400">ALERTS</div>
              {data.alerts.map((a: any, i: number) => (
                <div key={i} className={`border rounded-lg p-4 ${severityColor(a.severity)}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase">{a.severity}</span>
                    <span className="text-xs opacity-60">{a.category} • {a.symbol}</span>
                  </div>
                  <p className="text-sm">{a.message}</p>
                  {a.action && <p className="text-xs opacity-60 mt-1">→ {a.action}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Sector breakdown */}
          {data.sector_breakdown && Object.keys(data.sector_breakdown).length > 0 && (
            <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-5">
              <div className="text-xs font-semibold text-slate-400 mb-4">SECTOR BREAKDOWN</div>
              <div className="space-y-2">
                {Object.entries(data.sector_breakdown)
                  .sort(([,a],[,b]) => (b as number) - (a as number))
                  .map(([sector, pct]: [string, any]) => (
                  <div key={sector}>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{sector}</span>
                      <span>{(pct * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested actions */}
          {data.suggested_actions?.length > 0 && (
            <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-5">
              <div className="text-xs font-semibold text-slate-400 mb-3">SUGGESTED ACTIONS</div>
              {data.suggested_actions.map((a: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2">
                  <span className="text-teal-500 text-sm">→</span>
                  <p className="text-sm text-slate-300">{a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
