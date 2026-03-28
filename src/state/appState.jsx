import React, { createContext, useContext, useMemo, useState } from "react";
import { numbersMock } from "../utils/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => new Set());

  const [numberQuery, setNumberQuery] = useState("");
  const [numberImages, setNumberImages] = useState(() => ({}));

  const value = useMemo(
    () => ({
      numbers: numbersMock,
      favorites,
      setFavorites,
      numberQuery,
      setNumberQuery,
      numberImages,
      setNumberImages,
    }),
    [favorites, numberQuery, numberImages]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

