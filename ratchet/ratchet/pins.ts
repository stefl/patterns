// The rule: no raw colour values outside the theme folder.
//
// The app broke this rule in eight places on the day the rule arrived. This
// file is where that debt is written down. Every number here is today's count
// and may only go down.

/** Folders the scan walks. Narrowing this list weakens the rule, so MUST_SCAN
 *  below fails when a file it names stops being scanned. */
export const SCAN_ROOTS = ["app/src"];

/** The one folder where a colour value may be written. */
export const ALLOWED_DIRS = ["app/src/theme"];

/** Files the scan must reach. If the roots are narrowed or a skip rule is
 *  added, and one of these drops out, the check fails. One file per area. */
export const MUST_SCAN = [
  "app/src/buttons/primary.ts",
  "app/src/cards/card.ts",
  "app/src/forms/input.ts",
  "app/src/nav/legacy/sidebar.ts",
];

export type Pin = {
  /** A folder. The pin covers the files directly in it, not its subfolders,
   *  so a new subfolder is held to zero from the moment it exists. */
  dir: string;
  /** Lines with a raw colour value, counted on the day this was last moved. */
  count: number;
  /** Why this folder is excused for now. An empty reason fails. */
  reason: string;
};

// History of the pins. Add a line whenever a number moves.
//
// 2026-11-01  Rule switched on. 8 raw values found: buttons 4, cards 1,
//             nav/legacy 3. One more in cards/banner.ts is the partner's logo
//             colour and carries a marker (see MARKERS).
// 2026-11-04  buttons 4 -> 3. danger.ts moved to the theme tokens.
// 2026-11-06  cards nearly went 1 -> 2 to let a new shadow through. It did
//             not. The new shadow became a token. A number that wants to go up
//             is a question about the change, not a new budget.
export const PINS: Pin[] = [
  {
    dir: "app/src/buttons",
    count: 3,
    reason: "primary and secondary predate the theme tokens",
  },
  {
    dir: "app/src/cards",
    count: 1,
    reason: "the card shadow has no token yet",
  },
  {
    dir: "app/src/nav/legacy",
    count: 3,
    reason: "the old sidebar is being replaced, not repainted",
  },
];

/** A line may be excused in place with `// colour-ok: <reason>`. The marker is
 *  the escape hatch, so it is counted too. Markers per file, may only go down,
 *  and each needs a reason of at least three words. */
export const MARKERS: Record<string, number> = {
  "app/src/cards/banner.ts": 1,
};

/** Fewest words a marker's reason may have. Three rules out "ok" and "fine". */
export const MIN_REASON_WORDS = 3;
