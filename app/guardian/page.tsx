"use client";
import { useEffect, useState, useCallback } from "react";

const API = "https://quantsignal-api-production-a5e1.up.railway.app/api/v1";
function getUserId(): string {
  if (typeof window === "undefined") return "anonymous";
  try {
    const raw = localStorage.getItem(
      Object.keys(localStorage).find(k => k.includes("supabase") && k.includes("auth")) || ""
    );
    if (raw) {
      const parsed = JSON.parse(raw);
      const uid = parsed?.user?.id || parsed?.session?.user?.id;
      if (uid) return uid;
    }
  } catch {}
  return localStorage.getItem("user_id") || "anonymous";
}
const USER_ID = typeof window !== "undefined" ? getUserId() : "anonymous";

const DIR_COLOR: Record<string,string> = { BUY:"#00ff88", SELL:"#ff4466", HOLD:"#ffd700" };
const RISK_COLOR: Record<string,string> = { normal:"#00ff88", elevated:"#ffd700", critical:"#ff4466" };
const REGIME_ICON: Record<string,string> = { trending:"↗", ranging:"↔", bear:"↘", bull:"↑", unknown:"?" };
const ENERGY_COLOR: Record<string,string> = { exhausted:"#ff4466", releasing:"#ffd700", neutral:"rgba(255,255,255,0.4)", building:"#00ff88", unknown:"rgba(255,255,255,0.2)" };
const AGENT_ICONS: Record<string,string> = { RegimeAgent:"🌐", RiskAgent:"⚡", BriefingAgent:"📋", NewsAgent:"📰", GuardianAgent:"🛡️", OutcomeAgent:"🎯", ConflictAgent:"⚔️", CalibrationAgent:"🎯" };

function timeAgo(iso: string): string {
  if (!iso) return "never";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return Math.round(diff) + "s ago";
  if (diff < 3600) return Math.round(diff/60) + "m ago";
  return Math.round(diff/3600) + "h ago";
}

function ProbBar({ prob }: { prob: number }) {
  const pct = Math.round(prob * 100);
  const color = pct >= 50 ? "#00ff88" : pct >= 35 ? "#ffd700" : "#ff4466";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <div style={{ flex:1, height:3, background:"rgba(255,255,255,0.07)", borderRadius:2, overflow:"hidden" }}>
        <div style={{ width:pct+"%", height:"100%", background:color, borderRadius:2 }} />
      </div>
      <span style={{ fontSize:10, fontWeight:700, color, minWidth:28 }}>{pct}%</span>
    </div>
  );
}

