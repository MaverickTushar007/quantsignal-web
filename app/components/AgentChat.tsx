"use client";
import { getUserId } from "../lib/api";
import { useState, useEffect, useRef } from "react";
import { Send, Terminal, Cpu, Brain, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://quantsignal-api.onrender.com/api/v1";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Global memory — persists across asset switches in the same session
const GLOBAL_MEMORY: { history: Message[]; watchlist: string[] } = {
  history: [],
  watchlist: [],
};

const SUGGESTED = [
  "Should I enter this trade now?",
  "What invalidates this setup?",
  "Give me the full trade plan",
  "What's the strongest bearish factor?",
  "Explain the signal in plain English",
  "What event risk matters today?",
];

const FOLLOWUPS = [
  "What invalidates this?",
  "Show key levels",
  "Compare to market",
  "What's the downside?",
  "Turn this into a trade plan",
];

// Parse verdict card from assistant response
function parseVerdict(content: string): { action: string; conviction: string; kelly: string; entry: string; target: string; stop: string; color: string } | null {
  const verdictIdx = content.indexOf("🤖 PERSEUS VERDICT");
  if (verdictIdx === -1) return null;
  const block = content.slice(verdictIdx);
  const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
  const clean = (s: string) => s.replace(/\*+/g, "").replace(/_{1,2}/g, "").trim();
  const get = (key: string) => {
    const l = lines.find(l => l.toLowerCase().startsWith(key.toLowerCase()));
    return l ? clean(l.replace(new RegExp(`^${key}\\s*[:–]\\s*`, "i"), "")) : "";
  };
  const action = get("Action").toUpperCase().split(/[,.(]/)[0].trim();
  if (!action) return null;
  const convRaw = get("Conviction");
  const conviction = convRaw.split(/[–—]/)[0].trim().slice(0, 18).toUpperCase();
  const color = action.includes("BUY") || action.includes("LONG") ? "#00ff88"
    : action.includes("SELL") || action.includes("SHORT") ? "#ff4466" : "#ffd700";
  return { action, conviction, kelly: get("Kelly-optimal size"), entry: get("Entry zone"), target: get("Target"), stop: get("Stop"), color };
}

function stripVerdictBlock(content: string): string {
  const idx = content.indexOf("🤖 PERSEUS VERDICT");
  return idx === -1 ? content : content.slice(0, idx).trim();
}

export default function AgentChat({ symbol, userId, onUpgradeError }: { symbol: string; userId?: string; onUpgradeError?: (kind: "perseus", used: number, limit: number) => void }) {
  const [messages, setMessages] = useState<Message[]>(GLOBAL_MEMORY.history);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [quantMode, setQuantMode] = useState(() => localStorage.getItem("qs_perseus_mode") === "quant");
  const scrollRef = useRef<HTMLDivElement>(null);
  const mono = "'IBM Plex Mono', monospace";

  const toggleMode = () => {
    const newMode = quantMode ? false : true;
    setQuantMode(newMode);
    localStorage.setItem("qs_perseus_mode", newMode ? "quant" : "simple");
  };

  // Track watchlist
  useEffect(() => {
    if (symbol && !GLOBAL_MEMORY.watchlist.includes(symbol)) {
      GLOBAL_MEMORY.watchlist.push(symbol);
      if (GLOBAL_MEMORY.watchlist.length > 10) GLOBAL_MEMORY.watchlist.shift();
    }
  }, [symbol]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentStatus]);

  // Sync local state with global memory
  useEffect(() => {
    setMessages(GLOBAL_MEMORY.history);
  }, []);

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;

    // Only inject symbol context if message seems asset-specific
    const assetKeywords = ["signal", "trade", "buy", "sell", "entry", "exit", "stop", "target", "chart", "price", "trend"];
    const isAssetSpecific = assetKeywords.some(k => msg.toLowerCase().includes(k)) || msg.includes(symbol);
    const contextualMsg = isAssetSpecific && !msg.includes(symbol) ? `[Viewing ${symbol}] ${msg}` : msg;

    const userMsg: Message = { role: "user", content: msg };
    const newHistory = [...GLOBAL_MEMORY.history, userMsg];
    GLOBAL_MEMORY.history = newHistory;
    setMessages([...newHistory]);
    setInput("");
    setLoading(true);
    setCurrentStatus([]);
    setShowSuggestions(false);

    try {
      // Prefetch liquidity data to inject into context
      let liquidityCtx = "";
      if (symbol && symbol !== "GENERIC") {
        try {
          const liqRes = await fetch(`${API_BASE}/liquidity/${symbol}`);
          if (liqRes.ok) {
            const liq = await liqRes.json();
            liquidityCtx = `LIQUIDITY: OI ${liq.oi_change_24h_pct > 0 ? "+" : ""}${liq.oi_change_24h_pct}% 24h | Funding ${liq.funding_trend} | L/S ${liq.long_ratio}% long | Bias: ${liq.bias}`;
          }
        } catch {}
      }

      const finalMsg = liquidityCtx ? `${contextualMsg}

[LIQUIDITY DATA: ${liquidityCtx}]` : contextualMsg;

      let assistantContent = "";
      let attempts = 0;
      const MAX_RETRIES = 2;

      while (attempts <= MAX_RETRIES) {
        attempts++;
        let response: Response;
        try {
          response = await fetch(`${API_BASE}/chat/${symbol}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              symbol,
              message: finalMsg,
              mode: quantMode ? "quant" : "simple",
              history: GLOBAL_MEMORY.history.slice(-10).map(m => ({ role: m.role, content: m.content })),
              user_id: getUserId(),
              partial: assistantContent || undefined,
            }),
          });
        } catch (networkErr) {
          if (attempts > MAX_RETRIES) throw networkErr;
          await new Promise(r => setTimeout(r, 1500 * attempts));
          continue;
        }
        if (response.status === 429) {
          let detail: any = {};
          try { detail = await response.json(); } catch {}
          const used  = detail.used  ?? 5;
          const limit = detail.limit ?? 5;
          if (onUpgradeError) { onUpgradeError("perseus", used, limit); }
          else { setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Perseus limit reached (${used}/${limit} today). Upgrade to Pro for unlimited access.` }]); }
          return;
        }
        if (!response.body) throw new Error("No response body");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let streamOk = false;
        try {
          while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "error") {
                if (data.message === "token_limit") {
                  if (onUpgradeError) { onUpgradeError("perseus", data.used, data.limit); }
                  else { setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Message too long for free plan. Upgrade to Pro for unlimited.` }]); }
                } else {
                  setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${data.message}` }]);
                }
                return;
              } else if (data.type === "status") {
                setCurrentStatus(prev => [...prev, data.message]);
              } else if (data.type === "token") {
                assistantContent += data.content;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last && last.role === "assistant") {
                    return [...prev.slice(0, -1), { ...last, content: assistantContent }];
                  } else {
                    return [...prev, { role: "assistant", content: assistantContent }];
                  }
                });
              }
            } catch (e) {}
          }
        }
          }
        } catch (streamErr) {
          if (attempts > MAX_RETRIES) throw streamErr;
          await new Promise(r => setTimeout(r, 1500 * attempts));
          continue;
        }
        break;
      }


      // Save assistant response to global memory
      if (assistantContent) {
        GLOBAL_MEMORY.history = [...GLOBAL_MEMORY.history, { role: "assistant", content: assistantContent }];
        // Keep last 20 messages to avoid token bloat
        if (GLOBAL_MEMORY.history.length > 20) {
          GLOBAL_MEMORY.history = GLOBAL_MEMORY.history.slice(-20);
        }
      }

    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error — please try again." }]);
    } finally {
      setLoading(false);
      setCurrentStatus([]);
    }
  };

  const clearMemory = () => {
    GLOBAL_MEMORY.history = [];
    setMessages([]);
    setShowSuggestions(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0a0a0f", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", fontFamily: mono }}>
      {/* Header */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <Brain size={14} color="#00ff88" />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#e2e8f0" }}>PERSEUS</span>
        <span style={{ fontSize: 9, color: "rgba(0,255,136,0.5)", background: "rgba(0,255,136,0.05)", padding: "2px 6px", borderRadius: 4 }}>
          {symbol}
        </span>
        {GLOBAL_MEMORY.watchlist.length > 1 && (
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginLeft: 4 }}>
            +{GLOBAL_MEMORY.watchlist.length - 1} tracked
          </span>
        )}
        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
          <button
            onClick={() => !quantMode ? null : toggleMode()}
            style={{
              fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 3,
              border: !quantMode ? "1px solid rgba(0,255,136,0.5)" : "1px solid rgba(255,255,255,0.08)",
              background: !quantMode ? "rgba(0,255,136,0.08)" : "transparent",
              color: !quantMode ? "#00ff88" : "rgba(255,255,255,0.25)",
              cursor: quantMode ? "pointer" : "default",
              fontFamily: mono, letterSpacing: "0.08em",
              boxShadow: !quantMode ? "0 0 8px rgba(0,255,136,0.15)" : "none",
              transition: "all 0.15s",
            }}
          >◎ SIMPLE</button>
          <button
            onClick={() => quantMode ? null : toggleMode()}
            style={{
              fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 3,
              border: quantMode ? "1px solid rgba(0,255,136,0.5)" : "1px solid rgba(255,255,255,0.08)",
              background: quantMode ? "rgba(0,255,136,0.08)" : "transparent",
              color: quantMode ? "#00ff88" : "rgba(255,255,255,0.25)",
              cursor: !quantMode ? "pointer" : "default",
              fontFamily: mono, letterSpacing: "0.08em",
              boxShadow: quantMode ? "0 0 8px rgba(0,255,136,0.15)" : "none",
              transition: "all 0.15s",
            }}
          >⚗ QUANT</button>
        </div>
        {messages.length > 0 && (
          <button onClick={clearMemory} style={{ marginLeft: "auto", background: "transparent", border: "none", fontSize: 9, color: "rgba(255,255,255,0.2)", cursor: "pointer", fontFamily: mono }}>
            CLEAR
          </button>
        )}
        {messages.length === 0 && (
          <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(0,255,136,0.4)", letterSpacing: "0.1em" }}>MEMORY ON</span>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Empty state with suggested prompts */}
        {messages.length === 0 && showSuggestions && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.4, marginBottom: 8 }}>
              <Cpu size={14} />
              <span style={{ fontSize: 11 }}>Ask anything about {symbol}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SUGGESTED.map(s => (
                <button key={s} onClick={() => sendMessage(s)} style={{
                  background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)",
                  borderRadius: 6, padding: "6px 12px", fontSize: 10, color: "rgba(255,255,255,0.6)",
                  cursor: "pointer", fontFamily: mono, textAlign: "left", lineHeight: 1.4,
                  transition: "all 0.15s",
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: m.role === "user" ? "80%" : "95%", width: m.role === "assistant" ? "100%" : undefined }}>
            {m.role === "user" ? (
              <div style={{ background: "rgba(0,170,255,0.08)", border: "1px solid rgba(0,170,255,0.15)", borderRadius: 8, padding: "8px 14px", color: "#fff", fontSize: 12, lineHeight: 1.6 }}>
                {m.content}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Verdict card — shown if response contains action/verdict */}
                {(() => {
                  const verdict = parseVerdict(m.content);
                  if (!verdict) return null;
                  return (
                    <div style={{ background: `${verdict.color}08`, border: `1px solid ${verdict.color}35`, borderRadius: 8, padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: verdict.entry ? 10 : 0 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: verdict.color, fontFamily: mono, letterSpacing: "0.05em" }}>{verdict.action}</div>
                        {verdict.conviction && (
                          <div style={{ fontSize: 9, fontWeight: 700, color: verdict.color, background: `${verdict.color}18`, padding: "2px 8px", borderRadius: 3, letterSpacing: "0.1em" }}>
                            {verdict.conviction}
                          </div>
                        )}
                        {verdict.kelly && (
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>SIZE {verdict.kelly}</div>
                        )}
                      </div>
                      {verdict.entry && (
                        <div style={{ display: "flex", gap: 16, borderTop: `1px solid ${verdict.color}20`, paddingTop: 8 }}>
                          {[["ENTRY", verdict.entry], ["TARGET", verdict.target], ["STOP", verdict.stop]].map(([label, val]) => val ? (
                            <div key={label}>
                              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", marginBottom: 2 }}>{label}</div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: label === "TARGET" ? "#00ff88" : label === "STOP" ? "#ff4466" : "rgba(255,255,255,0.8)" }}>{val}</div>
                            </div>
                          ) : null)}
                        </div>
                      )}
                    </div>
                  );
                })()}
                {/* Tool status strip — shown during/after streaming */}
                {currentStatus.length > 0 && i === messages.length - 1 && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {currentStatus.map((s, si) => (
                      <div key={si} style={{ fontSize: 8, color: "rgba(0,255,136,0.6)", background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.12)", padding: "2px 7px", borderRadius: 3, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#00ff88" }} />
                        {s}
                      </div>
                    ))}
                  </div>
                )}
                {/* Main response body */}
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, lineHeight: 1.9, letterSpacing: "0.01em" }}>
                  <ReactMarkdown>{stripVerdictBlock(m.content)}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Status */}
        {loading && (
          <div style={{ alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 6 }}>
            {currentStatus.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.03)", padding: "3px 8px", borderRadius: 4, width: "fit-content" }}>
                <Terminal size={9} />
                {s}
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#00ff88", marginLeft: 2 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#00ff88", animation: "pulse 1.5s infinite" }} />
              thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
        {/* Quick suggestions when there are messages */}
        {messages.length > 0 && !loading && (
          <div style={{ display: "flex", gap: 6, marginBottom: 8, overflowX: "auto", paddingBottom: 4 }}>
            {FOLLOWUPS.map(s => (
              <button key={s} onClick={() => sendMessage(s)} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 4, padding: "4px 10px", fontSize: 9, color: "rgba(255,255,255,0.35)",
                cursor: "pointer", fontFamily: mono, whiteSpace: "nowrap", flexShrink: 0,
                transition: "all 0.15s",
              }}>
                {s}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 8px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything — markets, signals, macro, strategy..."
            style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 12, outline: "none", padding: "8px 4px", fontFamily: mono }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{ background: "transparent", border: "none", color: input.trim() ? "#00ff88" : "rgba(255,255,255,0.2)", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <Send size={15} />
          </button>
        </div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.12)", marginTop: 6, textAlign: "center" }}>
          Memory active · Conversation persists as you switch assets
        </div>
      </div>

    </div>
  );
}
