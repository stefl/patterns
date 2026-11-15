---
name: claims-ledger
description: Use when writing or maintaining documentation, a status page or a public statement whose sentences describe what the system does, so that a sentence that stops being true fails a check. Keeps a ledger of factual sentences, each with its evidence.
---

# Claims ledger

Documentation drifts because nothing fails when a sentence stops being true.
A ledger lists each factual sentence beside its evidence, and a check fails
when either side moves.

## Before you start

Decide which sentences are claims. A claim says what the system does or did:
a timeout, a format, a schedule, a count. Opinion, advice and explanation are
not claims. Start with one page.

## Build it

1. A ledger row holds the sentence, word for word, and one piece of evidence.
   Use a few kinds:
   - code: a file and a string that file must still contain;
   - command: what was run, the date, and the one-line result;
   - person: who vouches for it, and the date.
2. The check fails when a ledger sentence is no longer on its page, so
   editing a sentence sends someone back to its evidence.
3. It fails when a code file no longer contains its string. The message says
   to check the sentence is still true, not to fix the string.
4. Command and person evidence expires. Pick an age (fourteen days is a
   reasonable start) and fail when evidence is older.
5. Never type a count into prose. Compute it from the source at build time.
6. For a known defect, invert the evidence: name the string the fix will
   add, so the check fails once the fix lands, until someone updates the
   page that discloses the defect.

## Prove it can fail

Change a value in the code, rewrite one sentence, and move the clock past the
age limit. Each should fail with its own message.

## What it does not do

It holds only the sentences in the ledger. A new factual sentence with no
row passes. Code shows what was set up, not what is running, so prefer a
command's result for anything about live behaviour. A citation that resolves
is not the same as a sentence that is true; for that, have a reader who has
not seen the ledger read the built page and question each sentence.
