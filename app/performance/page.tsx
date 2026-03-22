"use client";
import { useState, useEffect } from "react";

const API = "https://web-production-1a093.up.railway.app/api/v1";
const mono = "'IBM Plex Mono', monospace";

function MiniChart({ curve }: { curve: any[] }) {
  if (!curve || curve.length < 2) return null;
  const W = 800, H = 200, PAD = 20;
  const vals = curve.map((p: any) => p.cumulative_pnl);
  const min = Math.min(...vals, 0);
  const max = Math.max(...vals, 1);
  const range = max - min || 1;
  const points = curve.map((p: any, i: number) => {
    const x = PAD + (i / (curve.length - 1)) * (W - PAD * 2);
    const y = PAD + ((max - p.cumulative_pnl) / range) * (H - PAD * 2);
    return `${x},${y}`;
  }).join(" ");
  const zeroY = PAD + (max / range) * (H - PAD * 2);
  const lastVal = vals[vals.length - 1];
  const color = lastVal >= 0 ? "#00ff88" : "#ff4466";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 200 }}>
      <line x1={PAD} y1={zeroY} x2={W-PAD} y2={zeroY} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4"/>
      <polygon points={`${PAD},${zeroY} ${points} ${W-PAD},${zeroY}`} fill={lastVal>=0?"rgba(0,255,136,0.08)":"rgba(255,68,102,0.08)"}/>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2"/>
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
      fetch(`${API}/history/trades?limit=50`).then(r => r.json()),
    ]).then(([s, t]) => {
      setSummary(s);
      setTrades(t.trades || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? trades
    : filter === "HIGH" ? trades.filter((t:any) => t.confidence === "HIGH")
    : trades.filter((t:any) => t.outcome === filter);

  if (loading) return (
    <div style={{ background: "#060608", height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
      Loading performance data...
    </div>
  );

  return (
    <div style={{ background: "#060608", minHeight: "100dvh", fontFamily: mono, color: "#e2e8f0" }}>
      <div style={{ padding: "16px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard" style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, textDecoration: "none" }}>← DASHBOARD</a>
          <span style={{ color: "#00ff88", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>● SIGNAL PERFORMANCE</span>
        </div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Last 90 days · Simulated outcomes</span>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        {summary && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 24 }}>
            {[
              { label: "WIN RATE", value: `${summary.win_rate}%`, color: summary.win_rate >= 60 ? "#00ff88" : "#ffc800" },
              { label: "HIGH CONF WR", value: `${summary.high_conf_win_rate}%`, color: "#00ff88" },
              { label: "TOTAL SIGNALS", value: summary.total_trades, color: "#fff" },
              { label: "TP HITS", value: summary.tp_hits, color: "#00ff88" },
              { label: "CUMUL. P&L", value: `${summary.total_pnl>=0?"+":""}${summary.total_pnl}%`, color: summary.total_pnl>=0?"#00ff88":"#ff4466" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {summary?.equity_curve && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: 4 }}>EQUITY CURVE — CUMULATIVE P&L</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>If you followed every BUY/SELL signal in the last 90 days</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: summary.total_pnl>=0?"#00ff88":"#ff4466" }}>
                {summary.total_pnl>=0?"+":""}{summary.total_pnl}%
              </div>
            </div>
            <MiniChart curve={summary.equity_curve} />
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["ALL","HIGH","TP_HIT","SL_HIT"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter===f?"rgba(0,255,136,0.1)":"transparent",
              border: `1px solid ${filter===f?"rgba(0,255,136,0.3)":"rgba(255,255,255,0.08)"}`,
              borderRadius: 6, padding: "6px 14px", fontSize: 10, fontWeight: 700,
              color: filter===f?"#00ff88":"rgba(255,255,255,0.3)",
              cursor: "pointer", fontFamily: mono, letterSpacing: "0.08em",
            }}>
              {f==="HIGH"?"HIGH CONF ONLY":f.replace("_"," ")}
            </button>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 55px 70px 45px", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
            <span>DATE</span><span>ASSET</span><span style={{display:"none"}}></span><span>CONF</span><span>OUTCOME</span><span>P&L</span>
          </div>
          {filtered.slice(0,30).map((t:any, i:number) => {
            const pnlColor = t.pnl_pct>0?"#00ff88":t.pnl_pct<0?"#ff4466":"rgba(255,255,255,0.4)";
            const outcomeColor = t.outcome==="TP_HIT"?"#00ff88":t.outcome==="SL_HIT"?"#ff4466":"rgba(255,255,255,0.3)";
            const cur = t.symbol.endsWith(".NS")?"₹":"$";
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr 55px 70px 45px", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 11, alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>{t.date}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{t.symbol.replace(".NS","").replace("-USD","")}</span>
                  <span style={{ color: t.direction==="BUY"?"#00ff88":"#ff4466", fontWeight: 800, fontSize: 9, background: t.direction==="BUY"?"rgba(0,255,136,0.1)":"rgba(255,68,102,0.1)", padding: "1px 4px", borderRadius: 3 }}>{t.direction}</span>
                </div>
                <span style={{ color: t.confidence==="HIGH"?"#00ff88":t.confidence==="MEDIUM"?"#ffc800":"rgba(255,255,255,0.4)", fontSize: 10 }}>{t.confidence}</span>
                <span style={{ color: outcomeColor, fontWeight: 700, fontSize: 10 }}>{t.outcome?.replace("_"," ")}</span>
                <span style={{ color: pnlColor, fontWeight: 700 }}>{t.pnl_pct>0?"+":""}{t.pnl_pct?.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 10, color: "rgba(255,255,255,0.15)", lineHeight: 1.8 }}>
          Simulated outcomes · Not financial advice · Past performance does not guarantee future results
        </div>
      </div>
    </div>
  );
}
