import { useMemo } from "react";
import { useApp } from "../../state/appState";

export default function Favorites() {
  const { numbers, favorites, setFavorites } = useApp();

  const favNumbers = useMemo(
    () => numbers.filter((n) => favorites.has(n.id)),
    [numbers, favorites]
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
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {favNumbers.map((n) => (
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
        )}
      </div>
    </div>
  );
}

