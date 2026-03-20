"use client";
import React, { useEffect, useState } from "react";
import { Calendar, TrendingUp, TrendingDown, AlertCircle, RefreshCw } from "lucide-react";

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
  try {
    return new Date(dateStr) < new Date();
  } catch {
    return false;
  }
}

export default function EconomicCalendar() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/calendar/events`)
      .then(r => r.json())
      .then(d => {
        setUpcoming(d.upcoming || []);
        setPast(d.past || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load calendar");
        setLoading(false);
      });
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

  return (
    <div style={{ padding: "20px 24px", color: "#e2e8f0", height: "100%", overflowY: "auto", fontFamily: "'IBM Plex Mono', monospace" }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Calendar size={16} color="#00ff88" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>AI ECONOMIC PLAYBOOK</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 3 }}>LIVE · FOREXFACTORY</span>
        </div>
        {!loading && (
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{upcoming.length + past.length} EVENTS</span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "40px 0", justifyContent: "center" }}>
          <RefreshCw size={14} color="#00ff88" style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>FETCHING LIVE CALENDAR...</span>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)", borderRadius: 8, padding: "12px 16px", fontSize: 11, color: "#ff6688" }}>
          {error}
        </div>
      )}

      {/* Events */}
      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {upcoming.length > 0 && <div style={{ fontSize: 9, color: "#00ff88", letterSpacing: "0.15em", fontWeight: 700, padding: "4px 0 8px" }}>▶ UPCOMING EVENTS</div>}
          {upcoming.map((event, i) => {
            const past = isPast(event.date);
            const isExpanded = expanded === i;
            const forecastNum = parseFloat(event.forecast);
            const prevNum = parseFloat(event.previous);
            const beatsForecast = !isNaN(forecastNum) && !isNaN(prevNum) && forecastNum > prevNum;

            return (
              <div key={i}
                onClick={() => setExpanded(isExpanded ? null : i)}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${isExpanded ? "rgba(0,255,136,0.25)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  cursor: "pointer",
                  opacity: 1,
                  transition: "all 0.15s",
                }}>

                {/* Event header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isExpanded ? 14 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{event.flag}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {event.title}
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                        {formatDate(event)} · {event.country}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 10 }}>
                    {/* Forecast vs Previous */}
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
                      borderRadius: 4,
                      padding: "3px 8px",
                      fontSize: 9,
                      fontWeight: 700,
                      color: impactColor(event.impact),
                      letterSpacing: "0.05em",
                    }}>
                      {event.impact === "High" ? "HIGH IMPACT" : "MEDIUM"}
                    </div>
                  </div>
                </div>

                {/* Expanded playbook */}
                {isExpanded && (
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

                    {/* Affected assets */}
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
          })}

          {past.length > 0 && (
            <>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", fontWeight: 700, padding: "16px 0 8px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8 }}>◀ RECENT EVENTS — PAST 5 DAYS</div>
              {past.map((event, i) => {
                const isExpanded = expanded === (1000 + i);
                return (
                  <div key={1000+i}
                    onClick={() => setExpanded(isExpanded ? null : 1000 + i)}
                    style={{ background: "rgba(255,255,255,0.01)", border: `1px solid ${isExpanded ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", opacity: 0.75 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{event.flag}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{event.title}</div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>{formatDate(event)} · {event.country}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 10 }}>
                        {event.forecast && <div style={{ textAlign: "right" }}><div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>FORECAST</div><div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)" }}>{event.forecast}</div></div>}
                        {event.previous && <div style={{ textAlign: "right" }}><div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>PREV</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{event.previous}</div></div>}
                        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)" }}>{event.impact.toUpperCase()}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
