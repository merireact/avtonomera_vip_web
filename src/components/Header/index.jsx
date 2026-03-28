import { motion } from "framer-motion";
import { Heart, MessageCircle, Phone, Send } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import logo from "../../assets/logo.png";

const nav = [
  { to: "/", label: "Главная" },
  { to: "/catalog", label: "Каталог номеров" },
  { to: "/favorites", label: "Избранное" },
  { to: "/reviews", label: "Отзывы" },
  { to: "/contacts", label: "Контакты" },
];

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "relative px-3 py-2 text-sm tracking-wide transition",
          "text-slate-700 hover:text-slate-900",
          isActive ? "text-slate-900" : "",
        ].join(" ")
      }
    >
      <span className="relative z-10">{label}</span>
      <span className={styles.navGlow} />
    </NavLink>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="glass-strong mt-3 flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3"
            aria-label="Перейти на главную"
          >
            <span className={styles.logoMark}>
              <img src={logo} alt="AvtoNōmera VIP" className={styles.logoImg} />
            </span>
            <div className="leading-tight">
                <div className="font-display text-lg tracking-tight">
                AvtoNōmera VIP
              </div>
                <div className="text-xs text-slate-600">
                Москва и Московская область
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((i) => (
              <NavItem key={i.label} to={i.to} label={i.label} />
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="tel:+79099686474"
                className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 transition hover:bg-slate-50 sm:flex"
            >
                <Phone className="h-4 w-4 text-brand-600" />
              +7 (909) 968‑64‑74
            </a>

            <div className="flex items-center gap-2">
              <a
                className={styles.iconBtn}
                href="https://wa.me/79099686474"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                className={styles.iconBtn}
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <button
                className={styles.iconBtn}
                onClick={() =>
                  navigate(
                    location.pathname === "/favorites" ? "/" : "/favorites"
                  )
                }
                aria-label="Избранное"
                type="button"
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="glass mt-2 flex items-center justify-between gap-2 px-3 py-2 lg:hidden">
          <div className="flex flex-wrap gap-1">
            {nav.map((i) => (
              <NavLink
                key={i.label}
                to={i.to}
                className={({ isActive }) =>
                  [
                    "rounded-full px-3 py-2 text-xs transition",
                    isActive
                      ? "bg-brand-600 text-white"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {i.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

