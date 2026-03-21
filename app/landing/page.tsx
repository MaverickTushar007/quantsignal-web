"use client";
import { useState, useEffect } from "react";

const TICKERS = ["BTC/USD", "ETH/USD", "SOL/USD", "NASDAQ", "GOLD", "AAPL", "RELIANCE", "TCS", "NIFTY50", "XRP/USD", "EUR/USD", "HDFC BANK"];
const DIRECTIONS = ["BUY", "BUY", "SELL", "BUY", "HOLD", "BUY", "BUY", "BUY", "BUY", "SELL", "HOLD", "BUY"];
const PROBS = ["87%", "71%", "63%", "78%", "52%", "81%", "73%", "82%", "69%", "61%", "55%", "70%"];

export default function Landing() {
  const [tick, setTick] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setInterval(() => setTick(p => p + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const dirColor = (d: string) => d === "BUY" ? "#00ff88" : d === "SELL" ? "#ff4466" : "#ffd700";
  const dirBg = (d: string) => d === "BUY" ? "rgba(0,255,136,0.08)" : d === "SELL" ? "rgba(255,68,102,0.08)" : "rgba(255,215,0,0.08)";

  return (
    <div style={{
      minHeight: "100vh", background: "#060810",
      color: "#e2e8f0", fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .ticker-row { animation: scrollLeft 30s linear infinite; display: flex; gap: 32px; white-space: nowrap; }
        @keyframes scrollLeft { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .glow-green { box-shadow: 0 0 40px rgba(0,255,136,0.15); }
        .card-hover { transition: border-color 0.2s, transform 0.2s; }
        .card-hover:hover { border-color: rgba(0,255,136,0.3) !important; transform: translateY(-2px); }
        .btn-primary { transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,255,136,0.3); }
        .grid-bg {
          background-image: linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-card { display: none !important; }
          .hero-title { font-size: 36px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .proof-grid { grid-template-columns: 1fr 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .footer-inner { flex-direction: column !important; gap: 12px !important; text-align: center; }
          .nav-links { display: none !important; }
          .nav-cta { font-size: 10px !important; padding: 6px 10px !important; }
          .hero-stats { gap: 16px !important; }
          .section-pad { padding: 60px 20px !important; }
          .hero-section { padding: 100px 20px 60px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(6,8,16,0.85)", backdropFilter: "blur(20px)",
        padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #00ff88, #00cc66)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#000" }}>Q</div>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.05em", color: "#fff" }}>QUANT<span style={{ color: "#00ff88" }}>SIGNAL</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="#features" className="nav-links" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.08em" }}>FEATURES</a>
          <a href="#proof" className="nav-links" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.08em" }}>PROOF</a>
          <a href="#pricing" className="nav-links" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.08em" }}>PRICING</a>
          <a href="/dashboard" style={{ fontSize: 11, fontWeight: 700, color: "#000", background: "#00ff88", borderRadius: 6, padding: "7px 16px", textDecoration: "none", letterSpacing: "0.05em" }}>LAUNCH APP →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="grid-bg hero-section" style={{ paddingTop: 120, paddingBottom: 80, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,255,136,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="hero-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 420px", gap: 60, alignItems: "center" }}>
          {/* LEFT */}
          <div className={`fade-in ${visible ? "visible" : ""}`}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 100, padding: "5px 14px", marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", animation: "pulse-dot 2s infinite" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#00ff88", letterSpacing: "0.1em" }}>118 ASSETS · 67% WIN RATE</span>
            </div>

            <h1 className="hero-title" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 58, fontWeight: 800, lineHeight: 1.05, marginBottom: 20, letterSpacing: "-0.02em" }}>
              The trading signal
              <br />
              that{" "}
              <span style={{ background: "linear-gradient(135deg, #00ff88, #00cc66)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                shows its work
              </span>
            </h1>

            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 36, maxWidth: 480 }}>
              Every signal backed by an ML ensemble, 9-factor confluence score, walk-forward backtest, and plain-English AI explanation. Covers crypto, US stocks, Indian NSE stocks, forex and commodities. Not a black box. Never.
            </p>

            <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
              <a href="/dashboard" className="btn-primary" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #00ff88, #00cc66)",
                color: "#000", fontWeight: 700, fontSize: 13,
                padding: "14px 28px", borderRadius: 10, textDecoration: "none",
                letterSpacing: "0.05em",
              }}>
                VIEW LIVE SIGNALS →
              </a>
              <a href="#proof" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 13,
                padding: "14px 28px", borderRadius: 10, textDecoration: "none",
              }}>
                SEE THE PROOF
              </a>
            </div>

            <div className="hero-stats" style={{ display: "flex", gap: 32 }}>
              {[["118", "Live Assets"], ["9", "Confluence Factors"], ["2yr", "Training Window"]].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 800, color: "#00ff88" }}>{val}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Live signal card */}
          <div className={`hero-card fade-in ${visible ? "visible" : ""}`} style={{ transitionDelay: "0.2s" }}>
            <div className="glow-green" style={{
              background: "rgba(10,12,20,0.9)", border: "1px solid rgba(0,255,136,0.2)",
              borderRadius: 16, padding: 20, animation: "float 6s ease-in-out infinite",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>LIVE SIGNALS</span>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00ff88", animation: "pulse-dot 1.5s infinite" }} />
                  <span style={{ fontSize: 9, color: "#00ff88" }}>LIVE</span>
                </div>
              </div>

              {TICKERS.slice(0, 6).map((ticker, i) => (
                <div key={ticker} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 10px", borderRadius: 8, marginBottom: 4,
                  background: i === (tick % 6) ? "rgba(0,255,136,0.05)" : "transparent",
                  border: `1px solid ${i === (tick % 6) ? "rgba(0,255,136,0.15)" : "transparent"}`,
                  transition: "all 0.4s ease",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: i === (tick % 6) ? "#fff" : "rgba(255,255,255,0.5)" }}>{ticker}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{PROBS[i]}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: dirColor(DIRECTIONS[i]),
                      background: dirBg(DIRECTIONS[i]), padding: "2px 8px", borderRadius: 4,
                    }}>{DIRECTIONS[i]}</span>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.12)", borderRadius: 8 }}>
                <div style={{ fontSize: 9, color: "#00ff88", marginBottom: 4, letterSpacing: "0.08em" }}>🤖 AI REASONING</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  RSI divergence + MACD crossover confirms bullish momentum. Kelly sizing: 5.9% of capital...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER TAPE */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "12px 0", overflow: "hidden", background: "rgba(0,255,136,0.02)" }}>
        <div className="ticker-row">
          {[...TICKERS, ...TICKERS, ...TICKERS, ...TICKERS].map((t, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 700, color: dirColor(DIRECTIONS[i % 8]), letterSpacing: "0.1em" }}>
              {t} {DIRECTIONS[i % 8]} {PROBS[i % 8]}
              <span style={{ color: "rgba(255,255,255,0.1)", marginLeft: 32 }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="section-pad" style={{ padding: "100px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#00ff88", letterSpacing: "0.15em", marginBottom: 12 }}>WHAT MAKES IT DIFFERENT</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em" }}>
            Not just signals.<br />
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Signals with receipts.</span>
          </h2>
        </div>

        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { icon: "🧠", title: "ML Ensemble", desc: "XGBoost + LightGBM trained on 180 days of OHLCV data. Walk-forward validated. No curve-fitting.", color: "#00ff88" },
            { icon: "📊", title: "9-Factor Confluence", desc: "RSI, MACD, Bollinger, Stochastic, Volume, SMA Cross, 52W Position, Momentum — all scored together.", color: "#00aaff" },
            { icon: "⏪", title: "Historical Replay", desc: "Pick any date in the last 175 days. See exactly what signal the model would have fired — and if it was right.", color: "#ffd700" },
            { icon: "🛡️", title: "Trade Guardian", desc: "Enter your position size and capital. Get your worst-case loss, recommended size, and AI verdict instantly.", color: "#ff6644" },
            { icon: "⚡", title: "Liquidity Levels", desc: "Live OI, funding rates, L/S ratio, and liquidation clusters from OKX. Updated every 30 seconds.", color: "#aa88ff" },
            { icon: "📈", title: "Portfolio Lab", desc: "Black-Litterman optimization using your ML signal probabilities. Stress test against 3 crash scenarios.", color: "#00ff88" },
          ].map((f) => (
            <div key={f.title} className="card-hover" style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: "24px",
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROOF */}
      <section id="proof" className="section-pad" style={{ background: "rgba(0,255,136,0.02)", borderTop: "1px solid rgba(0,255,136,0.08)", borderBottom: "1px solid rgba(0,255,136,0.08)", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#00ff88", letterSpacing: "0.15em", marginBottom: 12 }}>THE PROOF</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em" }}>
              Every claim is verifiable.
            </h2>
          </div>

          <div className="proof-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { val: "67%", label: "Avg Win Rate", sub: "across 11 assets tested" },
              { val: "2.57", label: "Sharpe Ratio", sub: "stocks + forex + crypto" },
              { val: "2:1", label: "Risk/Reward", sub: "ATR-based targets" },
              { val: "118", label: "Live Assets", sub: "crypto, US & Indian stocks, forex" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center", padding: "32px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 44, fontWeight: 800, color: "#00ff88", marginBottom: 6 }}>{s.val}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section-pad" style={{ padding: "100px 32px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#00ff88", letterSpacing: "0.15em", marginBottom: 12 }}>PRICING</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em" }}>Simple. No tricks.</h2>
        </div>

        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Free */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: 16 }}>FREE</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 800, color: "#fff", marginBottom: 4 }}>₹0</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 28 }}>forever</div>
            {["118 live signals — crypto, US stocks, Indian stocks, forex", "Direction + confidence", "News feed", "Economic calendar", "Perseus AI chat"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "rgba(255,255,255,0.4)" }}>✓</div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{f}</span>
              </div>
            ))}
            <a href="/dashboard" style={{ display: "block", textAlign: "center", marginTop: 28, padding: "12px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
              START FREE
            </a>
          </div>

          {/* Pro */}
          <div className="glow-green" style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.25)", borderRadius: 16, padding: 32, position: "relative" }}>
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#00ff88", color: "#000", fontSize: 9, fontWeight: 800, padding: "4px 14px", borderRadius: 100, letterSpacing: "0.1em" }}>MOST POPULAR</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#00ff88", letterSpacing: "0.1em", marginBottom: 16 }}>PRO</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 800, color: "#fff", marginBottom: 4 }}>₹999</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 28 }}>per month · 7-day free trial</div>
            {["Everything in Free", "Historical Replay + AI analysis", "Trade Guardian risk check", "Liquidity Levels (live OI)", "Portfolio Lab optimizer", "Signal reasoning + Kelly sizing"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(0,255,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#00ff88" }}>✓</div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{f}</span>
              </div>
            ))}
            <a href="/dashboard" style={{ display: "block", textAlign: "center", marginTop: 28, padding: "12px", background: "linear-gradient(135deg, #00ff88, #00cc66)", borderRadius: 10, fontSize: 12, fontWeight: 700, color: "#000", textDecoration: "none" }}>
              START 7-DAY TRIAL →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 32px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 44, fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
          Ready to trade with<br />
          <span style={{ color: "#00ff88" }}>actual edge?</span>
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>No credit card required. 86 live signals. Start in 10 seconds.</p>
        <a href="/dashboard" className="btn-primary" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "linear-gradient(135deg, #00ff88, #00cc66)",
          color: "#000", fontWeight: 700, fontSize: 14,
          padding: "16px 36px", borderRadius: 12, textDecoration: "none",
          letterSpacing: "0.05em",
        }}>
          LAUNCH QUANTSIGNAL FREE →
        </a>
        <div style={{ marginTop: 16, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          quantsignal-web.vercel.app · Built with XGBoost + LightGBM + Groq
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 20px" }}><div className="footer-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, background: "linear-gradient(135deg, #00ff88, #00cc66)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#000" }}>Q</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>QUANTSIGNAL</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="/dashboard" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>Dashboard</a>
          <a href="/guardian" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>Guardian</a>
          <a href="/portfolio" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>Portfolio</a>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>© 2026 QuantSignal</div>
      </div></footer>
    </div>
  );
}
