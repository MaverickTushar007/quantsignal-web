"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Zap, Target, BarChart3, Wallet, ShieldAlert, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: Sparkles,
    color: "#3b82f6",
    title: "Welcome to FinSight Elite",
    subtitle: "Next-Gen Quantitative Intelligence",
    body: "QuantSignal is now powered by the FinSight Neural Engine. We scan 86 markets in real-time, blending XGBoost ensembles with institutional RAG data to give you high-probability signals.",
    cta: "Show Me the Neural Edge",
  },
  {
    icon: Zap,
    color: "#10b981",
    title: "Step 1 — The Signal Engine",
    subtitle: "Direction + Confidence + Confluence",
    body: "Each asset features a FinSight Direction (BUY/SELL). Look for the 'Confluence Score' (e.g., 7/9)—this means 7 out of 9 proprietary indicators are in total agreement with our ML models.",
  },
  {
    icon: Target,
    color: "#f59e0b",
    title: "Step 2 — Trade Levels",
    subtitle: "Calculated via Market Volatility (ATR)",
    body: "We don't guess. Our Entry, Take Profit, and Stop Loss levels are dynamically calculated using the Average True Range (ATR). This ensures your risk-to-reward ratio is always mathematically sound.",
  },
  {
    icon: Wallet,
    color: "#6366f1",
    title: "Step 3 — Professional Sizing",
    subtitle: "The Kelly Criterion Guide",
    body: "The Kelly % tells you exactly how much capital to risk based on the signal's probability. It's the secret weapon of pro gamblers and hedge funds to maximize growth while avoiding ruin.",
  },
  {
    icon: MessageSquare,
    color: "#06b6d4",
    title: "Step 4 — FinSight Assistant",
    subtitle: "Your On-Demand Quant Analyst",
    body: "Click the floating blue Zap icon anytime to chat with FinSight. It uses RAG (Retrieval-Augmented Generation) to analyze macro sentiment and technical trends across all global markets.",
  },
  {
    icon: ShieldAlert,
    color: "#ef4444",
    title: "Final Protocol",
    subtitle: "Risk Management & Education",
    body: "FinSight is an educational intelligence layer. Markets are volatile and signals can fail. Never trade more than you can afford to lose. Use our levels as a guide, not a guarantee.",
    cta: "Initialize Dashboard",
  },
];

import { MessageSquare } from "lucide-react";

export default function TutorialModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleOpen = () => { setStep(0); setVisible(true); };
    window.addEventListener("open-tutorial", handleOpen);
    
    const seen = localStorage.getItem("qs_tutorial_seen");
    if (!seen) setVisible(true);
    
    return () => window.removeEventListener("open-tutorial", handleOpen);
  }, []);

  const dismiss = () => {
    localStorage.setItem("qs_tutorial_seen", "1");
    setVisible(false);
  };

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0b0b12] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        {/* Progress Header */}
        <div className="flex gap-1.5 p-6 pb-0">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${i === step ? "flex-[2]" : "flex-1"}`}
              style={{ background: i <= step ? current.color : "rgba(255,255,255,0.05)" }}
            />
          ))}
        </div>

        <div className="p-10 pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center shadow-lg"
                style={{ background: `${current.color}15`, border: `1px solid ${current.color}30` }}
              >
                <current.icon size={32} style={{ color: current.color }} />
              </div>

              <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase mb-2">
                {step === 0 ? "INITIALIZING PLATFORM" : `PROTOCOL STEP 0${step}`}
              </p>
              
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                {current.title}
              </h2>
              <p className="text-xs font-semibold uppercase tracking-wider mb-6" style={{ color: current.color }}>
                {current.subtitle}
              </p>
              
              <p className="text-[14px] text-white/50 leading-relaxed font-medium mb-12">
                {current.body}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <button 
              onClick={() => step > 0 && setStep(step - 1)}
              className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${step === 0 ? "opacity-0 pointer-events-none" : "text-white/30 hover:text-white"}`}
            >
              Back
            </button>

            <div className="flex items-center gap-4">
              {step === 0 && (
                 <button onClick={dismiss} className="text-[11px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest">
                   Skip
                 </button>
              )}
              <button 
                onClick={isLast ? dismiss : () => setStep(step + 1)}
                className="px-8 py-3 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-xl"
                style={{ background: current.color, color: "#000" }}
              >
                {isLast ? (current.cta || "Access Dashboard") : (current.cta || "Proceed →")}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
