import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const S = "#13131E", B = "#1E1E2E";

export default function SettingsPage() {
  return (
    <div style={{ background: "#0D0D12", minHeight: "100vh" }}>
      <Sidebar />
      <div className="ml-[240px]">
        <TopBar />
        <main className="p-6 max-w-2xl space-y-8">
          <h2 className="text-2xl font-normal">Settings</h2>

          {/* Profile */}
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-3 px-1" style={{ color: "#475569" }}>Profile</p>
            <div className="p-5 rounded flex items-center gap-4" style={{ background: S, border:`1px solid ${B}` }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ background: "#3B82F620", border:"2px solid #3B82F6", color:"#3B82F6" }}>T</div>
              <div>
                <p className="font-medium">Tushar B.</p>
                <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold" style={{ background:"#3B82F620", border:"1px solid #3B82F630", color:"#3B82F6" }}>PRO PLAN</span>
              </div>
              <button className="ml-auto" style={{ color:"#94A3B8" }}>
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-3 px-1" style={{ color: "#475569" }}>Notifications</p>
            <div className="rounded overflow-hidden" style={{ background: S, border:`1px solid ${B}` }}>
              {[["Signal Alerts","Get notified for new signals"],["Morning Briefing","Daily 07:30 UTC briefing"],["Price Alerts","When signals hit targets"]].map(([label, sub], i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-[#1A1A28] transition-colors" style={{ borderBottom: i<2?`1px solid ${B}`:"none" }}>
                  <div>
                    <p className="text-sm">{label}</p>
                    <p className="text-xs" style={{ color:"#94A3B8" }}>{sub}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 rounded-full peer peer-checked:bg-[#3B82F630] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#3B82F6] after:rounded-full after:h-4 after:w-4 after:transition-all" style={{ background: B }}></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Data */}
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-3 px-1" style={{ color: "#475569" }}>Data</p>
            <div className="p-5 rounded space-y-3" style={{ background: S, border:`1px solid ${B}` }}>
              {[["Last Rebuild","09:09 UTC"],["Cached Signals","28"],["Total Coverage","184"],["Cache Health","15.2%"]].map(([l,v]) => (
                <div key={l} className="flex justify-between text-sm py-1.5" style={{ borderBottom:`1px solid ${B}` }}>
                  <span style={{ color:"#94A3B8" }}>{l}</span>
                  <span className="font-mono">{v}</span>
                </div>
              ))}
              <button className="w-full py-2 mt-2 rounded text-[10px] uppercase tracking-wider" style={{ background:"#3B82F620", border:"1px solid #3B82F630", color:"#3B82F6" }}>
                Force Refresh Cache
              </button>
            </div>
          </div>

          {/* About */}
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-3 px-1" style={{ color: "#475569" }}>About</p>
            <div className="p-5 rounded space-y-3" style={{ background: S, border:`1px solid ${B}` }}>
              {[["Version","v4.2.0-STABLE"],["Build","2026-04-29"],["API Endpoint","quantsignal-api.up.railway.app"]].map(([l,v]) => (
                <div key={l} className="flex justify-between text-sm py-1.5" style={{ borderBottom:`1px solid ${B}` }}>
                  <span style={{ color:"#94A3B8" }}>{l}</span>
                  <span className="font-mono text-xs">{v}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm py-1.5 items-center">
                <span style={{ color:"#94A3B8" }}>API Status</span>
                <span className="flex items-center gap-2 text-xs font-bold" style={{ color:"#10B981" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background:"#10B981" }}></span>Connected
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
