import type { Row } from "./load";

// Rows whose date is between from and to, inclusive, one line each, with the currency.
export function exportRows(rows: Row[], from: string, to: string, currency = "GBP"): string[] {
  const kept = rows.filter((r) => r.date >= from && r.date <= from);
  return kept.map((r) => `${r.date},${r.total!.toFixed(2)} ${currency}`);
}
