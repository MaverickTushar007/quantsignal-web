"use client";
import { useEffect, useState } from "react";
import { fetchAllSignals } from "../lib/api";
import TradeGuardian from "../components/TradeGuardian";

export default function GuardianPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loadingSignal, setLoadingSignal] = useState<string | null>(null);

  const openGuardian = async (sig: any) => {
    setLoadingSignal(sig.symbol);
    try {
      const res = await fetch(`https://web-production-1a093.up.railway.app/api/v1/signals/${sig.symbol}?reason=false`);
      if (res.ok) {
        const full = await res.json();
        setSelected({ ...sig, ...full });
      } else {
        setSelected(sig);
      }
    } catch {
      setSelected(sig);
    } finally {
      setLoadingSignal(null);
    }
  };
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchAllSignals().then(setSignals);
  }, []);

  const filtered = signals.filter(s => {
    const matchSearch = s.symbol.toLowerCase().includes(search.toLowerCase()) || s.display?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || s.type === filter;
    return matchSearch && matchFilter;
  });

  const dirColor = (d: string) => d === "BUY" ? "#00ff88" : d === "SELL" ? "#ff4466" : "#ffd700";
  const dirBg = (d: string) => d === "BUY" ? "rgba(0,255,136,0.1)" : d === "SELL" ? "rgba(255,68,102,0.1)" : "rgba(255,215,0,0.1)";

  return (
    <div style={{ minHeight: "100vh", background: "#080a0f", color: "#e2e8f0", fontFamily: "'IBM Plex Mono', monospace" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/dashboard" style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textDecoration: "none" }}>← Back</a>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🛡️</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#00ff88", letterSpacing: "0.08em" }}>TRADE GUARDIAN</span>
          </div>
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
          Select any asset to run a risk check before entering
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🛡️</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: "0.05em" }}>
            TRADE GUARDIAN
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Before you enter any trade, Guardian checks if your position size makes sense for your capital — and tells you exactly how much you could win or lose in plain English.
          </p>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search assets..."
            style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#fff", outline: "none", fontFamily: "inherit" }}
          />
          {["ALL","CRYPTO","STOCK","ETF","FOREX","INDEX"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "8px 16px", borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: "pointer", border: "none", background: filter === f ? "#00ff88" : "rgba(255,255,255,0.06)", color: filter === f ? "#000" : "rgba(255,255,255,0.4)", fontFamily: "inherit" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Signal Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {filtered.map(sig => (
            <button key={sig.symbol} onClick={() => openGuardian(sig)}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.border = "1px solid rgba(0,255,136,0.3)")}
              onMouseLeave={e => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{sig.display}</span>
                <span style={{ fontSize: 9, fontWeight: 700, background: dirBg(sig.direction), color: dirColor(sig.direction), padding: "3px 8px", borderRadius: 4 }}>{sig.direction}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>${sig.current_price?.toLocaleString()}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                <span>{sig.type}</span>
                <span style={{ color: dirColor(sig.direction) }}>{(sig.probability * 100).toFixed(0)}% confidence</span>
              </div>
              <div style={{ marginTop: 12, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: 6, padding: "6px 10px", fontSize: 10, fontWeight: 700, color: "#00ff88", textAlign: "center" }}>
                {loadingSignal === sig.symbol ? "⏳ Loading..." : "🛡️ Run Guardian Check →"}
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && signals.length > 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            No assets match your search
          </div>
        )}

        {signals.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            Loading signals...
          </div>
        )}
      </div>

      {/* Guardian Modal */}
      {selected && (
        <TradeGuardian signal={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
