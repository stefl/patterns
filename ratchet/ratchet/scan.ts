// Reads the tree and reports what it saw. It makes no judgement; judge.ts does.
//
// The counter is deliberately crude. It counts LINES that hold a colour value,
// not parsed syntax, so two values on one line count once. That is enough: a
// ratchet only needs the number to move when the code does. If it misses
// something you can see, the counter is the bug. Widen it and re-measure the
// pins in the same change.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type Hit = { file: string; line: number; text: string };
export type Marker = Hit & { reason: string; excusesSomething: boolean };
export type Scan = { files: string[]; violations: Hit[]; markers: Marker[] };

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/;
const MARKER = /\/\/\s*colour-ok\b:?\s*(.*)$/;

/** Every .ts file under `dir`, as paths relative to `root` with forward slashes. */
function walk(root: string, dir: string): string[] {
  let entries;
  try {
    entries = readdirSync(path.join(root, dir), { withFileTypes: true });
  } catch {
    return []; // A root that is gone scans nothing; MUST_SCAN turns that into a failure.
  }
  const out: string[] = [];
  for (const entry of entries) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...walk(root, rel));
    else if (entry.name.endsWith(".ts")) out.push(rel);
  }
  return out.toSorted();
}

/** What one file's text holds. Pure, so the self-test needs no disk. */
export function scanText(
  file: string,
  text: string,
): { violations: Hit[]; markers: Marker[] } {
  const violations: Hit[] = [];
  const markers: Marker[] = [];
  text.split("\n").forEach((raw, index) => {
    const trimmed = raw.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
    const marker = MARKER.exec(raw);
    // Look for the value in the code, not in the comment that excuses it.
    const code = marker ? raw.slice(0, marker.index) : raw;
    const hit = { file, line: index + 1, text: trimmed };
    if (marker) {
      markers.push({
        ...hit,
        reason: (marker[1] ?? "").trim(),
        excusesSomething: HEX.test(code),
      });
    } else if (HEX.test(code)) {
      violations.push(hit);
    }
  });
  return { violations, markers };
}

export function scan(
  root: string,
  roots: string[],
  allowedDirs: string[],
): Scan {
  const files = roots.flatMap((dir) => walk(root, dir));
  const result: Scan = { files, violations: [], markers: [] };
  for (const file of files) {
    if (allowedDirs.includes(path.posix.dirname(file))) continue;
    const found = scanText(file, readFileSync(path.join(root, file), "utf8"));
    result.violations.push(...found.violations);
    result.markers.push(...found.markers);
  }
  return result;
}
