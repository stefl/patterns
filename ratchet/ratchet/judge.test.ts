// Every way the gate can fail, caused on purpose. A gate nobody has seen fail
// proves nothing, so each kind of failure has a test that produces it.
import path from "node:path";

import { describe, expect, it } from "vitest";

import { runCheck } from "./check.ts";
import { judge, type Rules } from "./judge.ts";
import { PINS } from "./pins.ts";
import { type Scan, scanText } from "./scan.ts";

const hit = (file: string, line = 1) => ({ file, line, text: 'c: "#123456"' });

const cleanScan = (): Scan => ({
  files: ["src/a/one.ts", "src/b/two.ts"],
  violations: [hit("src/a/one.ts"), hit("src/a/one.ts", 2)],
  markers: [],
});

const rules = (over: Partial<Rules> = {}): Rules => ({
  pins: [{ dir: "src/a", count: 2, reason: "predates the tokens" }],
  markers: {},
  mustScan: ["src/a/one.ts"],
  minReasonWords: 3,
  existingDirs: new Set(["src/a"]),
  ...over,
});

const kinds = (scan: Scan, r: Rules) => judge(scan, r).map((f) => f.kind);

describe("the judge", () => {
  it("passes when the tree and the pins agree", () => {
    expect(judge(cleanScan(), rules())).toEqual([]);
  });

  it("fails growth, and names the lines", () => {
    const scan = cleanScan();
    scan.violations.push(hit("src/a/one.ts", 9));
    const [failure] = judge(scan, rules());
    expect(failure?.kind).toBe("growth");
    expect(failure?.message).toContain("src/a/one.ts:9");
  });

  it("fails a pin that is too high, and says what to lower it to", () => {
    const scan = cleanScan();
    scan.violations.pop();
    const [failure] = judge(scan, rules());
    expect(failure?.kind).toBe("stale-pin");
    expect(failure?.message).toContain("Lower the pin to 1");
  });

  it("fails a pin whose folder is now clean", () => {
    const scan = { ...cleanScan(), violations: [] };
    expect(kinds(scan, rules())).toEqual(["stale-pin"]);
  });

  it("fails a pin whose folder is gone", () => {
    const scan = { ...cleanScan(), violations: [] };
    expect(kinds(scan, rules({ existingDirs: new Set() }))).toEqual([
      "stale-entry",
    ]);
  });

  it("fails a pin with no reason", () => {
    const pins = [{ dir: "src/a", count: 2, reason: " " }];
    expect(kinds(cleanScan(), rules({ pins }))).toEqual(["stale-entry"]);
  });

  it("holds a folder with no pin to zero", () => {
    const scan = cleanScan();
    scan.violations.push(hit("src/b/two.ts"));
    expect(kinds(scan, rules())).toEqual(["unpinned"]);
  });

  it("does not let a parent folder's pin cover a subfolder", () => {
    const scan = cleanScan();
    scan.violations.push(hit("src/a/deeper/three.ts"));
    expect(kinds(scan, rules())).toEqual(["unpinned"]);
  });

  it("fails when a file it must scan drops out of the scan", () => {
    const scan = { ...cleanScan(), files: ["src/b/two.ts"] };
    expect(kinds(scan, rules())).toContain("scope-narrowed");
  });

  it("fails, once, when the scan read nothing at all", () => {
    const scan: Scan = { files: [], violations: [], markers: [] };
    expect(kinds(scan, rules())).toEqual(["looked-at-nothing"]);
  });
});

describe("the escape hatch", () => {
  const marked = (reason: string, excusesSomething = true): Scan => ({
    ...cleanScan(),
    markers: [{ ...hit("src/b/two.ts"), reason, excusesSomething }],
  });
  const withPin = rules({ markers: { "src/b/two.ts": 1 } });

  it("passes a pinned marker that gives a reason", () => {
    expect(judge(marked("fixed by their brand rules"), withPin)).toEqual([]);
  });

  it("fails a marker with no real reason", () => {
    expect(kinds(marked("ok"), withPin)).toEqual(["marker-no-reason"]);
    expect(kinds(marked("fine -- //"), withPin)).toEqual(["marker-no-reason"]);
  });

  it("fails a new marker nobody pinned", () => {
    expect(kinds(marked("fixed by their brand rules"), rules())).toEqual([
      "marker-growth",
    ]);
  });

  it("does not call a folder improved because a line in it was marked", () => {
    const scan = cleanScan();
    const moved = scan.violations.pop()!;
    scan.markers.push({
      ...moved,
      reason: "fixed by their brand rules",
      excusesSomething: true,
    });
    expect(kinds(scan, rules())).toEqual(["marker-growth"]);
  });

  it("fails a marker pin left behind after the marker went", () => {
    expect(kinds(cleanScan(), withPin)).toEqual(["stale-pin"]);
  });

  it("fails a marker that excuses nothing", () => {
    expect(kinds(marked("fixed by their brand rules", false), withPin)).toEqual(
      ["marker-excuses-nothing"],
    );
  });
});

describe("the counter", () => {
  const read = (text: string) => scanText("x.ts", text);

  it("counts lines with a colour value, in three lengths", () => {
    const text = 'a: "#fff",\nb: "#2456d6",\nc: "#00000022",\nd: 6,';
    expect(read(text).violations.map((v) => v.line)).toEqual([1, 2, 3]);
  });

  it("skips comment lines", () => {
    expect(read('// was "#2456d6"\n * "#fff"').violations).toEqual([]);
  });

  it("reads a marked line as a marker, not a violation", () => {
    const found = read('a: "#ff6a13", // colour-ok: partner logo orange');
    expect(found.violations).toEqual([]);
    expect(found.markers[0]?.reason).toBe("partner logo orange");
    expect(found.markers[0]?.excusesSomething).toBe(true);
  });

  it("is not fooled by a colour value inside the marker's own reason", () => {
    const found = read('a: token, // colour-ok: used to be "#ff6a13" here');
    expect(found.markers[0]?.excusesSomething).toBe(false);
  });
});

describe("this repository", () => {
  const result = runCheck({ root: path.resolve(import.meta.dirname, "..") });

  it("agrees with its own pins", () => {
    expect(result.failures).toEqual([]);
  });

  it("is not passing by looking at nothing", () => {
    const pinned = PINS.reduce((sum, pin) => sum + pin.count, 0);
    expect(pinned).toBeGreaterThan(0);
    expect(result.remaining).toBe(pinned);
  });
});
