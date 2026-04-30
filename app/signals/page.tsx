"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignalsRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard"); }, [router]);
  return (
    <div style={{ background: "#0D0D12", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Loading signals...</div>
    </div>
  );
}
