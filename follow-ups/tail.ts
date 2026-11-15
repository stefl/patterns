// Steps only a person can do, each waiting on a fact. Run: bun tail.ts
type Item = { title: string; triggers: string[]; body: string; notes: string[] };

const items: Item[] = [];
// What is true now: changes merged, facts someone has asserted, and today's date.
const facts = { merged: [41, 42], asserted: ["new key live"], today: "2026-11-15" };

const fired = (t: string) => {
  const [kind, value] = t.split(":");
  if (kind === "merged") return facts.merged.includes(Number(value)); // keyed on the change number, not a branch
  if (kind === "date") return value <= facts.today;
  if (kind === "asserted") return facts.asserted.includes(value);
  return false; // "manual" waits for a person to close it
};

// The first clause, lower case, is what makes two items the same step.
const key = (title: string) => title.toLowerCase().split(/[,:;]| then /)[0].trim();

function add(title: string, triggers: string[], body: string) {
  const same = items.find((i) => key(i.title) === key(title));
  if (same) return void same.notes.push(`filed again: ${title}`);
  const missing = ["then:", "proof:"].filter((w) => !body.includes(w));
  if (missing.length) console.log(`warning: "${title}" has no ${missing.join(" or ")} line`);
  items.push({ title, triggers, body, notes: [] });
}

add("Paste the new API key into the payments dashboard", ["merged:41"],
  "then: Settings > Keys > Replace, paste from the vault\nproof: the test charge on /admin/health goes green");
add("Delete the old API key", ["asserted:new key live", "date:2026-11-17"],
  "then: Settings > Keys > old key > Delete\nproof: the key list shows one key");
add("paste the new API key into the payments dashboard, from the vault", ["merged:41"], "then: as above");
add("Re-run the customer sync", ["merged:43"], "needs your login");

for (const i of items) {
  const state = i.triggers.every(fired) ? "ready" : `waiting on ${i.triggers.filter((t) => !fired(t)).join(", ")}`;
  console.log(`${state.padEnd(28)} ${i.title}${i.notes.length ? `  (${i.notes.length} repeat folded in)` : ""}`);
}
