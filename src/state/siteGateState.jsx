import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "avtonomera.siteGate.v1";
const TOKEN_SALT = "avtonomera-vip-site-gate";

const SiteGateContext = createContext(null);

export function getSiteGateCredentials() {
  const login = String(process.env.REACT_APP_SITE_LOGIN || "").trim();
  const password = String(process.env.REACT_APP_SITE_PASSWORD || "");
  return {
    login,
    password,
    isConfigured: Boolean(login && password),
  };
}

async function tokenFor(login, password) {
  const payload = `${login}\n${password}\n${TOKEN_SALT}`;
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const data = new TextEncoder().encode(payload);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return `fallback:${payload}`;
}

export function SiteGateProvider({ children }) {
  const { login, password, isConfigured } = useMemo(() => getSiteGateCredentials(), []);
  const [unlocked, setUnlocked] = useState(!isConfigured);
  const [ready, setReady] = useState(!isConfigured);

  useEffect(() => {
    if (!isConfigured) {
      setUnlocked(true);
      setReady(true);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      const expected = await tokenFor(login, password);
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!cancelled) {
        setUnlocked(stored === expected);
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isConfigured, login, password]);

  const unlock = useCallback(
    async (enteredLogin, enteredPassword) => {
      if (!isConfigured) return true;
      if (enteredLogin.trim() !== login || enteredPassword !== password) {
        return false;
      }
      const token = await tokenFor(login, password);
      window.localStorage.setItem(STORAGE_KEY, token);
      setUnlocked(true);
      return true;
    },
    [isConfigured, login, password]
  );

  const lock = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUnlocked(false);
  }, []);

  const value = useMemo(
    () => ({
      isConfigured,
      ready,
      unlocked: !isConfigured || unlocked,
      unlock,
      lock,
    }),
    [isConfigured, ready, unlocked, unlock, lock]
  );

  return <SiteGateContext.Provider value={value}>{children}</SiteGateContext.Provider>;
}

export function useSiteGate() {
  const ctx = useContext(SiteGateContext);
  if (!ctx) throw new Error("useSiteGate must be used within SiteGateProvider");
  return ctx;
}
