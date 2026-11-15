// Judges rendered boxes against written layout rules. In a real setup a
// browser test records the boxes; here they are written out by hand, because
// the judge never needs the page. Run: bun judge.ts
type Box = { part?: string; x: number; y: number; w: number; h: number; laysOut?: boolean };

const CONTROL_HEIGHTS = [28, 36]; // the agreed sizes
const GAPS = [4, 8, 16];

const contracts: Record<string, (boxes: Box[]) => string[]> = {
  "a control is one of the agreed heights": (boxes) =>
    boxes.filter((b) => b.part === "control" && !CONTROL_HEIGHTS.includes(b.h))
      .map((b) => `control at x=${b.x} is ${b.h}px tall; allowed: ${CONTROL_HEIGHTS.join(", ")}`),
  "a tab bar's underline reaches its last tab": (boxes) => {
    const tabs = boxes.filter((b) => b.part === "tab");
    const rule = boxes.find((b) => b.part === "tabs.rule");
    const end = Math.max(...tabs.map((t) => t.x + t.w));
    return rule && rule.x + rule.w < end ? [`underline stops at ${rule.x + rule.w}px, last tab ends at ${end}px`] : [];
  },
  "rows are an agreed gap apart": (boxes) => {
    const rows = boxes.filter((b) => b.part === "row").sort((a, b) => a.y - b.y);
    return rows.slice(1).flatMap((r, i) => {
      const gap = r.y - (rows[i].y + rows[i].h);
      return GAPS.includes(gap) ? [] : [`gap of ${gap}px above the row at y=${r.y}; allowed: ${GAPS.join(", ")}`];
    });
  },
  "every box that does its own layout says what it is": (boxes) =>
    boxes.filter((b) => b.laysOut && !b.part).map((b) => `unclassified box at x=${b.x}, y=${b.y}`),
};

const screen: Box[] = [
  { part: "tab", x: 0, y: 0, w: 80, h: 36 }, { part: "tab", x: 80, y: 0, w: 80, h: 36 },
  { part: "tab", x: 160, y: 0, w: 96, h: 36 }, { part: "tabs.rule", x: 0, y: 36, w: 240, h: 1 },
  { part: "row", x: 0, y: 48, w: 256, h: 40 }, { part: "row", x: 0, y: 96, w: 256, h: 40 },
  { part: "row", x: 0, y: 142, w: 256, h: 40 },
  { part: "control", x: 0, y: 200, w: 90, h: 28 }, { part: "control", x: 98, y: 200, w: 90, h: 30 },
  { x: 0, y: 240, w: 256, h: 60, laysOut: true },
];

for (const [rule, judge] of Object.entries(contracts)) {
  const found = judge(screen);
  console.log(`${found.length ? "FAIL" : "ok  "} ${rule}${found.map((f) => `\n       ${f}`).join("")}`);
}
