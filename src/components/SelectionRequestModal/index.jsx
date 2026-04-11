import { useMemo, useState } from "react";
import Modal from "../Modal";
import { IconTelegram, IconWhatsApp } from "../MessengerIcons";
import maxMessengerIcon from "../../assets/max-messenger.png";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

function normalizePhone(raw) {
  const digits = (raw || "").replace(/\D+/g, "");
  if (!digits) return "";
  if (digits.startsWith("8")) return `7${digits.slice(1)}`;
  if (digits.startsWith("7")) return digits;
  return `7${digits}`;
}

export default function SelectionRequestModal({ onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wish, setWish] = useState("");
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
    return Boolean(wish.trim()) && p.length >= 11 && anyChannel;
  }, [wish, phone, methods]);

  function toggle(k) {
    setMethods((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  async function submit() {
    if (!canSend) return;
    setApiError("");
    const payload = {
      name: name.trim() || null,
      phone: normalizePhone(phone),
      wish: wish.trim(),
      contact_methods: {
        whatsapp: methods.whatsapp,
        telegram: methods.telegram,
        max: methods.max,
      },
    };
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("selection_requests").insert(payload);
      if (error) {
        setApiError(error.message);
        return;
      }
    } else {
      // eslint-disable-next-line no-console
      console.log("selection-request (настройте Supabase и таблицу selection_requests)", payload);
    }
    setSent(true);
  }

  return (
    <Modal
      title="Запросить подбор номера"
      onClose={onClose}
      footer={
        sent ? null : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-600">
              Менеджер свяжется с вами в выбранных мессенджерах или по телефону.
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
          Заявка отправлена. Спасибо! Мы скоро свяжемся с вами.
        </div>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-slate-600">
            Опишите, какой номер вы ищете: важные цифры, буквы, регион или формат — мы подберём варианты и напишем в удобных вам мессенджерах.
          </p>

          {apiError ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              {apiError}
            </div>
          ) : null}

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-medium text-slate-700">
                Какой номер ищете <span className="text-rose-600">*</span>
              </span>
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                rows={4}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-300"
                placeholder="Например: три семёрки в середине, регион 77 или 97, буквы как на своём авто…"
              />
            </label>

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

            <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
              <div className="text-xs font-medium text-slate-700">
                Где с вами связаться <span className="text-rose-600">*</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Отметьте один или несколько мессенджеров — напишем там, где вам удобно.
              </p>
              <div className="mt-3 flex flex-col gap-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:bg-white">
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
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:bg-white">
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
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:bg-white">
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
