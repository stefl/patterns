---
name: cold-reader
description: Use before a web page or screen ships, to have a reviewer that sees only the rendered text, with no code, conversation or other pages, flag every name, term or "the X" a first-time visitor could not resolve.
---

# Cold reader

A reviewer who saw how a page was made will understand it, and so will not
see what a stranger cannot. Take everything away except what the page shows,
ask fixed questions, and prove the reviewer really was cold.

## Before you start

1. Render the page's text to a plain file, in the order a visitor reads it:
   headings, prose, labels on controls, captions and text drawn over
   pictures. Never give the reviewer the source file. The names of a page's
   parts (its components) and the comments in the code resolve references
   the visitor never sees.
2. Decide who the real reader is and write it down in one line. Do not give
   the reviewer a persona younger or less able than that reader. A reviewer
   told to read as a novice asks for rewrites that read as talking down.

## Build it

1. Run a mechanical scan first: list each capitalised name whose first use
   does not say what it is, and each "the X" where nothing earlier on the
   page mentions X. It over-flags. Fix the real ones before spending a model
   run.
2. Start the reviewer in a fresh context with nothing loaded but the text
   file and a short list of fixed questions:
   - what is this page about, in one sentence;
   - who is it for;
   - every name, term or "the X" you could not explain from the page alone,
     in page order, each with a suggested first-mention rewrite;
   - a canary: one question whose answer is only in the source or the
     conversation, such as the file the page is built from. A cold reader
     answers "not on the page".
3. Discard any run that answers the canary. It may have seen more than the
   page, or guessed; either way it is not cold.
4. Before you compare two drafts, run the reviewer twice on the same
   unchanged draft and see how far the runs agree. Runs differ. Compare
   drafts on the count of flags over several runs, not on which flags one
   run raised.
5. Fix every flag, or record why it is fine: the reference, the reason and
   the date. Give that record to the next run so a ruled-on flag is not
   raised again.
6. Read again after the fixes, cold, in a new context.

## Prove it can fail

Copy the page, add one name it never introduces, and run the reviewer on
the copy. If the name is not flagged, the reviewer is not reading closely
enough to trust a clean result. For a stronger test, write down what you
expect it to find before you run it, and plant a few known faults whose list
you keep where the reviewer cannot see it.

## What it does not do

It finds references a visitor cannot resolve. It does not check that the
page is true, or that the page is worth reading. A set of pages read in order
counts as one page: introduce a term once in the set, not on every screen.
