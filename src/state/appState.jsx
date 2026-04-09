import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import numbersData from "../numbers.json";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const localFallback = numbersData.map((n, i) => ({
  id: `rn${i}`,
  plate: n.number,
  price: n.price,
  status: "В наличии",
  imageUrl: null,
}));

function mapPlateRow(row) {
  return {
    id: row.id,
    plate: row.plate,
    price: Number(row.price),
    status: row.status,
    imageUrl: row.image_url || null,
  };
}

/** Первый ответ маленький — быстрее показать первую страницу (~12 карточек); дальше догружаем батчами. */
const PLATES_FIRST_BATCH = 12;
const PLATES_BATCH = 96;

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => new Set());

  const [numberQuery, setNumberQuery] = useState("");
  const [numberQueryParts, setNumberQueryParts] = useState({
    l1: "",
    d1: "",
    d2: "",
    d3: "",
    l2: "",
    l3: "",
    r: "",
  });

  const [numbers, setNumbers] = useState(() =>
    isSupabaseConfigured ? [] : localFallback
  );
  const [numbersLoading, setNumbersLoading] = useState(isSupabaseConfigured);
  const [numbersLoadingMore, setNumbersLoadingMore] = useState(false);
  const [numbersError, setNumbersError] = useState(null);

  const fetchPlates = useCallback(async () => {
    if (!supabase) {
      setNumbers(localFallback);
      setNumbersLoading(false);
      setNumbersLoadingMore(false);
      return;
    }
    setNumbersLoading(true);
    setNumbersLoadingMore(false);
    setNumbersError(null);
    setNumbers([]);

    const baseQuery = () =>
      supabase
        .from("plates")
        .select("id, plate, price, status, image_url")
        .order("created_at", { ascending: false });

    const { data: first, error: errFirst } = await baseQuery().range(0, PLATES_FIRST_BATCH - 1);
    if (errFirst) {
      setNumbersError(errFirst.message);
      setNumbers([]);
      setNumbersLoading(false);
      return;
    }

    const rows = (first || []).map(mapPlateRow);
    setNumbers(rows);
    setNumbersLoading(false);

    if (!first?.length || first.length < PLATES_FIRST_BATCH) {
      return;
    }

    setNumbersLoadingMore(true);
    let from = PLATES_FIRST_BATCH;
    const seen = new Set(rows.map((r) => r.id));
    for (;;) {
      const { data: chunk, error: errChunk } = await baseQuery().range(from, from + PLATES_BATCH - 1);
      if (errChunk) {
        setNumbersError(errChunk.message);
        break;
      }
      if (!chunk?.length) break;
      const mapped = chunk.map(mapPlateRow).filter((r) => {
        if (seen.has(r.id)) return false;
        seen.add(r.id);
        return true;
      });
      setNumbers((prev) => [...prev, ...mapped]);
      if (chunk.length < PLATES_BATCH) break;
      from += PLATES_BATCH;
    }
    setNumbersLoadingMore(false);
  }, []);

  useEffect(() => {
    fetchPlates();
  }, [fetchPlates]);

  const value = useMemo(
    () => ({
      numbers,
      numbersLoading,
      numbersLoadingMore,
      numbersError,
      refreshNumbers: fetchPlates,
      favorites,
      setFavorites,
      numberQuery,
      setNumberQuery,
      numberQueryParts,
      setNumberQueryParts,
    }),
    [
      numbers,
      numbersLoading,
      numbersLoadingMore,
      numbersError,
      fetchPlates,
      favorites,
      numberQuery,
      numberQueryParts,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
