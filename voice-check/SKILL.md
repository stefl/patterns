---
name: voice-check
description: Use when an AI agent drafts text a person will send or publish under their own name (a page, an essay, a report, an email, a note to their team), or writes a brief for another agent, to keep each in the right voice for its reader. Name the register and the reader first, have a model that has not seen the session write it, check it against a profile measured from their own writing in that register until it passes, read it cold, and fold every correction back in with its date.
---

# Voice check

A style guide that an agent reads is easy to drift from. This one is measured
from the person's own writing, checked by a script before anyone reads the
draft, read cold by a reviewer, and updated every time the person corrects a
draft. Scores go beside every draft.

## Name the register and the reader first

1. Before any words, name the register: what kind of writing this is. Keep
   each register's reader, purpose and rules in its own file. A useful set:
   - a page or screen;
   - an essay in their own voice;
   - a report on someone else's work;
   - an email to someone outside the team;
   - a note to their own team;
   - a brief for an agent;
   - an agent's reply to the person.
2. Name the reader with a short brief. A site with no brief gets one before
   its copy is written. The brief says:
   - who arrives;
   - what they already know, which is never explained;
   - what they don't know, which gets one line and a link the first time;
   - what they want, and what puts them off.
3. Load only that register's rules. Rules written for one reader can be
   wrong for another. The commonest leak is from the last register into the rest:
   the rules for how an agent should report to the person ("gloss every
   term", "bottom line first") make a public page explain what its readers
   already know.
4. Write down, in each register's file, what it never borrows.
5. One piece can mix registers, such as a pull request description with a
   line for the person and a brief for the next agent. Each part names its
   own register and follows only its rules.

## Write with a clean model call

The agent asking for the draft carries its own instructions and the whole
session, and both leak into the words. Have a model that has seen neither
write it.

1. Write down the facts the piece may use, in a file.
2. Send a new model call only four things: the register's rules, the reader
   brief, the facts and the task. Start it the way the cold reader pattern
   does, with a new process in an empty folder. Its environment holds the
   path and home folder only. It gets no settings or instructions file, no
   tools, no tool servers and no saved session.
3. Ask a canary first, and stop unless the model cannot answer it.
4. Tell the writer to mark a missing fact (`[MISSING: ...]`) rather than
   invent one, and fill each from the records, not by guessing.
5. Save everything sent beside the draft, so anyone can check what the writer
   saw.

## Build the profile from their real writing

1. Collect writing the person wrote and sent themselves, with no model in the
   loop. Group it by register, as in the list above. Each register gets its
   own measurements.
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
   most once per piece. A model given an example sentence as a rule will copy
   it word for word; say the example shows the order, not the words.
6. Where a register has no corpus of their own writing yet, say so, and gate
   it only on rules they have stated. Never invent a band for it.

## Run the mechanical check until it passes

1. Write a script that takes the register and reads the draft, printing one
   line per hit, with the line number: struck phrases, absolutes aimed at
   people or their work ("nobody checks", "nothing records"), a dash they do
   not type, and any paragraph over that register's limit. Each register has
   its own gate. A page might fail a sentence with more than two commas. A
   brief for an agent might fail when it doesn't say what done looks like.
2. Given the reader brief, flag a gloss straight after a term the brief says
   this reader already knows.
3. Skip quoted text and code, so quoting someone else's words is allowed.
4. Exit with an error when the draft fails, so an agent can loop on it.
5. Fix every listed line and run it again. Stop at a pass or after three
   rounds, and say which.

## Read it cold

1. Render the draft to plain text, in reading order. For a page, include
   labels and captions, never the source file.
2. Give a fresh reviewer only that file, the reader brief and a rubric: fixed criteria, each
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
text, which keeps its own voice.

An agent's replies to the person are a register of their own, with rules the
person sets. Name it so its rules stay fenced. Write it in the session, though:
a cold writer cannot know what happened.

The script counts; it cannot tell a polite sentence from a cold one without a banned
word in it, which is what the reader is for. A profile built from old
writing describes who they were then, so date it and say so. A rule tuned
for one reader can be wrong for another: a rule written to help a
non-technical client can make a public page read as if written for a child,
and that is what the register and the reader brief are for.
