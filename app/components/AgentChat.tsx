"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Terminal, Cpu, Database, Brain, CheckCircle2, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  status?: string[];
}

export default function AgentChat({ symbol }: { symbol: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentStatus]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setCurrentStatus([]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${symbol}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol,
          message: input,
          history: messages.map(m => ({ role: m.role, content: m.content }))
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
                // Update the last assistant message or add a new one
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last && last.role === "assistant") {
                    return [...prev.slice(0, -1), { ...last, content: assistantContent }];
                  } else {
                    return [...prev, { role: "assistant", content: assistantContent }];
                  }
                });
              } else if (data.type === "error") {
                console.error("Chat error:", data.message);
              }
            } catch (e) {
              // Ignore partial JSON chunks
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
      setCurrentStatus([]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0a0a0f", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <Brain size={16} color="#00ff88" />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#e2e8f0" }}>PERSEUS ENGINE 1.0</span>
        <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(0,255,136,0.5)", background: "rgba(0,255,136,0.05)", padding: "2px 6px", borderRadius: 4 }}>AGENTIC CLOUD</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 24 }}>
        {messages.length === 0 && !loading && (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.2 }}>
            <Cpu size={48} style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 12 }}>What would you like to know about {symbol}?</div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
            <div style={{ 
              background: m.role === "user" ? "rgba(0,170,255,0.1)" : "transparent",
              border: m.role === "user" ? "1px solid rgba(0,170,255,0.2)" : "none",
              borderRadius: 8, padding: m.role === "user" ? "10px 14px" : "0",
              color: m.role === "user" ? "#fff" : "rgba(255,255,255,0.85)",
              fontSize: 13, lineHeight: 1.6
            }}>
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Status Bubbles */}
        {loading && (
          <div style={{ alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 8 }}>
            {currentStatus.map((s, i) => (
              <div key={i} style={{ 
                display: "flex", alignItems: "center", gap: 8, 
                fontSize: 10, color: "rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.03)", padding: "4px 10px", 
                borderRadius: 4, width: "fit-content",
                animation: "fadeIn 0.3s ease-in"
              }}>
                <Terminal size={10} />
                {s}
              </div>
            ))}
            {currentStatus.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: "#00ff88", marginLeft: 4 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#00ff88", animation: "pulse 1.5s infinite" }} />
                AI is thinking...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 8px" }}>
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder={`Ask about ${symbol} momentum, risk or RAG insights...`}
            style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 12, outline: "none", padding: "8px 4px", fontFamily: "inherit" }}
          />
          <button 
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ background: "transparent", border: "none", color: input.trim() ? "#00ff88" : "rgba(255,255,255,0.2)", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
