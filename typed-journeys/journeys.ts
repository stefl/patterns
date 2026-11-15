// Journeys declared against the event names the system already records.
// Run: bun journeys.ts. Type-check: tsc --noEmit --strict --target es2022 --lib es2022,dom journeys.ts
const EVENTS = ["account.created", "email.verified", "project.created", "invite.sent",
  "report.generated", "report.viewed", "comment.saved", "theme.changed"] as const;
type EventName = (typeof EVENTS)[number];

type Journey = { name: string; actor: string; steps: { event: EventName; says: string }[] };

const signUp: Journey = { name: "sign-up", actor: "a new user", steps: [
  { event: "account.created", says: "creates an account" },
  { event: "email.verified", says: "confirms their email address" },
] };
const firstReport: Journey = { name: "first-report", actor: "a new user", steps: [
  ...signUp.steps,
  { event: "project.created", says: "starts a project" },
  { event: "report.generated", says: "runs their first report" },
  { event: "report.viewed", says: "reads the result" },
] };
const journeys = [signUp, firstReport];

// Events on no journey, each with a reason. The length is pinned below.
const offJourney: Partial<Record<EventName, string>> = {
  "invite.sent": "Optional: most people never invite anyone.",
  "comment.saved": "Optional, so not a step anyone can drop out of.",
  "theme.changed": "A setting, not progress.",
};
const OFF_JOURNEY_PIN = 3;

// Pass if the steps appear in order; other events may come between them.
function walk(j: Journey, recorded: EventName[]): string {
  let i = 0;
  for (const e of recorded) if (e === j.steps[i]?.event) i++;
  return i === j.steps.length ? "finished" : `stopped before "${j.steps[i].event}" (step ${i + 1} of ${j.steps.length})`;
}

const prose = (j: Journey) => `# ${j.name}\n\n` + j.steps.map((s, n) => `${n + 1}. ${j.actor[0].toUpperCase() + j.actor.slice(1)} ${s.says}.`).join("\n");

const problems: string[] = [];
const onAJourney = new Set(journeys.flatMap((j) => j.steps.map((s) => s.event)));
for (const e of EVENTS) {
  if (!onAJourney.has(e) && !offJourney[e]) problems.push(`${e} is on no journey and not on the off-journey list.`);
  if (onAJourney.has(e) && offJourney[e]) problems.push(`${e} is now on a journey. Delete it from the off-journey list.`);
}
if (Object.keys(offJourney).length !== OFF_JOURNEY_PIN) problems.push(`The off-journey list has ${Object.keys(offJourney).length} entries; its pin is ${OFF_JOURNEY_PIN}.`);

console.log(problems.length ? problems.join("\n") : "coverage ok");
console.log(`\n${prose(firstReport)}\n`);
const run: EventName[] = ["account.created", "theme.changed", "email.verified", "project.created", "report.generated", "report.viewed"];
console.log(`A full run:            ${walk(firstReport, run)}`);
console.log(`A run that never read: ${walk(firstReport, run.slice(0, 5))}`);

// The lesson: put an optional act on a journey and a finished run fails.
const withComment: Journey = { ...firstReport, steps: [...firstReport.steps.slice(0, 4),
  { event: "comment.saved", says: "leaves a comment" }, firstReport.steps[4]] };
console.log(`With an optional step: ${walk(withComment, run)}`);
