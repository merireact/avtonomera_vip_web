import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

const LETTER_MAX = 1;
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
  onPartsChange,
  onSubmit,
  size = "md",
  showSubmitButton = true,
  submitLabel = "Найти",
}) {
  const [parts, setParts] = useState(() => splitPlate(value));
  const [picker, setPicker] = useState({
    open: false,
    part: null, // l1 | d1 | d2 | d3 | l2 | l3 | r
    twoDigitRegions: false,
    pos: { x: 0, y: 0 },
    panelWidth: 96,
  });
  const plateAnchorRef = useRef(null);
  const lastPartsSigRef = useRef("");
  const l1Ref = useRef(null);
  const d1Ref = useRef(null);
  const d2Ref = useRef(null);
  const d3Ref = useRef(null);
  const l2Ref = useRef(null);
  const l3Ref = useRef(null);
  const rRef = useRef(null);

  const plate = useMemo(() => joinPlate(parts), [parts]);

  useEffect(() => {
    if (value !== undefined && value !== joinPlate(parts)) {
      setParts(splitPlate(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    onChange?.(plate);
    const sig = JSON.stringify(parts);
    if (lastPartsSigRef.current !== sig) {
      lastPartsSigRef.current = sig;
      onPartsChange?.(parts);
    }
  }, [plate, parts, onChange, onPartsChange]);

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

    const base = plateAnchorRef.current?.getBoundingClientRect?.();
    const cell = el?.getBoundingClientRect?.();
    const GAP = 8;
    const narrowW = 96;
    const regionW = base ? Math.min(320, Math.max(260, base.width - 8)) : 300;

    if (!base || !cell) {
      setPicker((p) => ({
        ...p,
        open: true,
        part,
        panelWidth: part === "r" ? regionW : narrowW,
        pos: { x: 0, y: 0 },
      }));
      return;
    }

    let x = cell.left - base.left;
    const y = cell.bottom - base.top + GAP;
    const panelW = part === "r" ? regionW : narrowW;

    x = Math.max(4, Math.min(x, base.width - panelW - 4));

    setPicker((p) => ({
      ...p,
      open: true,
      part,
      panelWidth: panelW,
      pos: { x, y },
    }));
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
    if (idx === 0) return parts.d1 || "";
    if (idx === 1) return parts.d2 || "";
    if (idx === 2) return parts.d3 || "";
    return "";
  }

  function setDigitAt(idx, digit) {
    const d = clampMax(onlyDigits(digit), 1);
    if (idx === 0) set("d1", d);
    if (idx === 1) set("d2", d);
    if (idx === 2) set("d3", d);
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

  function filterRegionCodes(codes) {
    if (!picker.twoDigitRegions) return codes;
    return codes.filter((c) => c.length === 2);
  }

  return (
    <div
      className={[
        "glass w-full overflow-visible",
        size === "lg" ? "p-2 sm:p-6" : "p-2 sm:p-5",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-2 overflow-visible sm:flex-row sm:gap-5",
        ].join(" ")}
      >
        <div
          ref={plateAnchorRef}
          className={[
            "relative max-w-full shrink-0 overflow-visible rounded-[10px] border-[3px] border-black bg-[#d4d4d4] p-[2px] sm:p-[3px]",
            "shadow-[0_10px_32px_rgba(15,23,42,.14)] [-webkit-overflow-scrolling:touch]",
          ].join(" ")}
        >
          <div
            className={[
              "flex w-full max-w-full min-w-0 items-stretch rounded-[7px] bg-white",
            ].join(" ")}
          >
            <div
              className="flex shrink-0 items-center justify-center pl-2 pr-0.5 sm:pl-4 sm:pr-1.5"
              aria-hidden="true"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-black sm:h-2 sm:w-2" />
            </div>

            <div
              className={[
                "flex flex-1 items-center justify-center gap-x-1 py-1 pl-1 pr-0.5 max-sm:py-0.5 sm:gap-x-3 sm:py-2 sm:pl-2.5 sm:pr-2 sm:min-w-[17rem]",
                "mr-3 sm:mr-5",
                size === "lg"
                  ? "min-w-0 max-sm:min-w-[10.25rem] sm:py-2.5"
                  : "min-w-[10.5rem]",
              ].join(" ")}
            >
              <div className="flex items-center gap-0">
                <InputBox
                  ref={l1Ref}
                  value={parts.l1}
                  readOnly
                  placeholder="М"
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
              </div>
              <div className="flex items-center gap-0">
                <InputBox
                  ref={d1Ref}
                  value={digitAt(0)}
                  inputMode="numeric"
                  readOnly
                  placeholder="7"
                  onChange={() => {}}
                  onKeyDown={handleKeyDown}
                  onClick={() => openPicker("d1")}
                  className={ui.digit}
                  ariaLabel="Цифра 1"
                />
                <InputBox
                  ref={d2Ref}
                  value={digitAt(1)}
                  inputMode="numeric"
                  readOnly
                  placeholder="7"
                  onChange={() => {}}
                  onKeyDown={handleKeyDown}
                  onClick={() => openPicker("d2")}
                  className={ui.digit}
                  ariaLabel="Цифра 2"
                />
                <InputBox
                  ref={d3Ref}
                  value={digitAt(2)}
                  inputMode="numeric"
                  readOnly
                  placeholder="7"
                  onChange={() => {}}
                  onKeyDown={handleKeyDown}
                  onClick={() => openPicker("d3")}
                  className={ui.digit}
                  ariaLabel="Цифра 3"
                />
              </div>
              <div className="flex items-center gap-0">
                <InputBox
                  ref={l2Ref}
                  value={parts.l2}
                  readOnly
                  placeholder="М"
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
                <InputBox
                  ref={l3Ref}
                  value={parts.l3}
                  readOnly
                  placeholder="М"
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
              </div>
            </div>

            <div className="w-px shrink-0 self-stretch bg-black" aria-hidden="true" />

            <div className="flex min-h-0 min-w-[5.1rem] shrink-0 flex-col items-center justify-center gap-0 py-0.5 pl-0.5 pr-0.5 max-sm:gap-0 max-sm:py-0 sm:min-w-[6.4rem] sm:gap-1.5 sm:py-2 sm:pl-1.5 sm:pr-1.5">
              <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                <InputBox
                  ref={rRef}
                  value={parts.r}
                  inputMode="numeric"
                  readOnly
                  placeholder="000"
                  onChange={(v) => set("r", clampMax(onlyDigits(v), REGION_MAX))}
                  onKeyDown={handleKeyDown}
                  onClick={() => openPicker("r")}
                  className={ui.region}
                  ariaLabel="Регион"
                />
              </div>
              <div className="flex w-full shrink-0 items-center justify-center gap-1.5 max-sm:gap-1 sm:gap-2.5">
                <span
                  className="select-none font-plate text-[10px] font-bold leading-none tracking-[0.14em] text-black sm:text-[12px] lg:text-[14px]"
                  title="Россия"
                >
                  RUS
                </span>
                <RussianFlag className="h-[11px] w-[18px] shrink-0 sm:h-[14px] sm:w-[22px] lg:h-[17px] lg:w-[26px]" />
              </div>
            </div>

            <div
              className="flex shrink-0 items-center justify-center pl-0.5 pr-2 sm:pl-1.5 sm:pr-4"
              aria-hidden="true"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-black sm:h-2 sm:w-2" />
            </div>
          </div>

        {picker.open ? (
          <div
            data-plate-picker="1"
            className={[
              "absolute z-[200] overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,.18)]",
              picker.part === "r" ? "max-h-[min(72vh,520px)]" : "",
            ].join(" ")}
            style={{
              left: picker.pos.x,
              top: picker.pos.y,
              width: picker.part === "r" ? picker.panelWidth : 96,
            }}
          >
            {picker.part === "l1" || picker.part === "l2" || picker.part === "l3" ? (
              <div className="max-h-[280px] overflow-auto p-2">
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
              </div>
            ) : null}

            {picker.part === "d1" || picker.part === "d2" || picker.part === "d3" ? (
              <div className="max-h-[280px] overflow-auto p-2">
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
              </div>
            ) : null}

            {picker.part === "r" ? (
              <div className="flex max-h-[min(72vh,520px)] flex-col">
                <div
                  className="flex shrink-0 flex-row items-center justify-start gap-3 border-b border-slate-100 px-3 py-2.5"
                  dir="ltr"
                >
                  <button
                    type="button"
                    role="switch"
                    aria-checked={picker.twoDigitRegions}
                    className={[
                      "relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
                      picker.twoDigitRegions ? "bg-brand-600" : "bg-slate-200",
                    ].join(" ")}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPicker((p) => ({ ...p, twoDigitRegions: !p.twoDigitRegions }));
                    }}
                  >
                    <span
                      className={[
                        "pointer-events-none absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-[left] duration-200 ease-out",
                        picker.twoDigitRegions
                          ? "left-[calc(100%-1.625rem)]"
                          : "left-0.5",
                      ].join(" ")}
                      aria-hidden
                    />
                  </button>
                  <span className="min-w-0 flex-1 text-left text-sm font-medium text-slate-900">
                    Двузначные регионы
                  </span>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 pt-3">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 text-[15px] font-semibold text-slate-900">Москва</div>
                      <div className="grid grid-cols-5 gap-2">
                        {filterRegionCodes(MOSCOW_REGIONS).map((code) => (
                          <button
                            key={code}
                            type="button"
                            className="flex aspect-square max-h-11 min-h-0 w-full max-w-11 items-center justify-center justify-self-center rounded-full bg-slate-200 text-[13px] font-bold tabular-nums text-slate-900 transition hover:bg-slate-300 sm:h-11 sm:w-11 sm:text-sm"
                            onClick={() => pickRegion(code)}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-[15px] font-semibold text-slate-900">Московская область</div>
                      <div className="grid grid-cols-5 gap-2">
                        {filterRegionCodes(MO_REGIONS).map((code) => (
                          <button
                            key={code}
                            type="button"
                            className="flex aspect-square max-h-11 min-h-0 w-full max-w-11 items-center justify-center justify-self-center rounded-full bg-slate-200 text-[13px] font-bold tabular-nums text-slate-900 transition hover:bg-slate-300 sm:h-11 sm:w-11 sm:text-sm"
                            onClick={() => pickRegion(code)}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        </div>

        {showSubmitButton ? (
          <button
            type="button"
            onClick={onSubmit}
            className={["btn-luxe w-full shrink-0 sm:w-auto", ui.button].join(" ")}
          >
            <Search
              className="h-[1.05em] w-[1.05em] shrink-0 sm:h-[1.1em] sm:w-[1.1em]"
              strokeWidth={2}
              aria-hidden
            />
            {submitLabel}
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          className="text-xs text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-400"
          onClick={() => {
            setParts({ l1: "", d1: "", d2: "", d3: "", l2: "", l3: "", r: "" });
            l1Ref.current?.focus();
          }}
        >
          Очистить
        </button>
      </div>
    </div>
  );
}

const uiMd = {
  letter:
    "min-h-[42px] w-[1.65rem] shrink-0 px-0 py-0 text-[38px] leading-none tracking-[-0.04em] placeholder:text-[40px] sm:min-h-[60px] sm:w-[2.2rem] sm:text-[48px] sm:placeholder:text-[50px]",
  digit:
    "min-h-[42px] w-[1.65rem] shrink-0 px-0 py-0 text-[40px] leading-none tracking-[-0.04em] placeholder:text-[42px] sm:min-h-[60px] sm:w-[2.2rem] sm:text-[52px] sm:placeholder:text-[54px]",
  region:
    "h-[42px] min-w-[4.5rem] max-w-[4.5rem] w-[4.5rem] shrink-0 px-0 py-0 text-center text-[30px] tabular-nums leading-none tracking-[-0.02em] placeholder:text-[32px] sm:h-[60px] sm:min-w-[5.35rem] sm:max-w-[5.35rem] sm:w-[5.35rem] sm:text-[38px] sm:tracking-tight sm:placeholder:text-[40px]",
  button:
    "px-7 py-4 text-lg max-sm:px-4 max-sm:py-2 max-sm:text-sm sm:px-8 sm:py-5 sm:text-xl",
};

const uiLg = {
  letter:
    "min-h-[42px] w-[1.65rem] shrink-0 px-0 py-0 text-[38px] leading-none tracking-[-0.04em] placeholder:text-[40px] sm:min-h-[62px] sm:w-[2.3rem] sm:text-[50px] sm:placeholder:text-[52px]",
  digit:
    "min-h-[42px] w-[1.65rem] shrink-0 px-0 py-0 text-[40px] leading-none tracking-[-0.04em] placeholder:text-[42px] sm:min-h-[62px] sm:w-[2.3rem] sm:text-[54px] sm:placeholder:text-[56px]",
  region:
    "h-[42px] min-w-[4.5rem] max-w-[4.5rem] w-[4.5rem] shrink-0 px-0 py-0 text-center text-[30px] tabular-nums leading-none tracking-[-0.02em] placeholder:text-[32px] sm:h-[62px] sm:min-w-[5.5rem] sm:max-w-[5.5rem] sm:w-[5.5rem] sm:text-[40px] sm:tracking-tight sm:placeholder:text-[42px]",
  button:
    "px-7 py-5 text-lg max-sm:px-4 max-sm:py-2 max-sm:text-sm sm:px-10 sm:py-6 sm:text-xl",
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
        "h-full border-0 bg-transparent",
        "text-center font-plate font-semibold text-slate-900",
        [
          "outline-none cursor-pointer",
          "placeholder:text-slate-300",
          "placeholder:[-webkit-text-fill-color:rgb(214_211_209)]",
          "placeholder:[-webkit-text-stroke:0.22px_rgb(87_83_78)]",
        ].join(" "),
        className || "",
      ].join(" ")}
      placeholder={placeholder}
    />
  );
});

function RussianFlag({ className }) {
  return (
    <svg className={className} viewBox="0 0 3 2" aria-hidden="true">
      <rect width="3" height="0.667" fill="#fff" />
      <rect y="0.667" width="3" height="0.667" fill="#0039A6" />
      <rect y="1.333" width="3" height="0.667" fill="#D52B1E" />
      <rect width="3" height="2" fill="none" stroke="#000" strokeWidth="0.05" />
    </svg>
  );
}

function splitPlate(raw) {
  const cleaned = (raw || "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[^A-ZА-ЯЁ0-9 ]/g, "");

  if (!cleaned) return { l1: "", d1: "", d2: "", d3: "", l2: "", l3: "", r: "" };

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
    return { l1: "", d1: "", d2: "", d3: "", l2: "", l3: "", r: s };
  }

  // Одна слитная строка: буква + цифры + буквы + регион в конце (пробелы уже убраны).
  const m = s.match(/^([A-ZА-ЯЁ])?(\d{0,3})?([A-ZА-ЯЁ])?([A-ZА-ЯЁ])?(\d{0,3})?$/);
  if (!m) return { l1: "", d1: "", d2: "", d3: "", l2: "", l3: "", r: "" };

  const dStr = m[2] || "";
  return {
    l1: m[1] || "",
    d1: dStr[0] || "",
    d2: dStr[1] || "",
    d3: dStr[2] || "",
    l2: m[3] || "",
    l3: m[4] || "",
    r: m[5] || "",
  };
}

function joinPlate(p) {
  const l1 = onlyPlateLetters(p.l1);
  const d1 = onlyDigits(p.d1);
  const d2 = onlyDigits(p.d2);
  const d3 = onlyDigits(p.d3);
  const l2 = onlyPlateLetters(p.l2);
  const l3 = onlyPlateLetters(p.l3);
  const r = onlyDigits(p.r);
  const left = `${clampMax(l1, 1)}${clampMax(d1, 1)}${clampMax(d2, 1)}${clampMax(d3, 1)}${clampMax(l2, 1)}${clampMax(l3, 1)}`.trim();
  const region = clampMax(r, 3);
  if (!region) return left;
  // Всегда пробел перед регионом — splitPlate различает «А 77» и «А77» (три цифры в середине).
  return left ? `${left} ${region}` : region;
}

/** Разбор левой части номера без региона: буква + до 3 цифр + две буквы. */
function parseLeftSegment(s) {
  const m = (s || "").match(/^([A-ZА-ЯЁ])?(\d{0,3})([A-ZА-ЯЁ])?([A-ZА-ЯЁ])?$/);
  if (!m) return { l1: "", d1: "", d2: "", d3: "", l2: "", l3: "" };
  const dStr = m[2] || "";
  return {
    l1: m[1] || "",
    d1: dStr[0] || "",
    d2: dStr[1] || "",
    d3: dStr[2] || "",
    l2: m[3] || "",
    l3: m[4] || "",
  };
}

