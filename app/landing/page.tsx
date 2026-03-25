"use client";
import { useState, useEffect, useRef } from "react";

const TICKERS = ["BTC/USD","ETH/USD","SOL/USD","NASDAQ","GOLD","AAPL","RELIANCE","TCS","NIFTY50","XRP/USD","EUR/USD","HDFC BANK"];
const DIRECTIONS = ["BUY","BUY","SELL","BUY","HOLD","BUY","BUY","BUY","BUY","SELL","HOLD","BUY"];
const PROBS = ["87%","71%","63%","78%","52%","81%","73%","82%","69%","61%","55%","70%"];

export default function Landing() {
  const [tick, setTick] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    const tickTimer = setInterval(() => setTick(p => p + 1), 2200);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(timer); clearInterval(tickTimer); window.removeEventListener("scroll", onScroll); };
  }, []);

  const dirColor = (d: string) => d === "BUY" ? "#22c55e" : d === "SELL" ? "#ef4444" : "#eab308";
  const dirBg   = (d: string) => d === "BUY" ? "rgba(34,197,94,0.1)" : d === "SELL" ? "rgba(239,68,68,0.1)" : "rgba(234,179,8,0.1)";

  // ── SPLINE SCENE URL ── swap this one line when you have the .splinecode URL
  const SPLINE_URL = "https://prod.spline.design/9951u9cumiw2Ehj8/scene.splinecode";

  return (
    <div style={{ minHeight:"100vh", background:"#060d06", color:"#e8f5e8", fontFamily:"'Sora', sans-serif", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#060d06;}
        ::-webkit-scrollbar-thumb{background:#1a3a1a;border-radius:2px;}

        .qs-nav-link{font-size:13px;font-weight:500;color:rgba(232,245,232,0.45);text-decoration:none;transition:color 0.2s;letter-spacing:0.01em;}
        .qs-nav-link:hover{color:#22c55e;}

        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .ticker-track{animation:ticker 35s linear infinite;display:flex;gap:40px;white-space:nowrap;}
        .ticker-track:hover{animation-play-state:paused;}

        @keyframes float-slow{0%,100%{transform:translateY(0px) rotate(0deg)}50%{transform:translateY(-12px) rotate(1deg)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:0.6}100%{transform:scale(1.8);opacity:0}}
        @keyframes glow-pulse{0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes slide-up{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fade-in{from{opacity:0}to{opacity:1}}
        @keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

        .hero-enter{opacity:0;transform:translateY(28px);}
        .hero-enter.visible{animation:slide-up 0.9s cubic-bezier(0.22,1,0.36,1) forwards;}
        .hero-enter.visible.d1{animation-delay:0.1s;}
        .hero-enter.visible.d2{animation-delay:0.25s;}
        .hero-enter.visible.d3{animation-delay:0.4s;}
        .hero-enter.visible.d4{animation-delay:0.55s;}

        .card-glow{transition:border-color 0.25s,transform 0.25s,box-shadow 0.25s;}
        .card-glow:hover{border-color:rgba(34,197,94,0.35)!important;transform:translateY(-3px);box-shadow:0 20px 60px rgba(34,197,94,0.08);}

        .btn-primary{transition:transform 0.2s,box-shadow 0.2s;}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(34,197,94,0.35);}
        .btn-ghost{transition:border-color 0.2s,color 0.2s,background 0.2s;}
        .btn-ghost:hover{border-color:rgba(34,197,94,0.5)!important;color:#22c55e!important;background:rgba(34,197,94,0.06)!important;}

        .signal-row{transition:background 0.3s,border-color 0.3s;}

        .spline-container{position:relative;width:100%;height:100%;}
        .spline-container iframe,.spline-container canvas{width:100%;height:100%;border:none;}

        .noise-overlay{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");opacity:0.4;pointer-events:none;}

        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;}
          .spline-col{height:300px!important;margin-top:32px;}
          .hero-title{font-size:38px!important;line-height:1.1!important;}
          .features-grid{grid-template-columns:1fr!important;}
          .proof-grid{grid-template-columns:1fr 1fr!important;}
          .pricing-grid{grid-template-columns:1fr!important;}
          .steps-grid{grid-template-columns:1fr!important;}
          .nav-links-wrap{display:none!important;}
          .footer-cols{flex-direction:column!important;gap:16px!important;text-align:center;}
          .section-inner{padding-left:20px!important;padding-right:20px!important;}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position:"fixed",top:0,width:"100%",zIndex:100,
        background: scrolled ? "rgba(6,13,6,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(34,197,94,0.08)" : "1px solid transparent",
        padding:"16px 40px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        transition:"background 0.3s,border-color 0.3s,backdrop-filter 0.3s",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{
            width:32,height:32,background:"#22c55e",borderRadius:8,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:15,fontWeight:800,color:"#060d06",letterSpacing:"-0.5px",
          }}>Q</div>
          <span style={{fontSize:15,fontWeight:700,color:"#fff",letterSpacing:"-0.3px"}}>
            Quant<span style={{color:"#22c55e"}}>Signal</span>
          </span>
        </div>

        <div className="nav-links-wrap" style={{display:"flex",alignItems:"center",gap:32}}>
          {[["Features","#features"],["Performance","/performance"],["Agents","/agents"],["Pricing","#pricing"]].map(([label,href])=>(
            <a key={label} href={href} className="qs-nav-link">{label}</a>
          ))}
        </div>

        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <a href="/auth" style={{fontSize:13,fontWeight:600,color:"rgba(232,245,232,0.6)",textDecoration:"none",padding:"8px 16px"}}>
            Sign in
          </a>
          <a href="/dashboard" className="btn-primary" style={{
            fontSize:13,fontWeight:700,color:"#060d06",
            background:"#22c55e",borderRadius:8,
            padding:"9px 20px",textDecoration:"none",letterSpacing:"0.01em",
          }}>
            Launch app →
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight:"100vh",position:"relative",overflow:"hidden",
        display:"flex",alignItems:"center",
        background:"linear-gradient(160deg, #060d06 0%, #081208 50%, #060d06 100%)",
        paddingTop:80,
      }}>
        {/* Background glow */}
        <div style={{position:"absolute",top:"20%",left:"5%",width:500,height:500,background:"radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"10%",right:"10%",width:400,height:400,background:"radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)",pointerEvents:"none"}}/>
        {/* Grid lines */}
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px),linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)",backgroundSize:"64px 64px",pointerEvents:"none"}}/>

        <div className="section-inner" style={{maxWidth:1200,margin:"0 auto",padding:"0 40px",width:"100%"}}>
          <div className="hero-grid" style={{display:"grid",gridTemplateColumns:"1fr 520px",gap:60,alignItems:"center"}}>

            {/* LEFT */}
            <div>
              <div className={`hero-enter ${heroVisible?"visible d1":""}`} style={{marginBottom:24}}>
                <div style={{
                  display:"inline-flex",alignItems:"center",gap:8,
                  background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",
                  borderRadius:100,padding:"6px 16px",
                }}>
                  <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:"#22c55e"}}/>
                    <div style={{position:"absolute",width:6,height:6,borderRadius:"50%",border:"1px solid #22c55e",animation:"pulse-ring 1.8s ease-out infinite"}}/>
                  </div>
                  <span style={{fontSize:11,fontWeight:600,color:"#22c55e",letterSpacing:"0.08em"}}>186 live signals · Updated every cycle</span>
                </div>
              </div>

              <h1 className={`hero-enter hero-title ${heroVisible?"visible d2":""}`} style={{
                fontSize:58,fontWeight:800,lineHeight:1.06,
                letterSpacing:"-1.5px",color:"#fff",marginBottom:20,
              }}>
                Trade with<br/>
                <span style={{color:"#22c55e"}}>real intelligence.</span>
              </h1>

              <p className={`hero-enter ${heroVisible?"visible d3":""}`} style={{
                fontSize:16,color:"rgba(232,245,232,0.5)",
                lineHeight:1.8,marginBottom:36,maxWidth:460,
                fontFamily:"'DM Mono', monospace",fontWeight:400,
              }}>
                AI-powered signals across crypto, stocks &amp; macro.
                ML ensemble + 9-factor confluence. Every signal shows its reasoning.
              </p>

              <div className={`hero-enter ${heroVisible?"visible d4":""}`} style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:48}}>
                <a href="/dashboard" className="btn-primary" style={{
                  display:"inline-flex",alignItems:"center",gap:8,
                  background:"#22c55e",color:"#060d06",
                  fontWeight:700,fontSize:14,
                  padding:"14px 28px",borderRadius:10,textDecoration:"none",
                }}>
                  View live signals
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#060d06" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="#features" className="btn-ghost" style={{
                  display:"inline-flex",alignItems:"center",gap:8,
                  border:"1px solid rgba(232,245,232,0.12)",
                  color:"rgba(232,245,232,0.55)",fontWeight:600,fontSize:14,
                  padding:"14px 28px",borderRadius:10,textDecoration:"none",background:"transparent",
                }}>
                  See how it works
                </a>
              </div>

              {/* Stats */}
              <div className={`hero-enter ${heroVisible?"visible d4":""}`} style={{display:"flex",gap:40}}>
                {[["186","Live assets"],["9","Confluence factors"],["2yr","Training window"]].map(([v,l])=>(
                  <div key={l}>
                    <div style={{fontSize:26,fontWeight:800,color:"#22c55e",letterSpacing:"-0.5px",fontFamily:"'Sora',sans-serif"}}>{v}</div>
                    <div style={{fontSize:11,color:"rgba(232,245,232,0.35)",marginTop:2,fontFamily:"'DM Mono',monospace"}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Spline 3D + floating signal card */}
            <div className="spline-col" style={{height:560,position:"relative"}}>
              {/* Spline embed */}
              <div style={{
                position:"absolute",inset:0,borderRadius:24,overflow:"hidden",
                border:"1px solid rgba(34,197,94,0.1)",
                background:"rgba(8,18,8,0.6)",
              }}>
                <iframe
                  src={`https://my.spline.design/untitled-VuVOAOhhSMCNSMmBCsyGfFhY/`}
                  style={{width:"100%",height:"100%",border:"none"}}
                  title="3D Scene"
                  loading="lazy"
                />
                {/* fallback gradient shown until spline loads */}
                <div style={{
                  position:"absolute",inset:0,
                  background:"radial-gradient(ellipse at 50% 40%, rgba(34,197,94,0.12) 0%, rgba(8,18,8,0.95) 70%)",
                  pointerEvents:"none",
                  animation:"glow-pulse 4s ease-in-out infinite",
                }}>
                  {/* Decorative rings */}
                  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:280,height:280,borderRadius:"50%",border:"1px solid rgba(34,197,94,0.08)"}}/>
                  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:380,height:380,borderRadius:"50%",border:"1px solid rgba(34,197,94,0.05)"}}/>
                  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:180,height:180,borderRadius:"50%",border:"1px solid rgba(34,197,94,0.12)"}}/>
                  {/* Center orb */}
                  <div style={{
                    position:"absolute",top:"50%",left:"50%",
                    transform:"translate(-50%,-50%)",
                    width:80,height:80,borderRadius:"50%",
                    background:"radial-gradient(circle, rgba(34,197,94,0.4) 0%, rgba(34,197,94,0.1) 60%, transparent 100%)",
                    animation:"glow-pulse 3s ease-in-out infinite",
                  }}/>
                  {/* Floating dots */}
                  {[[15,20],[80,65],[25,75],[70,30],[50,85],[90,50]].map(([x,y],i)=>(
                    <div key={i} style={{
                      position:"absolute",left:`${x}%`,top:`${y}%`,
                      width:4,height:4,borderRadius:"50%",background:"#22c55e",
                      animation:`glow-pulse ${2+i*0.3}s ease-in-out infinite`,
                      animationDelay:`${i*0.4}s`,
                    }}/>
                  ))}
                </div>
              </div>

              {/* Floating signal card — overlaid on spline */}
              <div style={{
                position:"absolute",bottom:24,left:24,right:24,
                background:"rgba(6,13,6,0.92)",
                border:"1px solid rgba(34,197,94,0.2)",
                borderRadius:16,padding:16,
                backdropFilter:"blur(20px)",
                animation:"float-slow 6s ease-in-out infinite",
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <span style={{fontSize:10,fontWeight:700,color:"rgba(232,245,232,0.35)",letterSpacing:"0.12em",fontFamily:"'DM Mono',monospace"}}>LIVE SIGNALS</span>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",animation:"glow-pulse 1.5s infinite"}}/>
                    <span style={{fontSize:9,color:"#22c55e",fontFamily:"'DM Mono',monospace",fontWeight:600}}>LIVE</span>
                  </div>
                </div>
                {TICKERS.slice(0,5).map((ticker,i)=>(
                  <div key={ticker} className="signal-row" style={{
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"6px 8px",borderRadius:7,marginBottom:3,
                    background: i===(tick%5) ? "rgba(34,197,94,0.06)" : "transparent",
                    border:`1px solid ${i===(tick%5) ? "rgba(34,197,94,0.15)" : "transparent"}`,
                  }}>
                    <span style={{fontSize:11,fontWeight:600,color: i===(tick%5) ? "#fff" : "rgba(232,245,232,0.45)",fontFamily:"'DM Mono',monospace"}}>{ticker}</span>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:9,color:"rgba(232,245,232,0.25)",fontFamily:"'DM Mono',monospace"}}>{PROBS[i]}</span>
                      <span style={{fontSize:9,fontWeight:700,color:dirColor(DIRECTIONS[i]),background:dirBg(DIRECTIONS[i]),padding:"2px 7px",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>{DIRECTIONS[i]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER TAPE ── */}
      <div style={{
        borderTop:"1px solid rgba(34,197,94,0.08)",
        borderBottom:"1px solid rgba(34,197,94,0.08)",
        padding:"12px 0",overflow:"hidden",
        background:"rgba(34,197,94,0.02)",
      }}>
        <div className="ticker-track">
          {[...TICKERS,...TICKERS,...TICKERS,...TICKERS].map((t,i)=>(
            <span key={i} style={{fontSize:11,fontWeight:600,color:dirColor(DIRECTIONS[i%12]),letterSpacing:"0.06em",fontFamily:"'DM Mono',monospace"}}>
              {t}&nbsp;&nbsp;{DIRECTIONS[i%12]}&nbsp;&nbsp;{PROBS[i%12]}
              <span style={{color:"rgba(34,197,94,0.15)",marginLeft:40}}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── TRUSTED BY ── */}
      <div style={{padding:"40px 40px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:11,color:"rgba(232,245,232,0.25)",letterSpacing:"0.12em",fontFamily:"'DM Mono',monospace",marginBottom:24}}>BUILT WITH</p>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:40,flexWrap:"wrap"}}>
            {["XGBoost","LightGBM","Groq AI","Supabase","Railway","Vercel"].map(name=>(
              <span key={name} style={{fontSize:13,fontWeight:600,color:"rgba(232,245,232,0.2)",letterSpacing:"0.02em"}}>{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{padding:"100px 40px"}}>
        <div className="section-inner" style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:64}}>
            <div style={{fontSize:11,fontWeight:700,color:"#22c55e",letterSpacing:"0.15em",fontFamily:"'DM Mono',monospace",marginBottom:14}}>WHAT MAKES IT DIFFERENT</div>
            <h2 style={{fontSize:42,fontWeight:800,letterSpacing:"-1px",color:"#fff",lineHeight:1.1}}>
              Not just signals.<br/>
              <span style={{color:"rgba(232,245,232,0.25)"}}>Signals with receipts.</span>
            </h2>
          </div>

          <div className="features-grid" style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:14}}>
            {[
              {icon:"M","title":"ML Ensemble","desc":"XGBoost + LightGBM trained on 180 days of OHLCV. Walk-forward validated. No curve-fitting.","accent":"#22c55e"},
              {icon:"9","title":"9-Factor Confluence","desc":"RSI, MACD, Bollinger, Stochastic, Volume, SMA Cross, 52W, Momentum — all scored together.","accent":"#3b82f6"},
              {icon:"⏪","title":"Historical Replay","desc":"Pick any date in the last 175 days and see exactly what the model would have fired.","accent":"#eab308"},
              {icon:"S","title":"Trade Guardian","desc":"Enter your position. Get worst-case loss, recommended size, and AI verdict instantly.","accent":"#ef4444"},
              {icon:"L","title":"Liquidity Levels","desc":"Live OI, funding rates, L/S ratio and liquidation clusters from OKX. Every 30 seconds.","accent":"#a855f7"},
              {icon:"P","title":"Portfolio Lab","desc":"Black-Litterman optimization using ML signal probabilities. Stress test 3 crash scenarios.","accent":"#22c55e"},
            ].map((f)=>(
              <div key={f.title} className="card-glow" style={{
                background:"rgba(255,255,255,0.02)",
                border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:16,padding:"28px 24px",
              }}>
                <div style={{
                  width:40,height:40,borderRadius:10,
                  background:`rgba(${f.accent==="#22c55e"?"34,197,94":f.accent==="#3b82f6"?"59,130,246":f.accent==="#eab308"?"234,179,8":f.accent==="#ef4444"?"239,68,68":f.accent==="#a855f7"?"168,85,247":"34,197,94"}, 0.1)`,
                  border:`1px solid ${f.accent}22`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:14,fontWeight:800,color:f.accent,
                  marginBottom:16,fontFamily:"'DM Mono',monospace",
                }}>{f.icon}</div>
                <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:8}}>{f.title}</div>
                <div style={{fontSize:12,color:"rgba(232,245,232,0.38)",lineHeight:1.75}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF ── */}
      <section id="proof" style={{
        padding:"100px 40px",
        background:"rgba(34,197,94,0.02)",
        borderTop:"1px solid rgba(34,197,94,0.07)",
        borderBottom:"1px solid rgba(34,197,94,0.07)",
      }}>
        <div className="section-inner" style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <div style={{fontSize:11,fontWeight:700,color:"#22c55e",letterSpacing:"0.15em",fontFamily:"'DM Mono',monospace",marginBottom:14}}>THE PROOF</div>
            <h2 style={{fontSize:42,fontWeight:800,letterSpacing:"-1px",color:"#fff"}}>Every claim is verifiable.</h2>
          </div>
          <div className="proof-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {[
              {val:"22%",label:"Win Rate",sub:"300 backtested signals"},
              {val:"2.57",label:"Sharpe Ratio",sub:"across all asset classes"},
              {val:"2:1",label:"Risk/Reward",sub:"ATR-based targets"},
              {val:"186",label:"Live Assets",sub:"crypto, stocks, forex"},
            ].map(s=>(
              <div key={s.label} style={{
                textAlign:"center",padding:"36px 16px",
                background:"rgba(255,255,255,0.02)",
                border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:16,
              }}>
                <div style={{fontSize:46,fontWeight:800,color:"#22c55e",letterSpacing:"-1px",marginBottom:6}}>{s.val}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:4}}>{s.label}</div>
                <div style={{fontSize:10,color:"rgba(232,245,232,0.3)",fontFamily:"'DM Mono',monospace"}}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{padding:"100px 40px"}}>
        <div className="section-inner" style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <div style={{fontSize:11,fontWeight:700,color:"#22c55e",letterSpacing:"0.15em",fontFamily:"'DM Mono',monospace",marginBottom:14}}>GET STARTED</div>
            <h2 style={{fontSize:42,fontWeight:800,letterSpacing:"-1px",color:"#fff"}}>
              Your financial partner<br/>in 3 easy steps.
            </h2>
          </div>
          <div className="steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {[
              {num:"01",title:"Create your account",desc:"Sign up free. No credit card. Access 186 live signals across crypto, stocks and macro instantly."},
              {num:"02",title:"Set your strategy",desc:"Configure your risk profile. Let an AI agent trade for you, or follow signals manually."},
              {num:"03",title:"Track your edge",desc:"Monitor your virtual portfolio, win rate and P&L. Every trade tracked with full reasoning."},
            ].map(s=>(
              <div key={s.num} className="card-glow" style={{
                background:"rgba(255,255,255,0.02)",
                border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:16,padding:"32px 24px",
              }}>
                <div style={{fontSize:36,fontWeight:800,color:"rgba(34,197,94,0.25)",marginBottom:16,fontFamily:"'DM Mono',monospace"}}>{s.num}</div>
                <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:10}}>{s.title}</div>
                <div style={{fontSize:12,color:"rgba(232,245,232,0.38)",lineHeight:1.75}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{
        padding:"100px 40px",
        background:"rgba(34,197,94,0.02)",
        borderTop:"1px solid rgba(34,197,94,0.07)",
      }}>
        <div className="section-inner" style={{maxWidth:760,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <div style={{fontSize:11,fontWeight:700,color:"#22c55e",letterSpacing:"0.15em",fontFamily:"'DM Mono',monospace",marginBottom:14}}>PRICING</div>
            <h2 style={{fontSize:42,fontWeight:800,letterSpacing:"-1px",color:"#fff"}}>Simple. No tricks.</h2>
          </div>
          <div className="pricing-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {/* Free */}
            <div style={{
              background:"rgba(255,255,255,0.02)",
              border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:20,padding:36,
            }}>
              <div style={{fontSize:11,fontWeight:700,color:"rgba(232,245,232,0.4)",letterSpacing:"0.12em",fontFamily:"'DM Mono',monospace",marginBottom:20}}>FREE</div>
              <div style={{fontSize:44,fontWeight:800,color:"#fff",letterSpacing:"-1px",marginBottom:4}}>₹0</div>
              <div style={{fontSize:12,color:"rgba(232,245,232,0.3)",marginBottom:32,fontFamily:"'DM Mono',monospace"}}>forever</div>
              {["186 live signals","Direction + confidence","News feed","Economic calendar","Perseus AI chat"].map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="9" height="9" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="rgba(232,245,232,0.4)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{fontSize:13,color:"rgba(232,245,232,0.45)"}}>{f}</span>
                </div>
              ))}
              <a href="/dashboard" className="btn-ghost" style={{
                display:"block",textAlign:"center",marginTop:32,padding:"13px",
                border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,
                fontSize:13,fontWeight:700,color:"rgba(232,245,232,0.5)",
                textDecoration:"none",background:"transparent",
              }}>Start free</a>
            </div>

            {/* Pro */}
            <div style={{
              background:"rgba(34,197,94,0.04)",
              border:"1px solid rgba(34,197,94,0.25)",
              borderRadius:20,padding:36,position:"relative",
              boxShadow:"0 0 60px rgba(34,197,94,0.06)",
            }}>
              <div style={{
                position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",
                background:"#22c55e",color:"#060d06",
                fontSize:9,fontWeight:800,padding:"4px 16px",borderRadius:100,
                letterSpacing:"0.1em",fontFamily:"'DM Mono',monospace",
              }}>MOST POPULAR</div>
              <div style={{fontSize:11,fontWeight:700,color:"#22c55e",letterSpacing:"0.12em",fontFamily:"'DM Mono',monospace",marginBottom:20}}>PRO</div>
              <div style={{fontSize:44,fontWeight:800,color:"#fff",letterSpacing:"-1px",marginBottom:4}}>₹999</div>
              <div style={{fontSize:12,color:"rgba(232,245,232,0.3)",marginBottom:32,fontFamily:"'DM Mono',monospace"}}>per month · 7-day free trial</div>
              {["Everything in Free","Historical Replay + AI analysis","Trade Guardian risk check","Liquidity Levels (live OI)","Portfolio Lab optimizer","Signal reasoning + Kelly sizing"].map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:"rgba(34,197,94,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="9" height="9" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#22c55e" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{fontSize:13,color:"rgba(232,245,232,0.7)"}}>{f}</span>
                </div>
              ))}
              <a href="/dashboard" className="btn-primary" style={{
                display:"block",textAlign:"center",marginTop:32,padding:"13px",
                background:"#22c55e",borderRadius:10,
                fontSize:13,fontWeight:700,color:"#060d06",textDecoration:"none",
              }}>Start 7-day trial →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding:"100px 40px",textAlign:"center",
        borderTop:"1px solid rgba(255,255,255,0.04)",
        position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:300,background:"radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <h2 style={{fontSize:48,fontWeight:800,letterSpacing:"-1.5px",color:"#fff",marginBottom:16,lineHeight:1.05}}>
            Ready to trade with<br/>
            <span style={{color:"#22c55e"}}>actual edge?</span>
          </h2>
          <p style={{fontSize:15,color:"rgba(232,245,232,0.4)",marginBottom:36,fontFamily:"'DM Mono',monospace"}}>
            No credit card required · 186 live signals · Start in 10 seconds
          </p>
          <a href="/dashboard" className="btn-primary" style={{
            display:"inline-flex",alignItems:"center",gap:10,
            background:"#22c55e",color:"#060d06",
            fontWeight:700,fontSize:15,
            padding:"16px 36px",borderRadius:12,textDecoration:"none",
          }}>
            Launch QuantSignal free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#060d06" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"28px 40px"}}>
        <div className="footer-cols" style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:24,height:24,background:"#22c55e",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#060d06"}}>Q</div>
            <span style={{fontSize:13,fontWeight:700,color:"rgba(232,245,232,0.35)"}}>QuantSignal</span>
          </div>
          <div style={{display:"flex",gap:28}}>
            {[["Dashboard","/dashboard"],["Guardian","/guardian"],["Portfolio","/portfolio"],["Agents","/agents"]].map(([l,h])=>(
              <a key={l} href={h} style={{fontSize:12,color:"rgba(232,245,232,0.2)",textDecoration:"none"}}>{l}</a>
            ))}
          </div>
          <div style={{fontSize:12,color:"rgba(232,245,232,0.2)",fontFamily:"'DM Mono',monospace"}}>© 2026 QuantSignal</div>
        </div>
      </footer>
    </div>
  );
}
