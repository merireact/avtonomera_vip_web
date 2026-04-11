import { useMemo, useState, useEffect, useRef } from "react";
import { ChevronDown, FilterX } from "lucide-react";
import styles from "./styles.module.css";
import { useApp } from "../../state/appState";
import PlateInput from "../../components/PlateInput";
import PaginationBar from "../../components/PaginationBar";
import NumberCard from "../../components/NumberCard";
import NumberDetailsModal from "../../components/NumberDetailsModal";
import BuyNumberModal from "../../components/BuyNumberModal";
import { matchPlatePositional } from "../../utils/plateMatch";
import { dedupePlateRows } from "../../utils/dedupePlateRows";

export default function Catalog() {
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

  const [details, setDetails] = useState(null);
  const [buyTarget, setBuyTarget] = useState(null);
  const [filters, setFilters] = useState({
    sameDigits: false,
    sameLetters: false,
    evenTens010: false,
    evenHundreds: false,
    sort: "priceDesc",
  });

  const filteredNumbers = useMemo(() => {
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
  }, [filters, numberQueryParts]);

  useEffect(() => {
    setCurrentPage((p) => {
      const maxPage = Math.max(1, Math.ceil(filteredNumbers.length / ITEMS_PER_PAGE));
      return p > maxPage ? maxPage : p;
    });
  }, [filteredNumbers.length]);

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

  const totalPages = Math.max(1, Math.ceil(filteredNumbers.length / ITEMS_PER_PAGE));
  const displayedNumbers = filteredNumbers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-7xl pb-16">
      <div className="pt-4 sm:pt-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="section-title">Каталог номеров</h1>
            <p className="mt-2 muted max-w-2xl">
              Быстрый поиск по номеру и понятные карточки. Актуальный каталог в базе данных.
            </p>
          </div>
        </div>

        <div className="mt-5 sm:mt-7">
          <PlateInput
            value={numberQuery}
            onChange={setNumberQuery}
            onPartsChange={setNumberQueryParts}
            onSubmit={() => {}}
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

            <div className="flex flex-wrap items-center justify-between gap-2 gap-y-2 sm:gap-3">
              <div className={styles.count}>{filteredNumbers.length}</div>
              <button
                type="button"
                className={[
                  "group inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
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
                    sort: "priceDesc",
                  }))
                }
              >
                <FilterX
                  className="h-3.5 w-3.5 shrink-0 text-brand-600/90 transition group-hover:text-brand-700 sm:h-4 sm:w-4"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="sm:hidden">Сбросить</span>
                <span className="hidden sm:inline">Сбросить фильтры</span>
              </button>
            </div>
          </div>

          <PaginationBar
            className="mt-4"
            currentPage={currentPage}
            totalPages={totalPages}
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
              Догружаем каталог в фоне… показано {numbers.length} номеров. Фильтры и счётчик обновятся, когда
              загрузка завершится.
            </p>
          ) : null}

          <div
            id="catalog-results-start"
            className="scroll-mt-[5.5rem] sm:scroll-mt-24"
            aria-hidden
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {numbersLoading && numbers.length === 0 ? (
              <div className="col-span-full text-sm text-slate-600">Загрузка каталога…</div>
            ) : (
              displayedNumbers.map((n, idx) => (
                <NumberCard
                  key={`p${currentPage}-i${idx}-${n.id}`}
                  number={n}
                  onDetails={() => setDetails(n)}
                  onBuy={() => setBuyTarget(n)}
                />
              ))
            )}
          </div>

          <PaginationBar
            className="mt-8"
            currentPage={currentPage}
            totalPages={totalPages}
            onGoPrev={() => setCurrentPage((p) => p - 1)}
            onGoNext={() => setCurrentPage((p) => p + 1)}
          />
        </div>
      </div>

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
    </div>
  );
}

