---
name: overnight-hunt
description: Use when more changes land each day than anyone can try by hand, and you want an agent to look for bugs a tester would notice, overnight, without filing noise. A finder reads the day's changes, a separate refuter tries to disprove each finding, and a night with no findings file is reported as broken, not quiet.
---

# Overnight hunt

Tests catch what someone thought to test. An agent can read the day's
changes and go looking for the rest, but an unchecked agent files plausible
noise. The work is in what you let through.

## Before you start

Write two prompts and keep them in files: one for the finder, one for the
refuter. The finder's prompt asks fixed questions of every change (which
states give nothing or the wrong thing, which inputs give a wrong value,
what happens on a second click or a missing value) and gives the exact shape
of the file it writes. The refuter's prompt starts from the view that the
claim is wrong.

## Build it

1. Each night, a script (not a model) builds the brief: every change merged
   since the last run, with its diff, and the findings already raised.
2. The finder runs headless, with read tools and permission to write one
   file, a turn limit, and no sub-agents. A sub-agent's work is lost when
   the finder's turn ends, so the night ends with no file.
3. Every finding names a file and a line. Tell the finder to write its file
   after the first change it reads and after every one since, so a run cut
   short still leaves something, and to write it even when it finds nothing.
4. If there is no findings file, the night is broken: say so and mark the
   run failed, so the next night reads the same changes again. An empty
   list in a file that exists is a quiet night, and is a good result.
5. For each finding, start the refuter in a new session that has never seen
   the finder's reasoning. Give it the claim and the code. It looks for the
   guard that would stop the bug (an earlier check, a caller, a loader, a
   type) and returns confirmed, refuted with the guard's file and line, or
   could not try.
6. Report only what was confirmed. To begin with, file nothing: a person
   reads the report each morning. File automatically only once most
   reported findings turn out real, with a cap on how many a night can file.
7. Check the severity of what survives. A real bug can be reported as worse
   than it is, and the refuter's reading is often the one that narrows it.

## When a finding is wrong

Say why when you close it, in a form the hunt can read next time. A rejected
finding that is raised again is a cost.

## What it does not do

It finds what an agent can see from the code and the rules. A disproof
agent can be wrong in either direction. Count how many filed findings were
real, and stop widening the hunt if the number falls.
