"use client";

import { useState, useEffect } from "react";

const STEPS = [
  {
    tag: "INITIALIZING PLATFORM",
    title: "Welcome to QuantSignal",
    subtitle: "NEXT-GEN QUANTITATIVE INTELLIGENCE",
    body: "QuantSignal is powered by the FinSight Neural Engine. We scan 133 markets in real-time, blending XGBoost + LightGBM ensembles with institutional RAG data to give you high-probability, EV-positive signals.",
    cta: "SHOW ME THE EDGE →",
  },
  {
    tag: "PROTOCOL STEP 01",
    title: "Step 1 — The Signal Engine",
    subtitle: "DIRECTION + CONFIDENCE + CONFLUENCE",
    body: "Each asset has a direction (BUY/SELL/HOLD) with a calibrated probability. The Confluence Score (e.g. 7/9) means 7 of 9 proprietary indicators agree with the ML model. Only trade high-confluence setups.",
    cta: "PROCEED →",
  },
  {
    tag: "PROTOCOL STEP 02",
    title: "Step 2 — Trade Levels",
    subtitle: "ATR-CALCULATED RISK/REWARD",
    body: "Entry, Take Profit, and Stop Loss levels are dynamically calculated using Average True Range (ATR). The Kelly % tells you exactly how much capital to risk. Risk/reward is always mathematically sound.",
    cta: "PROCEED →",
  },
  {
    tag: "PROTOCOL STEP 03",
    title: "Step 3 — Energy & EV",
    subtitle: "MARKET STATE + EXPECTED VALUE",
    body: "Every signal includes an Energy State (coiled/releasing/exhausted) and EV score. Coiled = breakout imminent. Releasing = trade with trend. Exhausted = mean reversion likely. Only take EV-positive setups.",
    cta: "PROCEED →",
  },
  {
    tag: "PROTOCOL STEP 04",
    title: "Step 4 — Perseus Agent",
    subtitle: "YOUR ON-DEMAND QUANT ANALYST",
    body: "Perseus is an AI agent with memory. It reads live signals, regime state, energy, EV, and your trade history before every response. Ask it anything — it knows what happened last time you traded this asset.",
    cta: "PROCEED →",
  },
  {
    tag: "PROTOCOL STEP 05",
    title: "Final Protocol",
    subtitle: "RISK MANAGEMENT & EDUCATION",
    body: "QuantSignal is an educational intelligence layer. Markets are volatile and signals can fail. Never trade more than you can afford to lose. Use our levels as a guide, not a guarantee.",
    cta: "INITIALIZE DASHBOARD →",
  },
];

export default function TutorialModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleOpen = () => { setStep(0); setVisible(true); };
    window.addEventListener("open-tutorial", handleOpen);
    const seen = localStorage.getItem("qs_tutorial_seen");
    if (!seen) setVisible(true);
    return () => window.removeEventListener("open-tutorial", handleOpen);
  }, []);

  const dismiss = () => {
    localStorage.setItem("qs_tutorial_seen", "1");
    setVisible(false);
  };

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", fontFamily: "'IBM Plex Mono', monospace" }}>
      <div style={{ background: "#080a0f", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 4, width: "100%", maxWidth: 520, overflow: "hidden", boxShadow: "0 0 40px rgba(0,255,136,0.05)" }}>
        
        {/* Progress bar */}
        <div style={{ height: 2, background: "rgba(255,255,255,0.05)" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#00ff88", transition: "width 0.4s ease" }} />
        </div>

        {/* Step dots */}
        <div style={{ display: "flex", gap: 6, padding: "16px 24px 0", alignItems: "center" }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i <= step ? "#00ff88" : "rgba(255,255,255,0.08)", transition: "all 0.3s ease" }} />
          ))}
        </div>

        <div style={{ padding: "24px 32px 32px" }}>
          {/* Tag */}
          <div style={{ fontSize: 9, color: "rgba(0,255,136,0.6)", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 16 }}>
            {current.tag}
          </div>

          {/* Title */}
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>
            {current.title}
          </h2>

          {/* Subtitle */}
          <div style={{ fontSize: 10, color: "#00ff88", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 20 }}>
            {current.subtitle}
          </div>

          {/* Body */}
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 32 }}>
            {current.body}
          </p>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20 }}>
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              style={{ fontSize: 10, fontWeight: 700, color: step === 0 ? "transparent" : "rgba(255,255,255,0.25)", background: "transparent", border: "none", cursor: step === 0 ? "default" : "pointer", fontFamily: "inherit", letterSpacing: "0.1em", pointerEvents: step === 0 ? "none" : "auto" }}
            >
              ← BACK
            </button>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {step === 0 && (
                <button onClick={dismiss} style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em" }}>
                  SKIP
                </button>
              )}
              <button
                onClick={isLast ? dismiss : () => setStep(step + 1)}
                style={{ background: "linear-gradient(135deg, #00ff88, #00cc66)", color: "#000", fontWeight: 800, fontSize: 11, padding: "10px 24px", borderRadius: 4, border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em" }}
              >
                {current.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