function AgentBtn({ label, emoji, onClick }: { label:string; emoji:string; onClick:()=>Promise<void> }) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const handle = async () => {
    setRunning(true); setDone(false);
    try { await onClick(); setDone(true); setTimeout(()=>setDone(false),2000); }
    finally { setRunning(false); }
  };
  return (
    <button onClick={handle} disabled={running}
      style={{ width:"100%", background:done?"rgba(0,255,136,0.1)":"rgba(255,255,255,0.04)", border:"1px solid "+(done?"rgba(0,255,136,0.3)":"rgba(255,255,255,0.08)"), borderRadius:8, padding:"9px 12px", fontSize:10, fontWeight:600, color:done?"#00ff88":"rgba(255,255,255,0.5)", cursor:running?"not-allowed":"pointer", fontFamily:"inherit", textAlign:"left" as const, display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
      <span>{running?"⏳":done?"✓":emoji}</span>{running?"Running...":done?"Done":label}
    </button>
  );
}

export default function GuardianPage() {
  const [guardian, setGuardian] = useState<any>(null);
  const [agents, setAgents] = useState<any>(null);
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);
  const [runningNow, setRunningNow] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date|null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [gRes, aRes] = await Promise.all([
        fetch(API+"/agents/specialist/guardian", { method:"POST", headers:{"x-user-id":USER_ID} }),
        fetch(API+"/agents/specialist/latest"),
      ]);
      if (gRes.ok) setGuardian(await gRes.json());
      if (aRes.ok) setAgents(await aRes.json());
      try {
        const bRes = await fetch(API+"/agents/specialist/briefing", { method:"POST", headers:{"x-user-id":USER_ID} });
        if (bRes.ok) { const b = await bRes.json(); setBriefing(b.commentary||""); }
      } catch {}
      setLastRefresh(new Date());
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }, []);

  const runNow = async () => {
    setRunningNow(true);
    try {
      const res = await fetch(API+"/agents/specialist/guardian", { method:"POST", headers:{"x-user-id":USER_ID} });
      if (res.ok) setGuardian(await res.json());
      setLastRefresh(new Date());
    } finally { setRunningNow(false); }
  };

  useEffect(() => { fetchAll(); const i = setInterval(fetchAll,60000); return ()=>clearInterval(i); }, [fetchAll]);

  const riskLevel = guardian?.risk_level ?? "normal";
  const riskColor = RISK_COLOR[riskLevel] ?? "#00ff88";
  const alertCount = guardian?.alerts_fired?.length ?? 0;

  return (
    <div style={{ minHeight:"100vh", background:"#080a0f", color:"#e2e8f0", fontFamily:"IBM Plex Mono,monospace" }}>
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:"rgba(8,10,15,0.95)", zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <a href="/dashboard" style={{ color:"rgba(255,255,255,0.3)", fontSize:11, textDecoration:"none" }}>← Back</a>
          <div style={{ width:1, height:16, background:"rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize:13, fontWeight:700, color:"#00ff88", letterSpacing:"0.08em" }}>🛡️ GUARDIAN COMMAND</span>
          <div style={{ background:riskColor+"18", border:"1px solid "+riskColor+"40", borderRadius:6, padding:"3px 10px", fontSize:9, fontWeight:700, color:riskColor }}>
            {riskLevel.toUpperCase()} RISK
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {lastRefresh && <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>Updated {timeAgo(lastRefresh.toISOString())}</span>}
          <button onClick={runNow} disabled={runningNow}
            style={{ background:runningNow?"rgba(255,255,255,0.06)":"linear-gradient(135deg,#00ff88,#00cc66)", border:"none", borderRadius:8, padding:"8px 16px", fontSize:10, fontWeight:700, color:runningNow?"rgba(255,255,255,0.3)":"#000", cursor:runningNow?"not-allowed":"pointer", fontFamily:"inherit" }}>
            {runningNow?"⏳ Running...":"▶ Run Now"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 24px" }}>
        {briefing && (
          <div style={{ background:"rgba(0,255,136,0.04)", border:"1px solid rgba(0,255,136,0.12)", borderRadius:12, padding:"14px 18px", marginBottom:24, display:"flex", gap:12 }}>
            <span style={{ fontSize:18 }}>📋</span>
            <div>
              <div style={{ fontSize:9, color:"#00ff88", letterSpacing:"0.1em", marginBottom:6, fontWeight:700 }}>MORNING BRIEFING</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", lineHeight:1.7 }}>{briefing}</div>
            </div>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:12, marginBottom:28 }}>
          {[
            { label:"RISK LEVEL", value:riskLevel.toUpperCase(), color:riskColor, sub:"market-wide", icon:"⚡" },
            { label:"WATCHING", value:String(guardian?.watched?.length??0), color:"#00aaff", sub:"symbols", icon:"👁" },
            { label:"ALERTS FIRED", value:String(alertCount), color:alertCount>0?"#ffd700":"#00ff88", sub:"this cycle", icon:"🔔" },
            { label:"AGENTS LIVE", value:String(Object.keys(agents?.agents??{}).length), color:"#aa88ff", sub:"running", icon:"🤖" },
          ].map(s => (
            <div key={s.label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"16px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:8, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em" }}>{s.label}</span>
                <span style={{ fontSize:14 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize:24, fontWeight:800, color:s.color, marginBottom:2 }}>{loading&&!guardian?"…":s.value}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          <div>
            {alertCount > 0 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:9, fontWeight:700, color:"#ffd700", letterSpacing:"0.1em", marginBottom:10 }}>🔔 ACTIVE ALERTS ({alertCount})</div>
                {guardian?.alerts_fired?.map((a: any, i: number) => (
                  <div key={i} style={{ background:"rgba(255,215,0,0.06)", border:"1px solid rgba(255,215,0,0.2)", borderRadius:10, padding:"14px 16px", display:"flex", alignItems:"center", gap:16, marginBottom:8 }}>
                    <div style={{ fontSize:18, fontWeight:800, color:DIR_COLOR[a.direction]??"#fff", minWidth:60 }}>{a.symbol}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:8, marginBottom:4, alignItems:"center" }}>
                        <span style={{ fontSize:10, fontWeight:700, color:DIR_COLOR[a.direction], background:DIR_COLOR[a.direction]+"15", padding:"2px 8px", borderRadius:4 }}>{a.direction}</span>
                        <span style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>{a.reason}</span>
                      </div>
                      {a.warning && <div style={{ fontSize:9, color:"#ff4466" }}>{a.warning}</div>}
                    </div>
                    <div style={{ textAlign:"right" as const, fontSize:10 }}>
                      <div style={{ color:"#ffd700", fontWeight:700 }}>EV {a.ev>0?"+":""}{a.ev?.toFixed(2)}%</div>
                      <div style={{ color:"rgba(255,255,255,0.4)" }}>{a.regime} · {a.energy}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", marginBottom:10 }}>WATCHLIST — LIVE SCAN</div>
            {guardian?.note && (
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"32px 20px", textAlign:"center" as const }}>
                <div style={{ fontSize:24, marginBottom:12 }}>🛡️</div>
                <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>No symbols being watched</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", marginBottom:16, lineHeight:1.6 }}>
                  Guardian monitors your watchlist every 15 minutes and fires alerts when signals meet your thresholds.
                </div>
                <a href="/dashboard" style={{ fontSize:10, fontWeight:700, color:"#00ff88", textDecoration:"none", border:"1px solid rgba(0,255,136,0.3)", borderRadius:4, padding:"6px 16px", background:"rgba(0,255,136,0.06)" }}>
                  GO TO DASHBOARD → ADD ASSETS TO WATCHLIST
                </a>
              </div>
            )}
            {!guardian?.note && (guardian?.watched??[]).map((w: any) => (
              <div key={w.symbol} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"14px 16px", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#fff", minWidth:90 }}>{w.symbol}</span>
                  <span style={{ fontSize:9, fontWeight:700, color:DIR_COLOR[w.direction], background:DIR_COLOR[w.direction]+"15", padding:"2px 8px", borderRadius:4 }}>{w.direction}</span>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{REGIME_ICON[w.regime]??"?"} <span style={{ fontSize:9, color:"rgba(255,255,255,0.25)" }}>{w.regime}</span></span>
                  <span style={{ fontSize:9, color:ENERGY_COLOR[w.energy]??"rgba(255,255,255,0.3)", marginLeft:"auto" }}>⚡ {w.energy}</span>
                </div>
                <ProbBar prob={w.prob} />
                <div style={{ marginTop:6, fontSize:9, color:"rgba(255,255,255,0.3)", display:"flex", justifyContent:"space-between" }}>
                  <span>Expected value</span>
                  <span style={{ color:w.ev>0?"#00ff88":"rgba(255,255,255,0.3)", fontWeight:600 }}>{w.ev>0?"+":""}{w.ev?.toFixed(3)}%</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", marginBottom:10 }}>AGENT STATUS</div>
            {Object.entries(AGENT_ICONS).map(([name, icon]) => {
              const d = agents?.agents?.[name];
              const alive = d && (Date.now()-new Date(d.run_at).getTime()) < 3600000;
              return (
                <div key={name} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid "+(alive?"rgba(0,255,136,0.12)":"rgba(255,255,255,0.06)"), borderRadius:10, padding:"12px 14px", display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                  <span style={{ fontSize:16 }}>{icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"#fff", marginBottom:2 }}>{name}</div>
                    <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>{d?timeAgo(d.run_at):"never run"}</div>
                  </div>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:alive?"#00ff88":"rgba(255,255,255,0.2)", boxShadow:alive?"0 0 6px rgba(0,255,136,0.5)":"none" }} />
                </div>
              );
            })}

            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", marginBottom:8 }}>MANUAL TRIGGERS</div>
              {[
                { label:"Run Regime Scan", endpoint:"/agents/specialist/regime", emoji:"🌐" },
                { label:"Run Risk Check", endpoint:"/agents/specialist/risk", emoji:"⚡" },
                { label:"Run News Agent", endpoint:"/agents/specialist/news", emoji:"📰" },
                { label:"Run Conflict Scan", endpoint:"/agents/specialist/conflicts", emoji:"⚔️" },
                { label:"Run Outcome Check", endpoint:"/agents/specialist/outcomes", emoji:"🎯" },
              ].map(a => (
                <AgentBtn key={a.endpoint} label={a.label} emoji={a.emoji}
                  onClick={async()=>{ await fetch(API+a.endpoint,{method:"POST"}); setTimeout(fetchAll,1500); }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}