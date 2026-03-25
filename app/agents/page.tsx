"use client";
import { useState, useEffect } from "react";

const API = "https://web-production-1a093.up.railway.app/api/v1";
const USER_ID = "demo_user"; // Replace with real auth later

const STRATEGY_OPTIONS = [
  { value: "all",    label: "All Assets",      desc: "186 assets across India, Crypto, US" },
  { value: "india",  label: "India Only",       desc: "NSE/BSE stocks only" },
  { value: "crypto", label: "Crypto Only",      desc: "BTC, ETH, SOL and more" },
  { value: "us",     label: "US Stocks Only",   desc: "FAANG, NVDA, etc." },
];

export default function AgentsPage() {
  const [agents, setAgents]       = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [creating, setCreating]   = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const [form, setForm]           = useState({
    name: "", strategy: "india",
    min_probability: 0.65, budget_inr: 100000,
  });

  const fetchAgents = async () => {
    try {
      const r = await fetch(`${API}/agents/${USER_ID}`);
      const d = await r.json();
      setAgents(d.agents || []);
    } catch { setAgents([]); }
    setLoading(false);
  };

  useEffect(() => { fetchAgents(); }, []);

  const createAgent = async () => {
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      await fetch(`${API}/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_id: USER_ID }),
      });
      setShowForm(false);
      setForm({ name: "", strategy: "india", min_probability: 0.65, budget_inr: 100000 });
      await fetchAgents();
    } catch (e) { console.error(e); }
    setCreating(false);
  };

  const pauseResume = async (agent: any) => {
    const newStatus = agent.status === "active" ? "paused" : "active";
    await fetch(`${API}/agents/${agent.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    await fetchAgents();
  };

  const deleteAgent = async (id: string) => {
    if (!confirm("Delete this agent and all its trades?")) return;
    await fetch(`${API}/agents/${id}`, { method: "DELETE" });
    await fetchAgents();
  };

  const pnlColor = (pnl: number) =>
    pnl > 0 ? "#00e676" : pnl < 0 ? "#ff5252" : "rgba(255,255,255,0.5)";

  const statusBadge = (status: string) => {
    const map: any = {
      active: { bg: "rgba(0,230,118,0.12)", color: "#00e676", label: "ACTIVE" },
      paused: { bg: "rgba(255,193,7,0.12)",  color: "#ffc107", label: "PAUSED" },
      stopped:{ bg: "rgba(255,82,82,0.12)",  color: "#ff5252", label: "STOPPED" },
    };
    const s = map[status] || map.stopped;
    return (
      <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40`,
        borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 800,
        letterSpacing: "0.08em" }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "white",
      fontFamily: "'Inter', sans-serif", padding: "32px 24px" }}>

      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
              🤖 Virtual Agents
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
              Automated paper trading on live signals
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            background: showForm ? "rgba(255,255,255,0.05)" : "rgba(0,230,118,0.15)",
            border: `1px solid ${showForm ? "rgba(255,255,255,0.1)" : "rgba(0,230,118,0.4)"}`,
            color: showForm ? "rgba(255,255,255,0.6)" : "#00e676",
            borderRadius: 8, padding: "10px 20px", cursor: "pointer",
            fontSize: 13, fontWeight: 700,
          }}>
            {showForm ? "✕ Cancel" : "+ New Agent"}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div style={{ background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12,
            padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 20,
              color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em" }}>
              CONFIGURE AGENT
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 16, marginBottom: 16 }}>
              {/* Name */}
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                  AGENT NAME
                </label>
                <input value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="e.g. Nifty Hunter"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                    padding: "10px 12px", color: "white", fontSize: 13,
                    outline: "none", boxSizing: "border-box" }} />
              </div>

              {/* Budget */}
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                  VIRTUAL BUDGET (₹)
                </label>
                <input type="number" value={form.budget_inr}
                  onChange={e => setForm({...form, budget_inr: +e.target.value})}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                    padding: "10px 12px", color: "white", fontSize: 13,
                    outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            {/* Strategy */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                STRATEGY
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {STRATEGY_OPTIONS.map(opt => (
                  <button key={opt.value}
                    onClick={() => setForm({...form, strategy: opt.value})}
                    style={{
                      background: form.strategy === opt.value
                        ? "rgba(0,230,118,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${form.strategy === opt.value
                        ? "rgba(0,230,118,0.4)" : "rgba(255,255,255,0.08)"}`,
                      color: form.strategy === opt.value
                        ? "#00e676" : "rgba(255,255,255,0.5)",
                      borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                      fontSize: 12, fontWeight: 600,
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>
                {STRATEGY_OPTIONS.find(o => o.value === form.strategy)?.desc}
              </div>
            </div>

            {/* Min Probability */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                MIN SIGNAL CONFIDENCE — {Math.round(form.min_probability * 100)}%
              </label>
              <input type="range" min={55} max={90} step={5}
                value={form.min_probability * 100}
                onChange={e => setForm({...form, min_probability: +e.target.value / 100})}
                style={{ width: "100%", accentColor: "#00e676" }} />
              <div style={{ display: "flex", justifyContent: "space-between",
                fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                <span>55% — More trades</span>
                <span>90% — Fewer, higher quality</span>
              </div>
            </div>

            <button onClick={createAgent} disabled={creating || !form.name.trim()}
              style={{ background: "rgba(0,230,118,0.15)",
                border: "1px solid rgba(0,230,118,0.4)",
                color: "#00e676", borderRadius: 8, padding: "12px 28px",
                cursor: "pointer", fontSize: 13, fontWeight: 700,
                opacity: creating || !form.name.trim() ? 0.5 : 1 }}>
              {creating ? "Creating..." : "🚀 Launch Agent"}
            </button>
          </div>
        )}

        {/* Agents List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60,
            color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            Loading agents...
          </div>
        ) : agents.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80,
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 12 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🤖</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
              No agents yet
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
              Create your first agent to start paper trading automatically
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {agents.map(agent => {
              const pnl = agent.total_pnl_inr || 0;
              const pnlPct = agent.budget_inr > 0
                ? (pnl / agent.budget_inr * 100).toFixed(2) : "0.00";
              return (
                <div key={agent.id} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12, padding: 20,
                }}>
                  {/* Top row */}
                  <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 16, fontWeight: 800 }}>
                          {agent.name}
                        </span>
                        {statusBadge(agent.status)}
                        {agent.status === "paused" && agent.paused_until && (
                          <span style={{ fontSize: 10,
                            color: "rgba(255,193,7,0.6)" }}>
                            ⚠ Kill switch — resumes in 48h
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)",
                        marginTop: 4 }}>
                        {STRATEGY_OPTIONS.find(o => o.value === agent.strategy)?.label}
                        {" · "}{Math.round(agent.min_probability * 100)}%+ signals
                        {" · "}₹{agent.budget_inr?.toLocaleString()} virtual
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => pauseResume(agent)} style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.6)", borderRadius: 6,
                        padding: "6px 12px", cursor: "pointer", fontSize: 11 }}>
                        {agent.status === "active" ? "⏸ Pause" : "▶ Resume"}
                      </button>
                      <button onClick={() => deleteAgent(agent.id)} style={{
                        background: "rgba(255,82,82,0.08)",
                        border: "1px solid rgba(255,82,82,0.2)",
                        color: "rgba(255,82,82,0.7)", borderRadius: 6,
                        padding: "6px 12px", cursor: "pointer", fontSize: 11 }}>
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                    gap: isMobile ? 8 : 12 }}>
                    {[
                      { label: "TOTAL P&L",
                        value: `${pnl >= 0 ? "+" : ""}₹${pnl.toLocaleString()}`,
                        color: pnlColor(pnl) },
                      { label: "RETURN",
                        value: `${pnl >= 0 ? "+" : ""}${pnlPct}%`,
                        color: pnlColor(pnl) },
                      { label: "TOTAL TRADES",
                        value: agent.total_trades || 0,
                        color: "white" },
                      { label: "OPEN POSITIONS",
                        value: agent.open_positions || 0,
                        color: "rgba(255,255,255,0.7)" },
                    ].map(stat => (
                      <div key={stat.label} style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 8, padding: "12px 14px" }}>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)",
                          letterSpacing: "0.1em", marginBottom: 6 }}>
                          {stat.label}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800,
                          color: stat.color }}>
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent trades */}
                  {agent.recent_trades?.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.08em", marginBottom: 8 }}>
                        RECENT TRADES
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {agent.recent_trades.slice(0, 3).map((t: any) => (
                          <div key={t.id} style={{ display: "flex",
                            justifyContent: "space-between", alignItems: "center",
                            padding: "6px 10px",
                            background: "rgba(255,255,255,0.02)",
                            borderRadius: 6, fontSize: 12 }}>
                            <span style={{ fontWeight: 600 }}>{t.symbol}</span>
                            <span style={{ color: t.direction === "BUY"
                              ? "#00e676" : "#ff5252", fontSize: 10,
                              fontWeight: 700 }}>{t.direction}</span>
                            <span style={{ color: "rgba(255,255,255,0.4)",
                              fontSize: 10 }}>
                              {t.outcome === "open" ? "🟡 OPEN" :
                               t.outcome === "TP_HIT" ? "✅ TP" :
                               t.outcome === "SL_HIT" ? "❌ SL" : "⏰ EXP"}
                            </span>
                            <span style={{ color: pnlColor(t.pnl_inr || 0),
                              fontWeight: 700 }}>
                              {t.pnl_inr ? `${t.pnl_inr >= 0 ? "+" : ""}₹${t.pnl_inr}` : "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
