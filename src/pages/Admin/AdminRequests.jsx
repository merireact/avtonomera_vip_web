import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function formatMethods(m) {
  if (!m || typeof m !== "object") return "—";
  const parts = [];
  if (m.call) parts.push("Звонок");
  if (m.whatsapp) parts.push("WhatsApp");
  if (m.telegram) parts.push("Telegram");
  return parts.length ? parts.join(", ") : "—";
}

export default function AdminRequests() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setErr(null);
    const { data, error } = await supabase
      .from("sell_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setErr(error.message);
    else setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id, status) {
    if (!supabase) return;
    const { error } = await supabase.from("sell_requests").update({ status }).eq("id", id);
    if (error) {
      setErr(error.message);
      return;
    }
    await load();
  }

  async function remove(id) {
    if (!supabase || !window.confirm("Удалить заявку?")) return;
    const { error } = await supabase.from("sell_requests").delete().eq("id", id);
    if (error) {
      setErr(error.message);
      return;
    }
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-slate-900">Заявки «Продать номер»</h1>
      <p className="mt-1 text-sm text-slate-600">Заявки с формы на сайте.</p>

      {err ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {err}
        </div>
      ) : null}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-600">Загрузка…</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-slate-600">Пока нет заявок.</div>
        ) : (
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Номер</th>
                <th className="px-4 py-3">Связь</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {r.created_at
                      ? new Date(r.created_at).toLocaleString("ru-RU", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3 font-mono">{r.phone}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.plate || "—"}</td>
                  <td className="px-4 py-3 text-xs">{formatMethods(r.contact_methods)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                      onChange={(e) => setStatus(r.id, e.target.value)}
                    >
                      <option value="new">Новая</option>
                      <option value="done">Обработана</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="text-xs text-rose-700 hover:underline"
                      onClick={() => remove(r.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
