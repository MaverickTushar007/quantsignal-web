"use client";
const tickers = [
  { sym: "BTC/USD", price: "76,359.39", color: "#EF4444" },
  { sym: "ETH/USD", price: "2,289.55", color: "#10B981" },
  { sym: "SOL/USD", price: "83.76", color: "#EF4444" },
  { sym: "SPY", price: "561.20", color: "#EF4444" },
  { sym: "NIFTY", price: "24,123", color: "#EF4444" },
  { sym: "RELIANCE", price: "1,284", color: "#EF4444" },
];
export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-4 h-12 z-40 sticky top-0"
      style={{ background: "#0D0D12", borderBottom: "1px solid #1E1E2E" }}>
      <div className="flex items-center gap-8 overflow-hidden flex-1">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {[...tickers, ...tickers].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "#475569" }}>{t.sym}</span>
              <span className="font-mono text-[11px]" style={{ color: t.color }}>{t.price}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="ml-4 flex items-center gap-2 px-3 py-1.5 rounded text-[10px] uppercase tracking-widest transition-all"
        style={{ background: "#3B82F6", color: "#fff" }}>
        <span className="material-symbols-outlined text-[14px]">refresh</span>
        Refresh Signals
      </button>
    </header>
  );
}
