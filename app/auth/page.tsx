"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const mono = "'IBM Plex Mono', monospace";

  async function handleSubmit() {
    setLoading(true);
    setError("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else router.push("/onboarding");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/dashboard");
    }
    setLoading(false);
  }

  const input: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
    padding: "12px 14px", color: "#fff", fontSize: 12, outline: "none",
    fontFamily: mono, boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#060608", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: mono, padding: 16 }}>
      {/* Grid background */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
      {/* Glow */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,255,136,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, background: "rgba(10,12,20,0.95)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: 16, padding: "clamp(24px,5vw,40px)", boxSizing: "border-box", position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, #00ff88, #00cc66)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#000" }}>Q</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em" }}>QUANT<span style={{ color: "#00ff88" }}>SIGNAL</span></div>
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 9, letterSpacing: "0.12em" }}>ML-POWERED TRADING SIGNALS</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00ff88", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 9, color: "#00ff88", letterSpacing: "0.1em" }}>118 LIVE</span>
          </div>
        </div>

        {/* Tab toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 3, marginBottom: 28, border: "1px solid rgba(255,255,255,0.06)" }}>
          {(["login", "signup"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "9px 0", borderRadius: 6, border: "none",
              background: mode === m ? "rgba(0,255,136,0.12)" : "transparent",
              color: mode === m ? "#00ff88" : "rgba(255,255,255,0.3)",
              fontSize: 10, fontWeight: 700, cursor: "pointer",
              fontFamily: mono, letterSpacing: "0.1em",
              transition: "all 0.15s",
              borderBottom: mode === m ? "1px solid rgba(0,255,136,0.3)" : "1px solid transparent",
            }}>{m === "login" ? "SIGN IN" : "CREATE ACCOUNT"}</button>
          ))}
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: "0.15em" }}>EMAIL</div>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" style={input} />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: "0.15em" }}>PASSWORD</div>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} style={input} />
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 11, color: "#ff6688", marginBottom: 18, lineHeight: 1.5 }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "13px 0",
          background: loading ? "rgba(0,255,136,0.3)" : "linear-gradient(135deg, #00ff88, #00cc66)",
          border: "none", borderRadius: 10, color: "#000",
          fontSize: 12, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
          fontFamily: mono, letterSpacing: "0.08em", transition: "opacity 0.15s",
        }}>
          {loading ? "LOADING..." : mode === "login" ? "SIGN IN →" : "CREATE ACCOUNT →"}
        </button>

        {/* Switch mode */}
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
          {mode === "login" ? "No account? " : "Already have one? "}
          <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: "#00ff88", cursor: "pointer" }}>
            {mode === "login" ? "Sign up free" : "Sign in"}
          </span>
        </div>

        <div style={{ textAlign: "center", marginTop: 14, fontSize: 9, color: "rgba(255,255,255,0.12)", lineHeight: 1.6 }}>
          Educational signals only · Not financial advice
        </div>
      </div>
    </div>
  );
}
