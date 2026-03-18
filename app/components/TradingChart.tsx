"use client";
import { useEffect, useRef } from "react";

export default function TradingChart({ symbol }: { symbol: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    container.style.height = "100%";
    container.style.width = "100%";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "100%";
    widget.style.width = "100%";
    container.appendChild(widget);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol.replace("-USD", "USD").replace("=X", "").replace("=F", "1!"),
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(6, 6, 8, 1)",
      gridColor: "rgba(255, 255, 255, 0.04)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
    });
    container.appendChild(script);
    ref.current.appendChild(container);
  }, [symbol]);

  return <div ref={ref} style={{ height: "100%", width: "100%" }} />;
}
