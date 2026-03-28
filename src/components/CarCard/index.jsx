import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import styles from "./styles.module.css";

function formatPriceRub(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CarCard({ car, isFavorite, onToggleFavorite }) {
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={styles.card}
    >
      <div className={styles.media}>
        <img src={car.image} alt={`${car.brand} ${car.model}`} />
        <div className={styles.mediaOverlay} />
        <button
          type="button"
          className={styles.favBtn}
          onClick={() => onToggleFavorite(car.id)}
          aria-label={isFavorite ? "Убрать из избранного" : "В избранное"}
        >
          <Heart
            className={styles.heart}
            fill={isFavorite ? "rgba(201,161,74,.95)" : "transparent"}
          />
        </button>
        <div className={styles.badge}>
          <Sparkles className="h-3.5 w-3.5" />
          Verified
        </div>
      </div>

      <div className="p-5">
        <div className="text-xs text-white/65">
          {car.year} • {car.mileage.toLocaleString("ru-RU")} км
        </div>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <div className="text-white/80 text-sm">{car.brand}</div>
            <div className="font-display italic text-xl leading-tight">
              {car.model}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-white/55">
              Цена
            </div>
            <div className="mt-1 text-sm font-medium text-white">
              {formatPriceRub(car.price)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="btn-ghost flex-1">Подробнее</button>
          <button className="btn-luxe flex-1">Забронировать</button>
        </div>
      </div>
    </motion.article>
  );
}

