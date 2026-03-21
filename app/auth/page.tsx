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

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/onboarding" }
    });
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

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* Google */}
        <button onClick={handleGoogle} style={{ width: "100%", padding: "12px 0", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: mono, letterSpacing: "0.05em", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          CONTINUE WITH GOOGLE
        </button>

        {/* Guest */}
        <button onClick={() => router.push("/dashboard")} style={{ width: "100%", padding: "11px 0", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: mono, letterSpacing: "0.05em", marginBottom: 4 }}>
          CONTINUE AS GUEST →
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
