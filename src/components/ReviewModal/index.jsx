import { useState } from "react";
import Modal from "../Modal";
import StarRating from "../StarRating";
import { supabase } from "../../lib/supabase";

const NAME_MAX = 200;
const TEXT_MAX = 4000;
const FORM_ID = "review-guest-form";

export default function ReviewModal({ onClose }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!supabase || !name.trim() || !text.trim()) return;
    setSubmitting(true);
    setErr(null);
    const { error } = await supabase.from("reviews").insert({
      author_name: name.trim(),
      text: text.trim(),
      rating,
      published: false,
    });
    setSubmitting(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <Modal
      title="Оставить отзыв"
      onClose={onClose}
      footer={
        sent ? null : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="submit"
              form={FORM_ID}
              className="btn-luxe w-full px-6 py-3 disabled:opacity-50 sm:w-auto"
              disabled={submitting}
            >
              Отправить
            </button>
          </div>
        )
      }
    >
      {sent ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-center text-sm text-emerald-900">
          Спасибо! Отзыв отправлен и скоро будет опубликован после проверки модератором.
        </div>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-slate-600">
            После отправки отзыв появится на сайте после проверки модератором.
          </p>
          {err ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              {err}
            </div>
          ) : null}
          <form id={FORM_ID} className="mt-5 grid gap-4" onSubmit={submit}>
            <div className="grid gap-2">
              <span className="text-xs text-slate-600">Оценка</span>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <label className="grid gap-1">
              <span className="text-xs text-slate-600">Имя</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={NAME_MAX}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-slate-600">Текст отзыва</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                maxLength={TEXT_MAX}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </label>
          </form>
        </>
      )}
    </Modal>
  );
}
