---
name: stop-labels
description: Use when running several coding agents at once and a person has to tell, from outside, which stopped sessions need them. Every turn ends with one label from a closed list, and an unlabelled stop is refused once.
---

# Stop labels

When an agent stops, it has finished, or it is waiting on something, or it
wants a person to decide, merge or do a manual step. From outside these all
look idle. The agent is the only one who knows which, so make it say so.

## The labels

Use a closed list. The one this skill was written from has eight:

- Asks a person: `merge-ready`, `choose`, `go-ahead`, `manual-step`, `stuck`.
- Asks nothing: `stopping`, `still-working`, `waiting`.

Before you build anything, take the last 40 stopped sessions, read each
final message, and try to give each one label. Add or merge labels until most
fit one. Expect some that need two.

## Build it

1. A command the agent runs to label its turn. It refuses an unknown label
   and lists the real ones.
2. Every label that asks a person needs a one-line note saying what is asked.
3. Where a label can either block the work or not (a choice with a safe
   default, say), require a yes or no flag for "this blocks".
4. A stop hook (a script the agent runtime runs when the agent stops). If
   the turn has no valid label, refuse the stop once and put the whole list
   of labels in the reason. Never refuse a stop that follows a refusal.
5. Fail open. A broken label file, an error in the hook, or a sub-agent's
   stop lets the stop through. Drop a label older than the turn could be.
6. Show the labels where the person looks, sorted into "needs you, blocks",
   "needs you, can wait" and "nothing needed".

## Measure the cost

Log every refusal: time added and extra model calls. A refusal makes the
model re-read its context, so it is not free. Tell the agent the rule at the
start of each session and the refusal rate should fall.

## What it does not do

A label is a claim. It is true when written and may be stale when read. If
accuracy matters, have a second reader label the same turns blind and count
how often they agree.
