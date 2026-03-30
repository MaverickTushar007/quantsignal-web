"use client";

interface Props {
  kind: "signals" | "perseus";
  used: number;
  limit: number;
  onClose: () => void;
}

export default function UpgradeModal({ kind, used, limit, onClose }: Props) {
  const isSignal  = kind === "signals";
  const emoji     = isSignal ? "📊" : "🧠";
  const label     = isSignal ? "Signal" : "Perseus message";
  const color     = isSignal ? "#00ff88" : "#aa88ff";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={onClose}>
      <div style={{ background:"#0d1117", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:"32px 28px", maxWidth:420, width:"90%", textAlign:"center" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ fontSize:36, marginBottom:12 }}>{emoji}</div>
        <div style={{ fontSize:16, fontWeight:800, color:"#fff", marginBottom:8, fontFamily:"IBM Plex Mono,monospace" }}>
          {label} limit reached
        </div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:24, lineHeight:1.7 }}>
          You've used <span style={{ color, fontWeight:700 }}>{used}/{limit}</span> {label.toLowerCase()}s today on the Free plan.<br/>
          Upgrade to Pro for unlimited access.
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <a href="/pricing"
            style={{ background:`linear-gradient(135deg,${color},${isSignal?"#00cc66":"#8866cc"})`, color:"#000", fontWeight:700, fontSize:12, padding:"11px 24px", borderRadius:10, textDecoration:"none", fontFamily:"IBM Plex Mono,monospace" }}>
            Upgrade to Pro — ₹999/mo
          </a>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)", fontSize:12, padding:"11px 18px", borderRadius:10, cursor:"pointer", fontFamily:"IBM Plex Mono,monospace" }}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
