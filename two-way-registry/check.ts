// A registry of environment variables, checked against the code in both
// directions. Run: bun check.ts
type Row = { name: string; purpose: string };
type Exception = { file: string; name: string; reason: string };

const registry: Row[] = [
  { name: "DATABASE_URL", purpose: "Where the app's database lives." },
  { name: "MAIL_FROM", purpose: "The sender address on outgoing email." },
];
const exceptions: Exception[] = [{ file: "test/setup.ts", name: "TEST_SEED", reason: "Only the test runner sets this." }];

const code: Record<string, string> = {
  "src/db.ts": "const url = process.env.DATABASE_URL;",
  "src/mail.ts": "const from = process.env.MAIL_FROM;",
  "test/setup.ts": "const seed = process.env.TEST_SEED;",
};

const render = (rows: Row[]) => rows.map((r) => `- ${r.name}: ${r.purpose}`).join("\n");

function check(code: Record<string, string>, rows: Row[], excs: Exception[], envDoc: string): string[] {
  const reads = Object.entries(code).flatMap(([file, src]) =>
    [...src.matchAll(/process\.env\.(\w+)/g)].map((m) => ({ file, name: m[1] })));
  const problems: string[] = [];
  if (Object.keys(code).length === 0) problems.push("No source files found, so nothing was checked.");
  for (const r of reads) {
    const excused = excs.some((e) => e.file === r.file && e.name === r.name);
    if (!excused && !rows.some((row) => row.name === r.name)) problems.push(`${r.file} reads ${r.name}, which has no row. Add one to the registry.`);
  }
  for (const row of rows)
    if (!reads.some((r) => r.name === row.name)) problems.push(`${row.name} is in the registry but nothing reads it. Delete the row.`);
  for (const e of excs) {
    if (!e.reason.trim()) problems.push(`The exception for ${e.name} in ${e.file} has no reason. Write one.`);
    if (!reads.some((r) => r.file === e.file && r.name === e.name)) problems.push(`${e.file} no longer reads ${e.name}. Delete the exception.`);
  }
  if (envDoc !== render(rows)) problems.push("ENV.md differs from the registry. Regenerate it; do not edit it by hand.");
  return problems;
}

const doc = render(registry);
const runs: [string, string[]][] = [
  ["As it stands", check(code, registry, exceptions, doc)],
  ["A new read with no row", check({ ...code, "src/pay.ts": "process.env.PAYMENTS_KEY" }, registry, exceptions, doc)],
  ["The mail code deleted", check({ "src/db.ts": code["src/db.ts"], "test/setup.ts": code["test/setup.ts"] }, registry, exceptions, doc)],
  ["The test seed removed", check({ "src/db.ts": code["src/db.ts"], "src/mail.ts": code["src/mail.ts"] }, registry, exceptions, doc)],
  ["An exception with no reason", check(code, registry, [{ ...exceptions[0], reason: "" }], doc)],
  ["ENV.md edited by hand", check(code, registry, exceptions, doc + "\n- DEBUG: turns on logging")],
  ["The scan found no files", check({}, [], [], "")],
];
for (const [name, problems] of runs) console.log(`${name}:\n  ${problems.length ? problems.join("\n  ") : "registry ok"}`);
