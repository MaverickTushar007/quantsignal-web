"use client";
import { useState } from "react";

const API_BASE = "https://web-production-1a093.up.railway.app/api/v1";

export default function TradeGuardian({ signal, onClose }: { signal: any; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [capital, setCapital] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"input" | "result">("input");

  const runCheck = async () => {
    if (!amount || !capital) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/guardian/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: signal.symbol || "UNKNOWN",
          direction: signal.direction || "HOLD",
          current_price: signal.current_price || 0,
          take_profit: signal.take_profit || (signal.current_price * 1.02),
          stop_loss: signal.stop_loss || (signal.current_price * 0.99),
          probability: signal.probability || 0.5,
          kelly_size: signal.kelly_size || 2.0,
          atr: signal.atr || (signal.current_price * 0.015),
          risk_reward: signal.risk_reward || 2.0,
          position_amount: parseFloat(amount),
          total_capital: parseFloat(capital),
        }),
      });
      const data = await res.json();
      setResult(data);
      setStep("result");
    } catch {}
    finally { setLoading(false); }
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", zIndex: 200, animation: "fadeIn 0.2s ease" }} />
      
      {/* Panel */}
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "min(480px, 92vw)",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "rgba(10,12,18,0.95)",
        backdropFilter: "blur(32px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: 24,
        zIndex: 201,
        boxShadow: "0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,255,136,0.05)",
        animation: "guardianSlide 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        fontFamily: "'IBM Plex Mono', monospace",
      }}>
        <style>{`
          @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
          @keyframes guardianSlide { from { opacity:0; transform:translate(-50%,-45%) } to { opacity:1; transform:translate(-50%,-50%) } }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
          @keyframes resultIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        `}</style>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛡️</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#00ff88", letterSpacing: "0.1em" }}>TRADE GUARDIAN</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{signal.symbol} · {signal.direction} · ${signal.current_price?.toLocaleString()}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 18, padding: 4 }}>✕</button>
        </div>

        {step === "input" ? (
          <>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 24 }}>
              Before you enter this trade, let Guardian check if your sizing makes sense for your capital.
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: "0.08em" }}>HOW MUCH ARE YOU PUTTING IN?</div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>$</span>
                <input
                  type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="500"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px 12px 28px", fontSize: 16, fontWeight: 700, color: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: "0.08em" }}>WHAT'S YOUR TOTAL TRADING CAPITAL?</div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>$</span>
                <input
                  type="number" value={capital} onChange={e => setCapital(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && runCheck()}
                  placeholder="2000"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px 12px 28px", fontSize: 16, fontWeight: 700, color: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>
            </div>

            <button onClick={runCheck} disabled={!amount || !capital || loading}
              style={{ width: "100%", background: amount && capital ? "linear-gradient(135deg, #00ff88, #00cc66)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, padding: "14px", fontSize: 13, fontWeight: 700, color: amount && capital ? "#000" : "rgba(255,255,255,0.3)", cursor: amount && capital ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.2s" }}>
              {loading ? "Analyzing..." : "🛡️ Run Guardian Check"}
            </button>
          </>
        ) : result ? (
          <div style={{ animation: "resultIn 0.3s ease" }}>
            {/* Verdict */}
            <div style={{ background: `${result.verdict_color}12`, border: `1px solid ${result.verdict_color}30`, borderRadius: 12, padding: "16px 20px", marginBottom: 20, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{result.verdict_emoji}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: result.verdict_color, letterSpacing: "0.05em", marginBottom: 4 }}>{result.verdict}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{result.verdict_msg}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{result.verdict_sub}</div>
            </div>

            {/* Numbers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{ background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 9, color: "rgba(255,68,102,0.7)", marginBottom: 4, letterSpacing: "0.08em" }}>WORST CASE LOSS</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#ff4466" }}>${(result.max_loss_dollars || 0).toLocaleString()}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{result.capital_at_risk}% of your capital</div>
              </div>
              <div style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 9, color: "rgba(0,255,136,0.7)", marginBottom: 4, letterSpacing: "0.08em" }}>BEST CASE GAIN</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#00ff88" }}>${(result.max_gain_dollars || 0).toLocaleString()}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{result.risk_reward}:1 reward/risk</div>
              </div>
            </div>

            {/* Sizing advice */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 4, letterSpacing: "0.08em" }}>GUARDIAN SIZING ADVICE</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{result.sizing_advice}</div>
            </div>

            {/* AI Analysis */}
            {result.ai_analysis && (
              <div style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.12)", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
                <div style={{ fontSize: 9, color: "#00ff88", marginBottom: 6, letterSpacing: "0.08em" }}>🤖 GUARDIAN SAYS</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>{result.ai_analysis}</div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setStep("input"); setResult(null); }}
                style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px", fontSize: 11, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>
                ← Try Different Size
              </button>
              <button onClick={onClose}
                style={{ flex: 1, background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 10, padding: "11px", fontSize: 11, fontWeight: 700, color: "#00ff88", cursor: "pointer", fontFamily: "inherit" }}>
                Got It ✓
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
