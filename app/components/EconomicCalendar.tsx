"use client";
import React, { useEffect, useState } from "react";
import { Calendar, TrendingUp, TrendingDown, RefreshCw, Bell, BellOff, X } from "lucide-react";

const API_BASE = "https://web-production-1a093.up.railway.app/api/v1";

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
      <div
        key={key}
        onClick={() => setExpanded(isExpanded ? null : key)}
        style={{
          background: isPastEvent ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${isExpanded ? "rgba(0,255,136,0.25)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 10,
          padding: "14px 16px",
          cursor: "pointer",
          opacity: isPastEvent ? 0.75 : 1,
          transition: "all 0.15s",
        }}>

        {/* Event header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isExpanded ? 14 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{event.flag}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: isPastEvent ? "rgba(255,255,255,0.65)" : "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {event.title}
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                {formatDate(event)} · {event.country}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 10 }}>
            {event.forecast && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>FORECAST</div>
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

            {/* Bell icon — only for upcoming events */}
            {!isPastEvent && (
              <button
                onClick={(e) => openReminder(e, event)}
                style={{
                  background: isSubscribed ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isSubscribed ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 6, padding: "5px 7px",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  transition: "all 0.15s",
                }}>
                {isSubscribed
                  ? <BellOff size={11} color="#00ff88" />
                  : <Bell size={11} color="rgba(255,255,255,0.4)" />
                }
              </button>
            )}
          </div>
        </div>

        {/* Expanded playbook */}
        {isExpanded && !isPastEvent && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 10 }}>QUANT PLAYBOOK</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <TrendingUp size={10} color="#00ff88" />
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#00ff88", letterSpacing: "0.08em" }}>BULLISH SCENARIO</span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{event.bullish_scenario}</div>
              </div>
              <div style={{ background: "rgba(255,68,102,0.05)", border: "1px solid rgba(255,68,102,0.15)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <TrendingDown size={10} color="#ff4466" />
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#ff4466", letterSpacing: "0.08em" }}>BEARISH SCENARIO</span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{event.bearish_scenario}</div>
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
      </div>
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
          {upcoming.length > 0 && <div style={{ fontSize: 9, color: "#00ff88", letterSpacing: "0.15em", fontWeight: 700, padding: "4px 0 8px" }}>▶ UPCOMING EVENTS</div>}
          {upcoming.map((event, i) => <EventRow key={i} event={event} index={i} />)}

          {past.length > 0 && (
            <>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", fontWeight: 700, padding: "16px 0 8px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8 }}>◀ RECENT EVENTS — PAST 5 DAYS</div>
              {past.map((event, i) => <EventRow key={1000 + i} event={event} index={i} isPastEvent />)}
            </>
          )}
        </div>
      )}

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
