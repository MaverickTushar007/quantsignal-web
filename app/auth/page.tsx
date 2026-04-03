"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SIGNALS = [
  { symbol:"RELIANCE", dir:"BUY",  prob:87, price:"₹2,847"  },
  { symbol:"BTC/USD",  dir:"BUY",  prob:81, price:"$67,420" },
  { symbol:"TCS",      dir:"HOLD", prob:63, price:"₹3,921"  },
  { symbol:"NIFTY50",  dir:"BUY",  prob:78, price:"₹24,132" },
  { symbol:"AAPL",     dir:"SELL", prob:71, price:"$189.40" },
];

export default function AuthPage() {
  const [mode, setMode]         = useState<"login"|"signup">("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [tick, setTick]         = useState(0);
  const [resetSent, setResetSent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const mono = "'DM Mono', monospace";

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 2000);
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => { clearInterval(t); window.removeEventListener("resize", check); };
  }, []);

  async function handleSubmit() {
    setLoading(true); setError("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message); else router.push("/onboarding");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message); else router.push("/dashboard");
    }
    setLoading(false);
  }

  async function handleForgotPassword() {
    if (!email) { setError("Enter your email above first."); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth/reset",
    });
    if (error) setError(error.message);
    else setResetSent(true);
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: window.location.origin+"/dashboard" } });
  }

  const dc = (d: string) => d==="BUY"?"#3fb950":d==="SELL"?"#f85149":"#e3b341";
  const db = (d: string) => d==="BUY"?"rgba(63,185,80,0.12)":d==="SELL"?"rgba(248,81,73,0.12)":"rgba(227,179,65,0.12)";

  const inputStyle: React.CSSProperties = {
    width:"100%", background:"rgba(255,255,255,0.04)",
    border:"1px solid rgba(255,255,255,0.1)", borderRadius:8,
    padding:"12px 14px", color:"#e6edf3", fontSize:13, outline:"none",
    fontFamily:mono, boxSizing:"border-box", transition:"all 0.2s",
  };

  return (
    <div style={{minHeight:"100dvh", background:"#010409", display:"flex", fontFamily:mono, overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes pr{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.2);opacity:0}}
        @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes gp{0%,100%{opacity:.4}50%{opacity:1}}
        input:focus{border-color:rgba(63,185,80,0.5)!important;background:rgba(63,185,80,0.05)!important;box-shadow:0 0 0 3px rgba(63,185,80,0.07)!important;}
        .abtn{transition:transform .18s,box-shadow .18s,filter .18s;}
        .abtn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(63,185,80,0.25);filter:brightness(1.08);}
        .gbtn{transition:all .18s;}
        .gbtn:hover{border-color:rgba(255,255,255,0.18)!important;background:rgba(255,255,255,0.06)!important;color:rgba(230,237,243,0.8)!important;}
        .tab-btn{transition:all .2s;}
        .tab-btn:hover{color:rgba(230,237,243,0.7)!important;}
        .sig-row{transition:all 0.35s ease;}
      `}</style>

      {/* LEFT PANEL */}
      {!isMobile && (
        <div style={{flex:1,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"center",padding:"52px 48px",background:"#0d1117",borderRight:"1px solid #21262d"}}>
          {/* Grid */}
          <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(48,54,61,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(48,54,61,0.5) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none"}}/>
          {/* Glow */}
          <div style={{position:"absolute",top:"-5%",left:"-5%",width:500,height:500,background:"radial-gradient(circle,rgba(63,185,80,0.07) 0%,transparent 60%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"0%",right:"-5%",width:360,height:360,background:"radial-gradient(circle,rgba(88,166,255,0.05) 0%,transparent 60%)",pointerEvents:"none"}}/>

          {/* Logo */}
          <div style={{position:"relative",zIndex:1,marginBottom:36}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:32,height:32,background:"#238636",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#fff",fontFamily:"Sora,sans-serif"}}>Q</div>
              <span style={{fontSize:16,fontWeight:700,color:"#e6edf3",fontFamily:"Sora,sans-serif",letterSpacing:"-.4px"}}>Quant<span style={{color:"#3fb950"}}>Signal</span></span>
            </div>
            <p style={{fontSize:13,color:"rgba(139,148,158,0.9)",lineHeight:1.75,maxWidth:300}}>
              ML-powered trading signals for Indian &amp; global markets. Every signal explains its reasoning.
            </p>
          </div>

          {/* Stats — 3 colors */}
          <div style={{position:"relative",zIndex:1,display:"flex",gap:0,marginBottom:32,background:"#161b22",borderRadius:10,border:"1px solid #21262d",overflow:"hidden"}}>
            {[["133","Live assets","#3fb950"],["96%","Model agreement","#58a6ff"],["2:1","Avg risk/reward","#e3b341"]].map(([v,l,c],i)=>(
              <div key={l} style={{flex:1,padding:"16px 12px",borderRight:i<2?"1px solid #21262d":"none",textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:800,color:c,letterSpacing:"-.5px",fontFamily:"Sora,sans-serif"}}>{v}</div>
                <div style={{fontSize:10,color:"#8b949e",marginTop:3}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Dashboard mockup */}
          <div style={{position:"relative",zIndex:1,animation:"fl 7s ease-in-out infinite"}}>
            <div style={{borderRadius:12,overflow:"hidden",background:"#161b22",border:"1px solid #30363d",boxShadow:"0 16px 48px rgba(1,4,9,0.8)"}}>
              {/* Browser chrome */}
              <div style={{padding:"10px 14px",borderBottom:"1px solid #21262d",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0d1117"}}>
                <div style={{display:"flex",gap:5}}>{[.18,.12,.08].map((o,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:`rgba(255,255,255,${o})`}}/>)}</div>
                <div style={{fontSize:9,color:"#484f58",fontFamily:"monospace"}}>quantsignal.app/dashboard</div>
                <div style={{display:"flex",alignItems:"center",gap:4,fontSize:8,color:"#3fb950",fontWeight:600}}>
                  <span style={{width:4,height:4,borderRadius:"50%",background:"#3fb950",display:"inline-block",animation:"gp 1.5s infinite"}}/>LIVE
                </div>
              </div>
              {/* Col headers */}
              <div style={{padding:"7px 14px 3px",display:"flex",justifyContent:"space-between",fontSize:8,color:"#484f58",letterSpacing:".08em"}}>
                <span>ASSET</span><span>SIGNAL</span><span>CONF.</span>
              </div>
              {/* Signal rows */}
              {SIGNALS.map((row,i)=>(
                <div key={row.symbol} className="sig-row" style={{padding:"8px 14px",borderBottom:"1px solid #21262d",display:"flex",alignItems:"center",justifyContent:"space-between",background:i===tick%5?"rgba(63,185,80,0.06)":"transparent",borderLeft:i===tick%5?"2px solid #3fb950":"2px solid transparent"}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:i===tick%5?"#3fb950":"#c9d1d9"}}>{row.symbol}</div>
                    <div style={{fontSize:8,color:"#484f58",marginTop:1}}>{row.price}</div>
                  </div>
                  <div style={{padding:"2px 8px",borderRadius:4,fontSize:9,fontWeight:700,background:db(row.dir),color:dc(row.dir)}}>{row.dir}</div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#c9d1d9"}}>{row.prob}%</div>
                    <div style={{width:44,height:2,borderRadius:2,background:"#21262d",marginTop:3}}>
                      <div style={{width:`${row.prob}%`,height:"100%",borderRadius:2,background:dc(row.dir)}}/>
                    </div>
                  </div>
                </div>
              ))}
              {/* AI reasoning */}
              <div style={{margin:"8px 14px 10px",padding:"9px 11px",borderRadius:8,background:"rgba(88,166,255,0.06)",border:"1px solid rgba(88,166,255,0.15)"}}>
                <div style={{fontSize:8,color:"#58a6ff",fontWeight:700,letterSpacing:".1em",marginBottom:4}}>🤖 AI REASONING</div>
                <div style={{fontSize:10,color:"#8b949e",lineHeight:1.7}}>RSI divergence + MACD crossover confirms bullish momentum. Kelly sizing: 5.9% of capital...</div>
              </div>
            </div>
          </div>

          {/* What you get */}
          <div style={{position:"relative",zIndex:1,marginTop:24,padding:"14px 18px",borderRadius:10,background:"#161b22",border:"1px solid #21262d"}}>
            <div style={{fontSize:9,letterSpacing:"0.12em",color:"#3fb950",fontWeight:700,marginBottom:10}}>WHAT YOU GET</div>
            {[
              "Every signal explains its reasoning — no black box",
              "Kelly-optimal position sizing on every trade",
              "Perseus AI analyst available 24/7 in SIMPLE or QUANT mode",
              "Guardian monitors your watchlist every 15 minutes autonomously",
            ].map((item, i) => (
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}>
                <span style={{color:"#3fb950",fontSize:11,marginTop:1}}>✓</span>
                <span style={{fontSize:11,color:"#8b949e",lineHeight:1.6}}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RIGHT PANEL */}
      <div style={{width:isMobile?"100%":480,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:isMobile?"24px 20px":"52px 44px",position:"relative",background:"#010409"}}>
        <div style={{position:"absolute",top:"20%",right:"0",width:280,height:280,background:"radial-gradient(circle,rgba(63,185,80,0.05) 0%,transparent 70%)",pointerEvents:"none"}}/>

        <div style={{width:"100%",maxWidth:360,position:"relative",zIndex:1}}>
          {/* Mobile logo */}
          {isMobile && (
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:32}}>
              <div style={{width:28,height:28,background:"#238636",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff",fontFamily:"Sora,sans-serif"}}>Q</div>
              <span style={{fontSize:15,fontWeight:700,color:"#e6edf3",fontFamily:"Sora,sans-serif",letterSpacing:"-.3px"}}>Quant<span style={{color:"#3fb950"}}>Signal</span></span>
            </div>
          )}

          {/* Form card */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.45,ease:"easeOut"}} style={{background:"#0d1117",border:"1px solid #21262d",borderRadius:16,padding:"32px 28px",boxShadow:"0 8px 32px rgba(1,4,9,0.6)"}}>
            <h2 style={{fontSize:24,fontWeight:800,color:"#e6edf3",fontFamily:"Sora,sans-serif",letterSpacing:"-.5px",marginBottom:5}}>
              {mode==="login"?"Welcome back":"Create account"}
            </h2>
            <p style={{fontSize:12,color:"#8b949e",marginBottom:24,lineHeight:1.6}}>
              {mode==="login"?"Sign in to access your signals and portfolio.":"Free forever. No credit card required."}
            </p>

            {/* Tabs */}
            <div style={{display:"flex",background:"#010409",borderRadius:8,padding:3,marginBottom:22,border:"1px solid #21262d"}}>
              {(["login","signup"] as const).map(m=>(
                <motion.button key={m} whileTap={{scale:0.97}} className="tab-btn" onClick={()=>setMode(m)} style={{flex:1,padding:"8px 0",borderRadius:6,border:"none",background:mode===m?"#161b22":"transparent",color:mode===m?"#e6edf3":"#484f58",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:mono,letterSpacing:".07em",transition:"all .2s",boxShadow:mode===m?"0 1px 3px rgba(1,4,9,0.4)":"none"}}>
                  {m==="login"?"SIGN IN":"CREATE ACCOUNT"}
                </motion.button>
              ))}
            </div>

            {/* Email */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:"#8b949e",marginBottom:6,letterSpacing:".08em"}}>EMAIL</div>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" style={inputStyle}/>
            </div>

            {/* Password */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div style={{fontSize:10,color:"#8b949e",letterSpacing:".08em"}}>PASSWORD</div>
                {mode==="login"&&<span onClick={handleForgotPassword} style={{fontSize:10,color:"#58a6ff",cursor:"pointer"}}>{resetSent ? "✓ Reset email sent!" : "Forgot password?"}</span>}
              </div>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleSubmit()} style={inputStyle}/>
            </div>

            {/* Error */}
            <AnimatePresence>{error&&<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={{duration:0.2}} style={{overflow:"hidden",background:"rgba(248,81,73,0.1)",border:"1px solid rgba(248,81,73,0.3)",borderRadius:8,padding:"10px 14px",fontSize:11,color:"#f85149",marginBottom:16,lineHeight:1.5}}>{error}</motion.div>}</AnimatePresence>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading} className="abtn" style={{width:"100%",padding:"12px 0",background:loading?"#238636":"#2ea043",border:"1px solid rgba(63,185,80,0.3)",borderRadius:8,color:"#fff",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:mono,letterSpacing:".05em",marginBottom:14}}>
              {loading?"LOADING...":(mode==="login"?"SIGN IN →":"CREATE ACCOUNT →")}
            </button>

            {/* Divider */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{flex:1,height:"1px",background:"#21262d"}}/>
              <span style={{fontSize:9,color:"#484f58",letterSpacing:".1em"}}>OR</span>
              <div style={{flex:1,height:"1px",background:"#21262d"}}/>
            </div>

            {/* Google */}
            <button onClick={handleGoogle} className="gbtn" style={{width:"100%",padding:"11px 0",background:"transparent",border:"1px solid #30363d",borderRadius:8,color:"#8b949e",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:mono,letterSpacing:".04em",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:8}}>
              <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              CONTINUE WITH GOOGLE
            </button>

          </motion.div>

          {/* Switch + disclaimer */}
          <div style={{textAlign:"center",marginTop:16,fontSize:11,color:"#484f58"}}>
            {mode==="login"?"No account? ":"Already have one? "}
            <span onClick={()=>setMode(mode==="login"?"signup":"login")} style={{color:"#58a6ff",cursor:"pointer",fontWeight:600}}>
              {mode==="login"?"Sign up free":"Sign in"}
            </span>
          </div>
          <div style={{textAlign:"center",marginTop:10,fontSize:9,color:"#30363d",lineHeight:1.6}}>
            Educational signals only · Not financial advice
          </div>
        </div>
      </div>
    </div>
  );
}
