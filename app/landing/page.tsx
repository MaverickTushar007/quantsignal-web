"use client";
import { useState } from "react";
import { TrendingUp, Shield, Zap, BarChart2, ChevronRight, Check, Brain, Activity } from "lucide-react";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-bold">Q</div>
          <span className="font-semibold">QuantSignal</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-sm text-white/50 hover:text-white transition-colors">Dashboard</a>
          <a href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</a>
          <a href="/dashboard" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors">
            Try Free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 text-sm text-violet-400 mb-8">
            <Activity size={14} />
            Live signals across 86 assets
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold leading-tight mb-6">
            The only trading signal
            <span className="block bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              that shows its proof
            </span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Every other app gives you a red or green button. We give you an ML ensemble, 
            a 9-factor confluence scorecard, walk-forward backtested results, 
            and an AI explanation of exactly why.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard"
              className="px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
              View Live Signals <ChevronRight size={20} />
            </a>
            <a href="#proof"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-lg transition-all">
              See the Backtest
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "86", label: "Assets Covered" },
            { value: "67.8%", label: "Backtest Win Rate" },
            { value: "2.87", label: "Sharpe Ratio" },
            { value: "21", label: "ML Features" },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-sm text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Proof section */}
      <section id="proof" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">We don't ask you to trust us</h2>
            <p className="text-white/50 text-lg">We show you the backtest. You decide.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <BarChart2 size={24}/>, title: "Walk-Forward Validated", desc: "6-month walk-forward validation with no lookahead bias. Every signal is tested against data the model never saw during training." },
              { icon: <Brain size={24}/>, title: "XGBoost + LightGBM", desc: "Two-model ensemble trained on 2 years of OHLCV data per asset. Probability calibrated with isotonic regression." },
              { icon: <Shield size={24}/>, title: "ATR-Based Risk Levels", desc: "Take Profit and Stop Loss set by Average True Range — volatility-adjusted for each asset, not arbitrary percentages." },
            ].map(f => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-violet-400 mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything in one place</h2>
            <p className="text-white/50 text-lg">No other retail tool combines all five of these.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "ML Signal + Probability", desc: "BUY/SELL/HOLD with an actual probability score, not just a direction." },
              { title: "9-Factor Confluence", desc: "RSI, MACD, Bollinger, Stochastic, Volume, SMA Cross, 52W Position, Momentum — all in one scorecard." },
              { title: "Kelly Criterion Sizing", desc: "Exact position size based on your edge and risk/reward ratio. Not a fixed 1% or 2%." },
              { title: "LLM Reasoning", desc: "Groq-powered plain-English explanation of every signal. Know why, not just what." },
              { title: "Live News Sentiment", desc: "7 RSS feeds scored and blended into the ML signal in real time." },
              { title: "Backtested Proof", desc: "Every signal strategy auditable with walk-forward validation metrics." },
            ].map(f => (
              <div key={f.title} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={10} className="text-violet-400" />
                </div>
                <div>
                  <div className="font-medium mb-1">{f.title}</div>
                  <div className="text-sm text-white/50">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple pricing</h2>
            <p className="text-white/50 text-lg">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                name: "Free", price: "₹0", period: "forever",
                features: ["5 signals per day", "BUY/SELL/HOLD direction", "Current price + Kelly size", "Basic confluence score"],
                cta: "Get Started", href: "/dashboard", highlight: false,
              },
              {
                name: "Pro", price: "₹499", period: "per month",
                features: ["Unlimited signals — all 86 assets", "Full 9-factor confluence", "LLM reasoning for every signal", "Walk-forward backtest access", "Live news sentiment", "Priority support"],
                cta: "Start Pro", href: "/dashboard", highlight: true,
              },
            ].map(p => (
              <div key={p.name} className={`rounded-2xl p-8 border ${p.highlight ? "bg-violet-600/10 border-violet-500/30" : "bg-white/5 border-white/10"}`}>
                <div className="text-sm text-white/50 mb-2">{p.name}</div>
                <div className="text-4xl font-bold mb-1">{p.price}</div>
                <div className="text-white/30 text-sm mb-8">{p.period}</div>
                <div className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm">
                      <Check size={14} className={p.highlight ? "text-violet-400" : "text-white/40"} />
                      <span className="text-white/70">{f}</span>
                    </div>
                  ))}
                </div>
                <a href={p.href}
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${p.highlight ? "bg-violet-600 hover:bg-violet-500" : "bg-white/10 hover:bg-white/15"}`}>
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get early access</h2>
          <p className="text-white/50 mb-8">Be the first to know when Pro launches. No spam.</p>
          {submitted ? (
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-6 py-4 text-violet-400 font-medium">
              You're on the list.
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20"
              />
              <button
                onClick={() => { if (email) setSubmitted(true); }}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-medium text-sm transition-all whitespace-nowrap">
                Notify Me
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-white/20 text-sm">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">Q</div>
          <span className="text-white/40 font-medium">QuantSignal</span>
        </div>
        Educational signals only — not financial advice. Past performance does not guarantee future results.
      </footer>
    </div>
  );
}
