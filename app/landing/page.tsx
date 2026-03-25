"use client";
import { useState, useEffect, useRef } from "react";

const SIGNALS = [
  { symbol: "RELIANCE", dir: "BUY", prob: 87, price: "₹2,847" },
  { symbol: "NIFTY50",  dir: "BUY", prob: 81, price: "₹24,132" },
  { symbol: "TCS",      dir: "HOLD", prob: 63, price: "₹3,921" },
  { symbol: "BTC/USD",  dir: "BUY", prob: 78, price: "$67,420" },
  { symbol: "AAPL",     dir: "SELL", prob: 71, price: "$189.40" },
];

export default function Landing() {
  const [scrolled, setScrolled]     = useState(false);
  const [visible, setVisible]       = useState(false);
  const [sigIdx, setSigIdx]         = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    const t = setInterval(() => setSigIdx(i => (i + 1) % SIGNALS.length), 2400);
    return () => { window.removeEventListener("scroll", onScroll); clearInterval(t); };
  }, []);

  const sig = SIGNALS[sigIdx];
  const dirColor = (d: string) => d === "BUY" ? "#22c55e" : d === "SELL" ? "#ef4444" : "#f59e0b";

  return (
    <div style={{ background: "#060d06", color: "#e8f5e8", fontFamily: "\'Sora\', \'DM Sans\', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5%",
        background: scrolled ? "rgba(6,13,6,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(34,197,94,0.12)" : "none",
        transition: "all 0.3s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>Q</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em", color: "#f0fdf0" }}>QuantSignal</span>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 14, color: "rgba(232,245,232,0.6)" }}>
          {["Features","How It Works","Pricing"].map(item => (
            <a key={item} href={"#"+item.toLowerCase().replace(/ /g,"-")}
              style={{ color: "rgba(232,245,232,0.6)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#22c55e")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(232,245,232,0.6)")}>
              {item}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/auth" style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            Sign in
          </a>
          <a href="/auth" style={{ padding: "8px 20px", borderRadius: 8, background: "#22c55e", color: "#060d06", fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#22c55e"; }}>
            Get started
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "0 5%", paddingTop: 80, position: "relative", overflow: "hidden",
      }}>
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "10%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* Left copy */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, border: "1px solid rgba(34,197,94,0.25)", background: "rgba(34,197,94,0.06)", fontSize: 12, color: "#22c55e", fontWeight: 600, marginBottom: 24, letterSpacing: "0.04em" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", display: "inline-block" }} />
              LIVE SIGNALS ACTIVE
            </div>
            <h1 style={{ fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em", color: "#f0fdf0", margin: "0 0 24px" }}>
              Trade with{" "}
              <span style={{ background: "linear-gradient(135deg, #22c55e, #86efac)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                institutional
              </span>
              {" "}intelligence
            </h1>
            <p style={{ fontSize: 18, color: "rgba(232,245,232,0.55)", lineHeight: 1.6, margin: "0 0 40px", maxWidth: 480 }}>
              AI-powered trading signals for Indian & global markets. Real-time analysis, ML-driven predictions, zero noise.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="/auth" style={{ padding: "14px 32px", borderRadius: 12, background: "#22c55e", color: "#060d06", fontSize: 16, fontWeight: 700, textDecoration: "none", transition: "all 0.2s", boxShadow: "0 0 32px rgba(34,197,94,0.3)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; }}>
                Start trading free →
              </a>
              <a href="/how-it-works" style={{ padding: "14px 32px", borderRadius: 12, border: "1px solid rgba(34,197,94,0.2)", color: "rgba(232,245,232,0.7)", fontSize: 16, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.5)"; e.currentTarget.style.color = "#22c55e"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.2)"; e.currentTarget.style.color = "rgba(232,245,232,0.7)"; }}>
                See how it works
              </a>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
              {[["2,400+","Active traders"],["94%","Signal accuracy"],["₹0","To get started"]].map(([val,lbl]) => (
                <div key={lbl}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#f0fdf0", letterSpacing: "-0.02em" }}>{val}</div>
                  <div style={{ fontSize: 12, color: "rgba(232,245,232,0.4)", marginTop: 2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Spline + floating card */}
          <div style={{ position: "relative", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.2s" }}>
            {/* Spline embed — swap URL here */}
            <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(34,197,94,0.12)", background: "rgba(34,197,94,0.03)" }}>
              <iframe
                src="https://my.spline.design/nexbotrobotdigitalfuturisticdesign-e8f79ae23af2da93c3de96f65c0c9960/"
                frameBorder={0}
                width="100%"
                height="100%"
                style={{ display: "block" }}
              />
            </div>
            {/* Floating signal card */}
            <div style={{
              position: "absolute", bottom: -20, left: -24,
              background: "rgba(6,13,6,0.95)", border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 16, padding: "16px 20px", backdropFilter: "blur(20px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              minWidth: 200, transition: "all 0.4s ease",
            }}>
              <div style={{ fontSize: 10, color: "rgba(232,245,232,0.35)", letterSpacing: "0.1em", marginBottom: 10 }}>LIVE SIGNAL</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#f0fdf0" }}>{sig.symbol}</div>
                  <div style={{ fontSize: 12, color: "rgba(232,245,232,0.4)", marginTop: 2 }}>{sig.price}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: dirColor(sig.dir) }}>{sig.dir}</div>
                  <div style={{ fontSize: 12, color: "rgba(232,245,232,0.4)", marginTop: 2 }}>{sig.prob}% conf.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "120px 5%", background: "rgba(34,197,94,0.02)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, letterSpacing: "0.12em", marginBottom: 16 }}>WHAT YOU GET</div>
            <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0fdf0", margin: 0 }}>Built for serious traders</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: "⚡", title: "Real-time signals", desc: "Live BUY/SELL/HOLD signals across 50+ Indian & global assets, updated every 15 minutes." },
              { icon: "🧠", title: "ML-powered engine", desc: "Ensemble models trained on 10 years of market data. RSI, MACD, Bollinger, sentiment fusion." },
              { icon: "🛡️", title: "Risk guardian", desc: "Automatic position sizing, stop-loss recommendations, and portfolio drawdown alerts." },
              { icon: "📊", title: "Portfolio lab", desc: "Backtest any strategy. See historical returns before you risk a single rupee." },
              { icon: "🤖", title: "AI agents", desc: "Deploy autonomous trading agents that monitor markets and alert you instantly." },
              { icon: "📱", title: "Mobile first", desc: "Full-featured mobile app. Check signals, manage agents, track P&L on the go." },
            ].map(f => (
              <div key={f.title} style={{
                padding: "28px 24px", borderRadius: 16,
                border: "1px solid rgba(34,197,94,0.1)",
                background: "rgba(34,197,94,0.03)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; e.currentTarget.style.background = "rgba(34,197,94,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.1)"; e.currentTarget.style.background = "rgba(34,197,94,0.03)"; }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f0fdf0", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "rgba(232,245,232,0.45)", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section style={{ padding: "120px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, letterSpacing: "0.12em", marginBottom: 16 }}>PERFORMANCE</div>
            <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0fdf0", margin: "0 0 24px" }}>Numbers that speak</h2>
            <p style={{ fontSize: 16, color: "rgba(232,245,232,0.5)", lineHeight: 1.7, margin: "0 0 40px" }}>
              Backtested across 3 years of live market data. QuantSignal consistently outperforms passive index strategies.
            </p>
            {[["94.2%","Signal accuracy on Nifty50 components"],["3.2x","Average return vs Nifty benchmark"],["<200ms","Signal generation latency"]].map(([val,lbl]) => (
              <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#22c55e", minWidth: 100 }}>{val}</div>
                <div style={{ fontSize: 14, color: "rgba(232,245,232,0.45)" }}>{lbl}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Total signals today", value: "847" },
              { label: "Accuracy (30d)", value: "94.2%" },
              { label: "Active users", value: "2,418" },
              { label: "Avg confidence", value: "78%" },
            ].map(s => (
              <div key={s.label} style={{ padding: "28px 24px", borderRadius: 16, border: "1px solid rgba(34,197,94,0.12)", background: "rgba(34,197,94,0.04)", textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#22c55e", letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "rgba(232,245,232,0.4)", marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "120px 5%", background: "rgba(34,197,94,0.02)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, letterSpacing: "0.12em", marginBottom: 16 }}>PRICING</div>
          <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0fdf0", margin: "0 0 64px" }}>Start free, scale when ready</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            {[
              { name: "Free", price: "₹0", period: "/mo", features: ["10 signals/day","Basic assets","Email alerts"], cta: "Get started", highlight: false },
              { name: "Pro", price: "₹999", period: "/mo", features: ["Unlimited signals","All 50+ assets","SMS + push alerts","Portfolio lab","AI agents (2)"], cta: "Start Pro", highlight: true },
              { name: "Elite", price: "₹2,499", period: "/mo", features: ["Everything in Pro","Unlimited agents","API access","Priority support","Custom strategies"], cta: "Go Elite", highlight: false },
            ].map(plan => (
              <div key={plan.name} style={{
                padding: "32px 28px", borderRadius: 20,
                border: plan.highlight ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(34,197,94,0.1)",
                background: plan.highlight ? "rgba(34,197,94,0.07)" : "rgba(34,197,94,0.02)",
                position: "relative",
              }}>
                {plan.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#22c55e", color: "#060d06", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 100, letterSpacing: "0.06em" }}>MOST POPULAR</div>}
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f0fdf0", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: plan.highlight ? "#22c55e" : "#f0fdf0", letterSpacing: "-0.03em" }}>{plan.price}<span style={{ fontSize: 16, fontWeight: 400, color: "rgba(232,245,232,0.4)" }}>{plan.period}</span></div>
                <div style={{ margin: "24px 0", borderTop: "1px solid rgba(34,197,94,0.1)" }} />
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: 14, color: "rgba(232,245,232,0.6)" }}>
                    <span style={{ color: "#22c55e", fontSize: 12 }}>✓</span> {f}
                  </div>
                ))}
                <a href="/auth" style={{
                  display: "block", marginTop: 24, padding: "12px", borderRadius: 10, textAlign: "center",
                  background: plan.highlight ? "#22c55e" : "transparent",
                  border: plan.highlight ? "none" : "1px solid rgba(34,197,94,0.25)",
                  color: plan.highlight ? "#060d06" : "#22c55e",
                  fontSize: 14, fontWeight: 700, textDecoration: "none",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { if (!plan.highlight) { e.currentTarget.style.background = "rgba(34,197,94,0.1)"; } }}
                  onMouseLeave={e => { if (!plan.highlight) { e.currentTarget.style.background = "transparent"; } }}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "120px 5%", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0fdf0", margin: "0 0 24px" }}>
            Ready to trade smarter?
          </h2>
          <p style={{ fontSize: 18, color: "rgba(232,245,232,0.45)", margin: "0 0 40px" }}>Join 2,400+ traders using QuantSignal to make data-driven decisions every day.</p>
          <a href="/auth" style={{ display: "inline-block", padding: "16px 48px", borderRadius: 14, background: "#22c55e", color: "#060d06", fontSize: 18, fontWeight: 700, textDecoration: "none", boxShadow: "0 0 48px rgba(34,197,94,0.35)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Get started for free →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 5%", borderTop: "1px solid rgba(34,197,94,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#f0fdf0" }}>QuantSignal</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(232,245,232,0.25)" }}>© 2025 QuantSignal. Built for traders.</div>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: "rgba(232,245,232,0.35)" }}>
          {["Privacy","Terms","Contact"].map(l => (
            <a key={l} href="#" style={{ color: "rgba(232,245,232,0.35)", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#22c55e"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(232,245,232,0.35)"}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}