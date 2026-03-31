"use client";
import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

const mono = "'IBM Plex Mono', monospace";

const PIPELINE = [
  { step: "01", label: "RAW DATA", detail: "133 assets · 2yr OHLCV · 7 RSS feeds", color: "#00aaff" },
  { step: "02", label: "47 FEATURES", detail: "RSI, MACD, BB, Stoch, Vol, SMA, momentum…", color: "#00ccff" },
  { step: "03", label: "ML ENSEMBLE", detail: "XGBoost + LightGBM · walk-forward trained", color: "#00ff88" },
  { step: "04", label: "REGIME FILTER", detail: "Bull / Bear / Ranging · adjusts confidence", color: "#ffd700" },
  { step: "05", label: "SENTIMENT", detail: "News scored BULL/BEAR/NEUT · 10% weight blend", color: "#ff9500" },
  { step: "06", label: "FINAL SIGNAL", detail: ">55% = BUY · <45% = SELL · else HOLD", color: "#00ff88" },
];

const SECTIONS = [
  {
    id: "signals",
    icon: "⚡",
    title: "Signal generation pipeline",
    short: "From raw price data to BUY/SELL/HOLD in 6 stages",
    body: `Every signal starts with 2 years of daily OHLCV data fetched via yFinance for all 133 assets. That raw data is transformed into 47 engineered features — technical indicators, statistical measures, and cross-asset signals — which feed two machine learning models: XGBoost and LightGBM.

Both models are trained using walk-forward validation: trained on 1 year of data, tested on the next 3 months, then rolled forward. This means the model never sees future data during training. The ensemble output is a probability — the likelihood the asset moves up more than 2% in the next 5 days.

Live news from 7 RSS feeds (Yahoo Finance, CNBC, MarketWatch, Investing.com, CryptoNews, WSJ, Seeking Alpha) is scored BULLISH/BEARISH/NEUTRAL and blended in at 10% weight. The final probability determines the signal: above 55% = BUY, below 45% = SELL, in between = HOLD.`,
  },
  {
    id: "confluence",
    icon: "🎯",
    title: "9-factor confluence score",
    short: "Why nine indicators and how to read X/9",
    body: `The confluence score counts how many of 9 independent technical indicators agree with the ML signal direction. A score of 7/9 or higher means seven different measurement approaches all point the same way — that convergence is meaningful. A score of 3/9 means the indicators are split, and the ML signal carries less conviction.

The nine factors are: RSI-14 (overbought/oversold), MACD histogram (momentum direction), Bollinger Band position (proximity to upper/lower band), Stochastic %K (high-low range momentum), Volume ratio vs 20-day average (conviction), SMA 20/50 cross (trend direction), price vs SMA-20 (short-term bias), 52-week position (annual momentum), and 5-day return (recent momentum).

Each factor votes independently. Nine votes means nine different ways to be wrong — if most of them agree, the edge is real.`,
  },
  {
    id: "levels",
    icon: "📐",
    title: "Take Profit & Stop Loss calculation",
    short: "ATR-based volatility-adjusted levels — not arbitrary percentages",
    body: `Take Profit and Stop Loss are calculated using the Average True Range (ATR) over 14 days — the average daily price range the asset actually moves. This makes levels adapt to each asset's current volatility instead of using fixed percentages that ignore how an asset actually behaves.

For BUY signals: Take Profit = Entry + (2 × ATR). Stop Loss = Entry − (1 × ATR). This gives a built-in 2:1 risk/reward ratio. For SELL signals the formula mirrors in reverse.

Why not fixed percentages? A 5% stop loss on Bitcoin — which moves 3% daily — gets triggered by noise constantly. A 5% stop on USDINR — which moves 0.3% daily — gives way too much room. ATR-based stops are calibrated to each asset's reality. High ATR = wider stops. Low ATR = tighter stops.`,
  },
  {
    id: "kelly",
    icon: "📊",
    title: "Kelly Criterion position sizing",
    short: "The math behind how much capital to risk per trade",
    body: `Kelly Criterion is a formula from information theory that calculates the mathematically optimal fraction of capital to risk on a bet, given your win probability and the payoff ratio. The formula: Kelly % = (p × b − q) / b, where p = win probability, q = 1 − p, b = risk/reward ratio.

QuantSignal uses 25% of full Kelly — called fractional Kelly — which is standard practice at institutional trading desks. Full Kelly maximises long-run growth but produces extreme drawdowns. Quarter Kelly reduces variance dramatically while preserving most of the mathematical edge.

Example: BUY signal at 62% confidence with 2:1 R/R. Full Kelly = (0.62 × 2 − 0.38) / 2 = 43%. Quarter Kelly = 10.75%. With ₹1,00,000 capital, risk ₹10,750 on this trade. This is a guide, not a rule. Apply your own judgment and never risk what you cannot afford to lose.`,
  },
  {
    id: "regime",
    icon: "🌡️",
    title: "Market regime detection",
    short: "How the system knows when to be aggressive vs defensive",
    body: `Raw ML probability is adjusted based on the current market regime before producing the final signal. The RegimeAgent classifies the market into three states: Bull (trending up, breadth expanding), Bear (trending down, volatility elevated), or Ranging (no clear trend, mean-reversion dominant).

In a Bull regime, the probability threshold for BUY signals is loosened — the system is more willing to act on moderate conviction. In a Bear regime, thresholds tighten — only high-confidence signals pass. In a Ranging regime, momentum signals are downweighted in favour of mean-reversion indicators like RSI extremes and Bollinger Band touches.

This is why two identical raw ML scores can produce different final signals depending on when they are generated. Regime context is not optional — it is built into every probability shown on the platform.`,
  },
  {
    id: "backtest",
    icon: "🔬",
    title: "How the backtest works",
    short: "Walk-forward validation — what the numbers actually mean",
    body: `Standard backtests train on all historical data and test on the same data. The model has already seen the answers — results are always better than live trading. QuantSignal uses walk-forward validation: train on 12 months, test on the next 3 months, roll forward, repeat. The model never sees future data during any training window.

The metrics shown on the Track Record and Performance pages reflect this walk-forward process. Win Rate is the percentage of closed trades that reached Take Profit before Stop Loss. Expectancy is the average P&L per trade — the number that actually determines long-run profitability, not win rate. Sharpe Ratio is annualised return divided by annualised volatility: above 1.5 is good, above 2.0 is excellent.

Important: backtest results reflect the period the model was trained on. Markets change regimes. A strategy with a 2.57 Sharpe in trending markets may perform differently in a prolonged ranging or bear regime. Use these numbers as evidence of edge, not a guarantee of future returns.`,
  },
];

