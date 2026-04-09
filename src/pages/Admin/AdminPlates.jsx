import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useApp } from "../../state/appState";

const STATUSES = ["В наличии", "В резерве", "Продан"];

export default function AdminPlates() {
  const { refreshNumbers } = useApp();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);

  const [plate, setPlate] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("В наличии");

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setErr(null);
    const { data, error } = await supabase
      .from("plates")
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
    if (!supabase) return;
    const p = Number(String(price).replace(/\s/g, "").replace(",", "."));
    if (!plate.trim() || Number.isNaN(p) || p < 0) return;
    setSaving(true);
    const { error } = await supabase.from("plates").insert({
      plate: plate.trim(),
      price: p,
      status,
    });
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setPlate("");
    setPrice("");
    setStatus("В наличии");
    await load();
    refreshNumbers();
  }

  async function updateRow(id, patch) {
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase.from("plates").update(patch).eq("id", id);
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    await load();
    refreshNumbers();
  }

  async function removeRow(id) {
    if (!supabase || !window.confirm("Удалить этот номер?")) return;
    setSaving(true);
    const { error } = await supabase.from("plates").delete().eq("id", id);
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    await load();
    refreshNumbers();
  }

  async function onImagePick(id, file) {
    if (!supabase || !file) return;
    if (!file.type.startsWith("image/")) {
      setErr("Нужен файл изображения");
      return;
    }
    setErr(null);
    setSaving(true);
    const ext = (file.name.split(".").pop() || "jpg").slice(0, 8);
    const path = `${id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("plate-images").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (upErr) {
      setSaving(false);
      setErr(upErr.message);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("plate-images").getPublicUrl(path);
    const { error } = await supabase.from("plates").update({ image_url: publicUrl }).eq("id", id);
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    await load();
    refreshNumbers();
  }

  async function clearImage(id) {
    await updateRow(id, { image_url: null });
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-slate-900">Номера</h1>
      <p className="mt-1 text-sm text-slate-600">Добавление, редактирование и фото для витрины.</p>

      {err ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {err}
        </div>
      ) : null}

      <form
        className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={addSubmit}
      >
        <label className="grid gap-1 sm:col-span-2">
          <span className="text-xs text-slate-600">Госномер</span>
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="А777АА 77"
            required
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-slate-600">Цена (₽)</span>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="numeric"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="499000"
            required
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-slate-600">Статус</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end sm:col-span-2 lg:col-span-4">
          <button type="submit" className="btn-luxe px-6 py-3 disabled:opacity-50" disabled={saving}>
            Добавить номер
          </button>
        </div>
      </form>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-600">Загрузка…</div>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Номер</th>
                <th className="px-4 py-3">Цена</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Фото</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-mono font-medium">{r.plate}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      defaultValue={r.price}
                      className="w-28 rounded-lg border border-slate-200 px-2 py-1"
                      onBlur={(e) => {
                        const v = Number(String(e.target.value).replace(/\s/g, "").replace(",", "."));
                        if (!Number.isNaN(v) && v >= 0 && v !== Number(r.price)) {
                          updateRow(r.id, { price: v });
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={r.status}
                      className="rounded-lg border border-slate-200 px-2 py-1"
                      onChange={(e) => updateRow(r.id, { status: e.target.value })}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {r.image_url ? (
                        <img src={r.image_url} alt="" className="h-10 w-16 rounded object-cover" />
                      ) : (
                        <span className="text-xs text-slate-400">нет</span>
                      )}
                      <label className="cursor-pointer text-xs text-brand-700 hover:underline">
                        загрузить
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={saving}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            e.target.value = "";
                            if (f) onImagePick(r.id, f);
                          }}
                        />
                      </label>
                      {r.image_url ? (
                        <button
                          type="button"
                          className="text-xs text-rose-700 hover:underline"
                          onClick={() => clearImage(r.id)}
                        >
                          сбросить
                        </button>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="text-xs text-rose-700 hover:underline"
                      onClick={() => removeRow(r.id)}
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
