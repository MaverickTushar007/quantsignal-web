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

const TYPE_FILTERS = ["ALL", "CRYPTO", "STOCK", "ETF", "INDEX", "COMMOD", "FOREX"];
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

function EstClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = (now.getUTCHours() - 5 + 24) % 24;
      const m = now.getUTCMinutes();
      setTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} EST`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>{time}</span>;
}

export default function Dashboard() {
  const [signals, setSignals] = useState<any[]>([]);
  const [mood, setMood] = useState<any>(null);
  const [filter, setFilter] = useState("ALL");
  const { user, isPro } = useAuth();
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setMounted(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);


  useEffect(() => {
    setLoading(true);
    const type = filter === "ALL" ? undefined : filter === "COMMOD" ? "COMMODITY" : filter;
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
    fetchSignal(sig.symbol).then(setDetail).finally(() => setDetailLoading(false));
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
        {loading ? [...Array(15)].map((_, i) => (
          <div key={i} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.03)", opacity: 0.3 }}>
            <div style={{ height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 6 }} />
            <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 2, width: "60%" }} />
          </div>
        )) : filtered.map(sig => (
          <div key={sig.symbol} onClick={() => selectAsset(sig)}
            style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer", background: selected?.symbol === sig.symbol ? "rgba(0,255,136,0.05)" : "transparent", borderLeft: selected?.symbol === sig.symbol ? "2px solid #00ff88" : "2px solid transparent" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: selected?.symbol === sig.symbol ? "#00ff88" : "#e2e8f0" }}>{sig.display}</span>
              <span style={badge(sig.direction)}>{sig.direction}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.3)", alignItems: "center" }}>
              <span>${sig.current_price?.toLocaleString()}</span>
              <span style={{ color: dirColor(sig.direction) }}>{(sig.probability * 100).toFixed(0)}%</span>
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
Price then: $${replayData.current_price.toLocaleString()}
Signal: ${replayData.direction} (${replayData.confidence} confidence, ${(replayData.probability * 100).toFixed(1)}% probability)
Confluence: ${replayData.confluence_score}
What happened 5 days later: price went to $${replayData.actual_price_5d?.toLocaleString()} (${replayData.actual_return_5d > 0 ? '+' : ''}${replayData.actual_return_5d}%)
Was the signal correct: ${replayData.was_correct ? 'YES' : 'NO'}
Top indicators at the time: ${replayData.confluence?.map((c: any) => c.name + ': ' + c.signal).join(', ')}

Give a punchy, honest explanation of why the model made this call, what the market was doing, and what a trader should learn from this.`;

      const res = await fetch("https://web-production-1a093.up.railway.app/api/v1/replay/explain", {
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
      const res = await fetch(`https://web-production-1a093.up.railway.app/api/v1/signals/${selected.symbol}/replay?replay_date=${d}`);
      console.log("replay res status:", res.status);
      if (res.ok) { const data = await res.json(); console.log("replay data:", data.direction); setReplayData(data); }
    } catch {}
    finally { setReplayLoading(false); }
  };

  const activeDetail = replayMode && replayData ? replayData : detail;

  const SignalTab = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "20px 24px" }}>
      {/* LIVE / REPLAY toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "8px 0", borderBottom: "1px solid rgba(0,255,136,0.15)", minHeight: 36, background: "rgba(0,255,136,0.03)" }}>
        <button onClick={() => { setReplayMode(false); setReplayData(null); }} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", border: "none", background: !replayMode ? "#00ff88" : "rgba(255,255,255,0.06)", color: !replayMode ? "#000" : "rgba(255,255,255,0.4)" }}>● LIVE</button>
        {(isPro || true) ? (
          <button onClick={() => setReplayMode(true)} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", border: "none", background: replayMode ? "#ffd700" : "rgba(255,255,255,0.06)", color: replayMode ? "#000" : "rgba(255,255,255,0.4)" }}>⏪ REPLAY</button>
        ) : (
          <button onClick={async () => {
            if (!user) { window.location.href = "/auth"; return; }
            const res = await fetch("https://web-production-1a093.up.railway.app/api/v1/payments/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: user.email, user_id: user.id }) });
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
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Price was ${replayData.current_price.toLocaleString()} · 5d later: ${replayData.actual_price_5d?.toLocaleString()}</span>
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
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 8 }}>
          {windows.map(w => (
            <div key={w.label} style={{ background: w.active ? `${w.color}15` : "rgba(255,255,255,0.02)", border: `1px solid ${w.active ? `${w.color}40` : "rgba(255,255,255,0.06)"}`, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: w.active ? w.color : "rgba(255,255,255,0.3)", marginBottom: 3 }}>{w.active ? "● " : ""}{w.label}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{w.range}</div>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { label: "KELLY SIZE", value: `${activeDetail.kelly_size}%`, color: "#00aaff" },
              { label: "CONFLUENCE", value: activeDetail.confluence_score, color: "#00ff88" },
              { label: "RISK/REWARD", value: `${activeDetail.risk_reward}:1`, color: "#ffd700" },
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
        </div>
        {activeDetail.confluence?.map((c: any) => (
          <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: c.signal === "BULLISH" ? "#00ff88" : "#ff4466", flexShrink: 0 }} />
            <span style={{ flex: 1, color: "rgba(255,255,255,0.5)", fontSize: 9 }}>{c.name}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: c.signal === "BULLISH" ? "#00ff88" : "#ff4466" }}>{c.signal === "BULLISH" ? "BULL" : "BEAR"}</span>
          </div>
        ))}
      </div>
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
  if (!mounted) return <div style={{ background: "#060608", height: "100dvh" }} />;
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
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>${(livePrice || selected.current_price)?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div style={{ ...badge(selected.direction), display: "inline-block", marginTop: 2 }}>{selected.direction} · {(selected.probability * 100).toFixed(0)}%</div>
                </div>
              </div>

              {/* Tab content */}
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {mobilePanel === "SIGNAL" && <SignalTab />}
                {mobilePanel === "NEWS" && selected && <NewsTab symbol={selected.symbol} />}
                {mobilePanel === "CHAT" && (
                  <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "0 16px 16px" }}>
                    <AgentChat symbol={selected.symbol} />
                  </div>
                )}
                {mobilePanel === "CALENDAR" && <EconomicCalendar />}
              </div>
            </>
          )}
        </div>

        {/* Mobile bottom nav */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "#0a0a0c", display: "flex", flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom)" }}>
          <a href="/guardian" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "8px 0", textDecoration: "none", gap: 3 }}>
            <span style={{ fontSize: 14 }}>🛡️</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: "#00ff88", letterSpacing: "0.05em" }}>GUARDIAN</span>
          </a>
          <a href="/portfolio" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "8px 0", textDecoration: "none", gap: 3 }}>
            <span style={{ fontSize: 14 }}>📊</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: "#00aaff", letterSpacing: "0.05em" }}>PORTFOLIO</span>
          </a>
          {[
            { id: "LIST", icon: List, label: "SIGNALS" },
            { id: "SIGNAL", icon: LayoutDashboard, label: "ANALYSIS" },
            { id: "NEWS", icon: Newspaper, label: "NEWS" },
            { id: "CHAT", icon: MessageSquare, label: "PERSEUS" },
            { id: "CALENDAR", icon: Calendar, label: "CALENDAR" },
          ].map(tab => {
            const active = mobilePanel === tab.id;
            return (
              <button key={tab.id}
                onClick={() => {
                  if (tab.id !== "LIST" && !selected) return;
                  setMobilePanel(tab.id);
                }}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0", background: "transparent", border: "none", borderTop: `2px solid ${active ? "#00ff88" : "transparent"}`, color: active ? "#00ff88" : "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "inherit", gap: 3 }}>
                <tab.icon size={16} color={active ? "#00ff88" : "rgba(255,255,255,0.3)"} />
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.05em" }}>{tab.label}</span>
              </button>
            );
          })}
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
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => window.dispatchEvent(new Event("open-tutorial"))} style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontFamily: "inherit" }}>TUTORIAL</button>
            <a href="/how-it-works" style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 8px" }}>HOW IT WORKS</a>
            <a href="/guardian" style={{ fontSize: 10, color: "#00ff88", textDecoration: "none", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 4, padding: "2px 8px", background: "rgba(0,255,136,0.08)" }}>🛡️ GUARDIAN</a>
            {user ? (
              <span style={{ fontSize: 10, fontWeight: 700, color: isPro ? "#ffd700" : "rgba(255,255,255,0.3)", border: isPro ? "1px solid rgba(255,215,0,0.3)" : "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 8px", background: isPro ? "rgba(255,215,0,0.08)" : "transparent" }}>
                {isPro ? "✨ PRO" : "FREE"}
              </span>
            ) : (
              <a href="/auth" style={{ fontSize: 10, color: "#fff", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 4, padding: "2px 8px", background: "rgba(255,255,255,0.06)" }}>Sign In</a>
            )}
            <a href="/portfolio" style={{ fontSize: 10, color: "#00aaff", textDecoration: "none", border: "1px solid rgba(0,170,255,0.3)", borderRadius: 4, padding: "2px 8px", background: "rgba(0,170,255,0.08)" }}>📊 PORTFOLIO</a>
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
            <span style={{ color: "rgba(255,255,255,0.3)" }}>yfinance · Groq · RAG</span>
          </>}
        </div>
      </div>

      <MarketSentiment />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left panel */}
        <div style={{ width: 240, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0, background: "#0a0a0c" }}>
          <AssetList />
        </div>

        {/* Center panel */}
        {!selected ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
            SELECT AN ASSET TO INITIALIZE PERSEUS AGENT
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
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
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>${(livePrice || selected.current_price)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div style={{ ...badge(selected.direction), display: "inline-block", marginTop: 4 }}>{selected.direction} · {(selected.probability * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", background: "#0c0c0f", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
              {[
                { id: "SIGNAL", label: "SIGNAL ANALYSIS", icon: LayoutDashboard },
                { id: "NEWS", label: "NEWS", icon: Newspaper },
                { id: "CHAT", label: "PERSEUS ENGINE", icon: MessageSquare },
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
            </div>
          </div>
        )}

        {/* Right sidebar — desktop only */}
        {detail && (
          <div style={{ width: 300, background: "#0a0a0c", overflowY: "auto", padding: "16px", flexShrink: 0 }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 16 }}>ANALYST SIDEBAR</div>
            <SidebarContent />
          </div>
        )}
      </div>
      <TutorialModal />
      {guardianSignal && (
        <TradeGuardian signal={guardianSignal} onClose={() => setGuardianSignal(null)} />
      )}
    </div>
  );
}