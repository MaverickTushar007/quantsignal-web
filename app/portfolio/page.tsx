"use client";
import { useEffect, useState } from "react";

const API_BASE = "https://web-production-1a093.up.railway.app/api/v1";

const TYPE_COLORS: Record<string, string> = {
  CRYPTO: "#f7931a", STOCK: "#00aaff", INDEX: "#aa88ff",
  COMMODITY: "#ffd700", ETF: "#00ff88"
};

export default function PortfolioPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<{symbol:string,display:string,type:string,amount:string,direction:string,probability:number,current_price:number}[]>([]);
  const [totalCapital, setTotalCapital] = useState("10000");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"optimize"|"stress"|"health">("optimize");

  useEffect(() => {
    fetch(`${API_BASE}/signals`).then(r=>r.json()).then(setSignals).catch(()=>{});
  }, []);

  const addAsset = (sig: any) => {
    if (portfolio.find(p => p.symbol === sig.symbol)) return;
    if (portfolio.length >= 10) return;
    setPortfolio([...portfolio, { ...sig, amount: "1000" }]);
    setSearch("");
    setResult(null);
  };

  const removeAsset = (symbol: string) => {
    setPortfolio(portfolio.filter(p => p.symbol !== symbol));
    setResult(null);
  };

  const updateAmount = (symbol: string, amount: string) => {
    setPortfolio(portfolio.map(p => p.symbol === symbol ? {...p, amount} : p));
    setResult(null);
  };

  const runAnalysis = async () => {
    if (portfolio.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/portfolio/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assets: portfolio.map(p => ({ symbol: p.symbol, amount: parseFloat(p.amount) || 0 })),
          total_capital: parseFloat(totalCapital) || 10000,
        }),
      });
      const data = await res.json();
      setResult(data);
      setActiveTab("optimize");
    } catch {}
    finally { setLoading(false); }
  };

  const dirColor = (d: string) => d === "BUY" ? "#00ff88" : d === "SELL" ? "#ff4466" : "#ffd700";
  const filtered = signals.filter(s =>
    !portfolio.find(p => p.symbol === s.symbol) &&
    (s.symbol.toLowerCase().includes(search.toLowerCase()) ||
     s.display?.toLowerCase().includes(search.toLowerCase()))
  ).slice(0, 8);

  const totalInvested = portfolio.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#080a0f", color: "#e2e8f0", fontFamily: "'IBM Plex Mono', monospace" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/dashboard" style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, textDecoration: "none" }}>← Back</a>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#00ff88", letterSpacing: "0.08em" }}>📊 PORTFOLIO LAB</span>
        </div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Build · Optimize · Stress Test</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", minHeight: "calc(100vh - 49px)", gap: 0 }}>
        {/* LEFT PANEL — Builder */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)", padding: 20, overflowY: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: 14 }}>BUILD YOUR PORTFOLIO</div>

          {/* Total Capital */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>TOTAL CAPITAL</div>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>$</span>
              <input type="number" value={totalCapital} onChange={e => setTotalCapital(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 12px 10px 26px", fontSize: 14, fontWeight: 700, color: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>
          </div>

          {/* Search */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>ADD ASSETS ({portfolio.length}/10)</div>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search BTC, ETH, NASDAQ..."
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px", fontSize: 11, color: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>

          {/* Search results */}
          {search && filtered.length > 0 && (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, marginBottom: 14, overflow: "hidden" }}>
              {filtered.map(sig => (
                <div key={sig.symbol} onClick={() => addAsset(sig)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,255,136,0.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{sig.display}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{sig.type} · ${sig.current_price?.toLocaleString()}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: dirColor(sig.direction), background: `${dirColor(sig.direction)}15`, padding: "2px 7px", borderRadius: 4 }}>{sig.direction}</span>
                </div>
              ))}
            </div>
          )}

          {/* Portfolio assets */}
          {portfolio.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.2)", fontSize: 11 }}>
              Search and add assets above<br/>
              <span style={{ fontSize: 9, marginTop: 4, display: "block" }}>Minimum 2 assets required</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {portfolio.map(asset => (
                <div key={asset.symbol} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: TYPE_COLORS[asset.type] || "#fff" }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{asset.display || asset.symbol}</span>
                      <span style={{ fontSize: 9, color: dirColor(asset.direction) }}>{asset.direction}</span>
                    </div>
                    <button onClick={() => removeAsset(asset.symbol)}
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 14, padding: 2 }}>×</button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>$</span>
                    <input type="number" value={asset.amount}
                      onChange={e => updateAmount(asset.symbol, e.target.value)}
                      style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 10px", fontSize: 13, fontWeight: 700, color: "#fff", outline: "none", fontFamily: "inherit" }} />
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
                      {totalInvested > 0 ? Math.round((parseFloat(asset.amount)||0)/totalInvested*100) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {portfolio.length > 0 && (
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px", marginBottom: 16, display: "flex", justifyContent: "space-between", fontSize: 10 }}>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>INVESTED</span>
              <span style={{ fontWeight: 700, color: "#fff" }}>${totalInvested.toLocaleString()}</span>
            </div>
          )}

          <button onClick={runAnalysis} disabled={portfolio.length < 2 || loading}
            style={{ width: "100%", background: portfolio.length >= 2 ? "linear-gradient(135deg, #00ff88, #00cc66)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, padding: "13px", fontSize: 12, fontWeight: 700, color: portfolio.length >= 2 ? "#000" : "rgba(255,255,255,0.3)", cursor: portfolio.length >= 2 ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.2s" }}>
            {loading ? "⏳ Analyzing..." : "📊 Analyze Portfolio"}
          </button>
        </div>

        {/* RIGHT PANEL — Results */}
        <div style={{ padding: 24, overflowY: "auto" }}>
          {!result ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, color: "rgba(255,255,255,0.2)" }}>
              <div style={{ fontSize: 48 }}>📊</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>PORTFOLIO LAB</div>
              <div style={{ fontSize: 11, textAlign: "center", maxWidth: 320, lineHeight: 1.7 }}>
                Add at least 2 assets on the left, set your amounts, and click Analyze Portfolio to get your optimization report.
              </div>
            </div>
          ) : (
            <div>
              {/* Health Score */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "HEALTH SCORE", value: `${result.health_score}/100`, color: result.health_color, sub: result.health_label },
                  { label: "SHARPE RATIO", value: result.current_metrics.sharpe_ratio.toFixed(2), color: "#00aaff", sub: "current" },
                  { label: "OPTIMIZED", value: result.optimal_metrics.sharpe_ratio.toFixed(2), color: "#00ff88", sub: "sharpe ratio" },
                  { label: "EXP. RETURN", value: `${result.optimal_metrics.expected_return}%`, color: "#ffd700", sub: "annual" },
                ].map(m => (
                  <div key={m.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginBottom: 6, letterSpacing: "0.1em" }}>{m.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: m.color }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* AI Summary */}
              {result.ai_summary && (
                <div style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.12)", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                  <div style={{ fontSize: 9, color: "#00ff88", marginBottom: 8, letterSpacing: "0.08em" }}>🤖 AI PORTFOLIO ANALYSIS</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>{result.ai_summary}</div>
                </div>
              )}

              {/* Tabs */}
              <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 0 }}>
                {[
                  { id: "optimize", label: "📈 OPTIMIZE" },
                  { id: "stress", label: "⚡ STRESS TEST" },
                  { id: "health", label: "🛡️ HEALTH" },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                    style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? "#00ff88" : "transparent"}`, color: activeTab === tab.id ? "#00ff88" : "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em", marginBottom: -1 }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* OPTIMIZE TAB */}
              {activeTab === "optimize" && (
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>RECOMMENDED ALLOCATION vs CURRENT</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {result.optimal_allocation.map((a: any) => {
                      const change = a.change;
                      const changeColor = change > 0 ? "#00ff88" : change < 0 ? "#ff4466" : "rgba(255,255,255,0.4)";
                      return (
                        <div key={a.symbol} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: TYPE_COLORS[a.type] || "#fff" }} />
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{a.display || a.symbol}</span>
                              <span style={{ fontSize: 9, color: dirColor(a.direction), background: `${dirColor(a.direction)}15`, padding: "1px 6px", borderRadius: 3 }}>{a.direction}</span>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: changeColor }}>
                              {change > 0 ? "▲" : change < 0 ? "▼" : "—"} ${Math.abs(change).toLocaleString()}
                            </span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "8px 10px" }}>
                              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>CURRENT</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>${a.current_amount.toLocaleString()}</div>
                              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{a.current_weight}% of portfolio</div>
                            </div>
                            <div style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.1)", borderRadius: 6, padding: "8px 10px" }}>
                              <div style={{ fontSize: 8, color: "#00ff88", marginBottom: 3 }}>RECOMMENDED</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "#00ff88" }}>${a.optimal_amount.toLocaleString()}</div>
                              <div style={{ fontSize: 9, color: "rgba(0,255,136,0.5)" }}>{a.optimal_weight}% of portfolio</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STRESS TEST TAB */}
              {activeTab === "stress" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>IF THESE MARKET EVENTS HAPPENED TOMORROW</div>
                  {Object.values(result.stress_tests).map((s: any) => {
                    const severity = s.loss_pct < -40 ? "#ff4466" : s.loss_pct < -20 ? "#ffd700" : "#00ff88";
                    return (
                      <div key={s.label} style={{ background: `${severity}08`, border: `1px solid ${severity}20`, borderRadius: 12, padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{s.label}</div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{s.description}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 20, fontWeight: 800, color: severity }}>-${Math.abs(s.total_loss).toLocaleString()}</div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{s.loss_pct}% drawdown</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <span style={{ color: "rgba(255,255,255,0.4)" }}>Portfolio would be worth</span>
                          <span style={{ fontWeight: 700, color: "#fff" }}>${s.portfolio_value.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* HEALTH TAB */}
              {activeTab === "health" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    {[
                      { label: "DIVERSIFICATION", value: result.diversification_score, desc: "How spread across uncorrelated assets" },
                      { label: "SIGNAL ALIGNMENT", value: result.signal_alignment, desc: "% of portfolio with BUY signals right now" },
                    ].map(m => {
                      const color = m.value >= 70 ? "#00ff88" : m.value >= 40 ? "#ffd700" : "#ff4466";
                      return (
                        <div key={m.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px" }}>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 8, letterSpacing: "0.08em" }}>{m.label}</div>
                          <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>{Math.round(m.value)}</div>
                          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
                            <div style={{ width: `${m.value}%`, height: "100%", background: color, borderRadius: 2 }} />
                          </div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{m.desc}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Asset breakdown */}
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>ASSET BREAKDOWN</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {result.assets.map((a: any) => (
                      <div key={a.symbol} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: TYPE_COLORS[a.type] || "#fff", flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", flex: 1 }}>{a.display || a.symbol}</span>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{a.type}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: dirColor(a.direction) }}>{a.direction} {(a.probability*100).toFixed(0)}%</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>${a.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
