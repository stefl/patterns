// Mine your own transcripts: keep only notes you can check, count what recurs,
// and turn what clears the bar into a draft with the names taken out. Run: bun mine.ts
type Session = { id: string; project: string; date: string; lines: string[] };
type Note = { session: string; habit: string; quote: string };

// Six short sessions with a coding agent, from three made-up projects.
const sessions: Session[] = [
  { id: "s1", project: "shop", date: "2026-10-02", lines: [
    "agent: Done, and all tests pass.",
    "person: Which tests? Show me the command and its result."] },
  { id: "s2", project: "shop", date: "2026-10-09", lines: [
    "agent: The lint check failed, so I added checkout.ts to the ignore list.",
    "person: Don't add to the ignore list. Fix the checkout code in shop."] },
  { id: "s3", project: "blog", date: "2026-10-14", lines: [
    "agent: Merged. You will need to add the new key in the hosting dashboard.",
    "person: Write that down somewhere I will see it tomorrow."] },
  { id: "s4", project: "docs", date: "2026-10-18", lines: [
    "agent: All green, ready to merge.",
    "person: Green where? Show me the command and its result.",
    "agent: I added the slow test to the skip list for now.",
    "person: Don't add to the skip list. Fix the test."] },
  { id: "s5", project: "docs", date: "2026-10-30", lines: [
    "agent: Fixed, this works now.",
    "person: How do you know? Show me the command and its result.",
    "person: Spaces, not tabs."] },
  { id: "s6", project: "shop", date: "2026-11-04", lines: [
    "agent: Deployed. Someone should delete the old key in two days.",
    "person: Write that down somewhere Priya and I will see it on the day."] },
];

// What a reader, usually a model, noted in each session: a habit and the line that shows it.
const notes: Note[] = [
  { session: "s1", habit: "Done without evidence", quote: "Which tests? Show me the command and its result." },
  { session: "s4", habit: "Done without evidence", quote: "Green where? Show me the command and its result." },
  { session: "s5", habit: "Done without evidence", quote: "How do you know? Show me the command and its result." },
  { session: "s2", habit: "Exemption list grows", quote: "Don't add to the ignore list. Fix the checkout code in shop." },
  { session: "s4", habit: "Exemption list grows", quote: "Don't add to the skip list. Fix the test." },
  { session: "s6", habit: "Exemption list grows", quote: "Don't add it to the exemptions." },
  { session: "s3", habit: "Manual step left in chat", quote: "Write that down somewhere I will see it tomorrow." },
  { session: "s6", habit: "Manual step left in chat", quote: "Write that down somewhere Priya and I will see it on the day." },
  { session: "s5", habit: "Spaces over tabs", quote: "Spaces, not tabs." },
];

const bar = { sessions: 3, projects: 2 };
const rules: Record<string, string> = { "Done without evidence": "2026-10-20" }; // already in my own setup, since this date
const projects = [...new Set(sessions.map((s) => s.project))];
const people = ["Priya"];

const byId = new Map(sessions.map((s) => [s.id, s]));
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
const named = (text: string, name: string) => new RegExp(`\\b${name}\\b`).test(text);

// 1. A note counts only if its line is really in the transcript it cites.
const checked = notes.filter((n) => byId.get(n.session)!.lines.some((l) => l.includes(n.quote)));
for (const n of notes) if (!checked.includes(n)) console.log(`Not counted: "${n.quote}" is not in ${n.session}.`);

// 2. Count sessions and projects per habit, and test each against the bar.
console.log(`\nBar: ${bar.sessions} sessions, or ${bar.projects} projects`);
const drafts: string[] = [];
for (const habit of [...new Set(checked.map((n) => n.habit))]) {
  const seen = checked.filter((n) => n.habit === habit);
  const where = seen.map((n) => byId.get(n.session)!);
  const s = new Set(where.map((w) => w.id)).size;
  const p = new Set(where.map((w) => w.project)).size;
  const passes = s >= bar.sessions || p >= bar.projects;
  let verdict = passes ? "passes, drafted below" : "below the bar";
  const since = rules[habit];
  if (passes && since) {
    const after = where.filter((w) => w.date > since).length;
    verdict = after ? `a rule since ${since}, seen ${plural(after, "time")} after it: revise the rule` : `a rule since ${since}, not seen after it`;
  }
  console.log(`  ${habit.padEnd(26)} ${plural(s, "session")}, ${plural(p, "project").padEnd(10)}  ${verdict}`);
  if (!passes || since) continue;

  // 3. Draft it with the project names taken out, then scan for any name left.
  const quotes = seen.map((n) => projects.reduce((q, name) => q.replace(new RegExp(`\\b${name}\\b`, "g"), "[project]"), n.quote));
  const left = [...projects, ...people].filter((name) => quotes.some((q) => named(q, name)));
  const dates = where.map((w) => w.date).sort();
  drafts.push([
    `Draft: ${habit}`,
    `  Seen in ${plural(s, "session")} across ${plural(p, "project")}, ${dates[0]} to ${dates.at(-1)}.`,
    ...quotes.map((q) => `  "${q}"`),
    left.length ? `  Held: it still names ${left.join(", ")}. Rewrite the line; do not allow the name.` : "  Name scan: clean.",
  ].join("\n"));
}
console.log(`\n${drafts.join("\n\n")}`);
