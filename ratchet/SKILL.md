---
name: ratchet
description: Use when switching on a lint, test or style rule over a codebase that already breaks it. Adds a count per folder that may only go down, in place of an exemption list.
---

# Ratchet

A ratchet holds a rule over existing debt. Record how many times each folder
breaks the rule today (a pin), fail the check if a folder differs from its pin,
and hold anything without a pin to zero. Fixes lower the numbers and the new
numbers stay. Do not use an exemption list for this: an exemption names a place,
not how bad the place is allowed to get.

## Before you start

1. The rule must be countable by a script. If a person has to judge each case,
   this is the wrong tool.
2. Pick the smallest scope that makes sense, usually one folder. Pins that
   cover a folder and everything under it hand a new subfolder the old excuse.
3. Check how many violations there are. If it is a handful, fix them and
   switch the rule on with no pins.

## Build it

1. Write the counter: given a folder, return the number of violations in the
   files directly inside it, not in its subfolders. A crude counter, such as
   matching lines, is fine. It only has to move when the code does.
2. Write the pins file: one number per folder. Add a written reason beside each if you can; the small version on the page leaves reasons out.
3. Write the check. It compares the live count with the pin and fails on
   any difference, not only when the count is higher. A change that removes a
   violation then has to lower the pin in the same diff. A folder with no pin
   is held to zero.
4. Make the check fail on a pin whose folder is gone and on a scan that
   finds no folders at all. If you record reasons, fail on a pin with none.
5. Write every message as the next step, with the number: "Lower the pin to 1
   in pins.json". Whoever reads it may be an agent with nothing else to go on.
6. Run the check as part of the build, so a failing check stops the change.

## Prove it can fail

Add one known violation to a folder, run the check, and confirm it fails.
Remove it and confirm the check passes. A check that has only ever passed
has not been shown to look at anything.

## When the check goes red

Fix the code. Do not raise a pin to make the check pass. A count that goes up
is a question about the code or the counter, not a new allowance. If the
counter is the problem, fix the counter and re-measure every pin in the same
change.

If you have to raise a pin, say why in the pins file, in a dated line.

## What it does not do

It does not say whether the rule was a good one. It does not stop the code
getting worse in a way the counter cannot see, such as moving violations to a
folder the scan does not read. Keep the scan's reach written down, and check
that the files you expect it to cover are still covered.
