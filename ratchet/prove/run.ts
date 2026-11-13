// Proves the checks this repository relies on, then shows four broken checks
// being refused. Everything runs in a throwaway copy; nothing here is changed.
//
//   bun run prove
import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { BROKEN_GATES, GATES } from "./gates.ts";
import { type Gate, proveGate, type Run, table } from "./prove.ts";

const repo = path.resolve(import.meta.dirname, "..");

// Needs a POSIX shell, because one of the broken checks is a pipe.
const shell: Run = (command, cwd) =>
  Bun.spawnSync(["sh", "-c", command], {
    cwd,
    stdout: "ignore",
    stderr: "ignore",
  }).exitCode;

function proveAll(gates: Gate[]) {
  const copy = mkdtempSync(path.join(tmpdir(), "ratchet-prove-"));
  for (const dir of ["app", "ratchet", "prove"])
    cpSync(path.join(repo, dir), path.join(copy, dir), { recursive: true });
  try {
    return gates.map((gate) => proveGate(gate, copy, shell));
  } finally {
    rmSync(copy, { recursive: true });
  }
}

const relied = proveAll(GATES);
const broken = proveAll(BROKEN_GATES);
const today = new Date().toISOString().slice(0, 10);

console.log(`Checks this repository relies on (${today}):\n${table(relied)}\n`);
console.log(`Checks that pass for the wrong reason:\n${table(broken)}\n`);

const unproven = relied.filter((proof) => proof.verdict === "unproven");
const fooled = broken.filter((proof) => proof.verdict === "proven");
if (unproven.length > 0)
  console.log(
    `${unproven.length} check(s) relied on here could not be proven.`,
  );
if (fooled.length > 0)
  console.log(`${fooled.length} broken check(s) fooled the prover.`);
if (unproven.length + fooled.length > 0) process.exit(1);
console.log(
  `${relied.length} proven. All ${broken.length} broken checks were refused.`,
);
