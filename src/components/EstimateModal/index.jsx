import { useState } from "react";
import Modal from "../Modal";
import PlateInput from "../PlateInput";

export default function EstimateModal({ plate, onClose }) {
  const [draftPlate, setDraftPlate] = useState(() => (plate || "").trim());
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!draftPlate.trim()) return;
    setSubmitted(true);
  }

  return (
    <Modal
      title="Оценить номер"
      onClose={onClose}
      footer={
        <div className="text-xs text-slate-600">
          Оценку выполняет специалист. Итоговая сумма зависит от спроса, региона и
          комплекта документов.
        </div>
      }
    >
      {submitted ? (
        <div className="grid gap-4">
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-5 text-center">
            <div className="font-display text-lg tracking-tight text-emerald-900">
              Заявка принята
            </div>
            <p className="mt-2 text-sm text-emerald-800/90">
              Номер <span className="font-mono font-semibold">{draftPlate}</span> передан
              на оценку. Мы свяжемся с вами в ближайшее время.
            </p>
          </div>
          <button type="button" className="btn-luxe w-full px-5 py-3" onClick={onClose}>
            Понятно
          </button>
        </div>
      ) : (
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <p className="text-sm leading-relaxed text-slate-600">
            Введите госномер — отправьте заявку, и менеджер подготовит ориентир по стоимости.
          </p>

          <PlateInput
            value={draftPlate}
            onChange={setDraftPlate}
            onSubmit={handleSubmit}
            size="md"
            showSubmitButton={false}
          />

          <button
            type="submit"
            className="btn-luxe w-full px-5 py-3.5 text-sm disabled:pointer-events-none disabled:opacity-45"
            disabled={!draftPlate.trim()}
          >
            Отправить заявку на оценку
          </button>
        </form>
      )}
    </Modal>
  );
}
