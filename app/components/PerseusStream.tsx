"use client";
import { useState, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://quantsignal-api-production.up.railway.app/api/v1";

const STEPS = [
  { id: 1, label: "Loading signal history" },
  { id: 2, label: "Running technical analysis" },
  { id: 3, label: "Calibrating confidence" },
  { id: 4, label: "Validating timeframes" },
  { id: 5, label: "Running risk assessment" },
  { id: 6, label: "Perseus generating reasoning" },
];

type StepState = { status: "running" | "done"; detail?: string };

interface PerseusStreamProps {
  symbol: string;
  onComplete?: (signal: any) => void;
}

export function PerseusStream({ symbol, onComplete }: PerseusStreamProps) {
  const [steps, setSteps] = useState<Record<number, StepState>>({});
  const [result, setResult] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  const run = () => {
    if (running) return;
    setRunning(true);
    setSteps({});
    setResult(null);
    setError(null);

    const es = new EventSource(`${API_BASE}/signals/${symbol}/stream`);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        if (data.type === "result") {
          setResult(data.signal);
          onComplete?.(data.signal);
          es.close();
          setRunning(false);
          return;
        }

        if (data.type === "error") {
          setError(data.message || "Stream error");
          es.close();
          setRunning(false);
          return;
        }

        if (data.step) {
          setSteps((prev) => ({
            ...prev,
            [data.step]: { status: data.status, detail: data.detail },
          }));
        }
      } catch {}
    };

    es.onerror = () => {
      setError("Connection lost — check API");
      es.close();
      setRunning(false);
    };
  };

  const reset = () => {
    esRef.current?.close();
    setSteps({});
    setResult(null);
    setRunning(false);
    setError(null);
  };

  return (
    <div style={{
      background: "rgba(0,0,0,0.35)",
      border: "1px solid rgba(0,255,136,0.1)",
      borderRadius: 6,
      padding: 20,
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      {/* Header */}
      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
        color: "rgba(0,255,136,0.4)", marginBottom: 16,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span>PERSEUS REASONING ENGINE — {symbol}</span>
        {result && (
          <button onClick={reset} style={{
            background: "none", border: "none",
            color: "rgba(255,255,255,0.2)", cursor: "pointer",
            fontSize: 10, fontFamily: "inherit"
          }}>↺ RE-RUN</button>
        )}
      </div>

      {/* Run button */}
      {!running && !result && !error && (
        <button onClick={run} style={{
          background: "#00ff88", color: "#050c05",
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700, fontSize: 11,
          padding: "10px 24px", border: "none",
          cursor: "pointer", borderRadius: 4,
          letterSpacing: "0.06em",
        }}>
          RUN PERSEUS →
        </button>
      )}

      {/* Steps */}
      {(running || result) && (
        <div style={{ marginBottom: result ? 16 : 0 }}>
          {STEPS.map((step) => {
            const s = steps[step.id];
            const isDone = s?.status === "done";
            const isRunning = s?.status === "running";
            const isPending = !s;

            return (
              <div key={step.id} style={{
                display: "flex", alignItems: "center",
                gap: 10, marginBottom: 8,
                opacity: isPending ? 0.2 : 1,
                transition: "opacity 0.3s",
              }}>
                {/* Dot */}
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                  background: isDone ? "#00ff88" : isRunning ? "#00ff88" : "rgba(0,255,136,0.2)",
                  animation: isRunning ? "qs-flicker 1s ease-in-out infinite" : "none",
                }} />

                {/* Label */}
                <span style={{
                  fontSize: 11,
                  color: isDone ? "rgba(201,216,197,0.85)" : "rgba(201,216,197,0.35)",
                }}>
                  {step.label}
                  {isDone && s?.detail && (
                    <span style={{ color: "rgba(0,255,136,0.5)", marginLeft: 8 }}>
                      — {s.detail}
                    </span>
                  )}
                </span>

                {/* Checkmark */}
                {isDone && (
                  <span style={{ color: "#00ff88", fontSize: 10, marginLeft: "auto" }}>✓</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 12, fontSize: 10,
          color: "#ff4466",
          background: "rgba(255,68,102,0.08)",
          border: "1px solid rgba(255,68,102,0.2)",
          borderRadius: 4, padding: "8px 12px",
        }}>
          ✗ {error}
          <button onClick={run} style={{
            marginLeft: 12, background: "none",
            border: "none", color: "#ff4466",
            cursor: "pointer", fontFamily: "inherit",
            fontSize: 10, textDecoration: "underline"
          }}>retry</button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          paddingTop: 16,
          borderTop: "1px solid rgba(0,255,136,0.08)",
        }}>
          {/* Direction badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: result.direction === "BUY" ? "#00ff88" : result.direction === "SELL" ? "#ff4466" : "#ffd700",
              border: `1px solid ${result.direction === "BUY" ? "rgba(0,255,136,0.3)" : result.direction === "SELL" ? "rgba(255,68,102,0.3)" : "rgba(255,215,0,0.3)"}`,
              padding: "3px 10px", borderRadius: 4,
            }}>
              {result.direction}
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
              {(result.probability * 100).toFixed(0)}% confidence
            </span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
              · {result.confluence_score} confluence
            </span>
          </div>

          {/* Reasoning */}
          {result.reasoning && (
            <div style={{
              fontSize: 11, color: "rgba(255,255,255,0.7)",
              lineHeight: 1.75,
              background: "rgba(0,170,255,0.05)",
              border: "1px solid rgba(0,170,255,0.12)",
              borderRadius: 4, padding: "10px 14px",
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 9, color: "#00aaff", fontWeight: 700, marginBottom: 6, letterSpacing: "0.1em" }}>
                💡 PERSEUS REASONING
              </div>
              {result.reasoning}
            </div>
          )}

          {/* Trade levels */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "ENTRY", value: result.current_price, color: "#fff" },
              { label: "TP", value: result.take_profit, color: "#00ff88" },
              { label: "SL", value: result.stop_loss, color: "#ff4466" },
            ].map((l) => (
              <div key={l.label} style={{
                flex: 1, padding: "8px 10px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 4, textAlign: "center",
              }}>
                <div style={{ fontSize: 8, color: l.color, fontWeight: 700, marginBottom: 4 }}>{l.label}</div>
                <div style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>
                  ${l.value?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes qs-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
