import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuantSignal — ML Trading Signals",
  description: "AI-powered trading signals for 86 assets",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'IBM Plex Mono', monospace", background: "#060608", color: "#e2e8f0", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
