"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children, className, style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const lenis = new Lenis({
      wrapper: ref.current,
      content: ref.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf: number;
    const animate = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ overflowY: "auto", ...style }}>
      {children}
    </div>
  );
}
