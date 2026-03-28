import { motion } from "framer-motion";
import styles from "./styles.module.css";

export default function Hero({
  plateValue,
  onPlateChange,
  onFind,
  onEstimateClick,
  onSellClick,
}) {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="grid items-center gap-10 lg:grid-cols-1">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-700">
            <span className={styles.pulseDot} />
            VIP сервис по подбору и продаже автономеров
          </div>

          <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Продажа красивых автономеров
          </h1>
          <p className="mt-4 max-w-xl text-slate-600">
            Москва и область. Быстрый поиск по номеру, актуальные статусы и цены —
            без лишнего визуального шума.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              className="btn-luxe w-full px-6 py-3.5 sm:w-auto"
              onClick={onEstimateClick}
            >
              Оценить номер
            </button>
            <button
              type="button"
              className={[
                "inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-medium tracking-wide text-white shadow-[0_0_0_1px_rgba(180,130,40,.35),0_14px_36px_rgba(180,120,30,.22)] transition duration-300 sm:w-auto",
                "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(180,130,40,.45),0_0_28px_rgba(201,161,74,.25),0_18px_44px_rgba(180,120,30,.28)]",
              ].join(" ")}
              onClick={onSellClick}
            >
              Продать номер
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

