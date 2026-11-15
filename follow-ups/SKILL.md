---
name: follow-ups
description: Use when a change is merged or a task ends with a step only a person can do (paste a key, delete an old secret, re-run a sync that needs their login), or when adding a feature flag or starting an experiment. Files one item per step, waiting on a fact, readable days later.
---

# Follow-ups

A merged change is often not finished. The rest is a step only a person can
do, and it is usually not due yet. A line in the change description or the
last message of a chat has nothing that brings it back when it is due.

## Filing a step

1. File one item per step, where the person already looks for open work.
   Mark it as waiting on a person.
2. Give it a trigger, the fact it waits for, in a form a script can test:
   a change number has merged, a date has arrived, someone has stated a
   named fact, or "manual". An item may need several triggers to all fire.
   Key a merge trigger on the change number, not the branch name, because
   branches are often deleted on merge.
3. Write the body for someone with none of your context: a `then:` line with
   the exact step (command, page, button), and a `proof:` line saying how
   they will know it worked.
4. Before filing, look for an open item that is the same step. If there is
   one, add a note to it instead.
5. Record where the item came from without making the source wait on it. The
   source can close while the follow-up stays open.

## What is not a follow-up

- "Merge the change". The open change is its own reminder.
- "Click through it after it merges". That belongs to the normal review of
  the change, not a separate item.

## Work that should end

Give it its end when you start it:

- A feature flag (a switch that turns new code on or off) gets a removal
  item in the same change, waiting on the change that adds it.
- An experiment gets a written hypothesis first: what you will measure, by
  when, the value that means success and the value that means stop.
- "Later" becomes a condition someone can check.

## What it does not do

A trigger makes an item come due. It does not make anyone act. The list can
still grow faster than it is cleared, so count it and say so.
