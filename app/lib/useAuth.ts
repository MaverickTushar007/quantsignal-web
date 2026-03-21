"use client";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_pro")
            .eq("id", session.user.id)
            .single();
          setIsPro(profile?.is_pro || false);
        }
      } catch {}
      finally { setLoading(false); }
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_pro")
          .eq("id", session.user.id)
          .single();
        setIsPro(profile?.is_pro || false);
      } else {
        setUser(null);
        setIsPro(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return { user, isPro, loading };
}
