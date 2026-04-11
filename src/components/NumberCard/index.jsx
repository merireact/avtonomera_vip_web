import { motion } from "framer-motion";

function formatPriceRub(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function NumberCard({ number, onDetails, onBuy }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="glass p-5"
    >
      <div className="flex items-center justify-between gap-3">
        {number.status !== "В наличии" ? (
          <div className="text-xs text-slate-600">{number.status}</div>
        ) : null}
        <div
          className={[
            "text-xs text-slate-500",
            number.status === "В наличии" ? "ml-auto" : "",
          ].join(" ")}
        >
          VIP
        </div>
      </div>

      <div className="mt-3 font-mono text-[1.75rem] sm:text-3xl font-bold tracking-[0.05em] text-slate-900">
        {number.plate}
      </div>
      <div className="mt-2 text-sm text-slate-700">{formatPriceRub(number.price)}</div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          className="btn-ghost flex-1 px-4 py-2"
          onClick={() => onDetails?.(number)}
        >
          Детали
        </button>
        <button
          type="button"
          className="btn-luxe flex-1 px-4 py-2"
          onClick={() => onBuy?.(number)}
        >
          Купить
        </button>
      </div>
    </motion.div>
  );
}

