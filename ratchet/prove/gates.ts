import type { Gate } from "./prove.ts";

// The mistake every check here should catch: a new folder with a raw colour
// value in it. New code is held to zero.
const mistake = {
  path: "app/src/tables/table.ts",
  content: 'export const table = { stripe: "#f0efe9" };\n',
};

/** Checks this repository relies on. Each must be proven. */
export const GATES: Gate[] = [
  { id: "ratchet", command: "bun ratchet/check.ts", inject: mistake },
];

/** Checks that pass for the wrong reason. Each looks fine and shows a pass on
 *  an ordinary day. The prover must refuse every one. */
export const BROKEN_GATES: Gate[] = [
  {
    // Reads a folder that does not exist, finds nothing, passes.
    id: "reads the wrong folder",
    command: "bun prove/naive-check.ts --root app/source",
    inject: mistake,
  },
  {
    // The shell reports the exit code of `tail`, not of the check.
    id: "piped through tail",
    command: "bun ratchet/check.ts | tail -n 3",
    inject: mistake,
  },
  {
    // Someone turned the rule off, with a reason, and the check still passes.
    id: "rule switched off",
    command: "bun prove/naive-check.ts --root app/src --disable raw-colour",
    inject: mistake,
  },
  {
    // The script was renamed. The command fails for every change, so it
    // fails with the mistake too. That is not proof.
    id: "command does not exist",
    command: "bun prove/renamed-check.ts",
    inject: mistake,
  },
];
