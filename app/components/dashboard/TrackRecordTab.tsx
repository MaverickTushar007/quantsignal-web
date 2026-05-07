"use client";

import { useEffect, useState } from "react";

const API_BASE_TR = process.env.NEXT_PUBLIC_API_URL || "https://quantsignal-api.onrender.com/api/v1";


function TrackRecordTab({ symbol }: { symbol: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mono = "'IBM Plex Mono', monospace";

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_TR}/history/trades?limit=200`)
      .then(r => r.json())
      .then(d => {
        const trades = d.trades || [];
        // Filter for this symbol
        const sym = trades.filter((t: any) => t.symbol === symbol);
        // All trades stats
        const all = trades;
        const wins = all.filter((t: any) => t.outcome === "TP_HIT");
        const losses = all.filter((t: any) => t.outcome === "SL_HIT");
        const winRate = all.length ? (wins.length / all.length * 100) : 0;
        const avgPnl = all.length ? all.reduce((s: number, t: any) => s + (t.pnl_pct || 0), 0) / all.length : 0;
        const avgWin = wins.length ? wins.reduce((s: number, t: any) => s + t.pnl_pct, 0) / wins.length : 0;
        const avgLoss = losses.length ? losses.reduce((s: number, t: any) => s + t.pnl_pct, 0) / losses.length : 0;

        // By probability bucket
        const buckets: Record<string, {tp:number,sl:number,pnl:number[]}> = {
          "35-45%": {tp:0,sl:0,pnl:[]},
          "45-55%": {tp:0,sl:0,pnl:[]},
          "55-65%": {tp:0,sl:0,pnl:[]},
          "65%+":   {tp:0,sl:0,pnl:[]},
        };
        all.forEach((t: any) => {
          const p = (t.probability || 0) * 100;
          const b = p < 45 ? "35-45%" : p < 55 ? "45-55%" : p < 65 ? "55-65%" : "65%+";
          if (t.outcome === "TP_HIT") buckets[b].tp++;
          else buckets[b].sl++;
          buckets[b].pnl.push(t.pnl_pct || 0);
        });

        // By direction
        const byDir: Record<string, {tp:number,sl:number}> = { BUY:{tp:0,sl:0}, SELL:{tp:0,sl:0} };
        all.forEach((t: any) => {
          const d = t.direction;
          if (byDir[d]) {
            if (t.outcome === "TP_HIT") byDir[d].tp++;
            else byDir[d].sl++;
          }
        });

        // This symbol's recent trades
        const symRecent = sym.slice(0, 8);

        setData({ total: all.length, wins: wins.length, losses: losses.length, winRate, avgPnl, avgWin, avgLoss, buckets, byDir, symRecent, symTotal: sym.length, evStats: [], briefing: null });

        // Fetch EV stats and morning briefing separately
        Promise.allSettled([
          fetch(`${API_BASE_TR}/system/ev-stats`).then(r => r.json()),
          fetch(`${API_BASE_TR}/system/morning-briefing`).then(r => r.json()),
        ]).then(([evRes, briefingRes]) => {
          const evStats = evRes.status === "fulfilled" ? (evRes.value?.ev_stats || []) : [];
          const briefing = briefingRes.status === "fulfilled" ? briefingRes.value : null;
          setData((prev: any) => prev ? { ...prev, evStats, briefing } : prev);
        });
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) return (
    <div style={{ padding: 20, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: mono }}>
      Loading track record...
    </div>
  );
  if (!data) return (
    <div style={{ padding: 20, color: "#ff4466", fontSize: 11, fontFamily: mono }}>Failed to load</div>
  );

  const statBox = (label: string, value: string, color: string) => (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "10px 12px", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color, fontFamily: mono }}>{value}</div>
    </div>
  );

  return (
    <div style={{ padding: "14px 16px", fontFamily: mono, overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>

      {/* Header */}
      <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", marginBottom: 12 }}>
        SYSTEM TRACK RECORD — {data.total} TRADES
      </div>

      {/* Top stats — Expectancy first, it's what matters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
        {statBox("EXPECTANCY", `${(data.winRate/100 * data.avgWin + (1-data.winRate/100) * data.avgLoss).toFixed(2)}%`,
          (data.winRate/100 * data.avgWin + (1-data.winRate/100) * data.avgLoss) >= 0 ? "#00ff88" : "#ff4466")}
        {statBox("AVG WIN", `+${data.avgWin.toFixed(2)}%`, "#00ff88")}
        {statBox("AVG LOSS", `${data.avgLoss.toFixed(2)}%`, "#ff4466")}
      </div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginBottom: 14, paddingLeft: 2 }}>
        {(data.winRate/100 * data.avgWin + (1-data.winRate/100) * data.avgLoss) >= 0
          ? "✓ Positive expectancy — system is profitable per trade on average"
          : "⚠ Negative expectancy — system needs more data or recalibration"}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {statBox("WIN RATE", `${data.winRate.toFixed(1)}%`, data.winRate >= 50 ? "#00ff88" : data.winRate >= 40 ? "#ffd700" : "rgba(255,255,255,0.4)")}
        {statBox("AVG P&L", `${data.avgPnl >= 0 ? "+" : ""}${data.avgPnl.toFixed(2)}%`, data.avgPnl >= 0 ? "#00ff88" : "#ff4466")}
        {statBox("W / L", `${data.wins} / ${data.losses}`, "rgba(255,255,255,0.7)")}
      </div>

      {/* By Direction */}
      <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: 8 }}>BY DIRECTION</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["BUY","SELL"].map(dir => {
          const d = data.byDir[dir];
          const total = d.tp + d.sl;
          const wr = total ? d.tp / total * 100 : 0;
          return (
            <div key={dir} style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: dir === "BUY" ? "#00ff88" : "#ff4466" }}>{dir}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: wr >= 50 ? "#00ff88" : "#ff4466" }}>{wr.toFixed(0)}%</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ width: `${wr}%`, height: "100%", background: wr >= 50 ? "#00ff88" : "#ff4466", borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>{d.tp}W / {d.sl}L of {total}</div>
            </div>
          );
        })}
      </div>

      {/* By Probability Bucket */}
      <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: 8 }}>WIN RATE BY PROBABILITY</div>
      <div style={{ marginBottom: 18 }}>
        {Object.entries(data.buckets).map(([label, b]: [string, any]) => {
          const total = b.tp + b.sl;
          if (!total) return null;
          const wr = b.tp / total * 100;
          const avgP = b.pnl.reduce((s: number, v: number) => s + v, 0) / b.pnl.length;
          return (
            <div key={label} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>PROB {label}</span>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{total} trades</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: avgP >= 0 ? "#00ff88" : "#ff4466" }}>{avgP >= 0 ? "+" : ""}{avgP.toFixed(2)}%</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: wr >= 50 ? "#00ff88" : "#ffd700" }}>{wr.toFixed(0)}% WR</span>
                </div>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${wr}%`, height: "100%", background: wr >= 55 ? "#00ff88" : wr >= 45 ? "#ffd700" : "#ff4466", borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Regime Performance Panel */}
      <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: 8 }}>REGIME PERFORMANCE</div>
      <div style={{ marginBottom: 18 }}>
        {data.evStats && data.evStats.map((ev: any, i: number) => {
          if (ev.ev === null) return null;
          const wr = ev.win_rate ? ev.win_rate * 100 : 0;
          return (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>
                  <span style={{ color: ev.direction === "BUY" ? "#00ff88" : "#ff4466", fontWeight: 700 }}>{ev.direction}</span>
                  {" in "}{ev.regime.toUpperCase()}
                </span>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{ev.total_trades} trades</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: ev.ev >= 0 ? "#00ff88" : "#ff4466" }}>EV {ev.ev >= 0 ? "+" : ""}{ev.ev?.toFixed(2)}%</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: wr >= 50 ? "#00ff88" : wr >= 35 ? "#ffd700" : "#ff4466" }}>{wr.toFixed(0)}% WR</span>
                </div>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(wr, 100)}%`, height: "100%", background: wr >= 50 ? "#00ff88" : wr >= 35 ? "#ffd700" : "#ff4466", borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
        {(!data.evStats || data.evStats.length === 0) && (
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>No regime data yet</div>
        )}
      </div>

      {/* Morning Briefing */}
      {data.briefing && (
        <>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: 8 }}>PERSEUS MORNING BRIEFING</div>
          <div style={{ background: "rgba(0,170,255,0.05)", border: "1px solid rgba(0,170,255,0.15)", borderRadius: 6, padding: "10px 12px", marginBottom: 18 }}>
            <div style={{ fontSize: 8, color: "rgba(0,170,255,0.6)", marginBottom: 6, letterSpacing: "0.08em" }}>{data.briefing.date} — AUTO GENERATED</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{data.briefing.briefing_text}</div>
          </div>
        </>
      )}

      {/* This symbol's recent trades */}
      {data.symRecent.length > 0 && (
        <>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: 8 }}>
            {symbol} — LAST {data.symRecent.length} TRADES
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {data.symRecent.map((t: any, i: number) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 4, border: `1px solid ${t.outcome === "TP_HIT" ? "rgba(0,255,136,0.1)" : "rgba(255,68,102,0.1)"}` }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 8, color: t.outcome === "TP_HIT" ? "#00ff88" : "#ff4466", fontWeight: 700 }}>
                    {t.outcome === "TP_HIT" ? "✓TP" : "✗SL"}
                  </span>
                  <span style={{ fontSize: 9, color: t.direction === "BUY" ? "#00ff88" : "#ff4466", fontWeight: 700 }}>{t.direction}</span>
                  <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>{t.date}</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>{(t.probability*100).toFixed(0)}%</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: t.pnl_pct >= 0 ? "#00ff88" : "#ff4466" }}>
                    {t.pnl_pct >= 0 ? "+" : ""}{t.pnl_pct?.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          {data.symTotal === 0 && (
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: 12 }}>No trades for {symbol} yet</div>
          )}
        </>
      )}
      {data.symRecent.length === 0 && (
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "12px 0" }}>
          No trades recorded for {symbol} yet — system stats above are across all {data.total} trades
        </div>
      )}
    </div>
  );
}

export default TrackRecordTab;
