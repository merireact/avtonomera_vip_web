import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.css";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import ReviewModal from "../../components/ReviewModal";
import StarRating from "../../components/StarRating";

const FALLBACK_REVIEWS = [
  {
    id: "r1",
    name: "Тимур",
    text: "Все на высшем уровне, парни позитивные и хорошо знают свое дело",
    rating: 5,
  },
  {
    id: "r2",
    name: "Мария",
    text: "Понравилась скорость, я думала что щас буду 2 часа ходить по кабинетам в гибдд, оказалось ребята все делают сами. Приятно, что сообщали о каждом этапе сделки",
    rating: 5,
  },
  {
    id: "r3",
    name: "Игорь",
    text: "Первый раз продавал номера, было много вопросов, но в итоге процесс оказался максимально простым и быстрым. Рекомендую",
    rating: 5,
  },
];

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return <div className={styles.avatar}>{initials}</div>;
}

export default function Reviews() {
  const [reviews, setReviews] = useState(() =>
    isSupabaseConfigured ? [] : FALLBACK_REVIEWS
  );
  const [loading, setLoading] = useState(Boolean(isSupabaseConfigured));
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, author_name, text, rating")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (!error && data != null) {
        setReviews(
          data.map((r) => ({
            id: r.id,
            name: r.author_name,
            text: r.text,
            rating: r.rating ?? 5,
          }))
        );
      } else if (error) {
        setReviews(FALLBACK_REVIEWS);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl pb-16">
      <div className="pt-6 sm:pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <h1 className="section-title">Отзывы</h1>
            <p className="mt-2 muted max-w-2xl">
              Несколько коротких отзывов о сервисе подбора и покупки автономеров.
            </p>
          </div>
          {isSupabaseConfigured && supabase ? (
            <button
              type="button"
              className="btn-luxe shrink-0 self-start px-6 py-3"
              onClick={() => setReviewModalOpen(true)}
            >
              Добавить отзыв
            </button>
          ) : null}
        </div>

        {!isSupabaseConfigured || !supabase ? (
          <p className="mt-6 max-w-xl text-sm text-slate-600">
            Публичная отправка отзывов доступна при подключении Supabase.
          </p>
        ) : null}

        {reviewModalOpen ? (
          <ReviewModal onClose={() => setReviewModalOpen(false)} />
        ) : null}

        {loading ? (
          <div className="mt-10 text-sm text-slate-600">Загрузка…</div>
        ) : reviews.length === 0 ? (
          <p className="mt-10 text-sm text-slate-600">Пока нет опубликованных отзывов.</p>
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, idx) => (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className={styles.card}
              >
                <div className="flex items-center gap-3">
                  <Avatar name={r.name} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-900">{r.name}</div>
                    <StarRating value={r.rating} className="mt-1" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-700 leading-relaxed">{r.text}</p>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
