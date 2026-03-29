const API_BASE = "https://quantsignal-api-production.up.railway.app/api/v1";

export async function fetchSignal(symbol: string) {
  const res = await fetch(`${API_BASE}/signals/${symbol}?reason=true`);
  if (!res.ok) throw new Error("Failed to fetch signal");
  const data = await res.json();
  // Map flat energy fields to nested object for dashboard energy badge
  if (data.energy_state) {
    data.energy = {
      state: data.energy_state,
      score: data.energy_score,
      bias:  data.energy_bias,
      reason: data.energy_reason,
    };
  }
  return data;
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
