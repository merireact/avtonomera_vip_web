/**
 * Оставляет первое вхождение каждого id (или номера, если id нет).
 * Защищает списки и ключи React от дубликатов в данных.
 */
export function dedupePlateRows(rows) {
  const seen = new Set();
  return rows.filter((n) => {
    const key = n.id != null && n.id !== "" ? String(n.id) : String(n.plate ?? "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
