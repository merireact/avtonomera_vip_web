import { MessageCircle, Phone, Send } from "lucide-react";
import styles from "./styles.module.css";

export default function Contacts() {
  return (
    <div className="mx-auto max-w-7xl pb-16">
      <div className="pt-6 sm:pt-10">
        <h1 className="section-title">Контакты</h1>
        <p className="mt-2 muted max-w-2xl">
          Связь одним касанием: мессенджеры и телефон.
        </p>

        <div className="mt-7">
          <div className="glass p-6">
            <div className="text-xs text-slate-600">Телефон</div>
            <a
              className="mt-2 inline-flex items-center gap-2 text-lg text-slate-900 hover:text-slate-900"
              href="tel:+79099686474"
            >
              <Phone className="h-4 w-4 text-brand-600" />
              +7 (909) 968‑64‑74
            </a>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                className={styles.messengerBtn}
                href="https://wa.me/79099686474"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                className={styles.messengerBtn}
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
              >
                <Send className="h-4 w-4" />
                Telegram
              </a>
              <button type="button" className={styles.messengerBtn}>
                <Send className="h-4 w-4" />
                Max
              </button>
              <button type="button" className="btn-luxe">
                Запросить подбор
              </button>
            </div>

            <div className="mt-6 rounded-luxe border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              График: ежедневно 10:00–22:00 • Ответим быстро, без лишних слов.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

