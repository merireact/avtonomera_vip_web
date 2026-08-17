import { useState } from "react";
import { useSiteGate } from "../../state/siteGateState";
import logo from "../../assets/logo.png";

export default function SiteGate() {
  const { unlock } = useSiteGate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const ok = await unlock(login, password);
    setSubmitting(false);
    if (!ok) {
      setError("Неверный логин или пароль");
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col justify-center bg-white px-4 py-10 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <img src={logo} alt="" className="h-full w-full object-contain" />
          </span>
          <div>
            <div className="font-display text-xl tracking-tight text-slate-900">Avtonomera Vip</div>
            <div className="text-xs text-slate-500">Закрытый доступ</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="font-display text-xl text-slate-900">Вход на сайт</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Введите логин и пароль, чтобы открыть каталог.
          </p>

          <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
            <label className="grid gap-2">
              <span className="text-xs text-slate-600">Логин</span>
              <input
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none focus:border-slate-400 sm:text-sm"
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none focus:border-slate-400 sm:text-sm"
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
    </div>
  );
}
