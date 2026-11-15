// One night of the miner over a folder of transcripts: a scheduled agent, read-only,
// writing only into its own private folder, following a brief. Nothing here judges; the agent does.
// Run: bun mine.ts. Needs the claude CLI, logged in. Costs well under a dollar.
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// The private folder: the brief and the transcripts, outside every repository.
const folder = mkdtempSync(join(tmpdir(), "inbox-"));
for (const f of ["miner.md", "transcripts"]) cpSync(join(import.meta.dir, f), join(folder, f), { recursive: true });

// It may read anything in the folder and write one file. No shell, no web, no sub-agents.
Bun.spawnSync(["claude", "-p", "--model", process.env.MINE_MODEL ?? "claude-sonnet-5-5", "--safe-mode", "--setting-sources", "",
  "--no-session-persistence", "--allowed-tools", "Read,Glob,Grep,Write", "--disallowed-tools", "Bash,WebFetch,WebSearch,Agent,Task",
  "--max-turns", "30", "--output-format", "json"], { cwd: folder, stdin: new TextEncoder().encode("Follow miner.md.") });

const out = join(folder, "candidates.md");
console.log(existsSync(out) ? readFileSync(out, "utf8").trim() : "The miner wrote no candidates.md. Nothing is known about this night.");
rmSync(folder, { recursive: true, force: true });
