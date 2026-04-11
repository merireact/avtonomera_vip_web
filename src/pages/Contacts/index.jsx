import { useState } from "react";
import { Phone } from "lucide-react";
import { IconTelegram, IconWhatsApp } from "../../components/MessengerIcons";
import maxMessengerIcon from "../../assets/max-messenger.png";
import SelectionRequestModal from "../../components/SelectionRequestModal";
import styles from "./styles.module.css";

export default function Contacts() {
  const [selectionOpen, setSelectionOpen] = useState(false);

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

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <a
                className={styles.messengerBtn}
                href="https://wa.me/79099686474"
                target="_blank"
                rel="noreferrer"
              >
                <span className={styles.messengerIconWrap} data-brand="wa">
                  <IconWhatsApp className="h-[18px] w-[18px] text-white" />
                </span>
                WhatsApp
              </a>
              <a
                className={styles.messengerBtn}
                href="https://t.me/avtonomera_vip"
                target="_blank"
                rel="noreferrer"
              >
                <span className={styles.messengerIconWrap} data-brand="tg">
                  <IconTelegram className="h-[18px] w-[18px] text-white" />
                </span>
                Telegram
              </a>
              <a className={styles.messengerBtn} href="tel:+79099686474">
                <span className={styles.messengerIconWrap} data-brand="max">
                  <img
                    src={maxMessengerIcon}
                    alt=""
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </span>
                Max
              </a>
            </div>

            <button
              type="button"
              className="btn-luxe mt-4 w-full sm:mt-5 sm:max-w-md"
              onClick={() => setSelectionOpen(true)}
            >
              Запросить подбор
            </button>

            <div className="mt-6 rounded-luxe border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              График: ежедневно 9:00–23:00 • Ответим быстро, без лишних слов.
            </div>
          </div>
        </div>
      </div>

      {selectionOpen ? (
        <SelectionRequestModal onClose={() => setSelectionOpen(false)} />
      ) : null}
    </div>
  );
}
