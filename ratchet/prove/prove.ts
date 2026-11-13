// Proves that a check can fail. A check nobody has seen fail might be looking
// at nothing, so each one is broken on purpose and watched.
//
// Three runs per check, in a folder the caller owns:
//   1. as it stands        -> must pass, or the result means nothing
//   2. with a mistake added -> must fail
//   3. mistake removed      -> must pass again
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

export type Gate = {
  id: string;
  /** A shell command, run from the folder being proved. */
  command: string;
  /** A new file that breaks the rule the check is there to hold. */
  inject: { path: string; content: string };
};

/** Runs a command in a folder and returns its exit code. */
export type Run = (command: string, cwd: string) => number;

export type Proof = {
  id: string;
  command: string;
  verdict: "proven" | "unproven";
  /** Written as what to do next when unproven. */
  reason: string;
};

export function proveGate(gate: Gate, cwd: string, run: Run): Proof {
  const result = (verdict: Proof["verdict"], reason: string): Proof => ({
    id: gate.id,
    command: gate.command,
    verdict,
    reason,
  });
  const target = path.join(cwd, gate.inject.path);
  if (existsSync(target))
    return result(
      "unproven",
      `${gate.inject.path} already exists, so adding it would prove nothing. Pick a path that is not in the tree.`,
    );

  // A check that is already failing fails again with the mistake in place.
  // That is not proof. Without this run, a command that does not exist
  // proves itself.
  const before = run(gate.command, cwd);
  if (before !== 0)
    return result(
      "unproven",
      `It was already failing before the mistake was added (exit ${before}). Make it pass first, then prove it.`,
    );

  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, gate.inject.content);
  let during: number;
  try {
    during = run(gate.command, cwd);
  } finally {
    rmSync(target);
  }
  if (during === 0)
    return result(
      "unproven",
      `It passed with ${gate.inject.path} in the tree. It is not looking at that file, or its exit code is being lost.`,
    );

  const after = run(gate.command, cwd);
  if (after !== 0)
    return result(
      "unproven",
      `It kept failing after the mistake was removed (exit ${after}). Something else is making it fail.`,
    );
  return result("proven", "Failed with the mistake, passed without it.");
}

export function table(proofs: Proof[]): string {
  return proofs
    .map((proof) =>
      [
        `  ${proof.verdict === "proven" ? "proven  " : "UNPROVEN"}  ${proof.id}`,
        `            ${proof.command}`,
        `            ${proof.reason}`,
      ].join("\n"),
    )
    .join("\n");
}
