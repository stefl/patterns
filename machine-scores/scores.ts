// A model may score a long list of names but never reject one, and a model's
// verdict on a name counts only as far as its surviving evidence goes. Both
// "models" are written out by hand, and so is the link check. Run: bun scores.ts
type Reason = "low-score" | "web-address" | "person";
type Row = { name: string; score?: number; rejected?: Reason };
type Risk = "low" | "medium" | "high" | "blocker";
type Finding = { says: string; severity: Risk; link: string };
type Answer = { risk: Risk; findings: Finding[] } | null; // null: the check did not run

const RANK: Risk[] = ["low", "medium", "high", "blocker"];
const worst = (rs: Risk[]): Risk => rs.reduce((a, b) => (RANK.indexOf(b) > RANK.indexOf(a) ? b : a), "low");

// 1. The long list. The scorer left one name out of its reply.
const names = ["Talvo", "Merin", "Quessa", "Brolle", "Fennic", "Orvane", "Lusk", "Pellar", "Trova", "Cindral",
  "Vossa", "Hembry", "Ardel", "Nimbre", "Sollen", "Kavra", "Druell", "Ostra", "Pimley", "Wendal",
  "Yarrel", "Corrin", "Faloo", "Ressa", "Tamsel", "Ulvee", "Bexen", "Mardle", "Strel", "Ithen"];
const reply: Record<string, number> = { Talvo: 8, Merin: 7, Quessa: 4, Brolle: 6, Fennic: 3, Orvane: 9, Lusk: 6,
  Pellar: 7, Trova: 2, Cindral: 6, Vossa: 5, Hembry: 8, Ardel: 4, Nimbre: 7, Sollen: 3, Kavra: 6, Druell: 7,
  Ostra: 8, Pimley: 4, Wendal: 7, Yarrel: 2, Corrin: 6, Faloo: 6, Ressa: 9, Tamsel: 4, Ulvee: 3, Bexen: 7, Mardle: 5, Strel: 6 };
const fresh = (): Row[] => names.map((name) => ({ name, rejected: name === "Hembry" || name === "Wendal" ? "person" : undefined }));

// The old form: score, then reject everything under 6. A missing score counts as 0.
const old = fresh();
for (const r of old) { r.score = reply[r.name] ?? 0; if (r.score < 6 && !r.rejected) r.rejected = "low-score"; }
const byMachine = old.filter((r) => r.rejected === "low-score");
console.log(`Old form: ${old.filter((r) => r.rejected).length} of ${names.length} rejected, ${byMachine.length} by the scorer`);

// The undo reads the reason on each row, so it can restore the scorer's rejections and nobody else's.
for (const r of old) if (r.rejected === "low-score") r.rejected = undefined;
console.log(`  undo restored ${byMachine.length}; still rejected: ${old.filter((r) => r.rejected).map((r) => `${r.name} (${r.rejected})`).join(", ")}`);

// The settled form: the scorer writes one field. A missing score is a middle 5, and the name stays.
const settled = fresh();
const before = settled.map((r) => r.rejected).join();
for (const r of settled) r.score = reply[r.name] ?? 5;
console.log(`Settled form: ${settled.length} scored, ${names.filter((n) => !(n in reply)).join(", ")} given 5, status changes ${before === settled.map((r) => r.rejected).join() ? 0 : "some"}`);

// 2. Clearing one name. Every link a model gives is fetched: 404 drops the finding, an unreadable page is kept and labelled.
const fetched: Record<string, 200 | 403 | 404> = {
  "https://example.com/talvo-labs": 404, "https://example.org/talvo-talks": 200, "https://example.net/talvo-forum": 403 };

function rebuild(a: Answer): { risk: Risk | "unknown"; kept: string[] } {
  if (!a) return { risk: "unknown", kept: [] };
  const kept = a.findings.filter((f) => fetched[f.link] !== 404);
  // The verdict comes from what survived, not from what the model said at the top. An empty list is low.
  return { risk: worst(kept.map((f) => f.severity)), kept: kept.map((f) => `${f.says}${fetched[f.link] === 403 ? " (page could not be read)" : ""}`) };
}

type Check = { check: string; a: Answer; b: Answer };
function clear(name: string, checks: Check[]): void {
  let score = 100, unchecked = 0;
  console.log(`\nClearing ${name}:`);
  for (const { check, a, b } of checks) {
    const ra = rebuild(a), rb = rebuild(b);
    if (ra.risk === "unknown" || rb.risk === "unknown") { unchecked++; console.log(`  ${check}: did not run`); continue; }
    const risk = worst([ra.risk, rb.risk]); // two models, the worse reading wins
    score -= { low: 0, medium: 15, high: 35, blocker: 60 }[risk];
    const said = [a!.risk, b!.risk].join(" and ");
    console.log(`  ${check}: ${risk} (the models said ${said})${ra.risk !== rb.risk ? ", engines disagreed" : ""}`);
    for (const k of new Set([...ra.kept, ...rb.kept])) console.log(`    ${k}`);
  }
  // Unknown is not clean: each check that did not run takes 3 off the best possible score, down to 50.
  const cap = Math.max(50, 100 - 3 * unchecked);
  console.log(`  score ${Math.min(score, cap)}, best possible ${cap}${score > cap ? `, ${score} without the cap` : ""}`);
}

clear("Talvo", [
  { check: "Brand clash",
    a: { risk: "blocker", findings: [{ says: "A firm called Talvo Labs", severity: "high", link: "https://example.com/talvo-labs" }] },
    b: { risk: "medium", findings: [{ says: "A podcast called Talvo Talks", severity: "medium", link: "https://example.org/talvo-talks" },
      { says: "A forum user called Talvo", severity: "low", link: "https://example.net/talvo-forum" }] } },
  { check: "Meaning abroad", a: { risk: "blocker", findings: [] }, b: { risk: "low", findings: [] } },
  { check: "Trademark", a: null, b: null },
]);
// The account ran out of credit, so every model check came back empty. The old form scored this 100.
clear("Ressa", [{ check: "Brand clash", a: null, b: null }, { check: "Meaning abroad", a: null, b: null }, { check: "Trademark", a: null, b: null }]);

// 3. A person overruled the rubric once. Replay that case every run, so the rule cannot drift back.
const soundsAlike = (x: string, y: string) => x.slice(0, 4).toLowerCase() === y.slice(0, 4).toLowerCase();
const disputed = [{ a: "Talvo", b: "Talmer", ruling: false, why: "three shared letters is not a clash" }];
for (const d of disputed) if (soundsAlike(d.a, d.b) !== d.ruling) { console.error(`Rubric drifted: ${d.a} and ${d.b}, ${d.why}`); process.exit(1); }
console.log(`\nReplayed ${disputed.length} case a person overruled: the rubric still agrees with them`);
