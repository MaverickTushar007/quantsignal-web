"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/signals", icon: "signal_cellular_alt", label: "Signals" },
  { href: "/portfolio", icon: "account_balance_wallet", label: "Portfolio" },
  { href: "/replay", icon: "replay", label: "X-Ray Replay" },
  { href: "/briefing", icon: "wb_sunny", label: "Morning Briefing" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 z-50 flex flex-col py-6"
      style={{ background: "#0D0D12", borderRight: "1px solid #1E1E2E" }}>
      <div className="px-6 mb-8">
        <h1 className="text-lg font-bold tracking-tighter uppercase" style={{ color: "#3B82F6" }}>
          QuantSignal
        </h1>
        <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: "#475569" }}>
          Institutional Grade AI
        </p>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-6 py-3 text-sm transition-colors duration-150"
              style={{
                color: active ? "#3B82F6" : "#94A3B8",
                background: active ? "#13131E" : "transparent",
                borderLeft: active ? "2px solid #3B82F6" : "2px solid transparent",
              }}
            >
              <span className="material-symbols-outlined mr-3 text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 mt-auto">
        <div className="p-3 mb-4 rounded" style={{ background: "#13131E", border: "1px solid #1E1E2E" }}>
          <p className="text-[10px] font-bold flex items-center" style={{ color: "#10B981" }}>
            <span className="w-1.5 h-1.5 rounded-full mr-2 animate-pulse-dot" style={{ background: "#10B981" }}></span>
            API Status: Online
          </p>
          <p className="text-[10px] mt-1" style={{ color: "#475569" }}>28/184 signals cached</p>
        </div>
        <div className="flex items-center py-2 cursor-pointer" style={{ color: "#94A3B8" }}>
          <span className="material-symbols-outlined mr-3">account_circle</span>
          <span className="text-sm">User Profile</span>
        </div>
      </div>
    </aside>
  );
}
