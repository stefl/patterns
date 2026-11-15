---
name: failure-register
description: Use when coding agents keep hitting the same failed commands across sessions, or when deciding which agent mistake to fix next. Logs failed commands with a script, groups them into kinds, and reports a failure that returns after its fix as a regression.
---

# Failure register

An agent that runs a failing command reads the error, tries another way and
carries on. The task finishes, so the failure is invisible unless something
records it. Record it with a script, not the model.

## Capture

1. When a session ends, a hook (a script the agent tool runs at set moments)
   reads the transcript and appends each failed command to a log, one JSON
   line each: time, repository, command, error. Include sub-agents, the
   helpers a main agent starts. That is often where most failures
   are, and the main agent never sees them.
2. The hook must cost no model calls, never block the session, and stay
   silent if it breaks.

## Group and rank

1. Reduce each error to a kind: replace paths, numbers, ids and quoted
   values with placeholders, so one cause gives one kind.
2. Rank kinds by count. Read a few examples of the top kind before acting.
   The count says what failed, not why.
3. Check the grouping. A search that finds nothing and exits with an error
   is not a failure. Remove kinds like that before you rank.

## The register

1. When you fix a kind, add a row: the kind, the repository, the time the
   fix landed, and what the fix was.
2. Failures of that kind from before the fix stop counting in the ranking.
   Show them as suppressed; do not delete them.
3. A failure of that kind after the fix, in the same repository, is a
   regression. Report it as "the fix did not take".
4. A failure in a repository the fix never reached is not a regression.

## Turning kinds into fixes

The cheapest fix is often a hook before each command that rewrites a known
bad form into a working one. Log each rewrite, so you can see what it absorbs.
If a hook that rewrites or blocks commands cannot tell whether a command
is a known bad form, have it let the command through.

## What it does not do

It needs volume. With one agent and a few sessions a week there may be
nothing worth ranking. The grouping can put a failure under the wrong kind,
and when it does the ranking points at the wrong thing.
