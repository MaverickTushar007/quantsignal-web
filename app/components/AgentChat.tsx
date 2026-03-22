"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Terminal, Cpu, Brain, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";

const API_BASE = "https://web-production-1a093.up.railway.app/api/v1";

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
  "What's the risk on this trade?",
  "Explain the signal in simple terms",
  "What could go wrong?",
  "Give me entry and exit levels",
  "How does this compare to the market?",
  "Is now a good time to enter?",
];

export default function AgentChat({ symbol }: { symbol: string }) {
  const [messages, setMessages] = useState<Message[]>(GLOBAL_MEMORY.history);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mono = "'IBM Plex Mono', monospace";

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

    // Auto-inject symbol context if not already mentioned
    const contextualMsg = msg.includes(symbol) ? msg : `[Viewing ${symbol}] ${msg}`;

    const userMsg: Message = { role: "user", content: msg };
    const newHistory = [...GLOBAL_MEMORY.history, userMsg];
    GLOBAL_MEMORY.history = newHistory;
    setMessages([...newHistory]);
    setInput("");
    setLoading(true);
    setCurrentStatus([]);
    setShowSuggestions(false);

    try {
      const response = await fetch(`${API_BASE}/chat/${symbol}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol,
          message: contextualMsg,
          history: GLOBAL_MEMORY.history.slice(-10).map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "status") {
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
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%" }}>
            {m.role === "user" ? (
              <div style={{ background: "rgba(0,170,255,0.08)", border: "1px solid rgba(0,170,255,0.15)", borderRadius: 8, padding: "8px 14px", color: "#fff", fontSize: 12, lineHeight: 1.6 }}>
                {m.content}
              </div>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, lineHeight: 1.8 }}>
                <ReactMarkdown>{m.content}</ReactMarkdown>
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
            {["What's the downside?", "Compare to sector", "Show key levels"].map(s => (
              <button key={s} onClick={() => sendMessage(s)} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 4, padding: "4px 10px", fontSize: 9, color: "rgba(255,255,255,0.4)",
                cursor: "pointer", fontFamily: mono, whiteSpace: "nowrap", flexShrink: 0,
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
            placeholder={`Ask about ${symbol}...`}
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

      <style jsx>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
      `}</style>
    </div>
  );
}
