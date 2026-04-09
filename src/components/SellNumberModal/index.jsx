import { useMemo, useState } from "react";
import Modal from "../Modal";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

function normalizePhone(raw) {
  const digits = (raw || "").replace(/\D+/g, "");
  if (!digits) return "";
  if (digits.startsWith("8")) return `7${digits.slice(1)}`;
  if (digits.startsWith("7")) return digits;
  return `7${digits}`;
}

export default function SellNumberModal({ initialPlate = "", onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState(initialPlate);
  const [methods, setMethods] = useState({
    call: true,
    whatsapp: true,
    telegram: false,
  });
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");

  const canSend = useMemo(() => {
    const p = normalizePhone(phone);
    const anyMethod = Object.values(methods).some(Boolean);
    return Boolean(name.trim()) && p.length >= 11 && anyMethod;
  }, [name, phone, methods]);

  function toggle(k) {
    setMethods((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  async function submit() {
    if (!canSend) return;
    setApiError("");
    const payload = {
      name: name.trim(),
      phone: normalizePhone(phone),
      plate: plate.trim() || null,
      contact_methods: methods,
    };
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("sell_requests").insert(payload);
      if (error) {
        setApiError(error.message);
        return;
      }
    } else {
      // eslint-disable-next-line no-console
      console.log("sell-number-lead (configure Supabase to persist)", payload);
    }
    setSent(true);
  }

  return (
    <Modal
      title="Продать номер"
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-600">
            Мы свяжемся выбранным способом в ближайшее время.
          </div>
          <button
            type="button"
            className={["btn-luxe px-6 py-3", canSend ? "" : "opacity-60"].join(" ")}
            onClick={submit}
            disabled={!canSend}
          >
            Оставить заявку
          </button>
        </div>
      }
    >
      {sent ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Заявка отправлена. Спасибо! Мы скоро свяжемся.
        </div>
      ) : null}

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
          <span className="text-xs text-slate-600">Телефон</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-300"
            placeholder="+7 (___) ___‑__‑__"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs text-slate-600">Номер (если знаете)</span>
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-300"
            placeholder="Например: А777АА 77"
          />
        </label>

        <div className="grid gap-2">
          <div className="text-xs text-slate-600">Как удобнее связаться</div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={methods.call}
                onChange={() => toggle("call")}
              />
              Звонок
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={methods.whatsapp}
                onChange={() => toggle("whatsapp")}
              />
              WhatsApp
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={methods.telegram}
                onChange={() => toggle("telegram")}
              />
              Telegram
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}

