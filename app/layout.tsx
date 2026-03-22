import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuantSignal — ML Trading Signals",
  description: "186 ML-powered trading signals — crypto, Indian stocks, US stocks, forex & commodities",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "QuantSignal",
  },

  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192" },
    ],
  },
  openGraph: {
    title: "QuantSignal — ML Trading Signals",
    description: "186 live signals across crypto, Indian stocks, US stocks, forex. 67% win rate.",
    type: "website",
    url: "https://quantsignal-web.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantSignal — ML Trading Signals",
    description: "186 live signals. 67% win rate. Indian + US + Crypto + Forex.",
  },
};

export const viewport = {
  themeColor: "#00ff88",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="QuantSignal" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ fontFamily: "'IBM Plex Mono', monospace", background: "#060608", color: "#e2e8f0", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
