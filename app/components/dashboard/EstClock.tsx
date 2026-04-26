"use client";

import { useEffect, useState } from "react";


function EstClock() {
  const [time, setTime] = useState("");
  const [tzIndex, setTzIndex] = useState(0);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const update = () => {
      const tz = TIMEZONES[tzIndex];
      const now = new Date();
      const utc = now.getUTCHours() + now.getUTCMinutes() / 60;
      const local = (utc + tz.offset + 24) % 24;
      const h = Math.floor(local);
      const m = Math.floor((local - h) * 60);
      setTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [tzIndex]);

  const tz = TIMEZONES[tzIndex];

  return (
    <div >
      <div onClick={() => setShowPicker(p => !p)} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 8px" }}>
        <span style={{ fontSize: 11 }}>{tz.flag}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "'IBM Plex Mono', monospace" }}>{time}</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{tz.label}</span>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)" }}>▼</span>
      </div>
      {showPicker && (
        <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "#0e0f14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, overflow: "hidden", zIndex: 100, minWidth: 140 }}>
          {TIMEZONES.map((t, i) => (
            <div key={t.label} onClick={() => { setTzIndex(i); setShowPicker(false); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", background: i === tzIndex ? "rgba(0,255,136,0.08)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 13 }}>{t.flag}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: i === tzIndex ? "#00ff88" : "#fff" }}>{t.label}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>{t.offset >= 0 ? "+" : ""}{t.offset}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// PWA Install prompt

export default EstClock;
