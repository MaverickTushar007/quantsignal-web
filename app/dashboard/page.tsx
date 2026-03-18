"use client";
import { useEffect, useState } from "react";
import { fetchAllSignals, fetchMarketMood, fetchSignal } from "../lib/api";
import TradingChart from "../components/TradingChart";
import TutorialModal from "../components/TutorialModal";
import AgentChat from "../components/AgentChat";
import { Terminal, Brain, Cpu, Database, LayoutDashboard, MessageSquare, Calendar } from "lucide-react";
import EconomicCalendar from "../components/EconomicCalendar";


const TYPE_FILTERS = ["ALL", "CRYPTO", "STOCK", "ETF", "INDEX", "COMMOD", "FOREX"];

const dirColor = (d: string) =>
  d === "BUY" ? "#00ff88" : d === "SELL" ? "#ff4466" : "#ffd700";

const badge = (d: string) => ({
  background: d === "BUY" ? "rgba(0,255,136,0.12)" : d === "SELL" ? "rgba(255,68,102,0.12)" : "rgba(255,215,0,0.12)",
  color: dirColor(d),
  border: `1px solid ${d === "BUY" ? "rgba(0,255,136,0.3)" : d === "SELL" ? "rgba(255,68,102,0.3)" : "rgba(255,215,0,0.3)"}`,
  padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em",
});