function Section({ s }: { s: typeof SECTIONS[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      border: `1px solid ${open ? "rgba(0,255,136,0.2)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 12,
      marginBottom: 10,
      overflow: "hidden",
      transition: "border-color 0.2s",
      background: open ? "rgba(0,255,136,0.02)" : "transparent",
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "transparent", border: "none",
        padding: "20px 24px", cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 16, textAlign: "left",
      }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: open ? "#fff" : "#c9d1d9", marginBottom: 3 }}>{s.title}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: mono }}>{s.short}</div>
        </div>
        {open
          ? <ChevronUp size={16} color="rgba(0,255,136,0.6)" />
          : <ChevronDown size={16} color="rgba(255,255,255,0.2)" />}
      </button>

      {open && (
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={{duration:0.25,ease:"easeOut"}} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px 24px 28px 64px", overflow:"hidden" }}>
          {s.body.split("\n\n").map((para, i) => (
            <p key={i} style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.9,
              marginBottom: i < s.body.split("\n\n").length - 1 ? 16 : 0,
              maxWidth: 620,
            }}>{para}</p>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div style={{ minHeight: "100vh", background: "#060608", color: "#e2e8f0", fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <a href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.3)", fontSize: 12, textDecoration: "none", fontFamily: mono }}>
          <ArrowLeft size={13} /> DASHBOARD
        </a>
        <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
        <span style={{ fontSize: 11, color: "rgba(0,255,136,0.5)", fontFamily: mono, letterSpacing: "0.1em" }}>DOCUMENTATION</span>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 32px 96px" }}>

        {/* Hero */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 9, color: "#00ff88", letterSpacing: "0.18em", fontFamily: mono, marginBottom: 16, fontWeight: 700 }}>HOW IT WORKS</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.5px" }}>
            The complete technical<br />reference for QuantSignal
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, maxWidth: 520 }}>
            Every number on this platform has a specific origin. This page explains the full methodology — from raw price data to the signal you see, and what each metric actually means.
          </p>
        </div>

        {/* Pipeline visual */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", fontFamily: mono, marginBottom: 20, fontWeight: 700 }}>SIGNAL PIPELINE — 6 STAGES</div>
          <div style={{ display: "flex", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
            {PIPELINE.map((p, i) => (
              <div key={p.step} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${p.color}30`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  minWidth: 110,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 9, color: p.color, fontFamily: mono, fontWeight: 700, marginBottom: 6, letterSpacing: "0.1em" }}>{p.step}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", lineHeight: 1.5, fontFamily: mono }}>{p.detail}</div>
                </div>
                {i < PIPELINE.length - 1 && (
                  <div style={{ width: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 16 }}>→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8,
          marginBottom: 56,
          padding: "20px 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          {[
            ["133", "Live assets", "#00ff88"],
            ["47", "Engineered features", "#00aaff"],
            ["9", "Confluence factors", "#ffd700"],
            ["2:1", "Built-in R/R ratio", "#ff9500"],
          ].map(([v, l, c]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: c as string, fontFamily: mono, marginBottom: 4 }}>{v}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", fontFamily: mono, marginBottom: 20, fontWeight: 700 }}>DETAILED BREAKDOWN</div>
          {SECTIONS.map(s => <Section key={s.id} s={s} />)}
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: 48, padding: "20px 24px",
          background: "rgba(255,68,102,0.05)",
          border: "1px solid rgba(255,68,102,0.15)",
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 9, color: "#ff4466", letterSpacing: "0.12em", fontFamily: mono, marginBottom: 10, fontWeight: 700 }}>DISCLAIMER</div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: 0 }}>
            QuantSignal is an educational and analytical tool. All signals are generated by machine learning models and do not constitute financial advice. Past backtest performance does not guarantee future results. Markets are inherently unpredictable — always conduct your own research and never risk capital you cannot afford to lose.
          </p>
        </div>

      </div>
    </div>
  );
}
