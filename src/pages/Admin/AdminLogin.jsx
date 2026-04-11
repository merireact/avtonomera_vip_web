import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../state/authState";

function BackToSiteLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-brand-700"
    >
      <span aria-hidden>←</span>
      Вернуться на сайт
    </Link>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { session, isManager, authLoading, isSupabaseConfigured: configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!configured) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10">
        <div className="mb-6">
          <BackToSiteLink />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="font-display text-xl text-slate-900">Вход для сотрудников</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Сейчас не заданы переменные Supabase, поэтому форма входа недоступна. Без них приложение не
            может подключиться к базе и авторизации.
          </p>
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <p className="font-medium">Локально</p>
            <p className="mt-1 text-amber-900/95">
              Скопируйте <code className="rounded bg-white/80 px-1">.env.example</code> в{" "}
              <code className="rounded bg-white/80 px-1">.env.local</code> и укажите{" "}
              <code className="rounded bg-white/80 px-1">REACT_APP_SUPABASE_URL</code> и{" "}
              <code className="rounded bg-white/80 px-1">REACT_APP_SUPABASE_ANON_KEY</code> из Supabase →
              Project Settings → API. Перезапустите <code className="rounded bg-white/80 px-1">npm start</code>.
            </p>
            <p className="mt-4 font-medium">Продакшен (Vercel и др.)</p>
            <p className="mt-1 text-amber-900/95">
              В панели проекта откройте <strong>Settings → Environment Variables</strong> и добавьте те же
              две переменные для окружения <strong>Production</strong> (и при необходимости Preview). Затем
              выполните <strong>новый деплой</strong>: Create React App подставляет их на этапе{" "}
              <code className="rounded bg-white/80 px-1">npm run build</code>, поэтому после изменения
              переменных нужна пересборка.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!authLoading && session && isManager) {
    return <Navigate to="/admin/plates" replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!supabase) return;
    setSubmitting(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate("/admin/plates", { replace: true });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6">
        <BackToSiteLink />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="font-display text-xl text-slate-900">Вход для сотрудников</h1>
        <p className="mt-2 text-sm text-slate-600">Только для менеджеров с учётной записью.</p>

        <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
          <label className="grid gap-2">
            <span className="text-xs text-slate-600">Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs text-slate-600">Пароль</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              required
            />
          </label>
          {error ? <div className="text-sm text-rose-700">{error}</div> : null}
          <button
            type="submit"
            disabled={submitting}
            className="btn-luxe mt-2 w-full py-3 disabled:opacity-60"
          >
            {submitting ? "Вход…" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
