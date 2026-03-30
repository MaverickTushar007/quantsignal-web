"use client";
import { useState } from "react";

const API = "https://quantsignal-api-production.up.railway.app/api/v1";

const PLANS = [
  {
    id: "free", name: "Free", price: 0, color: "rgba(255,255,255,0.4)",
    features: ["10 signals per day","5 Perseus messages/day","Basic dashboard","Market overview"],
    locked: ["Alerts","Guardian monitor","Portfolio tracker","All agents","API access"],
    cta: "Get Started", highlight: false,
  },
  {
    id: "pro", name: "Pro", price: 999, color: "#00ff88",
    features: ["Unlimited signals","Unlimited Perseus chat","Guardian monitor","Portfolio tracker + P&L","All 8 agents","Telegram alerts","RegimeAgent + RiskAgent","ConflictAgent + NewsAgent"],
    locked: ["API access"],
    cta: "Start Pro — ₹999/mo", highlight: true,
  },
  {
    id: "institutional", name: "Institutional", price: 2999, color: "#aa88ff",
    features: ["Everything in Pro","Full REST API access","Webhook integrations","CalibrationAgent (auto-tuning)","Outcome feedback loop","Priority support"],
    locked: [],
    cta: "Go Institutional — ₹2999/mo", highlight: false,
  },
];

declare global { interface Window { Razorpay: any; } }

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise(resolve => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  };

  const handleCheckout = async (planId: string) => {
    if (planId === "free") { window.location.href = "/auth"; return; }
    setLoading(planId);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { alert("Failed to load Razorpay. Check your connection."); return; }

      const userId = localStorage.getItem("sb_user_id") || "anonymous";
      const email  = localStorage.getItem("sb_user_email") || "";

      const res = await fetch(API + "/billing/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ tier: planId, email }),
      });
      const data = await res.json();
      if (!data.subscription_id) { alert("Could not create subscription. Try again."); return; }

      const options = {
        key:             data.key_id,
        subscription_id: data.subscription_id,
        name:            "QuantSignal",
        description:     planId === "pro" ? "QuantSignal Pro — ₹999/month" : "QuantSignal Institutional — ₹2999/month",
        image:           "https://quantsignal.app/logo.png",
        prefill:         { email },
        theme:           { color: planId === "pro" ? "#00ff88" : "#aa88ff" },
        handler: async (response: any) => {
          // Payment successful — backend webhook will update tier
          // Show success and redirect
          alert("Payment successful! Your plan is now active.");
          window.location.href = "/dashboard";
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r: any) => {
        alert("Payment failed: " + r.error.description);
      });
      rzp.open();
    } catch(e) {
      alert("Something went wrong. Try again.");
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#080a0f", color:"#e2e8f0", fontFamily:"IBM Plex Mono,monospace" }}>
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"14px 24px", display:"flex", alignItems:"center", gap:12 }}>
        <a href="/dashboard" style={{ color:"rgba(255,255,255,0.3)", fontSize:11, textDecoration:"none" }}>← Back</a>
        <div style={{ width:1, height:16, background:"rgba(255,255,255,0.1)" }} />
        <span style={{ fontSize:13, fontWeight:700, color:"#00ff88", letterSpacing:"0.08em" }}>💳 PRICING</span>
      </div>

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"60px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ fontSize:10, color:"#00ff88", letterSpacing:"0.2em", marginBottom:12, fontWeight:700 }}>PLANS & PRICING</div>
          <h1 style={{ fontSize:30, fontWeight:800, color:"#fff", marginBottom:12 }}>Autonomous Market Intelligence</h1>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", maxWidth:460, margin:"0 auto", lineHeight:1.8 }}>
            Bloomberg Terminal costs ₹16L/year and has no AI reasoning.<br/>
            QuantSignal thinks autonomously — starting free.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              background: plan.highlight ? "rgba(0,255,136,0.04)" : "rgba(255,255,255,0.02)",
              border:`1px solid ${plan.highlight ? "rgba(0,255,136,0.25)" : "rgba(255,255,255,0.07)"}`,
              borderRadius:16, padding:"28px 22px", position:"relative" as const,
              display:"flex", flexDirection:"column" as const,
            }}>
              {plan.highlight && (
                <div style={{ position:"absolute" as const, top:-1, left:"50%", transform:"translateX(-50%)", background:"#00ff88", color:"#000", fontSize:8, fontWeight:800, padding:"4px 14px", borderRadius:"0 0 8px 8px", letterSpacing:"0.12em" }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:9, color:plan.color, fontWeight:700, letterSpacing:"0.12em", marginBottom:8 }}>{plan.name.toUpperCase()}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                  {plan.price > 0 && <span style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>₹</span>}
                  <span style={{ fontSize:34, fontWeight:800, color:"#fff" }}>{plan.price === 0 ? "Free" : plan.price.toLocaleString()}</span>
                  {plan.price > 0 && <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>/month</span>}
                </div>
              </div>
              <div style={{ flex:1, marginBottom:22 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display:"flex", gap:8, marginBottom:7, alignItems:"flex-start" }}>
                    <span style={{ color:plan.color, fontSize:10, flexShrink:0, marginTop:1 }}>✓</span>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
                {plan.locked.map(f => (
                  <div key={f} style={{ display:"flex", gap:8, marginBottom:7, alignItems:"flex-start" }}>
                    <span style={{ color:"rgba(255,255,255,0.2)", fontSize:10, flexShrink:0, marginTop:1 }}>✗</span>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)", lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => handleCheckout(plan.id)} disabled={loading === plan.id}
                style={{
                  width:"100%", border:"none", borderRadius:10, padding:"13px",
                  fontSize:10, fontWeight:700, fontFamily:"inherit", cursor:"pointer", letterSpacing:"0.04em",
                  background: plan.highlight ? "linear-gradient(135deg,#00ff88,#00cc66)"
                    : plan.id === "institutional" ? "linear-gradient(135deg,#aa88ff,#8866cc)"
                    : "rgba(255,255,255,0.08)",
                  color: plan.highlight || plan.id === "institutional" ? "#000" : "rgba(255,255,255,0.5)",
                  opacity: loading === plan.id ? 0.6 : 1,
                }}>
                {loading === plan.id ? "⏳ Opening checkout..." : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign:"center", marginTop:44, fontSize:10, color:"rgba(255,255,255,0.25)", lineHeight:2.2 }}>
          All plans · Cancel anytime · Payments via Razorpay (UPI, Cards, NetBanking, Wallets)<br/>
          Secured by Razorpay · GST invoice provided · Indian business registered
        </div>
      </div>
    </div>
  );
}