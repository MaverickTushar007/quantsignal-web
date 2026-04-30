import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const S = "#13131E", B = "#1E1E2E";

export default function ReplayPage() {
  return (
    <div style={{ background: "#0D0D12", minHeight: "100vh" }}>
      <Sidebar />
      <div className="ml-[240px]">
        <TopBar />
        <main className="flex" style={{ height: "calc(100vh - 48px)" }}>
          {/* Left Panel */}
          <section className="w-1/3 p-8 flex flex-col gap-6" style={{ borderRight: `1px solid ${B}` }}>
            <div>
              <h2 className="text-sm font-normal uppercase tracking-widest">X-Ray Replay</h2>
              <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>Reconstruct historical AI signal state.</p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-widest mb-2 block" style={{ color: "#475569" }}>Target Asset</label>
                <div className="relative">
                  <select className="w-full p-3 rounded text-sm appearance-none outline-none" style={{ background: S, border: `1px solid ${B}`, color: "#fff", fontFamily: "Space Grotesk, monospace" }}>
                    <option>BTC-USD</option>
                    <option>ETH-USD</option>
                    <option>SOL-USD</option>
                    <option>AAPL</option>
                    <option>RELIANCE.NS</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#94A3B8" }}>expand_more</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest mb-2 block" style={{ color: "#475569" }}>Snapshot Date</label>
                <div className="relative">
                  <input type="date" defaultValue="2026-03-30" className="w-full p-3 rounded text-sm outline-none" style={{ background: S, border: `1px solid ${B}`, color: "#fff", fontFamily: "Space Grotesk, monospace" }} />
                </div>
                <p className="text-[10px] mt-1" style={{ color: "#475569" }}>→ 30 days ago</p>
              </div>
              <button className="w-full py-3 rounded text-[11px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]" style={{ background: "#3B82F6", color: "#fff" }}>
                <span className="material-symbols-outlined text-lg">play_circle</span>
                Run Replay
              </button>
            </div>
            <div className="mt-auto p-4 rounded" style={{ background: "#0D0D1260", border: `1px dashed ${B}` }}>
              <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "#475569" }}>Simulation Engine</p>
              <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
                Point-in-time snapshots of the Global Feature Store. Calculations reflect precisely what the model saw at the target timestamp.
              </p>
            </div>
          </section>

          {/* Right Panel */}
          <section className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Result Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[9px] px-2 py-0.5 rounded uppercase tracking-wider" style={{ background: "#10B98120", border: "1px solid #10B98140", color: "#10B981" }}>Replay Complete</span>
                    <span className="font-mono text-[11px]" style={{ color: "#475569" }}>ID: BTC-USD-T26</span>
                  </div>
                  <h1 className="text-xl font-normal">Snapshot: <span className="font-mono">2026-03-30</span></h1>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "#475569" }}>Data Integrity</p>
                  <p className="text-[11px] uppercase" style={{ color: "#10B981" }}>Verified Institutional</p>
                </div>
              </div>

              {/* Core Bento */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5 p-6 rounded flex flex-col justify-between" style={{ background: S, border: `1px solid ${B}` }}>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest mb-5" style={{ color: "#475569" }}>Historical Direction</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded" style={{ background: "#EF444420", border: "1px solid #EF444430" }}>
                      <span className="text-2xl font-bold" style={{ color: "#EF4444" }}>SELL</span>
                    </div>
                    <p className="text-xs mt-3" style={{ color: "#94A3B8" }}>Institutional Pressure Detected</p>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider">
                      <span style={{ color: "#475569" }}>Probability</span>
                      <span className="font-mono font-bold">18.79%</span>
                    </div>
                    <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: B }}>
                      <div className="h-full" style={{ width: "18.79%", background: "#EF4444" }}></div>
                    </div>
                    <div className="flex justify-between text-[10px]" style={{ color: "#475569" }}>
                      <span>vs Today: 32%</span>
                      <span style={{ color: "#10B981" }}>Delta +13.2pp ↑</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-7 p-6 rounded" style={{ background: S, border: `1px solid ${B}` }}>
                  <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: "#475569" }}>Top Driving Features</p>
                  <div className="space-y-4">
                    {[["bb_upper","+2.4σ","90%","#EF4444"],["price_to_sma20","1.08","72%","#EF4444"],["return_20d","-3.2%","55%","#F59E0B"]].map(([feat,val,pct,c]) => (
                      <div key={feat as string}>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: "#E2E8F0" }}>{feat}</span>
                          <span className="font-mono" style={{ color: c as string }}>{val}</span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: B }}>
                          <div className="h-full" style={{ width: pct as string, background: c as string }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    {[["Sentiment Shift","-12.4% Bearish","#EF4444"],["Whale Net Flow","-$420M","#EF4444"]].map(([l,v,c]) => (
                      <div key={l as string} className="p-3 rounded" style={{ background: "#0D0D12", border: `1px solid ${B}` }}>
                        <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "#475569" }}>{l}</p>
                        <p className="font-mono text-xs" style={{ color: c as string }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-3 p-4 rounded" style={{ background: S, border: `1px solid ${B}` }}>
                <span className="material-symbols-outlined text-sm mt-0.5" style={{ color: "#475569" }}>gavel</span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#475569" }}>Institutional Disclaimer</p>
                  <p className="text-xs leading-relaxed opacity-70" style={{ color: "#94A3B8" }}>
                    Historical replay only. Past performance is not indicative of future results. Probability scores are mathematical estimations based on training data. This is not financial advice.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
