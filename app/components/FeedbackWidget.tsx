"use client";
import { useState } from "react";

const API = "https://quantsignal-api-production-a5e1.up.railway.app/api/v1";
const mono = "'IBM Plex Mono', monospace";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rating: 5, message: "" });
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch(`${API}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.status === "ok") {
        setStatus("sent");
        setTimeout(() => {
          setOpen(false);
          setStatus("idle");
          setForm({ name: "", email: "", rating: 5, message: "" });
        }, 2500);
      } else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
    padding: "10px 12px", color: "#fff", fontSize: 12,
    fontFamily: mono, outline: "none", boxSizing: "border-box",
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setOpen(true)}
        title="Share feedback"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 1000,
          width: 48, height: 48, borderRadius: "50%",
          background: "linear-gradient(135deg, #00ff88, #00cc66)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 20px rgba(0,255,136,0.35)",
          fontSize: 20, transition: "transform 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        💬
      </div>

      {/* Modal */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
        >
          <div style={{
            background: "#0e0e12", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16, padding: 28, width: "100%", maxWidth: 420,
            fontFamily: mono,
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 3 }}>Share Your Feedback</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Help us improve QuantSignal</div>
              </div>
              <div onClick={() => setOpen(false)} style={{ cursor: "pointer", fontSize: 18, color: "rgba(255,255,255,0.3)" }}>✕</div>
            </div>

            {status === "sent" ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#00ff88", marginBottom: 6 }}>Thank you!</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Your feedback has been recorded.</div>
              </div>
            ) : (
              <>
                {/* Name */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", marginBottom: 6 }}>YOUR NAME</div>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="e.g. Rahul Sharma" style={inputStyle} />
                </div>

                {/* Email */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", marginBottom: 6 }}>EMAIL ADDRESS</div>
                  <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="you@example.com" type="email" style={inputStyle} />
                </div>

                {/* Rating */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", marginBottom: 8 }}>RATING</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[1,2,3,4,5].map(star => (
                      <div key={star} onClick={() => setForm({...form, rating: star})}
                        style={{
                          fontSize: 24, cursor: "pointer", transition: "transform 0.1s",
                          opacity: star <= form.rating ? 1 : 0.25,
                          transform: star <= form.rating ? "scale(1.1)" : "scale(1)",
                        }}>⭐</div>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", marginBottom: 6 }}>YOUR FEEDBACK</div>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    placeholder="What do you think of QuantSignal? Any features you'd love to see?"
                    rows={4} style={{...inputStyle, resize: "none"} as React.CSSProperties} />
                </div>

                {/* Submit */}
                <div onClick={status === "sending" ? undefined : submit} style={{
                  width: "100%", padding: "12px 0", borderRadius: 8, textAlign: "center",
                  background: status === "sending" ? "rgba(0,255,136,0.2)" : "linear-gradient(135deg, #00ff88, #00cc66)",
                  color: status === "sending" ? "rgba(255,255,255,0.5)" : "#000",
                  fontSize: 11, fontWeight: 800, letterSpacing: "0.1em",
                  cursor: status === "sending" ? "default" : "pointer", boxSizing: "border-box",
                }}>
                  {status === "sending" ? "SENDING..." : status === "error" ? "⚠ TRY AGAIN" : "SUBMIT FEEDBACK →"}
                </div>
                {status === "error" && (
                  <div style={{ fontSize: 9, color: "#ff4466", textAlign: "center", marginTop: 8 }}>
                    Something went wrong. Please try again.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
