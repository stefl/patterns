// The prover is a check too, so each of its answers is caused on purpose.
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { type Gate, proveGate, type Run } from "./prove.ts";

const gate: Gate = {
  id: "g",
  command: "check",
  inject: { path: "src/new/mistake.ts", content: "x" },
};
const dir = () => mkdtempSync(path.join(tmpdir(), "prove-test-"));
const mistakeIn = (cwd: string) => existsSync(path.join(cwd, gate.inject.path));

const working: Run = (_command, cwd) => (mistakeIn(cwd) ? 1 : 0);
const alwaysGreen: Run = () => 0;
const alwaysRed: Run = () => 127;

describe("the prover", () => {
  it("proves a check that fails with the mistake and passes without it", () => {
    const cwd = dir();
    expect(proveGate(gate, cwd, working).verdict).toBe("proven");
  });

  it("removes the mistake afterwards", () => {
    const cwd = dir();
    proveGate(gate, cwd, working);
    expect(mistakeIn(cwd)).toBe(false);
  });

  it("removes the mistake even when the check throws", () => {
    const cwd = dir();
    let calls = 0;
    const throwsSecond: Run = () => {
      calls += 1;
      if (calls === 2) throw new Error("runner died");
      return 0;
    };
    expect(() => proveGate(gate, cwd, throwsSecond)).toThrow("runner died");
    expect(mistakeIn(cwd)).toBe(false);
  });

  it("refuses a check that stays green", () => {
    const proof = proveGate(gate, dir(), alwaysGreen);
    expect(proof.verdict).toBe("unproven");
    expect(proof.reason).toContain("passed with");
  });

  it("refuses a check that was already failing, and never adds the mistake", () => {
    const cwd = dir();
    let sawMistake = false;
    const red: Run = (command, where) => {
      sawMistake ||= mistakeIn(where);
      return alwaysRed(command, where);
    };
    const proof = proveGate(gate, cwd, red);
    expect(proof.verdict).toBe("unproven");
    expect(proof.reason).toContain("already failing");
    expect(sawMistake).toBe(false);
  });

  it("refuses a check that does not go green again", () => {
    let calls = 0;
    const sticky: Run = () => (++calls === 1 ? 0 : 1);
    const proof = proveGate(gate, dir(), sticky);
    expect(proof.verdict).toBe("unproven");
    expect(proof.reason).toContain("kept failing");
  });

  it("refuses to overwrite a file that is already there", () => {
    const cwd = dir();
    mkdirSync(path.join(cwd, "src/new"), { recursive: true });
    writeFileSync(path.join(cwd, gate.inject.path), "real work");
    const proof = proveGate(gate, cwd, working);
    expect(proof.verdict).toBe("unproven");
    expect(mistakeIn(cwd)).toBe(true);
  });
});
