function clampRating(n) {
  const x = Math.round(Number(n));
  if (Number.isNaN(x)) return 5;
  return Math.min(5, Math.max(1, x));
}

export default function StarRating({ value = 5, onChange, className = "" }) {
  const v = clampRating(value);
  const interactive = typeof onChange === "function";

  return (
    <div
      className={["flex gap-0.5", className].filter(Boolean).join(" ")}
      aria-label={interactive ? undefined : `Оценка ${v} из 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= v;
        if (interactive) {
          return (
            <button
              key={n}
              type="button"
              aria-label={`Оценка ${n} из 5`}
              className={[
                "text-lg leading-none transition-colors",
                filled ? "text-amber-500" : "text-slate-300",
                "hover:text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600",
              ].join(" ")}
              onClick={() => onChange(n)}
            >
              ★
            </button>
          );
        }
        return (
          <span
            key={n}
            className={["text-lg leading-none", filled ? "text-amber-500" : "text-slate-300"].join(
              " "
            )}
            aria-hidden
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
