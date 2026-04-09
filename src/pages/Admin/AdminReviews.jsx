import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminReviews() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setErr(null);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setErr(error.message);
    else setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addSubmit(e) {
    e.preventDefault();
    if (!supabase || !name.trim() || !text.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("reviews").insert({
      author_name: name.trim(),
      text: text.trim(),
    });
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setName("");
    setText("");
    await load();
  }

  async function remove(id) {
    if (!supabase || !window.confirm("Удалить отзыв?")) return;
    setSaving(true);
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-slate-900">Отзывы</h1>
      <p className="mt-1 text-sm text-slate-600">Публикация и удаление отзывов на странице сайта.</p>

      {err ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {err}
        </div>
      ) : null}

      <form
        className="mt-8 grid max-w-xl gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={addSubmit}
      >
        <h2 className="text-sm font-medium text-slate-800">Добавить отзыв</h2>
        <label className="grid gap-1">
          <span className="text-xs text-slate-600">Имя</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-slate-600">Текст</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>
        <button type="submit" className="btn-luxe w-max px-6 py-3 disabled:opacity-50" disabled={saving}>
          Добавить
        </button>
      </form>

      <div className="mt-10 space-y-4">
        {loading ? (
          <div className="text-slate-600">Загрузка…</div>
        ) : (
          rows.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-slate-900">{r.author_name}</div>
                  <p className="mt-2 text-sm text-slate-700">{r.text}</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-sm text-rose-700 hover:underline"
                  onClick={() => remove(r.id)}
                >
                  Удалить
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
