// Set to true to disable paywall during beta
const BETA_MODE = true;

"use client";
import { useRouter } from "next/navigation";

const API_BASE = "https://web-production-1a093.up.railway.app/api/v1";

export default function ProGate({
  children,
  isPro,
  user,
  featureName,
}: {
  children: React.ReactNode;
  isPro: boolean;
  user: any;
  featureName: string;
}) {
  const router = useRouter();

  const handleUpgrade = async () => {
    if (!user) {
      router.push("/auth?redirect=upgrade");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/payments/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, user_id: user.id }),
      });
      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch {
      alert("Failed to create checkout. Please try again.");
    }
  };

  if (isPro || BETA_MODE) return <>{children}</>;

  return (
    <div style={{ position: "relative" }}>
      {/* Blurred content */}
      <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none", opacity: 0.4 }}>
        {children}
      </div>

      {/* Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "rgba(8,10,15,0.7)",
        backdropFilter: "blur(2px)",
        borderRadius: 12,
        padding: 24,
        textAlign: "center",
        fontFamily: "'IBM Plex Mono', monospace",
      }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>🔒</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
          {featureName}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 20, lineHeight: 1.6, maxWidth: 260 }}>
          This is a Pro feature. Upgrade to unlock Historical Replay, Trade Guardian, Liquidity Levels, and Portfolio Lab.
        </div>
        <button onClick={handleUpgrade} style={{
          background: "linear-gradient(135deg, #00ff88, #00cc66)",
          border: "none", borderRadius: 10,
          padding: "12px 28px",
          fontSize: 12, fontWeight: 700,
          color: "#000", cursor: "pointer",
          fontFamily: "inherit", marginBottom: 10,
        }}>
          ✨ Upgrade to Pro — ₹999/month
        </button>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
          7-day free trial · Cancel anytime
        </div>
        {!user && (
          <button onClick={() => router.push("/auth")} style={{
            marginTop: 10, background: "none",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8, padding: "8px 20px",
            fontSize: 11, color: "rgba(255,255,255,0.5)",
            cursor: "pointer", fontFamily: "inherit",
          }}>
            Sign in instead
          </button>
        )}
      </div>
    </div>
  );
}
