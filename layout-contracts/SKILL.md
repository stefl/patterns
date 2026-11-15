---
name: layout-contracts
description: Use when a component library or app has layout bugs that lint, type checks and screenshot tests miss (an underline that stops short, a control a few pixels taller than its neighbours, uneven gaps). Names each component, records its rendered box in a real browser, and judges the boxes against written rules.
---

# Layout contracts

Lint reads source, type checks read types, screenshot tests say the pixels
changed. None of them reads where the browser put each box, which is where
some layout bugs live. Give the page a vocabulary and check the boxes.

## Before you start

You need a way to render each component in a real browser in a test, such as
Storybook, a tool that renders each component on its own, with its test runner. Agree a short list of sizes first:
control heights, gaps. A rule needs a number to hold to.

## Build it

1. Name the parts. Each component carries one attribute saying what it is,
   such as `data-part="row.title"`. Keep a registry of the names: purpose,
   which parts it may sit inside, which rules apply to it.
2. Measure. After each component renders, walk the elements and record each
   named one as a box: its name and rectangle.
3. Judge. Write a function that takes the boxes and the registry and returns
   violations. It never touches the page, so most of it is tested without a
   browser. Start with three or four rules you have actually seen broken.
4. Count boxes that do their own layout but carry no name. They are where
   the rules cannot reach.
5. Hold the counts with a ratchet. Record each file's violation and unnamed
   counts; they may only go down.
6. Write each message with the numbers: "30px tall; allowed: 28, 36".

## Review

The judge catches only what a rule describes. Capture screens with the boxes
drawn, number what looks wrong, and have a person rule on each. An accepted
finding becomes a fix or a new rule. A rejected one is written down so it is
not raised again.

## What it does not do

It does not judge anything unnamed, or anything no rule describes. It is not
a replacement for looking at the screen; it makes what you saw once stay
fixed.
