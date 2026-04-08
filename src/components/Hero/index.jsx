import { motion } from "framer-motion";
import { Search, Tag, RefreshCcw, MessageCircle, Send } from "lucide-react";

export default function Hero({ onBuyClick, onSellClick, onTransferClick }) {
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
            Занимаемся подбором и продажей красивых автономеров в Москве и Московской области для наших клиентов.
            <span className="text-slate-800"> Полностью сопровождаем сделку на каждом этапе.</span>
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:flex sm:flex-row sm:flex-wrap sm:gap-3">
            <button
              type="button"
              className="btn-luxe w-full px-2 py-3.5 text-[13px] sm:text-sm sm:w-auto sm:px-7"
              onClick={onBuyClick}
            >
              <Search className="h-[1.15em] w-[1.15em] shrink-0" strokeWidth={2} aria-hidden />
              <span className="truncate">Купить номер</span>
            </button>
            <button
              type="button"
              className={[
                "inline-flex w-full items-center justify-center gap-1.5 rounded-full px-2 py-3.5 text-[13px] sm:text-sm font-medium tracking-wide text-white transition duration-300 sm:w-auto sm:px-7 sm:gap-2",
                "bg-[#0c1f33] hover:bg-[#132d4a]",
                "shadow-[0_0_0_1px_rgba(12,31,51,.35)] hover:-translate-y-px",
              ].join(" ")}
              onClick={onSellClick}
            >
              <Tag className="h-[1.15em] w-[1.15em] shrink-0" strokeWidth={2} aria-hidden />
              <span className="truncate">Продать номер</span>
            </button>
          </div>
          <div className="mt-4 flex justify-center sm:justify-start">
             <button
                type="button"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold tracking-wide text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition duration-300"
                onClick={onTransferClick}
              >
                <RefreshCcw className="h-[1.15em] w-[1.15em] shrink-0" strokeWidth={2.5} aria-hidden />
                Переоформление
              </button>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:hidden">
            <a
              href="https://wa.me/79099686474"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366]/10 px-4 py-3 text-sm font-medium text-[#075E54] transition hover:bg-[#25D366]/20"
            >
              <MessageCircle className="h-4 w-4" />
              Написать в WhatsApp
            </a>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0088cc]/10 px-4 py-3 text-sm font-medium text-[#006699] transition hover:bg-[#0088cc]/20"
            >
              <Send className="h-4 w-4" />
              Написать в Telegram
            </a>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            >
              <Send className="h-4 w-4" />
              Написать в Max
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
