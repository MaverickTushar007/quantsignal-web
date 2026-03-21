"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/useAuth";
import ProGate from "../components/ProGate";
import { fetchAllSignals, fetchMarketMood, fetchSignal } from "../lib/api";
import TradingChart from "../components/TradingChart";
import TutorialModal from "../components/TutorialModal";
import AgentChat from "../components/AgentChat";
import { LayoutDashboard, MessageSquare, Calendar, Database, List, ChevronLeft, Newspaper } from "lucide-react";
import EconomicCalendar from "../components/EconomicCalendar";
import TradeGuardian from "../components/TradeGuardian";
import NewsTab from "../components/NewsTab";
import MarketSentiment from "../components/MarketSentiment";


const API_BASE = "https://web-production-1a093.up.railway.app/api/v1";

function formatPrice(price: number, type: string, symbol: string): string {
  if (type === "IN_STOCK" || symbol?.endsWith(".NS") || symbol?.endsWith(".BO")) {
    return "₹" + price?.toLocaleString("en-IN");
  }
  if (type === "FOREX" || type === "CRYPTO") {
    return "$" + price?.toLocaleString();
  }
  if (type === "COMMODITY" || type === "ETF" || type === "STOCK" || type === "INDEX") {
    return "$" + price?.toLocaleString();
  }
  return "$" + price?.toLocaleString();
}

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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
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
const dirColor = (d: string) => d === "BUY" ? "#00ff88" : d === "SELL" ? "#ff4466" : "#ffd700";
const badge = (d: string) => ({
  background: d === "BUY" ? "rgba(0,255,136,0.12)" : d === "SELL" ? "rgba(255,68,102,0.12)" : "rgba(255,215,0,0.12)",
  color: dirColor(d),
  border: `1px solid ${d === "BUY" ? "rgba(0,255,136,0.3)" : d === "SELL" ? "rgba(255,68,102,0.3)" : "rgba(255,215,0,0.3)"}`,
  padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em",
});

function getExecutionWindows() {
  const now = new Date();
  const estHour = (now.getUTCHours() - 5 + 24) % 24;
  return [
    { label: "ASIA SESSION", range: "00:00–04:00 EST", active: estHour >= 0 && estHour < 4, color: "#aa44ff" },
    { label: "LONDON OPEN", range: "04:00–08:00 EST", active: estHour >= 4 && estHour < 8, color: "#00aaff" },
    { label: "PRIME WINDOW", range: "08:00–12:00 EST", active: estHour >= 8 && estHour < 12, color: "#00ff88" },
    { label: "NY AFTERNOON", range: "13:00–16:00 EST", active: estHour >= 13 && estHour < 16, color: "#ffd700" },
  ];
}

const TIMEZONES = [
  { label: "IST", offset: 5.5,  flag: "🇮🇳" },
  { label: "EST", offset: -5,   flag: "🗽" },
  { label: "GMT", offset: 0,    flag: "🇬🇧" },
  { label: "JST", offset: 9,    flag: "🇯🇵" },
];

function WorldClock() {
  const [time, setTime] = useState("");
  const [tzIndex, setTzIndex] = useState(0);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const update = () => {
      const tz = TIMEZONES[tzIndex];
      const now = new Date();
      const utc = now.getUTCHours() + now.getUTCMinutes() / 60;
      const local = (utc + tz.offset + 24) % 24;
      const h = Math.floor(local);
      const m = Math.floor((local - h) * 60);
      setTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [tzIndex]);

  const tz = TIMEZONES[tzIndex];

  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setShowPicker(p => !p)} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 8px" }}>
        <span style={{ fontSize: 11 }}>{tz.flag}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "'IBM Plex Mono', monospace" }}>{time}</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{tz.label}</span>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)" }}>▼</span>
      </div>
      {showPicker && (
        <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "#0e0f14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, overflow: "hidden", zIndex: 100, minWidth: 140 }}>
          {TIMEZONES.map((t, i) => (
            <div key={t.label} onClick={() => { setTzIndex(i); setShowPicker(false); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", background: i === tzIndex ? "rgba(0,255,136,0.08)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 13 }}>{t.flag}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: i === tzIndex ? "#00ff88" : "#fff" }}>{t.label}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>{t.offset >= 0 ? "+" : ""}{t.offset}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

}