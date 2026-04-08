import { motion } from "framer-motion";
import { CopyCheck, ShieldCheck, Clock } from "lucide-react";

export default function Transfer() {
  return (
    <div className="mx-auto max-w-4xl pb-16 pt-6 sm:pt-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="section-title">Переоформление номеров</h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">
            Легально, безопасно и быстро. Узнайте всё о процедуре передачи прав на государственные регистрационные знаки.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 mb-12 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-sm"
      >
        <img
          src="https://i.postimg.cc/3JjyZX2k/IMG-5699.png"
          alt="Процесс переоформления красивого номера"
          className="w-full h-auto rounded-xl object-cover block"
          loading="lazy"
        />
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-3 mb-12">
        <motion.div
          whileHover={{ y: -3 }}
          className="p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(15,23,42,.03)]"
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <ShieldCheck strokeWidth={2} />
          </div>
          <h3 className="mt-4 font-display text-lg font-medium tracking-tight text-slate-900">
            Официально
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Всё переоформление проходит официально через органы ГИБДД с полным соблюдением законов РФ.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(15,23,42,.03)]"
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-700">
            <Clock strokeWidth={2} />
          </div>
          <h3 className="mt-4 font-display text-lg font-medium tracking-tight text-slate-900">
            Быстро
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Процедура с использованием авто-донора занимает минимум времени. Мы ценим ваше время.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(15,23,42,.03)]"
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-700">
            <CopyCheck strokeWidth={2} />
          </div>
          <h3 className="mt-4 font-display text-lg font-medium tracking-tight text-slate-900">
            Надежно
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Заключаем договор купли-продажи и помогаем с заполнением всех необходимых бумаг.
          </p>
        </motion.div>
      </div>

      <div className="prose prose-slate max-w-none text-slate-700">
        <h2 className="text-xl font-medium tracking-tight text-slate-900">Как это происходит:</h2>
        <ul className="mt-4 space-y-3 list-none p-0">
          <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-brand-500">
            <strong className="text-slate-900 font-medium">Шаг 1. Передача номера на автомобиль-донор.</strong> Вы, как продавец или покупатель, должны понимать, что государственные регистрационные знаки (номера) продаются только вместе с автомобилем.
          </li>
          <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-brand-500">
            <strong className="text-slate-900 font-medium">Шаг 2. Сопровождение сделки.</strong> Мы используем проверенные автомобили-доноры, на которые сначала вешается номер в МРЭО ГИБДД, а затем вместе с недорогим автомобилем-донором продаётся покупателю номера по ДКП.
          </li>
          <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-brand-500">
            <strong className="text-slate-900 font-medium">Шаг 3. Переоформление на вашу машину.</strong> Покупатель, приобретя донора с номером, перевешивает красивый знак в ГАИ на свой основной автомобиль. Донор возвращается нам (если договорились так) или утилизируется.
          </li>
        </ul>
        <p className="mt-6 text-sm text-slate-500 italic">
          Обратите внимание, госпошлины на новые СТС и внесение изменений в ПТС оплачиваются дополнительно согласно тарифам.
        </p>
      </div>
    </div>
  );
}
