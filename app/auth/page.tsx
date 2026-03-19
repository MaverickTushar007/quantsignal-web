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
      else setSuccess("Check your email to confirm your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060608", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Mono', monospace" }}>
      <div style={{ width: 400, background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 32 }}>
        
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>Q</div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>QuantSignal</span>
        </div>

        {/* Tab toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 4, marginBottom: 24 }}>
          {(["login", "signup"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: mode === m ? "rgba(124,58,237,0.3)" : "transparent", color: mode === m ? "#a78bfa" : "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {m}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6, letterSpacing: "0.1em" }}>EMAIL</div>
          <input value={email} onChange={e => setEmail(e.target.value)}
            type="email" placeholder="you@example.com"
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "10px 12px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6, letterSpacing: "0.1em" }}>PASSWORD</div>
          <input value={password} onChange={e => setPassword(e.target.value)}
            type="password" placeholder="••••••••"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "10px 12px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>

        {/* Error / Success */}
        {error && <div style={{ background: "rgba(255,68,102,0.1)", border: "1px solid rgba(255,68,102,0.2)", borderRadius: 6, padding: "10px 12px", fontSize: 11, color: "#ff4466", marginBottom: 16 }}>{error}</div>}
        {success && <div style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 6, padding: "10px 12px", fontSize: 11, color: "#00ff88", marginBottom: 16 }}>{success}</div>}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", padding: "12px 0", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: "0.05em", opacity: loading ? 0.7 : 1 }}>
          {loading ? "..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
          Educational signals only — not financial advice
        </div>
      </div>
    </div>
  );
}
