---
name: machine-scores
description: Use when a model sorts a list too long for a person to read (names, candidates, leads, findings) and you are tempted to let it drop the weak ones, or when a model with web search is asked whether something is safe to use. The model scores and never rejects; its verdict is rebuilt from the evidence that survives a check.
---

# Machine scores, only a human rejects

A model can rank hundreds of items in minutes. Letting it remove the weak
ones looks like the same job, but a removed item leaves the view and nobody
argues with it. Keep the two apart: the model writes a score, and only a
person changes an item's status.

## The long list

1. Give the scoring pass one field it may write: the score. It never changes
   an item's status.
2. If the reply leaves an item out, or the call fails, give the item a middle
   score and keep it. A missing score is not a low one.
3. Record a reason on every rejection, naming who made it: a score threshold,
   a lookup, or a person. Do not backfill a reason onto old rows that have
   none, because then the reason no longer says who decided.
4. If the machine ever did reject, write the undo against that reason, so it
   restores the machine's rejections and leaves the person's alone. Make sure
   it clears the field everywhere the list is shown, not only in one copy.
5. Keep rejected items in the list, and compare each new candidate against
   all of them, so a rejected item does not come back under a new spelling.

## Asking a model whether something is safe to use

1. Open every link the model returns. Drop a finding whose page is not
   found. Keep a page that exists but could not be read, and label it.
   Tell the model in the prompt that this will happen.
2. Rebuild the verdict from the findings that survived: take the worst
   severity among them. An empty list is low risk, whatever the model said
   at the top.
3. Ask two models the same question side by side. The worse reading wins,
   and where they differ, print that they disagreed beside the finding.
4. Where a lookup can answer (a name-server lookup for a web address, a
   register for a trademark), use the lookup and not a model.
5. Treat a check that did not run as unknown, not clean. Lower the best
   score an item can reach for each one, so a run where every check failed
   cannot score full marks.

## When a person disagrees with the rubric

Change the rule, write down the case and the reason, and add the case to a
test that replays it on every run. A rule changed only in prose drifts back.

## What it does not do

It does not decide anything. A list kept whole is still long, and "the worse
reading wins" raises false alarms that a person has to clear. It is triage
for a person's judgement, not legal or any other clearance.
