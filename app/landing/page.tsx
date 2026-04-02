"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TICKERS = ["BTC/USD","ETH/USD","SOL/USD","NASDAQ","GOLD","AAPL","RELIANCE","TCS","NIFTY50","XRP/USD","EUR/USD","HDFC BANK"];
const DIRECTIONS = ["BUY","BUY","SELL","BUY","HOLD","BUY","BUY","BUY","BUY","SELL","HOLD","BUY"];
const PROBS = ["87%","71%","63%","78%","52%","81%","73%","82%","69%","61%","55%","70%"];
const SIGNALS = [
  { symbol:"RELIANCE", dir:"BUY",  prob:87, price:"₹2,847",  active:true  },
  { symbol:"BTC/USD",  dir:"BUY",  prob:81, price:"$67,420", active:false },
  { symbol:"TCS",      dir:"HOLD", prob:63, price:"₹3,921",  active:false },
  { symbol:"NIFTY50",  dir:"BUY",  prob:78, price:"₹24,132", active:false },
  { symbol:"AAPL",     dir:"SELL", prob:71, price:"$189.40", active:false },
];

export default function Landing() {
  const [tick, setTick]           = useState(0);
  const [scrolled, setScrolled]   = useState(false);
  const [vis, setVis]             = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVis(true), 100);
    const t2 = setInterval(() => setTick(p => p + 1), 2200);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(t1); clearInterval(t2); window.removeEventListener("scroll", onScroll); };
  }, []);

  const dc = (d: string) => d === "BUY" ? "#4ade80" : d === "SELL" ? "#f87171" : "#fbbf24";
  const db = (d: string) => d === "BUY" ? "rgba(74,222,128,0.1)" : d === "SELL" ? "rgba(248,113,113,0.1)" : "rgba(251,191,36,0.1)";

  return (
    <div style={{minHeight:"100vh",background:"#050c05",color:"#e2f0e2",fontFamily:"Sora,sans-serif",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#1a2e1a;border-radius:2px;}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .tk{animation:ticker 40s linear infinite;display:flex;gap:40px;white-space:nowrap;}
        .tk:hover{animation-play-state:paused;}
        @keyframes pr{0%{transform:scale(1);opacity:.7}100%{transform:scale(2);opacity:0}}
        @keyframes gp{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes su{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        .na{font-size:13px;font-weight:500;color:rgba(226,240,226,.38);text-decoration:none;transition:color .2s;}
        .na:hover{color:#4ade80;}
        .bp{transition:transform .18s,box-shadow .18s,background .18s;}
        .bp:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(74,222,128,.25);background:#22c55e!important;}
        .bg{transition:border-color .18s,color .18s,background .18s;}
        .bg:hover{border-color:rgba(74,222,128,.4)!important;color:#4ade80!important;background:rgba(74,222,128,.05)!important;}
        .ch{transition:border-color .22s,transform .22s,box-shadow .22s;}
        .ch:hover{border-color:rgba(74,222,128,.25)!important;transform:translateY(-3px);box-shadow:0 14px 44px rgba(74,222,128,.07);}
        @media(max-width:768px){
          .hg{grid-template-columns:1fr!important;}
          .ht{font-size:40px!important;letter-spacing:-1.5px!important;}
          .fg{grid-template-columns:1fr!important;}
          .pg{grid-template-columns:1fr!important;}
          .sg{grid-template-columns:1fr!important;}
          .nl{display:none!important;}.st{grid-template-columns:repeat(2,1fr)!important;}.sec{padding-left:20px!important;padding-right:20px!important;}
          .fi{flex-direction:column!important;gap:16px!important;text-align:center;}
        }
      `}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,width:"100%",zIndex:100,height:58,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",background:scrolled?"rgba(5,12,5,.94)":"transparent",backdropFilter:scrolled?"blur(24px)":"none",borderBottom:scrolled?"1px solid rgba(74,222,128,.07)":"1px solid transparent",transition:"all .3s"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:28,height:28,background:"#16a34a",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#f0fdf4"}}>Q</div>
          <span style={{fontSize:14,fontWeight:700,color:"#f0fdf4",letterSpacing:"-.3px"}}>Quant<span style={{color:"#4ade80"}}>Signal</span></span>
        </div>
        <div className="nl" style={{display:"flex",gap:28}}>
          {[["Features","#features"],["Proof","#proof"],["Pricing","#pricing"]].map(([l,h])=>(
            <a key={l} href={h} className="na">{l}</a>
          ))}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <a href="/auth" style={{fontSize:13,fontWeight:500,color:"rgba(226,240,226,.4)",textDecoration:"none",padding:"8px 14px"}}>Sign in</a>
          <a href="/dashboard" className="bp" style={{fontSize:13,fontWeight:700,color:"#050c05",background:"#4ade80",borderRadius:8,padding:"9px 20px",textDecoration:"none"}}>Launch app →</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",paddingTop:58,background:"#050c05"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(74,222,128,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,.022) 1px,transparent 1px)",backgroundSize:"72px 72px",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"15%",left:"0",width:640,height:640,background:"radial-gradient(circle,rgba(74,222,128,.055) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"5%",right:"5%",width:420,height:420,background:"radial-gradient(circle,rgba(74,222,128,.035) 0%,transparent 65%)",pointerEvents:"none"}}/>

        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 40px",width:"100%"}}>
          <div className="hg" style={{display:"grid",gridTemplateColumns:"1fr 490px",gap:72,alignItems:"center"}}>

            {/* LEFT */}
            <div>
              <div style={{marginBottom:28,opacity:vis?1:0,animation:vis?"su .8s cubic-bezier(.22,1,.36,1) .05s forwards":"none"}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(74,222,128,.07)",border:"1px solid rgba(74,222,128,.18)",borderRadius:100,padding:"5px 14px"}}>
                  <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:"#4ade80"}}/>
                    <div style={{position:"absolute",width:6,height:6,borderRadius:"50%",border:"1px solid #4ade80",animation:"pr 2s ease-out infinite"}}/>
                  </div>
                  <span style={{fontSize:11,fontWeight:600,color:"#4ade80",letterSpacing:".07em",fontFamily:"DM Mono,monospace"}}>186 live signals · Updated every cycle</span>
                </div>
              </div>

              <h1 className="ht" style={{fontSize:66,fontWeight:900,lineHeight:1.0,letterSpacing:"-2.5px",color:"#f0fdf4",marginBottom:6,opacity:vis?1:0,animation:vis?"su .85s cubic-bezier(.22,1,.36,1) .18s forwards":"none"}}>The trading signal</h1>
              <h1 className="ht" style={{fontSize:66,fontWeight:900,lineHeight:1.0,letterSpacing:"-2.5px",color:"#4ade80",marginBottom:26,opacity:vis?1:0,animation:vis?"su .85s cubic-bezier(.22,1,.36,1) .26s forwards":"none"}}>that shows its work.</h1>

              <p style={{fontSize:15,color:"rgba(226,240,226,.42)",lineHeight:1.85,marginBottom:34,maxWidth:430,fontFamily:"DM Mono,monospace",opacity:vis?1:0,animation:vis?"su .85s cubic-bezier(.22,1,.36,1) .34s forwards":"none"}}>
                AI-powered signals across crypto, stocks &amp; macro. ML ensemble + 9-factor confluence. Every signal shows its reasoning. Not a black box. Never.
              </p>

              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:50,opacity:vis?1:0,animation:vis?"su .85s cubic-bezier(.22,1,.36,1) .42s forwards":"none"}}>
                <a href="/dashboard" className="bp" style={{display:"inline-flex",alignItems:"center",gap:8,background:"#4ade80",color:"#050c05",fontWeight:700,fontSize:14,padding:"13px 28px",borderRadius:10,textDecoration:"none"}}>
                  View live signals
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#050c05" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="#features" className="bg" style={{display:"inline-flex",alignItems:"center",gap:8,border:"1px solid rgba(226,240,226,.1)",color:"rgba(226,240,226,.42)",fontWeight:600,fontSize:14,padding:"13px 28px",borderRadius:10,textDecoration:"none",background:"transparent"}}>See the proof</a>
              </div>

              <div style={{display:"flex",gap:44,opacity:vis?1:0,animation:vis?"su .85s cubic-bezier(.22,1,.36,1) .5s forwards":"none"}}>
                {[["133","Live Assets"],["9","Confluence Factors"],["47","ML Features"]].map(([v,l])=>(
                  <div key={l}>
                    <div style={{fontSize:28,fontWeight:800,color:"#4ade80",letterSpacing:"-.5px"}}>{v}</div>
                    <div style={{fontSize:11,color:"rgba(226,240,226,.28)",marginTop:3,fontFamily:"DM Mono,monospace"}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — dashboard mockup */}
            <div style={{position:"relative",opacity:vis?1:0,animation:vis?"su 1s cubic-bezier(.22,1,.36,1) .2s forwards":"none"}}>
              <div style={{position:"absolute",inset:-1,borderRadius:20,background:"linear-gradient(135deg,rgba(74,222,128,.2),rgba(74,222,128,.04),rgba(74,222,128,.1))",zIndex:0}}/>
              <div style={{position:"relative",zIndex:1,borderRadius:18,overflow:"hidden",background:"#0a140a",boxShadow:"0 32px 80px rgba(0,0,0,.6)",animation:"fl 7s ease-in-out infinite"}}>

                {/* browser bar */}
                <div style={{padding:"11px 16px",borderBottom:"1px solid rgba(74,222,128,.08)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(74,222,128,.02)"}}>
                  <div style={{display:"flex",gap:5}}>{[.14,.08,.05].map((o,i)=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:`rgba(255,255,255,${o})`}}/>)}</div>
                  <div style={{fontSize:10,color:"rgba(226,240,226,.22)",fontFamily:"monospace"}}>quantsignal.app/dashboard</div>
                  <div style={{display:"flex",alignItems:"center",gap:5,fontSize:9,color:"#4ade80",fontFamily:"DM Mono,monospace",fontWeight:600}}>
                    <span style={{width:5,height:5,borderRadius:"50%",background:"#4ade80",display:"inline-block",boxShadow:"0 0 5px #4ade80"}}/>LIVE
                  </div>
                </div>

                {/* stats */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",borderBottom:"1px solid rgba(74,222,128,.06)"}}>
                  {[["SIGNALS","133","#4ade80"],["CONFLUENCE","9-FACTOR","#4ade80"],["COVERAGE","133","#e2f0e2"]].map(([lbl,val,clr])=>(
                    <div key={lbl} style={{padding:"11px 14px",borderRight:"1px solid rgba(74,222,128,.05)"}}>
                      <div style={{fontSize:8,color:"rgba(226,240,226,.22)",letterSpacing:".1em",marginBottom:4,fontFamily:"DM Mono,monospace"}}>{lbl}</div>
                      <div style={{fontSize:17,fontWeight:800,color:clr as string}}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* col headers */}
                <div style={{padding:"8px 14px 4px",display:"flex",justifyContent:"space-between",fontSize:8,color:"rgba(226,240,226,.18)",letterSpacing:".1em",fontFamily:"DM Mono,monospace"}}>
                  <span>ASSET</span><span>SIGNAL</span><span>CONF.</span>
                </div>

                {/* rows */}
                {SIGNALS.map(row=>(
                  <div key={row.symbol} style={{padding:"9px 14px",borderBottom:"1px solid rgba(74,222,128,.05)",display:"flex",alignItems:"center",justifyContent:"space-between",background:row.active?"rgba(74,222,128,.05)":"transparent",borderLeft:row.active?"2px solid #4ade80":"2px solid transparent"}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:row.active?"#4ade80":"#e2f0e2"}}>{row.symbol}</div>
                      <div style={{fontSize:9,color:"rgba(226,240,226,.26)",marginTop:1,fontFamily:"DM Mono,monospace"}}>{row.price}</div>
                    </div>
                    <div style={{padding:"2px 9px",borderRadius:5,fontSize:10,fontWeight:700,background:db(row.dir),color:dc(row.dir)}}>{row.dir}</div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:12,fontWeight:600,color:"#e2f0e2"}}>{row.prob}%</div>
                      <div style={{width:52,height:2,borderRadius:2,background:"rgba(255,255,255,.07)",marginTop:3}}>
                        <div style={{width:`${row.prob}%`,height:"100%",borderRadius:2,background:dc(row.dir)}}/>
                      </div>
                    </div>
                  </div>
                ))}

                {/* AI reasoning */}
                <div style={{margin:"10px 14px",padding:"10px 12px",borderRadius:10,background:"rgba(74,222,128,.04)",border:"1px solid rgba(74,222,128,.12)"}}>
                  <div style={{fontSize:9,color:"#4ade80",fontWeight:700,letterSpacing:".1em",fontFamily:"DM Mono,monospace",marginBottom:5}}>🤖 AI REASONING</div>
                  <div style={{fontSize:11,color:"rgba(226,240,226,.42)",lineHeight:1.7,fontFamily:"DM Mono,monospace"}}>RSI divergence + MACD crossover confirms bullish momentum.<br/>Kelly sizing: 5.9% of capital...</div>
                </div>

                {/* bottom nav */}
                <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-around",borderTop:"1px solid rgba(74,222,128,.06)"}}>
                  {["Dashboard","Agents","Guardian","Portfolio"].map((t,i)=>(
                    <div key={t} style={{fontSize:9,color:i===0?"#4ade80":"rgba(226,240,226,.2)",fontWeight:i===0?700:400,fontFamily:"DM Mono,monospace"}}>{t}</div>
                  ))}
                </div>
              </div>

              {/* badge */}
              <div style={{position:"absolute",top:20,right:-18,background:"rgba(5,12,5,.96)",border:"1px solid rgba(74,222,128,.22)",borderRadius:12,padding:"9px 14px",backdropFilter:"blur(20px)",boxShadow:"0 10px 36px rgba(0,0,0,.4)"}}>
                <div style={{fontSize:8,color:"rgba(226,240,226,.28)",letterSpacing:".1em",fontFamily:"DM Mono,monospace",marginBottom:3}}>TODAY'S TOP</div>
                <div style={{fontSize:13,fontWeight:700,color:"#f0fdf4"}}>RELIANCE <span style={{color:"#4ade80"}}>BUY</span></div>
                <div style={{fontSize:10,color:"rgba(226,240,226,.32)",marginTop:1,fontFamily:"DM Mono,monospace"}}>87% confidence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER TAPE */}
      <div style={{borderTop:"1px solid rgba(74,222,128,.07)",borderBottom:"1px solid rgba(74,222,128,.07)",padding:"11px 0",overflow:"hidden",background:"rgba(74,222,128,.012)"}}>
        <div className="tk">
          {[...TICKERS,...TICKERS,...TICKERS,...TICKERS].map((t,i)=>(
            <span key={i} style={{fontSize:10,fontWeight:600,color:dc(DIRECTIONS[i%12]),letterSpacing:".06em",fontFamily:"DM Mono,monospace"}}>
              {t}&nbsp;&nbsp;{DIRECTIONS[i%12]}&nbsp;&nbsp;{PROBS[i%12]}
              <span style={{color:"rgba(74,222,128,.14)",marginLeft:34}}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* BUILT WITH */}
      <div style={{padding:"34px 40px",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:10,color:"rgba(226,240,226,.18)",letterSpacing:".14em",fontFamily:"DM Mono,monospace",marginBottom:20}}>BUILT WITH</p>
          <div style={{display:"flex",justifyContent:"center",gap:34,flexWrap:"wrap"}}>
            {["XGBoost","LightGBM","Groq AI","Supabase","Railway","Cloudflare"].map(n=>(
              <span key={n} style={{fontSize:12,fontWeight:600,color:"rgba(226,240,226,.16)"}}>{n}</span>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="sec" style={{padding:"96px 40px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <div style={{fontSize:10,fontWeight:700,color:"#4ade80",letterSpacing:".16em",fontFamily:"DM Mono,monospace",marginBottom:12}}>WHAT MAKES IT DIFFERENT</div>
            <h2 style={{fontSize:48,fontWeight:900,letterSpacing:"-1.5px",color:"#f0fdf4",lineHeight:1.05}}>Not just signals.<br/><span style={{color:"rgba(226,240,226,.2)"}}>Signals with receipts.</span></h2>
          </div>
          <motion.div className="fg" initial="hidden" whileInView="visible" viewport={{once:true,amount:0.2}} variants={{visible:{transition:{staggerChildren:0.1}}}} style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[
              {icon:"M",title:"ML Ensemble",desc:"XGBoost + LightGBM trained on 180 days of OHLCV. Walk-forward validated. No curve-fitting.",a:"#4ade80"},
              {icon:"9",title:"9-Factor Confluence",desc:"RSI, MACD, Bollinger, Stochastic, Volume, SMA Cross, 52W, Momentum — all scored together.",a:"#60a5fa"},
              {icon:"⏪",title:"Historical Replay",desc:"Pick any date in the last 175 days and see exactly what the model would have fired.",a:"#fbbf24"},
              {icon:"S",title:"Trade Guardian",desc:"Enter your position. Get worst-case loss, recommended size, and AI verdict instantly.",a:"#f87171"},
              {icon:"L",title:"Liquidity Levels",desc:"Live OI, funding rates, L/S ratio and liquidation clusters from OKX. Every 30 seconds.",a:"#c084fc"},
              {icon:"P",title:"Portfolio Lab",desc:"Black-Litterman optimization using ML signal probabilities. Stress test 3 crash scenarios.",a:"#4ade80"},
            ].map(f=>(
              <motion.div key={f.title} variants={{hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:0.4,ease:"easeOut"}}}} className="ch" style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.05)",borderRadius:16,padding:"24px 20px"}}>
                <div style={{width:36,height:36,borderRadius:9,background:`${f.a}14`,border:`1px solid ${f.a}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:f.a,marginBottom:13,fontFamily:"DM Mono,monospace"}}>{f.icon}</div>
                <div style={{fontSize:14,fontWeight:700,color:"#f0fdf4",marginBottom:7}}>{f.title}</div>
                <div style={{fontSize:12,color:"rgba(226,240,226,.33)",lineHeight:1.8}}>{f.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROOF */}
      <section id="proof" className="sec" style={{padding:"96px 40px",background:"rgba(74,222,128,.014)",borderTop:"1px solid rgba(74,222,128,.06)",borderBottom:"1px solid rgba(74,222,128,.06)"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <div style={{fontSize:10,fontWeight:700,color:"#4ade80",letterSpacing:".16em",fontFamily:"DM Mono,monospace",marginBottom:12}}>THE PROOF</div>
            <h2 style={{fontSize:48,fontWeight:900,letterSpacing:"-1.5px",color:"#f0fdf4"}}>Every claim is verifiable.</h2>
          </div>
          <motion.div className="st" initial="hidden" whileInView="visible" viewport={{once:true,amount:0.3}} variants={{visible:{transition:{staggerChildren:0.1}}}} style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {[["+39.5%","Total P&L","262 closed trades"],["2.57","Sharpe Ratio","across all asset classes"],["2:1","Risk/Reward","ATR-based targets"],["133","Live Assets","crypto, stocks, forex"]].map(([v,l,s])=>(
              <motion.div key={l} variants={{hidden:{opacity:0,scale:0.9},visible:{opacity:1,scale:1,transition:{duration:0.35,ease:"easeOut"}}}} style={{textAlign:"center",padding:"32px 12px",background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.05)",borderRadius:16}}>
                <div style={{fontSize:44,fontWeight:900,color:"#4ade80",letterSpacing:"-1px",marginBottom:6}}>{v}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#f0fdf4",marginBottom:4}}>{l}</div>
                <div style={{fontSize:10,color:"rgba(226,240,226,.26)",fontFamily:"DM Mono,monospace"}}>{s}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="sec" style={{padding:"72px 40px 56px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <div style={{fontSize:10,fontWeight:700,color:"#4ade80",letterSpacing:".16em",fontFamily:"DM Mono,monospace",marginBottom:12}}>GET STARTED</div>
            <h2 style={{fontSize:48,fontWeight:900,letterSpacing:"-1.5px",color:"#f0fdf4",lineHeight:1.05}}>Your financial partner<br/>in 3 easy steps.</h2>
          </div>
          <motion.div className="sg" initial="hidden" whileInView="visible" viewport={{once:true,amount:0.3}} variants={{visible:{transition:{staggerChildren:0.12}}}} style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[["01","Create your account","Sign up free. No credit card. Access 133 live signals across crypto, stocks and macro instantly."],["02","Set your strategy","Configure your risk profile. Let an AI agent trade for you, or follow signals manually."],["03","Track your edge","Monitor your virtual portfolio, win rate and P&L. Every trade tracked with full reasoning."]].map(([n,t,d])=>(
              <motion.div key={n} variants={{hidden:{opacity:0,y:16},visible:{opacity:1,y:0,transition:{duration:0.4,ease:"easeOut"}}}} className="ch" style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.05)",borderRadius:16,padding:"28px 20px"}}>
                <div style={{fontSize:34,fontWeight:900,color:"rgba(74,222,128,.18)",marginBottom:13,fontFamily:"DM Mono,monospace"}}>{n}</div>
                <div style={{fontSize:14,fontWeight:700,color:"#f0fdf4",marginBottom:8}}>{t}</div>
                <div style={{fontSize:12,color:"rgba(226,240,226,.33)",lineHeight:1.8}}>{d}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="sec" style={{padding:"96px 40px",background:"rgba(74,222,128,.014)",borderTop:"1px solid rgba(74,222,128,.06)"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <div style={{fontSize:10,fontWeight:700,color:"#4ade80",letterSpacing:".16em",fontFamily:"DM Mono,monospace",marginBottom:12}}>PRICING</div>
            <h2 style={{fontSize:48,fontWeight:900,letterSpacing:"-1.5px",color:"#f0fdf4"}}>Simple. No tricks.</h2>
          </div>
          <div className="pg" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.06)",borderRadius:20,padding:32}}>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(226,240,226,.32)",letterSpacing:".14em",fontFamily:"DM Mono,monospace",marginBottom:16}}>FREE</div>
              <div style={{fontSize:42,fontWeight:900,color:"#f0fdf4",letterSpacing:"-1px",marginBottom:4}}>₹0</div>
              <div style={{fontSize:11,color:"rgba(226,240,226,.26)",marginBottom:26,fontFamily:"DM Mono,monospace"}}>forever</div>
              {["133 live signals","Direction + confidence","News feed","Economic calendar","Perseus AI chat"].map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
                  <div style={{width:15,height:15,borderRadius:"50%",background:"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="8" height="8" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="rgba(226,240,226,.32)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{fontSize:12,color:"rgba(226,240,226,.38)"}}>{f}</span>
                </div>
              ))}
              <a href="/dashboard" className="bg" style={{display:"block",textAlign:"center",marginTop:26,padding:"12px",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,fontSize:13,fontWeight:700,color:"rgba(226,240,226,.4)",textDecoration:"none",background:"transparent"}}>Start free</a>
            </div>
            <div style={{background:"rgba(74,222,128,.04)",border:"1px solid rgba(74,222,128,.22)",borderRadius:20,padding:32,position:"relative",boxShadow:"0 0 44px rgba(74,222,128,.05)"}}>
              <div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:"#4ade80",color:"#050c05",fontSize:9,fontWeight:800,padding:"3px 14px",borderRadius:100,letterSpacing:".1em",fontFamily:"DM Mono,monospace"}}>MOST POPULAR</div>
              <div style={{fontSize:10,fontWeight:700,color:"#4ade80",letterSpacing:".14em",fontFamily:"DM Mono,monospace",marginBottom:16}}>PRO</div>
              <div style={{fontSize:42,fontWeight:900,color:"#f0fdf4",letterSpacing:"-1px",marginBottom:4}}>₹999</div>
              <div style={{fontSize:11,color:"rgba(226,240,226,.26)",marginBottom:26,fontFamily:"DM Mono,monospace"}}>per month · cancel anytime</div>
              {["Everything in Free","Historical Replay + AI analysis","Trade Guardian risk check","Liquidity Levels (live OI)","Portfolio Lab optimizer","Signal reasoning + Kelly sizing"].map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
                  <div style={{width:15,height:15,borderRadius:"50%",background:"rgba(74,222,128,.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="8" height="8" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#4ade80" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{fontSize:12,color:"rgba(226,240,226,.56)"}}>{f}</span>
                </div>
              ))}
              <a href="/dashboard" className="bp" style={{display:"block",textAlign:"center",marginTop:26,padding:"12px",background:"#4ade80",borderRadius:10,fontSize:13,fontWeight:700,color:"#050c05",textDecoration:"none"}}>Start Pro →</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"96px 40px",textAlign:"center",borderTop:"1px solid rgba(255,255,255,.03)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:520,height:260,background:"radial-gradient(ellipse,rgba(74,222,128,.055) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5,ease:"easeOut"}} style={{position:"relative"}}>
          <h2 style={{fontSize:54,fontWeight:900,letterSpacing:"-2px",color:"#f0fdf4",marginBottom:14,lineHeight:1.0}}>Ready to trade with<br/><span style={{color:"#4ade80"}}>actual edge?</span></h2>
          <p style={{fontSize:13,color:"rgba(226,240,226,.32)",marginBottom:30,fontFamily:"DM Mono,monospace"}}>No credit card required · 186 live signals · Start in 10 seconds</p>
          <a href="/dashboard" className="bp" style={{display:"inline-flex",alignItems:"center",gap:10,background:"#4ade80",color:"#050c05",fontWeight:700,fontSize:15,padding:"15px 34px",borderRadius:12,textDecoration:"none"}}>
            Launch QuantSignal free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#050c05" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid rgba(255,255,255,.04)",padding:"22px 40px"}}>
        <div className="fi" style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:22,height:22,background:"#16a34a",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#f0fdf4"}}>Q</div>
            <span style={{fontSize:12,fontWeight:700,color:"rgba(226,240,226,.28)"}}>QuantSignal</span>
          </div>
          <div style={{display:"flex",gap:22}}>
            {[["Dashboard","/dashboard"],["Guardian","/guardian"],["Portfolio","/portfolio"],["Agents","/agents"]].map(([l,h])=>(
              <a key={l} href={h} style={{fontSize:11,color:"rgba(226,240,226,.17)",textDecoration:"none"}}>{l}</a>
            ))}
          </div>
          <div style={{fontSize:11,color:"rgba(226,240,226,.17)",fontFamily:"DM Mono,monospace"}}>© 2026 QuantSignal</div>
        </div>
      </footer>
    </div>
  );
}
