export const API_BASE = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is not set — check your deployment environment variables.");
  return url;
})();

export function formatPrice(price: number, type: string, symbol: string): string {
  if (type === "IN_STOCK" || symbol?.endsWith(".NS") || symbol?.endsWith(".BO")) {
    return "₹" + price?.toLocaleString("en-IN");
  }
  return "$" + price?.toLocaleString();
}

export const TYPE_FILTERS = ["ALL", "CRYPTO", "STOCK", "ETF", "INDEX", "COMMOD", "FOREX", "INDIA"];
export const dirColor = (d: string) => d === "BUY" ? "#00ff88" : d === "SELL" ? "#ff4466" : "#ffd700";
export const badge = (d: string) => ({
  background: d === "BUY" ? "rgba(0,255,136,0.12)" : d === "SELL" ? "rgba(255,68,102,0.12)" : "rgba(255,215,0,0.12)",
  color: dirColor(d),
  border: `1px solid ${d === "BUY" ? "rgba(0,255,136,0.3)" : d === "SELL" ? "rgba(255,68,102,0.3)" : "rgba(255,215,0,0.3)"}`,
  padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em",
});

export function getExecutionWindows() {
  const now = new Date();
  const estHour = (now.getUTCHours() - 5 + 24) % 24;
  return [
    { label: "ASIA SESSION", range: "00:00–04:00 EST", active: estHour >= 0 && estHour < 4, color: "#aa44ff" },
    { label: "LONDON OPEN", range: "04:00–08:00 EST", active: estHour >= 4 && estHour < 8, color: "#00aaff" },
    { label: "PRIME WINDOW", range: "08:00–12:00 EST", active: estHour >= 8 && estHour < 12, color: "#00ff88" },
    { label: "NY AFTERNOON", range: "13:00–16:00 EST", active: estHour >= 13 && estHour < 16, color: "#ffd700" },
  ];
}

export const TIMEZONES = [
  { label: "IST", offset: 5.5,  flag: "🇮🇳" },
  { label: "EST", offset: -5, iana: "America/New_York", flag: "🗽" },
  { label: "GMT", offset:  0, iana: "Europe/London",    flag: "🇬🇧" },
  { label: "IST", offset: 5.5, iana: "Asia/Kolkata",    flag: "🇮🇳" },
  { label: "JST", offset:  9, iana: "Asia/Tokyo",       flag: "🇯🇵" },
];

