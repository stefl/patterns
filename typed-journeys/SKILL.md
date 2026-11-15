---
name: typed-journeys
description: Use when a product's main user paths are kept as a diagram or scenario file that has drifted from the code, or when someone asks for documentation of what the system does for a person who does not read code. Declares each journey in code against the real event names and generates the prose.
---

# Typed journeys

A journey is a short ordered list of milestones from one person's point of
view: sign up, create something, finish the task, read the result. Declare it
in code, typed against the events the system already records, and generate
everything written in English from it.

## Before you start

The system needs a fixed list of event names in code. If a milestone records
nothing, it can stay on the map as explanation, but the test will skip it.

## Build it

1. A journey is a constant: name, actor, and steps. Each step names an event
   from the existing typed list, so renaming the event fails the type check.
2. A step is something everyone on the path does. Ask: has a person who
   skips this failed at anything? If not, it is optional and does not belong
   on the journey, or everyone who skips it is counted as a drop-out.
3. A walk function: given a recorded list of events, pass when the steps
   appear in order. Other events may come between them.
4. A generator writes one document per journey. Commit it and fail when the
   committed text differs from a fresh render. Run that comparison outside
   any cached test task, or a change that only edits the document replays an
   old pass.
5. Every event is on a journey or on an "off-journey" list with a one-line
   reason. Fail an event on neither, and an event on both. Pin the length of
   the off-journey list in the test, so adding an excuse is a visible change.

## Prove it can fail

Rename an event, add an event to no journey, put a listed event on a
journey, and hand-edit a generated document. Each should fail with its own
message. Then add an optional step and watch a finished run fail.

## What it does not do

The walk proves order, not count: it cannot tell once from nine times. The
reasons on the off-journey list are read by people, not tested, and the list
tends to grow. The pin makes the growth visible; it does not stop it.
