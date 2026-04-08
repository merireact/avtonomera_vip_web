import React, { createContext, useContext, useMemo, useState } from "react";
import numbersData from "../numbers.json";

const realNumbers = numbersData.map((n, i) => ({
  id: `rn${i}`,
  plate: n.number,
  price: n.price,
  status: "В наличии"
}));

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => new Set());

  const [numberQuery, setNumberQuery] = useState("");
  const [numberQueryParts, setNumberQueryParts] = useState({
    l1: "", d1: "", d2: "", d3: "", l2: "", l3: "", r: ""
  });
  const [numberImages, setNumberImages] = useState(() => ({}));

  const value = useMemo(
    () => ({
      numbers: realNumbers,
      favorites,
      setFavorites,
      numberQuery,
      setNumberQuery,
      numberQueryParts,
      setNumberQueryParts,
      numberImages,
      setNumberImages,
    }),
    [favorites, numberQuery, numberQueryParts, numberImages]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

