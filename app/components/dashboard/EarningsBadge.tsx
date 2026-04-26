"use client";

import React from "react";

function EarningsBadge({ flag }: { flag?: any }) {
  if (!flag) return null;
  const urgent = flag.days_until <= 2;
  return (
    <span style={{
      fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 3,
      background: urgent ? "rgba(255,200,0,0.15)" : "rgba(255,200,0,0.08)",
      border: `1px solid ${urgent ? "rgba(255,200,0,0.5)" : "rgba(255,200,0,0.2)"}`,
      color: urgent ? "#ffc800" : "rgba(255,200,0,0.6)",
      letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0,
    }}>
      ⚡ EARNINGS {flag.label}
    </span>
  );
}

function generateOneLiner(sig: any): string {
  if (!sig) return "";
  const dir = sig.direction;
  const prob = sig.probability;
  const conf = sig.confidence?.toLowerCase() || "moderate";
  const bulls = sig.confluence_score ? parseInt(sig.confluence_score.split("/")[0]) : 5;
  const name = sig.display || sig.symbol;
  const features: string[] = sig.top_features || [];
  const driver = features[0] || "momentum";
  const agreement = bulls >= 7 ? "broad market agreement" : bulls >= 5 ? "mixed signals" : "contrarian setup";
  const strength = prob >= 0.75 ? "strong" : prob >= 0.6 ? "moderate" : "marginal";
  if (dir === "BUY") {
    const setups = [
      `${name} is showing ${strength} bullish momentum — ${driver} aligns with ${agreement} across ${bulls}/9 indicators.`,
      `Technical structure favors upside for ${name}: ${driver} is the primary driver with ${agreement}.`,
      `${name} has a ${conf}-confidence BUY setup — ${bulls}/9 factors bullish, led by ${driver}.`,
    ];
    return setups[bulls % setups.length];
  } else if (dir === "SELL") {
    const setups = [
      `${name} shows ${strength} bearish pressure — ${driver} is deteriorating with only ${bulls}/9 factors bullish.`,
      `Distribution signals on ${name}: ${driver} turning negative, ${agreement} to the downside.`,
      `${name} has a ${conf}-confidence SELL setup — bearish confluence building across key indicators.`,
    ];
    return setups[bulls % setups.length];
  } else {
    return `${name} is range-bound — ${driver} lacks directional conviction. Wait for a cleaner setup before entering.`;
  }
}
