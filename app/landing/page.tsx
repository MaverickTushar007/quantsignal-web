"use client";
import { useEffect, useState } from "react";

const API = "https://quantsignal-api-production-a5e1.up.railway.app";

export default function LandingPage() {
  const [stats, setStats] = useState<{
    win_rate: number | null;
    total_signals: number;
    wins: number;
  } | null>(null);

  useEffect(() => {
    fetch(`${API}/api/v1/performance`)
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  const winPct = stats?.win_rate ? Math.round(stats.win_rate * 100) : null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      {/* Hero */}
      <div className="max-w-3xl text-center space-y-6">
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full tracking-widest uppercase">
          ML-Powered Trading Signals
        </div>

        <h1 className="text-5xl font-bold leading-tight tracking-tight">
          Stop guessing.<br />
          <span className="text-emerald-400">Start trading with edge.</span>
        </h1>

        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          QuantSignal uses ensemble ML + institutional liquidity analysis to
          generate high-conviction signals across crypto, equities, and
          commodities.
        </p>

        {/* Win rate stat */}
        <div className="flex justify-center gap-10 py-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400">
              {winPct !== null ? `${winPct}%` : "—"}
            </div>
            <div className="text-zinc-500 text-sm mt-1">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">
              {stats?.total_signals ?? "—"}
            </div>
            <div className="text-zinc-500 text-sm mt-1">Signals Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">13</div>
            <div className="text-zinc-500 text-sm mt-1">Confluence Factors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">186</div>
            <div className="text-zinc-500 text-sm mt-1">Assets Covered</div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4 justify-center">
          
            href="/dashboard"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-lg transition"
          >
            View Live Signals →
          </a>
          
            href="/pricing"
            className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold px-6 py-3 rounded-lg transition"
          >
            See Pro Plans
          </a>
        </div>

        <p className="text-zinc-600 text-xs">
          Backtested across 1,000+ signals · Not financial advice
        </p>
      </div>

      {/* How it works */}
      <div className="mt-24 max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-center mb-10">
          How QuantSignal works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Liquidity & Structure",
              desc: "Detects order blocks, liquidity sweeps, BOS/CHoCH — where institutions actually trade.",
            },
            {
              step: "02",
              title: "Ensemble ML",
              desc: "XGBoost + LightGBM trained on historical outcomes. FRED macro data adjusts probability in real time.",
            },
            {
              step: "03",
              title: "Weighted Confluence",
              desc: "13 factors scored by tier. Structure dominates. Indicators only confirm — never decide alone.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3"
            >
              <div className="text-emerald-500 text-xs font-bold tracking-widest">
                {item.step}
              </div>
              <div className="font-semibold text-white">{item.title}</div>
              <div className="text-zinc-400 text-sm">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
