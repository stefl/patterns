---
name: overnight-hunt
description: Use when more changes land each day than anyone can try by hand, and you want an agent to look for bugs a tester would notice, overnight, without filing noise. Every finding cites a rule or a line, a second agent tries to disprove it, and a night that did not run says so.
---

# Overnight hunt

Tests catch what someone thought to test. An agent can read the day's
changes and go looking for the rest, but an unchecked agent files plausible
noise. The work is in what you let through.

## Before you start

Write down the rules a tester would check against: what the product must do,
in sentences. A finding has to point at one of them, or at a line of code.
Without that list the hunt has nothing to stand on.

## Build it

1. Each night, start from what changed since the last run: merged changes,
   with their descriptions.
2. The hunting agent returns findings in a fixed shape: what is wrong, how to
   see it, and what it cites (a rule or a file and line). Drop any finding
   that cites neither, without reading it further.
3. A second agent, which has not seen the first one's reasoning, tries to
   disprove each finding. Give it the finding and the code, not the saved log
   of the hunt's session.
4. File only what survives. Hold a finding with no second opinion; do not
   file it.
5. Record each night: did it run, how many changes it read, what it found.
   The morning report says "did not run" and "read nothing" in plain words,
   so silence is never read as a clean night.
6. Start on a schedule with one area of the product, and widen it once the
   filed findings are mostly real.

## When a finding is wrong

Say why when you close it, in a form the hunt can read next time. A rejected
finding that is raised again is a cost.

## What it does not do

It finds what an agent can see from the code and the rules. A disproof
agent can be wrong in either direction. Count how many filed findings were
real, and stop widening the hunt if the number falls.
