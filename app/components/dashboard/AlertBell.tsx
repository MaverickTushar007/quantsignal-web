"use client";

import { useState } from "react";

const API_BASE = "https://quantsignal-api-production-a5e1.up.railway.app/api/v1";


function AlertBell({ symbol }: { symbol: string }) {
  const [state, setState] = useState<"idle"|"input"|"loading"|"done">("idle");
  const [email, setEmail] = useState("");
  const mono = "'IBM Plex Mono', monospace";

  const submit = async () => {
    if (!email || !email.includes("@")) return;
    setState("loading");
    const ok = await subscribeAlert(email, symbol);
    setState(ok ? "done" : "idle");
    if (ok) setTimeout(() => setState("idle"), 3000);
  };

  if (state === "done") return (
    <span style={{ fontSize: 10, color: "#00ff88" }}>✓</span>
  );

  if (state === "input" || state === "loading") return (
    <div onClick={e => e.stopPropagation()} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", 
      background: "#0e0f14", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 8,
      padding: "8px 10px", zIndex: 50, display: "flex", gap: 6, alignItems: "center",
      boxShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
      <input
        autoFocus
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => { e.preventDefault(); if (e.key === "Enter") submit(); if (e.key === "Escape") setState("idle"); }}
        placeholder="your@email.com"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 5, padding: "5px 8px", color: "#fff", fontSize: 10, width: 150,
          fontFamily: mono, outline: "none" }}
      />
      <button onClick={submit} disabled={state === "loading"} style={{
        background: "#00ff88", border: "none", borderRadius: 5, padding: "5px 8px",
        fontSize: 10, fontWeight: 700, color: "#000", cursor: "pointer", fontFamily: mono,
      }}>
        {state === "loading" ? "..." : "SET"}
      </button>
      <button onClick={() => setState("idle")} style={{
        background: "transparent", border: "none", color: "rgba(255,255,255,0.3)",
        cursor: "pointer", fontSize: 12, padding: "0 2px",
      }}>✕</button>
    </div>
  );

  return (
    <button onClick={e => { e.stopPropagation(); setState("input"); }} style={{
      background: "transparent", border: "none", cursor: "pointer",
      color: "rgba(255,255,255,0.2)", fontSize: 12, padding: "0 2px",
      transition: "color 0.15s", flexShrink: 0,
    }} title="Get email alert for this signal">
      🔔
    </button>
  );
}

export default AlertBell;
