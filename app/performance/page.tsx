"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine,
} from "recharts";

const API = "https://quantsignal-api-production.up.railway.app/api/v1";

// ── types ──────────────────────────────────────────────────────
interface Trade {
  symbol: string; date: string; direction: "BUY" | "SELL";
  confidence: string; probability: number;
  entry: number; take_profit: number; stop_loss: number;
  exit: number; outcome: string; pnl_pct: number; cumulative_pnl: number;
}
interface Summary {
  total_trades: number; win_rate: number;
  high_conf_win_rate: number; high_conf_trades: number;
  total_pnl: number; tp_hits: number; sl_hits: number;
  equity_curve: { date: string; cumulative_pnl: number }[];
}
interface Perf {
  win_rate: number; wins: number; losses: number;
  open: number; total_signals: number;
}

// ── helpers ────────────────────────────────────────────────────
const dc = (d: string) =>
  d === "BUY" ? "#00ff88" : d === "SELL" ? "#ff4466" : "#ffd700";

const outcomeColor = (o: string) =>
  o === "TP_HIT" || o === "win" ? "#00ff88" :
  o === "SL_HIT" || o === "loss" ? "#ff4466" : "#ffd700";

const outcomeLabel = (o: string) =>
  o === "TP_HIT" ? "TP ✓" : o === "SL_HIT" ? "SL ✗" : o.toUpperCase();

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 3,
      color, background: `${color}18`, border: `1px solid ${color}40`,
      fontFamily: "inherit", letterSpacing: "0.05em",
    }}>{label}</span>
  );
}

function StatCard({ label, value, sub, color = "#fff" }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 8, padding: "16px 18px",
    }}>
      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 8, fontFamily: "inherit" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "inherit", letterSpacing: "-0.5px" }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── custom tooltip ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const v: number = payload[0].value;
  return (
    <div style={{
      background: "#0c0c0f", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 6, padding: "8px 12px", fontSize: 10, fontFamily: "IBM Plex Mono, monospace",
    }}>
      <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{label}</div>
      <div style={{ color: v >= 0 ? "#00ff88" : "#ff4466", fontWeight: 700 }}>
        {v >= 0 ? "+" : ""}{v.toFixed(2)}%
      </div>
    </div>
  );
}

