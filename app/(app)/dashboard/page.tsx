"use client";
import { PerseusStream } from "@/app/components/PerseusStream";
import FeedbackWidget from "../components/FeedbackWidget";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/useAuth";
import ProGate from "../components/ProGate";
import { fetchAllSignals, fetchMarketMood, fetchSignal, UpgradeRequiredError, subscribeAlert, fetchTradeHistory, fetchEvStats, fetchMorningBriefing, fetchReplay, explainReplay, createCheckout } from "../lib/api";
import TradingChart from "../components/TradingChart";
import TutorialModal from "../components/TutorialModal";
import AgentChat from "../components/AgentChat";
import { LayoutDashboard, MessageSquare, Calendar, Database, List, ChevronLeft, Newspaper, Bell, Bookmark, BarChart2, Settings } from "lucide-react";
import EconomicCalendar from "../components/EconomicCalendar";
import TradeGuardian from "../components/TradeGuardian";
import NewsTab from "../components/NewsTab";
import UpgradeModal from "../components/UpgradeModal";
import { StaggerList, StaggerItem, SlideInRight, PriceFlash } from "../components/Animated";
import SmoothScroll from "../components/SmoothScroll";
import LiquidityCard from "../components/dashboard/LiquidityCard";
import EstClock from "../components/dashboard/EstClock";
import AlertBell from "../components/dashboard/AlertBell";
import ShockWarning from "../components/dashboard/ShockWarning";
import MTFBar from "../components/dashboard/MTFBar";
import EarningsBadge from "../components/dashboard/EarningsBadge";
import PushBell from "../components/dashboard/PushBell";
import TrackRecordTab from "../components/dashboard/TrackRecordTab";
import { formatPrice, TYPE_FILTERS, dirColor, badge, getExecutionWindows, TIMEZONES } from "../lib/utils";
import { StaleBadge, MarketStatusBadge, generateOneLiner } from "../components/dashboard/SignalHelpers";
import AssetList from "../components/dashboard/AssetList";
import SignalTab from "../components/dashboard/SignalTab";
import SidebarContent from "../components/dashboard/SidebarContent";












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















// ── Track Record Component ────────────────────────────────────────────────




