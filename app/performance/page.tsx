"use client";
import { useState, useEffect } from "react";

const API = "https://web-production-1a093.up.railway.app/api/v1";
const mono = "'IBM Plex Mono', monospace";

function EquityChart({ curve, benchmarks }: { curve: any[], benchmarks?: any }) {
  if (!curve || curve.length < 2) return null;
  const W = 600, H = 160, P = 16;
  const vals = curve.map((p: any) => p.cumulative_pnl);
  const niftyVals = benchmarks?.["Nifty 50"]?.curve?.map((p: any) => p.cumulative_pnl) || [];
  const spVals = benchmarks?.["S&P 500"]?.curve?.map((p: any) => p.cumulative_pnl) || [];
  const allVals = [...vals, ...niftyVals, ...spVals];
  const min = Math.min(...allVals, 0);
  const max = Math.max(...allVals, 1);
  const range = max - min || 1;
  const toY = (v: number) => P + ((max - v) / range) * (H - P * 2);
  const toPts = (arr: number[]) => arr.map((v, i) =>
    `${P + (i / (arr.length - 1)) * (W - P * 2)},${toY(v)}`).join(" ");
  const zY = toY(0);
  const last = vals[vals.length - 1];
  const col = last >= 0 ? "#00ff88" : "#ff4466";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 140 }} preserveAspectRatio="none">
      <line x1={P} y1={zY} x2={W-P} y2={zY} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4,4"/>
      {niftyVals.length > 1 && <polyline points={toPts(niftyVals)} fill="none" stroke="rgba(255,170,0,0.5)" strokeWidth="1" strokeDasharray="4,3"/>}
      {spVals.length > 1 && <polyline points={toPts(spVals)} fill="none" stroke="rgba(100,150,255,0.5)" strokeWidth="1" strokeDasharray="4,3"/>}
      <polygon points={`${P},${zY} ${toPts(vals)} ${W-P},${zY}`} fill={last>=0?"rgba(0,255,136,0.07)":"rgba(255,68,102,0.07)"}/>
      <polyline points={toPts(vals)} fill="none" stroke={col} strokeWidth="2"/>
    </svg>
  );
}

function DrawdownChart({ curve }: { curve: any[] }) {
  if (!curve || curve.length < 2) return null;
  const W = 600, H = 80, P = 16;
  const vals = curve.map((p: any) => p.drawdown);
  const min = Math.min(...vals, -1);
  const range = Math.abs(min) || 1;
  const pts = curve.map((p: any, i: number) => {
    const x = P + (i / (curve.length - 1)) * (W - P * 2);
    const y = P + (Math.abs(p.drawdown) / range) * (H - P * 2);
    return `${x},${y}`;
  }).join(" ");
  const maxDD = Math.min(...vals);
  const maxIdx = vals.indexOf(maxDD);
  const maxX = P + (maxIdx / (curve.length - 1)) * (W - P * 2);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 80 }} preserveAspectRatio="none">
      <polygon points={`${P},${P} ${pts} ${W-P},${P}`} fill="rgba(255,82,82,0.12)"/>
      <polyline points={pts} fill="none" stroke="#ff5252" strokeWidth="1.5"/>
      <line x1={maxX} y1={P} x2={maxX} y2={H-P} stroke="rgba(255,82,82,0.4)" strokeWidth="1" strokeDasharray="3,3"/>
    </svg>
  );
}

