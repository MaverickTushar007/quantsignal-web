"use client";
import { formatPrice } from "../../lib/utils";
import { explainReplay, createCheckout } from "../../lib/api";

interface SignalTabProps {
  activeDetail: any;
  selected: any;
  isMobile: boolean;
  isPro: boolean;
  user: any;
  replayMode: boolean;
  setReplayMode: (v: boolean) => void;
  replayData: any;
  setReplayData: (v: any) => void;
  replayDate: string;
  setReplayDate: (v: string) => void;
  replayLoading: boolean;
  replayAIText: string;
  replayAILoading: boolean;
  showReplayAI: boolean;
  fetchReplayAI: () => void;
}

export default function SignalTab({ activeDetail, selected, isMobile, isPro, user, replayMode, setReplayMode, replayData, setReplayData, replayDate, setReplayDate, replayLoading, replayAIText, replayAILoading, showReplayAI, fetchReplayAI }: SignalTabProps) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "20px 24px", background: "#0d1117" }}>
      {/* LIVE / REPLAY toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "8px 0", borderBottom: "1px solid rgba(0,255,136,0.15)", minHeight: 36, background: "rgba(0,255,136,0.03)", flexWrap: "wrap" }}>
        <button onClick={() => { setReplayMode(false); setReplayData(null); }} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", border: "none", background: !replayMode ? "#00ff88" : "rgba(255,255,255,0.06)", color: !replayMode ? "#000" : "rgba(255,255,255,0.4)" }}>● LIVE</button>
        {(isPro || true) ? (
          <button onClick={() => setReplayMode(true)} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", border: "none", background: replayMode ? "#ffd700" : "rgba(255,255,255,0.06)", color: replayMode ? "#000" : "rgba(255,255,255,0.4)" }}>⏪ REPLAY</button>
        ) : (
          <button onClick={async () => {
            if (!user) { window.location.href = "/auth"; return; }
            const d = await createCheckout(user.email, user.id);
            if (d.checkout_url) window.location.href = d.checkout_url;
          }} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,215,0,0.3)", background: "rgba(255,215,0,0.08)", color: "#ffd700" }}>🔒 REPLAY · PRO</button>
        )}
        {replayMode && (
          <input type="date" value={replayDate}
            max={new Date(Date.now() - 86400000).toISOString().split("T")[0]}
            min={new Date(Date.now() - 175 * 86400000).toISOString().split("T")[0]}
            onChange={e => { setReplayDate(e.target.value); fetchReplay(e.target.value); }}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 6, padding: "4px 10px", fontSize: 10, color: "#ffd700", outline: "none", fontFamily: "inherit" }} />
        )}
        {replayLoading && <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Loading...</span>}
        {replayMode && replayData && (
          <span style={{ fontSize: 9, fontWeight: 700, color: replayData.was_correct ? "#00ff88" : "#ff4466", marginLeft: "auto" }}>
            {replayData.was_correct ? "✓ CORRECT" : "✗ WRONG"} · 5d return: {replayData.actual_return_5d > 0 ? "+" : ""}{replayData.actual_return_5d}%
          </span>
        )}
      </div>

      {/* Historical badge */}
      {replayMode && replayData && (
        <div style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 6, padding: "6px 12px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#ffd700" }}>⏪ HISTORICAL SIGNAL — {replayDate}</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Price was {formatPrice(replayData.current_price, selected?.type, selected?.symbol)} · 5d later: {formatPrice(replayData.actual_price_5d, selected?.type, selected?.symbol)}</span>
          <button onClick={fetchReplayAI} style={{ marginLeft: "auto", background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 5, padding: "3px 10px", fontSize: 9, fontWeight: 700, color: "#ffd700", cursor: "pointer", fontFamily: "inherit" }}>🤖 Explain</button>
        </div>
      )}

      {/* AI Explanation Modal */}
      {showReplayAI && (
        <>
          <div onClick={() => setShowReplayAI(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", zIndex: 200, animation: "fadeIn 0.2s ease" }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "min(520px, 90vw)",
            background: "rgba(12,14,20,0.85)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: 16,
            padding: 24,
            zIndex: 201,
            boxShadow: "0 0 60px rgba(255,215,0,0.08), 0 24px 80px rgba(0,0,0,0.6)",
            animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <style>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)); } to { opacity: 1; transform: translate(-50%, -50%); } }
              @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
            `}</style>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#ffd700", letterSpacing: "0.08em" }}>AI REPLAY ANALYSIS</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{replayData.symbol} · {replayDate} · {replayData.direction}</div>
                </div>
              </div>
              <button onClick={() => setShowReplayAI(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16, padding: 4 }}>✕</button>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
              {replayAILoading && !replayAIText ? (
                <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "20px 0" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffd700", animation: `pulse 1.2s ease ${i*0.2}s infinite` }} />)}
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>Analyzing signal...</span>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontFamily: "inherit", animation: "fadeIn 0.4s ease" }}>
                  {replayAIText}
                  {replayAILoading && <span style={{ animation: "pulse 1s infinite", opacity: 0.6 }}>▊</span>}
                </div>
              )}
            </div>
            {!replayAILoading && replayAIText && (
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 9, color: replayData.was_correct ? "#00ff88" : "#ff4466", fontWeight: 700 }}>
                  {replayData.was_correct ? "✓ SIGNAL WAS CORRECT" : "✗ SIGNAL WAS WRONG"} · {replayData.actual_return_5d > 0 ? "+" : ""}{replayData.actual_return_5d}% in 5 days
                </span>
                <button onClick={() => setShowReplayAI(false)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px 12px", fontSize: 9, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>Close</button>
              </div>
            )}
          </div>
        </>
      )}


      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.05)" }}>
        {windows.map((w, i) => (
          <div key={w.label} style={{ display: "flex", alignItems: "center", gap: 5, flex: 1 }}>
            {i > 0 && <div style={{ width: 1, height: 10, background: "rgba(255,255,255,0.07)", marginRight: 2 }} />}
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: w.active ? w.color : "rgba(255,255,255,0.12)", flexShrink: 0 }} />
            <div style={{ fontSize: 10, fontWeight: w.active ? 700 : 400, color: w.active ? w.color : "rgba(255,255,255,0.25)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{w.label}</div>
          </div>
        ))}
      </div>
      {!isMobile ? (
        <div style={{ height: 420, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 20 }}>
          <TradingChart symbol={selected.symbol} />
        </div>
      ) : (
        <div style={{ height: 260, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 20, position: "relative" }}>
          <TradingChart symbol={selected.symbol} />
        </div>
      )}
      {activeDetail && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { label: "KELLY SIZE", value: `${activeDetail.kelly_size}%`, color: "#00aaff" },
              { label: "CONFLUENCE", value: activeDetail.confluence_score, color: "#00ff88" },
              { label: "RISK/REWARD", value: `${activeDetail.risk_reward}:1`, color: "#ffd700" },
              { label: "VOLUME", value: activeDetail.volume_ratio ? `${activeDetail.volume_ratio}x` : "—", color: activeDetail.volume_ratio >= 2.0 ? "#ff5252" : activeDetail.volume_ratio >= 1.5 ? "#ffc107" : "rgba(255,255,255,0.5)" },
            ].map(b => (
              <div key={b.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "12px 10px" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 6, letterSpacing: "0.1em" }}>{b.label}</div>
                <div style={{ fontSize: isMobile ? 14 : 18, fontWeight: 800, color: b.color }}>{b.value}</div>
              </div>
            ))}
          </div>
          {/* On mobile, show sidebar content inline under signal tab */}
          {isMobile && <SidebarContent />}
        </>
      )}
    </div>
  );

}
