// Breaks the example seven ways, one at a time, in a throwaway copy, and
// prints what the gate says each time. Nothing in the repository is changed.
//
//   bun run demo
import {
  appendFileSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { type Options, report, runCheck } from "../ratchet/check.ts";

const repo = path.resolve(import.meta.dirname, "..");

type Scenario = {
  title: string;
  expect: string;
  /** Changes the copy at `root`; may return options that change the rule. */
  act: (root: string) => Partial<Options> | void;
};

const edit = (root: string, file: string, change: (text: string) => string) =>
  writeFileSync(
    path.join(root, file),
    change(readFileSync(path.join(root, file), "utf8")),
  );

const scenarios: Scenario[] = [
  {
    title: "Add a raw colour value in a folder that already has some",
    expect: "growth",
    act: (root) =>
      appendFileSync(
        path.join(root, "app/src/buttons/primary.ts"),
        'export const focusRing = "#ffbf47";\n',
      ),
  },
  {
    title: "Fix one, and leave the pin where it was",
    expect: "stale-pin",
    act: (root) =>
      edit(root, "app/src/buttons/secondary.ts", (text) =>
        text.replace('"#c9c7c0"', "colour.line"),
      ),
  },
  {
    title: "Delete a pinned folder, and leave its entry",
    expect: "stale-entry",
    act: (root) =>
      rmSync(path.join(root, "app/src/nav/legacy"), { recursive: true }),
  },
  {
    title: "Add a new folder with one raw colour value",
    expect: "unpinned",
    act: (root) => {
      mkdirSync(path.join(root, "app/src/tables"));
      writeFileSync(
        path.join(root, "app/src/tables/table.ts"),
        'export const table = { stripe: "#f0efe9" };\n',
      );
    },
  },
  {
    title: "Excuse a line in place, with no reason",
    expect: "marker-no-reason",
    act: (root) =>
      edit(root, "app/src/cards/card.ts", (text) =>
        text.replace('"#00000022",', '"#00000022", // colour-ok: fine'),
      ),
  },
  {
    title: "Excuse a line in place, with a good reason nobody agreed to",
    expect: "marker-growth",
    act: (root) =>
      edit(root, "app/src/cards/card.ts", (text) =>
        text.replace(
          '"#00000022",',
          '"#00000022", // colour-ok: shadows need alpha and tokens have none',
        ),
      ),
  },
  {
    title: "Quietly narrow the rule so it stops reading the old sidebar",
    expect: "scope-narrowed",
    act: () => ({
      roots: ["app/src/buttons", "app/src/cards", "app/src/forms"],
      pins: [
        { dir: "app/src/buttons", count: 3, reason: "predates the tokens" },
        { dir: "app/src/cards", count: 1, reason: "no shadow token yet" },
      ],
    }),
  },
];

let wrong = 0;
console.log(`Unchanged:\n${report(runCheck({ root: repo }))}\n`);

for (const [index, scenario] of scenarios.entries()) {
  const root = mkdtempSync(path.join(tmpdir(), "ratchet-demo-"));
  cpSync(path.join(repo, "app"), path.join(root, "app"), { recursive: true });
  const options = scenario.act(root) ?? {};
  const result = runCheck({ root, ...options });
  rmSync(root, { recursive: true });

  const caught = result.failures.some(
    (failure) => failure.kind === scenario.expect,
  );
  if (!caught) wrong += 1;
  console.log(`${index + 1}. ${scenario.title}`);
  console.log(
    report(result)
      .split("\n")
      .map((line) => `   ${line}`)
      .join("\n"),
  );
  console.log(
    caught
      ? `   -> caught as ${scenario.expect}\n`
      : `   -> NOT CAUGHT: expected ${scenario.expect}\n`,
  );
}

if (wrong > 0) {
  console.log(`${wrong} scenario(s) were not caught.`);
  process.exit(1);
}
console.log(`All ${scenarios.length} were caught.`);
