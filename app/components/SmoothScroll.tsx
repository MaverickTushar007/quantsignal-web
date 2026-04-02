"use client";

export default function SmoothScroll({ children, className, style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        overflowY: "auto",
        scrollBehavior: "smooth",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
