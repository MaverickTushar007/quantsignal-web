"use client";
import { StaggerList, StaggerItem } from "../Animated";
import EarningsBadge from "./EarningsBadge";
import AlertBell from "./AlertBell";
import { StaleBadge, MarketStatusBadge } from "./SignalHelpers";
import { formatPrice, TYPE_FILTERS, dirColor, badge } from "../../lib/utils";

interface AssetListProps {
  signals: any[];
  loading: boolean;
  filter: string;
  setFilter: (f: string) => void;
  search: string;
  setSearch: (s: string) => void;
  selected: any;
  selectAsset: (sig: any) => void;
  outcomeMap: Record<string, { outcome: string; pnl: number }>;
  isMobile: boolean;
  filtered: any[];
}

export default function AssetList({ signals, loading, filter, setFilter, search, setSearch, selected, selectAsset, outcomeMap, isMobile, filtered }: AssetListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="SEARCH..."
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "6px 10px", color: "#cbd5e1", fontSize: 9, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {TYPE_FILTERS.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ background: filter === t ? "rgba(0,255,136,0.15)" : "transparent", border: `1px solid ${filter === t ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 3, padding: "3px 8px", color: filter === t ? "#00ff88" : "rgba(255,255,255,0.4)", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Skeleton while loading */}
        {loading && Array.from({length: 8}).map((_, i) => (
          <div key={i} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.04)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: "60%", height: 9, borderRadius: 3, background: "rgba(255,255,255,0.06)", marginBottom: 5 }} />
              <div style={{ width: "40%", height: 7, borderRadius: 3, background: "rgba(255,255,255,0.03)" }} />
            </div>
            <div style={{ width: 36, height: 18, borderRadius: 3, background: "rgba(255,255,255,0.04)" }} />
          </div>
        ))}
        {/* TOP SIGNALS — pinned, highest confidence BUY/SELL */}
        {!loading && signals.length > 0 && filter === "ALL" && (() => {
          const top = [...signals]
            .filter(s => s.direction !== "HOLD")
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 3);
          if (!top.length) return null;
          return (
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "8px 12px 6px" }}>
              <div style={{ fontSize: 10, color: "rgba(0,255,136,0.5)", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 6 }}>⚡ TOP SIGNALS</div>
              <div style={{ display: "flex", gap: 4 }}>
                {top.map(sig => (
                  <button key={sig.symbol} onClick={() => selectAsset(sig)} style={{
                    flex: 1, background: selected?.symbol === sig.symbol ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selected?.symbol === sig.symbol ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 4, padding: "5px 4px", cursor: "pointer", fontFamily: "inherit", textAlign: "center"
                  }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#cbd5e1", marginBottom: 2 }}>{sig.display}</div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: sig.direction === "BUY" ? "#00ff88" : "#ff4466" }}>{sig.direction}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{(sig.probability * 100).toFixed(0)}%</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}
        {loading ? (
          <>
          <style>{`
            @keyframes shimmer {
              0% { opacity: 0.15; }
              50% { opacity: 0.4; }
              100% { opacity: 0.15; }
            }
          `}</style>
          <div style={{ padding: "6px 12px", fontSize: 9, color: "rgba(0,255,136,0.5)", letterSpacing: "0.1em", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            ⟳ LOADING SIGNALS...
          </div>
          {[...Array(15)].map((_, i) => (
            <div key={i} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.03)", animation: `shimmer ${1.2 + (i % 3) * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.05}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                <div style={{ height: 9, background: "rgba(255,255,255,0.12)", borderRadius: 2, width: `${50 + (i % 4) * 12}px` }} />
                <div style={{ height: 9, background: "rgba(0,255,136,0.08)", borderRadius: 2, width: "28px" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ height: 7, background: "rgba(255,255,255,0.05)", borderRadius: 2, width: `${40 + (i % 3) * 15}px` }} />
                <div style={{ height: 7, background: "rgba(255,255,255,0.04)", borderRadius: 2, width: "30px" }} />
              </div>
            </div>
          ))}
          </>
        ) : (() => (
          <StaggerList>
            {filtered.map(sig => (
          <StaggerItem key={sig.symbol}>
          <div key={sig.symbol} onClick={() => selectAsset(sig)} 
            style={{ padding: isMobile ? "12px 16px" : "7px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", background: selected?.symbol === sig.symbol ? "rgba(0,255,136,0.05)" : "transparent", borderLeft: selected?.symbol === sig.symbol ? "3px solid #00ff88" : "3px solid transparent" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: isMobile ? 15 : 11, fontWeight: 700, color: selected?.symbol === sig.symbol ? "#00ff88" : "#cbd5e1" }}>{sig.display}</span>
              <span style={badge(sig.direction)}>{sig.direction}</span>
              {outcomeMap[sig.symbol] && (
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: "1px 5px", borderRadius: 3,
                  background: outcomeMap[sig.symbol].outcome === "TP_HIT" ? "rgba(0,255,136,0.15)" : "rgba(255,68,102,0.15)",
                  color: outcomeMap[sig.symbol].outcome === "TP_HIT" ? "#00ff88" : "#ff4466",
                  marginLeft: 4,
                }}>
                  {outcomeMap[sig.symbol].outcome === "TP_HIT" ? "✓" : "✗"}{outcomeMap[sig.symbol].pnl >= 0 ? "+" : ""}{outcomeMap[sig.symbol].pnl?.toFixed(1)}%
                </span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: isMobile ? 13 : 10, color: "rgba(255,255,255,0.4)", alignItems: "center" }}>
              <span>{formatPrice(sig.current_price, sig.type, sig.symbol)}</span>
              <EarningsBadge flag={sig.earnings_flag} />
              <StaleBadge sig={sig} />
              <MarketStatusBadge sig={sig} />
              <AlertBell symbol={sig.symbol} />
              <span style={{ color: dirColor(sig.direction), fontWeight: 600 }}>{(sig.probability * 100).toFixed(0)}%</span>
            </div>
          </div>
          </StaggerItem>
            ))}
          </StaggerList>
        ))()
        }
      </div>
    </div>
  );

}
