import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import styles from "./styles.module.css";

export default function Filters({
  brands,
  value,
  onChange,
  onReset,
  compact = false,
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={styles.wrap}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-white/85">
          <SlidersHorizontal className="h-4 w-4 text-gold" />
          <div className="text-sm">Фильтры</div>
        </div>
        <button type="button" className="text-xs text-white/60 hover:text-white" onClick={onReset}>
          Сброс
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        <label className="grid gap-2">
          <span className="text-xs text-white/65">Марка</span>
          <select
            value={value.brand}
            onChange={(e) => onChange({ ...value, brand: e.target.value })}
            className={styles.input}
          >
            <option value="all">Все</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-xs text-white/65">Год (от)</span>
          <input
            type="number"
            value={value.yearFrom}
            min={2000}
            max={2030}
            onChange={(e) => onChange({ ...value, yearFrom: Number(e.target.value) })}
            className={styles.input}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs text-white/65">Год (до)</span>
          <input
            type="number"
            value={value.yearTo}
            min={2000}
            max={2030}
            onChange={(e) => onChange({ ...value, yearTo: Number(e.target.value) })}
            className={styles.input}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs text-white/65">Цена (до), ₽</span>
          <input
            type="number"
            value={value.priceTo}
            min={1000000}
            step={100000}
            onChange={(e) => onChange({ ...value, priceTo: Number(e.target.value) })}
            className={styles.input}
          />
        </label>
      </div>

      {!compact && (
        <div className="mt-5 rounded-luxe border border-white/10 bg-white/5 p-4 text-xs text-white/65">
          Подбор под стиль жизни. Минимум лишнего — максимум премиального ощущения.
        </div>
      )}
    </motion.aside>
  );
}

