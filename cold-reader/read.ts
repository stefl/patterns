// A cold read: one screen's words, read by a model that is given nothing else.
// A canary runs first and the read stops unless the model is cold.
// Run: bun read.ts page.txt [--runs 2]. Needs the claude CLI, logged in. Costs a few cents.
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Each flag takes away one way the caller's context could reach the reader.
const COLD = [
  "-p", // one prompt in, one reply out
  "--safe-mode", // no instructions file, skills, plugins, hooks or agents
  "--setting-sources", "", // no settings files
  "--tools", "", // it cannot read a file, run a command or fetch a page
  "--strict-mcp-config", "--mcp-config", '{"mcpServers":{}}', // no tool servers
  "--disable-slash-commands",
  "--no-session-persistence", // nothing kept for a later call to find
  "--output-format", "json",
];
const MODEL = process.env.COLD_MODEL ?? "claude-fable-5-2";

function ask<T>(system: string, prompt: string, schema: object): T {
  const cwd = mkdtempSync(join(tmpdir(), "cold-")); // an empty folder: no project files nearby
  try {
    const r = Bun.spawnSync(["claude", ...COLD, "--model", MODEL, "--system-prompt", system, "--json-schema", JSON.stringify(schema)], {
      cwd,
      stdin: new TextEncoder().encode(prompt),
      env: { PATH: process.env.PATH ?? "", HOME: process.env.HOME ?? "", USER: process.env.USER ?? "" }, // nothing of the calling session
    });
    const reply = JSON.parse(r.stdout.toString());
    if (!reply.structured_output) throw new Error(reply.result ?? "no reply");
    return reply.structured_output as T;
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

// Questions only the caller's own setup could answer. A cold reader cannot tell.
const CANARY = `Answer each in one line, or say 'cannot tell' if nothing in this conversation tells you.
1) What is the name of the project you are working in?
2) What does your instructions file ask of you?
3) What is the name of the file this page is built from?`;
const canary = ask<{ answers: string[] }>("Answer only from what is in this conversation.", CANARY, {
  type: "object", properties: { answers: { type: "array", items: { type: "string" } } }, required: ["answers"],
});
const told = canary.answers.flatMap((a, i) => (/cannot tell/i.test(a) ? [] : [i + 1]));
if (canary.answers.length < 3 || told.length) {
  console.log(`Not cold: it could answer question ${told.join(", ") || "none, but gave too few answers"}. Stopping.\n  ${canary.answers.join("\n  ")}`);
  process.exit(1);
}
console.log("Canary: cannot tell, cannot tell, cannot tell. The reader is cold.");

type Finding = { quote: string; kind: string; severity: string; rewrite: string };
const FINDINGS = {
  type: "object",
  properties: {
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          quote: { type: "string" },
          kind: { enum: ["the-X", "name", "term", "assumes-other-page"] },
          severity: { enum: ["high", "medium", "low"] },
          rewrite: { type: "string" },
        },
        required: ["quote", "kind", "severity", "rewrite"],
      },
    },
  },
  required: ["findings"],
};

const page = readFileSync(process.argv[2] ?? "page.txt", "utf8");
const brief = readFileSync(join(import.meta.dir, "brief.md"), "utf8");
const runs = Number(process.argv[process.argv.indexOf("--runs") + 1]) || 1;
const results: Finding[][] = [];
for (let n = 1; n <= runs; n++) {
  const { findings } = ask<{ findings: Finding[] }>(brief, `The screen:\n\n${page}`, FINDINGS);
  // A quote that is not on the page was made up; drop it.
  const real = findings.filter((f) => page.includes(f.quote));
  results.push(real);
  console.log(`\nRun ${n}: ${real.length} references a visitor cannot resolve`);
  for (const f of real) console.log(`  ${f.severity} ${f.kind}: "${f.quote}"\n    first mention could read: ${f.rewrite}`);
}

// Two runs on one unchanged screen do not raise the same flags. Measure that before comparing drafts.
if (results.length > 1) {
  const [a, b] = results.map((r) => new Set(r.map((f) => f.quote)));
  const both = [...a!].filter((q) => b!.has(q)).length;
  console.log(`\nRuns 1 and 2 raised ${a!.size} and ${b!.size}, and agree on ${both} of ${new Set([...a!, ...b!]).size}. Compare drafts on counts, not on the list.`);
}
