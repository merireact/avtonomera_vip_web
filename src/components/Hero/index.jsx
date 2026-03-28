import { motion } from "framer-motion";
import { Calculator, Tag } from "lucide-react";

export default function Hero({ onEstimateClick, onSellClick }) {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="relative rounded-2xl border border-slate-200/90 bg-white p-8 shadow-[0_1px_0_rgba(15,23,42,.04),0_18px_48px_rgba(15,23,42,.06)] sm:p-10 md:p-12 lg:p-14">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-brand-600"
          aria-hidden
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative pl-5 sm:pl-6 md:pl-8"
        >
          <h1 className="font-display text-[2rem] font-normal leading-[1.1] tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="block">Продажа</span>
            <span className="mt-1 block text-brand-800 sm:mt-1.5">
              красивых автономеров
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mt-7 sm:text-base md:text-lg">
            Москва и область: подбор номера, прозрачные цены и актуальный каталог.
            <span className="text-slate-800"> Сделаем коротко и понятно.</span>
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-3">
            <button
              type="button"
              className="btn-luxe w-full px-6 py-3.5 text-sm sm:w-auto sm:px-7"
              onClick={onEstimateClick}
            >
              <Calculator className="h-[1.15em] w-[1.15em] shrink-0" strokeWidth={2} aria-hidden />
              Оценить номер
            </button>
            <button
              type="button"
              className={[
                "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium tracking-wide text-white transition duration-300 sm:w-auto sm:px-7",
                "bg-[#0c1f33] hover:bg-[#132d4a]",
                "shadow-[0_0_0_1px_rgba(12,31,51,.35)] hover:-translate-y-px",
              ].join(" ")}
              onClick={onSellClick}
            >
              <Tag className="h-[1.15em] w-[1.15em] shrink-0" strokeWidth={2} aria-hidden />
              Продать номер
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
