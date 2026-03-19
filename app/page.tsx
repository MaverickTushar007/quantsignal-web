"use client";
import { useState } from "react";
import { TrendingUp, Shield, Zap, BarChart2, ChevronRight, Check, Brain, Activity } from "lucide-react";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#060608", color: "#e2e8f0", fontFamily: "'IBM Plex Mono', monospace", overflowX: "hidden" }}>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,6,8,0.9)", backdropFilter: "blur(12px)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #00ff88, #00aa55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#000" }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "0.05em", color: "#fff" }}>QUANTSIGNAL</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.05em" }}>DASHBOARD</a>
          <a href="#pricing" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.05em" }}>PRICING</a>
          <a href="/auth" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.05em" }}>SIGN IN</a>
          <a href="/auth" style={{ fontSize: 11, fontWeight: 700, background: "#00ff88", color: "#000", borderRadius: 6, padding: "6px 14px", textDecoration: "none", letterSpacing: "0.05em" }}>TRY FREE</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 80, padding: "120px 24px 80px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 999, padding: "6px 16px", fontSize: 11, color: "#00ff88", marginBottom: 32, letterSpacing: "0.08em" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", display: "inline-block" }} />
            LIVE SIGNALS ACROSS 86 ASSETS
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: "#fff", letterSpacing: "-0.02em" }}>
            The only trading signal
            <br />
            <span style={{ color: "#00ff88" }}>that shows its proof</span>
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "rgba(255,255,255,0.45)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.8 }}>
            Every other app gives you a red or green button. We give you an ML ensemble, a 9-factor confluence scorecard, walk-forward backtested results, and an AI explanation of exactly why.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "#00ff88", color: "#000", borderRadius: 10, fontWeight: 800, fontSize: 13, textDecoration: "none", letterSpacing: "0.05em" }}>
              VIEW LIVE SIGNALS <ChevronRight size={16} />
            </a>
            <a href="#proof" style={{ display: "inline-flex", alignItems: "center", padding: "14px 28px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", letterSpacing: "0.05em" }}>
              SEE THE BACKTEST
            </a>
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ border: "1px solid rgba(0,255,136,0.15)", borderRadius: 12, overflow: "hidden", background: "#0a0a0c", boxShadow: "0 0 80px rgba(0,255,136,0.05)" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff4466" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffd700" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00ff88" }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 8, letterSpacing: "0.1em" }}>quantsignal-web.vercel.app/dashboard</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 240px", minHeight: 340 }}>
            {/* Left panel mock */}
            <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)", padding: "12px 0" }}>
              {[
                { sym: "BTC/USD", dir: "HOLD", pct: "53%", price: "$72,537" },
                { sym: "ETH/USD", dir: "BUY", pct: "63%", price: "$2,239" },
                { sym: "SOL/USD", dir: "HOLD", pct: "55%", price: "$90.60" },
                { sym: "AAPL", dir: "BUY", pct: "71%", price: "$198.52" },
                { sym: "NVDA", dir: "BUY", pct: "68%", price: "$875.40" },
                { sym: "XRP/USD", dir: "SELL", pct: "44%", price: "$1.46" },
              ].map(s => (
                <div key={s.sym} style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.03)", borderLeft: s.sym === "BTC/USD" ? "2px solid #00ff88" : "2px solid transparent", background: s.sym === "BTC/USD" ? "rgba(0,255,136,0.04)" : "transparent" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: s.sym === "BTC/USD" ? "#00ff88" : "#e2e8f0" }}>{s.sym}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: s.dir === "BUY" ? "#00ff88" : s.dir === "SELL" ? "#ff4466" : "#ffd700", background: s.dir === "BUY" ? "rgba(0,255,136,0.1)" : s.dir === "SELL" ? "rgba(255,68,102,0.1)" : "rgba(255,215,0,0.1)", padding: "1px 5px", borderRadius: 3 }}>{s.dir}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
                    <span>{s.price}</span>
                    <span style={{ color: s.dir === "BUY" ? "#00ff88" : s.dir === "SELL" ? "#ff4466" : "#ffd700" }}>{s.pct}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Center mock */}
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 10 }}>REALTIME PRICE ACTION</div>
              <div style={{ height: 180, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 100, padding: "0 20px" }}>
                  {[40,55,45,60,50,70,55,80,65,75,60,85,70,90,75,85,80,95,88,100,85,92,78,88,82,95,88,100].map((h, i) => (
                    <div key={i} style={{ width: 6, height: `${h}%`, background: i > 20 ? "rgba(0,255,136,0.6)" : "rgba(255,255,255,0.1)", borderRadius: 1 }} />
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[{ l: "KELLY SIZE", v: "5%", c: "#00aaff" }, { l: "CONFLUENCE", v: "4/9 bullish", c: "#00ff88" }, { l: "RISK/REWARD", v: "2:1", c: "#ffd700" }].map(b => (
                  <div key={b.l} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "10px 12px" }}>
                    <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", marginBottom: 4, letterSpacing: "0.1em" }}>{b.l}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: b.c }}>{b.v}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right sidebar mock */}
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", padding: 14 }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 10, letterSpacing: "0.1em" }}>9-FACTOR CONFLUENCE</div>
              {[
                { n: "RSI-14", b: true }, { n: "MACD", b: true }, { n: "Bollinger", b: false },
                { n: "Stochastic %K", b: false }, { n: "Volume", b: false }, { n: "SMA Cross", b: false },
                { n: "vs SMA20", b: true }, { n: "52W Position", b: false }, { n: "5D Momentum", b: true },
              ].map(c => (
                <div key={c.n} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: c.b ? "#00ff88" : "#ff4466", flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 8, color: "rgba(255,255,255,0.4)" }}>{c.n}</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: c.b ? "#00ff88" : "#ff4466" }}>{c.b ? "BULL" : "BEAR"}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, background: "rgba(0,170,255,0.06)", border: "1px solid rgba(0,170,255,0.15)", borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 7, color: "#00aaff", fontWeight: 700, marginBottom: 6, letterSpacing: "0.1em" }}>QUANT RAG REASONING</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, fontStyle: "italic" }}>"Signal aligns with time series momentum theory — mean reversion indicators suggest..."</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
          {[
            { value: "86", label: "Assets Covered" },
            { value: "67.8%", label: "Backtest Win Rate" },
            { value: "2.87", label: "Sharpe Ratio" },
            { value: "21", label: "ML Features" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#00ff88" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: "0.08em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Proof section */}
      <section id="proof" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, marginBottom: 12, color: "#fff" }}>We don't ask you to trust us</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, letterSpacing: "0.05em" }}>WE SHOW YOU THE BACKTEST. YOU DECIDE.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { icon: <BarChart2 size={20} />, title: "Walk-Forward Validated", desc: "6-month walk-forward validation with no lookahead bias. Every signal is tested against data the model never saw during training." },
              { icon: <Brain size={20} />, title: "XGBoost + LightGBM", desc: "Two-model ensemble trained on 2 years of OHLCV data per asset. Probability calibrated with isotonic regression." },
              { icon: <Shield size={20} />, title: "ATR-Based Risk Levels", desc: "Take Profit and Stop Loss set by Average True Range — volatility-adjusted for each asset, not arbitrary percentages." },
            ].map(f => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 24 }}>
                <div style={{ color: "#00ff88", marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: "#fff" }}>{f.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 1.8 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, marginBottom: 12, color: "#fff" }}>Everything in one place</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, letterSpacing: "0.05em" }}>NO OTHER RETAIL TOOL COMBINES ALL FIVE OF THESE.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
            {[
              { title: "ML Signal + Probability", desc: "BUY/SELL/HOLD with an actual probability score, not just a direction." },
              { title: "9-Factor Confluence", desc: "RSI, MACD, Bollinger, Stochastic, Volume, SMA Cross, 52W Position, Momentum — all in one scorecard." },
              { title: "Kelly Criterion Sizing", desc: "Exact position size based on your edge and risk/reward ratio. Not a fixed 1% or 2%." },
              { title: "LLM Reasoning", desc: "Groq-powered plain-English explanation of every signal. Know why, not just what." },
              { title: "Live News Sentiment", desc: "7 RSS feeds scored and blended into the ML signal in real time." },
              { title: "Backtested Proof", desc: "Every signal strategy auditable with walk-forward validation metrics." },
            ].map(f => (
              <div key={f.title} style={{ display: "flex", gap: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 18 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <Check size={9} color="#00ff88" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6, color: "#fff", letterSpacing: "0.03em" }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, marginBottom: 12, color: "#fff" }}>Simple pricing</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, letterSpacing: "0.05em" }}>START FREE. UPGRADE WHEN YOU'RE READY.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {[
              {
                name: "FREE", price: "$0", period: "forever",
                features: ["5 signals per day", "BUY/SELL/HOLD direction", "Current price + Kelly size", "Basic confluence score"],
                cta: "GET STARTED", href: "/dashboard", highlight: false,
              },
              {
                name: "PRO", price: "$49", period: "per month",
                features: ["Unlimited signals — all 86 assets", "Full 9-factor confluence", "LLM reasoning for every signal", "Walk-forward backtest access", "Live news sentiment", "Priority support"],
                cta: "START PRO", href: "/auth", highlight: true,
              },
            ].map(p => (
              <div key={p.name} style={{ borderRadius: 14, padding: 28, border: p.highlight ? "1px solid rgba(0,255,136,0.25)" : "1px solid rgba(255,255,255,0.08)", background: p.highlight ? "rgba(0,255,136,0.04)" : "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: "0.15em" }}>{p.name}</div>
                <div style={{ fontSize: 42, fontWeight: 800, color: p.highlight ? "#00ff88" : "#fff", marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 28, letterSpacing: "0.05em" }}>{p.period}</div>
                <div style={{ marginBottom: 28 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <Check size={12} color={p.highlight ? "#00ff88" : "rgba(255,255,255,0.3)"} />
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href={p.href} style={{ display: "block", width: "100%", padding: "13px 0", background: p.highlight ? "#00ff88" : "rgba(255,255,255,0.08)", color: p.highlight ? "#000" : "rgba(255,255,255,0.7)", borderRadius: 8, fontWeight: 800, fontSize: 12, textAlign: "center", textDecoration: "none", letterSpacing: "0.08em", boxSizing: "border-box" }}>
                  {p.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, marginBottom: 12, color: "#fff" }}>Get early access</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 32, fontSize: 13 }}>Be the first to know when Pro launches. No spam.</p>
          {submitted ? (
            <div style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 10, padding: "16px 24px", color: "#00ff88", fontWeight: 700, fontSize: 13, letterSpacing: "0.05em" }}>
              ✓ YOU'RE ON THE LIST
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
              <button onClick={() => { if (email) setSubmitted(true); }}
                style={{ padding: "12px 20px", background: "#00ff88", color: "#000", borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", border: "none", fontFamily: "inherit", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                NOTIFY ME
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #00ff88, #00aa55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#000" }}>Q</div>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em" }}>QUANTSIGNAL</span>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
          Educational signals only — not financial advice. Past performance does not guarantee future results.
        </div>
      </footer>
    </div>
  );
}
