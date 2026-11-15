// Proves each check can fail: green first, red with a known mistake, green again.
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const check = join(import.meta.dir, "check.ts");
const gates: Record<string, string> = {
  "the check as written": `bun ${check} src`,
  "pointed at a folder that does not exist": `bun ${check} source`,
  "piped through tail": `bun ${check} src | tail -1`,
  "rule switched off": `bun ${check} src --rule-off`,
  "already failing": `bun ${check} src && exit 1`,
};

const passes = (cmd: string, cwd: string) => Bun.spawnSync(["sh", "-c", cmd], { cwd, stdout: "ignore", stderr: "ignore" }).exitCode === 0;

for (const [name, cmd] of Object.entries(gates)) {
  const dir = mkdtempSync(join(tmpdir(), "prove-"));
  mkdirSync(join(dir, "src"));
  writeFileSync(join(dir, "src/app.ts"), "export const answer = 42;\n");
  const mistake = join(dir, "src/new.ts");

  let verdict = "proven";
  if (!passes(cmd, dir)) verdict = "unproven: it was already failing";
  else {
    writeFileSync(mistake, "// TODO: finish this\n");
    if (passes(cmd, dir)) verdict = "unproven: it passed with the mistake in";
    else {
      rmSync(mistake);
      if (!passes(cmd, dir)) verdict = "unproven: it stayed red after the mistake was removed";
    }
  }
  console.log(`${name.padEnd(40)} ${verdict}`);
  rmSync(dir, { recursive: true });
}
