import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Кнопки «назад / вперёд» и подпись страницы. Не рендерится при totalPages ≤ 1.
 */
export default function PaginationBar({
  currentPage,
  totalPages,
  onGoPrev,
  onGoNext,
  className = "",
  hidden = false,
}) {
  if (hidden || totalPages <= 1) return null;

  return (
    <nav
      className={className}
      role="navigation"
      aria-label="Страницы результатов"
    >
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          className="btn-ghost flex h-10 w-10 shrink-0 items-center justify-center rounded-full p-0 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={onGoPrev}
          aria-label="Предыдущая страница"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <div className="text-sm font-medium text-slate-700">
          Страница {currentPage} из {totalPages}
        </div>
        <button
          type="button"
          className="btn-ghost flex h-10 w-10 shrink-0 items-center justify-center rounded-full p-0 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={onGoNext}
          aria-label="Следующая страница"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </nav>
  );
}
