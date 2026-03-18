"use client";
import React from "react";
import { Calendar, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

const events = [
  {
    id: 1,
    time: "Tomorrow, 8:30 AM EST",
    event: "Core CPI (MoM)",
    impact: "HIGH",
    playbook: "BULLISH SCENARIO: If CPI is < 0.2%, ETH and BTC likely break HTF resistance. BEARISH SCENARIO: If > 0.4%, expect immediate liquidity sweep below $2,400.",
    sentiment: "MIXED"
  },
  {
    id: 2,
    time: "Mar 20, 2:00 PM EST",
    event: "FOMC Interest Rate Decision",
    impact: "CRITICAL",
    playbook: "BULLISH SCENARIO: Rate pause + Dovish presser fuels continuation. BEARISH SCENARIO: Unexpected hike or Hawkish shift triggers 5-8% drawdown on RISK-ON assets.",
    sentiment: "BULLISH"
  },
  {
    id: 3,
    time: "Apr 5, 8:30 AM EST",
    event: "Non-Farm Payrolls (NFP)",
    impact: "HIGH",
    playbook: "BULLISH SCENARIO: Employment cooling supports rate cuts. BEARISH SCENARIO: Strong labor market maintains 'Higher for Longer' narrative.",
    sentiment: "BEARISH"
  }
];

export default function EconomicCalendar() {
  return (
    <div style={{ padding: "24px", color: "#e2e8f0", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <Calendar size={20} color="#00ff88" />
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>AI Economic Playbook</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {events.map(event => (
          <div key={event.id} style={{ 
            background: "rgba(255,255,255,0.02)", 
            border: "1px solid rgba(255,255,255,0.06)", 
            borderRadius: 12, 
            padding: 20,
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              width: 3, 
              height: "100%", 
              background: event.impact === "CRITICAL" ? "#ff4466" : "#ffd700" 
            }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 4 }}>{event.time}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{event.event}</div>
              </div>
              <div style={{ 
                fontSize: 9, 
                fontWeight: 800, 
                padding: "4px 8px", 
                borderRadius: 4, 
                background: event.impact === "CRITICAL" ? "rgba(255,68,102,0.1)" : "rgba(255,215,0,0.1)",
                color: event.impact === "CRITICAL" ? "#ff4466" : "#ffd700",
                border: `1px solid ${event.impact === "CRITICAL" ? "rgba(255,68,102,0.2)" : "rgba(255,215,0,0.2)"}`
              }}>
                {event.impact} IMPACT
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(0,0,0,0.2)", padding: 16, borderRadius: 8, border: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ background: "rgba(0,255,136,0.1)", padding: 8, borderRadius: 6 }}>
                <AlertCircle size={16} color="#00ff88" />
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.3)", marginBottom: 6, letterSpacing: "0.1em" }}>QUANT PLAYBOOK</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.7)" }}>
                  {event.playbook.split(": ").map((part, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      <span style={{ color: i === 1 ? "#00ff88" : i === 2 ? "#ff4466" : "inherit", fontWeight: i > 0 ? 600 : 400 }}>{part}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
               <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>ASSETS AFFECTED: <span style={{ color: "#fff", fontWeight: 600 }}>BTC, ETH, SPY, QQQ</span></div>
               <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 600 }}>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>PRE-EVENT BIAS:</span>
                  {event.sentiment === "BULLISH" ? <TrendingUp size={12} color="#00ff88" /> : event.sentiment === "BEARISH" ? <TrendingDown size={12} color="#ff4466" /> : <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffd700" }} />}
                  <span style={{ color: event.sentiment === "BULLISH" ? "#00ff88" : event.sentiment === "BEARISH" ? "#ff4466" : "#ffd700" }}>{event.sentiment}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
