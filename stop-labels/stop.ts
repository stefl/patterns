// A closed set of labels for how an agent's turn ended, and a stop hook that
// refuses an unlabelled stop once. Run: bun stop.ts
const ASKS = ["merge-ready", "choose", "go-ahead", "manual-step", "stuck"] as const;
const QUIET = ["stopping", "still-working", "waiting"] as const;
const NEEDS_BLOCKS = ["choose", "manual-step"];
const STALE_MS = 30 * 60 * 1000;

type Label = { label: string; note?: string; blocks?: boolean; at: number };

// The command an agent runs to label its turn. Returns an error, or null.
export function check(l: Label): string | null {
  const all: readonly string[] = [...ASKS, ...QUIET];
  if (!all.includes(l.label)) return `Unknown label "${l.label}". Use one of: ${all.join(", ")}.`;
  const asks = (ASKS as readonly string[]).includes(l.label);
  if (asks && !l.note) return `"${l.label}" asks something of a person, so add a one-line note saying what.`;
  if (NEEDS_BLOCKS.includes(l.label) && l.blocks === undefined) return `"${l.label}" needs --blocks yes or no.`;
  return null;
}

// The stop hook. `raw` is whatever the label file holds; `afterRefusal` is set
// by the runtime when this stop follows a refusal.
export function stop(raw: string | undefined, afterRefusal: boolean, now: number): string {
  if (afterRefusal) return "allow"; // never refuse twice
  let l: Label | undefined;
  try {
    l = raw ? JSON.parse(raw) : undefined;
  } catch {
    return "allow"; // a broken file must not trap the agent
  }
  if (l && now - l.at > STALE_MS) l = undefined; // left over from an earlier turn
  if (l && check(l) === null) return "allow";
  return `refuse: label this turn, then stop. Asks a person: ${ASKS.join(", ")}. Asks nothing: ${QUIET.join(", ")}.`;
}

if (import.meta.main) {
  const now = Date.now();
  const cases: [string, string | undefined, boolean][] = [
    ["no label", undefined, false],
    ["no label, second stop", undefined, true],
    ["labelled merge-ready with a note", JSON.stringify({ label: "merge-ready", note: "PR 12 is green", at: now }), false],
    ["labelled choose, no blocks flag", JSON.stringify({ label: "choose", note: "A or B?", at: now }), false],
    ["label from an hour ago", JSON.stringify({ label: "stopping", at: now - 3_600_000 }), false],
    ["label file is broken", "{not json", false],
  ];
  for (const [name, raw, after] of cases) console.log(`${name.padEnd(34)} ${stop(raw, after, now).split(":")[0]}`);
  console.log(`\nThe refusal says:\n  ${stop(undefined, false, now)}`);
  console.log(`\nlabel "done":\n  ${check({ label: "done", at: now })}`);
  console.log(`label "stuck" with no note:\n  ${check({ label: "stuck", at: now })}`);
}
