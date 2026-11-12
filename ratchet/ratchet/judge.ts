// Takes what the scan saw and what the pins say, and returns every way they
// disagree. No disk, no process: the whole of it is tested in judge.test.ts.
//
// Each failure message is written as the next step, because the reader fixing
// it may be an agent that reads nothing else.
import path from "node:path";

import type { Pin } from "./pins.ts";
import type { Hit, Scan } from "./scan.ts";

export type Failure = { kind: string; message: string };

export type Rules = {
  pins: Pin[];
  markers: Record<string, number>;
  mustScan: string[];
  minReasonWords: number;
  /** Folders that still exist on disk, so a pin for a deleted folder can fail. */
  existingDirs: Set<string>;
};

const at = (hits: Hit[]) =>
  hits.map((hit) => `    ${hit.file}:${hit.line}  ${hit.text}`).join("\n");

const words = (text: string) =>
  text.split(/\s+/).filter((word) => /[a-z0-9]/i.test(word)).length;

function groupByDir(hits: Hit[]): Map<string, Hit[]> {
  const byDir = new Map<string, Hit[]>();
  for (const hit of hits) {
    const dir = path.posix.dirname(hit.file);
    byDir.set(dir, [...(byDir.get(dir) ?? []), hit]);
  }
  return byDir;
}

function judgeScope(scan: Scan, rules: Rules): Failure[] {
  if (scan.files.length === 0)
    return [
      {
        kind: "looked-at-nothing",
        message:
          "The scan read no files. A check that looks at nothing must not pass. Fix SCAN_ROOTS.",
      },
    ];
  const seen = new Set(scan.files);
  return rules.mustScan
    .filter((file) => !seen.has(file))
    .map((file) => ({
      kind: "scope-narrowed",
      message: `${file} is no longer scanned. The rule has been narrowed. Restore it to the scan, or remove it from MUST_SCAN and say why in the same change.`,
    }));
}

function judgePins(scan: Scan, rules: Rules): Failure[] {
  const failures: Failure[] = [];
  const byDir = groupByDir(scan.violations);
  const pinned = new Map(rules.pins.map((pin) => [pin.dir, pin]));

  for (const [dir, hits] of byDir) {
    const pin = pinned.get(dir);
    if (!pin)
      failures.push({
        kind: "unpinned",
        message: `${dir} has ${hits.length} raw colour value(s) and no pin. New code is held to zero. Use a theme token:\n${at(hits)}`,
      });
    else if (hits.length > pin.count)
      failures.push({
        kind: "growth",
        message: `${dir} has ${hits.length} raw colour value(s), above its pin of ${pin.count}. Use a theme token for the new one. Do not raise the pin:\n${at(hits)}`,
      });
  }

  for (const pin of rules.pins) {
    const live = byDir.get(pin.dir)?.length ?? 0;
    if (!rules.existingDirs.has(pin.dir))
      failures.push({
        kind: "stale-entry",
        message: `${pin.dir} no longer exists. Delete its entry from PINS.`,
      });
    else if (pin.reason.trim() === "")
      failures.push({
        kind: "stale-entry",
        message: `The pin for ${pin.dir} has no reason. Say why it is excused.`,
      });
    else if (live === 0)
      failures.push({
        kind: "stale-pin",
        message: `${pin.dir} is clean. Delete its entry from PINS (it pins ${pin.count}).`,
      });
    else if (live < pin.count)
      failures.push({
        kind: "stale-pin",
        message: `${pin.dir} has ${live} raw colour value(s), under its pin of ${pin.count}. Lower the pin to ${live} in ratchet/pins.ts and add a line to the history.`,
      });
  }
  return failures;
}

function judgeMarkers(scan: Scan, rules: Rules): Failure[] {
  const failures: Failure[] = [];
  const byFile = new Map<string, number>();
  for (const marker of scan.markers) {
    byFile.set(marker.file, (byFile.get(marker.file) ?? 0) + 1);
    const where = `${marker.file}:${marker.line}`;
    if (!marker.excusesSomething)
      failures.push({
        kind: "marker-excuses-nothing",
        message: `${where} has a colour-ok marker on a line with no colour value. Delete the marker.`,
      });
    else if (words(marker.reason) < rules.minReasonWords)
      failures.push({
        kind: "marker-no-reason",
        message: `${where} has a colour-ok marker with no real reason ("${marker.reason}"). Give at least ${rules.minReasonWords} words saying why this value cannot be a token.`,
      });
  }
  const files = new Set([...byFile.keys(), ...Object.keys(rules.markers)]);
  for (const file of [...files].toSorted()) {
    const live = byFile.get(file) ?? 0;
    const pin = rules.markers[file] ?? 0;
    if (live > pin)
      failures.push({
        kind: "marker-growth",
        message: `${file} has ${live} colour-ok marker(s), above its pin of ${pin}. A marker is an exception someone must agree to. Use a token, or raise MARKERS for this file in a change that says why.`,
      });
    else if (live < pin)
      failures.push({
        kind: "stale-pin",
        message:
          live === 0
            ? `${file} has no colour-ok markers left. Delete it from MARKERS.`
            : `${file} has ${live} colour-ok marker(s), under its pin of ${pin}. Lower MARKERS for this file to ${live}.`,
      });
  }
  return failures;
}

export function judge(scan: Scan, rules: Rules): Failure[] {
  const scope = judgeScope(scan, rules);
  // A scan that read nothing would make every pin look stale. Say the one true thing.
  if (scope.some((failure) => failure.kind === "looked-at-nothing"))
    return scope;
  const markers = judgeMarkers(scan, rules);
  // Marking a line moves it out of the raw count, which would make its folder
  // look improved. It has not improved. Report the marker, not a stale pin.
  const newlyMarked = new Set(
    scan.markers
      .filter((marker) => !(marker.file in rules.markers))
      .map((marker) => path.posix.dirname(marker.file)),
  );
  const pins = judgePins(scan, rules).filter(
    (failure) =>
      failure.kind !== "stale-pin" ||
      ![...newlyMarked].some((dir) => failure.message.startsWith(`${dir} `)),
  );
  return [...scope, ...pins, ...markers];
}
