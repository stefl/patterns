export type Row = { date: string; total: number | null };

// Rows from the store. A row whose total is still being worked out has a null total,
// and is left out here, so nothing after this point sees one.
export function loadRows(raw: Row[]): Row[] {
  return raw.filter((r) => r.total !== null);
}
