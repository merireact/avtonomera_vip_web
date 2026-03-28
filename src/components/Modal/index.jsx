import { useEffect } from "react";

export default function Modal({ title, children, onClose, footer }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative mx-auto flex min-h-full max-w-2xl items-start justify-center px-4 pb-8 pt-12 sm:pt-16 md:pt-20">
        <div className="glass relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,.20)]">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div>
              <div className="font-display text-xl tracking-tight text-slate-900">
                {title}
              </div>
            </div>
            <button
              type="button"
              className="btn-ghost px-4 py-2"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>

          <div className="px-5 py-5">{children}</div>

          {footer ? (
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

