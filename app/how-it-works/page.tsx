"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

const SECTIONS = [
  {
    id: "signals",
    title: "How signals are generated",
    short: "The full pipeline from raw price data to BUY/SELL/HOLD",
    steps: [
      { label: "Price data", desc: "yFinance fetches 2 years of daily OHLCV data for each of the 86 assets every time a signal is requested." },
      { label: "21 features", desc: "Raw price data is transformed into 21 technical indicators including RSI, MACD, Bollinger Bands, Stochastic, Volume ratios, SMA distances, 52-week position, and momentum." },
      { label: "ML ensemble", desc: "XGBoost and LightGBM are trained on those 21 features. They predict the probability that the asset moves up more than 2% in the next 5 days." },
      { label: "Sentiment blend", desc: "Live news from 7 RSS feeds is scored BULLISH/BEARISH/NEUTRAL and blended in at 10% weight alongside the ML probabilities." },
      { label: "Final signal", desc: "Above 55% probability = BUY. Below 45% = SELL. In between = HOLD. Confidence (HIGH/MEDIUM/LOW) reflects how far the probability is from 50%." },
    ],
  },
  {
    id: "confluence",
    title: "What the 9-factor confluence means",
    short: "Why nine indicators and how to read the score",
    steps: [
      { label: "RSI-14", desc: "Relative Strength Index. Below 30 = oversold (bullish). Above 70 = overbought (bearish)." },
      { label: "MACD", desc: "When MACD histogram is positive, short-term momentum is up. When negative, momentum is down." },
      { label: "Bollinger Band %", desc: "Above 80% = near upper band (overbought). Below 20% = near lower band (oversold)." },
      { label: "Stochastic %K", desc: "Above 80 = overbought. Below 20 = oversold. Similar to RSI but uses the high-low range." },
      { label: "Volume", desc: "Volume above 20-day average confirms the move. Below average suggests weak conviction." },
      { label: "SMA Cross 20/50", desc: "SMA20 above SMA50 = bullish trend. SMA20 below SMA50 = bearish trend." },
      { label: "vs SMA20", desc: "Price above its 20-day moving average = short-term bullish. Below = short-term bearish." },
      { label: "52-Week Position", desc: "Near the yearly high = strong momentum. Near the yearly low = potential value or continued downtrend." },
      { label: "5D Momentum", desc: "Simple 5-day price return. Positive = short-term bullish. Negative = short-term bearish." },
    ],
  },
  {
    id: "levels",
    title: "How Take Profit and Stop Loss are calculated",
    short: "ATR-based volatility-adjusted levels — not arbitrary percentages",
    steps: [
      { label: "What is ATR?", desc: "Average True Range measures the average daily price range over 14 days. High ATR = volatile asset. Low ATR = quiet asset." },
      { label: "Take Profit", desc: "Entry + (2 x ATR) for BUY signals. Targets a move equivalent to twice the average daily range." },
      { label: "Stop Loss", desc: "Entry - (1 x ATR) for BUY signals. Gives the trade room within normal daily volatility before cutting the loss." },
      { label: "Why not fixed %?", desc: "A fixed 5% stop on Bitcoin (moves 3% daily) gets hit constantly. ATR-based levels adapt to each asset's actual current volatility." },
    ],
  },
  {
    id: "kelly",
    title: "Kelly Criterion position sizing",
    short: "The math behind how much to risk on each trade",
    steps: [
      { label: "What is Kelly?", desc: "A formula that calculates the optimal fraction of capital to risk, given your win probability and the risk/reward ratio." },
      { label: "The formula", desc: "Kelly % = (p x b - q) / b — where p = win probability, q = 1-p, b = risk/reward ratio." },
      { label: "Fractional Kelly", desc: "QuantSignal uses 25% of full Kelly — standard practice to reduce variance while keeping the mathematical edge." },
      { label: "How to use it", desc: "Kelly Size 8% with Rs 1,00,000 available = risk Rs 8,000 on this trade. A guide, not a rule. Always apply your own judgment." },
    ],
  },
  {
    id: "backtest",
    title: "How the backtest works",
    short: "Walk-forward validation — what it means and why it matters",
    steps: [
      { label: "The problem with normal backtests", desc: "Most backtests train on all historical data then test on the same data. The model already saw the answers — results look better than reality." },
      { label: "Walk-forward validation", desc: "Train on 1 year, test on next 3 months, roll forward and repeat. The model never sees future data during training." },
      { label: "What the metrics mean", desc: "Win Rate = % of profitable trades. Sharpe Ratio = return divided by volatility (above 2.0 is excellent). Max Drawdown = worst peak-to-trough loss." },
      { label: "Why it still is not a guarantee", desc: "Market regimes change. A strategy that worked in a bull market may underperform in a bear market. Use the backtest as one data point, not a promise." },
    ],
  },
];

function Section({ s }: { s: typeof SECTIONS[0] }) {
  const [open, setOpen] = useState(false);
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, marginBottom: 12, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: open ? "rgba(255,255,255,0.04)" : "transparent",
        border: "none", padding: "18px 20px", cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        color: "#e2e8f0", textAlign: "left",
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{s.short}</div>
        </div>
        {open ? <ChevronUp size={16} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.3)" />}
      </button>

      {open && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "8px 20px 20px" }}>
          {s.steps.map((step, i) => (
            <div key={i} style={{ marginTop: 12 }}>
              <button onClick={() => setOpenStep(openStep === i ? null : i)} style={{
                width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8, padding: "12px 16px", cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "space-between", color: "#e2e8f0",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 10, color: "#00ff88", fontWeight: 700, minWidth: 20 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{step.label}</span>
                </div>
                {openStep === i ? <ChevronUp size={14} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={14} color="rgba(255,255,255,0.3)" />}
              </button>
              {openStep === i && (
                <div style={{ padding: "12px 16px 4px 48px", fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
                  {step.desc}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div style={{ minHeight: "100vh", background: "#060608", color: "#e2e8f0", fontFamily: "inherit", padding: "40px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.35)", fontSize: 12, textDecoration: "none", marginBottom: 40 }}>
          <ArrowLeft size={14} /> Back to dashboard
        </a>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 9, color: "#00ff88", letterSpacing: "0.15em", marginBottom: 12 }}>DOCUMENTATION</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>How QuantSignal works</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 560 }}>
            A complete explanation of every number you see — signals, confluence, Take Profit, Stop Loss, Kelly sizing, and backtesting.
          </p>
        </div>
        {SECTIONS.map(s => <Section key={s.id} s={s} />)}
        <div style={{ marginTop: 48, padding: 24, background: "rgba(255,68,102,0.06)", border: "1px solid rgba(255,68,102,0.15)", borderRadius: 10 }}>
          <div style={{ fontSize: 10, color: "#ff4466", letterSpacing: "0.1em", marginBottom: 8 }}>IMPORTANT DISCLAIMER</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.8 }}>
            QuantSignal is an educational tool. All signals are generated by machine learning models and do not constitute financial advice. Past backtest performance does not guarantee future results. Always do your own research.
          </div>
        </div>
      </div>
    </div>
  );
}
