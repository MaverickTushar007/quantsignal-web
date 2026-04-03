"use client";
import { useState, useEffect } from "react";

const mono = "'IBM Plex Mono', monospace";

const STEPS = [
  {
    icon: "📊",
    title: "Welcome to QuantSignal",
    desc: "An AI-powered signal engine that analyzes 186 assets across India, Crypto, and US markets — and tells you what to do next.",
    action: "Pick any asset from the list on the right to get started.",
  },
  {
    icon: "🎯",
    title: "Reading a Signal",
    desc: "Every asset shows a direction (BUY / SELL / HOLD), a confidence score, and trade levels (Entry, TP, SL). Higher confidence = stronger edge.",
    action: "Look at Signal Confidence on the left panel. Green = strong, Yellow = moderate, Red = weak.",
  },
  {
    icon: "🤖",
    title: "Perseus AI Engine",
    desc: "Click the 'Perseus Engine' tab to get a plain-English explanation of the signal — what's driving it, risks, and what to watch for.",
    action: "Use Perseus to understand WHY a signal exists before acting on it.",
  },
  {
    icon: "📈",
    title: "Track Record & Agent Lab",
    desc: "The Track Record tab shows the system's live performance. Agent Lab lets you run virtual paper-trading bots with zero real money.",
    action: "Click the 💬 button anytime to share feedback. Click ? to reopen this guide.",
  },
];

export default function OnboardingTour() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("qs_onboarded");
    if (!seen) {
      setTimeout(() => setShow(true), 1200);
    }
  }, []);

  const finish = () => {
    localStorage.setItem("qs_onboarded", "1");
    setShow(false);
    setStep(0);
  };

  const current = STEPS[step];

  return (
    <>
      {/* ? Help Icon — always visible */}
      <div
        onClick={() => { setStep(0); setShow(true); }}
        title="How to use QuantSignal"
        style={{
          position: "fixed", bottom: 88, right: 30, zIndex: 999,
          width: 36, height: 36, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 14, color: "rgba(255,255,255,0.5)",
          fontFamily: mono, fontWeight: 700, transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          e.currentTarget.style.color = "rgba(255,255,255,0.5)";
        }}
      >
        ?
      </div>

      {/* Tour Modal */}
      {show && (
        <div
          onClick={e => { if (e.target === e.currentTarget) finish(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 3000,
            background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
          }}
        >
          <div style={{
            background: "#0e0e12",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 18, padding: 32, width: "100%", maxWidth: 400,
            fontFamily: mono, position: "relative",
          }}>
            {/* Close */}
            <div
              onClick={finish}
              style={{ position: "absolute", top: 16, right: 18, cursor: "pointer", fontSize: 16, color: "rgba(255,255,255,0.25)" }}
            >✕</div>

            {/* Step indicator */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  height: 3, flex: 1, borderRadius: 2,
                  background: i <= step ? "#00ff88" : "rgba(255,255,255,0.08)",
                  transition: "background 0.3s",
                }} />
              ))}
            </div>

            {/* Icon */}
            <div style={{ fontSize: 36, marginBottom: 14 }}>{current.icon}</div>

            {/* Title */}
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
              {current.title}
            </div>

            {/* Description */}
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 14 }}>
              {current.desc}
            </div>

            {/* Action hint */}
            <div style={{
              background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.15)",
              borderRadius: 8, padding: "10px 14px", fontSize: 11,
              color: "rgba(0,255,136,0.8)", lineHeight: 1.6, marginBottom: 24,
            }}>
              → {current.action}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <div
                onClick={finish}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 8, textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)",
                  fontSize: 10, cursor: "pointer", letterSpacing: "0.08em",
                }}
              >
                SKIP TOUR
              </div>
              <div
                onClick={() => {
                  if (step < STEPS.length - 1) setStep(step + 1);
                  else finish();
                }}
                style={{
                  flex: 2, padding: "10px 0", borderRadius: 8, textAlign: "center",
                  background: "linear-gradient(135deg, #00ff88, #00cc66)",
                  color: "#000", fontSize: 11, fontWeight: 800,
                  cursor: "pointer", letterSpacing: "0.08em",
                }}
              >
                {step < STEPS.length - 1 ? `NEXT  ${step + 1}/${STEPS.length}` : "GOT IT ✓"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
