import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../../state/appState";

const ITEMS_PER_PAGE = 12;

export default function Favorites() {
  const { numbers, favorites, setFavorites } = useApp();
  const [currentPage, setCurrentPage] = useState(1);

  const favNumbers = useMemo(
    () => numbers.filter((n) => favorites.has(n.id)),
    [numbers, favorites]
  );

  useEffect(() => {
    const max = Math.max(1, Math.ceil(favNumbers.length / ITEMS_PER_PAGE));
    setCurrentPage((p) => (p > max ? max : p));
  }, [favNumbers]);

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
          <div className="mt-8 glass p-10 text-center text-slate-600">
            Пока пусто. Добавьте номер в избранное в каталоге.
          </div>
        ) : (
          <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayedFavorites.map((n) => (
              <div key={n.id} className="glass p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-600">{n.status}</div>
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
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                className="btn-ghost flex h-10 w-10 p-0 shrink-0 items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-sm font-medium text-slate-700">
                Страница {currentPage} из {totalPages}
              </div>
              <button
                type="button"
                className="btn-ghost flex h-10 w-10 p-0 shrink-0 items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
}

