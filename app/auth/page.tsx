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
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    setError("");
    setSuccess("");
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

  const input = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "12px 14px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
    WebkitAppearance: "none" as const,
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#060608",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'IBM Plex Mono', monospace",
      padding: "16px",
      boxSizing: "border-box",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "#0c0c10",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "clamp(24px, 5vw, 40px)",
        boxSizing: "border-box",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 800, color: "#fff", flexShrink: 0,
          }}>Q</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.05em" }}>QUANTSIGNAL</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.1em" }}>ML-POWERED TRADING SIGNALS</div>
          </div>
        </div>

        {/* Tab toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 28 }}>
          {(["login", "signup"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "10px 0", borderRadius: 7, border: "none",
              background: mode === m ? "rgba(124,58,237,0.35)" : "transparent",
              color: mode === m ? "#c4b5fd" : "rgba(255,255,255,0.35)",
              fontSize: 11, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: "0.08em", textTransform: "uppercase",
              transition: "all 0.15s",
            }}>{m === "login" ? "SIGN IN" : "CREATE ACCOUNT"}</button>
          ))}
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6, letterSpacing: "0.12em" }}>EMAIL</div>
          <input
            value={email} onChange={e => setEmail(e.target.value)}
            type="email" placeholder="you@example.com"
            style={input}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6, letterSpacing: "0.12em" }}>PASSWORD</div>
          <input
            value={password} onChange={e => setPassword(e.target.value)}
            type="password" placeholder="••••••••"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={input}
          />
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{ background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.25)", borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "#ff6688", marginBottom: 18, lineHeight: 1.5 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)", borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "#00ff88", marginBottom: 18, lineHeight: 1.5 }}>
            {success}
          </div>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "14px 0",
          background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed, #4f46e5)",
          border: "none", borderRadius: 10, color: "#fff",
          fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit", letterSpacing: "0.08em",
          transition: "opacity 0.15s",
          touchAction: "manipulation",
        }}>
          {loading ? "LOADING..." : mode === "login" ? "SIGN IN →" : "CREATE ACCOUNT →"}
        </button>

        {/* Switch mode */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
          {mode === "login" ? "No account? " : "Already have one? "}
          <span onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{ color: "#a78bfa", cursor: "pointer", textDecoration: "underline" }}>
            {mode === "login" ? "Sign up free" : "Sign in"}
          </span>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 10, color: "rgba(255,255,255,0.15)", lineHeight: 1.6 }}>
          Educational signals only · Not financial advice
        </div>
      </div>
    </div>
  );
}
