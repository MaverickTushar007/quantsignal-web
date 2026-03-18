"use client";
import { useEffect, useState } from "react";
import { fetchAllSignals, fetchMarketMood, fetchSignal } from "../lib/api";
import TradingChart from "../components/TradingChart";
import TutorialModal from "../components/TutorialModal";

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

  useEffect(() => {
    setLoading(true);
    const type = filter === "ALL" ? undefined : filter === "COMMOD" ? "COMMODITY" : filter;
    fetchAllSignals(type).then(s => { setSignals(s); if (s.length > 0 && !selected) selectAsset(s[0]); }).finally(() => setLoading(false));
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

  const s = style;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#060608" }}>

      {/* Top bar */}
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
            <span style={{ color: "rgba(255,255,255,0.3)" }}>yfinance · Groq · RSS</span>
          </>}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left panel */}
        <div style={{ width: 280, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {/* Search */}
          <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="SEARCH..."
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "6px 10px", color: "#e2e8f0", fontSize: 11, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          {/* Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {TYPE_FILTERS.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                style={{ background: filter === t ? "rgba(0,255,136,0.15)" : "transparent", border: `1px solid ${filter === t ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 3, padding: "3px 8px", color: filter === t ? "#00ff88" : "rgba(255,255,255,0.4)", fontSize: 10, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em" }}>
                {t}
              </button>
            ))}
          </div>
          {/* Asset list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              [...Array(15)].map((_, i) => (
                <div key={i} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.03)", opacity: 0.3, background: "rgba(255,255,255,0.02)", margin: "2px 8px", borderRadius: 4 }}>
                  <div style={{ height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 6 }} />
                  <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 2, width: "60%" }} />
                </div>
              ))
            ) : filtered.map(sig => (
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

        {/* Right detail panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {!selected ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
              SELECT AN ASSET
            </div>
          ) : (
            <>
              {/* Asset header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{selected.icon}</div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{selected.display}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{selected.name} · {selected.type}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>${selected.current_price?.toLocaleString()}</div>
                  <div style={badge(selected.direction)}>{selected.direction} · {(selected.probability * 100).toFixed(0)}%</div>
                </div>
              </div>

              {/* TradingView Chart */}
              <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden", marginBottom: 16, height: 420 }}>
                <TradingChart symbol={selected.symbol} />
              </div>

              {detailLoading ? (
                <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, textAlign: "center", padding: 40 }}>LOADING SIGNAL DATA...</div>
              ) : detail && <>

                {/* Price levels */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {[
                    { label: "ENTRY", value: `$${detail.current_price?.toLocaleString()}`, sub: "Current price", color: "#e2e8f0" },
                    { label: "TAKE PROFIT", value: `$${detail.take_profit?.toLocaleString()}`, sub: `+${(((detail.take_profit - detail.current_price) / detail.current_price) * 100).toFixed(1)}%`, color: "#00ff88" },
                    { label: "STOP LOSS", value: `$${detail.stop_loss?.toLocaleString()}`, sub: `${(((detail.stop_loss - detail.current_price) / detail.current_price) * 100).toFixed(1)}%`, color: "#ff4466" },
                  ].map(m => (
                    <div key={m.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "14px 16px" }}>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 8 }}>{m.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{m.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Quant metrics */}
                <div style={{ marginBottom: 4, fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>QUANT METRICS</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
                  {[
                    { label: "RISK / REWARD", value: `1 : ${detail.risk_reward}`, sub: "per unit risked" },
                    { label: "KELLY CRITERION", value: `${detail.kelly_size}%`, sub: "suggested size", color: "#00ff88" },
                    { label: "EXPECTED VALUE", value: `+$${detail.expected_value?.toFixed(0)}`, sub: "per unit", color: "#00ff88" },
                    { label: "MODEL AGREEMENT", value: `${(detail.model_agreement * 100).toFixed(0)}%`, sub: "XGB vs LGB" },
                  ].map(m => (
                    <div key={m.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "14px 16px" }}>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 8 }}>{m.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: m.color || "#e2e8f0" }}>{m.value}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{m.sub}</div>
                    </div>
                  ))}
                </div>

                {/* ML Model + Confluence side by side */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {/* ML */}
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: 16 }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 12 }}>ML MODEL · XGBOOST + LIGHTGBM ENSEMBLE</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>DIRECTION PROBABILITY
                      <span style={{ float: "right", color: detail.confidence === "HIGH" ? "#00ff88" : detail.confidence === "MEDIUM" ? "#ffd700" : "#ff4466" }}>
                        {detail.confidence} · {(detail.model_agreement * 100).toFixed(0)}% agree
                      </span>
                    </div>
                    <div style={{ height: 28, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", display: "flex", marginBottom: 6 }}>
                      <div style={{ width: `${detail.probability * 100}%`, background: "linear-gradient(90deg, #00ff88, #00cc66)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#000" }}>
                        BUY {(detail.probability * 100).toFixed(0)}%
                      </div>
                      <div style={{ flex: 1, background: "linear-gradient(90deg, #cc2244, #ff4466)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                        SELL {((1 - detail.probability) * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>ML OVERRIDES TO {detail.direction} ({(detail.probability * 100).toFixed(0)}%, {detail.confidence})</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 8 }}>TOP PREDICTIVE FEATURES</div>
                    {detail.top_features?.map((f: string, i: number) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", width: 10 }}>{i + 1}</span>
                        <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                          <div style={{ height: "100%", width: `${90 - i * 20}%`, background: i === 0 ? "#00aaff" : i === 1 ? "#aa44ff" : "#ffaa00", borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", width: 80, textAlign: "right" }}>{f}</span>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", width: 30, textAlign: "right" }}>{90 - i * 20}%</span>
                      </div>
                    ))}
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>2yr OHLCV · 5-day horizon · 21 features</div>
                  </div>

                  {/* Confluence */}
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>TECHNICAL CONFLUENCES</div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#00ff88", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)", padding: "2px 8px", borderRadius: 4 }}>{detail.confluence_score?.toUpperCase()}</span>
                    </div>
                    {detail.confluence?.map((c: any) => (
                      <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: 11 }}>
                        <span style={{ color: "rgba(255,255,255,0.4)", width: 110 }}>{c.name}</span>
                        <span style={{ color: "rgba(255,255,255,0.25)", flex: 1, textAlign: "center", fontSize: 10 }}>{c.value}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3, background: c.signal === "BULLISH" ? "rgba(0,255,136,0.1)" : "rgba(255,68,102,0.1)", color: c.signal === "BULLISH" ? "#00ff88" : "#ff4466", border: `1px solid ${c.signal === "BULLISH" ? "rgba(0,255,136,0.2)" : "rgba(255,68,102,0.2)"}` }}>
                          {c.signal === "BULLISH" ? "▲ BULL" : "▼ BEAR"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Reasoning */}
                {detail.reasoning && (
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 8 }}>AI REASONING</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, borderLeft: "2px solid rgba(0,255,136,0.3)", paddingLeft: 12 }}>{detail.reasoning}</div>
                  </div>
                )}

                {/* News */}
                {detail.news?.length > 0 && (
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: 16 }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 12 }}>NEWS & SENTIMENT</div>
                    {detail.news.map((n: any, i: number) => (
                      <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < detail.news.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, height: "fit-content", background: n.sentiment === "BULLISH" ? "rgba(0,255,136,0.15)" : n.sentiment === "BEARISH" ? "rgba(255,68,102,0.15)" : "rgba(255,255,255,0.08)", color: n.sentiment === "BULLISH" ? "#00ff88" : n.sentiment === "BEARISH" ? "#ff4466" : "rgba(255,255,255,0.4)", border: `1px solid ${n.sentiment === "BULLISH" ? "rgba(0,255,136,0.2)" : n.sentiment === "BEARISH" ? "rgba(255,68,102,0.2)" : "rgba(255,255,255,0.08)"}` }}>
                          {n.sentiment === "BULLISH" ? "BULL" : n.sentiment === "BEARISH" ? "BEAR" : "NEUT"}
                        </span>
                        <div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 3, lineHeight: 1.5 }}>{n.title}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{n.source}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.15)", marginTop: 16, paddingBottom: 20 }}>
                  EDUCATIONAL SIGNALS ONLY — NOT FINANCIAL ADVICE
                </div>
              </>}
            </>
          )}
        </div>
        <TutorialModal />
    </div>
    </div>

  );
}

const style: any = {};

