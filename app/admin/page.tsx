"use client";
import { useEffect, useState } from "react";

const API = "https://quantsignal-api-production-a5e1.up.railway.app/api/v1";

function fmt(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(Math.round(n));
}

export default function AdminPage() {
  const [tokens, setTokens] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [t, d] = await Promise.all([
      fetch(`${API}/admin/token-usage`).then((r) => r.json()),
      fetch(`${API}/admin/dashboard`).then((r) => r.json()),
    ]);
    setTokens(t);
    setDashboard(d);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  const todayUsers = tokens?.today?.users || [];
  const weekUsers = tokens?.last_7_days?.per_user || [];
  const maxToday = todayUsers[0]?.tokens_used || 1;
  const maxWeek = weekUsers[0]?.tokens_used || 1;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Admin dashboard</h1>
        <button onClick={load} className="text-sm px-3 py-1 border rounded">Refresh</button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Tokens today", value: fmt(tokens?.today?.total_tokens || 0) },
          { label: "Tokens (7d)", value: fmt(tokens?.last_7_days?.total_tokens || 0) },
          { label: "Users today", value: todayUsers.length },
          { label: "Signals (7d)", value: dashboard?.weekly_volume?.last_7d || 0 },
        ].map((m) => (
          <div key={m.label} className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className="text-2xl font-medium">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-4 mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Top users today</p>
        {todayUsers.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
        ) : (
          todayUsers.slice(0, 10).map((u: any) => (
            <div key={u.user_id} className="flex items-center gap-3 py-2 border-b last:border-0">
              <span className="font-mono text-xs text-gray-400 w-40 truncate">{u.user_id.slice(0, 12)}...{u.user_id.slice(-6)}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.round((u.tokens_used / maxToday) * 100)}%` }} />
              </div>
              <span className="text-sm font-medium w-14 text-right">{fmt(u.tokens_used)}</span>
            </div>
          ))
        )}
      </div>

      <div className="border rounded-lg p-4 mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Top users this week</p>
        {weekUsers.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
        ) : (
          weekUsers.slice(0, 10).map((u: any) => (
            <div key={u.user_id} className="flex items-center gap-3 py-2 border-b last:border-0">
              <span className="font-mono text-xs text-gray-400 w-40 truncate">{u.user_id.slice(0, 12)}...{u.user_id.slice(-6)}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.round((u.tokens_used / maxWeek) * 100)}%` }} />
              </div>
              <span className="text-sm font-medium w-14 text-right">{fmt(u.tokens_used)}</span>
            </div>
          ))
        )}
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Signal quality (7d)</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Avg EV — buy</p>
            <p className="text-lg font-medium">{dashboard?.signal_quality?.avg_ev_buy || "N/A"}</p>
            <p className="text-xs text-gray-400">{dashboard?.signal_quality?.buy_count || 0} signals</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Avg EV — sell</p>
            <p className="text-lg font-medium">{dashboard?.signal_quality?.avg_ev_sell || "N/A"}</p>
            <p className="text-xs text-gray-400">{dashboard?.signal_quality?.sell_count || 0} signals</p>
          </div>
        </div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Top symbols</p>
        {(dashboard?.top_symbols || []).map((s: any) => (
          <div key={s.symbol} className="flex items-center gap-3 py-1.5 text-sm">
            <span className="font-medium w-16">{s.symbol}</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.round((s.count / (dashboard.top_symbols[0]?.count || 1)) * 100)}%` }} />
            </div>
            <span className="text-gray-500 w-8 text-right">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
