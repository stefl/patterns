// A check written the quick way, so the prover has something to catch.
// It holds the same rule as the ratchet: no raw colour value in a folder that
// is not already known to have some. It has two ordinary faults:
//
//   - if the folder it is told to read does not exist, it finds nothing
//     and passes
//   - a rule can be switched off, and it still passes
//
//   bun prove/naive-check.ts --root app/src
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/;
const KNOWN = ["theme", "buttons", "cards", "nav/legacy"];

const args = process.argv.slice(2);
const flag = (name: string) => {
  const at = args.indexOf(name);
  return at === -1 ? undefined : args[at + 1];
};
const root = flag("--root") ?? "app/src";
const disabled = flag("--disable");

function walk(dir: string): string[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return []; // The fault: a missing folder reads as an empty one.
  }
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".ts") ? [full] : [];
  });
}

const found =
  disabled === "raw-colour"
    ? []
    : walk(root).filter((file) => {
        const dir = path.relative(root, path.dirname(file));
        return !KNOWN.includes(dir) && HEX.test(readFileSync(file, "utf8"));
      });

if (found.length > 0) {
  console.log(`naive-check: raw colour value in ${found.join(", ")}`);
  process.exit(1);
}
console.log("naive-check: ok");
