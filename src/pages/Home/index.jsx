import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Hero from "../../components/Hero";
import styles from "./styles.module.css";
import { useApp } from "../../state/appState";
import PlateInput from "../../components/PlateInput";
import NumberDetailsModal from "../../components/NumberDetailsModal";
import SellNumberModal from "../../components/SellNumberModal";
import EstimateModal from "../../components/EstimateModal";
import { ChevronDown, Heart } from "lucide-react";

function formatPriceRub(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

function StatusPill({ status }) {
  const tone =
    status === "В наличии"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "В резерве"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs",
        tone,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function NumberSkeleton() {
  return (
    <div className="glass p-5 animate-pulse">
      <div className="h-5 w-28 rounded bg-slate-100" />
      <div className="mt-3 h-8 w-44 rounded bg-slate-100" />
      <div className="mt-4 h-9 w-full rounded-xl bg-slate-100" />
    </div>
  );
}

export default function Home() {
  const {
    numbers,
    numberQuery,
    setNumberQuery,
    numberImages,
    setNumberImages,
    favorites,
    setFavorites,
  } = useApp();
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    sameDigits: false,
    sameLetters: false,
    evenTens010: false,
    evenHundreds: false,
    onlyAvailable: false,
    exclusive: false,
    priceMin: null,
    priceMax: null,
    sort: "priceDesc",
  });
  const [details, setDetails] = useState(null);
  const [sellOpen, setSellOpen] = useState(false);
  const [estimateOpen, setEstimateOpen] = useState(false);

  const results = useMemo(() => {
    const q = numberQuery.trim().toLowerCase();
    const filtered = numbers
      .filter((n) => {
        if (!filters.onlyAvailable) return true;
        return n.status === "В наличии";
      })
      .filter((n) => {
        if (!filters.sameDigits) return true;
        const m = n.plate.match(/\d{3}/);
        return Boolean(m && /(\d)\1\1/.test(m[0]));
      })
      .filter((n) => {
        if (!filters.sameLetters) return true;
        const letters = (n.plate.toUpperCase().match(/[A-ZА-ЯЁ]/g) || []).slice(0, 3);
        return (
          letters.length === 3 && letters[0] === letters[1] && letters[1] === letters[2]
        );
      })
      .filter((n) => {
        if (!filters.evenTens010) return true;
        const m = n.plate.match(/\d{3}/);
        if (!m) return false;
        // формат 0x0
        return /^0\d0$/.test(m[0]);
      })
      .filter((n) => {
        if (!filters.evenHundreds) return true;
        const m = n.plate.match(/\d{3}/);
        if (!m) return false;
        // формат x00
        return /^\d00$/.test(m[0]);
      })
      .filter((n) => {
        if (!filters.exclusive) return true;
        const letters = (n.plate.toUpperCase().match(/[A-ZА-ЯЁ]/g) || []).slice(0, 3);
        const m = n.plate.match(/\d{3}/);
        const digits = m ? m[0] : "";
        const lettersTriple =
          letters.length === 3 && letters[0] === letters[1] && letters[1] === letters[2];
        const digitsTriple = digits ? /(\d)\1\1/.test(digits) : false;
        const specialDigits = digits === "001" || digits === "777" || digits === "888" || digits === "999";
        return n.price >= 900000 || lettersTriple || digitsTriple || specialDigits;
      })
      .filter((n) => n.price >= 0);

    const byQuery = !q ? filtered : filtered.filter((n) => n.plate.toLowerCase().includes(q));
    const sorted = [...byQuery].sort((a, b) =>
      filters.sort === "priceAsc" ? a.price - b.price : b.price - a.price
    );
    return sorted;
  }, [numbers, numberQuery, filters]);

  async function runSearch() {
    setIsSearching(true);
    await new Promise((r) => setTimeout(r, 520));
    setIsSearching(false);
  }

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function setImageForNumber(id, url) {
    setNumberImages((prev) => {
      const old = prev[id];
      if (old && old.startsWith("blob:") && old !== url) {
        try {
          URL.revokeObjectURL(old);
        } catch {
          // ignore
        }
      }
      if (!url) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: url };
    });
  }

  return (
    <div className={`pb-16 ${styles.homePageRoot}`}>
      <div className={`pt-4 sm:pt-8 ${styles.homeHeroWrap}`}>
        <Hero
          onEstimateClick={() => setEstimateOpen(true)}
          onSellClick={() => setSellOpen(true)}
        />
      </div>

      <section className={`mx-auto mt-14 max-w-7xl sm:mt-16 ${styles.homeSearchSection}`}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className={styles.searchSectionTitle}>
              Поиск <span className={styles.searchSectionAccent}>номеров</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Ввод номера, фильтры и карточки — без лишнего шума.
            </p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <PlateInput value={numberQuery} onChange={setNumberQuery} onSubmit={runSearch} size="lg" />

          <div className="mt-4 grid gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                ["sameDigits", "Одинаковые цифры"],
                ["sameLetters", "Одинаковые буквы"],
                ["evenTens010", "Первая десятка"],
                ["evenHundreds", "Ровные сотни"],
                ["exclusive", "Эксклюзивные"],
                ["onlyAvailable", "Свободные"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={[
                    "btn-ghost px-4 py-2",
                    filters[key] ? "border-brand-600 text-brand-700" : "",
                  ].join(" ")}
                  onClick={() => setFilters((p) => ({ ...p, [key]: !p[key] }))}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-xs text-slate-600">Сортировка</div>
                <div className="inline-flex max-w-full items-center rounded-2xl border border-slate-200 bg-white">
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
                    className="w-max max-w-full cursor-pointer appearance-none bg-transparent py-3 pl-4 pr-1.5 text-sm text-slate-900 outline-none"
                  >
                    <option value="priceDesc">Сначала дороже</option>
                    <option value="priceAsc">Сначала дешевле</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none mr-3 h-4 w-4 shrink-0 text-slate-500"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-ghost px-5 py-3"
                onClick={() =>
                  setFilters((p) => ({
                    ...p,
                    sameDigits: false,
                    sameLetters: false,
                    evenTens010: false,
                    evenHundreds: false,
                    onlyAvailable: false,
                    exclusive: false,
                    priceMin: null,
                    priceMax: null,
                    sort: "priceDesc",
                  }))
                }
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isSearching
            ? Array.from({ length: 8 }).map((_, i) => <NumberSkeleton key={i} />)
            : results.map((n) => (
                <motion.div
                  key={n.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25 }}
                  className={styles.numberCard}
                >
                  <div className="flex items-center justify-between gap-3">
                    <StatusPill status={n.status} />
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                      onClick={() => toggleFavorite(n.id)}
                      aria-label={favorites.has(n.id) ? "Убрать из избранного" : "Добавить в избранное"}
                    >
                      <Heart
                        className="h-4 w-4"
                        fill={favorites.has(n.id) ? "rgba(193,0,26,.95)" : "transparent"}
                      />
                      {favorites.has(n.id) ? "В избранном" : "В избранное"}
                    </button>
                  </div>

                  <div className="mt-4 font-display text-3xl tracking-tight text-slate-900">
                    {n.plate}
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    {formatPriceRub(n.price)}
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      className="btn-ghost flex-1 px-4 py-2"
                      onClick={() => setDetails(n)}
                    >
                      Детали
                    </button>
                    <button
                      type="button"
                      className="btn-luxe flex-1 px-4 py-2"
                      onClick={() => setDetails(n)}
                    >
                      Купить
                    </button>
                  </div>
                </motion.div>
              ))}
        </div>
      </section>

      {details ? (
        <NumberDetailsModal
          number={details}
          imageUrl={numberImages[details.id] || ""}
          onSetImageUrl={(url) => setImageForNumber(details.id, url)}
          isFavorite={favorites.has(details.id)}
          onToggleFavorite={() => toggleFavorite(details.id)}
          onClose={() => setDetails(null)}
        />
      ) : null}

      {sellOpen ? (
        <SellNumberModal initialPlate={numberQuery} onClose={() => setSellOpen(false)} />
      ) : null}

      {estimateOpen ? (
        <EstimateModal plate={numberQuery} onClose={() => setEstimateOpen(false)} />
      ) : null}
    </div>
  );
}

