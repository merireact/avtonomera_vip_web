import { motion } from "framer-motion";
import { Phone, Search, Tag, RefreshCcw } from "lucide-react";
import maxMessengerIcon from "../../assets/max-messenger.png";
import { IconTelegram, IconWhatsApp } from "../MessengerIcons";

const PHONE_DISPLAY = "+7 (909) 968‑64‑74";
const PHONE_TEL = "+79099686474";

const mobileActionBlock =
  "flex min-h-[5.25rem] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/90 bg-white px-3 py-4 text-center shadow-[0_1px_0_rgba(15,23,42,.04)] transition active:scale-[0.99] sm:min-h-0";

export default function Hero({ onBuyClick, onSellClick, onTransferClick }) {
  return (
    <section className="mx-auto max-w-7xl">
      {/* Мобильный: мессенджеры и телефон — отдельно над карточкой Hero */}
      <div className="mb-4 flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,.04),0_12px_36px_rgba(15,23,42,.06)] lg:hidden">
        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href="https://wa.me/79099686474"
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:brightness-105"
            aria-label="WhatsApp"
          >
            <IconWhatsApp className="h-[18px] w-[18px]" />
          </a>
          <a
            href="https://t.me/avtonomera_vip"
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#229ED9] text-white transition hover:brightness-105"
            aria-label="Telegram"
          >
            <IconTelegram className="h-[18px] w-[18px]" />
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-black/10 transition hover:opacity-90"
            aria-label="Max"
          >
            <img
              src={maxMessengerIcon}
              alt=""
              width={36}
              height={36}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </a>
        </div>
        <a
          href={`tel:${PHONE_TEL}`}
          className="flex min-w-0 flex-1 items-center justify-end gap-2 text-slate-900"
        >
          <Phone className="h-4 w-4 shrink-0 text-brand-600" strokeWidth={2} aria-hidden />
          <span className="min-w-0 text-right text-sm font-medium tabular-nums leading-none tracking-tight">
            {PHONE_DISPLAY}
          </span>
        </a>
      </div>

      <div className="relative min-w-0 overflow-x-clip rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,.04),0_18px_48px_rgba(15,23,42,.06)] sm:p-10 md:p-12 lg:p-14">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-brand-600"
          aria-hidden
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-w-0 pl-3 sm:pl-6 md:pl-8"
        >
          <h1 className="font-display text-[1.75rem] font-normal leading-[1.1] tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="block">Красивые номера от</span>
            <span className="mt-1 block text-brand-800 sm:mt-1.5 text-[1.45rem] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Avtonomera Vip
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mt-7 sm:text-base md:text-lg">
            Занимаемся подбором и продажей красивых автономеров в Москве и Московской области для наших клиентов.
            <span className="text-slate-800"> Полностью сопровождаем сделку на каждом этапе.</span>
          </p>

          {/* Мобильный: блоки — купить | продать в один ряд, переоформление снизу */}
          <div className="mt-6 space-y-3 lg:hidden">
            <div className="grid grid-cols-2 gap-4">
              <button type="button" className={mobileActionBlock} onClick={onBuyClick}>
                <Search className="h-6 w-6 shrink-0 text-brand-700" strokeWidth={2} aria-hidden />
                <span className="text-sm font-semibold leading-tight text-slate-900">Купить номер</span>
              </button>
              <button type="button" className={mobileActionBlock} onClick={onSellClick}>
                <Tag className="h-6 w-6 shrink-0 text-[#0c1f33]" strokeWidth={2} aria-hidden />
                <span className="text-sm font-semibold leading-tight text-slate-900">Продать номер</span>
              </button>
            </div>
            <button
              type="button"
              className={[
                mobileActionBlock,
                "w-full min-h-[3.75rem] flex-row gap-3 py-4 sm:min-h-[4rem]",
                "border-brand-200 bg-brand-50/90 text-brand-800",
              ].join(" ")}
              onClick={onTransferClick}
            >
              <RefreshCcw className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
              <span className="text-sm font-bold tracking-wide">Переоформление</span>
            </button>
          </div>

          {/* Десктоп: прежние кнопки */}
          <div className="mt-4 hidden space-y-3 sm:mt-10 lg:block">
            <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-nowrap lg:items-center lg:justify-start lg:gap-4">
              <button
                type="button"
                className="btn-luxe min-w-0 gap-2 px-1.5 py-2.5 text-sm leading-tight sm:gap-3 sm:px-7 sm:py-3.5 sm:text-base lg:w-auto lg:max-w-none"
                onClick={onBuyClick}
              >
                <Search className="h-[1.15em] w-[1.15em] shrink-0 sm:h-[1.2em] sm:w-[1.2em]" strokeWidth={2} aria-hidden />
                <span className="text-center">Купить номер</span>
              </button>
              <button
                type="button"
                className={[
                  "inline-flex min-w-0 items-center justify-center gap-2 rounded-full px-1.5 py-2.5 text-sm leading-tight font-medium tracking-wide text-white transition duration-300 sm:gap-3 sm:px-7 sm:py-3.5 sm:text-base lg:w-auto",
                  "bg-[#0c1f33] hover:bg-[#132d4a]",
                  "shadow-[0_0_0_1px_rgba(12,31,51,.35)] hover:-translate-y-px",
                ].join(" ")}
                onClick={onSellClick}
              >
                <Tag className="h-[1.15em] w-[1.15em] shrink-0 sm:h-[1.2em] sm:w-[1.2em]" strokeWidth={2} aria-hidden />
                <span className="text-center">Продать номер</span>
              </button>
            </div>
            <div className="flex justify-center sm:justify-start lg:pt-0">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold tracking-wide text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition duration-300 sm:w-auto"
                onClick={onTransferClick}
              >
                <RefreshCcw className="h-[1.15em] w-[1.15em] shrink-0" strokeWidth={2.5} aria-hidden />
                Переоформление
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
