"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../lib/useAuth";

const NAV = [
  { href: "/dashboard",  label: "Dashboard",   icon: "▣", desc: "Signals & market" },
  { href: "/research",   label: "Research",     icon: "◎", desc: "Evidence intel" },
  { href: "/documents",  label: "Documents",    icon: "◫", desc: "PDF & uploads" },
  { href: "/xray",       label: "X-Ray",        icon: "◈", desc: "Portfolio scan" },
  { href: "/guardian",   label: "Guardian",     icon: "⬡", desc: "Risk monitor" },
  { href: "/agents",     label: "Agents",       icon: "◉", desc: "AI agents" },
  { href: "/portfolio",  label: "Portfolio",    icon: "◱", desc: "Holdings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isPro, loading } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const mono = "'IBM Plex Mono', monospace";

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
  }, [user, loading, router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#060608", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em" }}>LOADING...</div>
    </div>
  );

  if (!user) return null;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#060608", fontFamily: mono, color: "#e2e8f0" }}>

      {/* Sidebar */}
      <div style={{
        width: collapsed ? 56 : 220,
        flexShrink: 0,
        background: "#0a0a0d",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        overflow: "hidden",
      }}>

        {/* Logo */}
        <div style={{ padding: collapsed ? "16px 0" : "16px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", flexShrink: 0 }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, background: "#00ff88", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#000" }}>P</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Perseus</span>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4, fontSize: 14, lineHeight: 1 }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Plan badge */}
        {!collapsed && (
          <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: isPro ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.04)",
              border: isPro ? "1px solid rgba(255,215,0,0.25)" : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6, padding: "4px 10px",
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: isPro ? "#ffd700" : "rgba(255,255,255,0.3)" }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: isPro ? "#ffd700" : "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                {isPro ? "PRO" : "FREE"}
              </span>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
          {NAV.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <a key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: collapsed ? "11px 0" : "10px 16px",
                justifyContent: collapsed ? "center" : "flex-start",
                textDecoration: "none",
                background: active ? "rgba(0,255,136,0.07)" : "transparent",
                borderLeft: active ? "2px solid #00ff88" : "2px solid transparent",
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 14, color: active ? "#00ff88" : "rgba(255,255,255,0.3)", flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: active ? "#fff" : "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>{item.label}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 1 }}>{item.desc}</div>
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: collapsed ? "12px 0" : "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,255,136,0.15)", border: "1px solid rgba(0,255,136,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#00ff88", flexShrink: 0 }}>
            {user.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
              <button onClick={async () => { const { supabase } = await import("../lib/supabase"); await supabase.auth.signOut(); router.replace("/auth"); }}
                style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.25)", fontSize: 9, cursor: "pointer", padding: 0, fontFamily: mono, letterSpacing: "0.06em", marginTop: 2 }}>
                SIGN OUT
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ height: 44, flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "#08080b" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
            {NAV.find(n => pathname.startsWith(n.href))?.label?.toUpperCase() ?? "PERSEUS"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 6px rgba(0,255,136,0.5)" }} />
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>LIVE</span>
            </div>
            {!isPro && (
              <a href="/pricing" style={{ fontSize: 9, fontWeight: 700, color: "#00ff88", border: "1px solid rgba(0,255,136,0.25)", borderRadius: 4, padding: "3px 10px", textDecoration: "none", letterSpacing: "0.08em", background: "rgba(0,255,136,0.05)" }}>
                UPGRADE →
              </a>
            )}
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
