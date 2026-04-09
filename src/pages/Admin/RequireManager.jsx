import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../state/authState";

export default function RequireManager() {
  const { session, isManager, authLoading, isSupabaseConfigured } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-800">
          Supabase не настроен. Добавьте в <code className="rounded bg-slate-200 px-1">.env.local</code> переменные{" "}
          <code className="rounded bg-slate-200 px-1">REACT_APP_SUPABASE_URL</code> и{" "}
          <code className="rounded bg-slate-200 px-1">REACT_APP_SUPABASE_ANON_KEY</code>.
        </p>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-600">
        Загрузка…
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isManager) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg text-slate-900">Нет доступа</p>
        <p className="mt-2 text-sm text-slate-600">
          У этой учётной записи нет роли менеджера. Обратитесь к администратору или войдите под другим логином.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
