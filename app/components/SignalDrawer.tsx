"use client";
import { useEffect, useState } from "react";
import { X, TrendingUp, TrendingDown, Minus, ExternalLink, Zap, RefreshCw } from "lucide-react";
import { fetchSignal } from "../lib/api";
import TradingChart from "./TradingChart";

const API_BASE = "https://web-production-1a093.up.railway.app/api/v1";

const dirColor = (d: string) =>
  d === "BUY" ? "text-emerald-400" : d === "SELL" ? "text-red-400" : "text-yellow-400";

function LiquidityCard({ symbol }: { symbol: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLiquidity = async () => {
    try {
      const res = await fetch(`${API_BASE}/liquidity/${symbol}`);
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    // Only fetch for crypto symbols that have OKX support
    const supported = ["BTC-USD","ETH-USD","SOL-USD","BNB-USD","XRP-USD","DOGE-USD","ADA-USD","AVAX-USD","DOT-USD","LINK-USD","LTC-USD","ATOM-USD","NEAR-USD","OP-USD","INJ-USD"];
    if (!supported.includes(symbol)) return;

    fetchLiquidity();
    const interval = setInterval(fetchLiquidity, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [symbol]);

  if (!data && !loading) return null;

  const oiColor = data?.oi_change_24h_pct > 0 ? "#00ff88" : "#ff4466";
  const fundingColor = data?.funding_color || "rgba(255,255,255,0.4)";

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16 }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={13} color="#ffd700" />
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>LIQUIDITY LEVELS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {loading && <RefreshCw size={10} color="rgba(255,255,255,0.3)" style={{ animation: "spin 1s linear infinite" }} />}
          {lastUpdated && <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>LIVE · {lastUpdated.toLocaleTimeString()}</span>}
        </div>
      </div>

      {loading && !data ? (
        <div style={{ height: 80, background: "rgba(255,255,255,0.03)", borderRadius: 8, animation: "pulse 1.5s infinite" }} />
      ) : data ? (
        <>
          {/* Bias banner */}
          <div style={{ background: `${data.bias_color}15`, border: `1px solid ${data.bias_color}30`, borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: data.bias_color, letterSpacing: "0.1em", marginBottom: 3 }}>{data.bias.replace(/_/g, " ")}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{data.bias_desc}</div>
          </div>

          {/* OI + Funding row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>OPEN INTEREST</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{data.open_interest.toLocaleString()}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: oiColor, marginTop: 2 }}>
                {data.oi_change_24h_pct > 0 ? "▲" : "▼"} {Math.abs(data.oi_change_24h_pct)}% 24h
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>FUNDING</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: fundingColor }}>{data.funding_rate.toFixed(4)}%</div>
              <div style={{ fontSize: 9, color: fundingColor, marginTop: 2 }}>{data.funding_trend.replace(/_/g, " ")}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>L/S RATIO</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: data.long_ratio > 60 ? "#ff4466" : data.long_ratio < 40 ? "#00ff88" : "#fff" }}>
                {data.long_ratio}% L
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{data.short_ratio}% SHORT</div>
            </div>
          </div>

          {/* Liquidation clusters */}
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 8 }}>LIQUIDATION CLUSTERS</div>
          
          {/* Above clusters */}
          <div style={{ marginBottom: 6 }}>
            {data.clusters_above.map((c: any, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 8px", marginBottom: 3, background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.1)", borderRadius: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9, color: "#00ff88" }}>▲</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>${c.price.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{c.label}</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: "#00ff88", background: "rgba(0,255,136,0.1)", padding: "1px 5px", borderRadius: 3 }}>{c.weight}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Current price marker */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "rgba(255,255,255,0.06)", borderRadius: 6, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffd700", flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#ffd700" }}>${data.current_price.toLocaleString()}</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>CURRENT PRICE</span>
          </div>

          {/* Below clusters */}
          <div>
            {data.clusters_below.map((c: any, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 8px", marginBottom: 3, background: "rgba(255,68,102,0.04)", border: "1px solid rgba(255,68,102,0.1)", borderRadius: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9, color: "#ff4466" }}>▼</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>${c.price.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{c.label}</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: "#ff4466", background: "rgba(255,68,102,0.1)", padding: "1px 5px", borderRadius: 3 }}>{c.weight}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}

export default function SignalDrawer({ symbol, onClose }: { symbol: string; onClose: () => void }) {
  const [signal, setSignal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignal(symbol).then(setSignal).finally(() => setLoading(false));
  }, [symbol]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0f0f17] border-l border-white/10 overflow-y-auto">
        <div className="sticky top-0 bg-[#0f0f17] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {signal && <><span className="text-lg font-bold">{signal.display}</span><span className="text-white/40 text-sm">{signal.name}</span></>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X size={18} /></button>
        </div>
        {loading ? (
          <div className="p-6 space-y-4">{[...Array(5)].map((_,i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}</div>
        ) : signal ? (
          <div className="p-6 space-y-6">
            <TradingChart symbol={signal.symbol} />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">${signal.current_price.toLocaleString()}</div>
                <div className="text-white/40 text-sm mt-1">{signal.type}</div>
              </div>
              <div className={`px-4 py-2 rounded-xl text-lg font-bold flex items-center gap-2 ${signal.direction === "BUY" ? "bg-emerald-400/15 text-emerald-400 border border-emerald-400/20" : signal.direction === "SELL" ? "bg-red-400/15 text-red-400 border border-red-400/20" : "bg-yellow-400/15 text-yellow-400 border border-yellow-400/20"}`}>
                {signal.direction === "BUY" ? <TrendingUp size={18}/> : signal.direction === "SELL" ? <TrendingDown size={18}/> : <Minus size={18}/>}
                {signal.direction}
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">ML Probability</span>
                <span className={`font-bold ${dirColor(signal.direction)}`}>{(signal.probability*100).toFixed(1)}% — {signal.confidence}</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-400" style={{width:`${signal.probability*100}%`}} />
                <div className="h-full bg-red-400" style={{width:`${(1-signal.probability)*100}%`}} />
              </div>
              <div className="flex justify-between text-xs text-white/30">
                <span>BUY {(signal.probability*100).toFixed(0)}%</span>
                <span>Agreement: {(signal.model_agreement*100).toFixed(0)}%</span>
                <span>SELL {((1-signal.probability)*100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {label:"Take Profit",value:`$${signal.take_profit.toLocaleString()}`,color:"text-emerald-400"},
                {label:"Stop Loss",value:`$${signal.stop_loss.toLocaleString()}`,color:"text-red-400"},
                {label:"Kelly Size",value:`${signal.kelly_size}%`,color:"text-violet-400"},
                {label:"Risk/Reward",value:`${signal.risk_reward}:1`,color:"text-blue-400"},
                {label:"Expected Value",value:`$${signal.expected_value.toFixed(0)}`,color:"text-white"},
                {label:"ATR",value:`$${signal.atr.toLocaleString()}`,color:"text-white/60"},
              ].map(m => (
                <div key={m.label} className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-white/40 mb-1">{m.label}</div>
                  <div className={`font-bold ${m.color}`}>{m.value}</div>
                </div>
              ))}
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-sm text-white/50 mb-3">Top Predictive Features</div>
              <div className="space-y-2">
                {signal.top_features.map((f: string, i: number) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="text-xs text-white/30 w-4">{i+1}</div>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{width:`${90-i*20}%`}} />
                    </div>
                    <div className="text-xs text-white/60 w-24 text-right">{f}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex justify-between mb-3">
                <div className="text-sm text-white/50">9-Factor Confluence</div>
                <div className="text-xs font-bold text-violet-400">{signal.confluence_score}</div>
              </div>
              <div className="space-y-2">
                {signal.confluence.map((c: any) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <span className="text-white/50 w-28">{c.name}</span>
                    <span className="text-white/30 flex-1 text-center">{c.value}</span>
                    <span className={c.signal === "BULLISH" ? "text-emerald-400" : "text-red-400"}>{c.signal === "BULLISH" ? "▲" : "▼"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Liquidity Levels Card — real-time, crypto only */}
            <LiquidityCard symbol={symbol} />

            {signal.news?.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-sm text-white/50 mb-3">Latest News</div>
                <div className="space-y-3">
                  {signal.news.map((n: any, i: number) => (
                    <div key={i} className="border-b border-white/5 pb-3 last:border-0">
                      <div className="flex gap-2">
                        <div className="text-xs text-white/80 leading-relaxed flex-1">{n.title}</div>
                        {n.url && <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60"><ExternalLink size={12}/></a>}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-white/30 text-xs">{n.source}</span>
                        <span className={`text-xs ${n.sentiment === "BULLISH" ? "text-emerald-400" : n.sentiment === "BEARISH" ? "text-red-400" : "text-white/30"}`}>{n.sentiment}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {signal.reasoning && (
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4">
                <div className="text-xs text-violet-400 mb-2 font-medium">AI Reasoning</div>
                <div className="text-sm text-white/70 leading-relaxed">{signal.reasoning}</div>
              </div>
            )}
            <div className="text-xs text-white/20 text-center pb-4">Educational signals only — not financial advice</div>
          </div>
        ) : (
          <div className="p-6 text-center text-white/30">Could not load signal</div>
        )}
      </div>
    </div>
  );
}
