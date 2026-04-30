import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const S = "#13131E", B = "#1E1E2E";

export default function BriefingPage() {
  return (
    <div style={{ background: "#0D0D12", minHeight: "100vh" }}>
      <Sidebar />
      <div className="ml-[240px]">
        <TopBar />
        <main className="p-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl">Morning Briefing</h2>
                <span className="px-2 py-0.5 rounded font-mono text-[10px]" style={{ background: B, color: "#94A3B8" }}>2026-03-29</span>
              </div>
              <p className="text-sm" style={{ color: "#94A3B8" }}>Daily institutional analysis synthesising global macro flows and AI signal clusters.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-[10px] uppercase tracking-wider rounded flex items-center gap-2" style={{ background: S, border:`1px solid ${B}`, color: "#94A3B8" }}>
                <span className="material-symbols-outlined text-sm">download</span>PDF Report
              </button>
              <button className="px-4 py-2 text-[10px] uppercase tracking-wider rounded flex items-center gap-2" style={{ background: "#3B82F6", color: "#fff" }}>
                <span className="material-symbols-outlined text-sm">share</span>Share
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-px mb-8 overflow-hidden rounded" style={{ background: B, border: `1px solid ${B}` }}>
            {[
              { label:"Analyzed", val:"30", color:"#fff" },
              { label:"Buy Signals", val:"26", color:"#10B981", badge:"86.6%" },
              { label:"Sell Signals", val:"4", color:"#EF4444", badge:"13.4%" },
              { label:"Hold/Neutral", val:"0", color:"#F59E0B" },
              { label:"Circuit Breaker", val:"INACTIVE", color:"#10B981", dot:true },
            ].map((c, i) => (
              <div key={i} className="p-5" style={{ background: S }}>
                <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "#475569" }}>{c.label}</p>
                {c.dot ? (
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: c.color }}></span><p className="text-sm font-bold" style={{ color: c.color }}>{c.val}</p></div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <p className="font-mono text-2xl font-bold" style={{ color: c.color }}>{c.val}</p>
                    {c.badge && <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: c.color+"20", color: c.color }}>{c.badge}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Terminal Card */}
          <div className="rounded overflow-hidden mb-8" style={{ background: S, border: `1px solid ${B}` }}>
            <div className="px-4 py-2 flex items-center justify-between" style={{ background: "#0D0D12", borderBottom: `1px solid ${B}` }}>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">{[0,1,2].map(i=><span key={i} className="w-2 h-2 rounded-full" style={{ background: B }}></span>)}</div>
                <span className="font-mono text-[10px] ml-3 uppercase tracking-wider" style={{ color: "#475569" }}>Terminal: QS-8821-X</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: "#10B981" }}></span>
                <span className="text-[10px] uppercase font-bold" style={{ color: "#10B981" }}>Live encrypted feed</span>
              </div>
            </div>
            <div className="p-8 space-y-8">
              <section>
                <h3 className="text-xs font-medium mb-5 flex items-center uppercase tracking-widest" style={{ color: "#94A3B8" }}>
                  <span className="mr-2" style={{ color: "#3B82F6" }}>01.</span> SIGNAL FLOW
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#E2E8F0" }}>
                  Overnight analysis indicates a strong rotation toward accumulation. Proprietary Alpha-7 engine detected{" "}
                  <span className="font-mono" style={{ color: "#3B82F6" }}>$420M</span> in hidden buy-walls across decentralized liquidity pools. 
                  Sentiment remains cautiously bullish with a Fear-Greed index reading of{" "}
                  <span className="font-mono" style={{ color: "#3B82F6" }}>62</span>.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#E2E8F0" }}>
                  US Treasury <span className="font-mono" style={{ color: "#3B82F6" }}>10Y</span> yield compression provides supportive backdrop for Tier-1 digital assets. Anticipate high volatility during NY session open (<span className="font-mono" style={{ color: "#3B82F6" }}>13:30 UTC</span>).
                </p>
              </section>

              <section className="p-6 rounded space-y-4" style={{ background: "#0D0D12", border: `1px solid ${B}` }}>
                <h3 className="text-xs font-medium flex items-center uppercase tracking-widest" style={{ color: "#94A3B8" }}>
                  <span className="mr-2" style={{ color: "#3B82F6" }}>02.</span> TOP SIGNALS [RANKED BY CONFIDENCE]
                </h3>
                {[
                  ["HINDALCO.NS","BUY","69%","Strong Buy","#10B981","TGT: ₹400"],
                  ["MPHASIS.NS","BUY","65%","Accumulate","#10B981","TGT: ₹2,800"],
                  ["OFSS.NS","BUY","59%","Accumulate","#10B981","TGT: ₹12,100"],
                  ["PERSISTENT.NS","BUY","57%","Mean Rev","#F59E0B","TGT: ₹4,500"],
                  ["OP-USD","SELL","44%","Short","#EF4444","STP: $1.20"],
                ].map(([ticker, dir, prob, label, c, target]) => (
                  <div key={ticker as string} className="flex justify-between items-center pb-2 text-sm" style={{ borderBottom: `1px solid ${B}` }}>
                    <span className="font-medium" style={{ color: "#E2E8F0" }}>{ticker}</span>
                    <div className="flex items-center gap-5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: (c as string)+"20", border:`1px solid ${(c as string)}40`, color: c as string }}>{label}</span>
                      <span className="font-mono font-bold" style={{ color: c as string }}>{prob}</span>
                      <span className="font-mono text-xs" style={{ color: "#475569" }}>{target}</span>
                    </div>
                  </div>
                ))}
              </section>

              <section>
                <h3 className="text-xs font-medium mb-5 flex items-center uppercase tracking-widest" style={{ color: "#94A3B8" }}>
                  <span className="mr-2" style={{ color: "#3B82F6" }}>03.</span> WATCH TODAY
                </h3>
                <ul className="space-y-3">
                  {[
                    "Monitor liquidity gaps on ETH mainnet. Significant drawdown risk if $2,420 support fails.",
                    "NIFTY 50 structure shows extreme compression. Expect 1.2% delta move within 60 mins of open.",
                    "Solar sector (SEDG/ENPH) seeing institutional accumulation despite retail sell-off.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <span className="font-mono text-[11px] mr-5 mt-0.5" style={{ color: "#475569" }}>0{i+1}.</span>
                      <span style={{ color: "#E2E8F0" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="pt-6 flex justify-between font-mono text-[10px]" style={{ borderTop: `1px solid ${B}`, color: "#475569" }}>
                <span>GENERATED <span style={{ color: "#94A3B8" }}>05:30:12 UTC</span> BY AI-CLUSTER-DELTA</span>
                <span className="animate-pulse">_CURSOR_IDLE</span>
              </div>
            </div>
          </div>

          {/* Archive */}
          <div>
            <h3 className="text-xs font-medium mb-5 flex items-center uppercase tracking-widest" style={{ color: "#94A3B8" }}>
              <span className="material-symbols-outlined mr-2 text-[18px]">history</span>Archive
            </h3>
            <div className="grid grid-cols-8 gap-3">
              {["2026-03-28","2026-03-27","2026-03-26","2026-03-25","2026-03-24","2026-03-23","2026-03-22","2026-03-21"].map((d,i) => (
                <a key={d} href="#" className="p-3 rounded text-center transition-all group"
                  style={{ background: S, border:`1px solid ${B}` }}>
                  <div className="text-[10px] font-mono mb-1" style={{ color: "#475569" }}>{d.slice(5)}</div>
                  <div className="text-[10px] uppercase tracking-tighter" style={{ color: "#94A3B8" }}>
                    {["Yesterday","Tue","Mon","Sun","Sat","Fri","Thu","Wed"][i]}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
