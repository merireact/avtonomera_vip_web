import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const TABS = [
  { id: "sell", label: "Продать номер", table: "sell_requests" },
  { id: "selection", label: "Подбор номера", table: "selection_requests" },
  { id: "buy", label: "Купить номер", table: "buy_requests" },
];

function formatMethods(m) {
  if (!m || typeof m !== "object") return "—";
  const parts = [];
  if (m.call) parts.push("Звонок");
  if (m.whatsapp) parts.push("WhatsApp");
  if (m.telegram) parts.push("Telegram");
  if (m.max) parts.push("Max");
  return parts.length ? parts.join(", ") : "—";
}

function truncate(s, n = 80) {
  if (!s || typeof s !== "string") return "—";
  const t = s.trim();
  return t.length <= n ? t : `${t.slice(0, n)}…`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function StatusSelect({ value, onChange }) {
  return (
    <select
      value={value}
      className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs sm:w-auto"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="new">Новая</option>
      <option value="done">Обработана</option>
    </select>
  );
}

export default function AdminRequests() {
  const [tab, setTab] = useState("sell");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const currentTable = TABS.find((t) => t.id === tab)?.table || "sell_requests";

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setErr(null);
    const { data, error } = await supabase
      .from(currentTable)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setErr(error.message);
    else setRows(data || []);
    setLoading(false);
  }, [currentTable]);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id, status) {
    if (!supabase) return;
    const { error } = await supabase.from(currentTable).update({ status }).eq("id", id);
    if (error) {
      setErr(error.message);
      return;
    }
    await load();
  }

  async function remove(id) {
    if (!supabase || !window.confirm("Удалить заявку?")) return;
    const { error } = await supabase.from(currentTable).delete().eq("id", id);
    if (error) {
      setErr(error.message);
      return;
    }
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-slate-900">Заявки с сайта</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-600">
        Продажа номера, подбор по запросу и покупка конкретного номера из каталога. Новые заявки
        отмечайте как обработанные после ответа клиенту.
      </p>

      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-slate-200 pb-1 [-webkit-overflow-scrolling:touch]">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={[
              "shrink-0 rounded-t-lg px-4 py-2 text-sm font-medium transition",
              tab === t.id
                ? "bg-white text-brand-800 ring-1 ring-slate-200 ring-b-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            ].join(" ")}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {err ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {err}
        </div>
      ) : null}

      {loading || rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm md:hidden">
          {loading ? "Загрузка…" : "Пока нет заявок в этой категории."}
        </div>
      ) : (
        <div className="mt-6 grid gap-3 md:hidden">
          {rows.map((r) => (
            <article key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-slate-500">{formatDate(r.created_at)}</div>
              {tab === "buy" ? (
                <div className="mt-1 font-mono text-base font-semibold text-slate-900">{r.plate}</div>
              ) : null}
              <div className="mt-2 text-sm font-medium text-slate-900">{r.name || "—"}</div>
              <a href={r.phone ? `tel:+${String(r.phone).replace(/\D+/g, "")}` : undefined} className="mt-1 block font-mono text-sm text-brand-800">
                {r.phone || "—"}
              </a>
              {tab === "sell" ? (
                <div className="mt-2 font-mono text-xs text-slate-700">{r.plate || "—"}</div>
              ) : null}
              {tab === "selection" ? (
                <p className="mt-2 text-xs leading-relaxed text-slate-700">{r.wish || "—"}</p>
              ) : null}
              {tab === "buy" && r.note ? (
                <p className="mt-2 text-xs leading-relaxed text-slate-700">{r.note}</p>
              ) : null}
              <div className="mt-2 text-xs text-slate-500">{formatMethods(r.contact_methods)}</div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <StatusSelect value={r.status} onChange={(status) => setStatus(r.id, status)} />
                <button
                  type="button"
                  className="text-xs text-rose-700 hover:underline"
                  onClick={() => remove(r.id)}
                >
                  Удалить
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        {loading ? (
          <div className="p-8 text-center text-slate-600">Загрузка…</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-slate-600">Пока нет заявок в этой категории.</div>
        ) : tab === "sell" ? (
          <table className="w-full min-w-[880px] text-left text-sm">
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
        ) : tab === "selection" ? (
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Пожелания по номеру</th>
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
                  <td className="px-4 py-3">{r.name || "—"}</td>
                  <td className="px-4 py-3 font-mono">{r.phone}</td>
                  <td className="max-w-md px-4 py-3 text-xs text-slate-700" title={r.wish || ""}>
                    {truncate(r.wish, 120)}
                  </td>
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
        ) : (
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Госномер</th>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Комментарий</th>
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
                  <td className="px-4 py-3 font-mono font-medium">{r.plate}</td>
                  <td className="px-4 py-3">{r.name || "—"}</td>
                  <td className="px-4 py-3 font-mono">{r.phone}</td>
                  <td className="max-w-xs px-4 py-3 text-xs text-slate-700" title={r.note || ""}>
                    {truncate(r.note, 100)}
                  </td>
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
