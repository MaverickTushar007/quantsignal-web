"use client";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/useAuth";
import ProGate from "../components/ProGate";
import { fetchAllSignals, fetchMarketMood, fetchSignal, UpgradeRequiredError } from "../lib/api";
import TradingChart from "../components/TradingChart";
import TutorialModal from "../components/TutorialModal";
import AgentChat from "../components/AgentChat";
import { LayoutDashboard, MessageSquare, Calendar, Database, List, ChevronLeft, Newspaper, Bell, Bookmark, BarChart2, Settings } from "lucide-react";
import EconomicCalendar from "../components/EconomicCalendar";
import TradeGuardian from "../components/TradeGuardian";
import NewsTab from "../components/NewsTab";
import UpgradeModal from "../components/UpgradeModal";


const API_BASE = "https://quantsignal-api-production.up.railway.app/api/v1";

async function subscribeAlert(email: string, symbol: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/alerts/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, symbols: [symbol] }),
    });
    return res.ok;
  } catch { return false; }
}

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
  { label: "EST", offset: -5, iana: "America/New_York",  flag: "🗽" },
  { label: "GMT", offset:  0, iana: "Europe/London",      flag: "🇬🇧" },
  { label: "IST", offset: 5.5, iana: "Asia/Kolkata",      flag: "🇮🇳" },
  { label: "JST", offset:  9, iana: "Asia/Tokyo",         flag: "🇯🇵" },
];

function EstClock() {
  const [time, setTime] = useState("");
  const [tzIndex, setTzIndex] = useState(0);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const update = () => {
      const tz = TIMEZONES[tzIndex];
      const now = new Date();
      const t = now.toLocaleTimeString("en-GB", { timeZone: tz.iana, hour: "2-digit", minute: "2-digit", hour12: false });
      setTime(t);
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


// PWA Install prompt
function usePWAInstall() {
  const [prompt, setPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setPrompt(null);
  };
  return { canInstall: !!prompt && !installed, install, installed };
}


function AlertBell({ symbol }: { symbol: string }) {
  const [state, setState] = useState<"idle"|"input"|"loading"|"done">("idle");
  const [email, setEmail] = useState("");
  const mono = "'IBM Plex Mono', monospace";

  const submit = async () => {
    if (!email || !email.includes("@")) return;
    setState("loading");
    const ok = await subscribeAlert(email, symbol);
    setState(ok ? "done" : "idle");
    if (ok) setTimeout(() => setState("idle"), 3000);
  };

  if (state === "done") return (
    <span style={{ fontSize: 10, color: "#00ff88" }}>✓</span>
  );

  if (state === "input" || state === "loading") return (
    <div onClick={e => e.stopPropagation()} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", 
      background: "#0e0f14", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 8,
      padding: "8px 10px", zIndex: 50, display: "flex", gap: 6, alignItems: "center",
      boxShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
      <input
        autoFocus
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => { e.preventDefault(); if (e.key === "Enter") submit(); if (e.key === "Escape") setState("idle"); }}
        placeholder="your@email.com"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 5, padding: "5px 8px", color: "#fff", fontSize: 10, width: 150,
          fontFamily: mono, outline: "none" }}
      />
      <button onClick={submit} disabled={state === "loading"} style={{
        background: "#00ff88", border: "none", borderRadius: 5, padding: "5px 8px",
        fontSize: 10, fontWeight: 700, color: "#000", cursor: "pointer", fontFamily: mono,
      }}>
        {state === "loading" ? "..." : "SET"}
      </button>
      <button onClick={() => setState("idle")} style={{
        background: "transparent", border: "none", color: "rgba(255,255,255,0.3)",
        cursor: "pointer", fontSize: 12, padding: "0 2px",
      }}>✕</button>
    </div>
  );

  return (
    <button onClick={e => { e.stopPropagation(); setState("input"); }} style={{
      background: "transparent", border: "none", cursor: "pointer",
      color: "rgba(255,255,255,0.2)", fontSize: 12, padding: "0 2px",
      transition: "color 0.15s", flexShrink: 0,
    }} title="Get email alert for this signal">
      🔔
    </button>
  );
}




function ShockWarning({ shock }: { shock?: any }) {
  if (!shock) return null;
  return (
    <div style={{
      background: 'rgba(255,140,0,0.08)',
      border: '1px solid rgba(255,140,0,0.3)',
      borderRadius: 8,
      padding: '10px 12px',
      marginBottom: 14,
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: 16, marginTop: 1 }}>⚡</span>
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#ffa500',
          letterSpacing: '0.1em', marginBottom: 4 }}>SECTOR SHOCK DETECTED</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.5 }}>{shock.warning}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,140,0,0.7)',
          marginTop: 4, fontWeight: 600 }}>
          ⚠ Reduce position size — correlation risk elevated
        </div>
      </div>
    </div>
  );
}

