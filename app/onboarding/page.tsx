"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const MARKETS = [
  { id: "CRYPTO",    label: "Crypto",        icon: "₿", desc: "BTC, ETH, SOL and 17 more" },
  { id: "IN_STOCK",  label: "Indian Stocks",  icon: "₹", desc: "Nifty, Reliance, TCS and 28 more" },
  { id: "STOCK",     label: "US Stocks",      icon: "🇺🇸", desc: "AAPL, NVDA, TSLA and 28 more" },
  { id: "FOREX",     label: "Forex",          icon: "💱", desc: "EUR/USD, USD/INR and 5 more" },
  { id: "COMMODITY", label: "Commodities",    icon: "🥇", desc: "Gold, Oil, Silver and 3 more" },
  { id: "INDEX",     label: "Indices",        icon: "📊", desc: "S&P 500, Nifty 50 and 9 more" },
];

const FEATURES = [
  { icon: "🧠", title: "ML Signal + Probability", desc: "Every signal comes with a probability score from our XGBoost + LightGBM ensemble. Click any asset to see the full analysis.", cta: "Got it" },
  { icon: "⏪", title: "Historical Replay", desc: "Pick any date in the last 175 days and see exactly what signal the model would have fired — with AI explanation of whether it was right.", cta: "Nice" },
  { icon: "🛡️", title: "Trade Guardian", desc: "Before entering any trade, run it through Guardian. Enter your position size and capital — get your worst-case loss and AI verdict instantly.", cta: "Let's go →" },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [featureStep, setFeatureStep] = useState(0);
  const router = useRouter();
  const mono = "'IBM Plex Mono', monospace";

  const toggleMarket = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const saveAndContinue = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await (supabase.from("profiles") as any).upsert({ id: session.user.id, email: session.user.email });
      }
    } catch {}
    setStep(1);
  };

  const finish = () => {
    const map: Record<string, string> = { IN_STOCK: "INDIA", COMMODITY: "COMMOD" };
    const filter = selected[0] ? (map[selected[0]] || selected[0]) : "ALL";
    router.push("/dashboard?filter=" + filter);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#060608", color: "#e2e8f0", fontFamily: mono, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.05)" }}>
        <div style={{ height: "100%", background: "#00ff88", width: step === 0 ? "33%" : step === 1 ? "66%" : "100%", transition: "width 0.4s ease" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 560 }}>

        {step === 0 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #00ff88, #00cc66)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#000", margin: "0 auto 20px" }}>Q</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Welcome to QuantSignal</h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>What markets do you trade? We will set your default view.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
              {MARKETS.map(m => (
                <div key={m.id} onClick={() => toggleMarket(m.id)} style={{ background: selected.includes(m.id) ? "rgba(0,255,136,0.08)" : "rgba(255,255,255,0.02)", border: "1px solid " + (selected.includes(m.id) ? "rgba(0,255,136,0.35)" : "rgba(255,255,255,0.08)"), borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: selected.includes(m.id) ? "#00ff88" : "#fff", marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>{m.desc}</div>
                  {selected.includes(m.id) && <div style={{ marginTop: 8, fontSize: 10, color: "#00ff88", fontWeight: 700 }}>SELECTED</div>}
                </div>
              ))}
            </div>
            <button onClick={saveAndContinue} style={{ width: "100%", padding: 14, background: selected.length > 0 ? "linear-gradient(135deg, #00ff88, #00cc66)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, color: selected.length > 0 ? "#000" : "rgba(255,255,255,0.3)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: mono, letterSpacing: "0.05em" }}>
              {selected.length > 0 ? "CONTINUE WITH " + selected.length + " MARKET" + (selected.length > 1 ? "S" : "") + " →" : "SELECT AT LEAST ONE MARKET"}
            </button>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <span onClick={() => setStep(1)} style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", cursor: "pointer", textDecoration: "underline" }}>skip</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 20 }}>FEATURE {featureStep + 1} OF {FEATURES.length}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: 16, padding: 32, textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>{FEATURES[featureStep].icon}</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 12 }}>{FEATURES[featureStep].title}</h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 400, margin: "0 auto" }}>{FEATURES[featureStep].desc}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
              {FEATURES.map((_, i) => (
                <div key={i} style={{ width: i === featureStep ? 20 : 6, height: 6, borderRadius: 3, background: i === featureStep ? "#00ff88" : "rgba(255,255,255,0.1)", transition: "all 0.2s" }} />
              ))}
            </div>
            <button onClick={() => { if (featureStep < FEATURES.length - 1) setFeatureStep(f => f + 1); else setStep(2); }} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg, #00ff88, #00cc66)", border: "none", borderRadius: 10, color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: mono, letterSpacing: "0.05em" }}>
              {FEATURES[featureStep].cta}
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🚀</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>You are all set!</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: 40, maxWidth: 360, margin: "0 auto 40px" }}>118 live signals across crypto, Indian stocks, US stocks, forex and commodities.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 40 }}>
              {[["118", "Signals"], ["9", "Factors"], ["30", "Indian Stocks"]].map(([val, label]) => (
                <div key={label} style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: 10, padding: "16px 8px" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#00ff88" }}>{val}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
            <button onClick={finish} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg, #00ff88, #00cc66)", border: "none", borderRadius: 12, color: "#000", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: mono, letterSpacing: "0.05em" }}>
              VIEW MY SIGNALS →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
