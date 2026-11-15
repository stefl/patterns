// A model scores a long list of names but never rejects one, and a model's verdict on a
// name counts only as far as its cited links survive being fetched. Both models are real.
// Run: bun scores.ts. Needs the claude CLI, logged in, and a network. Costs well under a dollar.
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function claude<T>(model: string, system: string, prompt: string, schema: object, tools = ""): T | null {
  const cwd = mkdtempSync(join(tmpdir(), "names-"));
  try {
    const r = Bun.spawnSync(["claude", "-p", "--model", model, "--safe-mode", "--setting-sources", "", "--no-session-persistence",
      "--tools", tools, ...(tools ? ["--allowed-tools", tools] : []), "--system-prompt", system,
      "--json-schema", JSON.stringify(schema), "--output-format", "json"], { cwd, stdin: new TextEncoder().encode(prompt) });
    return (JSON.parse(r.stdout.toString() || "{}").structured_output as T) ?? null; // null: the check did not run
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}
const prompt = (f: string) => readFileSync(join(import.meta.dir, f), "utf8");

// 1. The long list. Two names were rejected earlier by a person, with a reason.
type Row = { name: string; score?: number; rejected?: "low-score" | "person" };
const names = ["Talvo", "Merin", "Quessa", "Brolle", "Fennic", "Orvane", "Lusk", "Pellar", "Trova", "Cindral",
  "Vossa", "Hembry", "Ardel", "Nimbre", "Sollen", "Kavra", "Druell", "Ostra", "Pimley", "Wendal"];
const fresh = (): Row[] => names.map((name) => ({ name, rejected: name === "Hembry" || name === "Wendal" ? "person" : undefined }));
const scored = claude<{ scores: { name: string; score: number }[] }>("claude-sonnet-5-5", prompt("score.md"), `Score these names: ${names.join(", ")}`,
  { type: "object", properties: { scores: { type: "array", items: { type: "object", properties: { name: { type: "string" }, score: { type: "integer" } }, required: ["name", "score"] } } }, required: ["scores"] });
const reply = new Map((scored?.scores ?? []).map((s) => [s.name, s.score]));

// The old form: score, then reject everything under 6. The undo reads the reason on each row,
// so it restores the scorer's rejections and nobody else's.
const old = fresh();
for (const r of old) { r.score = reply.get(r.name) ?? 0; if (r.score < 6 && !r.rejected) r.rejected = "low-score"; }
const byMachine = old.filter((r) => r.rejected === "low-score").length;
for (const r of old) if (r.rejected === "low-score") r.rejected = undefined;
console.log(`Old form: the scorer rejected ${byMachine} of ${names.length}. The undo restored ${byMachine}; still rejected: ${old.filter((r) => r.rejected).map((r) => r.name).join(", ")}`);

// The settled form: the scorer writes one field. A missing score is a middle 5, and the name stays.
const settled = fresh();
for (const r of settled) r.score = reply.get(r.name) ?? 5;
const top = [...settled].sort((a, b) => b.score! - a.score!).slice(0, 3).map((r) => `${r.name} ${r.score}`);
console.log(`Settled form: ${settled.length} scored, ${names.filter((n) => !reply.has(n)).length} missing and given 5, 0 removed. Highest: ${top.join(", ")}`);

// 2. Clearing the top name. Two models search the web; every link either gives is fetched.
type Risk = "low" | "medium" | "high" | "blocker";
type Clash = { kind: "company" | "product" | "trademark" | "other"; severity: Risk; link: string };
const RANK: Risk[] = ["low", "medium", "high", "blocker"];
const worst = (rs: Risk[]): Risk => rs.reduce((a, b) => (RANK.indexOf(b) > RANK.indexOf(a) ? b : a), "low");
const CLEAR = { type: "object", properties: { risk: { enum: RANK }, clashes: { type: "array", items: { type: "object",
  properties: { kind: { enum: ["company", "product", "trademark", "other"] }, severity: { enum: RANK }, link: { type: "string" } }, required: ["kind", "severity", "link"] } } }, required: ["risk", "clashes"] };

async function status(url: string): Promise<number> {
  try { return (await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(10_000) })).status; } catch { return 0; } // 0: no such host
}

const name = top[0]!.split(" ")[0]!;
console.log(`\nClearing ${name}:`);
const readings = ["claude-sonnet-5-5", "claude-haiku-5-5"].map((m) => ({ m, a: claude<{ risk: Risk; clashes: Clash[] }>(m, prompt("clear.md"), `The name: ${name}`, CLEAR, "WebSearch") }));
const rebuilt: Risk[] = [];
let unchecked = 0;
// What each clash is, but not its name: the names are real businesses found by the search.
for (const { m, a } of readings) {
  if (!a) { unchecked++; console.log(`  ${m}: did not run`); continue; }
  const kept: Clash[] = [];
  for (const c of a.clashes) {
    const s = await status(c.link);
    if (s === 404 || s === 410 || s === 0) console.log(`  ${m}: dropped a ${c.severity} ${c.kind} clash, its link gave ${s || "no such host"}`);
    else { kept.push(c); console.log(`  ${m}: kept a ${c.severity} ${c.kind} clash${s >= 400 ? `, page could not be read (${s})` : ""}`); }
  }
  // The verdict comes from what survived, not from the model's own summary at the top.
  const own = worst(kept.map((c) => c.severity));
  rebuilt.push(...kept.map((c) => c.severity));
  console.log(`  ${m} said ${a.risk}; from its surviving links, ${kept.length ? own : "low, nothing survived"}`);
}
// Two models: the worse reading wins. A check that did not run is not a clean check.
const cap = Math.max(50, 100 - 3 * unchecked);
const score = Math.min(cap, 100 - { low: 0, medium: 15, high: 35, blocker: 60 }[worst(rebuilt)]);
console.log(`  overall ${worst(rebuilt)}, score ${score}, best possible ${cap}`);