// ── main ───────────────────────────────────────────────────────
export default function PerformancePage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [perf, setPerf] = useState<Perf | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"ALL" | "BUY" | "SELL" | "TP" | "SL">("ALL");
  const [evStats, setEvStats] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/system/ev-stats`)
      .then(r => r.json())
      .then(d => setEvStats(d.ev_stats || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/history/summary`).then(r => r.json()),
      fetch(`${API}/performance`).then(r => r.json()),
      fetch(`${API}/history/trades`).then(r => r.json()),
    ]).then(([s, p, t]) => {
      setSummary(s);
      setPerf(p);
      setTrades(t.trades || []);
    }).finally(() => setLoading(false));
  }, []);

  // dedupe equity curve — last value per date
  const equity = (() => {
    if (!summary?.equity_curve) return [];
    const m = new Map<string, number>();
    for (const p of summary.equity_curve) m.set(p.date, p.cumulative_pnl);
    return Array.from(m.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, cumulative_pnl]) => ({ date, cumulative_pnl }));
  })();

  // filtered trades
  const filtered = trades.filter(t => {
    if (tab === "BUY") return t.direction === "BUY";
    if (tab === "SELL") return t.direction === "SELL";
    if (tab === "TP") return t.outcome === "TP_HIT";
    if (tab === "SL") return t.outcome === "SL_HIT";
    return true;
  }).slice(0, 50);

  // monthly bar data
  const monthly = (() => {
    const map = new Map<string, number>();
    for (const t of trades) {
      const m = t.date?.slice(0, 7);
      if (!m) continue;
      map.set(m, (map.get(m) ?? 0) + t.pnl_pct);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, pnl]) => ({ month: month.slice(5), pnl: +pnl.toFixed(2) }));
  })();

  const pnlPos = (summary?.total_pnl ?? 0) >= 0;

  if (loading) return (
    <div style={{ height: "100vh", background: "#060608", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "IBM Plex Mono, monospace", color: "rgba(255,255,255,0.2)", fontSize: 11 }}>
      LOADING PERFORMANCE DATA...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#060608", fontFamily: "'IBM Plex Mono', monospace", color: "#e2e8f0" }}>

      {/* ── TOP BAR ── */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "10px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#00ff88", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em" }}>● QUANT SIGNALS</span>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/dashboard" style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 8px" }}>← DASHBOARD</a>
            <span style={{ fontSize: 10, color: "#00aaff", border: "1px solid rgba(0,170,255,0.3)", borderRadius: 4, padding: "2px 8px", background: "rgba(0,170,255,0.08)" }}>📈 PERFORMANCE</span>
            <a href="/guardian" style={{ fontSize: 10, color: "#00ff88", textDecoration: "none", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 4, padding: "2px 8px", background: "rgba(0,255,136,0.08)" }}>🛡️ GUARDIAN</a>
            <a href="/agents" style={{ fontSize: 10, color: "#ffc107", textDecoration: "none", border: "1px solid rgba(255,193,7,0.3)", borderRadius: 4, padding: "2px 8px", background: "rgba(255,193,7,0.08)" }}>🤖 AGENTS</a>

          </div>
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
          {summary?.total_trades ?? "--"} CLOSED TRADES · LIVE TRACK RECORD
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "24px 20px" }}>

        {/* ── STAT CARDS ── */}
        <motion.div initial="hidden" animate="visible" variants={{visible:{transition:{staggerChildren:0.08}}}} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 24 }}>
          <motion.div variants={{hidden:{opacity:0,y:16},visible:{opacity:1,y:0,transition:{duration:0.3,ease:"easeOut"}}}}>
            <StatCard
              label="TOTAL P&L"
              value={`${pnlPos ? "+" : ""}${summary?.total_pnl?.toFixed(2) ?? "--"}%`}
              sub={`${summary?.total_trades ?? "--"} trades closed`}
              color={pnlPos ? "#00ff88" : "#ff4466"}
            />
          </motion.div>
          <motion.div variants={{hidden:{opacity:0,y:16},visible:{opacity:1,y:0,transition:{duration:0.3,ease:"easeOut"}}}}>
            <StatCard
              label="WIN RATE"
              value={`${summary?.win_rate?.toFixed(1) ?? "--"}%`}
              sub={`${perf?.wins ?? "--"} W · ${perf?.losses ?? "--"} L`}
              color={(summary?.win_rate ?? 0) >= 40 ? "#00ff88" : "#ffd700"}
            />
          </motion.div>
          <motion.div variants={{hidden:{opacity:0,y:16},visible:{opacity:1,y:0,transition:{duration:0.3,ease:"easeOut"}}}}>
            <StatCard
              label="HIGH CONF WIN RATE"
              value={`${summary?.high_conf_win_rate?.toFixed(1) ?? "--"}%`}
              sub={`${summary?.high_conf_trades ?? "--"} trades`}
              color={(summary?.high_conf_win_rate ?? 0) > (summary?.win_rate ?? 0) ? "#00ff88" : "#ffd700"}
            />
          </motion.div>
          <motion.div variants={{hidden:{opacity:0,y:16},visible:{opacity:1,y:0,transition:{duration:0.3,ease:"easeOut"}}}}>
            <StatCard
              label="TP HITS"
              value={`${summary?.tp_hits ?? "--"}`}
              sub="take profit reached"
              color="#00ff88"
            />
          </motion.div>
          <motion.div variants={{hidden:{opacity:0,y:16},visible:{opacity:1,y:0,transition:{duration:0.3,ease:"easeOut"}}}}>
            <StatCard
              label="SL HITS"
              value={`${summary?.sl_hits ?? "--"}`}
              sub="stop loss hit"
              color="#ff4466"
            />
          </motion.div>
        </motion.div>

        {/* ── CHARTS ROW ── */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.3,ease:"easeOut"}} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 10, marginBottom: 24 }}>

          {/* Equity Curve */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 16 }}>EQUITY CURVE — CUMULATIVE P&L</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={equity}>
                <defs>
                  <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "inherit" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "inherit" }} tickLine={false} axisLine={false} tickFormatter={v => `${v.toFixed(0)}%`} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none", background: "transparent" }} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Area type="monotone" dataKey="cumulative_pnl" stroke="#00ff88" strokeWidth={2} fill="url(#eqGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly PnL */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 16 }}>MONTHLY P&L</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly} barCategoryGap="30%" style={{ background: "transparent" }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "inherit" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "inherit" }} tickLine={false} axisLine={false} tickFormatter={v => `${v.toFixed(0)}%`} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
                <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none", background: "transparent" }} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                  {monthly.map((m, i) => <Cell key={i} fill={m.pnl >= 0 ? "#00ff88" : "#ff4466"} fillOpacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ── REGIME PERFORMANCE ── */}
        {evStats.length > 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 16 }}>REGIME PERFORMANCE — EV STATS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {evStats.filter((e: any) => e.win_rate !== null).map((e: any, i: number) => {
                const color = e.regime === "bull" ? "#00ff88" : e.regime === "bear" ? "#ff4466" : "#ffd700";
                const dirColor = e.direction === "BUY" ? "#00ff88" : "#ff4466";
                return (
                  <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${color}20`, borderRadius: 6, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color, textTransform: "uppercase" }}>{e.regime}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: dirColor }}>{e.direction}</span>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                      {e.win_rate !== null ? `${(e.win_rate * 100).toFixed(0)}%` : "—"}
                    </div>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>WIN RATE</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
                      <span style={{ color: e.ev > 0 ? "#00ff88" : "#ff4466" }}>
                        EV {e.ev !== null ? `${e.ev > 0 ? "+" : ""}${e.ev?.toFixed(2)}%` : "—"}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.3)" }}>{e.total_trades} trades</span>
                    </div>
                    <div style={{ marginTop: 8, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                      <div style={{ width: `${Math.min((e.win_rate || 0) * 100, 100)}%`, height: "100%", background: color, borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TRADES TABLE ── */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "16px 18px" }}>

          {/* Table header + filters */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>CLOSED TRADES</div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["ALL", "BUY", "SELL", "TP", "SL"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  background: tab === t ? "rgba(0,255,136,0.15)" : "transparent",
                  border: `1px solid ${tab === t ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 3, padding: "3px 8px",
                  color: tab === t ? "#00ff88" : "rgba(255,255,255,0.3)",
                  fontSize: 9, cursor: "pointer", fontFamily: "inherit",
                }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Column headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "90px 60px 70px 70px 80px 80px 80px 80px 80px", minWidth: 700,
            gap: 8, padding: "6px 10px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em",
          }}>
            <span>SYMBOL</span>
            <span>DIR</span>
            <span>CONF</span>
            <span>PROB</span>
            <span>ENTRY</span>
            <span>EXIT</span>
            <span>OUTCOME</span>
            <span>P&L</span>
            <span>CUMULATIVE</span>
          </div>

          {/* Rows */}
          <div style={{ maxHeight: 480, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 11 }}>No trades</div>
            ) : filtered.map((t, i) => (
              <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{duration:0.2,delay:i*0.02,ease:"easeOut"}} style={{
                display: "grid", gridTemplateColumns: "90px 60px 70px 70px 80px 80px 80px 80px 80px", minWidth: 700,
                gap: 8, padding: "8px 10px",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                fontSize: 10, alignItems: "center",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              }}>
                <span style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 10 }}>{t.symbol.replace(".NS", "").replace("-USD", "")}</span>
                <Chip label={t.direction} color={dc(t.direction)} />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>{t.confidence}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}>{(t.probability * 100).toFixed(0)}%</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}>{t.entry?.toFixed(2)}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}>{t.exit?.toFixed(2)}</span>
                <Chip label={outcomeLabel(t.outcome)} color={outcomeColor(t.outcome)} />
                <span style={{ fontWeight: 700, color: t.pnl_pct >= 0 ? "#00ff88" : "#ff4466", fontSize: 10 }}>
                  {t.pnl_pct >= 0 ? "+" : ""}{t.pnl_pct?.toFixed(2)}%
                </span>
                <span style={{ color: t.cumulative_pnl >= 0 ? "rgba(0,255,136,0.6)" : "rgba(255,68,102,0.6)", fontSize: 9 }}>
                  {t.cumulative_pnl >= 0 ? "+" : ""}{t.cumulative_pnl?.toFixed(2)}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* footer note */}
        <div style={{ textAlign: "center", padding: "20px 0", fontSize: 9, color: "rgba(255,255,255,0.15)" }}>
          Educational signals only — not financial advice · QuantSignal © 2026
        </div>
      </div>
    </div>
  );
}
