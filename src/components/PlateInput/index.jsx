import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

const LETTER_MAX = 1;
const DIGITS_MAX = 3;
const REGION_MAX = 3;

const PLATE_LETTERS = ["А", "В", "Е", "К", "М", "Н", "О", "Р", "С", "Т", "У", "Х"];
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const MOSCOW_REGIONS = ["77", "99", "97", "177", "197", "199", "777", "797", "799", "977"];
const MO_REGIONS = ["50", "90", "150", "190", "750", "790", "250", "550"];

function onlyDigits(s) {
  return (s || "").replace(/\D+/g, "");
}

function onlyPlateLetters(s) {
  return (s || "").toUpperCase().replace(/[^A-ZА-ЯЁ]/g, "");
}

function clampMax(s, n) {
  return s.slice(0, n);
}

export default function PlateInput({
  value,
  onChange,
  onSubmit,
  size = "md",
  showSubmitButton = true,
  submitLabel = "Найти",
}) {
  const [parts, setParts] = useState(() => splitPlate(value));
  const [picker, setPicker] = useState({
    open: false,
    part: null, // l1 | d1 | d2 | d3 | l2 | l3 | r
    regionGroup: "moscow",
    pos: { x: 0, y: 0 },
  });
  const l1Ref = useRef(null);
  const d1Ref = useRef(null);
  const d2Ref = useRef(null);
  const d3Ref = useRef(null);
  const l2Ref = useRef(null);
  const l3Ref = useRef(null);
  const rRef = useRef(null);

  useEffect(() => {
    setParts(splitPlate(value));
  }, [value]);

  const plate = useMemo(() => joinPlate(parts), [parts]);

  useEffect(() => {
    onChange?.(plate);
  }, [plate, onChange]);

  const ui = size === "lg" ? uiLg : uiMd;

  function set(part, next) {
    setParts((prev) => ({ ...prev, [part]: next }));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") onSubmit?.();
  }

  function openPicker(part) {
    const el =
      part === "l1"
        ? l1Ref.current
        : part === "d1"
        ? d1Ref.current
        : part === "d2"
        ? d2Ref.current
        : part === "d3"
        ? d3Ref.current
        : part === "l2"
        ? l2Ref.current
        : part === "l3"
        ? l3Ref.current
        : part === "r"
        ? rRef.current
        : null;

    const rect = el?.getBoundingClientRect?.();
    const x = rect ? rect.right + 10 : 16;
    const y = rect ? rect.top : 120;

    setPicker((p) => ({ ...p, open: true, part, pos: { x, y } }));
  }

  function closePicker() {
    setPicker((p) => ({ ...p, open: false, part: null }));
  }

  function pickLetter(part, letter) {
    set(part, letter);
    if (part === "l1") d1Ref.current?.focus();
    if (part === "l2") l3Ref.current?.focus();
    if (part === "l3") rRef.current?.focus();
    closePicker();
  }

  function digitAt(idx) {
    return parts.d[idx] || "";
  }

  function setDigitAt(idx, digit) {
    const current = parts.d.padEnd(3, "");
    const next = (current.slice(0, idx) + digit + current.slice(idx + 1)).slice(0, 3).trimEnd();
    set("d", clampMax(onlyDigits(next), DIGITS_MAX));
  }

  function pickDigit(part, digit) {
    const idx = part === "d1" ? 0 : part === "d2" ? 1 : 2;
    setDigitAt(idx, digit);
    if (idx === 0) d2Ref.current?.focus();
    if (idx === 1) d3Ref.current?.focus();
    if (idx === 2) l2Ref.current?.focus();
    closePicker();
  }

  function pickRegion(region) {
    set("r", clampMax(onlyDigits(region), REGION_MAX));
    closePicker();
  }

  useEffect(() => {
    if (!picker.open) return;
    function onPointerDown(e) {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.closest?.('[data-plate-picker="1"]')) return;
      closePicker();
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [picker.open]);

  return (
    <div
      className={["glass w-full", size === "lg" ? "p-5 sm:p-6" : "p-4 sm:p-5"].join(" ")}
    >
      <div
        className={[
          "mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5",
        ].join(" ")}
      >
        <div
          className={[
            "flex w-fit max-w-full shrink-0 items-stretch overflow-hidden rounded-3xl border-2",
            "border-slate-300 bg-white shadow-[0_16px_44px_rgba(15,23,42,.1)]",
          ].join(" ")}
        >
          <InputBox
            ref={l1Ref}
            value={parts.l1}
            readOnly
            placeholder="А"
            onChange={(v) => {
              const next = clampMax(onlyPlateLetters(v), LETTER_MAX);
              set("l1", next);
              if (next.length === LETTER_MAX) d1Ref.current?.focus();
            }}
            onKeyDown={handleKeyDown}
            onClick={() => openPicker("l1")}
            className={ui.letter}
            ariaLabel="Первая буква"
          />
          <Divider />
          <InputBox
            ref={d1Ref}
            value={digitAt(0)}
            inputMode="numeric"
            readOnly
            placeholder="1"
            onChange={() => {}}
            onKeyDown={handleKeyDown}
            onClick={() => openPicker("d1")}
            className={ui.digit}
            ariaLabel="Цифра 1"
          />
          <Divider />
          <InputBox
            ref={d2Ref}
            value={digitAt(1)}
            inputMode="numeric"
            readOnly
            placeholder="1"
            onChange={() => {}}
            onKeyDown={handleKeyDown}
            onClick={() => openPicker("d2")}
            className={ui.digit}
            ariaLabel="Цифра 2"
          />
          <Divider />
          <InputBox
            ref={d3Ref}
            value={digitAt(2)}
            inputMode="numeric"
            readOnly
            placeholder="1"
            onChange={() => {}}
            onKeyDown={handleKeyDown}
            onClick={() => openPicker("d3")}
            className={ui.digit}
            ariaLabel="Цифра 3"
          />
          <Divider />
          <InputBox
            ref={l2Ref}
            value={parts.l2}
            readOnly
            placeholder="А"
            onChange={(v) => {
              const next = clampMax(onlyPlateLetters(v), LETTER_MAX);
              set("l2", next);
              if (next.length === LETTER_MAX) l3Ref.current?.focus();
            }}
            onKeyDown={handleKeyDown}
            onClick={() => openPicker("l2")}
            className={ui.letter}
            ariaLabel="Вторая буква"
          />
          <Divider />
          <InputBox
            ref={l3Ref}
            value={parts.l3}
            readOnly
            placeholder="А"
            onChange={(v) => {
              const next = clampMax(onlyPlateLetters(v), LETTER_MAX);
              set("l3", next);
              if (next.length === LETTER_MAX) rRef.current?.focus();
            }}
            onKeyDown={handleKeyDown}
            onClick={() => openPicker("l3")}
            className={ui.letter}
            ariaLabel="Третья буква"
          />

          <div className="flex items-stretch">
            <div className="h-full w-px bg-slate-300/80" />
            <div className="flex items-stretch px-1 sm:px-1.5">
              <InputBox
                ref={rRef}
                value={parts.r}
                inputMode="numeric"
                readOnly
                placeholder="77"
                onChange={(v) => set("r", clampMax(onlyDigits(v), REGION_MAX))}
                onKeyDown={handleKeyDown}
                onClick={() => openPicker("r")}
                className={ui.region}
                ariaLabel="Регион"
              />
            </div>
          </div>
        </div>

        {showSubmitButton ? (
          <button
            type="button"
            onClick={onSubmit}
            className={["btn-luxe shrink-0 w-full sm:w-auto", ui.button].join(" ")}
          >
            <Search className="h-[1.05em] w-[1.05em] shrink-0 sm:h-[1.1em] sm:w-[1.1em]" strokeWidth={2} aria-hidden />
            {submitLabel}
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-slate-600">
          Выбирайте буквы, цифры и регион — доступны только корректные варианты.
        </div>
        <button
          type="button"
          className="text-xs text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-400"
          onClick={() => {
            setParts({ l1: "", d: "", l2: "", l3: "", r: "" });
            l1Ref.current?.focus();
          }}
        >
          Очистить
        </button>
      </div>

      {picker.open ? (
        <div
          data-plate-picker="1"
          className="fixed z-[200] w-[96px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,.18)]"
          style={{
            left: Math.min(picker.pos.x, window.innerWidth - 108),
            top: Math.min(picker.pos.y, window.innerHeight - 320),
          }}
        >
          <div className="max-h-[300px] overflow-auto p-2">
            {picker.part === "l1" || picker.part === "l2" || picker.part === "l3" ? (
              <div className="grid gap-2">
                {PLATE_LETTERS.map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    onClick={() => pickLetter(picker.part, ch)}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            ) : null}

            {picker.part === "d1" || picker.part === "d2" || picker.part === "d3" ? (
              <div className="grid gap-2">
                {DIGITS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    onClick={() => pickDigit(picker.part, d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            ) : null}

            {picker.part === "r" ? (
              <div className="grid gap-2">
                <button
                  type="button"
                  className={[
                    "rounded-xl border px-3 py-2 text-xs font-medium",
                    picker.regionGroup === "moscow"
                      ? "border-brand-600 text-brand-700 bg-white"
                      : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50",
                  ].join(" ")}
                  onClick={() => setPicker((p) => ({ ...p, regionGroup: "moscow" }))}
                >
                  Москва
                </button>
                <button
                  type="button"
                  className={[
                    "rounded-xl border px-3 py-2 text-xs font-medium",
                    picker.regionGroup === "mo"
                      ? "border-brand-600 text-brand-700 bg-white"
                      : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50",
                  ].join(" ")}
                  onClick={() => setPicker((p) => ({ ...p, regionGroup: "mo" }))}
                >
                  МО
                </button>
                <div className="h-px bg-slate-200" />
                <div className="grid gap-2">
                  {(picker.regionGroup === "moscow" ? MOSCOW_REGIONS : MO_REGIONS).map((r) => (
                    <button
                      key={r}
                      type="button"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                      onClick={() => pickRegion(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const uiMd = {
  letter:
    "min-h-14 w-[46px] px-2.5 py-3.5 text-[19px] sm:min-h-16 sm:w-[54px] sm:px-3 sm:py-4 sm:text-[22px]",
  digit:
    "min-h-14 w-[42px] px-2 py-3.5 text-[19px] sm:min-h-16 sm:w-[50px] sm:px-2.5 sm:py-4 sm:text-[22px]",
  region:
    "min-h-14 min-w-[50px] w-[50px] px-2 py-3.5 text-center text-[18px] sm:min-h-16 sm:min-w-[58px] sm:w-[58px] sm:px-3 sm:py-4 sm:text-[21px]",
  button: "px-7 py-4 text-lg sm:px-8 sm:py-5 sm:text-xl",
};

const uiLg = {
  letter:
    "min-h-16 w-[50px] px-3 py-4 text-[22px] sm:min-h-[72px] sm:w-[62px] sm:px-3.5 sm:py-5 sm:text-[28px]",
  digit:
    "min-h-16 w-[46px] px-2.5 py-4 text-[22px] sm:min-h-[72px] sm:w-[56px] sm:px-3 sm:py-5 sm:text-[28px]",
  region:
    "min-h-16 min-w-[52px] w-[52px] px-2.5 py-4 text-center text-[20px] sm:min-h-[72px] sm:min-w-[68px] sm:w-[68px] sm:px-3 sm:py-5 sm:text-[26px]",
  button: "px-7 py-5 text-lg sm:px-10 sm:py-6 sm:text-xl",
};

const InputBox = forwardRef(function InputBox(
  {
    value,
    onChange,
    onKeyDown,
    onClick,
    className,
    inputMode,
    ariaLabel,
    readOnly = false,
    placeholder = "—",
  },
  ref
) {
  return (
    <input
      ref={ref}
      value={value}
      inputMode={inputMode}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      readOnly={readOnly}
      className={[
        "h-full bg-white",
        "text-center font-mono font-semibold tracking-[0.1em] text-slate-900",
        "outline-none placeholder:text-slate-400 cursor-pointer",
        className || "",
      ].join(" ")}
      placeholder={placeholder}
    />
  );
});

function Divider() {
  return <div className="h-full w-px bg-slate-300/80" aria-hidden="true" />;
}

function splitPlate(raw) {
  const cleaned = (raw || "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[^A-ZА-ЯЁ0-9 ]/g, "");

  if (!cleaned) return { l1: "", d: "", l2: "", l3: "", r: "" };

  // Явный регион после пробела (как отдаёт joinPlate) — не сливаем с цифрами середины.
  const tokens = cleaned.split(" ").filter(Boolean);
  if (tokens.length >= 2) {
    const last = tokens[tokens.length - 1].replace(/\s/g, "");
    const r = clampMax(onlyDigits(last), REGION_MAX);
    if (r && /^\d{1,3}$/.test(r) && r === onlyDigits(last)) {
      const leftJoined = tokens
        .slice(0, -1)
        .join("")
        .replace(/\s/g, "");
      return { ...parseLeftSegment(leftJoined), r };
    }
  }

  const s = cleaned.replace(/\s/g, "");

  // Только цифры 1–3 символа: в этом вводе середина всегда с буквы — значит это регион.
  if (/^\d{1,3}$/.test(s)) {
    return { l1: "", d: "", l2: "", l3: "", r: s };
  }

  // Одна слитная строка: буква + цифры + буквы + регион в конце (пробелы уже убраны).
  const m = s.match(/^([A-ZА-ЯЁ])?(\d{0,3})?([A-ZА-ЯЁ])?([A-ZА-ЯЁ])?(\d{0,3})?$/);
  if (!m) return { l1: "", d: "", l2: "", l3: "", r: "" };

  return {
    l1: m[1] || "",
    d: m[2] || "",
    l2: m[3] || "",
    l3: m[4] || "",
    r: m[5] || "",
  };
}

function joinPlate(p) {
  const l1 = onlyPlateLetters(p.l1);
  const d = onlyDigits(p.d);
  const l2 = onlyPlateLetters(p.l2);
  const l3 = onlyPlateLetters(p.l3);
  const r = onlyDigits(p.r);
  const left = `${clampMax(l1, 1)}${clampMax(d, 3)}${clampMax(l2, 1)}${clampMax(l3, 1)}`.trim();
  const region = clampMax(r, 3);
  if (!region) return left;
  // Всегда пробел перед регионом — splitPlate различает «А 77» и «А77» (три цифры в середине).
  return left ? `${left} ${region}` : region;
}

/** Разбор левой части номера без региона: буква + до 3 цифр + две буквы. */
function parseLeftSegment(s) {
  const m = (s || "").match(/^([A-ZА-ЯЁ])?(\d{0,3})([A-ZА-ЯЁ])?([A-ZА-ЯЁ])?$/);
  if (!m) return { l1: "", d: "", l2: "", l3: "" };
  return {
    l1: m[1] || "",
    d: m[2] || "",
    l2: m[3] || "",
    l3: m[4] || "",
  };
}

