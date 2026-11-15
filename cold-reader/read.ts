// The part of a cold read that needs no model: list every name and "the X"
// a page uses before anything on it says what they are, then check the
// reviewer's runs. The reviewer's answers are written out by hand.
// Run: bun read.ts
type Item = { kind: "heading" | "p" | "label" | "caption"; text: string };
type Accepted = { ref: string; why: string };
type Run = { id: string; canary: string; flags: string[] };

// Words after "the" that never need an earlier mention.
const STOP = new Set(["same", "first", "last", "next", "other", "rest", "top", "end", "way", "page"]);

function scan(page: Item[], accepted: Accepted[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const flag = (ref: string, why: string) => {
    const ok = accepted.find((a) => a.ref === ref);
    out.push(`${item.kind}: ${ref}, ${ok ? `accepted earlier (${ok.why})` : why}`);
  };
  let item = page[0]!;
  for (item of page)
    for (const sentence of item.text.split(/(?<=[.!?])\s+/)) {
      const words = [...sentence.matchAll(/[A-Za-z][A-Za-z'-]*/g)];
      words.forEach((m, i) => {
        const w = m[0];
        const next = words[i + 1]?.[0];
        if (w.toLowerCase() === "the" && next && next[0] === next[0]!.toLowerCase()) {
          const head = next.toLowerCase().replace(/s$/, "");
          if (!STOP.has(head) && !seen.has(head)) flag(`"the ${next}"`, "but nothing earlier mentions it");
        }
        // A capital letter mid-sentence is a name. Its first use should say what it is.
        if (i > 0 && w[0] !== w[0]!.toLowerCase() && !seen.has(w.toLowerCase())) {
          const after = sentence.slice(m.index! + w.length);
          const before = sentence.slice(0, m.index);
          if (!/^,\s(a|an|the)\s|^\s\(/.test(after) && !/(called|named)\s$/.test(before)) flag(w, "named before anything says what it is");
        }
        seen.add(w.toLowerCase().replace(/s$/, ""));
      });
    }
  return out;
}

// A run that answers the canary may have seen more than the page, so it is not counted as cold.
function runs(all: Run[]): string[] {
  const cold = all.filter((r) => /not on the page/i.test(r.canary));
  const out = all.map((r) => (cold.includes(r) ? `run ${r.id}: cold, ${r.flags.length} flags` : `run ${r.id}: answered the canary ("${r.canary}"), so it may have seen more than the page. Not counted.`));
  const [a, b] = cold;
  if (a && b) {
    const both = a.flags.filter((f) => b.flags.includes(f));
    const any = new Set([...a.flags, ...b.flags]);
    out.push(`runs ${a.id} and ${b.id} agree on ${both.length} of ${any.size} flags: ${both.join(", ")}`);
  }
  return out;
}

const before: Item[] = [
  { kind: "heading", text: "Keep your notes in step" },
  { kind: "p", text: "The sync now runs on Relay, so the badge turns green within a second of a save." },
  { kind: "label", text: "Relay status" },
  { kind: "caption", text: "The badge on the toolbar shows when the last save reached the server." },
  { kind: "p", text: "Turn it off in the panel if you work offline." },
];
const after: Item[] = [
  { kind: "heading", text: "Keep your notes in step" },
  { kind: "p", text: "Every note you save is copied to your other devices. That copying now runs on Relay, a service that keeps a connection open to each device, so a save shows up everywhere within a second." },
  { kind: "p", text: "A badge at the top of the screen turns green when your last save reaches our server, which keeps a copy for each device." },
  { kind: "label", text: "Relay status" },
  { kind: "caption", text: "The badge shows when your last save reached the server." },
  { kind: "p", text: "If you work offline, turn copying off in Settings." },
];
// Flags a person has already ruled fine, with the reason, so they are not raised again.
const accepted: Accepted[] = [
  { ref: '"the screen"', why: "the reader's own screen" },
  { ref: "Settings", why: "every app has one" },
];

// Three runs of the model on the first draft, each asked the same fixed
// questions. The last question is the canary: its answer is not on the page.
const reviewer: Run[] = [
  { id: "A", canary: "Not on the page.", flags: ["Relay", "the sync", "the badge", "the panel"] },
  { id: "B", canary: "Not on the page.", flags: ["Relay", "the toolbar", "the server", "the panel", "green"] },
  { id: "C", canary: "notes-home.html", flags: ["the panel"] },
];

console.log("First draft:\n" + scan(before, accepted).map((l) => `  ${l}`).join("\n"));
console.log("Second draft:\n" + (scan(after, accepted).map((l) => `  ${l}`).join("\n") || "  nothing flagged"));
console.log("Reviewer runs on the first draft:\n" + runs(reviewer).map((l) => `  ${l}`).join("\n"));
