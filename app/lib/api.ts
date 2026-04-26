const API_BASE = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is not set — check your deployment environment variables.");
  return url;
})();

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

export async function subscribeAlert(email: string, symbol: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/alerts/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, symbols: [symbol] }),
    });
    return res.ok;
  } catch { return false; }
}

export async function fetchTradeHistory(): Promise<any> {
  return fetch(`${API_BASE}/history/trades?limit=500`).then(r => r.json());
}

export async function fetchEvStats(): Promise<any> {
  return fetch(`${API_BASE}/system/ev-stats`).then(r => r.json());
}

export async function fetchMorningBriefing(): Promise<any> {
  return fetch(`${API_BASE}/system/morning-briefing`).then(r => r.json());
}

export async function fetchReplay(symbol: string, replayDate: string): Promise<any> {
  const res = await fetch(`${API_BASE}/signals/${symbol}/replay?replay_date=${replayDate}`);
  if (!res.ok) throw new Error(`Replay error ${res.status}`);
  return res.json();
}

export async function explainReplay(payload: Record<string, any>): Promise<any> {
  const res = await fetch(`${API_BASE}/replay/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Explain error ${res.status}`);
  return res.json();
}

export async function createCheckout(email: string, userId: string): Promise<{ checkout_url?: string }> {
  const res = await fetch(`${API_BASE}/payments/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, user_id: userId }),
  });
  return res.json();
}

// ── Phase 7 — Intelligence endpoints ─────────────────────────────────────────

export async function fetchResearch(symbol: string) {
  return apiFetch(`${API_BASE}/research/${symbol}`);
}

export async function fetchResearchSummary(symbol: string) {
  return apiFetch(`${API_BASE}/research/${symbol}/summary`);
}

export async function analyzeDocument(file: File, symbol?: string, question?: string) {
  const userId = getUserId();
  const form = new FormData();
  form.append("file", file);
  if (symbol)   form.append("symbol", symbol);
  if (question) form.append("question", question);
  const res = await fetch(`${API_BASE}/documents/analyze`, {
    method: "POST",
    headers: { "x-user-id": userId },
    body: form,
  });
  if (!res.ok) throw new Error(`Document analysis error ${res.status}`);
  return res.json();
}

export async function fetchPortfolioXRay(holdings: Array<{symbol: string; value: number; side?: string; sector?: string}>, fetchSignals = false) {
  return apiFetch(`${API_BASE}/portfolio/xray`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ holdings, fetch_signals: fetchSignals }),
  });
}

export async function fetchRegimeFit(symbols: string[]) {
  return apiFetch(`${API_BASE}/portfolio/regime-fit?symbols=${symbols.join(",")}`);
}
