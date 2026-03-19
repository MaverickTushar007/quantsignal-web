"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Terminal, Cpu, Database, Brain, X, MessageSquare, Sparkles, Activity, ShieldCheck, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  status?: string[];
}

export default function FinSightDrawer({ symbol }: { symbol: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, currentStatus]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setCurrentStatus([]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://web-production-1a093.up.railway.app/api/v1"}/chat/${symbol}`, {
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
              if (data.type === "status") setCurrentStatus(prev => [...prev, data.message]);
              else if (data.type === "token") {
                assistantContent += data.content;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last && last.role === "assistant") return [...prev.slice(0, -1), { ...last, content: assistantContent }];
                  return [...prev, { role: "assistant", content: assistantContent }];
                });
              }
            } catch (e) { }
          }
        }
      }
    } catch (err) { console.error(err); } finally { setLoading(false); setCurrentStatus([]); }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center hover:scale-110 transition-transform z-50 group active:scale-95"
        >
          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <Zap className="group-hover:fill-current relative z-10" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Scrim Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[51]"
            />

            {/* Side Drawer */}
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[450px] bg-[#08080a] border-l border-white/5 shadow-[-20px_0_40px_rgba(0,0,0,0.8)] z-[52] flex flex-col"
            >
              {/* Header: Glassmorphic Analyst Banner */}
              <div className="p-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <ShieldCheck className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white tracking-widest uppercase italic">FINSIGHT ELITE</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[9px] text-white/30 font-bold tracking-tighter uppercase">Neural Status: Online</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Chat Canvas */}
              <div 
                ref={scrollRef} 
                className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth custom-scrollbar"
              >
                {messages.length === 0 && !loading && (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4 px-12">
                    <Activity size={40} className="text-blue-500/50" />
                    <p className="text-[11px] font-medium tracking-tight leading-relaxed uppercase">
                      Financial Data Bridge Established.<br/>Ask about <span className="text-blue-400">{symbol}</span> momentum, risk, or macro factor confluence.
                    </p>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div 
                      className={`${
                        m.role === "user" 
                          ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.2)]" 
                          : "bg-white/[0.03] border border-white/10"
                      } max-w-[85%] rounded-2xl p-4 text-[13px] leading-relaxed transition-all hover:bg-opacity-100 backdrop-blur-sm`}
                    >
                      <ReactMarkdown className={`prose prose-invert prose-xs max-w-none ${m.role === "assistant" ? "text-white/80 font-medium" : "text-white"}`}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}

                {/* Analysis Loading State */}
                {loading && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="relative h-44 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex flex-col items-center justify-center space-y-4">
                      {/* Scanline Effect */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-scan" />
                      <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[2px]" />
                      
                      <Brain size={32} className="text-blue-400 relative z-10 animate-pulse" />
                      <div className="flex gap-2 relative z-10">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <p className="text-[9px] text-blue-400/60 font-black tracking-widest uppercase relative z-10">Neural Analysis Active</p>
                    </div>
                    
                    {/* Status LED chips */}
                    <div className="flex flex-wrap gap-2">
                       {currentStatus.map((s, i) => (
                         <div 
                           key={i} 
                           className="text-[8px] font-black tracking-widest bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded flex items-center gap-2 uppercase animate-in zoom-in-95 duration-300"
                         >
                            <Terminal size={10} className="text-blue-400/50" /> {s}
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input: Terminal Command Dock */}
              <div className="p-6 bg-white/[0.02] border-t border-white/5 backdrop-blur-md">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder={`EXECUTE_QUERY [${symbol}]...`}
                    className="relative w-full bg-black border border-white/10 rounded-xl py-4 pl-5 pr-14 text-[12px] font-mono text-white tracking-tight focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all placeholder:text-white/10"
                  />
                  <button 
                    onClick={sendMessage} 
                    disabled={loading || !input.trim()} 
                    className={`absolute right-2.5 top-2.5 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      input.trim() ? "bg-blue-600 text-white shadow-lg active:scale-90" : "bg-white/5 text-white/10 scale-90"
                    }`}
                  >
                    <Send size={14} />
                  </button>
                </div>
                <div className="mt-4 flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <Activity size={10} className="text-blue-500/40" />
                    <span className="text-[8px] text-white/20 font-bold tracking-widest uppercase font-mono">Quant RAG_V4.S2 // HFT_ANALYST</span>
                  </div>
                  <div className="flex gap-3">
                    <Database size={10} className="text-white/10" />
                    <Zap size={10} className="text-white/10" />
                    <Cpu size={10} className="text-white/10" />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        @keyframes scan { 
          0% { transform: translateY(-100%); opacity: 0; } 
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(4400%); opacity: 0; } 
        }
        .animate-scan { 
          animation: scan 3s linear infinite; 
          height: 4px;
        }
      `}</style>
    </>
  );
}
