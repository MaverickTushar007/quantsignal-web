"use client";
import { useEffect, useRef } from "react";

function getTVSymbol(symbol: string): string {
  const map: Record<string, string> = {
    "BTC-USD": "BINANCE:BTCUSDT",
    "ETH-USD": "BINANCE:ETHUSDT",
    "SOL-USD": "BINANCE:SOLUSDT",
    "BNB-USD": "BINANCE:BNBUSDT",
    "XRP-USD": "BINANCE:XRPUSDT",

    "DOGE-USD": "BINANCE:DOGEUSDT",
    "ADA-USD": "COINBASE:ADAUSD",
    "AVAX-USD": "COINBASE:AVAXUSD",
    "MATIC-USD": "COINBASE:MATICUSD",
    "DOT-USD": "COINBASE:DOTUSD",
    "LINK-USD": "COINBASE:LINKUSD",
    "LTC-USD": "BITSTAMP:LTCUSD",
    "ATOM-USD": "COINBASE:ATOMUSD",
    "NEAR-USD": "COINBASE:NEARUSD",
    "APT-USD": "COINBASE:APTUSD",
    "ARB-USD": "COINBASE:ARBUSD",
    "OP-USD": "COINBASE:OPUSD",
    "INJ-USD": "BINANCE:INJUSDT",
    "FET-USD": "BINANCE:FETUSDT",
    "RENDER-USD": "COINBASE:RNDR USD",
    "^GSPC": "SP:SPX",
    "^IXIC": "NASDAQ:NDX",
    "^DJI": "DJ:DJI",
    "^RUT": "TVC:RUT",
    "^VIX": "TVC:VIX",
    "^FTSE": "TVC:UKX",
    "^N225": "TVC:NI225",
    "^GDAXI": "TVC:DEU40",
    "^HSI": "TVC:HSI",
    "SPY": "AMEX:SPY",
    "QQQ": "NASDAQ:QQQ",
    "IWM": "AMEX:IWM",
    "GLD": "AMEX:GLD",
    "SLV": "AMEX:SLV",
    "TLT": "NASDAQ:TLT",
    "XLE": "AMEX:XLE",
    "XLF": "AMEX:XLF",
    "XLK": "AMEX:XLK",
    "XLV": "AMEX:XLV",
    "ARKK": "AMEX:ARKK",
    "IEMG": "AMEX:IEMG",
    "HYG": "AMEX:HYG",
    "GC=F": "TVC:GOLD",
    "CL=F": "TVC:USOIL",
    "SI=F": "TVC:SILVER",
    "NG=F": "TVC:NATGAS",
    "HG=F": "TVC:COPPER",
    "ZW=F": "CBOT:ZW1!",
    "EURUSD=X": "FX:EURUSD",
    "GBPUSD=X": "FX:GBPUSD",
    "USDJPY=X": "FX:USDJPY",
    "AUDUSD=X": "FX:AUDUSD",
    "USDCAD=X": "FX:USDCAD",
    "USDCHF=X": "FX:USDCHF",
    "USDINR=X": "FX:USDINR",
  };
  return map[symbol] || symbol;
}

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
      symbol: getTVSymbol(symbol),
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