function MTFBar({ mtf, direction }: { mtf?: any, direction?: string }) {
  if (!mtf) return null;
  const details = mtf.mtf_details || {};
  const score = mtf.mtf_score_with_daily ?? mtf.mtf_score ?? 0;
  const tfs = [
    { label: '15m', val: details['15m'] },
    { label: '1H',  val: details['1h'] },
    { label: '4H',  val: details['4h'] },
    { label: '1D',  val: details['1d'] },
  ];
  const filled = Math.round(score);
  const barColor = score >= 3 ? '#00ff88' : score >= 2 ? '#ffc800' : '#ff4466';
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 8, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>MTF ALIGNMENT</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: barColor }}>{score}/4 timeframes bullish</span>
      </div>
      <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < filled ? barColor : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {tfs.map(tf => {
          const bull = tf.val === 'BULL';
          const neutral = tf.val === 'NEUTRAL' || !tf.val;
          return (
            <div key={tf.label} style={{ flex: 1, background: bull ? 'rgba(0,255,136,0.07)' : neutral ? 'rgba(255,255,255,0.03)' : 'rgba(255,68,102,0.07)', border: `1px solid ${bull ? 'rgba(0,255,136,0.2)' : neutral ? 'rgba(255,255,255,0.06)' : 'rgba(255,68,102,0.2)'}`, borderRadius: 5, padding: '5px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>{tf.label}</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: bull ? '#00ff88' : neutral ? 'rgba(255,255,255,0.3)' : '#ff4466' }}>
                {bull ? '▲' : neutral ? '—' : '▼'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EarningsBadge({ flag }: { flag?: any }) {
  if (!flag) return null;
  const urgent = flag.days_until <= 2;
  return (
    <span style={{
      fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 3,
      background: urgent ? "rgba(255,200,0,0.15)" : "rgba(255,200,0,0.08)",
      border: `1px solid ${urgent ? "rgba(255,200,0,0.5)" : "rgba(255,200,0,0.2)"}`,
      color: urgent ? "#ffc800" : "rgba(255,200,0,0.6)",
      letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0,
    }}>
      ⚡ EARNINGS {flag.label}
    </span>
  );
}

function generateOneLiner(sig: any): string {
  if (!sig) return "";
  const dir = sig.direction;
  const prob = sig.probability;
  const conf = sig.confidence?.toLowerCase() || "moderate";
  const bulls = sig.confluence_score ? parseInt(sig.confluence_score.split("/")[0]) : 5;
  const name = sig.display || sig.symbol;
  const features: string[] = sig.top_features || [];
  const driver = features[0] || "momentum";
  const agreement = bulls >= 7 ? "broad market agreement" : bulls >= 5 ? "mixed signals" : "contrarian setup";
  const strength = prob >= 0.75 ? "strong" : prob >= 0.6 ? "moderate" : "marginal";
  if (dir === "BUY") {
    const setups = [
      `${name} is showing ${strength} bullish momentum — ${driver} aligns with ${agreement} across ${bulls}/9 indicators.`,
      `Technical structure favors upside for ${name}: ${driver} is the primary driver with ${agreement}.`,
      `${name} has a ${conf}-confidence BUY setup — ${bulls}/9 factors bullish, led by ${driver}.`,
    ];
    return setups[bulls % setups.length];
  } else if (dir === "SELL") {
    const setups = [
      `${name} shows ${strength} bearish pressure — ${driver} is deteriorating with only ${bulls}/9 factors bullish.`,
      `Distribution signals on ${name}: ${driver} turning negative, ${agreement} to the downside.`,
      `${name} has a ${conf}-confidence SELL setup — bearish confluence building across key indicators.`,
    ];
    return setups[bulls % setups.length];
  } else {
    return `${name} is range-bound — ${driver} lacks directional conviction. Wait for a cleaner setup before entering.`;
  }
}


function PushBell() {
  const { supported, subscribed, loading, subscribe, unsubscribe } = usePushNotifications();
  if (!supported) return null;
  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={loading}
      title={subscribed ? "Disable push alerts" : "Enable push alerts"}
      style={{
        background: subscribed ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.06)",
        border: subscribed ? "1px solid rgba(0,255,136,0.4)" : "1px solid rgba(255,255,255,0.1)",
        borderRadius: 6,
        color: subscribed ? "#00ff88" : "rgba(255,255,255,0.4)",
        cursor: loading ? "wait" : "pointer",
        padding: "3px 8px",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.05em",
        display: "flex",
        alignItems: "center",
        gap: 4,
        transition: "all 0.2s",
      }}
    >
      {subscribed ? "🔔 ON" : "🔕 OFF"}
    </button>
  );
}


// ── Track Record Component ────────────────────────────────────────────────
const API_BASE_TR = "https://quantsignal-api-production.up.railway.app/api/v1";

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


export default function Dashboard() {
  const [upgradeError, setUpgradeError] = useState<{kind:"signals"|"perseus",used:number,limit:number}|null>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [outcomeMap, setOutcomeMap] = useState<Record<string, {outcome: string, pnl: number}>>({});
  const [mood, setMood] = useState<any>(null);
  const [filter, setFilter] = useState("ALL");
  const { user, isPro } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { canInstall, install } = usePWAInstall();
  const [selected, setSelected] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("SIGNAL");
  const [livePrice, setLivePrice] = useState<number | null>(null);
  // Mobile: "LIST" | "SIGNAL" | "CHAT" | "CALENDAR" | "SIDEBAR"
  const [mobilePanel, setMobilePanel] = useState("LIST");
  const [isMobile, setIsMobile] = useState(false);
  const [showAssetList, setShowAssetList] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setMounted(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
      {upgradeError && <UpgradeModal kind={upgradeError.kind} used={upgradeError.used} limit={upgradeError.limit} onClose={() => setUpgradeError(null)} />}


  // Fetch outcome map — shows ✓/✗ badges on signal list
  useEffect(() => {
    fetch(`${API_BASE}/history/trades?limit=500`)
      .then(r => r.json())
      .then(data => {
        const trades = data.trades || [];
        const map: Record<string, {outcome: string, pnl: number}> = {};
        // Keep most recent trade per symbol
        trades.forEach((t: any) => {
          if (!map[t.symbol] && t.outcome && t.outcome !== "open") {
            map[t.symbol] = {
              outcome: t.outcome,
              pnl: t.pnl_pct || 0,
            };
          }
        });
        setOutcomeMap(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const type = filter === "ALL" ? undefined : filter === "COMMOD" ? "COMMODITY" : filter === "INDIA" ? "IN_STOCK" : filter;
    fetchAllSignals(type).then(s => {
      setSignals(s);
      if (s.length > 0 && !selected) selectAsset(s[0], false);
    }).finally(() => setLoading(false));
    fetchMarketMood().then(setMood);
  }, [filter]);

  const selectAsset = (sig: any, switchPanel = true) => {
    setSelected(sig);
    setLivePrice(sig.current_price);
    setDetail(null);
    setDetailLoading(true);
    fetchSignal(sig.symbol).then(setDetail).catch((e) => { if (e instanceof UpgradeRequiredError) setUpgradeError({kind:e.kind as any,used:e.used,limit:e.limit}); }).finally(() => setDetailLoading(false));
    if (isMobile && switchPanel) setMobilePanel("SIGNAL");
  };

  const filtered = signals.filter(s =>
    s.symbol.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const windows = getExecutionWindows();
  const activeWindow = windows.find(w => w.active);
  const estTime = "";  // rendered by EstClock component

  // ── SHARED COMPONENTS ──────────────────────────────────────────

  const AssetList = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="SEARCH..."
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "6px 10px", color: "#e2e8f0", fontSize: 11, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {TYPE_FILTERS.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ background: filter === t ? "rgba(0,255,136,0.15)" : "transparent", border: `1px solid ${filter === t ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 3, padding: "3px 8px", color: filter === t ? "#00ff88" : "rgba(255,255,255,0.4)", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Skeleton while loading */}
        {loading && Array.from({length: 8}).map((_, i) => (
          <div key={i} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.04)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: "60%", height: 9, borderRadius: 3, background: "rgba(255,255,255,0.06)", marginBottom: 5 }} />
              <div style={{ width: "40%", height: 7, borderRadius: 3, background: "rgba(255,255,255,0.03)" }} />
            </div>
            <div style={{ width: 36, height: 18, borderRadius: 3, background: "rgba(255,255,255,0.04)" }} />
          </div>
        ))}
        {/* TOP SIGNALS — pinned, highest confidence BUY/SELL */}
        {!loading && signals.length > 0 && filter === "ALL" && (() => {
          const top = [...signals]
            .filter(s => s.direction !== "HOLD")
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 3);
          if (!top.length) return null;
          return (
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "8px 12px 6px" }}>
              <div style={{ fontSize: 8, color: "rgba(0,255,136,0.5)", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 6 }}>⚡ TOP SIGNALS</div>
              <div style={{ display: "flex", gap: 4 }}>
                {top.map(sig => (
                  <button key={sig.symbol} onClick={() => selectAsset(sig)} style={{
                    flex: 1, background: selected?.symbol === sig.symbol ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selected?.symbol === sig.symbol ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 4, padding: "5px 4px", cursor: "pointer", fontFamily: "inherit", textAlign: "center"
                  }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>{sig.display}</div>
                    <div style={{ fontSize: 8, fontWeight: 800, color: sig.direction === "BUY" ? "#00ff88" : "#ff4466" }}>{sig.direction}</div>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>{(sig.probability * 100).toFixed(0)}%</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}
        {loading ? (
          <>
          <style>{`
            @keyframes shimmer {
              0% { opacity: 0.15; }
              50% { opacity: 0.4; }
              100% { opacity: 0.15; }
            }
          `}</style>
          <div style={{ padding: "6px 12px", fontSize: 9, color: "rgba(0,255,136,0.5)", letterSpacing: "0.1em", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            ⟳ LOADING SIGNALS...
          </div>
          {[...Array(15)].map((_, i) => (
            <div key={i} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.03)", animation: `shimmer ${1.2 + (i % 3) * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.05}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                <div style={{ height: 9, background: "rgba(255,255,255,0.12)", borderRadius: 2, width: `${50 + (i % 4) * 12}px` }} />
                <div style={{ height: 9, background: "rgba(0,255,136,0.08)", borderRadius: 2, width: "28px" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ height: 7, background: "rgba(255,255,255,0.05)", borderRadius: 2, width: `${40 + (i % 3) * 15}px` }} />
                <div style={{ height: 7, background: "rgba(255,255,255,0.04)", borderRadius: 2, width: "30px" }} />
              </div>
            </div>
          ))}
          </>
        ) : filtered.map(sig => (
          <div key={sig.symbol} onClick={() => selectAsset(sig)} 
            style={{ padding: isMobile ? "14px 16px" : "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", background: selected?.symbol === sig.symbol ? "rgba(0,255,136,0.05)" : "transparent", borderLeft: selected?.symbol === sig.symbol ? "3px solid #00ff88" : "3px solid transparent" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: isMobile ? 15 : 12, fontWeight: 700, color: selected?.symbol === sig.symbol ? "#00ff88" : "#e2e8f0" }}>{sig.display}</span>
              <span style={badge(sig.direction)}>{sig.direction}</span>
              {outcomeMap[sig.symbol] && (
                <span style={{
                  fontSize: 8, fontWeight: 800, padding: "1px 5px", borderRadius: 3,
                  background: outcomeMap[sig.symbol].outcome === "TP_HIT" ? "rgba(0,255,136,0.15)" : "rgba(255,68,102,0.15)",
                  color: outcomeMap[sig.symbol].outcome === "TP_HIT" ? "#00ff88" : "#ff4466",
                  marginLeft: 4,
                }}>
                  {outcomeMap[sig.symbol].outcome === "TP_HIT" ? "✓" : "✗"}{outcomeMap[sig.symbol].pnl >= 0 ? "+" : ""}{outcomeMap[sig.symbol].pnl?.toFixed(1)}%
                </span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: isMobile ? 13 : 10, color: "rgba(255,255,255,0.4)", alignItems: "center" }}>
              <span>{formatPrice(sig.current_price, sig.type, sig.symbol)}</span>
              <EarningsBadge flag={sig.earnings_flag} />
              <AlertBell symbol={sig.symbol} />
              <span style={{ color: dirColor(sig.direction), fontWeight: 600 }}>{(sig.probability * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const [replayMode, setReplayMode] = useState(false);
  const [guardianSignal, setGuardianSignal] = useState<any>(null);
  const [showReplayAI, setShowReplayAI] = useState(false);
  const [replayAIText, setReplayAIText] = useState("");
  const [replayAILoading, setReplayAILoading] = useState(false);

  const fetchReplayAI = async () => {
    if (!replayData) return;
    setShowReplayAI(true);
    setReplayAILoading(true);
    setReplayAIText("");
    try {
      const prompt = `You are a sharp trading analyst. Explain this historical signal in 4-5 conversational sentences like you're talking to a trader friend. Be direct, specific, insightful. No fluff.

Asset: ${replayData.symbol}
Date: ${replayData.replay_date}
Price then: ${formatPrice(replayData.current_price, selected?.type, selected?.symbol)}
Signal: ${replayData.direction} (${replayData.confidence} confidence, ${(replayData.probability * 100).toFixed(1)}% probability)
Confluence: ${replayData.confluence_score}
What happened 5 days later: price went to ${formatPrice(replayData.actual_price_5d, selected?.type, selected?.symbol)} (${replayData.actual_return_5d > 0 ? '+' : ''}${replayData.actual_return_5d}%)
Was the signal correct: ${replayData.was_correct ? 'YES' : 'NO'}
Top indicators at the time: ${replayData.confluence?.map((c: any) => c.name + ': ' + c.signal).join(', ')}

Give a punchy, honest explanation of why the model made this call, what the market was doing, and what a trader should learn from this.`;

      const res = await fetch("https://quantsignal-api-production.up.railway.app/api/v1/replay/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: replayData.symbol,
          replay_date: replayData.replay_date,
          direction: replayData.direction,
          confidence: replayData.confidence,
          probability: replayData.probability,
          current_price: replayData.current_price,
          actual_price_5d: replayData.actual_price_5d,
          actual_return_5d: replayData.actual_return_5d,
          was_correct: replayData.was_correct,
          confluence_score: replayData.confluence_score,
          confluence: replayData.confluence,
        })
      });
      const data = await res.json();
      const text = data.explanation || "Could not generate explanation.";
      // Smooth reveal — just set text directly, no typewriter flicker
      setReplayAIText(text);
    } catch {
      setReplayAIText("Failed to generate explanation. Please try again.");
    } finally {
      setReplayAILoading(false);
    }
  };
  const [replayDate, setReplayDate] = useState("");
  const [replayData, setReplayData] = useState<any>(null);
  const [replayLoading, setReplayLoading] = useState(false);

  const fetchReplay = async (d: string) => {
    console.log("fetchReplay called", d, "selected:", selected?.symbol);
    if (!selected || !d) return;
    setReplayLoading(true);
    setReplayData(null);
    try {
      const res = await fetch(`https://quantsignal-api-production.up.railway.app/api/v1/signals/${selected.symbol}/replay?replay_date=${d}`);
      console.log("replay res status:", res.status);
      if (res.ok) { const data = await res.json(); console.log("replay data:", data.direction); setReplayData(data); }
    } catch {}
    finally { setReplayLoading(false); }
  };

  const activeDetail = replayMode && replayData ? replayData : detail;

  const SignalTab = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "20px 24px", background: "#060608" }}>
      {/* LIVE / REPLAY toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "8px 0", borderBottom: "1px solid rgba(0,255,136,0.15)", minHeight: 36, background: "rgba(0,255,136,0.03)" }}>
        <button onClick={() => { setReplayMode(false); setReplayData(null); }} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", border: "none", background: !replayMode ? "#00ff88" : "rgba(255,255,255,0.06)", color: !replayMode ? "#000" : "rgba(255,255,255,0.4)" }}>● LIVE</button>
        {(isPro || true) ? (
          <button onClick={() => setReplayMode(true)} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", border: "none", background: replayMode ? "#ffd700" : "rgba(255,255,255,0.06)", color: replayMode ? "#000" : "rgba(255,255,255,0.4)" }}>⏪ REPLAY</button>
        ) : (
          <button onClick={async () => {
            if (!user) { window.location.href = "/auth"; return; }
            const res = await fetch("https://quantsignal-api-production.up.railway.app/api/v1/payments/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: user.email, user_id: user.id }) });
            const d = await res.json();
            if (d.checkout_url) window.location.href = d.checkout_url;
          }} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,215,0,0.3)", background: "rgba(255,215,0,0.08)", color: "#ffd700" }}>🔒 REPLAY · PRO</button>
        )}
        {replayMode && (
          <input type="date" value={replayDate}
            max={new Date(Date.now() - 86400000).toISOString().split("T")[0]}
            min={new Date(Date.now() - 175 * 86400000).toISOString().split("T")[0]}
            onChange={e => { setReplayDate(e.target.value); fetchReplay(e.target.value); }}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 6, padding: "4px 10px", fontSize: 10, color: "#ffd700", outline: "none", fontFamily: "inherit" }} />
        )}
        {replayLoading && <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Loading...</span>}
        {replayMode && replayData && (
          <span style={{ fontSize: 9, fontWeight: 700, color: replayData.was_correct ? "#00ff88" : "#ff4466", marginLeft: "auto" }}>
            {replayData.was_correct ? "✓ CORRECT" : "✗ WRONG"} · 5d return: {replayData.actual_return_5d > 0 ? "+" : ""}{replayData.actual_return_5d}%
          </span>
        )}
      </div>

      {/* Historical badge */}
      {replayMode && replayData && (
        <div style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 6, padding: "6px 12px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#ffd700" }}>⏪ HISTORICAL SIGNAL — {replayDate}</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Price was {formatPrice(replayData.current_price, selected?.type, selected?.symbol)} · 5d later: {formatPrice(replayData.actual_price_5d, selected?.type, selected?.symbol)}</span>
          <button onClick={fetchReplayAI} style={{ marginLeft: "auto", background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 5, padding: "3px 10px", fontSize: 9, fontWeight: 700, color: "#ffd700", cursor: "pointer", fontFamily: "inherit" }}>🤖 Explain</button>
        </div>
      )}

      {/* AI Explanation Modal */}
      {showReplayAI && (
        <>
          <div onClick={() => setShowReplayAI(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", zIndex: 200, animation: "fadeIn 0.2s ease" }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "min(520px, 90vw)",
            background: "rgba(12,14,20,0.85)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: 16,
            padding: 24,
            zIndex: 201,
            boxShadow: "0 0 60px rgba(255,215,0,0.08), 0 24px 80px rgba(0,0,0,0.6)",
            animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <style>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)); } to { opacity: 1; transform: translate(-50%, -50%); } }
              @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
            `}</style>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#ffd700", letterSpacing: "0.08em" }}>AI REPLAY ANALYSIS</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{replayData.symbol} · {replayDate} · {replayData.direction}</div>
                </div>
              </div>
              <button onClick={() => setShowReplayAI(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16, padding: 4 }}>✕</button>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
              {replayAILoading && !replayAIText ? (
                <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "20px 0" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffd700", animation: `pulse 1.2s ease ${i*0.2}s infinite` }} />)}
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>Analyzing signal...</span>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontFamily: "inherit", animation: "fadeIn 0.4s ease" }}>
                  {replayAIText}
                  {replayAILoading && <span style={{ animation: "pulse 1s infinite", opacity: 0.6 }}>▊</span>}
                </div>
              )}
            </div>
            {!replayAILoading && replayAIText && (
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 9, color: replayData.was_correct ? "#00ff88" : "#ff4466", fontWeight: 700 }}>
                  {replayData.was_correct ? "✓ SIGNAL WAS CORRECT" : "✗ SIGNAL WAS WRONG"} · {replayData.actual_return_5d > 0 ? "+" : ""}{replayData.actual_return_5d}% in 5 days
                </span>
                <button onClick={() => setShowReplayAI(false)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px 12px", fontSize: 9, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>Close</button>
              </div>
            )}
          </div>
        </>
      )}

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 10 }}>EXECUTION WINDOWS</div>
        <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden" }}>
          {windows.map((w, i) => (
            <div key={w.label} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: w.active ? `${w.color}15` : "transparent", borderRight: i < windows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", padding: "5px 8px" }}>
              {w.active && <span style={{ width: 5, height: 5, borderRadius: "50%", background: w.color, display: "inline-block", flexShrink: 0 }} />}
              <span style={{ fontSize: 8, fontWeight: 700, color: w.active ? w.color : "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>{w.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 10 }}>REALTIME PRICE ACTION</div>
      {!isMobile ? (
        <div style={{ height: 420, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 20 }}>
          <TradingChart symbol={selected.symbol} />
        </div>
      ) : (
        <div style={{ height: 260, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 20, position: "relative" }}>
          <TradingChart symbol={selected.symbol} />
        </div>
      )}
      {activeDetail && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { label: "KELLY SIZE", value: `${activeDetail.kelly_size}%`, color: "#00aaff" },
              { label: "CONFLUENCE", value: activeDetail.confluence_score, color: "#00ff88" },
              { label: "RISK/REWARD", value: `${activeDetail.risk_reward}:1`, color: "#ffd700" },
              { label: "VOLUME", value: activeDetail.volume_ratio ? `${activeDetail.volume_ratio}x` : "—", color: activeDetail.volume_ratio >= 2.0 ? "#ff5252" : activeDetail.volume_ratio >= 1.5 ? "#ffc107" : "rgba(255,255,255,0.5)" },
            ].map(b => (
              <div key={b.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "12px 10px" }}>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginBottom: 6, letterSpacing: "0.1em" }}>{b.label}</div>
                <div style={{ fontSize: isMobile ? 14 : 18, fontWeight: 800, color: b.color }}>{b.value}</div>
              </div>
            ))}
          </div>
          {/* On mobile, show sidebar content inline under signal tab */}
          {isMobile && <SidebarContent />}
        </>
      )}
    </div>
  );

  const SidebarContent = () => (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10, letterSpacing: "0.1em" }}>V1 TRADE LEVELS</div>
        {[
          { label: "TP", value: activeDetail.take_profit, color: "#00ff88", pct: "+" + Math.abs(((activeDetail.take_profit - activeDetail.current_price) / activeDetail.current_price) * 100).toFixed(1) },
          { label: "ENTRY", value: activeDetail.current_price, color: "#fff", pct: "0.0" },
          { label: "SL", value: activeDetail.stop_loss, color: "#ff4466", pct: "-" + Math.abs(((activeDetail.stop_loss - activeDetail.current_price) / activeDetail.current_price) * 100).toFixed(1) },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 5, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, color: l.color }}>{l.label}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{l.pct !== "0.0" ? `${l.pct}%` : "ENTRY"}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>${l.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
      {/* Liquidity Levels Card */}
      {selected && ["BTC-USD","ETH-USD","SOL-USD","BNB-USD","XRP-USD","DOGE-USD","ADA-USD","AVAX-USD","DOT-USD","LINK-USD"].includes(selected.symbol) && (
        <ProGate isPro={isPro} user={user} featureName="Liquidity Levels">
          <LiquidityCard symbol={selected.symbol} />
        </ProGate>
      )}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10, letterSpacing: "0.1em" }}>ML PROBABILITY</div>

        {/* Probability Waterfall: Raw → Regime → Final */}
        {activeDetail.raw_probability && (
          <div style={{ marginBottom: 12 }}>
            {[
              { label: "RAW MODEL", value: activeDetail.raw_probability, color: "#00aaff" },
              { label: "REGIME ADJ", value: activeDetail.regime_adjusted_probability || activeDetail.probability, color: "#ffd700" },
              { label: "FINAL", value: activeDetail.probability, color: activeDetail.probability >= 0.5 ? "#00ff88" : activeDetail.probability >= 0.35 ? "#ffd700" : "#ff4466" },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>{row.label}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: row.color }}>{(row.value * 100).toFixed(0)}%</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${row.value * 100}%`, height: "100%", background: row.color, borderRadius: 2, transition: "width 0.4s ease" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Signal Reasoning */}
        {activeDetail.context_text && (
          <div style={{
            marginBottom: 12, padding: "10px 12px", borderRadius: 6,
            background: "rgba(0,170,255,0.06)",
            border: "1px solid rgba(0,170,255,0.15)",
          }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "#00aaff", marginBottom: 6 }}>
              💡 SIGNAL REASONING
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
              {activeDetail.context_text}
            </div>
            {activeDetail.conflict_detected && (
              <div style={{ marginTop: 6, fontSize: 9, color: "#ffd700", display: "flex", alignItems: "center", gap: 4 }}>
                ⚠️ {activeDetail.conflict_reason || "Signal conflict detected — trade with caution"}
              </div>
            )}
          </div>
        )}

        {/* Regime Badge */}
        {activeDetail.regime && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
              padding: "3px 8px", borderRadius: 4,
              background: activeDetail.regime === "bull" ? "rgba(0,255,136,0.1)" : activeDetail.regime === "bear" ? "rgba(255,68,102,0.1)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${activeDetail.regime === "bull" ? "rgba(0,255,136,0.3)" : activeDetail.regime === "bear" ? "rgba(255,68,102,0.3)" : "rgba(255,255,255,0.1)"}`,
              color: activeDetail.regime === "bull" ? "#00ff88" : activeDetail.regime === "bear" ? "#ff4466" : "rgba(255,255,255,0.4)",
            }}>
              {activeDetail.regime === "bull" ? "🐂" : activeDetail.regime === "bear" ? "🐻" : "↔"} {activeDetail.regime?.toUpperCase()} REGIME
            </div>
            {activeDetail.regime_suppressed && (
              <span style={{ fontSize: 8, color: "#ffd700", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)", padding: "2px 6px", borderRadius: 3 }}>
                SUPPRESSED
              </span>
            )}
            {activeDetail.energy && (
              <span style={{
                fontSize: 8, padding: "2px 6px", borderRadius: 3, fontWeight: 700,
                background: activeDetail.energy.state === "releasing" ? "rgba(0,255,136,0.1)" :
                            activeDetail.energy.state === "coiled"    ? "rgba(0,170,255,0.1)" :
                            activeDetail.energy.state === "exhausted" ? "rgba(255,68,102,0.1)" :
                            "rgba(255,255,255,0.05)",
                border: `1px solid ${activeDetail.energy.state === "releasing" ? "rgba(0,255,136,0.3)" :
                                     activeDetail.energy.state === "coiled"    ? "rgba(0,170,255,0.3)" :
                                     activeDetail.energy.state === "exhausted" ? "rgba(255,68,102,0.3)" :
                                     "rgba(255,255,255,0.1)"}`,
                color: activeDetail.energy.state === "releasing" ? "#00ff88" :
                       activeDetail.energy.state === "coiled"    ? "#00aaff" :
                       activeDetail.energy.state === "exhausted" ? "#ff4466" :
                       "rgba(255,255,255,0.4)",
              }}>
                {activeDetail.energy.state === "releasing" ? "⚡" :
                 activeDetail.energy.state === "coiled"    ? "🌀" :
                 activeDetail.energy.state === "exhausted" ? "💤" : "〰"} {activeDetail.energy.state?.toUpperCase()}
              </span>
            )}
          </div>
        )}

        {/* Energy Implication */}
        {activeDetail.energy?.implication && activeDetail.energy.state !== "neutral" && activeDetail.energy.state !== "unknown" && (
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginBottom: 10, padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4, borderLeft: `2px solid ${activeDetail.energy.state === "releasing" ? "rgba(0,255,136,0.3)" : activeDetail.energy.state === "coiled" ? "rgba(0,170,255,0.3)" : "rgba(255,68,102,0.3)"}` }}>
            ⚡ {activeDetail.energy.implication}
          </div>
        )}

        {/* Signal Bias */}
        {activeDetail.signal_bias && (
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginBottom: 10, padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4, borderLeft: "2px solid rgba(255,215,0,0.3)" }}>
            {activeDetail.signal_bias}
          </div>
        )}

        {/* Final probability bar */}
        <div style={{ height: 20, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", display: "flex", marginBottom: 6 }}>
          <div style={{ width: `${activeDetail.probability * 100}%`, background: "linear-gradient(90deg, #00ff88, #00cc66)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#000" }}>
            {(activeDetail.probability * 100).toFixed(0)}%
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#ff4466", fontWeight: 700 }}>
            {((1 - activeDetail.probability) * 100).toFixed(0)}%
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
          <span>BUY</span>
          <span>Agreement: {(activeDetail.model_agreement * 100).toFixed(0)}%</span>
          <span>SELL</span>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>9-FACTOR CONFLUENCE</div>
          <span style={{ fontSize: 9, fontWeight: 800, color: "#00ff88", background: "rgba(0,255,136,0.1)", padding: "2px 6px", borderRadius: 3 }}>{activeDetail.confluence_score}</span>
          {activeDetail.volume_ratio >= 1.5 && (
            <span style={{ fontSize: 9, fontWeight: 800, color: activeDetail.volume_ratio >= 2.5 ? "#ff5252" : "#ffc107", background: activeDetail.volume_ratio >= 2.5 ? "rgba(255,82,82,0.1)" : "rgba(255,193,7,0.1)", padding: "2px 6px", borderRadius: 3, marginLeft: 4 }}>
              ↑ {activeDetail.volume_ratio}x VOL
            </span>
          )}
        </div>
        {activeDetail.confluence?.map((c: any) => (
          <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: c.signal === "BULLISH" ? "#00ff88" : "#ff4466", flexShrink: 0 }} />
            <span style={{ flex: 1, color: "rgba(255,255,255,0.5)", fontSize: 9 }}>{c.name}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: c.signal === "BULLISH" ? "#00ff88" : "#ff4466" }}>{c.signal === "BULLISH" ? "BULL" : "BEAR"}</span>
          </div>
        ))}
      </div>
      <EarningsBadge flag={activeDetail.earnings_flag} />
      <MTFBar mtf={activeDetail?.mtf} direction={activeDetail?.direction} />
      <ShockWarning shock={activeDetail?.shock_warning} />
      {activeDetail?.insider?.available && activeDetail.insider.trades?.length > 0 && (
        <div style={{ background: "rgba(255,193,7,0.05)", border: "1px solid rgba(255,193,7,0.2)", borderRadius: 6, padding: "10px 14px", marginBottom: 12 }}>
          <div style={{ fontSize: 8, fontWeight: 800, color: "rgba(255,193,7,0.7)", letterSpacing: "0.12em", marginBottom: 6 }}>
            INSIDER ACTIVITY · SEC FORM 4 · {activeDetail.insider.summary}
          </div>
          {activeDetail.insider.trades.slice(0, 3).map((t: any, i: number) => (
            <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>
              <span style={{ color: "rgba(255,193,7,0.8)", fontWeight: 700 }}>{t.filer}</span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}> · Form {t.form} · {t.date}</span>
            </div>
          ))}
        </div>
      )}
      {activeDetail && (
        <div style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.12)", borderRadius: 6, padding: "10px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 8, fontWeight: 800, color: "rgba(0,255,136,0.5)", letterSpacing: "0.12em", marginBottom: 6 }}>IN PLAIN ENGLISH</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
            {generateOneLiner(activeDetail)}
          </div>
        </div>
      )}
      {activeDetail.reasoning && (
        <div style={{ background: "rgba(0,170,255,0.05)", border: "1px solid rgba(0,170,255,0.15)", borderRadius: 6, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Database size={10} color="#00aaff" />
            <span style={{ fontSize: 8, fontWeight: 800, color: "#00aaff", letterSpacing: "0.1em" }}>QUANT RAG REASONING</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontStyle: "italic" }}>
            "{activeDetail.reasoning.slice(0, 180)}..."
          </div>
        </div>
      )}
    </div>
  );

  // ── MOBILE LAYOUT ──────────────────────────────────────────────
  if (isMobile && !mounted) return <div style={{ background: "#060608", height: "100dvh" }} />;
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#060608", fontFamily: "'IBM Plex Mono', monospace", color: "#e2e8f0", overflow: "hidden" }}>
        {/* Mobile top bar */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {mobilePanel !== "LIST" && selected && (
              <button onClick={() => setMobilePanel("LIST")} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                <ChevronLeft size={16} />
              </button>
            )}
            <span style={{ color: "#00ff88", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>● QUANT SIGNALS</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 10 }}>
            <span style={{ color: activeWindow ? activeWindow.color : "rgba(255,255,255,0.2)", fontWeight: 600 }}>
              {activeWindow ? `● ${activeWindow.label.split(" ")[0]}` : "● CLOSED"}
            </span>
            <PushBell />
            <EstClock />
          </div>
        </div>

        {/* Mobile content area */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {mobilePanel === "LIST" && <AssetList />}

          {mobilePanel !== "LIST" && selected && (
            <>
              {/* Asset header */}
              <div style={{ padding: "12px 16px", background: "#0c0c0f", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{selected.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{selected.display}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{selected.name}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{formatPrice(livePrice || selected.current_price, selected.type, selected.symbol)}</div>
                  <div style={{ ...badge(selected.direction), display: "inline-block", marginTop: 2 }}>{selected.direction} · {(selected.probability * 100).toFixed(0)}%</div>
                </div>
              </div>

              {/* Tab content */}
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {mobilePanel === "SIGNAL" && <SignalTab />}
                {mobilePanel === "NEWS" && selected && <NewsTab symbol={selected.symbol} />}
                {mobilePanel === "CHAT" && (
                  <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "0 16px 16px" }}>
                    <AgentChat symbol={selected.symbol} userId={user?.id} />
                  </div>
                )}
                {mobilePanel === "CALENDAR" && <EconomicCalendar />}
              </div>
            </>
          )}
        </div>

        {/* PWA Install Banner */}
        {canInstall && (
          <div style={{ background: "rgba(0,255,136,0.08)", borderTop: "1px solid rgba(0,255,136,0.2)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#00ff88" }}>📲 Install QuantSignal</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Add to home screen for instant access</div>
            </div>
            <button onClick={install} style={{ background: "#00ff88", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 10, fontWeight: 800, color: "#000", cursor: "pointer", fontFamily: "inherit" }}>
              INSTALL
            </button>
          </div>
        )}

        {/* Mobile bottom nav */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "#0a0a0c", display: "flex", flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom)", position: "relative" }}>
          {/* Hamburger menu overlay */}
          {showMobileMenu && (
            <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={() => setShowMobileMenu(false)}>
              <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "#0e0f14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px 16px 0 0", padding: "16px 0" }} onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", padding: "0 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>MORE</div>
                {[
                  { href: "/guardian", icon: "🛡️", label: "Trade Guardian", desc: "Risk check before entering" },
                  { href: "/performance", icon: "📈", label: "Performance", desc: "90-day signal track record" },
                  { href: "/agents", icon: "🤖", label: "Agents", desc: "Virtual paper trading" },
                  { href: "/portfolio", icon: "📊", label: "Portfolio Lab", desc: "Optimize your holdings" },
                  { id: "NEWS", icon: "📰", label: "News Feed", desc: "Live market news" },
                  { id: "ANALYSIS", icon: "📈", label: "Signal Analysis", desc: "Full ML breakdown" },
                ].map(item => (
                  <div key={item.href || item.id} onClick={() => {
                    if (item.href) window.location.href = item.href;
                    else { setMobilePanel(item.id!); setShowMobileMenu(false); }
                  }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{item.label}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3 main tabs */}
          {[
            { id: "LIST", icon: List, label: "SIGNALS" },
            { id: "CHAT", icon: MessageSquare, label: "PERSEUS" },
            { id: "CALENDAR", icon: Calendar, label: "CALENDAR" },
          ].map(tab => {
            const active = mobilePanel === tab.id;
            return (
              <button key={tab.id}
                onClick={() => { if (tab.id !== "LIST" && !selected) return; setMobilePanel(tab.id); setShowMobileMenu(false); }}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0", background: "transparent", border: "none", borderTop: `2px solid ${active ? "#00ff88" : "transparent"}`, color: active ? "#00ff88" : "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "inherit", gap: 3 }}>
                <tab.icon size={16} color={active ? "#00ff88" : "rgba(255,255,255,0.3)"} />
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.05em" }}>{tab.label}</span>
              </button>
            );
          })}

          {/* Hamburger */}
          <button onClick={() => setShowMobileMenu(m => !m)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0", background: "transparent", border: "none", borderTop: `2px solid ${showMobileMenu ? "#00ff88" : "transparent"}`, color: showMobileMenu ? "#00ff88" : "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "inherit", gap: 3 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ width: 16, height: 2, background: showMobileMenu ? "#00ff88" : "rgba(255,255,255,0.3)", borderRadius: 1 }} />
              <div style={{ width: 16, height: 2, background: showMobileMenu ? "#00ff88" : "rgba(255,255,255,0.3)", borderRadius: 1 }} />
              <div style={{ width: 16, height: 2, background: showMobileMenu ? "#00ff88" : "rgba(255,255,255,0.3)", borderRadius: 1 }} />
            </div>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.05em" }}>MORE</span>
          </button>
        </div>
        <TutorialModal />
      </div>
    );
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#060608", fontFamily: "'IBM Plex Mono', monospace", color: "#e2e8f0" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#00ff88", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em" }}>● QUANT SIGNALS</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />
            <a href="/performance" style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textDecoration: "none", padding: "3px 10px", borderRadius: 4, letterSpacing: "0.06em", transition: "color 0.15s" }} onMouseEnter={e => (e.currentTarget.style.color="#fff")} onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.5)")}>PERFORMANCE</a>
            <a href="/guardian" style={{ fontSize: 10, color: "#00ff88", textDecoration: "none", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 4, padding: "3px 10px", background: "rgba(0,255,136,0.06)", letterSpacing: "0.06em" }}>GUARDIAN</a>
            <a href="/agents" style={{ fontSize: 10, color: "#ffc107", textDecoration: "none", border: "1px solid rgba(255,193,7,0.2)", borderRadius: 4, padding: "3px 10px", background: "rgba(255,193,7,0.06)", letterSpacing: "0.06em" }}>AGENTS</a>
            <a href="/portfolio" style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textDecoration: "none", padding: "3px 10px", borderRadius: 4, letterSpacing: "0.06em" }} onMouseEnter={e => (e.currentTarget.style.color="#fff")} onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.5)")}>PORTFOLIO</a>

          </div>
          <span style={{ color: activeWindow ? activeWindow.color : "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 600 }}>
            {activeWindow ? `● ${activeWindow.label}` : "● MARKET CLOSED"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 11, alignItems: "center" }}>
          <EstClock />
          {mood && <>
            <span>SIGNALS <span style={{ color: "#00ff88", fontWeight: 600 }}>86</span></span>
            <span>BUY / SELL <span style={{ color: "#00ff88" }}>{mood.buy_count}</span> / <span style={{ color: "#ff4466" }}>{mood.sell_count}</span></span>
            <span>MOOD <span style={{ color: mood.mood === "BULLISH" ? "#00ff88" : mood.mood === "BEARISH" ? "#ff4466" : "#ffd700", fontWeight: 600 }}>{mood.mood}</span></span>
                    </>}
          {user ? (
            <a href="/pricing" style={{ fontSize: 10, fontWeight: 700, color: isPro ? "#ffd700" : "rgba(255,255,255,0.35)", border: isPro ? "1px solid rgba(255,215,0,0.25)" : "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "3px 10px", background: isPro ? "rgba(255,215,0,0.06)" : "transparent", textDecoration: "none", letterSpacing: "0.06em" }}>
              {isPro ? "PRO" : "FREE"}
            </a>
          ) : (
            <a href="/auth" style={{ fontSize: 10, color: "#fff", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, padding: "3px 10px", background: "rgba(255,255,255,0.05)", letterSpacing: "0.06em" }}>SIGN IN</a>
          )}
        </div>
      </div>

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left panel — Analyst Sidebar */}
        <div style={{ width: 300, borderRight: "1px solid rgba(255,255,255,0.06)", background: "#0a0a0c", overflowY: "auto", padding: "16px", flexShrink: 0, scrollbarWidth: "thin" as const }}>
          {selected && detail ? <SidebarContent /> : <div style={{ color: "rgba(255,255,255,0.1)", fontSize: 11, marginTop: 60, textAlign: "center", letterSpacing: "0.12em" }}>SELECT AN ASSET</div>}
        </div>

        {/* Center panel */}
        {!selected ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
            SELECT AN ASSET TO INITIALIZE PERSEUS AGENT
          </div>
        ) : (
          <div className="qs-scroll" style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", borderRight: "1px solid rgba(255,255,255,0.06)", background: "#060608" }}>
            {/* Asset header */}
            <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0c0c0f", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28 }}>{selected.icon}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{selected.display}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{selected.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 9, color: "#00ff88", background: "rgba(0,255,136,0.1)", padding: "2px 6px", borderRadius: 3, fontWeight: 700 }}>LIVE FEED</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{selected.type}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{formatPrice(livePrice || selected.current_price, selected.type, selected.symbol)}</div>
                <div style={{ ...badge(selected.direction), display: "inline-block", marginTop: 4 }}>{selected.direction} · {(selected.probability * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", background: "#0c0c0f", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
              {[
                { id: "SIGNAL", label: "SIGNAL ANALYSIS", icon: LayoutDashboard },
                { id: "NEWS", label: "NEWS", icon: Newspaper },
                { id: "CHAT", label: "PERSEUS ENGINE", icon: MessageSquare },
                { id: "TRACK", label: "TRACK RECORD", icon: Database },
                { id: "CALENDAR", label: "ECON CALENDAR", icon: Calendar },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 18px", background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? "#00ff88" : "transparent"}`, color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em" }}>
                  <tab.icon size={11} color={activeTab === tab.id ? "#00ff88" : "rgba(255,255,255,0.35)"} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
              {activeTab === "SIGNAL" && <SignalTab />}
              {activeTab === "CHAT" && (
                <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "0 24px 24px" }}>
                  <AgentChat symbol={selected.symbol} />
                </div>
              )}
              {activeTab === "CALENDAR" && <EconomicCalendar />}
              {activeTab === "NEWS" && selected && <NewsTab symbol={selected.symbol} />}
              {activeTab === "TRACK" && selected && <TrackRecordTab symbol={selected.symbol} />}
            </div>
          </div>
        )}

        {/* Right panel — Asset List (collapsible) */}
        <div style={{ display: "flex", flexDirection: "row", flexShrink: 0 }}>
          {/* Toggle tab */}
          <div
            onClick={() => setShowAssetList(p => !p)}
            style={{
              width: 28, background: "#0a0a0c", borderLeft: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0, userSelect: "none",
            }}
            title={showAssetList ? "Hide asset list" : "Show asset list"}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ width: 14, height: 2, borderRadius: 1, background: showAssetList ? "rgba(0,255,136,0.6)" : "rgba(255,255,255,0.25)" }} />
              <div style={{ width: 14, height: 2, borderRadius: 1, background: showAssetList ? "rgba(0,255,136,0.6)" : "rgba(255,255,255,0.25)" }} />
              <div style={{ width: 14, height: 2, borderRadius: 1, background: showAssetList ? "rgba(0,255,136,0.6)" : "rgba(255,255,255,0.25)" }} />
            </div>
          </div>
          {/* Panel — always mounted, width:0 when hidden so chart never remounts */}
          <div className="qs-scroll" style={{
            width: showAssetList ? 240 : 0,
            minWidth: 0,
            overflow: "hidden",
            borderLeft: showAssetList ? "1px solid rgba(255,255,255,0.06)" : "none",
            display: "flex",
            flexDirection: "column",
            background: "#0a0a0c",
            transition: "width 0.25s ease",
            flexShrink: 0,
          }}>
            <AssetList />
          </div>
        </div>
      </div>
      <TutorialModal />
      {guardianSignal && (
        <TradeGuardian signal={guardianSignal} onClose={() => setGuardianSignal(null)} />
      )}
    </div>
  );
}