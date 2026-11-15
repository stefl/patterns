// Observations propose a rule; only the owner's declaration locks it in. Run: bun record.ts
const OWNER = "owner";

// Agents append here: a date, what was on screen, and the owner's exact words. None of it is a rule.
const observations = [
  { id: 1, on: "2026-10-02", surface: "settings page", words: "the shadows under the buttons look generated" },
  { id: 2, on: "2026-10-09", surface: "pricing page", words: "shadows again, take them off" },
  { id: 3, on: "2026-10-12", surface: "empty inbox", words: "why is it spinning when there is nothing to load?" },
  { id: 4, on: "2026-10-14", surface: "sign-up form", words: "too many exclamation marks" },
  { id: 5, on: "2026-10-20", surface: "welcome email", words: "calm down with the exclamation marks" },
  { id: 6, on: "2026-10-21", surface: "help page", words: "why are the headings underlined?" },
];

// A rule reads "never X; instead Y", cites its observations, and names who declared it and where it is enforced.
type Rule = {
  never: string; instead?: string; from: number[];
  declared?: { by: string; on: string; words: string }; enforced?: string;
};
const rules: Rule[] = [
  { never: "a drop shadow under a button", instead: "a one-pixel outline", from: [1, 2],
    declared: { by: OWNER, on: "2026-10-10", words: "yes, make that a rule" }, enforced: "lint rule no-button-shadow" },
  { never: "exclamation marks in interface text", instead: "a full stop", from: [4, 5],
    declared: { by: "agent", on: "2026-10-21", words: "seen twice, promoting" } },
  { never: "a spinner on an empty screen", instead: "say what will appear here", from: [3] },
  { never: "underlined headings", from: [6],
    declared: { by: OWNER, on: "2026-10-22", words: "fine, add it" } },
];

// Open tensions: two things the owner wants that pull against each other. Only the owner closes one.
const tensions = [
  { on: "2026-10-05", between: "photographs against drawings", closedBy: "agent" },
  { on: "2026-10-18", between: "dense tables against room to breathe", closedBy: undefined },
];

const known = new Set(observations.map((o) => o.id));
for (const r of rules) {
  const missing = r.from.filter((id) => !known.has(id));
  const state =
    !r.declared ? "Proposal, waiting for the owner"
    : r.declared.by !== OWNER ? `Refused: promoted by ${r.declared.by}, not declared by the owner`
    : missing.length ? `Refused: cites observation ${missing.join(", ")}, which is not in the record`
    : !r.instead ? "Refused: a ban with no replacement"
    : r.enforced ? `Locked, enforced by ${r.enforced}` : "Locked, not yet enforced";
  console.log(`${state}\n  Never ${r.never}${r.instead ? `; instead, ${r.instead}` : ""}`);
}
for (const t of tensions)
  console.log(t.closedBy && t.closedBy !== OWNER
    ? `Refused: tension "${t.between}" closed by ${t.closedBy}. Reopen it.`
    : `Open since ${t.on}: ${t.between}`);
