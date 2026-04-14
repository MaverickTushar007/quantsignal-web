"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const API = "https://quantsignal-api-production-a5e1.up.railway.app/api/v1";
const RZP_KEY_ID = "rzp_test_SXLCrBAQeb6qNu";

const PLANS = [
  { id:"free", name:"Free", price:0, color:"rgba(255,255,255,0.4)",
    features:["10 signals per day","5 Perseus messages/day","Basic dashboard","Market overview"],
    locked:["Alerts","Guardian monitor","Portfolio tracker","All agents","API access"],
    cta:"Get Started", highlight:false },
  { id:"pro", name:"Pro", price:999, color:"#00ff88",
    features:["Unlimited signals","Unlimited Perseus chat","Telegram alerts","Guardian autonomous monitor","Portfolio tracker + live P&L","All 8 specialist agents","RegimeAgent + ConflictAgent","NewsAgent + CalibrationAgent"],
    locked:["API access"], cta:"Start Pro — ₹999/mo", highlight:true },
  { id:"institutional", name:"Institutional", price:2999, color:"#aa88ff",
    features:["Everything in Pro","Full REST API access","Webhook integrations","Priority support","Custom watchlists","Portfolio P&L export","CalibrationAgent auto-tuning","Outcome feedback loop"],
    locked:[], cta:"Go Institutional — ₹2,999/mo", highlight:false },
];

declare global { interface Window { Razorpay: any; } }

function loadRzp(): Promise<boolean> {
  return new Promise(resolve => {
    if (document.getElementById("rzp-js")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = "rzp-js";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function PricingPage() {
  const [loading, setLoading] = useState<string|null>(null);
  const [error, setError]     = useState("");

  const handleCheckout = async (planId: string) => {
    if (planId === "free") { window.location.href = "/auth"; return; }
    setLoading(planId); setError("");
    try {
      if (!await loadRzp()) throw new Error("Failed to load Razorpay");
      const userId = localStorage.getItem("user_id") || "anonymous";
      const email  = localStorage.getItem("user_email") || "";
      const res    = await fetch(`${API}/billing/create-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ tier: planId, email }),
      });
      if (!res.ok) throw new Error("Failed to create subscription");
      const data = await res.json();
      const rzp = new window.Razorpay({
        key:             data.key_id || RZP_KEY_ID,
        subscription_id: data.subscription_id,
        name:            "QuantSignal",
        description:     planId === "pro" ? "Pro — ₹999/month" : "Institutional — ₹2,999/month",
        prefill:         { email },
        notes:           { user_id: userId },
        theme:           { color: planId === "pro" ? "#00ff88" : "#aa88ff" },
        handler: (response: any) => {
          window.location.href = `/dashboard?upgraded=${planId}&pid=${response.razorpay_payment_id}`;
        },
        modal: { ondismiss: () => setLoading(null) },
      });
      rzp.on("payment.failed", (r: any) => { setError(r.error.description); setLoading(null); });
      rzp.open();
    } catch(e: any) { setError(e.message || "Something went wrong"); setLoading(null); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#080a0f", color:"#e2e8f0", fontFamily:"IBM Plex Mono,monospace" }}>
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"14px 24px", display:"flex", alignItems:"center", gap:12 }}>
        <a href="/dashboard" style={{ color:"rgba(255,255,255,0.3)", fontSize:11, textDecoration:"none" }}>← Back</a>
        <div style={{ width:1, height:16, background:"rgba(255,255,255,0.1)" }} />
        <span style={{ fontSize:13, fontWeight:700, color:"#00ff88", letterSpacing:"0.08em" }}>💳 PRICING</span>
      </div>
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"60px 24px" }}>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:"easeOut"}} style={{ textAlign:"center", marginBottom:60 }}>
          <div style={{ fontSize:11, color:"#00ff88", letterSpacing:"0.2em", marginBottom:12, fontWeight:700 }}>PLANS & PRICING</div>
          <h1 style={{ fontSize:32, fontWeight:800, color:"#fff", margin:"0 0 12px" }}>Autonomous Market Intelligence</h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", maxWidth:480, margin:"12px auto 0", lineHeight:1.7 }}>
            Bloomberg Terminal costs ₹16L/year and has no AI reasoning.<br/>QuantSignal thinks autonomously — starting free.
          </p>
        </motion.div>
        {error && <div style={{ background:"rgba(255,68,102,0.1)", border:"1px solid rgba(255,68,102,0.3)", borderRadius:10, padding:"12px 16px", marginBottom:24, fontSize:11, color:"#ff4466", textAlign:"center" }}>{error}</div>}
        <motion.div initial="hidden" animate="visible" variants={{ visible:{ transition:{ staggerChildren:0.12 } } }} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          {PLANS.map(plan => (
            <motion.div key={plan.id} variants={{ hidden:{opacity:0,y:24}, visible:{opacity:1,y:0,transition:{duration:0.4,ease:"easeOut"}} }} style={{ background:plan.highlight?"rgba(0,255,136,0.04)":"rgba(255,255,255,0.02)", border:`1px solid ${plan.highlight?"rgba(0,255,136,0.25)":"rgba(255,255,255,0.07)"}`, borderRadius:16, padding:"28px 24px", position:"relative", display:"flex", flexDirection:"column" }}>
              {plan.highlight && <div style={{ position:"absolute", top:-1, left:"50%", transform:"translateX(-50%)", background:"#00ff88", color:"#000", fontSize:9, fontWeight:800, padding:"4px 14px", borderRadius:"0 0 8px 8px", letterSpacing:"0.1em" }}>MOST POPULAR</div>}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, color:plan.color, fontWeight:700, letterSpacing:"0.12em", marginBottom:8 }}>{plan.name.toUpperCase()}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                  {plan.price > 0 && <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>₹</span>}
                  <span style={{ fontSize:36, fontWeight:800, color:"#fff" }}>{plan.price === 0 ? "Free" : plan.price.toLocaleString()}</span>
                  {plan.price > 0 && <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>/month</span>}
                </div>
              </div>
              <div style={{ flex:1, marginBottom:24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                    <span style={{ color:plan.color, fontSize:11, flexShrink:0, marginTop:1 }}>✓</span>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
                {plan.locked.map(f => (
                  <div key={f} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                    <span style={{ color:"rgba(255,255,255,0.2)", fontSize:11, flexShrink:0, marginTop:1 }}>✗</span>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)", lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => handleCheckout(plan.id)} disabled={loading === plan.id}
                style={{ width:"100%", background:plan.highlight?"linear-gradient(135deg,#00ff88,#00cc66)":plan.id==="institutional"?"linear-gradient(135deg,#aa88ff,#8866cc)":"rgba(255,255,255,0.08)", border:"none", borderRadius:10, padding:"13px", fontSize:11, fontWeight:700, color:plan.highlight||plan.id==="institutional"?"#000":"rgba(255,255,255,0.6)", cursor:loading===plan.id?"not-allowed":"pointer", fontFamily:"inherit", opacity:loading===plan.id?0.6:1 }}>
                {loading === plan.id ? "⏳ Opening checkout..." : plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
        <div style={{ textAlign:"center", marginTop:48, fontSize:11, color:"rgba(255,255,255,0.3)", lineHeight:2.2 }}>
          Payments via Razorpay · UPI, Cards, NetBanking · Cancel anytime<br/>
          <a href="/dashboard" style={{ color:"#00ff88", textDecoration:"none" }}>← Back to Dashboard</a>
        </div>
      </div>
    </div>
  );
}