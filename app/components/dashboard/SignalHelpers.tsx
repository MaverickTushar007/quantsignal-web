"use client";

export function StaleBadge({ sig }: { sig?: any }) {
  if (!sig?.is_stale) return null;
  return (
    <span style={{
      fontSize: 10, fontWeight: 800, padding: "2px 5px", borderRadius: 3,
      background: "rgba(150,150,150,0.1)",
      border: "1px solid rgba(150,150,150,0.3)",
      color: "rgba(180,180,180,0.7)",
      letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0,
    }}>
      ⏱ {sig.signal_age_hours}h OLD
    </span>
  );
}

export function MarketStatusBadge({ sig }: { sig?: any }) {
  if (sig?.market_open === undefined) return null;
  if (sig.market_open) return (
    <span style={{
      fontSize: 10, fontWeight: 800, padding: "2px 5px", borderRadius: 3,
      background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)",
      color: "rgba(0,255,136,0.7)", letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0,
    }}>● LIVE</span>
  );
  return (
    <span style={{
      fontSize: 10, fontWeight: 800, padding: "2px 5px", borderRadius: 3,
      background: "rgba(100,100,100,0.1)", border: "1px solid rgba(100,100,100,0.3)",
      color: "rgba(150,150,150,0.8)", letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0,
    }}>MARKET CLOSED</span>
  );
}

export function generateOneLiner(sig: any): string {
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
  }
  return `${name} is range-bound — ${driver} lacks directional conviction. Wait for a cleaner setup before entering.`;
}
