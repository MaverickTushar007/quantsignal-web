"use client";


function EarningsBadge({ flag }: { flag?: any }) {
  if (!flag) return null;
  const urgent = flag.days_until <= 2;
  return (
    <span style={{
      fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 3,
      background: urgent ? "rgba(255,200,0,0.15)" : "rgba(255,200,0,0.08)",
      border: `1px solid ${urgent ? "rgba(255,200,0,0.5)" : "rgba(255,200,0,0.2)"}`,
      color: urgent ? "#ffc800" : "rgba(255,200,0,0.6)",
      letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0,
    }}>
      ⚡ EARNINGS {flag.label}
    </span>
  );
}

export default EarningsBadge;
