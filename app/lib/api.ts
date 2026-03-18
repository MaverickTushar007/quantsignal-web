const API_BASE = "https://web-production-80553.up.railway.app/api/v1";

export async function fetchSignal(symbol: string) {
  const res = await fetch(`${API_BASE}/signals/${symbol}?reason=false`);
  if (!res.ok) throw new Error("Failed to fetch signal");
  return res.json();
}

export async function fetchAllSignals(type?: string) {
  const url = type ? `${API_BASE}/signals?type=${type}` : `${API_BASE}/signals`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch signals");
  return res.json();
}

export async function fetchMarketMood() {
  const res = await fetch(`${API_BASE}/market/mood`);
  if (!res.ok) throw new Error("Failed to fetch mood");
  return res.json();
}
