"use client";
import { motion } from "framer-motion";

export const FadeUp = ({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay, ease: "easeOut" }}
    style={style}
  >
    {children}
  </motion.div>
);

export const FadeIn = ({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.25, delay, ease: "easeOut" }}
    style={style}
  >
    {children}
  </motion.div>
);

export const SlideInRight = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <motion.div
    initial={{ opacity: 0, x: 24 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    style={style}
  >
    {children}
  </motion.div>
);

export const PriceFlash = ({ children, value }: { children: React.ReactNode; value: any }) => (
  <motion.span
    key={value}
    initial={{ color: "#ffffff" }}
    animate={{ color: "#e2e8f0" }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.span>
);

export const StaggerList = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 8 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }
    }}
    style={style}
  >
    {children}
  </motion.div>
);
