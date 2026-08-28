import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/authState";

const tabClass = ({ isActive }) =>
  [
    "shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition",
    isActive ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-slate-100",
  ].join(" ");

export default function AdminLayout() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <div className="min-h-[100dvh] bg-slate-100 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <div className="font-display text-lg text-slate-900">Админка</div>
            <div className="text-xs text-slate-500">Avtonomera Vip</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn-ghost px-4 py-2 text-sm"
              onClick={() => navigate("/")}
            >
              На сайт
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50"
              onClick={() => signOut().then(() => navigate("/admin/login"))}
            >
              Выйти
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 [-webkit-overflow-scrolling:touch]">
          <NavLink to="/admin/plates" className={tabClass} end>
            Номера
          </NavLink>
          <NavLink to="/admin/reviews" className={tabClass}>
            Отзывы
          </NavLink>
          <NavLink to="/admin/requests" className={tabClass}>
            Заявки
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
