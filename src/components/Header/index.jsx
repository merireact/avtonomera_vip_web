import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Menu, MessageCircle, Phone, Send, X } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
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
              <img src={logo} alt="AvtoNomera VIP" className={styles.logoImg} />
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg tracking-tight">AvtoNomera VIP</div>
              <div className="hidden text-xs text-slate-600 lg:block">
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
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 transition hover:bg-slate-50 lg:flex"
            >
              <Phone className="h-4 w-4 text-brand-600" />
              +7 (909) 968‑64‑74
            </a>

            <div className="hidden items-center gap-2 lg:flex">
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
                  navigate(location.pathname === "/favorites" ? "/" : "/favorites")
                }
                aria-label="Избранное"
                type="button"
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              id="mobile-menu-trigger"
              className={[
                "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white",
                "text-slate-800 transition hover:bg-slate-50 lg:hidden",
              ].join(" ")}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu-panel"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>
    </motion.header>

    {menuOpen ? (
      <>
        <button
          type="button"
          className="fixed inset-0 z-[140] bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
          aria-label="Закрыть меню"
          onClick={() => setMenuOpen(false)}
        />
        <div
          id="mobile-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          className={[
            "fixed inset-y-0 right-0 z-[150] flex w-[min(100%,20rem)] flex-col border-l border-slate-200/80",
            "bg-white/95 shadow-[-12px_0_40px_rgba(15,23,42,.12)] backdrop-blur-md lg:hidden",
          ].join(" ")}
        >
              <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-4">
                <p
                  id="mobile-menu-title"
                  className="text-xs font-medium uppercase tracking-wider text-slate-500"
                >
                  Меню
                </p>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
                  aria-label="Закрыть меню"
                  onClick={() => setMenuOpen(false)}
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
              <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-2">
                {nav.map((i) => (
                  <NavLink
                    key={i.label}
                    to={i.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        "rounded-xl px-4 py-3.5 text-sm font-medium tracking-wide transition",
                        isActive
                          ? "bg-brand-600 text-white"
                          : "text-slate-800 hover:bg-slate-100",
                      ].join(" ")
                    }
                  >
                    {i.label}
                  </NavLink>
                ))}
              </nav>
              <div className="border-t border-slate-200/80 px-4 py-4">
                <a
                  href="tel:+79099686474"
                  className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900"
                  onClick={() => setMenuOpen(false)}
                >
                  <Phone className="h-5 w-5 shrink-0 text-brand-600" />
                  +7 (909) 968‑64‑74
                </a>
                <p className="mb-2 text-xs text-slate-500">Связь в мессенджерах</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    className={styles.iconBtn}
                    href="https://wa.me/79099686474"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    onClick={() => setMenuOpen(false)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                  <a
                    className={styles.iconBtn}
                    href="https://t.me/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Telegram"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Send className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    aria-label="Избранное"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(location.pathname === "/favorites" ? "/" : "/favorites");
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
      </>
    ) : null}
    </>
  );
}