const DEMO_SIGNALS = [
  { symbol: "RELIANCE", name: "Reliance Industries", dir: "BUY",  prob: 87, price: "₹1,247" },
  { symbol: "NIFTY50",  name: "Nifty 50 Index",      dir: "BUY",  prob: 81, price: "₹22,460" },
  { symbol: "BTC-USD",  name: "Bitcoin",              dir: "SELL", prob: 74, price: "$84,200" },
  { symbol: "AAPL",     name: "Apple Inc.",           dir: "BUY",  prob: 69, price: "$202.50" },
  { symbol: "GOLD",     name: "Gold Futures",         dir: "BUY",  prob: 66, price: "$3,310" },
];
export default function Dashboard() {
  const [upgradeError, setUpgradeError] = useState<{kind:"signals"|"perseus",used:number,limit:number}|null>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [outcomeMap, setOutcomeMap] = useState<Record<string, {outcome: string, pnl: number}>>({});
  const [allTrades, setAllTrades] = useState<any[]>([]);
  const [evStats, setEvStats] = useState<any[]>([]);
  const [briefing, setBriefing] = useState<any>(null);
  const [briefingOpen, setBriefingOpen] = useState(false);
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
    Promise.allSettled([
      fetchTradeHistory(),
      fetchEvStats(),
      fetchMorningBriefing(),
    ]).then(([tradesRes, evRes, briefingRes]) => {
      if (tradesRes.status === "fulfilled") {
        const trades = tradesRes.value?.trades || [];
        setAllTrades(trades);
        const map: Record<string, {outcome: string, pnl: number}> = {};
        trades.forEach((t: any) => {
          if (!map[t.symbol] && t.outcome && t.outcome !== "open") {
            map[t.symbol] = { outcome: t.outcome, pnl: t.pnl_pct || 0 };
          }
        });
        setOutcomeMap(map);
      }
      if (evRes.status === "fulfilled") setEvStats(evRes.value?.ev_stats || []);
      if (briefingRes.status === "fulfilled") setBriefing(briefingRes.value);
    }).catch(() => {});
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

  const [replayMode, setReplayMode] = useState(false);
  const [guardianSignal, setGuardianSignal] = useState<any>(null);
  const [showReplayAI, setShowReplayAI] = useState(false);
  const [showFactors, setShowFactors] = useState(false);
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

      const data = await explainReplay({
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
        });
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
      const data = await fetchReplay(selected.symbol, d);
      setReplayData(data);
    } catch {}
    finally { setReplayLoading(false); }
  };

  const activeDetail = replayMode && replayData ? replayData : detail;

  // ── MOBILE LAYOUT ──────────────────────────────────────────────
  if (isMobile && !mounted) return <div style={{ background: "#0d1117", height: "100dvh" }} />;
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#0d1117", fontFamily: "'IBM Plex Mono', monospace", color: "#cbd5e1", overflow: "hidden" }}>
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
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {mobilePanel === "LIST" && <AssetList signals={signals} loading={loading} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} selected={selected} selectAsset={selectAsset} outcomeMap={outcomeMap} isMobile={isMobile} filtered={filtered} />}

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
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}><PriceFlash value={livePrice}>{formatPrice(livePrice || selected.current_price, selected.type, selected.symbol)}</PriceFlash></div>
                  <div style={{ ...badge(selected.direction), display: "inline-block", marginTop: 2 }}>{selected.direction} · {(selected.probability * 100).toFixed(0)}%</div>
                </div>
              </div>

              {/* Tab content */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {mobilePanel === "SIGNAL" && <SignalTab activeDetail={activeDetail} selected={selected} isMobile={isMobile} isPro={isPro} user={user} replayMode={replayMode} setReplayMode={setReplayMode} replayData={replayData} setReplayData={setReplayData} replayDate={replayDate} setReplayDate={setReplayDate} replayLoading={replayLoading} replayAIText={replayAIText} replayAILoading={replayAILoading} showReplayAI={showReplayAI} fetchReplayAI={fetchReplayAI} />}
                {mobilePanel === "NEWS" && selected && <NewsTab symbol={selected.symbol} />}
                {mobilePanel === "CHAT" && (
                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "0 16px 16px" }}>
                    <AgentChat symbol={selected.symbol} userId={user?.id} onUpgradeError={(kind, used, limit) => setUpgradeError({kind, used, limit})} />
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
              <div style={{ fontSize: 9, fontWeight: 700, color: "#00ff88" }}>📲 Install QuantSignal</div>
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
                  { href: "/agents", icon: "🤖", label: "Agents", desc: "Virtual paper trading" },

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
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>{tab.label}</span>
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
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>MORE</span>
          </button>
        </div>
        <TutorialModal />
      </div>
    );
  }


  // ── DEMO GATE (unauthenticated) ────────────────────────────────
  if (mounted && !user) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'IBM Plex Mono', monospace", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#00ff88", letterSpacing: "0.1em" }}>● QUANT SIGNALS</span>
          <a href="/auth" style={{ fontSize: 11, color: "#4ade80", textDecoration: "none", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 6, padding: "6px 14px", letterSpacing: "0.05em" }}>SIGN IN →</a>
        </div>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div style={{ width: 260, borderRight: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", padding: "12px 0" }}>
            <div style={{ padding: "8px 16px 12px", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>LIVE SIGNALS — PREVIEW</div>
            {DEMO_SIGNALS.map((s, i) => (
              <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", opacity: i >= 2 ? 0.35 : 1, filter: i >= 2 ? "blur(1.5px)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{s.symbol}</span>
                  <span style={{ fontSize: 10, color: s.dir === "BUY" ? "#4ade80" : "#ff4466", border: `1px solid ${s.dir === "BUY" ? "rgba(74,222,128,0.3)" : "rgba(255,68,102,0.3)"}`, borderRadius: 4, padding: "1px 6px" }}>{s.dir}</span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>{s.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{s.price}</span>
                  <span style={{ fontSize: 10, color: "#4ade80" }}>{s.prob}% conf.</span>
                </div>
              </div>
            ))}
            <div style={{ padding: "14px 16px", textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>+ 81 MORE ASSETS LOCKED</div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, filter: "blur(10px)", opacity: 0.25, padding: 48, pointerEvents: "none" }}>
              <div style={{ height: 220, background: "rgba(74,222,128,0.12)", borderRadius: 12, marginBottom: 16 }} />
              <div style={{ height: 70, background: "rgba(255,255,255,0.05)", borderRadius: 8, marginBottom: 8 }} />
              <div style={{ height: 70, background: "rgba(255,255,255,0.05)", borderRadius: 8, marginBottom: 8 }} />
              <div style={{ height: 70, background: "rgba(255,255,255,0.05)", borderRadius: 8 }} />
            </div>
            <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 380, padding: "0 24px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 22 }}>🔒</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "-0.02em" }}>ML-Powered Trading Signals</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 28 }}>86 assets · XGBoost + LightGBM ensemble · Perseus AI reasoning · Live track record</div>
              <a href="/auth?mode=signup&ref=demo" style={{ display: "inline-block", background: "#4ade80", color: "#0d1117", fontSize: 12, fontWeight: 700, padding: "12px 32px", borderRadius: 8, textDecoration: "none", letterSpacing: "0.06em", marginBottom: 14 }}>GET FREE ACCESS →</a>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Already have an account? <a href="/auth" style={{ color: "#4ade80", textDecoration: "none" }}>Sign in</a></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#0d1117", fontFamily: "'IBM Plex Mono', monospace", color: "#cbd5e1" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#00ff88", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em" }}>● QUANT SIGNALS</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <a href="/agents" style={{ fontSize: 10, color: "#ffc107", textDecoration: "none", border: "1px solid rgba(255,193,7,0.2)", borderRadius: 4, padding: "3px 10px", background: "rgba(255,193,7,0.06)", letterSpacing: "0.06em" }}>AGENTS</a>
            <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />





          </div>
          <span style={{ color: activeWindow ? activeWindow.color : "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 600 }}>
            {activeWindow ? `● ${activeWindow.label}` : "● MARKET CLOSED"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 9, alignItems: "center" }}>
          <EstClock />
          {mood && <>
            

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
        <SmoothScroll style={{ width: 300, borderRight: "1px solid rgba(255,255,255,0.06)", background: "#0a0a0c", padding: "16px", flexShrink: 0, scrollbarWidth: "thin" as const }}>
          {selected ? (detail ? <SidebarContent activeDetail={activeDetail} selected={selected} isPro={isPro} user={user} isMobile={isMobile} showFactors={showFactors} setShowFactors={setShowFactors} /> : <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}><div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 4 }}>TRADE LEVELS</div>{[{label:"TP",color:"#00ff88"},{label:"ENTRY",color:"#fff"},{label:"SL",color:"#ff4466"}].map(l=><div key={l.label} style={{height:36,background:"rgba(255,255,255,0.02)",borderRadius:5,border:"1px solid rgba(255,255,255,0.05)",animation:"pulse 1.5s ease infinite",marginBottom:4}}/>)}<style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style></div>) : <div style={{ color: "rgba(255,255,255,0.1)", fontSize: 9, marginTop: 60, textAlign: "center", letterSpacing: "0.12em" }}>SELECT AN ASSET</div>}
        </SmoothScroll>

        {/* Center panel */}
        {!selected ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
            SELECT AN ASSET TO INITIALIZE PERSEUS AGENT
          </div>
        ) : (
          <SlideInRight style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="qs-scroll" style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", background: "#0d1117" }}>
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
                { id: "GENERATE", label: "GENERATE SIGNAL", icon: MessageSquare },
                { id: "CHAT", label: "PERSEUS ENGINE", icon: MessageSquare },
                { id: "CALENDAR", label: "ECON CALENDAR", icon: Calendar },
                { id: "NEWS", label: "NEWS", icon: Newspaper },
                { id: "TRACK", label: "TRACK RECORD", icon: Database },
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
              {activeTab === "SIGNAL" && <SignalTab activeDetail={activeDetail} selected={selected} isMobile={isMobile} isPro={isPro} user={user} replayMode={replayMode} setReplayMode={setReplayMode} replayData={replayData} setReplayData={setReplayData} replayDate={replayDate} setReplayDate={setReplayDate} replayLoading={replayLoading} replayAIText={replayAIText} replayAILoading={replayAILoading} showReplayAI={showReplayAI} fetchReplayAI={fetchReplayAI} />}
              {activeTab === "GENERATE" && selected && <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}><PerseusStream symbol={selected.symbol} onComplete={() => {}} /></div>}
              {activeTab === "CHAT" && (
                <>
                  {/* Floating Morning Briefing pill — overlays engine, never pushes content */}
                  {briefing && (
                    <div style={{ position: "absolute", top: 12, left: 16, right: 16, zIndex: 20, pointerEvents: "none" }}>
                      <div style={{ pointerEvents: "auto" }}>
                        <div
                          onClick={() => setBriefingOpen(o => !o)}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            background: "rgba(0,10,20,0.85)", backdropFilter: "blur(12px)",
                            border: "1px solid rgba(0,170,255,0.2)", borderRadius: briefingOpen ? "8px 8px 0 0" : 8,
                            padding: "6px 12px", cursor: "pointer",
                            transition: "border-radius 0.2s"
                          }}
                        >
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00aaff", flexShrink: 0 }} />
                          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,170,255,0.7)", letterSpacing: "0.12em", flex: 1 }}>
                            MORNING BRIEFING · {briefing.date}
                          </span>
                          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", transform: briefingOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
                        </div>
                        {briefingOpen && (
                          <div style={{
                            background: "rgba(0,10,20,0.92)", backdropFilter: "blur(16px)",
                            border: "1px solid rgba(0,170,255,0.2)", borderTop: "none",
                            borderRadius: "0 0 8px 8px", padding: "12px 14px",
                            maxHeight: 220, overflowY: "auto"
                          }}>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "pre-wrap" }}>
                              {briefing.briefing_text}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "0 24px 24px" }}>
                    <AgentChat symbol={selected.symbol} onUpgradeError={(kind, used, limit) => setUpgradeError({kind, used, limit})} />
                  </div>
                </>
              )}
              {activeTab === "CALENDAR" && <EconomicCalendar />}
              {activeTab === "NEWS" && selected && <NewsTab symbol={selected.symbol} />}
              {activeTab === "TRACK" && selected && <TrackRecordTab symbol={selected.symbol} allTrades={allTrades} evStats={evStats} briefing={briefing} />}
            </div>
            </div>
          </SlideInRight>
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
            <AssetList signals={signals} loading={loading} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} selected={selected} selectAsset={selectAsset} outcomeMap={outcomeMap} isMobile={isMobile} filtered={filtered} />
          </div>
        </div>
      </div>
      
      {guardianSignal && (
        <TradeGuardian signal={guardianSignal} onClose={() => setGuardianSignal(null)} />
      )}
    </div>
  );
}