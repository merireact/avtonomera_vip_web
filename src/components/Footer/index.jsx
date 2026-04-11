import { motion } from "framer-motion";
import { Clock, MapPin, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import maxMessengerIcon from "../../assets/max-messenger.png";
import { IconTelegram, IconWhatsApp } from "../MessengerIcons";
import styles from "./styles.module.css";

const nav = [
  { to: "/", label: "Главная" },
  { to: "/catalog", label: "Каталог номеров" },
  { to: "/favorites", label: "Избранное" },
  { to: "/reviews", label: "Отзывы" },
  { to: "/contacts", label: "Контакты" },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={styles.footer}
    >
      <div className={styles.glow} aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-16 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-start gap-4">
              <span className={styles.logoMark}>
                <img src={logo} alt="" className={styles.logoImg} aria-hidden />
              </span>
              <div>
                <div className="font-display text-xl tracking-tight text-white">
                  Avtonomera Vip
                </div>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                  Подбор и продажа красивых госномеров в Москве и Московской области.
                  Работаем аккуратно, быстро и конфиденциально.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <a
                    href="https://wa.me/79099686474"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm ring-1 ring-white/10 transition hover:brightness-110"
                    aria-label="WhatsApp"
                  >
                    <IconWhatsApp className="h-[18px] w-[18px]" />
                  </a>
                  <a
                    href="https://t.me/avtonomera_vip"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-sm ring-1 ring-white/10 transition hover:brightness-110"
                    aria-label="Telegram"
                  >
                    <IconTelegram className="h-[18px] w-[18px]" />
                  </a>
                  <a
                    href="tel:+79099686474"
                    className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ring-1 ring-white/10 transition hover:opacity-95"
                    aria-label="Max"
                  >
                    <img
                      src={maxMessengerIcon}
                      alt=""
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <nav className="lg:col-span-3" aria-label="Нижняя навигация">
            <div className={styles.sectionLabel}>Навигация</div>
            <ul className="space-y-0.5">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      [styles.navLink, isActive ? styles.navLinkActive : ""].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <div className={styles.sectionLabel}>Контакты</div>
            <div className={styles.contactRow}>
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <a href="tel:+79099686474">+7 (909) 968‑64‑74</a>
            </div>
            <div className={styles.contactRow}>
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <span>Москва и Московская область</span>
            </div>
            <div className={styles.contactRow}>
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <span>Ежедневно 9:00–23:00</span>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.bottomNote}>
            Сведения на сайте носят информационный характер и не являются публичной офертой.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={styles.copyright}>© {new Date().getFullYear()} Avtonomera Vip</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <NavLink to="/" className="text-slate-500 transition hover:text-slate-300">
                Вернуться на сайт
              </NavLink>
              <NavLink
                to="/admin/login"
                className="text-slate-500 transition hover:text-slate-300"
              >
                Для сотрудников
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
