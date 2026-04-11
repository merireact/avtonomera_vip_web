import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ title, children, onClose, footer }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[180] flex min-h-0 items-center justify-center p-2 sm:p-4">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={[
          "glass relative z-10 flex w-full max-w-2xl min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,.20)]",
          /* Мобильный: почти на всю высоту — тело модалки скроллится */
          "max-h-[calc(100dvh-0.75rem)] h-[calc(100dvh-0.75rem)]",
          /* От sm: высота по контенту, но не выше viewport — при длинной форме скролл внутри */
          "sm:h-auto sm:max-h-[min(92vh,860px)] sm:min-h-0",
        ].join(" ")}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0 pr-2">
            <div
              id="modal-title"
              className="font-display text-lg tracking-tight text-slate-900 sm:text-xl"
            >
              {title}
            </div>
          </div>
          <button
            type="button"
            className="btn-ghost shrink-0 px-3 py-2 sm:px-4"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>

        <div
          className={[
            "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5",
            "[-webkit-overflow-scrolling:touch]",
          ].join(" ")}
        >
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-5 sm:py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
