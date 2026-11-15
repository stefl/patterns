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

1. Write the reader's brief once and keep it in a file: who the reader is,
   the rules the page is held to (every page is page one; introduce before
   you refer; define a term once), the kinds of unresolved reference
   ("the X", a name, a term, a line that assumes another page), a severity
   for each, and "quote the exact text and suggest a rewrite of its first
   mention".
2. Call the model so that nothing but the brief and the screen reaches it:
   a new process for each call, started in an empty folder, with an
   environment of the path and home folder only, no settings files, no
   instructions file, no tools, no tool servers and no saved session. Ask
   for the reply in a fixed structure, so it can be counted.
3. Ask a canary first: two or three questions only your own setup could
   answer, such as the project's name or the file the page is built from.
   Stop unless every answer is "cannot tell". Check the questions on a
   cold run before you trust them: one that a cold model can answer
   honestly ("what was said earlier?" gets "nothing") makes every run
   look warm.
4. Drop any finding whose quote is not on the page. The model made it up.
5. Before you compare two drafts, read the same unchanged draft twice and
   see how far the runs agree. Compare drafts on the count of findings
   over several runs, not on which findings one run raised.
6. Fix every finding, or record why it is fine: the reference, the reason
   and the date. Give that record to the next run so a ruled-on finding is
   not raised again.
7. Read again after the fixes, cold, in a new process.

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
