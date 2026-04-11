import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/Hero";
import styles from "./styles.module.css";
import { useApp } from "../../state/appState";
import PlateInput from "../../components/PlateInput";
import NumberDetailsModal from "../../components/NumberDetailsModal";
import BuyNumberModal from "../../components/BuyNumberModal";
import SellNumberModal from "../../components/SellNumberModal";
import EstimateModal from "../../components/EstimateModal";
import { ChevronDown, FilterX, Heart } from "lucide-react";
import PaginationBar from "../../components/PaginationBar";
import { matchPlatePositional } from "../../utils/plateMatch";
import { dedupePlateRows } from "../../utils/dedupePlateRows";

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
  const navigate = useNavigate();
  const {
    numbers,
    numbersLoading,
    numbersLoadingMore,
    numbersError,
    numberQuery,
    setNumberQuery,
    numberQueryParts,
    setNumberQueryParts,
    favorites,
    setFavorites,
  } = useApp();
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    sameDigits: false,
    sameLetters: false,
    evenTens010: false,
    evenHundreds: false,
    priceMin: null,
    priceMax: null,
    sort: "priceDesc",
  });
  const [details, setDetails] = useState(null);
  const [buyTarget, setBuyTarget] = useState(null);
  const [sellOpen, setSellOpen] = useState(false);
  const [estimateOpen, setEstimateOpen] = useState(false);

  const results = useMemo(() => {
    const filtered = numbers
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
        const v = parseInt(m[0], 10);
        return v >= 1 && v <= 10;
      })
      .filter((n) => {
        if (!filters.evenHundreds) return true;
        const m = n.plate.match(/\d{3}/);
        if (!m) return false;
        // формат x00
        return /^\d00$/.test(m[0]);
      })
      .filter((n) => n.price >= 0);

    const hasQueryParts = Object.values(numberQueryParts || {}).some(v => v);
    const byQuery = !hasQueryParts ? filtered : filtered.filter((n) => matchPlatePositional(n.plate, numberQueryParts));
    const sorted = [...byQuery].sort((a, b) =>
      filters.sort === "priceAsc" ? a.price - b.price : b.price - a.price
    );
    return dedupePlateRows(sorted);
  }, [numbers, numberQueryParts, filters]);

  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const prevPageForScrollRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [isSearching, filters, numberQueryParts]);

  useEffect(() => {
    setCurrentPage((p) => {
      const maxPage = Math.max(1, Math.ceil(results.length / ITEMS_PER_PAGE));
      return p > maxPage ? maxPage : p;
    });
  }, [results.length]);

  useEffect(() => {
    const prev = prevPageForScrollRef.current;
    if (prev === null) {
      prevPageForScrollRef.current = currentPage;
      return;
    }
    if (prev === currentPage) {
      return;
    }
    prevPageForScrollRef.current = currentPage;
    const id = window.requestAnimationFrame(() => {
      document
        .getElementById("catalog-results-start")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [currentPage]);

  const totalPages = Math.max(1, Math.ceil(results.length / ITEMS_PER_PAGE));
  const displayedNumbers = results.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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

  return (
    <div className={`pb-16 ${styles.homePageRoot}`}>
      <div className={`pt-2 sm:pt-8 ${styles.homeHeroWrap}`}>
        <Hero
          onBuyClick={() => {
            document
              .getElementById("catalog-results-start")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          onSellClick={() => setSellOpen(true)}
          onTransferClick={() => navigate("/transfer")}
        />
      </div>

      <section id="catalog-section" className={`mx-auto mt-5 max-w-7xl sm:mt-16 ${styles.homeSearchSection}`}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className={styles.searchSectionTitle}>
              Поиск <span className={styles.searchSectionAccent}>номеров</span>
            </h2>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 sm:mt-6">
          <PlateInput
            value={numberQuery}
            onChange={setNumberQuery}
            onPartsChange={setNumberQueryParts}
            onSubmit={runSearch}
            size="lg"
          />

          <div className="mt-4 grid gap-3">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[
                ["sameDigits", "Одинаковые цифры"],
                ["sameLetters", "Одинаковые буквы"],
                ["evenTens010", "Первая десятка"],
                ["evenHundreds", "Ровные сотни"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={[
                    "btn-ghost px-2.5 py-1.5 text-[11px] leading-tight sm:px-4 sm:py-2 sm:text-sm sm:leading-normal",
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
                className={[
                  "group inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm",
                  "border-slate-200/90 bg-white text-slate-800 shadow-[0_1px_0_rgba(15,23,42,.04)]",
                  "hover:border-brand-300 hover:bg-brand-50/80 hover:text-brand-900",
                  "active:scale-[0.99]",
                ].join(" ")}
                onClick={() =>
                  setFilters((p) => ({
                    ...p,
                    sameDigits: false,
                    sameLetters: false,
                    evenTens010: false,
                    evenHundreds: false,
                    priceMin: null,
                    priceMax: null,
                    sort: "priceDesc",
                  }))
                }
              >
                <FilterX
                  className="h-3.5 w-3.5 shrink-0 text-brand-600/90 transition group-hover:text-brand-700 sm:h-4 sm:w-4"
                  strokeWidth={2}
                  aria-hidden
                />
                Сбросить фильтры
              </button>
            </div>
          </div>
        </motion.div>

        <PaginationBar
          className="mt-4"
          currentPage={currentPage}
          totalPages={totalPages}
          hidden={isSearching}
          onGoPrev={() => setCurrentPage((p) => p - 1)}
          onGoNext={() => setCurrentPage((p) => p + 1)}
        />

        {numbersError ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            Не удалось загрузить номера: {numbersError}
          </div>
        ) : null}

        {numbersLoadingMore ? (
          <p className="mt-3 text-xs text-slate-500">
            Догружаем каталог… уже {numbers.length} номеров.
          </p>
        ) : null}

        <div
          id="catalog-results-start"
          className="scroll-mt-[5.5rem] sm:scroll-mt-24"
          aria-hidden
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isSearching || (numbersLoading && numbers.length === 0)
            ? Array.from({ length: 8 }).map((_, i) => <NumberSkeleton key={i} />)
            : displayedNumbers.map((n, idx) => (
                <motion.div
                  key={`p${currentPage}-i${idx}-${n.id}`}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25 }}
                  className={styles.numberCard}
                >
                  <div
                    className={[
                      "flex items-center gap-3",
                      n.status === "В наличии" ? "justify-end" : "justify-between",
                    ].join(" ")}
                  >
                    {n.status !== "В наличии" ? <StatusPill status={n.status} /> : null}
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

                  <div className="mt-4 font-mono text-[1.75rem] sm:text-3xl font-bold tracking-[0.05em] text-slate-900">
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
                      onClick={() => setBuyTarget(n)}
                    >
                      Купить
                    </button>
                  </div>
                </motion.div>
              ))}
        </div>

        <PaginationBar
          className="mt-8"
          currentPage={currentPage}
          totalPages={totalPages}
          hidden={isSearching}
          onGoPrev={() => setCurrentPage((p) => p - 1)}
          onGoNext={() => setCurrentPage((p) => p + 1)}
        />
      </section>

      {details ? (
        <NumberDetailsModal
          number={details}
          imageUrl={details.imageUrl || ""}
          photoReadOnly
          isFavorite={favorites.has(details.id)}
          onToggleFavorite={() => toggleFavorite(details.id)}
          onClose={() => setDetails(null)}
        />
      ) : null}

      {buyTarget ? (
        <BuyNumberModal number={buyTarget} onClose={() => setBuyTarget(null)} />
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

