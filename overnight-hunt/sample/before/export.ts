import type { Row } from "./load";

// Rows whose date is between from and to, inclusive, one line each.
export function exportRows(rows: Row[], from: string, to: string): string[] {
  const kept = rows.filter((r) => r.date >= from && r.date <= to);
  return kept.map((r) => `${r.date},${r.total}`);
}
