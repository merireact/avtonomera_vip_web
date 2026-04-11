import { useMemo, useState } from "react";
import { Phone } from "lucide-react";
import Modal from "../Modal";
import { IconTelegram, IconWhatsApp } from "../MessengerIcons";
import maxMessengerIcon from "../../assets/max-messenger.png";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const PHONE_TEL = "+79099686474";
const PHONE_DISPLAY = "+7 (909) 968‑64‑74";

function formatPriceRub(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizePhone(raw) {
  const digits = (raw || "").replace(/\D+/g, "");
  if (!digits) return "";
  if (digits.startsWith("8")) return `7${digits.slice(1)}`;
  if (digits.startsWith("7")) return digits;
  return `7${digits}`;
}

function plateIdForDb(id) {
  if (id == null || id === "") return null;
  const s = String(id);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
    ? s
    : null;
}

export default function BuyNumberModal({ number, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [methods, setMethods] = useState({
    whatsapp: true,
    telegram: false,
    max: false,
  });
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");

  const canSend = useMemo(() => {
    const p = normalizePhone(phone);
    const anyChannel = methods.whatsapp || methods.telegram || methods.max;
    return Boolean(number?.plate) && p.length >= 11 && anyChannel;
  }, [number, phone, methods]);

  function toggle(k) {
    setMethods((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  async function submit() {
    if (!canSend || !number) return;
    setApiError("");
    const payload = {
      plate: number.plate.trim(),
      plate_id: plateIdForDb(number.id),
      name: name.trim() || null,
      phone: normalizePhone(phone),
      note: note.trim() || null,
      contact_methods: {
        whatsapp: methods.whatsapp,
        telegram: methods.telegram,
        max: methods.max,
      },
    };
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("buy_requests").insert(payload);
      if (error) {
        setApiError(error.message);
        return;
      }
    } else {
      // eslint-disable-next-line no-console
      console.log("buy-request (настройте Supabase и таблицу buy_requests)", payload);
    }
    setSent(true);
  }

  if (!number) return null;

  return (
    <Modal
      title="Купить номер"
      onClose={onClose}
      footer={
        sent ? null : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-600">
              Заявка уйдёт менеджеру с выбранными способами связи.
            </div>
            <button
              type="button"
              className={["btn-luxe px-6 py-3", canSend ? "" : "opacity-60"].join(" ")}
              onClick={submit}
              disabled={!canSend}
            >
              Отправить заявку
            </button>
          </div>
        )
      }
    >
      {sent ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-center text-sm text-emerald-900">
          Заявка отправлена. Мы свяжемся с вами по этому номеру.
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="text-xs text-slate-600">Вы выбрали</div>
            <div className="mt-1 font-mono text-2xl font-bold tracking-[0.05em] text-slate-900 sm:text-3xl">
              {number.plate}
            </div>
            {typeof number.price === "number" ? (
              <div className="mt-2 text-sm font-medium text-slate-800">
                {formatPriceRub(number.price)}
              </div>
            ) : null}
          </div>

          <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50/80 px-4 py-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                <Phone className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <div>
                <div className="text-sm font-medium text-slate-900">Позвонить и купить</div>
                <p className="mt-1 text-xs text-slate-600">
                  Свяжитесь с нами напрямую, чтобы уточнить наличие и условия.
                </p>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="mt-2 inline-flex text-base font-semibold tabular-nums text-brand-800 underline-offset-2 hover:underline"
                >
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>

          <div className="relative my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              или заявка онлайн
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-sm text-slate-600">
            Оставьте телефон и выберите мессенджеры — менеджер ответит по этому госномеру.
          </p>

          {apiError ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              {apiError}
            </div>
          ) : null}

          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs text-slate-600">Имя</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-300"
                placeholder="Как к вам обращаться"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs text-slate-600">
                Телефон <span className="text-rose-600">*</span>
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-300"
                placeholder="+7 (___) ___‑__‑__"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs text-slate-600">Комментарий</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-300"
                placeholder="Удобное время звонка, вопросы по сделке…"
              />
            </label>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
              <div className="text-xs font-medium text-slate-700">
                Где с вами связаться <span className="text-rose-600">*</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Отметьте один или несколько мессенджеров.
              </p>
              <div className="mt-3 flex flex-col gap-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    checked={methods.whatsapp}
                    onChange={() => toggle("whatsapp")}
                  />
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
                    <IconWhatsApp className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-sm text-slate-800">WhatsApp</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    checked={methods.telegram}
                    onChange={() => toggle("telegram")}
                  />
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-sm">
                    <IconTelegram className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-sm text-slate-800">Telegram</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    checked={methods.max}
                    onChange={() => toggle("max")}
                  />
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ring-1 ring-black/10">
                    <img
                      src={maxMessengerIcon}
                      alt=""
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </span>
                  <span className="text-sm text-slate-800">Max</span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
