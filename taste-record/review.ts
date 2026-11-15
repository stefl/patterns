// Load the record, then test every element of a generated screen against it: chosen or defaulted?
// Run: bun review.ts card.html. Needs the claude CLI, logged in. Costs a few cents.
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const read = (f: string) => readFileSync(join(import.meta.dir, f), "utf8");
// What the agent is given: the instruction, then the record. Observations are not rules, so they stay out.
const system = [read("review.md"), read("TASTE.md"), read("open-register.md")].join("\n\n");
const ELEMENTS = { type: "object", properties: { elements: { type: "array", items: { type: "object", properties: {
  element: { type: "string" }, verdict: { enum: ["chosen", "defaulted", "breaks a rejection", "open tension"] },
  rule: { type: "string" }, instead: { type: "string" } }, required: ["element", "verdict"] } } }, required: ["elements"] };

const cwd = mkdtempSync(join(tmpdir(), "taste-"));
const r = Bun.spawnSync(["claude", "-p", "--model", process.env.TASTE_MODEL ?? "claude-sonnet-5-5", "--safe-mode", "--setting-sources", "",
  "--tools", "", "--no-session-persistence", "--system-prompt", system, "--json-schema", JSON.stringify(ELEMENTS), "--output-format", "json"],
  { cwd, stdin: new TextEncoder().encode(`The screen:\n\n${readFileSync(process.argv[2] ?? "card.html", "utf8")}`) });
rmSync(cwd, { recursive: true, force: true });
const { elements } = JSON.parse(r.stdout.toString()).structured_output as { elements: { element: string; verdict: string; rule?: string; instead?: string }[] };
for (const e of elements) console.log(`${e.verdict}: ${e.element}${e.rule ? `\n  rule: ${e.rule}` : ""}${e.instead ? `\n  instead: ${e.instead}` : ""}`);
