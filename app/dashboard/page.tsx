"use client";
import { useEffect, useState } from "react";
import { fetchAllSignals, fetchMarketMood, fetchSignal } from "../lib/api";
import TradingChart from "../components/TradingChart";
import TutorialModal from "../components/TutorialModal";
import AgentChat from "../components/AgentChat";
import { LayoutDashboard, MessageSquare, Calendar, Database, List, ChevronLeft, Newspaper } from "lucide-react";
import EconomicCalendar from "../components/EconomicCalendar";
import NewsTab from "../components/NewsTab";
import MarketSentiment from "../components/MarketSentiment";

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
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
              <span>${sig.current_price?.toLocaleString()}</span>
              <span style={{ color: dirColor(sig.direction) }}>{(sig.probability * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SignalTab = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "20px 24px" }}>
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
      {detail && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { label: "KELLY SIZE", value: `${detail.kelly_size}%`, color: "#00aaff" },
              { label: "CONFLUENCE", value: detail.confluence_score, color: "#00ff88" },
              { label: "RISK/REWARD", value: `${detail.risk_reward}:1`, color: "#ffd700" },
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
          { label: "TP", value: detail.take_profit, color: "#00ff88", pct: "+" + Math.abs(((detail.take_profit - detail.current_price) / detail.current_price) * 100).toFixed(1) },
          { label: "ENTRY", value: detail.current_price, color: "#fff", pct: "0.0" },
          { label: "SL", value: detail.stop_loss, color: "#ff4466", pct: "-" + Math.abs(((detail.stop_loss - detail.current_price) / detail.current_price) * 100).toFixed(1) },
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
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>9-FACTOR CONFLUENCE</div>
          <span style={{ fontSize: 9, fontWeight: 800, color: "#00ff88", background: "rgba(0,255,136,0.1)", padding: "2px 6px", borderRadius: 3 }}>{detail.confluence_score}</span>
        </div>
        {detail.confluence?.map((c: any) => (
          <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: c.signal === "BULLISH" ? "#00ff88" : "#ff4466", flexShrink: 0 }} />
            <span style={{ flex: 1, color: "rgba(255,255,255,0.5)", fontSize: 9 }}>{c.name}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: c.signal === "BULLISH" ? "#00ff88" : "#ff4466" }}>{c.signal === "BULLISH" ? "BULL" : "BEAR"}</span>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10, letterSpacing: "0.1em" }}>ML PROBABILITY</div>
        <div style={{ height: 20, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", display: "flex", marginBottom: 6 }}>
          <div style={{ width: `${detail.probability * 100}%`, background: "linear-gradient(90deg, #00ff88, #00cc66)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#000" }}>
            {(detail.probability * 100).toFixed(0)}%
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#ff4466", fontWeight: 700 }}>
            {((1 - detail.probability) * 100).toFixed(0)}%
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
          <span>BUY</span>
          <span>Agreement: {(detail.model_agreement * 100).toFixed(0)}%</span>
          <span>SELL</span>
        </div>
      </div>
      {detail.reasoning && (
        <div style={{ background: "rgba(0,170,255,0.05)", border: "1px solid rgba(0,170,255,0.15)", borderRadius: 6, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Database size={10} color="#00aaff" />
            <span style={{ fontSize: 8, fontWeight: 800, color: "#00aaff", letterSpacing: "0.1em" }}>QUANT RAG REASONING</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontStyle: "italic" }}>
            "{detail.reasoning.slice(0, 180)}..."
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
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
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
    </div>
  );
}
