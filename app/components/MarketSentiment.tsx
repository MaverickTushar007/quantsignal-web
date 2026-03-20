"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from "lucide-react";

const API_BASE = "https://web-production-1a093.up.railway.app/api/v1";

export default function MarketSentiment() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/sentiment/market`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 16 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ height: 36, width: 120, background: "rgba(255,255,255,0.04)", borderRadius: 6 }} />
      ))}
    </div>
  );

  if (!data || data.error) return null;

  const fg = data.fear_greed;
  const btcPos = data.btc_positioning;
  const ethPos = data.eth_positioning;
  const macro = data.macro;
  const funding = data.btc_funding;

  const fgColor = fg.score <= 25 ? "#00ff88" : fg.score >= 75 ? "#ff4466" : fg.score <= 40 ? "#ffd700" : "#ffd700";
  const fgBg = fg.score <= 25 ? "rgba(0,255,136,0.08)" : fg.score >= 75 ? "rgba(255,68,102,0.08)" : "rgba(255,215,0,0.08)";

  return (
    <div style={{
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "8px 20px",
      display: "flex",
      alignItems: "center",
      gap: 6,
      flexWrap: "wrap",
      background: "#0a0a0c",
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", marginRight: 4 }}>MARKET PULSE</span>

      {/* Fear & Greed */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: fgBg, border: `1px solid ${fgColor}25`, borderRadius: 6, padding: "4px 10px" }}>
        <Activity size={9} color={fgColor} />
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>F&G</span>
        <span style={{ fontSize: 10, fontWeight: 800, color: fgColor }}>{fg.score}</span>
        <span style={{ fontSize: 8, color: fgColor, letterSpacing: "0.05em" }}>{fg.classification.toUpperCase()}</span>
        {fg.score < fg.prev_score && <TrendingDown size={8} color="#ff4466" />}
        {fg.score > fg.prev_score && <TrendingUp size={8} color="#00ff88" />}
      </div>

      {/* BTC Long/Short */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "4px 10px" }}>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>BTC L/S</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#00ff88" }}>{(btcPos.long_ratio * 100).toFixed(0)}%</span>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>/</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#ff4466" }}>{(btcPos.short_ratio * 100).toFixed(0)}%</span>
        {btcPos.crowded_long ? <span style={{ fontSize: 7, color: "#ff4466", background: "rgba(255,68,102,0.1)", padding: "1px 4px", borderRadius: 2 }}>CROWDED</span> : null}
      </div>

      {/* ETH Long/Short */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.03)", border: `1px solid ${ethPos.crowded_long ? "rgba(255,68,102,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 6, padding: "4px 10px" }}>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>ETH L/S</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: ethPos.crowded_long ? "#ff4466" : "#e2e8f0" }}>{(ethPos.long_ratio * 100).toFixed(0)}%</span>
        {ethPos.crowded_long ? <span style={{ fontSize: 7, color: "#ff4466", background: "rgba(255,68,102,0.1)", padding: "1px 4px", borderRadius: 2 }}>CROWDED</span> : null}
      </div>

      {/* BTC OI */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "4px 10px" }}>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>BTC OI</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#00aaff" }}>{(btcPos.open_interest / 1000).toFixed(1)}K</span>
      </div>

      {/* VIX */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: macro.high_fear ? "rgba(255,68,102,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${macro.high_fear ? "rgba(255,68,102,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 6, padding: "4px 10px" }}>
        <AlertTriangle size={9} color={macro.high_fear ? "#ff4466" : "rgba(255,255,255,0.3)"} />
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>VIX</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: macro.high_fear ? "#ff4466" : "#e2e8f0" }}>{macro.vix}</span>
        {macro.high_fear ? <span style={{ fontSize: 7, color: "#ff4466" }}>HIGH FEAR</span> : null}
      </div>

      {/* Fed Rate */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "4px 10px" }}>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>FED</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#ffd700" }}>{macro.fed_funds_rate}%</span>
      </div>

      {/* CPI */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "4px 10px" }}>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>CPI</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#e2e8f0" }}>{macro.cpi_yoy}%</span>
      </div>

      {/* Funding */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "4px 10px" }}>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>FUNDING</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: funding.rate > 0.01 ? "#ff4466" : funding.rate < -0.01 ? "#00ff88" : "#e2e8f0" }}>{funding.rate.toFixed(4)}%</span>
      </div>
    </div>
  );
}