export default function Performance() {
  const [summary, setSummary] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/history/summary`).then(r => r.json()),
      fetch(`${API}/history/trades?limit=60`).then(r => r.json()),
    ]).then(([s, t]) => { setSummary(s); setTrades(t.trades || []); setLoading(false); })
    .catch(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? trades
    : filter === "HIGH" ? trades.filter((t:any) => t.confidence === "HIGH")
    : trades.filter((t:any) => t.outcome === filter);

  if (loading) return (
    <div style={{ background: "#060608", height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
      Loading...
    </div>
  );

  const pnlPositive = summary?.total_pnl >= 0;

  return (
    <div style={{ background: "#060608", minHeight: "100dvh", fontFamily: mono, color: "#e2e8f0" }}>

      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
        <a href="/dashboard" style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textDecoration: "none", letterSpacing: "0.08em" }}>← BACK</a>
        <span style={{ color: "#00ff88", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}>SIGNAL PERFORMANCE</span>
        <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.2)" }}>90 days</span>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: 600, margin: "0 auto" }}>

        {/* Stats — 2x2 grid + full width P&L */}
        {summary && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              {[
                { label: "WIN RATE", value: `${summary.win_rate}%`, sub: "all signals", color: summary.win_rate >= 55 ? "#00ff88" : "#ffc800" },
                { label: "HIGH CONF WR", value: `${summary.high_conf_win_rate}%`, sub: `${summary.high_conf_trades} trades`, color: "#00ff88" },
                { label: "TOTAL SIGNALS", value: summary.total_trades, sub: "last 90 days", color: "#fff" },
                { label: "TP HITS", value: summary.tp_hits, sub: `${summary.sl_hits} SL hits`, color: "#00ff88" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Risk metrics row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
              {[
                { label: "SHARPE RATIO", value: summary.sharpe_ratio ?? "—", sub: "risk-adjusted return", color: (summary.sharpe_ratio ?? 0) >= 1 ? "#00ff88" : "#ffc800" },
                { label: "MAX DRAWDOWN", value: `${summary.max_drawdown ?? "—"}%`, sub: "peak to trough", color: "#ff5252" },
                { label: "CALMAR RATIO", value: summary.calmar_ratio ?? "—", sub: "return / max DD", color: (summary.calmar_ratio ?? 0) >= 1 ? "#00ff88" : "#ffc800" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Cumul P&L — full width */}
            <div style={{ background: pnlPositive ? "rgba(0,255,136,0.05)" : "rgba(255,68,102,0.05)", border: `1px solid ${pnlPositive?"rgba(0,255,136,0.2)":"rgba(255,68,102,0.2)"}`, borderRadius: 10, padding: "14px 16px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: 4 }}>CUMULATIVE P&L</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Following all BUY/SELL signals</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: pnlPositive ? "#00ff88" : "#ff4466" }}>
                {pnlPositive ? "+" : ""}{summary.total_pnl}%
              </div>
            </div>
          </>
        )}

        {/* Equity curve */}
        {summary?.equity_curve && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: 12 }}>EQUITY CURVE</div>
            <EquityChart curve={summary.equity_curve} benchmarks={summary.benchmark} />
            {summary.benchmark && (
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                <span style={{ fontSize: 9, color: "#00ff88" }}>— QuantSignal: +{summary.total_pnl}%</span>
                {summary.benchmark["Nifty 50"] && <span style={{ fontSize: 9, color: "rgba(255,170,0,0.7)" }}>-- Nifty 50: {summary.benchmark["Nifty 50"].return}%</span>}
                {summary.benchmark["S&P 500"] && <span style={{ fontSize: 9, color: "rgba(100,150,255,0.7)" }}>-- S&P 500: {summary.benchmark["S&P 500"].return}%</span>}
              </div>
            )}
          </div>
        )}


        {/* Benchmark comparison hero */}
        {summary?.benchmark?.["Nifty 50"] && (
          <div style={{ background: "linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,255,136,0.02))", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 10, padding: "16px 20px", marginBottom: 10 }}>
            <div style={{ fontSize: 8, color: "rgba(0,255,136,0.5)", letterSpacing: "0.12em", marginBottom: 8 }}>VS BENCHMARK — SAME PERIOD</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>QuantSignal signals</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#00ff88" }}>+{summary.total_pnl}%</div>
              </div>
              <div style={{ fontSize: 28, color: "rgba(255,255,255,0.15)", fontWeight: 300 }}>vs</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Nifty 50 buy & hold</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: summary.benchmark["Nifty 50"].return >= 0 ? "#00ff88" : "#ff5252" }}>
                  {summary.benchmark["Nifty 50"].return >= 0 ? "+" : ""}{summary.benchmark["Nifty 50"].return}%
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(0,255,136,0.08)", borderRadius: 6, textAlign: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#00ff88" }}>
                +{(summary.total_pnl - summary.benchmark["Nifty 50"].return).toFixed(1)}% outperformance vs Nifty 50
              </span>
            </div>
          </div>
        )}
        {/* Drawdown curve */}
        {summary?.dd_curve && (
          <div style={{ background: "rgba(255,82,82,0.03)", border: "1px solid rgba(255,82,82,0.12)", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 8, color: "rgba(255,82,82,0.6)", letterSpacing: "0.12em" }}>DRAWDOWN CURVE</div>
              <div style={{ fontSize: 9, color: "#ff5252", fontWeight: 700 }}>Max: {summary.max_drawdown}%</div>
            </div>
            <DrawdownChart curve={summary.dd_curve} />
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", marginTop: 6 }}>
              Shows % below peak at each point in time. Dashed line = maximum drawdown point.
            </div>
          </div>
        )}
        {/* Explainer box */}
        <div style={{ background: "rgba(0,170,255,0.04)", border: "1px solid rgba(0,170,255,0.15)", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "#00aaff", letterSpacing: "0.12em", marginBottom: 8 }}>HOW THIS WORKS</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
            Every day our ML model generates BUY/SELL/HOLD signals for 186 assets. This page shows what would have happened if you followed those signals over the last 90 days.
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "TP HIT", color: "#00ff88", desc: "Price reached the take-profit target → profitable trade" },
              { label: "SL HIT", color: "#ff4466", desc: "Price hit the stop-loss before TP → trade closed at loss" },
              { label: "EXPIRED", color: "rgba(255,255,255,0.3)", desc: "Neither TP nor SL hit within 5 days → closed at market price" },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 8, fontWeight: 800, color: r.color, background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 3, flexShrink: 0, marginTop: 1 }}>{r.label}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{r.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { label: "✓ WALK-FORWARD VALIDATED", color: "#00ff88" },
              { label: "✓ NO LOOK-AHEAD BIAS", color: "#00ff88" },
              { label: "⚠ SLIPPAGE NOT MODELED", color: "#ffc107" },
              { label: "⚠ 300 TRADE SAMPLE", color: "#ffc107" },
            ].map(b => (
              <span key={b.label} style={{ fontSize: 8, fontWeight: 800, color: b.color, background: "rgba(255,255,255,0.04)", border: `1px solid ${b.color}30`, padding: "3px 7px", borderRadius: 3 }}>{b.label}</span>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 9, color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
            P&L is calculated as % move from entry to exit. Cumulative P&L adds up all trades equally weighted. <strong style={{ color: "rgba(255,193,7,0.6)" }}>Simulated returns do not include brokerage, STT, or slippage — net real returns will be lower.</strong> Not financial advice.
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 16 }}>
          {[
            { key: "ALL", label: "ALL" },
            { key: "HIGH", label: "HIGH CONF" },
            { key: "TP_HIT", label: "TP HIT" },
            { key: "SL_HIT", label: "SL HIT" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              background: filter===f.key ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${filter===f.key ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 6, padding: "8px 4px", fontSize: 9, fontWeight: 700,
              color: filter===f.key ? "#00ff88" : "rgba(255,255,255,0.3)",
              cursor: "pointer", fontFamily: mono, letterSpacing: "0.05em",
            }}>{f.label}</button>
          ))}
        </div>

        {/* Trade cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.slice(0, 30).map((t: any, i: number) => {
            const isTP = t.outcome === "TP_HIT";
            const isSL = t.outcome === "SL_HIT";
            const isBuy = t.direction === "BUY";
            const pnlPos = t.pnl_pct > 0;
            const cur = t.symbol.endsWith(".NS") ? "₹" : "$";
            const sym = t.symbol.replace(".NS","").replace("-USD","");
            return (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${isTP ? "rgba(0,255,136,0.1)" : isSL ? "rgba(255,68,102,0.1)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 10, padding: "12px 14px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                {/* Left */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{sym}</span>
                    <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: isBuy?"rgba(0,255,136,0.1)":"rgba(255,68,102,0.1)", color: isBuy?"#00ff88":"#ff4466" }}>{t.direction}</span>
                    <span style={{ fontSize: 8, color: t.confidence==="HIGH"?"#00ff88":t.confidence==="MEDIUM"?"#ffc800":"rgba(255,255,255,0.3)" }}>{t.confidence}</span>
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
                    {t.date.slice(5)} · {cur}{t.entry?.toLocaleString()}
                  </div>
                </div>
                {/* Right */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: pnlPos?"#00ff88":"#ff4466" }}>
                    {pnlPos?"+":""}{t.pnl_pct?.toFixed(1)}%
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: isTP?"#00ff88":isSL?"#ff4466":"rgba(255,255,255,0.3)" }}>
                    {t.outcome?.replace("_"," ")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 9, color: "rgba(255,255,255,0.12)", lineHeight: 1.8, paddingBottom: 32 }}>
          Simulated outcomes · Not financial advice<br/>Past performance does not guarantee future results
        </div>
      </div>
    </div>
  );
}
