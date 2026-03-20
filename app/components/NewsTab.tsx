"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

const SENTIMENT_CONFIG = {
  BULLISH: { color: "#00ff88", bg: "rgba(0,255,136,0.08)", border: "rgba(0,255,136,0.2)", label: "BULL" },
  BEARISH: { color: "#ff4466", bg: "rgba(255,68,102,0.08)", border: "rgba(255,68,102,0.2)", label: "BEAR" },
  NEUTRAL: { color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)", label: "NEUT" },
};

export default function NewsTab({ symbol }: { symbol: string }) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError("");
    fetch(`${API}/news/${symbol}?limit=10`)
      .then(r => r.json())
      .then(d => {
        setNews(d.items || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load news");
        setLoading(false);
      });
  }, [symbol]);

  const bullish = news.filter(n => n.sentiment === "BULLISH").length;
  const bearish = news.filter(n => n.sentiment === "BEARISH").length;
  const neutral = news.filter(n => n.sentiment === "NEUTRAL").length;
  const total = news.length;

  return (
    <div style={{ padding: "20px 24px", color: "#e2e8f0", height: "100%", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}>
          LIVE NEWS · {symbol}
        </div>
        {!loading && total > 0 && (
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 9, color: "#00ff88", fontWeight: 700 }}>↑{bullish}</span>
            <span style={{ fontSize: 9, color: "#ff4466", fontWeight: 700 }}>↓{bearish}</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>–{neutral}</span>
          </div>
        )}
      </div>

      {/* Sentiment bar */}
      {!loading && total > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${(bullish/total)*100}%`, background: "#00ff88", transition: "width 0.5s" }} />
            <div style={{ width: `${(neutral/total)*100}%`, background: "rgba(255,255,255,0.15)" }} />
            <div style={{ width: `${(bearish/total)*100}%`, background: "#ff4466" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
            <span style={{ color: "#00ff88" }}>{Math.round((bullish/total)*100)}% BULLISH</span>
            <span>SENTIMENT DISTRIBUTION</span>
            <span style={{ color: "#ff4466" }}>{Math.round((bearish/total)*100)}% BEARISH</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 16, height: 72 }}>
              <div style={{ height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 4, width: "80%", marginBottom: 8 }} />
              <div style={{ height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, width: "40%" }} />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ color: "#ff4466", fontSize: 12, padding: "20px 0" }}>{error}</div>
      )}

      {/* News items */}
      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {news.length === 0 && (
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, padding: "20px 0", textAlign: "center" }}>
              No recent news found for {symbol}
            </div>
          )}
          {news.map((item, i) => {
            const cfg = SENTIMENT_CONFIG[item.sentiment as keyof typeof SENTIMENT_CONFIG] || SENTIMENT_CONFIG.NEUTRAL;
            return (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    {/* Sentiment badge */}
                    <div style={{
                      flexShrink: 0,
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      borderRadius: 4,
                      padding: "2px 6px",
                      fontSize: 8,
                      fontWeight: 800,
                      color: cfg.color,
                      letterSpacing: "0.1em",
                      marginTop: 2,
                    }}>
                      {cfg.label}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Title */}
                      <div style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#e2e8f0",
                        lineHeight: 1.4,
                        marginBottom: 6,
                      }}>
                        {item.title}
                      </div>
                      {/* Source */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                          {item.source}
                        </span>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)" }}>↗ READ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
