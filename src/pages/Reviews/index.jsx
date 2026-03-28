import { motion } from "framer-motion";
import styles from "./styles.module.css";

const reviews = [
  {
    id: "r1",
    name: "Александр",
    role: "Подбор номера",
    text: "Быстро подобрали несколько вариантов, всё прозрачно по цене и статусам. Минимум сообщений — максимум дела.",
  },
  {
    id: "r2",
    name: "Мария",
    role: "Подбор номера",
    text: "Поиск очень удобный: ввела номер, сразу вижу варианты и стоимость. Визуально чисто и приятно.",
  },
  {
    id: "r3",
    name: "Дмитрий",
    role: "Покупка автономера",
    text: "Понравилось внимание к деталям и скорость: помогли с выбором и резервом, без лишней суеты.",
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
  return (
    <div className="mx-auto max-w-7xl pb-16">
      <div className="pt-6 sm:pt-10">
        <h1 className="section-title">Отзывы</h1>
        <p className="mt-2 muted max-w-2xl">
          Несколько коротких отзывов о сервисе подбора и покупки автономеров.
        </p>

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
                <div>
                  <div className="text-sm text-slate-900">{r.name}</div>
                  <div className="text-xs text-slate-600">{r.role}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-700 leading-relaxed">{r.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