export default function Dashboard() {
  const [signals, setSignals] = useState<any[]>([]);
  const [mood, setMood] = useState<any>(null);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("SIGNAL"); // SIGNAL, CHAT, CALENDAR
  const [livePrice, setLivePrice] = useState<number | null>(null);

  useEffect(() => {
    if (!selected) return;
    setLivePrice(selected.current_price);

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host.includes("3000") ? "localhost:8000" : window.location.host;
    const wsUrl = `${protocol}//${host}/api/v1/ws/prices/${selected.symbol}`;
    
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.price) setLivePrice(data.price);
    };

    return () => ws.close();
  }, [selected?.symbol]);



  useEffect(() => {
    setLoading(true);
    const type = filter === "ALL" ? undefined : filter === "COMMOD" ? "COMMODITY" : filter;
    fetchAllSignals(type).then(s => { 
      setSignals(s); 
      if (s.length > 0 && !selected) selectAsset(s[0]); 
    }).finally(() => setLoading(false));
    fetchMarketMood().then(setMood);
  }, [filter]);

  const selectAsset = (sig: any) => {
    setSelected(sig);
    setDetail(null);
    setDetailLoading(true);
    fetchSignal(sig.symbol).then(setDetail).finally(() => setDetailLoading(false));
  };

  const filtered = signals.filter(s =>
    s.symbol.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#060608", fontFamily: "'Inter', sans-serif", color: "#e2e8f0" }}>

      {/* Top bar (Persist unchanged) */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#00ff88", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em" }}>● QUANT SIGNALS</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => window.dispatchEvent(new Event("open-tutorial"))} style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontFamily: "inherit" }}>TUTORIAL</button>
            <a href="/how-it-works" style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 8px" }}>HOW IT WORKS</a>
          </div>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>LIVE</span>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 11 }}>
          {mood && <>
            <span>SIGNALS <span style={{ color: "#00ff88", fontWeight: 600 }}>86</span></span>
            <span>BUY / SELL <span style={{ color: "#00ff88" }}>{mood.buy_count}</span> / <span style={{ color: "#ff4466" }}>{mood.sell_count}</span></span>
            <span>MARKET MOOD <span style={{ color: mood.mood === "BULLISH" ? "#00ff88" : mood.mood === "BEARISH" ? "#ff4466" : "#ffd700", fontWeight: 600 }}>{mood.mood}</span></span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>yfinance · Groq · RAG</span>
          </>}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* 1. Watchlist Sidebar (Left) */}
        <div style={{ width: 280, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0, background: "#0a0a0c" }}>
          <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="SEARCH..."
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "6px 10px", color: "#e2e8f0", fontSize: 11, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {TYPE_FILTERS.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                style={{ background: filter === t ? "rgba(0,255,136,0.15)" : "transparent", border: `1px solid ${filter === t ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 3, padding: "3px 8px", color: filter === t ? "#00ff88" : "rgba(255,255,255,0.4)", fontSize: 10, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em" }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? [...Array(15)].map((_, i) => (
                <div key={i} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.03)", opacity: 0.3, background: "rgba(255,255,255,0.02)", margin: "2px 8px", borderRadius: 4 }}>
                  <div style={{ height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 6 }} />
                  <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 2, width: "60%" }} />
                </div>
            )) : filtered.map(sig => (
              <div key={sig.symbol} onClick={() => selectAsset(sig)}
                style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer", background: selected?.symbol === sig.symbol ? "rgba(0,255,136,0.05)" : "transparent", borderLeft: selected?.symbol === sig.symbol ? "2px solid #00ff88" : "2px solid transparent", transition: "all 0.1s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: selected?.symbol === sig.symbol ? "#00ff88" : "#e2e8f0" }}>{sig.display}</span>
                  <span style={badge(sig.direction)}>{sig.direction}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                  <span>{sig.name}</span>
                  <span style={{ color: dirColor(sig.direction) }}>{(sig.probability * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Main Agent Workspace (Central) */}
        {!selected ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
            SELECT AN ASSET TO INITIALIZE PERSEUS AGENT
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            
            {/* Asset Performance Header */}
            <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", background: "#0c0c0f" }}>
               <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 32 }}>{selected.icon}</div>
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#fff" }}>{selected.display}<span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400, fontSize: 14, marginLeft: 8 }}>{selected.name}</span></h2>
                    <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: "#00ff88", background: "rgba(0,255,136,0.1)", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>LIVE FEED</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{selected.type} · BINANCE · NYSE</span>
                    </div>
                  </div>
               </div>
               <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", transition: "all 0.3s" }}>${(livePrice || selected.current_price)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div style={{ ...badge(selected.direction), display: "inline-block", marginTop: 4 }}>{selected.direction.toUpperCase()} SIGNAL · {(selected.probability*100).toFixed(1)}%</div>
               </div>

            </div>

            {/* Tab Bar Content */}
            <div style={{ display: "flex", background: "#0c0c0f", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
              {[
                { id: "SIGNAL", label: "SIGNAL ANALYSIS", icon: LayoutDashboard },
                { id: "CHAT", label: "PERSEUS CHAT", icon: MessageSquare },
                { id: "CALENDAR", label: "ECONOMIC CALENDAR", icon: Calendar },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "14px 20px",
                    background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? "#00ff88" : "transparent"}`,
                    color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.4)",
                    fontSize: 10, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  <tab.icon size={12} color={activeTab === tab.id ? "#00ff88" : "rgba(255,255,255,0.4)"} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {activeTab === "SIGNAL" && (
                <div style={{ padding: "24px", height: "100%", overflowY: "auto" }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 16 }}>REALTIME PRICE ACTION</div>
                  <div style={{ height: 500, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "#000" }}>
                    <TradingChart symbol={selected.symbol} />
                  </div>
                </div>
              )}
              {activeTab === "CHAT" && (
                 <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "0 24px 24px" }}>
                    <AgentChat symbol={selected.symbol} />
                 </div>
              )}
              {activeTab === "CALENDAR" && (
                 <EconomicCalendar />
              )}
            </div>
          </div>
        )}

        {/* 3. Analyst Sidebars (Right) */}
        {detail && (
          <div style={{ width: 320, background: "#0a0a0c", overflowY: "auto", padding: 20, flexShrink: 0 }}>
             <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 20 }}>ANALYST SIDEBAR</div>

             {/* Kelly + Confluence Scorecard */}
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                <div style={{ background: "rgba(0,170,255,0.05)", border: "1px solid rgba(0,170,255,0.15)", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 8, fontWeight: 800, color: "#00aaff", marginBottom: 4 }}>KELLY CRITERION</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{detail.kelly_size}%</div>
                </div>
                <div style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 8, fontWeight: 800, color: "#00ff88", marginBottom: 4 }}>CONFLUENCE</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{detail.confluence_score}<span style={{ fontSize: 10, opacity: 0.4 }}>/10</span></div>
                </div>
             </div>
             
             {/* Levels */}
             <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#fff", marginBottom: 16 }}>V1 TRADE LEVELS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                   {[
                     { label: "TP", value: detail.take_profit, color: "#00ff88" },
                     { label: "ENTRY", value: detail.current_price, color: "#fff" },
                     { label: "SL", value: detail.stop_loss, color: "#ff4466" },
                   ].map(l => (
                     <div key={l.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.05)" }}>
                       <span style={{ fontSize: 10, fontWeight: 800, color: l.color }}>{l.label}</span>
                       <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>${l.value?.toLocaleString()}</span>
                     </div>
                   ))}
                </div>
             </div>

             {/* 9-Factor Box */}
             <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#fff", marginBottom: 16 }}>9-FACTOR CONFLUENCE</div>
                {detail.confluence?.map((c: any) => (
                  <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: 10, opacity: 0.8 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: c.signal === "BULLISH" ? "#00ff88" : "#ff4466" }} />
                    <span style={{ flex: 1, color: "rgba(255,255,255,0.6)" }}>{c.name}</span>
                    <span style={{ color: c.signal === "BULLISH" ? "#00ff88" : "#ff4466", fontWeight: 700 }}>{c.signal.slice(0, 4)}</span>
                  </div>
                ))}
             </div>

             {/* RAG Context Quote */}
             {detail.reasoning && (
                <div style={{ background: "rgba(0,170,255,0.05)", border: "1px solid rgba(0,170,255,0.15)", borderRadius: 8, padding: 16 }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <Database size={12} color="#00aaff" />
                      <span style={{ fontSize: 9, fontWeight: 800, color: "#00aaff", letterSpacing: "0.1em" }}>QUANT RAG CORE</span>
                   </div>
                   <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, fontStyle: "italic" }}>
                     "{detail.reasoning.split(".")[0]}..."
                   </div>
                </div>
             )}
          </div>
        )}
      </div>
      <TutorialModal />
    </div>
  );
}
