"use client";

import { useEffect, useState } from "react";


function LiquidityCard({ symbol }: { symbol: string }) {
  const [data, setData] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLiquidity = async () => {
    try {
      const res = await fetch(`${API_BASE}/liquidity/${symbol}`);
      if (res.ok) { setData(await res.json()); setLastUpdated(new Date()); }
    } catch {}
  };

  useEffect(() => {
    fetchLiquidity();
    const interval = setInterval(fetchLiquidity, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (!data) return null;

  const oiColor = data.oi_change_24h_pct >= 0 ? "#00ff88" : "#ff4466";

  return (
    <div style={{ marginBottom: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>⚡ LIQUIDITY LEVELS</span>
        {lastUpdated && <span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)" }}>LIVE · {lastUpdated.toLocaleTimeString()}</span>}
      </div>
      <div style={{ background: `${data.bias_color}18`, border: `1px solid ${data.bias_color}30`, borderRadius: 6, padding: "7px 10px", marginBottom: 10 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: data.bias_color, letterSpacing: "0.08em", marginBottom: 2 }}>{data.bias.replace(/_/g, " ")}</div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{data.bias_desc}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 6, marginBottom: 10 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "7px 8px" }}>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>OPEN INTEREST</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{data.open_interest.toLocaleString()}</div>
          <div style={{ fontSize: 8, fontWeight: 700, color: oiColor }}>{data.oi_change_24h_pct > 0 ? "+" : ""}{data.oi_change_24h_pct}% 24h</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "7px 8px" }}>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>FUNDING</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: data.funding_color }}>{data.funding_rate.toFixed(4)}%</div>
          <div style={{ fontSize: 8, color: data.funding_color }}>{data.funding_trend.replace(/_/g, " ")}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "7px 8px" }}>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>L/S RATIO</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: data.long_ratio > 60 ? "#ff4466" : data.long_ratio < 40 ? "#00ff88" : "#fff" }}>{data.long_ratio}% L</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>{data.short_ratio}% SHORT</div>
        </div>
      </div>
      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 6 }}>LIQUIDATION CLUSTERS</div>
      {data.clusters_above.map((c: any, i: number) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", marginBottom: 3, background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.1)", borderRadius: 5 }}>
          <span style={{ fontSize: 9, color: "#00ff88" }}>▲ ${c.price.toLocaleString()}</span>
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>{c.label}</span>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", background: "rgba(255,255,255,0.06)", borderRadius: 5, margin: "4px 0" }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#ffd700" }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: "#ffd700" }}>${data.current_price.toLocaleString()}</span>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>CURRENT</span>
      </div>
      {data.clusters_below.map((c: any, i: number) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", marginBottom: 3, background: "rgba(255,68,102,0.04)", border: "1px solid rgba(255,68,102,0.1)", borderRadius: 5 }}>
          <span style={{ fontSize: 9, color: "#ff4466" }}>▼ ${c.price.toLocaleString()}</span>
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

const TYPE_FILTERS = ["ALL", "CRYPTO", "STOCK", "ETF", "INDEX", "COMMOD", "FOREX", "INDIA"];

export default LiquidityCard;
