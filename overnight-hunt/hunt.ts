// One night of a bug hunt over a sample repository: build the brief from what changed,
// let a finder read it, let a refuter try to disprove each finding, write the morning report.
// Run: bun hunt.ts. Needs git and the claude CLI, logged in. Costs well under a dollar.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const MODEL = process.env.HUNT_MODEL ?? "claude-sonnet-5-5";
const here = import.meta.dir;
const repo = mkdtempSync(join(tmpdir(), "hunt-"));
const git = (...a: string[]) => Bun.spawnSync(["git", "-c", "user.name=hunt", "-c", "user.email=hunt@example.invalid", ...a], { cwd: repo }).stdout.toString().trim();

// The sample repository: yesterday's code, then the one change that reached main since.
git("init", "-q");
cpSync(join(here, "sample/before"), repo, { recursive: true });
git("add", "."); git("commit", "-qm", "Start");
const since = git("rev-parse", "HEAD");
cpSync(join(here, "sample/after"), repo, { recursive: true });
git("commit", "-qam", "Show the currency in the export");

// The brief: every change since the last run, each with its diff. Code, not a model.
mkdirSync(join(repo, "diffs"));
const changes = git("log", "--format=%h %s", `${since}..HEAD`).split("\n");
for (const c of changes) writeFileSync(join(repo, "diffs", `${c.split(" ")[0]}.diff`), git("show", c.split(" ")[0]!));
writeFileSync(join(repo, "brief.md"), `# What changed\n\n${changes.map((c) => `- ${c} (diffs/${c.split(" ")[0]}.diff)`).join("\n")}\n\n# Last run\n\nNothing.\n`);

// Each call is a new process with no settings, skills or hooks of the machine it runs on.
function claude(system: string, prompt: string, tools: string, extra: string[] = []) {
  const r = Bun.spawnSync(["claude", "-p", "--model", MODEL, "--safe-mode", "--setting-sources", "", "--no-session-persistence",
    "--allowed-tools", tools, "--disallowed-tools", "Agent,Task", "--system-prompt", system, "--output-format", "json", ...extra], {
    cwd: repo, stdin: new TextEncoder().encode(prompt),
  });
  return JSON.parse(r.stdout.toString() || "{}");
}

claude(readFileSync(join(here, "finder.md"), "utf8"), "Run tonight's pass.", "Read,Glob,Grep,Write", ["--max-turns", "30"]);

// A night with no findings file is broken, not quiet. Say so, and fail.
const file = join(repo, "findings.json");
if (!existsSync(file)) {
  console.log("BROKEN: the finder wrote no findings.json, so nothing is known about this night.");
  process.exit(1);
}
type Finding = { title: string; severity: string; evidence: { file: string; line: number } };
const { screened, findings } = JSON.parse(readFileSync(file, "utf8")) as { screened: string[]; findings: Finding[] };
console.log(`Read ${screened.length} of ${changes.length} change(s). The finder raised ${findings.length} finding(s).`);
if (findings.length === 0) console.log("A quiet night: everything that changed was read, and nothing was found.");

// The refuter: a fresh session per finding, which never sees the finder's reasoning.
const VERDICT = { type: "object", properties: { verdict: { enum: ["confirmed", "refuted", "could not try"] }, why: { type: "string" } }, required: ["verdict", "why"] };
for (const f of findings) {
  const claim = `${f.title}\nSeverity: ${f.severity}\nEvidence: ${f.evidence.file}:${f.evidence.line}`;
  const { verdict, why } = claude(readFileSync(join(here, "refuter.md"), "utf8"), claim, "Read,Glob,Grep", ["--json-schema", JSON.stringify(VERDICT)]).structured_output ?? { verdict: "could not try", why: "no reply" };
  const label = verdict === "confirmed" ? "REPORT" : verdict === "refuted" ? "dropped" : "held";
  console.log(`\n${label}: ${f.title} (${f.severity}, ${f.evidence.file}:${f.evidence.line})\n  refuter, ${verdict}: ${why}`);
}
rmSync(repo, { recursive: true, force: true });
