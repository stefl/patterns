// Every factual sentence on a page has a ledger row with its evidence.
// Run: bun check.ts
type Evidence =
  | { kind: "code"; file: string; mustContain: string }
  | { kind: "command"; run: string; result: string; on: string }
  | { kind: "person"; who: string; on: string };
type Claim = { sentence: string; evidence: Evidence };

const MAX_AGE_DAYS = 14; // a command's result goes stale

const page = `Sessions time out after 30 minutes of inactivity.
Exports are written as CSV.
The nightly backup completed every night this month.`;

const code: Record<string, string> = {
  "src/session.ts": "export const IDLE_TIMEOUT_MINUTES = 30;",
  "src/export.ts": "export const format = 'csv';",
};

const ledger: Claim[] = [
  { sentence: "Sessions time out after 30 minutes of inactivity.", evidence: { kind: "code", file: "src/session.ts", mustContain: "IDLE_TIMEOUT_MINUTES = 30" } },
  { sentence: "Exports are written as CSV.", evidence: { kind: "code", file: "src/export.ts", mustContain: "'csv'" } },
  { sentence: "The nightly backup completed every night this month.", evidence: { kind: "command", run: "backup-report --month", result: "30 of 30 succeeded", on: "2026-10-30" } },
];

function check(page: string, code: Record<string, string>, ledger: Claim[], today: string): string[] {
  const problems: string[] = [];
  for (const c of ledger) {
    if (!page.includes(c.sentence)) problems.push(`"${c.sentence}" is no longer on the page. Update its row, or delete it.`);
    const e = c.evidence;
    if (e.kind === "code" && !(code[e.file] ?? "").includes(e.mustContain))
      problems.push(`"${c.sentence}": ${e.file} no longer contains ${e.mustContain}. Check the sentence is still true.`);
    if (e.kind !== "code") {
      const age = (Date.parse(today) - Date.parse(e.on)) / 86_400_000;
      if (age > MAX_AGE_DAYS) problems.push(`"${c.sentence}": its evidence is ${age} days old. Run it again and record the result.`);
    }
  }
  return problems;
}

const report = (name: string, p: string[]) => console.log(`${name}:\n  ${p.length ? p.join("\n  ") : "ledger ok"}`);
report("On 2026-11-05", check(page, code, ledger, "2026-11-05"));
report("The timeout changed to 15 in the code", check(page, { ...code, "src/session.ts": "export const IDLE_TIMEOUT_MINUTES = 15;" }, ledger, "2026-11-05"));
report("Someone rewrote a sentence", check(page.replace("as CSV", "as CSV or JSON"), code, ledger, "2026-11-05"));
report("On 2026-11-20", check(page, code, ledger, "2026-11-20"));
