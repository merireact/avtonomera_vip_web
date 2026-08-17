import { useMemo, useState, useEffect, useRef } from "react";
import { useApp } from "../../state/appState";
import PaginationBar from "../../components/PaginationBar";
import { dedupePlateRows } from "../../utils/dedupePlateRows";

const ITEMS_PER_PAGE = 12;

export default function Favorites() {
  const { numbers, favorites, setFavorites } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const prevPageForScrollRef = useRef(null);

  const favNumbers = useMemo(
    () => dedupePlateRows(numbers.filter((n) => favorites.has(n.id))),
    [numbers, favorites]
  );

  useEffect(() => {
    const max = Math.max(1, Math.ceil(favNumbers.length / ITEMS_PER_PAGE));
    setCurrentPage((p) => (p > max ? max : p));
  }, [favNumbers.length]);

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

  const totalPages = Math.max(1, Math.ceil(favNumbers.length / ITEMS_PER_PAGE));
  const displayedFavorites = favNumbers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function toggleFavorite(numberId) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(numberId)) next.delete(numberId);
      else next.add(numberId);
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-7xl pb-16">
      <div className="pt-6 sm:pt-10">
        <h1 className="section-title">Избранное</h1>
        <p className="mt-2 muted max-w-2xl">
          Сохраняйте понравившиеся автономера и возвращайтесь к ним позже.
        </p>

        {favNumbers.length === 0 ? (
          <div className="mt-8 glass p-6 text-center text-slate-600 sm:p-10">
            Пока пусто. Добавьте номер в избранное в каталоге.
          </div>
        ) : (
          <>
          <div
            id="catalog-results-start"
            className="scroll-mt-[calc(5.5rem+env(safe-area-inset-top))] sm:scroll-mt-24"
            aria-hidden
          />
          <PaginationBar
            className="mt-4"
            currentPage={currentPage}
            totalPages={totalPages}
            onGoPrev={() => setCurrentPage((p) => p - 1)}
            onGoNext={() => setCurrentPage((p) => p + 1)}
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayedFavorites.map((n, idx) => (
              <div key={`p${currentPage}-i${idx}-${n.id}`} className="glass p-5">
                <div
                  className={[
                    "flex items-center gap-3",
                    n.status === "В наличии" ? "justify-end" : "justify-between",
                  ].join(" ")}
                >
                  {n.status !== "В наличии" ? (
                    <div className="text-xs text-slate-600">{n.status}</div>
                  ) : null}
                  <button
                    type="button"
                    className="btn-ghost px-4 py-2"
                    onClick={() => toggleFavorite(n.id)}
                  >
                    Убрать
                  </button>
                </div>
                <div className="mt-3 font-display text-3xl tracking-tight">
                  {n.plate}
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  {new Intl.NumberFormat("ru-RU", {
                    style: "currency",
                    currency: "RUB",
                    maximumFractionDigits: 0,
                  }).format(n.price)}
                </div>
              </div>
            ))}
          </div>
          <PaginationBar
            className="mt-8"
            currentPage={currentPage}
            totalPages={totalPages}
            onGoPrev={() => setCurrentPage((p) => p - 1)}
            onGoNext={() => setCurrentPage((p) => p + 1)}
          />
          </>
        )}
      </div>
    </div>
  );
}

