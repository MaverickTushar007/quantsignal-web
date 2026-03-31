"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from "lucide-react";

const API_BASE = "https://quantsignal-api-production.up.railway.app/api/v1";

export default function MarketSentiment() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/sentiment/market`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  if (!data || data.error) return (
    <div style={{ height: 28, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0a0a0c", flexShrink: 0 }} />
  );

  const fg = data.fear_greed;
  const btcPos = data.btc_positioning;
  const ethPos = data.eth_positioning;
  const macro = data.macro;
  const funding = data.btc_funding;
  const fgColor = fg.score <= 25 ? "#00ff88" : fg.score >= 75 ? "#ff4466" : "#ffd700";

  const items = [
    <span key="pulse" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", fontSize: 8 }}>MARKET PULSE</span>,
    <span key="sep0" style={{ color: "rgba(255,255,255,0.1)" }}>·</span>,
    <span key="fg" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <Activity size={8} color={fgColor} />
      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>F&G</span>
      <span style={{ color: fgColor, fontWeight: 800, fontSize: 10 }}>{fg.score}</span>
      <span style={{ color: fgColor, fontSize: 8 }}>{fg.classification.toUpperCase()}</span>
      {fg.score < fg.prev_score && <TrendingDown size={8} color="#ff4466" />}
      {fg.score > fg.prev_score && <TrendingUp size={8} color="#00ff88" />}
    </span>,
    <span key="sep1" style={{ color: "rgba(255,255,255,0.1)" }}>·</span>,
    <span key="btcls" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8 }}>BTC L/S</span>
      <span style={{ color: "#00ff88", fontWeight: 700, fontSize: 10 }}>{(btcPos.long_ratio * 100).toFixed(0)}%</span>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8 }}>/</span>
      <span style={{ color: "#ff4466", fontWeight: 700, fontSize: 10 }}>{(btcPos.short_ratio * 100).toFixed(0)}%</span>
      {btcPos.crowded_long && <span style={{ color: "#ff4466", fontSize: 7, background: "rgba(255,68,102,0.1)", padding: "1px 4px", borderRadius: 2 }}>CROWDED</span>}
    </span>,
    <span key="sep2" style={{ color: "rgba(255,255,255,0.1)" }}>·</span>,
    <span key="ethls" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8 }}>ETH L/S</span>
      <span style={{ color: ethPos.crowded_long ? "#ff4466" : "#e2e8f0", fontWeight: 700, fontSize: 10 }}>{(ethPos.long_ratio * 100).toFixed(0)}%</span>
      {ethPos.crowded_long && <span style={{ color: "#ff4466", fontSize: 7, background: "rgba(255,68,102,0.1)", padding: "1px 4px", borderRadius: 2 }}>CROWDED</span>}
    </span>,
    <span key="sep3" style={{ color: "rgba(255,255,255,0.1)" }}>·</span>,
    <span key="btcoi" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8 }}>BTC OI</span>
      <span style={{ color: "#00aaff", fontWeight: 700, fontSize: 10 }}>{(btcPos.open_interest / 1000).toFixed(1)}K</span>
    </span>,
    <span key="sep4" style={{ color: "rgba(255,255,255,0.1)" }}>·</span>,
    <span key="vix" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <AlertTriangle size={8} color={macro.high_fear ? "#ff4466" : "rgba(255,255,255,0.3)"} />
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8 }}>VIX</span>
      <span style={{ color: macro.high_fear ? "#ff4466" : "#e2e8f0", fontWeight: 700, fontSize: 10 }}>{macro.vix}</span>
      {macro.high_fear && <span style={{ color: "#ff4466", fontSize: 7 }}>HIGH FEAR</span>}
    </span>,
    <span key="sep5" style={{ color: "rgba(255,255,255,0.1)" }}>·</span>,
    <span key="fed" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8 }}>FED</span>
      <span style={{ color: "#ffd700", fontWeight: 700, fontSize: 10 }}>{macro.fed_funds_rate}%</span>
    </span>,
    <span key="sep6" style={{ color: "rgba(255,255,255,0.1)" }}>·</span>,
    <span key="cpi" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8 }}>CPI</span>
      <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 10 }}>{macro.cpi_yoy}%</span>
    </span>,
    <span key="sep7" style={{ color: "rgba(255,255,255,0.1)" }}>·</span>,
    <span key="funding" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8 }}>FUNDING</span>
      <span style={{ color: funding.rate > 0.01 ? "#ff4466" : funding.rate < -0.01 ? "#00ff88" : "#e2e8f0", fontWeight: 700, fontSize: 10 }}>{funding.rate.toFixed(4)}%</span>
    </span>,
  ];

  return (
    <>
      <style>{`
        @keyframes qs-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .qs-ticker-track {
          display: inline-flex;
          align-items: center;
          gap: 20px;
          white-space: nowrap;
          animation: qs-ticker 40s linear infinite;
        }
        .qs-ticker-wrap:hover .qs-ticker-track {
          animation-play-state: paused;
        }
      `}</style>
      <div className="qs-ticker-wrap" style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "#0a0a0c",
        overflow: "hidden",
        height: 28,
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
      }}>
        <div className="qs-ticker-track">
          {items}{items}
        </div>
      </div>
    </>
  );
}
