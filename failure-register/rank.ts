// Groups failed agent commands into kinds, ranks them, and reports a failure
// after its recorded fix as a regression. Run: bun rank.ts
type Failure = { at: string; repo: string; command: string; error: string };

const log: Failure[] = [
  { at: "2026-11-01T09:12", repo: "shop", command: "cat /tmp/run-8812/out.log", error: "No such file: /tmp/run-8812/out.log" },
  { at: "2026-11-01T14:40", repo: "shop", command: "cat /tmp/run-1093/out.log", error: "No such file: /tmp/run-1093/out.log" },
  { at: "2026-11-02T10:03", repo: "shop", command: "cat /tmp/run-5521/out.log", error: "No such file: /tmp/run-5521/out.log" },
  { at: "2026-11-02T16:20", repo: "blog", command: "cat /tmp/run-7730/out.log", error: "No such file: /tmp/run-7730/out.log" },
  { at: "2026-11-03T08:55", repo: "shop", command: "npm test", error: "npm: command not found" },
  { at: "2026-11-03T11:30", repo: "shop", command: "npm test -- cart", error: "npm: command not found" },
  { at: "2026-11-04T09:00", repo: "shop", command: "git push origin feat-41", error: "rejected: fetch first" },
  { at: "2026-11-05T15:15", repo: "shop", command: "cat /tmp/run-3301/out.log", error: "No such file: /tmp/run-3301/out.log" },
  { at: "2026-11-05T17:45", repo: "blog", command: "cat /tmp/run-6610/out.log", error: "No such file: /tmp/run-6610/out.log" },
];

// A fix, with when it landed and where.
const register = [{ kind: "No such file: <path>", repo: "shop", fixedAt: "2026-11-03T00:00", fix: "write logs inside the repo" }];

// Paths, numbers and quoted values become placeholders, so one cause gives one kind.
const kind = (f: Failure) =>
  f.error.replace(/\/[\w.\/-]+/g, "<path>").replace(/\b\d+\b/g, "<n>").replace(/"[^"]*"/g, "<value>");

const ranked = new Map<string, { counted: number; suppressed: number }>();
const regressions: string[] = [];
for (const f of log) {
  const k = kind(f);
  const row = ranked.get(k) ?? { counted: 0, suppressed: 0 };
  const fix = register.find((r) => r.kind === k && r.repo === f.repo);
  if (fix && f.at < fix.fixedAt) row.suppressed++; // before the fix: shown, not ranked
  else row.counted++;
  if (fix && f.at >= fix.fixedAt) regressions.push(`${f.at} ${f.repo}: "${k}" came back after "${fix.fix}"`);
  ranked.set(k, row);
}

for (const [k, r] of [...ranked].sort((a, b) => b[1].counted - a[1].counted))
  console.log(`${String(r.counted).padStart(2)} ${k}${r.suppressed ? `  (${r.suppressed} before its fix, not counted)` : ""}`);
console.log(regressions.length ? `\nRegressions:\n  ${regressions.join("\n  ")}` : "\nNo regressions.");
