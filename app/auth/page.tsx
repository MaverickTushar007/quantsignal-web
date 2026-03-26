"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

const SIGNALS = [
  { symbol:"RELIANCE", dir:"BUY",  prob:87, price:"₹2,847"  },
  { symbol:"BTC/USD",  dir:"BUY",  prob:81, price:"$67,420" },
  { symbol:"TCS",      dir:"HOLD", prob:63, price:"₹3,921"  },
  { symbol:"NIFTY50",  dir:"BUY",  prob:78, price:"₹24,132" },
  { symbol:"AAPL",     dir:"SELL", prob:71, price:"$189.40" },
];

export default function AuthPage() {
  const [mode, setMode]       = useState<"login"|"signup">("login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [tick, setTick]       = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const mono = "'DM Mono', monospace";

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 2000);
    const check = () => setIsMobile(window.innerWidth < 768);
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

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: window.location.origin+"/onboarding" } });
  }

  const dc = (d: string) => d==="BUY"?"#4ade80":d==="SELL"?"#f87171":"#fbbf24";
  const db = (d: string) => d==="BUY"?"rgba(74,222,128,0.12)":d==="SELL"?"rgba(248,113,113,0.12)":"rgba(251,191,36,0.12)";

  const input: React.CSSProperties = {
    width:"100%", background:"rgba(255,255,255,0.04)",
    border:"1px solid rgba(255,255,255,0.09)", borderRadius:8,
    padding:"12px 14px", color:"#f0fdf4", fontSize:13, outline:"none",
    fontFamily: mono, boxSizing:"border-box", transition:"border-color 0.2s",
  };

  return (
    <div style={{minHeight:"100dvh", background:"#050c05", display:"flex", fontFamily:mono, overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes pr{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.2);opacity:0}}
        @keyframes gp{0%,100%{opacity:.35}50%{opacity:.8}}
        @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        input:focus{border-color:rgba(74,222,128,0.4)!important;background:rgba(74,222,128,0.04)!important;}
        .auth-btn{transition:transform .18s,box-shadow .18s,opacity .18s;}
        .auth-btn:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(74,222,128,0.22);}
        .auth-btn:active{transform:translateY(0);}
        .ghost-btn{transition:border-color .18s,color .18s,background .18s;}
        .ghost-btn:hover{border-color:rgba(74,222,128,0.3)!important;color:rgba(226,240,226,0.7)!important;background:rgba(74,222,128,0.04)!important;}
      `}</style>

      {/* LEFT PANEL — hidden on mobile */}
      {!isMobile && (
        <div style={{flex:1, position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 56px", background:"#060e06", borderRight:"1px solid rgba(74,222,128,0.08)"}}>
          {/* Grid */}
          <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(74,222,128,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.025) 1px,transparent 1px)",backgroundSize:"64px 64px",pointerEvents:"none"}}/>
          {/* Glow */}
          <div style={{position:"absolute",top:"20%",left:"10%",width:480,height:480,background:"radial-gradient(circle,rgba(74,222,128,0.07) 0%,transparent 65%)",pointerEvents:"none"}}/>

          {/* Logo */}
          <div style={{position:"relative",zIndex:1,marginBottom:52}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <div style={{width:32,height:32,background:"#16a34a",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#f0fdf4",fontFamily:"Sora,sans-serif"}}>Q</div>
              <span style={{fontSize:15,fontWeight:700,color:"#f0fdf4",fontFamily:"Sora,sans-serif",letterSpacing:"-.3px"}}>Quant<span style={{color:"#4ade80"}}>Signal</span></span>
            </div>
            <p style={{fontSize:13,color:"rgba(226,240,226,0.38)",lineHeight:1.7,maxWidth:320}}>
              ML-powered trading signals for Indian &amp; global markets. Every signal shows its reasoning.
            </p>
          </div>

          {/* Stats row */}
          <div style={{position:"relative",zIndex:1,display:"flex",gap:28,marginBottom:36}}>
            {[["118","Live signals"],["94.2%","Accuracy"],["₹0","To start"]].map(([v,l])=>(
              <div key={l}>
                <div style={{fontSize:26,fontWeight:800,color:"#4ade80",letterSpacing:"-.5px",fontFamily:"Sora,sans-serif"}}>{v}</div>
                <div style={{fontSize:10,color:"rgba(226,240,226,0.3)",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Mini dashboard mockup */}
          <div style={{position:"relative",zIndex:1,animation:"fl 6s ease-in-out infinite"}}>
            <div style={{position:"absolute",inset:-1,borderRadius:16,background:"linear-gradient(135deg,rgba(74,222,128,0.18),rgba(74,222,128,0.04),rgba(74,222,128,0.1))",zIndex:0}}/>
            <div style={{position:"relative",zIndex:1,borderRadius:14,overflow:"hidden",background:"#0a140a",boxShadow:"0 24px 64px rgba(0,0,0,0.5)"}}>
              {/* bar */}
              <div style={{padding:"10px 14px",borderBottom:"1px solid rgba(74,222,128,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(74,222,128,0.02)"}}>
                <div style={{display:"flex",gap:5}}>{[.14,.08,.05].map((o,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:`rgba(255,255,255,${o})`}}/>)}</div>
                <div style={{fontSize:9,color:"rgba(226,240,226,0.2)"}}>quantsignal.app/dashboard</div>
                <div style={{display:"flex",alignItems:"center",gap:4,fontSize:8,color:"#4ade80",fontWeight:600}}>
                  <span style={{width:4,height:4,borderRadius:"50%",background:"#4ade80",display:"inline-block",boxShadow:"0 0 4px #4ade80"}}/>LIVE
                </div>
              </div>
              {/* col heads */}
              <div style={{padding:"7px 12px 3px",display:"flex",justifyContent:"space-between",fontSize:7,color:"rgba(226,240,226,0.18)",letterSpacing:".1em"}}>
                <span>ASSET</span><span>SIGNAL</span><span>CONF.</span>
              </div>
              {/* rows */}
              {SIGNALS.map((row,i)=>(
                <div key={row.symbol} style={{padding:"8px 12px",borderBottom:"1px solid rgba(74,222,128,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between",background:i===tick%5?"rgba(74,222,128,0.05)":"transparent",borderLeft:i===tick%5?"2px solid #4ade80":"2px solid transparent",transition:"all 0.4s"}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:i===tick%5?"#4ade80":"#e2f0e2"}}>{row.symbol}</div>
                    <div style={{fontSize:8,color:"rgba(226,240,226,0.25)",marginTop:1}}>{row.price}</div>
                  </div>
                  <div style={{padding:"2px 8px",borderRadius:4,fontSize:9,fontWeight:700,background:db(row.dir),color:dc(row.dir)}}>{row.dir}</div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#e2f0e2"}}>{row.prob}%</div>
                    <div style={{width:44,height:2,borderRadius:2,background:"rgba(255,255,255,0.07)",marginTop:3}}>
                      <div style={{width:`${row.prob}%`,height:"100%",borderRadius:2,background:dc(row.dir),transition:"width 0.4s"}}/>
                    </div>
                  </div>
                </div>
              ))}
              {/* AI reasoning */}
              <div style={{margin:"8px 12px 10px",padding:"8px 10px",borderRadius:8,background:"rgba(74,222,128,0.04)",border:"1px solid rgba(74,222,128,0.1)"}}>
                <div style={{fontSize:8,color:"#4ade80",fontWeight:700,letterSpacing:".1em",marginBottom:4}}>🤖 AI REASONING</div>
                <div style={{fontSize:10,color:"rgba(226,240,226,0.38)",lineHeight:1.7}}>RSI divergence + MACD crossover confirms bullish momentum. Kelly sizing: 5.9% of capital...</div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div style={{position:"relative",zIndex:1,marginTop:32,padding:"16px 20px",borderRadius:12,background:"rgba(74,222,128,0.04)",border:"1px solid rgba(74,222,128,0.1)"}}>
            <div style={{fontSize:12,color:"rgba(226,240,226,0.5)",lineHeight:1.7,marginBottom:10}}>
              "Finally a signal platform that explains its reasoning. Changed how I approach every trade."
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#4ade80,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#050c05"}}>A</div>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"#e2f0e2"}}>Arjun M.</div>
                <div style={{fontSize:9,color:"rgba(226,240,226,0.3)"}}>Retail trader, Mumbai</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT PANEL — auth form */}
      <div style={{width:isMobile?"100%":480, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:isMobile?"24px 20px":"48px 40px", position:"relative", background:"#050c05"}}>
        {/* subtle glow */}
        <div style={{position:"absolute",top:0,right:0,width:300,height:300,background:"radial-gradient(circle,rgba(74,222,128,0.04) 0%,transparent 70%)",pointerEvents:"none"}}/>

        <div style={{width:"100%",maxWidth:360,position:"relative",zIndex:1}}>
          {/* Mobile logo only */}
          {isMobile && (
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:32}}>
              <div style={{width:28,height:28,background:"#16a34a",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#f0fdf4",fontFamily:"Sora,sans-serif"}}>Q</div>
              <span style={{fontSize:14,fontWeight:700,color:"#f0fdf4",fontFamily:"Sora,sans-serif",letterSpacing:"-.3px"}}>Quant<span style={{color:"#4ade80"}}>Signal</span></span>
            </div>
          )}

          <h2 style={{fontSize:24,fontWeight:800,color:"#f0fdf4",fontFamily:"Sora,sans-serif",letterSpacing:"-.5px",marginBottom:6}}>
            {mode==="login"?"Welcome back":"Create your account"}
          </h2>
          <p style={{fontSize:12,color:"rgba(226,240,226,0.35)",marginBottom:28,lineHeight:1.6}}>
            {mode==="login"?"Sign in to access your signals and portfolio.":"Free forever. No credit card required."}
          </p>

          {/* Tab toggle */}
          <div style={{display:"flex",background:"rgba(255,255,255,0.03)",borderRadius:8,padding:3,marginBottom:26,border:"1px solid rgba(255,255,255,0.06)"}}>
            {(["login","signup"] as const).map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"9px 0",borderRadius:6,border:"none",background:mode===m?"rgba(74,222,128,0.1)":"transparent",color:mode===m?"#4ade80":"rgba(255,255,255,0.28)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:mono,letterSpacing:".08em",transition:"all .15s"}}>
                {m==="login"?"SIGN IN":"CREATE ACCOUNT"}
              </button>
            ))}
          </div>

          {/* Email */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,color:"rgba(226,240,226,0.3)",marginBottom:6,letterSpacing:".12em"}}>EMAIL</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" style={input}/>
          </div>

          {/* Password */}
          <div style={{marginBottom:22}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div style={{fontSize:10,color:"rgba(226,240,226,0.3)",letterSpacing:".12em"}}>PASSWORD</div>
              {mode==="login" && <span style={{fontSize:10,color:"rgba(74,222,128,0.6)",cursor:"pointer"}}>Forgot?</span>}
            </div>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleSubmit()} style={input}/>
          </div>

          {/* Error */}
          {error && (
            <div style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:8,padding:"10px 14px",fontSize:11,color:"#f87171",marginBottom:16,lineHeight:1.5}}>{error}</div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading} className="auth-btn" style={{width:"100%",padding:"13px 0",background:loading?"rgba(74,222,128,0.3)":"#4ade80",border:"none",borderRadius:10,color:"#050c05",fontSize:13,fontWeight:800,cursor:loading?"not-allowed":"pointer",fontFamily:mono,letterSpacing:".06em",marginBottom:16}}>
            {loading?"LOADING...":(mode==="login"?"SIGN IN →":"CREATE ACCOUNT →")}
          </button>

          {/* Divider */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{flex:1,height:1,background:"rgba(255,255,255,0.06)"}}/>
            <span style={{fontSize:9,color:"rgba(255,255,255,0.18)",letterSpacing:".1em"}}>OR</span>
            <div style={{flex:1,height:1,background:"rgba(255,255,255,0.06)"}}/>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} className="ghost-btn" style={{width:"100%",padding:"12px 0",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,color:"rgba(226,240,226,0.6)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:mono,letterSpacing:".04em",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:10}}>
            <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            CONTINUE WITH GOOGLE
          </button>

          {/* Guest */}
          <button onClick={()=>router.push("/dashboard")} className="ghost-btn" style={{width:"100%",padding:"11px 0",background:"transparent",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,color:"rgba(226,240,226,0.28)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:mono,letterSpacing:".04em",marginBottom:4}}>
            CONTINUE AS GUEST →
          </button>

          {/* Switch mode */}
          <div style={{textAlign:"center",marginTop:20,fontSize:11,color:"rgba(226,240,226,0.22)"}}>
            {mode==="login"?"No account? ":"Already have one? "}
            <span onClick={()=>setMode(mode==="login"?"signup":"login")} style={{color:"#4ade80",cursor:"pointer",fontWeight:600}}>
              {mode==="login"?"Sign up free":"Sign in"}
            </span>
          </div>

          <div style={{textAlign:"center",marginTop:16,fontSize:9,color:"rgba(226,240,226,0.12)",lineHeight:1.6}}>
            Educational signals only · Not financial advice
          </div>
        </div>
      </div>
    </div>
  );
}
