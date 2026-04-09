import { useMemo, useRef, useState } from "react";
import Modal from "../Modal";
import { Heart } from "lucide-react";

function formatPriceRub(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function NumberDetailsModal({
  number,
  imageUrl,
  onSetImageUrl,
  photoReadOnly = true,
  isFavorite = false,
  onToggleFavorite,
  onClose,
}) {
  const inputRef = useRef(null);
  const [fileError, setFileError] = useState("");

  const title = useMemo(() => (number ? `Номер ${number.plate}` : "Детали"), [number]);
  if (!number) return null;

  function onPick() {
    inputRef.current?.click();
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFileError("Нужен файл изображения (png/jpg/webp).");
      return;
    }
    setFileError("");
    const url = URL.createObjectURL(file);
    onSetImageUrl?.(url);
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-700">
            Статус: <span className="font-medium text-slate-900">{number.status}</span>
          </div>
          <div className="text-sm text-slate-700">
            Цена: <span className="font-medium text-slate-900">{formatPriceRub(number.price)}</span>
          </div>
          <button
            type="button"
            className="btn-ghost px-5 py-3"
            onClick={onToggleFavorite}
          >
            <span className="inline-flex items-center gap-2">
              <Heart
                className="h-4 w-4"
                fill={isFavorite ? "rgba(193,0,26,.95)" : "transparent"}
              />
              {isFavorite ? "В избранном" : "В избранное"}
            </span>
          </button>
        </div>
      }
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_220px]">
        <div>
          <div className="text-xs text-slate-600">Госномер</div>
          <div className="mt-2 font-mono text-[2rem] sm:text-4xl font-bold tracking-[0.05em] text-slate-900">
            {number.plate}
          </div>

          {!photoReadOnly ? (
            <div className="mt-5">
              <div className="text-xs text-slate-600">Фото</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" className="btn-luxe px-5 py-3" onClick={onPick}>
                  Загрузить изображение
                </button>
                {imageUrl ? (
                  <button
                    type="button"
                    className="btn-ghost px-5 py-3"
                    onClick={() => onSetImageUrl?.("")}
                  >
                    Удалить
                  </button>
                ) : null}
              </div>
              {fileError ? <div className="mt-2 text-xs text-rose-700">{fileError}</div> : null}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Фото номера ${number.plate}`}
              className="h-[220px] w-full object-cover"
            />
          ) : (
            <div className="grid h-[220px] w-full place-items-center bg-slate-50 text-sm text-slate-500">
              Нет изображения
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

