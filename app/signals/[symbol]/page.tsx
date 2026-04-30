"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SignalDetailRedirect() {
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    const symbol = params?.symbol as string;
    router.replace(symbol ? `/dashboard?symbol=${encodeURIComponent(symbol)}` : "/dashboard");
  }, [router, params]);
  return (
    <div style={{ background: "#0D0D12", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Loading signal...</div>
    </div>
  );
}
