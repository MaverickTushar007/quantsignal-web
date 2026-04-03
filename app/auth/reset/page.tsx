"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle");
  const [error, setError] = useState("");
  const router = useRouter();
  const mono = "'DM Mono', monospace";

  useEffect(() => {
    // Supabase puts the token in the URL hash — just need the page to exist
  }, []);

  const handleReset = async () => {
    if (!password || password !== confirm) {
      setError("Passwords don't match."); return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    setStatus("loading"); setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setStatus("error"); }
    else { setStatus("done"); setTimeout(() => router.push("/dashboard"), 2000); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
    padding: "12px 14px", color: "#e6edf3", fontSize: 13, outline: "none",
    fontFamily: mono, boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#010409", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 360, background: "#0d1117", border: "1px solid #21262d", borderRadius: 16, padding: "32px 28px" }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#e6edf3", marginBottom: 6 }}>Set new password</div>
        <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 24 }}>Choose a strong password for your account.</div>

        {status === "done" ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 13, color: "#3fb950", fontWeight: 700 }}>Password updated!</div>
            <div style={{ fontSize: 11, color: "#8b949e", marginTop: 6 }}>Redirecting to dashboard...</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 6, letterSpacing: ".08em" }}>NEW PASSWORD</div>
              <input value={password} onChange={e => setPassword(e.target.value)}
                type="password" placeholder="••••••••" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 6, letterSpacing: ".08em" }}>CONFIRM PASSWORD</div>
              <input value={confirm} onChange={e => setConfirm(e.target.value)}
                type="password" placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && handleReset()}
                style={inputStyle} />
            </div>
            {error && <div style={{ fontSize: 11, color: "#f85149", marginBottom: 14, padding: "10px 14px", background: "rgba(248,81,73,0.1)", borderRadius: 8, border: "1px solid rgba(248,81,73,0.3)" }}>{error}</div>}
            <div onClick={status === "loading" ? undefined : handleReset} style={{
              width: "100%", padding: "12px 0", borderRadius: 8, textAlign: "center",
              background: status === "loading" ? "#238636" : "#2ea043",
              color: "#fff", fontSize: 13, fontWeight: 700, cursor: status === "loading" ? "default" : "pointer",
              letterSpacing: ".05em",
            }}>
              {status === "loading" ? "UPDATING..." : "SET NEW PASSWORD →"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}