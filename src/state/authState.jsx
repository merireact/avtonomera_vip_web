import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function loadManager(uid) {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "manager")
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setIsManager(false);
        return;
      }
      setIsManager(Boolean(data));
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (cancelled) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user?.id) {
        setIsManager(false);
        loadManager(s.user.id).finally(() => {
          if (!cancelled) setAuthLoading(false);
        });
      } else {
        setIsManager(false);
        setAuthLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user?.id) {
        setIsManager(false);
        setAuthLoading(true);
        loadManager(s.user.id).finally(() => setAuthLoading(false));
      } else {
        setIsManager(false);
        setAuthLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      isManager,
      authLoading,
      isSupabaseConfigured,
      async signOut() {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    }),
    [session, user, isManager, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
