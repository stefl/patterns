---
name: voice-check
description: Use when an AI agent drafts text a person will send or publish under their own name (a report, an email, a page, product copy), to keep it in their voice. A profile measured from their own writing, a mechanical check run until it passes, a cold reader that sees only the rendered text, and every correction folded back into the lists with its date.
---

# Voice check

A style guide that an agent reads is easy to drift from. This one is measured
from the person's own writing, checked by a script before anyone reads the
draft, read cold by a reviewer, and updated every time the person corrects a
draft. Scores go beside every draft.

## Build the profile from their real writing

1. Collect writing the person wrote and sent themselves, with no model in the
   loop. Group it by kind of writing: essay, report, email, page or product
   copy, brief to their own team. Each kind gets its own section of the profile.
2. Measure, rather than describe from memory: paragraph length (median and
   95th percentile), sentence length, which dash they type, how often they
   contract, how often they hedge and what they hedge.
3. List the words and phrases their writing never uses. A word with zero
   hits across the samples is a candidate for the struck list; a word they
   do use stays off it, even if a published list of "AI words" bans it.
4. Keep the samples private. The profile carries numbers, descriptions of
   each habit and at most a few short fragments. Note what it was built from
   (how many pieces, which years) and the date.
5. Quoted fragments in the profile are evidence, not a kit. Use any one at
   most once per piece.

## Run the mechanical check until it passes

1. Write a script that reads the draft and prints one line per hit, with the
   line number: struck phrases, absolutes aimed at people or their work
   ("nobody checks", "nothing records"), a dash they do not type, and any
   paragraph over the profile's limit.
2. Skip quoted text and code, so quoting someone else's words is allowed.
3. Exit with an error when the draft fails, so an agent can loop on it.
4. Fix every listed line and run it again. Stop at a pass or after three
   rounds, and say which.

## Read it cold

1. Render the draft to plain text, in reading order. For a page, include
   labels and captions, never the source file.
2. Give a fresh reviewer only that file and a rubric: fixed criteria, each
   scored 0 to 2, each with a real before and after. Nothing about how the
   draft was made. See the cold reader pattern for how the reviewer lists
   every reference a first-time visitor could not follow.
3. The reviewer quotes every line that cost a point and suggests a rewrite.
4. Set a threshold that counts as ready (a total, no zero on any criterion)
   and revise until the draft reaches it or the rounds run out.
5. Never let a rewrite add a claim the records do not support.

## Fold every correction back in

1. When the person strikes a line or says how a draft sounds, record it in a
   dated log: their words, the line they reacted to, what replaced it, and
   the rule it implies. Add entries at the bottom; never rewrite old ones.
2. If the rule can be counted, add it to the script's list with the date. If
   it needs judgement, add it to the rubric with the before and after.
3. Refresh the date on the profile each time it changes.

## Calibrate

1. Keep two versions of one piece: the draft the person rejected and the
   version they approved. The script and the rubric should separate them.
2. When a threshold moves, run both again.

## Show the scores

Every draft goes to the person with the script's result, the judged total,
any criterion under full marks with its quoted line, and what the check
cannot see.

## What it does not do

It is for drafting as the person. It is not for editing text they wrote
themselves: change only what they asked, in their words, or the loop's
rewrites replace their voice with the model's. It is not for someone else's
text, which keeps its own voice, or for the agent's own replies. The script
counts; it cannot tell a polite sentence from a cold one without a banned
word in it, which is what the reader is for. A profile built from old
writing describes who they were then, so date it and say so. A rule tuned
for one reader can be wrong for another: a rule written to help a
non-technical client can make a public page read as if written for a child.
