// A tiny voice check. The profile is measured from samples of your own
// writing; the struck list is what a reader has struck from your drafts,
// each with the date it was added. A draft passes when nothing on either
// list turns up. Run with: bun check.ts

// Three short samples of the writer's own prose (made up for this example;
// in real use these stay private and only the numbers leave).
const samples = [
  "I spent the morning with the import script. It reads the export, checks each row against the schema and writes what it can. Rows it can't read go to a separate file with the reason beside them, which is more than I expected.",
  "The release went out at four. Two people tested it on their own phones first, and one found a button that sat under the keyboard. We moved it.",
  "I think the slow part is the image step, not the upload. I'd like to measure it before changing anything, so I've added a timer and will look again on Friday.",
];

const EM_DASH = "\u2014"; // written as an escape so this file has none of its own
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

// The profile: numbers read from the samples, not chosen by hand.
const profile = {
  maxParagraphWords: Math.max(...samples.map(words)),
  usesEmDash: samples.some((s) => s.includes(EM_DASH)),
};

// Struck by a reader, with the date each was added. Feedback lands here.
type Struck = { pattern: RegExp; note: string; added: string };
const struck: Struck[] = [
  { pattern: /\bhonestly\b/i, note: "intensifier", added: "2026-03-02" },
  { pattern: /\bgame-changer\b/i, note: "hype; say what changed", added: "2026-03-02" },
  { pattern: /\bleverage\b/i, note: "say 'use'", added: "2026-03-09" },
  { pattern: /\bmust\b/i, note: "reads as an order; 'would need to'", added: "2026-03-09" },
];

// Absolutes aimed at people or their work: say where you looked instead.
const absolutes = /\b(nobody|no one|nothing|never|always|everyone)\b/gi;

function check(draft: string): string[] {
  const hits: string[] = [];
  // Quoted text is someone else's words, so it is not counted.
  const text = draft.replace(/"[^"]*"/g, '""');
  for (const s of struck) {
    const m = text.match(s.pattern);
    if (m) hits.push(`Struck "${m[0]}" (${s.note}, added ${s.added})`);
  }
  for (const m of text.matchAll(absolutes)) hits.push(`Absolute "${m[0]}"`);
  if (!profile.usesEmDash && text.includes(EM_DASH)) hits.push("Em dash (none in your samples)");
  const n = words(text);
  if (n > profile.maxParagraphWords) hits.push(`${n} words (your longest sample is ${profile.maxParagraphWords})`);
  return hits;
}

function report(label: string, draft: string) {
  const hits = check(draft);
  console.log(`${label}: ${hits.length ? "FAIL" : "PASS"}`);
  for (const h of hits) console.log(`  ${h}`);
}

console.log(`Profile from ${samples.length} samples: paragraphs up to ${profile.maxParagraphWords} words, em dash ${profile.usesEmDash ? "used" : "not used"}.\n`);

const before =
  `Honestly, the new deploy script is a game-changer ${EM_DASH} but nobody checks the backups and nothing records who ran it. We must leverage the old scripts and never ship without a review.`;
report("Before", before);

const after =
  "The new deploy script runs the database step in one command. In terms of backups, I couldn't see where they are checked. Recording who ran each deploy would make a bad release easier to trace. I'd suggest a review before each release.";
report("After", after);

// A reader passes the draft but strikes a phrase the list did not have.
// It goes on the list, dated, and the same draft is checked again.
struck.push({ pattern: /\bin terms of\b/i, note: "formal; say the thing", added: "2026-03-16" });
console.log('\nReader strikes "in terms of" on 2026-03-16; added to the list.\n');
report("After, checked again", after);

const final =
  "The new deploy script runs the database step in one command. I couldn't see where backups are checked. Recording who ran each deploy would make a bad release easier to trace. I'd suggest a review before each release.";
report("Final", final);

// Registers. The same line can be right for one reader and wrong for another:
// a gloss helps a reader who does not know the term and talks down to one who
// does. Each register names its reader, and the reader brief lists what they
// already know. A gloss straight after a known term is flagged.
type Register = { name: string; known: string[] };
const registers: Register[] = [
  { name: "Email to a client who doesn't write code", known: [] },
  { name: "Page for engineers", known: ["pull request", "lint rule", "token"] },
];

function overExplained(draft: string, known: string[]): string[] {
  return known.flatMap((term) => {
    const gloss = new RegExp(`\\b${term}s?\\b(?:,\\s+(?:a|an|the|which)\\b|\\s+\\((?:a|an|the|which)\\b)`, "i");
    return gloss.test(draft) ? [`Explains "${term}", which this reader already knows`] : [];
  });
}

const line =
  "Each change goes in as a pull request, a proposed change that someone else reviews before it is merged.";
console.log(`\nOne line, two registers:\n  "${line}"\n`);
for (const r of registers) {
  const hits = overExplained(line, r.known);
  console.log(`${r.name}: ${hits.length ? "FAIL" : "PASS"}`);
  for (const h of hits) console.log(`  ${h}`);
}
