"use client";
import React, { useEffect, useState } from "react";
import { Calendar, TrendingUp, TrendingDown, RefreshCw, Bell, BellOff, X, Info, Zap, Activity, Target, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const API_BASE = "https://quantsignal-api-production.up.railway.app/api/v1";

function formatDate(event: any) {
  const date = event.date_display || "";
  const time = event.time_display || "";
  if (time && time !== "Tentative" && time !== "All Day" && time !== "") {
    return `${date} ${time} EST`;
  }
  return date || "TBA";
}

function isPast(dateStr: string) {
  try { return new Date(dateStr) < new Date(); } catch { return false; }
}

function getCountdown(event: any): string {
  try {
    const d = new Date(event.date);
    const diff = d.getTime() - Date.now();
    if (diff <= 0) return "";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h > 48) return `${Math.floor(h/24)}d`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  } catch { return ""; }
}

export default function EconomicCalendar() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(0);

  // Bell / reminder state
  const [reminderEvent, setReminderEvent] = useState<any | null>(null);
  const [email, setEmail] = useState("");
  const [reminderStatus, setReminderStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(new Set());
  const [impactFilter, setImpactFilter] = useState<"ALL"|"High"|"Medium">("ALL");
  const [infoEvent, setInfoEvent] = useState<any | null>(null);
  const [infoText, setInfoText] = useState("");
  const [infoLoading, setInfoLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/calendar/events`)
      .then(r => r.json())
      .then(d => { setUpcoming(d.upcoming || []); setPast(d.past || []); setLoading(false); })
      .catch(() => { setError("Failed to load calendar"); setLoading(false); });
  }, []);

  const impactColor = (impact: string) => {
    if (impact === "High") return "#ff4466";
    if (impact === "Medium") return "#ffd700";
    return "rgba(255,255,255,0.3)";
  };
  const impactBg = (impact: string) => {
    if (impact === "High") return "rgba(255,68,102,0.1)";
    if (impact === "Medium") return "rgba(255,215,0,0.1)";
    return "rgba(255,255,255,0.05)";
  };

  const openReminder = (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    setReminderEvent(event);
    setReminderStatus("idle");
    setEmail("");
  };

  const closeReminder = () => {
    setReminderEvent(null);
    setReminderStatus("idle");
  };

  const submitReminder = async () => {
    if (!email || !email.includes("@")) return;
    setReminderStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/calendar/remind`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          event_id: reminderEvent.id || reminderEvent.title + reminderEvent.date,
          event_name: reminderEvent.title,
          event_time: reminderEvent.date || new Date().toISOString(),
          impact: reminderEvent.impact,
          playbook_bull: reminderEvent.bullish_scenario || "",
          playbook_bear: reminderEvent.bearish_scenario || "",
        }),
      });
      const data = await res.json();
      if (data.status === "ok" || data.status === "already_subscribed") {
        setReminderStatus("success");
        setSubscribedIds(prev => new Set([...prev, reminderEvent.title]));
        setTimeout(() => closeReminder(), 2000);
      } else {
        setReminderStatus("error");
      }
    } catch {
      setReminderStatus("error");
    }
  };

  const openInfo = async (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    setInfoEvent(event);
    setInfoText("");
    setInfoLoading(true);
    const isPastEvt = isPast(event.date || "");
    const assets = (event.affected_assets || []).join(", ") || "markets";
    const nl = "\n";
    const prompt = isPastEvt
      ? [
          "You are a trading desk analyst. Traders need conclusions not theory. Be extremely concise.",
          "For: " + event.title + " | Forecast: " + (event.forecast ?? "N/A") + " | Previous: " + (event.previous ?? "N/A"),
          "",
          "Respond in this EXACT format (use these exact headers):",
          "",
          "## 📌 What It Is",
          "(1 line only)",
          "",
          "## ⚡ Bottom Line",
          "(2 lines max — what this result means NOW given VIX, Fed, yield curve)",
          "",
          "## 🎯 Trade Zones",
          "",
          "| Asset | Buy Zone | Sell Zone | Stop |",
          "|-------|----------|-----------|------|",
          "(fill in rows for each asset in: " + assets + ")",
          "",
          "## ⚠️ Key Risk",
          "(1 line)",
        ].join(nl)
      : [
          "You are a trading desk analyst. Traders need conclusions not theory. Be extremely concise.",
          "Upcoming event: " + event.title + " | Forecast: " + (event.forecast ?? "N/A") + " | Previous: " + (event.previous ?? "N/A"),
          "",
          "Respond in this EXACT format (use these exact headers):",
          "",
          "## 📌 What It Is",
          "(1 line only)",
          "",
          "## ⚡ Macro Context",
          "(2 lines max — VIX level, Fed stance, yield curve only)",
          "",
          "## 🎯 Pre-Event Playbook",
          "",
          "🟢 **BEAT:** [% move] | Buy zone: [price range] for " + assets,
          "",
          "🔴 **MISS:** [% move] | Sell zone: [price range] for " + assets,
          "",
          "⚪ **IN-LINE:** [expected reaction]",
          "",
          "## ⚠️ Key Risk",
          "(1 line)",
        ].join(nl);
    try {
      const url = API_BASE + "/chat/GENERIC";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: "GENERIC", message: prompt, history: [], user_id: "calendar" }),
      });
      if (!response.body) throw new Error("no body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            try {
              const d = JSON.parse(trimmed.slice(6));
              if (d.type === "token") { text += d.content; setInfoText(t => t + d.content); }
            } catch {}
          }
        }
      }
    } catch { setInfoText("Could not load explanation. Please try again."); }
    setInfoLoading(false);
  };

    const closeInfo = () => { setInfoEvent(null); setInfoText(""); };

  const leadTime = (impact: string) => {
    if (impact === "High") return "60 min";
    if (impact === "Medium") return "30 min";
    return "15 min";
  };

  const EventRow = ({ event, index, isPastEvent }: { event: any; index: number; isPastEvent?: boolean }) => {
    const key = isPastEvent ? 1000 + index : index;
    const isExpanded = expanded === key;
    const forecastNum = parseFloat(event.forecast);
    const prevNum = parseFloat(event.previous);
    const beatsForecast = !isNaN(forecastNum) && !isNaN(prevNum) && forecastNum > prevNum;
    const isSubscribed = subscribedIds.has(event.title);

    return (
      <motion.div
        key={key}
        onClick={() => setExpanded(isExpanded ? null : key)}
        whileHover={{ y: -2, boxShadow: isExpanded ? "0 4px 24px rgba(0,255,136,0.12)" : "0 4px 20px rgba(255,255,255,0.06)" }}
        whileTap={{ scale: 0.995 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{
          background: isPastEvent ? "rgba(255,255,255,0.01)" : isHero ? "rgba(0,255,136,0.03)" : "rgba(255,255,255,0.02)",
          border: isHero ? `1px solid ${isExpanded ? "rgba(0,255,136,0.4)" : "rgba(0,255,136,0.18)"}` : `1px solid ${isExpanded ? "rgba(0,255,136,0.25)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 10,
          padding: isHero ? "18px 20px" : "14px 16px",
          cursor: "pointer",
          opacity: isPastEvent ? 0.75 : 1,
          boxShadow: isHero && !isPastEvent ? "0 0 24px rgba(0,255,136,0.06)" : "none",
        }}>

        {/* Event header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isExpanded ? 14 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{event.flag}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: isHero ? 14 : 12, fontWeight: 700, color: isPastEvent ? "rgba(255,255,255,0.65)" : isHero ? "#fff" : "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {event.title}
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                {formatDate(event)} · {event.country}
              </div>
              {isHero && event.why_it_matters && (
                <div style={{ fontSize: 9, color: "rgba(0,255,136,0.6)", marginTop: 4, fontStyle: "italic" }}>
                  ↳ {event.why_it_matters}
                </div>
              )}
              {isHero && !event.why_it_matters && event.impact === "High" && (
                <div style={{ fontSize: 9, color: "rgba(255,68,102,0.6)", marginTop: 4 }}>
                  ↳ High-impact release — watch for sharp moves at print time
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 10 }}>
            {/* Affected asset chips — visible on collapsed row */}
            {!isExpanded && event.affected_assets?.slice(0,2).map((a: string) => (
              <span key={a} style={{ fontSize: 8, fontWeight: 700, color: "#00aaff", background: "rgba(0,170,255,0.08)", border: "1px solid rgba(0,170,255,0.15)", borderRadius: 3, padding: "1px 5px" }}>{a}</span>
            ))}
            {/* Countdown for upcoming events */}
            {!isPastEvent && (() => { const cd = getCountdown(event); return cd ? (
              <div style={{ fontSize: 9, fontWeight: 700, color: event.impact === "High" ? "#ff4466" : "#ffd700", background: event.impact === "High" ? "rgba(255,68,102,0.08)" : "rgba(255,215,0,0.06)", border: `1px solid ${event.impact === "High" ? "rgba(255,68,102,0.2)" : "rgba(255,215,0,0.15)"}`, borderRadius: 4, padding: "2px 7px", letterSpacing: "0.05em" }}>
                IN {cd}
              </div>
            ) : null; })()}
            {event.forecast && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>FCST</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: beatsForecast ? "#00ff88" : "#ffd700" }}>{event.forecast}</div>
              </div>
            )}
            {event.previous && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>PREV</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{event.previous}</div>
              </div>
            )}
            <div style={{
              background: impactBg(event.impact),
              border: `1px solid ${impactColor(event.impact)}40`,
              borderRadius: 4, padding: "3px 8px",
              fontSize: 9, fontWeight: 700,
              color: impactColor(event.impact),
              letterSpacing: "0.05em",
            }}>
              {event.impact === "High" ? "HIGH" : event.impact?.toUpperCase()}
            </div>

            {/* Info button — always visible */}
            <motion.button
              onClick={(e) => openInfo(e, event)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6, padding: "5px 7px",
                cursor: "pointer", display: "flex", alignItems: "center",
              }}>
              <Info size={11} color="rgba(0,170,255,0.7)" />
            </motion.button>

            {/* Bell icon — only for upcoming events */}
            {!isPastEvent && (
              <motion.button
                onClick={(e) => openReminder(e, event)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: isSubscribed ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isSubscribed ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 6, padding: "5px 7px",
                  cursor: "pointer", display: "flex", alignItems: "center",
                }}>
                {isSubscribed
                  ? <BellOff size={11} color="#00ff88" />
                  : <Bell size={11} color="rgba(255,255,255,0.4)" />
                }
              </motion.button>
            )}
          </div>
        </div>

        {/* Expanded playbook */}
        {isExpanded && !isPastEvent && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 10 }}>QUANT PLAYBOOK</div>
            {/* 3-scenario playbook: bullish / inline / bearish */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
              <div style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                  <TrendingUp size={9} color="#00ff88" />
                  <span style={{ fontSize: 8, fontWeight: 700, color: "#00ff88", letterSpacing: "0.08em" }}>↑ BEAT</span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{event.bullish_scenario || "Better than expected → positive reaction likely."}</div>
              </div>
              <div style={{ background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.12)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                  <span style={{ fontSize: 9 }}>→</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: "#ffd700", letterSpacing: "0.08em" }}>IN LINE</span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{event.inline_scenario || "In-line with forecast → muted reaction, range-bound."}</div>
              </div>
              <div style={{ background: "rgba(255,68,102,0.05)", border: "1px solid rgba(255,68,102,0.15)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                  <TrendingDown size={9} color="#ff4466" />
                  <span style={{ fontSize: 8, fontWeight: 700, color: "#ff4466", letterSpacing: "0.08em" }}>↓ MISS</span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{event.bearish_scenario || "Worse than expected → negative reaction likely."}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>ASSETS AFFECTED:</span>
              {event.affected_assets?.map((a: string) => (
                <span key={a} style={{ fontSize: 9, fontWeight: 700, color: "#00aaff", background: "rgba(0,170,255,0.08)", border: "1px solid rgba(0,170,255,0.2)", borderRadius: 3, padding: "2px 6px" }}>{a}</span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div style={{ padding: "20px 24px", color: "#e2e8f0", height: "100%", overflowY: "auto", fontFamily: "'IBM Plex Mono', monospace", position: "relative" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Calendar size={16} color="#00ff88" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>AI ECONOMIC PLAYBOOK</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 3 }}>LIVE · FOREXFACTORY</span>
        </div>
        {!loading && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{upcoming.length + past.length} EVENTS</span>}
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "40px 0", justifyContent: "center" }}>
          <RefreshCw size={14} color="#00ff88" style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>FETCHING LIVE CALENDAR...</span>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)", borderRadius: 8, padding: "12px 16px", fontSize: 11, color: "#ff6688" }}>{error}</div>
      )}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Impact filter */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {(["ALL","High","Medium"] as const).map(f => (
              <motion.button key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setImpactFilter(f)} style={{
                fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 4,
                border: impactFilter === f ? (f === "High" ? "1px solid rgba(255,68,102,0.5)" : f === "Medium" ? "1px solid rgba(255,215,0,0.5)" : "1px solid rgba(0,255,136,0.4)") : "1px solid rgba(255,255,255,0.08)",
                background: impactFilter === f ? (f === "High" ? "rgba(255,68,102,0.1)" : f === "Medium" ? "rgba(255,215,0,0.08)" : "rgba(0,255,136,0.06)") : "transparent",
                color: impactFilter === f ? (f === "High" ? "#ff4466" : f === "Medium" ? "#ffd700" : "#00ff88") : "rgba(255,255,255,0.3)",
                cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.08em"
              }}>{f === "ALL" ? "ALL" : f === "High" ? "🔴 HIGH" : "🟡 MEDIUM"}</motion.button>
            ))}
          </div>
          {upcoming.length > 0 && <div style={{ fontSize: 9, color: "#00ff88", letterSpacing: "0.15em", fontWeight: 700, padding: "4px 0 8px" }}>▶ UPCOMING EVENTS</div>}
          {upcoming.map((event, i) => <EventRow key={i} event={event} index={i} isHero={i === 0} />)}

          {past.length > 0 && (
            <>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", fontWeight: 700, padding: "16px 0 8px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8 }}>◀ RECENT EVENTS — PAST 5 DAYS</div>
              {past.map((event, i) => <EventRow key={1000 + i} event={event} index={i} isPastEvent />)}
            </>
          )}
        </div>
      )}

      {/* Info Bottom Sheet */}
      <AnimatePresence>
      {infoEvent && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeInfo}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              translate: "-50% -50%",
              background: "#0f1117",
              border: "1px solid rgba(0,170,255,0.2)",
              borderRadius: 20,
              padding: "28px 28px 32px",
              zIndex: 101,
              width: "min(580px, 90vw)",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}>
            <button onClick={closeInfo} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <X size={16} color="rgba(255,255,255,0.4)" />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Info size={14} color="#00aaff" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#00aaff", letterSpacing: "0.1em" }}>INDICATOR GUIDE</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{infoEvent.title}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>{formatDate(infoEvent)} · Impact: {infoEvent.impact}</div>

            {infoEvent.forecast && (
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 16px", flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>FORECAST</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#ffd700" }}>{infoEvent.forecast}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 16px", flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>PREVIOUS</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "rgba(255,255,255,0.6)" }}>{infoEvent.previous}</div>
                </div>
              </div>
            )}

            <div style={{ background: "rgba(0,170,255,0.04)", border: "1px solid rgba(0,170,255,0.1)", borderRadius: 12, padding: "16px 18px", minHeight: 80 }}>
              {infoLoading && !infoText && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                  <RefreshCw size={11} style={{ animation: "spin 1s linear infinite" }} />
                  Perseus is analyzing...
                </div>
              )}
              {infoText && (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }} className="prose-info">
                  <ReactMarkdown
                    components={{
                      h2: ({children}) => {
                        const text = String(children);
                        const iconMap: Record<string, React.ReactNode> = {
                          "What It Is":    <Info size={12} color="#00aaff" />,
                          "Bottom Line":   <Zap size={12} color="#ffd700" />,
                          "Macro Context": <Activity size={12} color="#ffd700" />,
                          "Pre-Event Playbook": <Target size={12} color="#00ff88" />,
                          "Trade Zones":   <Target size={12} color="#00ff88" />,
                          "Key Risk":      <AlertTriangle size={12} color="#ff4444" />,
                        };
                        const clean = text.replace(/[^a-zA-Z\s]/g, "").trim();
                        const match = Object.keys(iconMap).find(k => clean.includes(k));
                        return (
                          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:"0.1em",margin:"18px 0 8px",textTransform:"uppercase",borderBottom:"1px solid rgba(255,255,255,0.06)",paddingBottom:6}}>
                            {match ? iconMap[match] : <Info size={12} color="#00aaff" />}
                            {clean}
                          </div>
                        );
                      },
                      p: ({children}) => <p style={{margin:"0 0 10px",fontSize:12,color:"rgba(255,255,255,0.8)",lineHeight:1.7}}>{children}</p>,
                      strong: ({children}) => <strong style={{color:"#fff",fontWeight:700}}>{children}</strong>,
                      table: ({children}) => <div style={{overflowX:"auto",marginBottom:12}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>{children}</table></div>,
                      th: ({children}) => <th style={{textAlign:"left",padding:"6px 10px",borderBottom:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.35)",fontWeight:600,fontSize:9,letterSpacing:"0.08em",textTransform:"uppercase"}}>{children}</th>,
                      td: ({children}) => <td style={{padding:"7px 10px",borderBottom:"1px solid rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.8)",fontSize:11}}>{children}</td>,
                      li: ({children}) => <li style={{marginBottom:6,color:"rgba(255,255,255,0.75)",fontSize:12,lineHeight:1.6}}>{children}</li>,
                      ul: ({children}) => <ul style={{paddingLeft:16,margin:"0 0 10px"}}>{children}</ul>,
                    }}
                  >{("\n" + infoText)}</ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>

      {/* Reminder Bottom Sheet */}
      {reminderEvent && (
        <>
          {/* Backdrop */}
          <div onClick={closeReminder} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100 }} />

          {/* Sheet */}
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "#0f1117",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px 20px 0 0",
            padding: "24px 24px 40px",
            zIndex: 101,
            maxWidth: 600, margin: "0 auto",
          }}>
            {/* Handle */}
            <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "0 auto 20px" }} />

            {/* Close */}
            <button onClick={closeReminder} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <X size={16} color="rgba(255,255,255,0.4)" />
            </button>

            {/* Event info */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Bell size={14} color="#00ff88" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#00ff88", letterSpacing: "0.1em" }}>SET REMINDER</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{reminderEvent.title}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{formatDate(reminderEvent)}</div>
            </div>

            {/* Auto timing info */}
            <div style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.12)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <Bell size={11} color="#00ff88" />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                You'll be notified <span style={{ color: "#00ff88", fontWeight: 700 }}>{leadTime(reminderEvent.impact)} before</span> this event with the full trade playbook.
              </span>
            </div>

            {reminderStatus === "success" ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#00ff88" }}>Reminder set!</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Check your inbox before the event.</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: "0.08em" }}>YOUR EMAIL</div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submitReminder()}
                    placeholder="you@email.com"
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                      padding: "12px 14px", fontSize: 13, color: "#fff",
                      outline: "none", boxSizing: "border-box",
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  />
                </div>

                <button
                  onClick={submitReminder}
                  disabled={reminderStatus === "loading" || !email.includes("@")}
                  style={{
                    width: "100%", background: email.includes("@") ? "#00ff88" : "rgba(255,255,255,0.08)",
                    border: "none", borderRadius: 10, padding: "14px",
                    fontSize: 13, fontWeight: 700,
                    color: email.includes("@") ? "#000" : "rgba(255,255,255,0.3)",
                    cursor: email.includes("@") ? "pointer" : "not-allowed",
                    transition: "all 0.15s", fontFamily: "'IBM Plex Mono', monospace",
                  }}>
                  {reminderStatus === "loading" ? "Setting reminder..." : "Notify Me →"}
                </button>

                {reminderStatus === "error" && (
                  <div style={{ fontSize: 11, color: "#ff4466", textAlign: "center", marginTop: 12 }}>Something went wrong. Try again.</div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
