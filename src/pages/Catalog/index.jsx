import { useMemo, useState } from "react";
import styles from "./styles.module.css";
import { useApp } from "../../state/appState";
import PlateInput from "../../components/PlateInput";
import NumberCard from "../../components/NumberCard";
import NumberDetailsModal from "../../components/NumberDetailsModal";

export default function Catalog() {
  const {
    numbers,
    numberQuery,
    setNumberQuery,
    numberImages,
    setNumberImages,
    favorites,
    setFavorites,
  } = useApp();

  const [details, setDetails] = useState(null);
  const [filters, setFilters] = useState({
    sameDigits: false,
    sameLetters: false,
    evenTens010: false,
    evenHundreds: false,
    onlyAvailable: false,
    exclusive: false,
    sort: "priceDesc",
  });

  const filteredNumbers = useMemo(() => {
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
        return /^0\d0$/.test(m[0]);
      })
      .filter((n) => {
        if (!filters.evenHundreds) return true;
        const m = n.plate.match(/\d{3}/);
        if (!m) return false;
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
        const specialDigits =
          digits === "001" || digits === "777" || digits === "888" || digits === "999";
        return n.price >= 900000 || lettersTriple || digitsTriple || specialDigits;
      })
      .filter((n) => n.price >= 0);

    const byQuery = !q ? filtered : filtered.filter((n) => n.plate.toLowerCase().includes(q));
    const sorted = [...byQuery].sort((a, b) =>
      filters.sort === "priceAsc" ? a.price - b.price : b.price - a.price
    );
    return sorted;
  }, [numbers, numberQuery, filters]);

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
    <div className="mx-auto max-w-7xl pb-16">
      <div className="pt-6 sm:pt-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="section-title">Каталог номеров</h1>
            <p className="mt-2 muted max-w-2xl">
              Быстрый поиск по номеру и понятные карточки. Данные сейчас из mock.
            </p>
          </div>
        </div>

        <div className="mt-7">
          <PlateInput value={numberQuery} onChange={setNumberQuery} onSubmit={() => {}} />
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
              <div className="flex items-center gap-2">
                <div className="text-xs text-slate-600">Сортировка</div>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  <option value="priceDesc">Сначала дороже</option>
                  <option value="priceAsc">Сначала дешевле</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className={styles.count}>{filteredNumbers.length}</div>
              <button
                type="button"
                className="btn-ghost px-4 py-2"
                onClick={() =>
                  setFilters((p) => ({
                    ...p,
                    sameDigits: false,
                    sameLetters: false,
                    evenTens010: false,
                    evenHundreds: false,
                    onlyAvailable: false,
                    exclusive: false,
                    sort: "priceDesc",
                  }))
                }
              >
                Сбросить
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredNumbers.map((n) => (
              <NumberCard
                key={n.id}
                number={n}
                onDetails={() => setDetails(n)}
                onBuy={() => setDetails(n)}
              />
            ))}
          </div>
        </div>
      </div>

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
    </div>
  );
}

