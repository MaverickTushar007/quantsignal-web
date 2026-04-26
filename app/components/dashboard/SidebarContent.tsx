"use client";
import ProGate from "../ProGate";
import LiquidityCard from "./LiquidityCard";

interface SidebarContentProps {
  activeDetail: any;
  selected: any;
  isPro: boolean;
  user: any;
  isMobile: boolean;
  showFactors: boolean;
  setShowFactors: (v: boolean) => void;
}

export default function SidebarContent({ activeDetail, selected, isPro, user, isMobile, showFactors, setShowFactors }: SidebarContentProps) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10, letterSpacing: "0.1em" }}>TRADE LEVELS</div>
        {[
          { label: "TP", value: activeDetail.take_profit, color: "#00ff88", pct: "+" + Math.abs(((activeDetail.take_profit - activeDetail.current_price) / activeDetail.current_price) * 100).toFixed(1) },
          { label: "ENTRY", value: activeDetail.current_price, color: "#fff", pct: "0.0" },
          { label: "SL", value: activeDetail.stop_loss, color: "#ff4466", pct: "-" + Math.abs(((activeDetail.stop_loss - activeDetail.current_price) / activeDetail.current_price) * 100).toFixed(1) },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 5, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, color: l.color }}>{l.label}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{l.pct !== "0.0" ? `${l.pct}%` : "ENTRY"}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>${l.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
      {/* Liquidity Levels Card */}
      {selected && ["BTC-USD","ETH-USD","SOL-USD","BNB-USD","XRP-USD","DOGE-USD","ADA-USD","AVAX-USD","DOT-USD","LINK-USD"].includes(selected.symbol) && (
        <ProGate isPro={isPro} user={user} featureName="Liquidity Levels">
          <LiquidityCard symbol={selected.symbol} />
        </ProGate>
      )}
      <div style={{ marginBottom: 20 }}>
        {activeDetail.raw_probability && (() => {
          const final = activeDetail.probability;
          const color = final >= 0.5 ? "#00ff88" : final >= 0.35 ? "#ffd700" : "#ff4466";
          const label = final >= 0.6 ? "HIGH CONFIDENCE" : final >= 0.45 ? "MODERATE" : "LOW CONFIDENCE";
          return (
            <div style={{ marginBottom: 12, padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 6, border: `1px solid ${color}20` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>SIGNAL CONFIDENCE</span>
                <span style={{ fontSize: 16, fontWeight: 800, color, fontFamily: "monospace" }}>{(final * 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ width: `${final * 100}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.5s ease" }} />
              </div>
              <div style={{ fontSize: 10, color, letterSpacing: "0.1em", fontWeight: 700 }}>{label}</div>
            </div>
          );
        })()}
        {/* Signal Reasoning */}
        {activeDetail.context_text && (
          <div style={{
            marginBottom: 12, padding: "10px 12px", borderRadius: 6,
            background: "rgba(0,170,255,0.06)",
            border: "1px solid rgba(0,170,255,0.15)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#00aaff", marginBottom: 6 }}>
              💡 SIGNAL REASONING
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
              {activeDetail.context_text}
            </div>
            {activeDetail.conflict_detected && (
              <div style={{ marginTop: 6, fontSize: 9, color: "#ffd700", display: "flex", alignItems: "center", gap: 4 }}>
                ⚠️ {activeDetail.conflict_reason || "Signal conflict detected — trade with caution"}
              </div>
            )}
          </div>
        )}

        {/* Regime Badge */}
        {activeDetail.regime && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
              padding: "3px 8px", borderRadius: 4,
              background: activeDetail.regime === "bull" ? "rgba(0,255,136,0.1)" : activeDetail.regime === "bear" ? "rgba(255,68,102,0.1)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${activeDetail.regime === "bull" ? "rgba(0,255,136,0.3)" : activeDetail.regime === "bear" ? "rgba(255,68,102,0.3)" : "rgba(255,255,255,0.1)"}`,
              color: activeDetail.regime === "bull" ? "#00ff88" : activeDetail.regime === "bear" ? "#ff4466" : "rgba(255,255,255,0.4)",
            }}>
              {activeDetail.regime === "bull" ? "🐂" : activeDetail.regime === "bear" ? "🐻" : "↔"} {activeDetail.regime?.toUpperCase()} REGIME
            </div>
            {activeDetail.regime_suppressed && (
              <span style={{ fontSize: 10, color: "#ffd700", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)", padding: "2px 6px", borderRadius: 3 }}>
                SUPPRESSED
              </span>
            )}
            {activeDetail.energy && (
              <span style={{
                fontSize: 10, padding: "2px 6px", borderRadius: 3, fontWeight: 700,
                background: activeDetail.energy.state === "releasing" ? "rgba(0,255,136,0.1)" :
                            activeDetail.energy.state === "coiled"    ? "rgba(0,170,255,0.1)" :
                            activeDetail.energy.state === "exhausted" ? "rgba(255,68,102,0.1)" :
                            "rgba(255,255,255,0.05)",
                border: `1px solid ${activeDetail.energy.state === "releasing" ? "rgba(0,255,136,0.3)" :
                                     activeDetail.energy.state === "coiled"    ? "rgba(0,170,255,0.3)" :
                                     activeDetail.energy.state === "exhausted" ? "rgba(255,68,102,0.3)" :
                                     "rgba(255,255,255,0.1)"}`,
                color: activeDetail.energy.state === "releasing" ? "#00ff88" :
                       activeDetail.energy.state === "coiled"    ? "#00aaff" :
                       activeDetail.energy.state === "exhausted" ? "#ff4466" :
                       "rgba(255,255,255,0.4)",
              }}>
                {activeDetail.energy.state === "releasing" ? "⚡" :
                 activeDetail.energy.state === "coiled"    ? "🌀" :
                 activeDetail.energy.state === "exhausted" ? "💤" : "〰"} {activeDetail.energy.state?.toUpperCase()}
              </span>
            )}
          </div>
        )}

        {/* Energy Implication */}
        {activeDetail.energy?.implication && activeDetail.energy.state !== "neutral" && activeDetail.energy.state !== "unknown" && (
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginBottom: 10, padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4, borderLeft: `2px solid ${activeDetail.energy.state === "releasing" ? "rgba(0,255,136,0.3)" : activeDetail.energy.state === "coiled" ? "rgba(0,170,255,0.3)" : "rgba(255,68,102,0.3)"}` }}>
            ⚡ {activeDetail.energy.implication}
          </div>
        )}

        {/* Signal Bias */}
        {activeDetail.signal_bias && (
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginBottom: 10, padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4, borderLeft: "2px solid rgba(255,215,0,0.3)" }}>
            {activeDetail.signal_bias}
          </div>
        )}

        {/* Final probability bar */}
        <div style={{ height: 20, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", display: "flex", marginBottom: 6 }}>
          <div style={{ width: `${activeDetail.probability * 100}%`, background: "linear-gradient(90deg, #00ff88, #00cc66)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#000" }}>
            {(activeDetail.probability * 100).toFixed(0)}%
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#ff4466", fontWeight: 700 }}>
            {((1 - activeDetail.probability) * 100).toFixed(0)}%
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
          <span>BUY</span>
          <span>Agreement: {(activeDetail.model_agreement * 100).toFixed(0)}%</span>
          <span>SELL</span>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
            <div onClick={() => setShowFactors(o => !o)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showFactors ? 10 : 0, cursor: "pointer" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>9-FACTOR CONFLUENCE</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: "#00ff88", background: "rgba(0,255,136,0.1)", padding: "2px 6px", borderRadius: 3 }}>{activeDetail.confluence_score}</span>
                {activeDetail.volume_ratio >= 1.5 && (
                  <span style={{ fontSize: 9, fontWeight: 800, color: activeDetail.volume_ratio >= 2.5 ? "#ff5252" : "#ffc107", background: activeDetail.volume_ratio >= 2.5 ? "rgba(255,82,82,0.1)" : "rgba(255,193,7,0.1)", padding: "2px 6px", borderRadius: 3 }}>
                    ↑ {activeDetail.volume_ratio}x VOL
                  </span>
                )}
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginLeft: 2 }}>{showFactors ? "▲" : "▼"}</span>
              </div>
            </div>
            {showFactors && activeDetail.confluence?.map((c: any) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: c.signal === "BULLISH" ? "#00ff88" : "#ff4466", flexShrink: 0 }} />
                <span style={{ flex: 1, color: "rgba(255,255,255,0.4)", fontSize: 9 }}>{c.name}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: c.signal === "BULLISH" ? "#00ff88" : "#ff4466" }}>{c.signal === "BULLISH" ? "BULL" : "BEAR"}</span>
              </div>
            ))}
          </div>
      <EarningsBadge flag={activeDetail.earnings_flag} />
      <StaleBadge sig={activeDetail} />
      <MarketStatusBadge sig={activeDetail} />
      <MTFBar mtf={activeDetail?.mtf} direction={activeDetail?.direction} />
      <ShockWarning shock={activeDetail?.shock_warning} />
      {activeDetail?.insider?.available && activeDetail.insider.trades?.length > 0 && (
        <div style={{ background: "rgba(255,193,7,0.05)", border: "1px solid rgba(255,193,7,0.2)", borderRadius: 6, padding: "10px 14px", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,193,7,0.7)", letterSpacing: "0.12em", marginBottom: 6 }}>
            INSIDER ACTIVITY · SEC FORM 4 · {activeDetail.insider.summary}
          </div>
          {activeDetail.insider.trades.slice(0, 3).map((t: any, i: number) => (
            <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>
              <span style={{ color: "rgba(255,193,7,0.8)", fontWeight: 700 }}>{t.filer}</span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}> · Form {t.form} · {t.date}</span>
            </div>
          ))}
        </div>
      )}
      {activeDetail && (
        <div style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.12)", borderRadius: 6, padding: "10px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(0,255,136,0.5)", letterSpacing: "0.12em", marginBottom: 6 }}>IN PLAIN ENGLISH</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
            {generateOneLiner(activeDetail)}
          </div>
        </div>
      )}
      {activeDetail.reasoning && (
        <div style={{ background: "rgba(0,170,255,0.05)", border: "1px solid rgba(0,170,255,0.15)", borderRadius: 6, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Database size={10} color="#00aaff" />
            <span style={{ fontSize: 10, fontWeight: 800, color: "#00aaff", letterSpacing: "0.1em" }}>QUANT RAG REASONING</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontStyle: "italic" }}>
            "{activeDetail.reasoning.slice(0, 180)}..."
          </div>
        </div>
      )}
    </div>
  );

  // ── MOBILE LAYOUT ──────────────────────────────────────────────
  if (isMobile && !mounted) return <div style={{ background: "#0d1117", height: "100dvh" }} />;
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#0d1117", fontFamily: "'IBM Plex Mono', monospace", color: "#cbd5e1", overflow: "hidden" }}>
        {/* Mobile top bar */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {mobilePanel !== "LIST" && selected && (
              <button onClick={() => setMobilePanel("LIST")} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                <ChevronLeft size={16} />
              </button>
            )}
            <span style={{ color: "#00ff88", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>● QUANT SIGNALS</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 10 }}>
            <span style={{ color: activeWindow ? activeWindow.color : "rgba(255,255,255,0.2)", fontWeight: 600 }}>
              {activeWindow ? `● ${activeWindow.label.split(" ")[0]}` : "● CLOSED"}
            </span>
            <PushBell />
            <EstClock />
          </div>
        </div>

        {/* Mobile content area */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {mobilePanel === "LIST" && <AssetList />}

          {mobilePanel !== "LIST" && selected && (
            <>
              {/* Asset header */}
              <div style={{ padding: "12px 16px", background: "#0c0c0f", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{selected.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{selected.display}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{selected.name}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}><PriceFlash value={livePrice}>{formatPrice(livePrice || selected.current_price, selected.type, selected.symbol)}</PriceFlash></div>
                  <div style={{ ...badge(selected.direction), display: "inline-block", marginTop: 2 }}>{selected.direction} · {(selected.probability * 100).toFixed(0)}%</div>
                </div>
              </div>

              {/* Tab content */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {mobilePanel === "SIGNAL" && <SignalTab />}
                {mobilePanel === "NEWS" && selected && <NewsTab symbol={selected.symbol} />}
                {mobilePanel === "CHAT" && (
                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "0 16px 16px" }}>
                    <AgentChat symbol={selected.symbol} userId={user?.id} onUpgradeError={(kind, used, limit) => setUpgradeError({kind, used, limit})} />
                  </div>
                )}
                {mobilePanel === "CALENDAR" && <EconomicCalendar />}
              </div>
            </>
          )}
        </div>

        {/* PWA Install Banner */}
        {canInstall && (
          <div style={{ background: "rgba(0,255,136,0.08)", borderTop: "1px solid rgba(0,255,136,0.2)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#00ff88" }}>📲 Install QuantSignal</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Add to home screen for instant access</div>
            </div>
            <button onClick={install} style={{ background: "#00ff88", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 10, fontWeight: 800, color: "#000", cursor: "pointer", fontFamily: "inherit" }}>
              INSTALL
            </button>
          </div>
        )}

        {/* Mobile bottom nav */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "#0a0a0c", display: "flex", flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom)", position: "relative" }}>
          {/* Hamburger menu overlay */}
          {showMobileMenu && (
            <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={() => setShowMobileMenu(false)}>
              <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "#0e0f14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px 16px 0 0", padding: "16px 0" }} onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", padding: "0 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>MORE</div>
                {[
                  { href: "/agents", icon: "🤖", label: "Agents", desc: "Virtual paper trading" },
                  { href: "/research", icon: "🔬", label: "Research", desc: "Evidence-grounded intelligence" },
                  { href: "/documents", icon: "📄", label: "Documents", desc: "PDF & screenshot analysis" },
                  { href: "/xray", icon: "🩻", label: "Portfolio X-Ray", desc: "Concentration & regime fit" },

                  { id: "NEWS", icon: "📰", label: "News Feed", desc: "Live market news" },
                  { id: "ANALYSIS", icon: "📈", label: "Signal Analysis", desc: "Full ML breakdown" },
                ].map(item => (
                  <div key={item.href || item.id} onClick={() => {
                    if (item.href) window.location.href = item.href;
                    else { setMobilePanel(item.id!); setShowMobileMenu(false); }
                  }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{item.label}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3 main tabs */}
          {[
            { id: "LIST", icon: List, label: "SIGNALS" },
            { id: "CHAT", icon: MessageSquare, label: "PERSEUS" },
            { id: "CALENDAR", icon: Calendar, label: "CALENDAR" },
          ].map(tab => {
            const active = mobilePanel === tab.id;
            return (
              <button key={tab.id}
                onClick={() => { if (tab.id !== "LIST" && !selected) return; setMobilePanel(tab.id); setShowMobileMenu(false); }}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0", background: "transparent", border: "none", borderTop: `2px solid ${active ? "#00ff88" : "transparent"}`, color: active ? "#00ff88" : "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "inherit", gap: 3 }}>
                <tab.icon size={16} color={active ? "#00ff88" : "rgba(255,255,255,0.3)"} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>{tab.label}</span>
              </button>
            );
          })}

          {/* Hamburger */}
          <button onClick={() => setShowMobileMenu(m => !m)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0", background: "transparent", border: "none", borderTop: `2px solid ${showMobileMenu ? "#00ff88" : "transparent"}`, color: showMobileMenu ? "#00ff88" : "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "inherit", gap: 3 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ width: 16, height: 2, background: showMobileMenu ? "#00ff88" : "rgba(255,255,255,0.3)", borderRadius: 1 }} />
              <div style={{ width: 16, height: 2, background: showMobileMenu ? "#00ff88" : "rgba(255,255,255,0.3)", borderRadius: 1 }} />
              <div style={{ width: 16, height: 2, background: showMobileMenu ? "#00ff88" : "rgba(255,255,255,0.3)", borderRadius: 1 }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>MORE</span>
          </button>
        </div>
        <TutorialModal />
      </div>
    );
  }


  // ── DEMO GATE (unauthenticated) ────────────────────────────────
  if (mounted && !user) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'IBM Plex Mono', monospace", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#00ff88", letterSpacing: "0.1em" }}>● QUANT SIGNALS</span>
          <a href="/auth" style={{ fontSize: 11, color: "#4ade80", textDecoration: "none", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 6, padding: "6px 14px", letterSpacing: "0.05em" }}>SIGN IN →</a>
        </div>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div style={{ width: 260, borderRight: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", padding: "12px 0" }}>
            <div style={{ padding: "8px 16px 12px", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>LIVE SIGNALS — PREVIEW</div>
            {DEMO_SIGNALS.map((s, i) => (
              <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", opacity: i >= 2 ? 0.35 : 1, filter: i >= 2 ? "blur(1.5px)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{s.symbol}</span>
                  <span style={{ fontSize: 10, color: s.dir === "BUY" ? "#4ade80" : "#ff4466", border: `1px solid ${s.dir === "BUY" ? "rgba(74,222,128,0.3)" : "rgba(255,68,102,0.3)"}`, borderRadius: 4, padding: "1px 6px" }}>{s.dir}</span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>{s.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{s.price}</span>
                  <span style={{ fontSize: 10, color: "#4ade80" }}>{s.prob}% conf.</span>
                </div>
              </div>
            ))}
            <div style={{ padding: "14px 16px", textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>+ 81 MORE ASSETS LOCKED</div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, filter: "blur(10px)", opacity: 0.25, padding: 48, pointerEvents: "none" }}>
              <div style={{ height: 220, background: "rgba(74,222,128,0.12)", borderRadius: 12, marginBottom: 16 }} />
              <div style={{ height: 70, background: "rgba(255,255,255,0.05)", borderRadius: 8, marginBottom: 8 }} />
              <div style={{ height: 70, background: "rgba(255,255,255,0.05)", borderRadius: 8, marginBottom: 8 }} />
              <div style={{ height: 70, background: "rgba(255,255,255,0.05)", borderRadius: 8 }} />
            </div>
            <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 380, padding: "0 24px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 22 }}>🔒</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "-0.02em" }}>ML-Powered Trading Signals</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 28 }}>86 assets · XGBoost + LightGBM ensemble · Perseus AI reasoning · Live track record</div>
              <a href="/auth?mode=signup&ref=demo" style={{ display: "inline-block", background: "#4ade80", color: "#0d1117", fontSize: 12, fontWeight: 700, padding: "12px 32px", borderRadius: 8, textDecoration: "none", letterSpacing: "0.06em", marginBottom: 14 }}>GET FREE ACCESS →</a>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Already have an account? <a href="/auth" style={{ color: "#4ade80", textDecoration: "none" }}>Sign in</a></div>
            </div>
          </div>
        </div>
      </div>
    );
  }


}
