---
name: mine-your-transcripts
description: Use when you want to learn from your own past sessions with coding agents, to find the habits, corrections and fixes that keep recurring, write them up for other people, and turn them into rules your agents follow. A retrospective run over the written record instead of memory.
---

# Mine your own transcripts

A transcript is the written record of one session with a coding agent: every
message, command and result. Over months they hold what you corrected, what
went wrong twice, and what you settled on. Read them back on purpose, keep only
what recurs and can be checked, write it up, and feed it back into how your
agents work. Then read the next months of transcripts to see if it held.

## Keep the raw material private

1. Pick one folder for mined notes, outside every repository, so nothing
   with a real project, client or person name in it can be committed.
2. Names, paths and quotes are allowed there and nowhere else.
3. Read the sources only. Do not edit, commit or run anything in the
   projects you are mining.

## Mine

1. Choose the record: session transcripts, logs of failed commands, decision
   records. Sample a fixed number of sessions, newest first, and write the
   sample down.
2. Give a reader (usually a model, often a sub-agent: a second agent started
   for one task) a brief that says what to look for, such as what the person
   corrected, what failed twice, or what was settled.
3. Every note cites one session and quotes one line from it. Before a note
   counts, check the line is in that session. Mark a note you could not check
   as relayed, and do not count it.
4. Count each habit across distinct sessions and distinct projects. Set a bar
   before you look, such as three sessions or two projects. A preference
   stated once is not a pattern.
5. Before you record a gap (one project has a habit another lacks), check the
   habit does not live somewhere else, such as a rule set for every project
   or another tool. If it does, drop the gap.

## Distil

1. For each habit that clears the bar, write a sketch: the situation, what
   pulls in different directions, what goes wrong with the plain form,
   what you settled on, and its limits. Keep the evidence in a separate appendix that stays private.
2. Rewrite the sketch with no project, client, product or person names and
   no paths. Read every number again from its source.
3. Run a name scan over the rewritten text, against a list of every project
   and person name. The rewrite is how names come out; the scan is the
   backstop. If the scan finds a name, rewrite the line. Do not add the name
   to an allow list.
4. Write a small runnable example, run it, and keep its real output.
5. Give the finished page to a cold reader, a reviewer who has not seen the
   sources, and fix what they could not follow. A person approves the wording.

## Encode

1. Turn the pattern into something your agents load: a rule, a check or a
   skill. Date it.
2. Keep your own version thin. Point at the public steps and add only your
   own choices.

## Repeat

1. On the next pass, look for each encoded habit in sessions dated after its
   rule. If it is still there, the rule did not hold: revise the rule, not the
   count.
2. If you run the miner on a schedule, run one piece at a time, read only,
   writing only to the private folder, and leave a short note saying what it
   wrote and what stopped it.

## What it does not do

It finds what recurs, not what matters. A habit seen often may be trivial,
and a rare one may be the most important thing in the record. Sampling the
newest sessions favours whatever you were doing lately. A model reader can
note things that are not there, which is why each note quotes a line that is
checked. Transcripts hold secrets and other people's names, so never publish
one, and never copy raw notes into a repository.
