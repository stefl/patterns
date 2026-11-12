// The gate. `bun run check:ratchet` runs it; it exits 1 on any disagreement
// between the pins and the tree.
import { existsSync } from "node:fs";
import path from "node:path";

import { type Failure, judge } from "./judge.ts";
import {
  ALLOWED_DIRS,
  MARKERS,
  MIN_REASON_WORDS,
  MUST_SCAN,
  PINS,
  type Pin,
  SCAN_ROOTS,
} from "./pins.ts";
import { scan } from "./scan.ts";

export type Options = {
  root: string;
  roots?: string[];
  pins?: Pin[];
  markers?: Record<string, number>;
};

export function runCheck(options: Options): {
  failures: Failure[];
  remaining: number;
} {
  const pins = options.pins ?? PINS;
  const seen = scan(options.root, options.roots ?? SCAN_ROOTS, ALLOWED_DIRS);
  const failures = judge(seen, {
    pins,
    markers: options.markers ?? MARKERS,
    mustScan: MUST_SCAN,
    minReasonWords: MIN_REASON_WORDS,
    existingDirs: new Set(
      pins
        .map((pin) => pin.dir)
        .filter((dir) => existsSync(path.join(options.root, dir))),
    ),
  });
  return { failures, remaining: seen.violations.length };
}

export function report(result: ReturnType<typeof runCheck>): string {
  if (result.failures.length === 0)
    return `ratchet: ok. ${result.remaining} raw colour value(s) still pinned; the target is 0.`;
  const lines = result.failures.map(
    (failure) => `  [${failure.kind}] ${failure.message}`,
  );
  return `ratchet: ${result.failures.length} failure(s)\n${lines.join("\n")}`;
}

if (import.meta.main) {
  const result = runCheck({ root: path.resolve(import.meta.dirname, "..") });
  console.log(report(result));
  process.exit(result.failures.length === 0 ? 0 : 1);
}
