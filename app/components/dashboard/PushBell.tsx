"use client";

import { usePushNotifications } from "../../hooks/usePushNotifications";


function PushBell() {
  const { supported, subscribed, loading, subscribe, unsubscribe } = usePushNotifications();
  if (!supported) return null;
  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={loading}
      title={subscribed ? "Disable push alerts" : "Enable push alerts"}
      style={{
        background: subscribed ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.06)",
        border: subscribed ? "1px solid rgba(0,255,136,0.4)" : "1px solid rgba(255,255,255,0.1)",
        borderRadius: 6,
        color: subscribed ? "#00ff88" : "rgba(255,255,255,0.4)",
        cursor: loading ? "wait" : "pointer",
        padding: "3px 8px",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.05em",
        display: "flex",
        alignItems: "center",
        gap: 4,
        transition: "all 0.2s",
      }}
    >
      {subscribed ? "🔔 ON" : "🔕 OFF"}
    </button>
  );
}


// ── Track Record Component ────────────────────────────────────────────────
const API_BASE_TR = process.env.NEXT_PUBLIC_API_URL || "https://quantsignal-api-production-a5e1.up.railway.app/api/v1";

export default PushBell;
