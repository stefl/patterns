---
name: two-way-registry
description: Use when a codebase has a kind of thing with no single home (environment variables, log events, model calls, screens, feature flags) and a hand-kept list of them has drifted. Keeps one typed list and checks it against the code in both directions.
---

# Two-way registry

A registry is one typed file that lists every instance of one kind of thing.
A list nobody checks is just a document, and its types make it look truer than
it is. The check has to fail both ways.

## Before you start

1. Choose one kind of thing that a script can find in the source: a function
   call, a naming pattern, a database column.
2. Check how far the existing list has drifted. That number is the case for
   doing this.

## Build it

1. The registry file holds names and facts, never values. Nothing at run
   time should read it, so editing it cannot change what the product does.
2. The check finds every use in the source by itself. Nobody keeps a list of
   what to check, so a new use fails until it gets a row.
3. Fail on a use with no row, and on a row nothing uses. The second half is
   what keeps the list short enough to read.
4. Exceptions are rows in a named list beside the registry: file, name and a
   written reason. Fail on an empty reason, and fail on an exception whose
   use has gone.
5. Generate any page people read from the registry, commit it, and fail
   when the committed page differs from a fresh render.
6. Fail when the scan finds no source files.
7. Write every message as the next step: "Add a row", "Delete the
   exception".
8. Run it where it can block a change, and again before each release, against the
   version of the registry being released.

## Prove it can fail

Cause each failure once: add a use with no row, delete the code behind a
row, remove an excepted use, empty a reason, hand-edit the generated page.
Watch each fail with its message, then undo it.

## What it does not do

The scan matches text. It knows a file reads a name, not why. It checks that
a reason is written, not that it is true. Names built at run time cannot be
read from source; count those per file and hold the count where it is.
