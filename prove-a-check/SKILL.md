---
name: prove-a-check
description: Use when adding or changing an automated check (a test, a lint rule, a build step that can block a change), or when a check has only ever passed. Shows the check can fail before anyone trusts it to pass.
---

# Prove a check

A passing check has either looked and found nothing, or not looked at all, and
the two look the same. Before you trust a check, watch it fail.

## For every new or changed check

1. Run it on the code as it is. It must pass. If it already fails, stop: the
   result is "unproven", not "proven", because a check that is already red
   cannot show you that your mistake turned it red.
2. Add one mistake the check exists to catch. Run it. It must fail, with a
   message that names the mistake.
3. Take the mistake out. Run it again. It must pass.
4. Put the failure message, word for word, in the description of the change.

Do this in a throwaway copy of the code, never in the copy you are working in.

## Things that make a check pass without looking

Look for each of these when a check seems too quiet:

- It reads a folder or a list of files that does not exist, or is empty.
  Have it print how many files it read, and fail when the number is zero.
- Its output goes through a pipe (`check | tail`). The pipe reports the last
  command's success. Run checks bare and read their own exit code.
- A rule it relies on is switched off in a config file.
- It runs where the mistake cannot show: the wrong screen width, the wrong
  sample data, the wrong surface for a measurement.
- A cache replays an old pass.
- It is not in the job that can actually block a merge.
- A scheduled job's steps were all skipped and the run still shows success.
  Name the step that must have run.

## Three answers, not two

A check reports pass, fail, or could not check. "Could not check" fails the
build until someone looks.

## What it does not do

One injected mistake shows the check can fire. It does not show it fires for
every form of the mistake. A proof also ages: the code around the check moves
after the day you saw it fail. Re-prove a check when you change it.
