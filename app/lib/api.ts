const API_BASE = "quantsignal-api-production-a5e1.up.railway.app";

export class UpgradeRequiredError extends Error {
  used: number; limit: number; kind: string;
  constructor(detail: any) {
    super(detail.error || "Limit reached");
    this.used  = detail.used  ?? 0;
    this.limit = detail.limit ?? 0;
    this.kind  = detail.error?.toLowerCase().includes("perseus") ? "perseus" : "signals";
  }
}

export function getUserId(): string {
  if (typeof window === "undefined") return "anonymous";
  try {
    // Supabase stores session in localStorage under this key
    const raw = localStorage.getItem(
      Object.keys(localStorage).find(k => k.includes("supabase") && k.includes("auth")) || ""
    );
    if (raw) {
      const parsed = JSON.parse(raw);
      const uid = parsed?.user?.id || parsed?.session?.user?.id;
      if (uid) return uid;
    }
  } catch {}
  return localStorage.getItem("user_id") || "anonymous";
}

async function apiFetch(url: string, opts: RequestInit = {}): Promise<any> {
  const userId = getUserId();
  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string> || {}),
    "x-user-id": userId,
  };
  const res = await fetch(url, { ...opts, headers });
  if (res.status === 429) {
    const detail = await res.json().catch(() => ({}));
    throw new UpgradeRequiredError(detail.detail || detail);
  }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function fetchSignal(symbol: string) {
  const data = await apiFetch(`${API_BASE}/signals/${symbol}?reason=true`);
  if (data.energy_state) {
    data.energy = {
      state:  data.energy_state,
      score:  data.energy_score,
      bias:   data.energy_bias,
      reason: data.energy_reason,
    };
  }
  return data;
}

export async function fetchAllSignals(type?: string) {
  const url = type ? `${API_BASE}/signals?type=${type}` : `${API_BASE}/signals`;
  return apiFetch(url);
}

export async function fetchMarketMood() {
  return apiFetch(`${API_BASE}/market/mood`);
}
