// The check being proved: no file under the folder may contain "TODO".
// Usage: bun check.ts <folder> [--rule-off]
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const [dir = "src", flag] = process.argv.slice(2);
if (flag === "--rule-off") process.exit(0); // the rule switched off in config

const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".ts")) : [];
const bad = files.filter((f) => readFileSync(join(dir, f), "utf8").includes("TODO"));
if (bad.length > 0) {
  console.error(`TODO left in: ${bad.join(", ")}`);
  process.exit(1);
}
console.log(`checked ${files.length} file(s), none with TODO`);
