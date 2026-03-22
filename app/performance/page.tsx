"use client";
import { useState, useEffect } from "react";

const API = "https://web-production-1a093.up.railway.app/api/v1";
const mono = "'IBM Plex Mono', monospace";

function EquityChart({ curve }: { curve: any[] }) {
  if (!curve || curve.length < 2) return null;
  const W = 600, H = 160, P = 16;
  const vals = curve.map((p: any) => p.cumulative_pnl);
  const min = Math.min(...vals, 0);
  const max = Math.max(...vals, 1);
  const range = max - min || 1;
  const pts = curve.map((p: any, i: number) => {
    const x = P + (i / (curve.length - 1)) * (W - P * 2);
    const y = P + ((max - p.cumulative_pnl) / range) * (H - P * 2);
    return `${x},${y}`;
  }).join(" ");
  const zY = P + (max / range) * (H - P * 2);
  const last = vals[vals.length - 1];
  const col = last >= 0 ? "#00ff88" : "#ff4466";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 140 }} preserveAspectRatio="none">
      <line x1={P} y1={zY} x2={W-P} y2={zY} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4,4"/>
      <polygon points={`${P},${zY} ${pts} ${W-P},${zY}`} fill={last>=0?"rgba(0,255,136,0.07)":"rgba(255,68,102,0.07)"}/>
      <polyline points={pts} fill="none" stroke={col} strokeWidth="1.5"/>
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
            <EquityChart curve={summary.equity_curve} />
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
          <div style={{ marginTop: 10, fontSize: 9, color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
            P&L is calculated as % move from entry to exit. Cumulative P&L adds up all trades equally weighted. Not financial advice — past performance does not guarantee future results.
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
