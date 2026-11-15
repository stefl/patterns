// The part of an overnight bug hunt that needs no model: what counts as a
// finding, what gets filed, and what a quiet night means. The two agents'
// outputs are written out by hand. Run: bun morning.ts
type Finding = { id: string; says: string; cites?: { rule?: string; line?: string } };
type Verdict = { id: string; refuted: boolean; why: string };
type Night = { date: string; ran: boolean; changesRead: number; findings: Finding[]; verdicts: Verdict[] };

function morning(n: Night): string[] {
  // A run that did not happen, or read nothing, must not look like a clean night.
  if (!n.ran) return [`${n.date}: the hunt did not run. Nothing is known about this night.`];
  if (n.changesRead === 0) return [`${n.date}: the hunt ran but read no changes. Check what it was pointed at.`];
  const out: string[] = [];
  for (const f of n.findings) {
    if (!f.cites?.rule && !f.cites?.line) { out.push(`dropped ${f.id}: cites no rule and no line of code`); continue; }
    const v = n.verdicts.find((v) => v.id === f.id);
    if (!v) out.push(`held ${f.id}: no second opinion yet, so not filed`);
    else if (v.refuted) out.push(`dropped ${f.id}: the checker disproved it (${v.why})`);
    else out.push(`FILED ${f.id}: ${f.says} [${f.cites.rule ?? f.cites.line}]`);
  }
  return [`${n.date}: read ${n.changesRead} change(s), ${n.findings.length} finding(s)`, ...out.map((o) => `  ${o}`)];
}

const nights: Night[] = [
  { date: "2026-11-12", ran: true, changesRead: 4, findings: [
    { id: "F1", says: "Saving a draft clears the title field", cites: { rule: "Drafts keep every field the user typed" } },
    { id: "F2", says: "The date picker feels slow" },
    { id: "F3", says: "Export ignores the date filter", cites: { line: "src/export.ts:41" } },
    { id: "F4", says: "Prices show without a currency", cites: { rule: "Every price shows its currency" } },
  ], verdicts: [
    { id: "F1", refuted: false, why: "reproduced" },
    { id: "F3", refuted: true, why: "the filter is applied two lines later" },
  ] },
  { date: "2026-11-13", ran: true, changesRead: 3, findings: [], verdicts: [] },
  { date: "2026-11-14", ran: false, changesRead: 0, findings: [], verdicts: [] },
];
for (const n of nights) console.log(morning(n).join("\n"));
