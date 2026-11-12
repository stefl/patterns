# Ratchet

A small, runnable example of a ratchet check, named after the tool that turns one way only. A rule is switched on in a codebase that already breaks it, and the number of breakages, counted folder by folder, may only go down.

Written by [Stef Lewandowski](https://stef.io).

## The problem it answers

Say you want a new rule in a codebase that already breaks it in four hundred places. Fixing all four hundred first rarely happens. The usual alternative is an exemption list, a file naming the places the rule is allowed to skip. It works on the first day and tends to be forgotten within a month.

I've found the exemption list wears out faster when coding agents do most of the typing. A coding agent is an AI tool, such as [Claude Code](https://claude.com/claude-code), that writes and edits code on your behalf. An agent that meets a failing check and an exemption list will often add a line to the list, because that is the cheapest way to make the check pass.

A ratchet is the middle path. You write down today's count for each folder, which I call a pin. In the plain form the check fails if the count goes above the pin. This example is stricter, for reasons given further down: the count has to equal the pin. The existing breakages then get fixed a few at a time, by whoever happens to be editing that code.

## What is in here

The code is [TypeScript](https://www.typescriptlang.org), which is JavaScript with types added.

**A toy app.** `app/src` holds nine small files of button, card and navigation styles. The rule is that a colour value, such as `#2456d6`, may only be written in `app/src/theme`, so every other file refers to a colour by its name. Seven lines elsewhere break it.

**The pins.** `ratchet/pins.ts` records how many breakages each folder has today, with a reason for each, and a dated history of every time a number moved. It also lists the folders the check looks in.

**The check.** `ratchet/scan.ts` reads the files and counts. `ratchet/judge.ts` compares the counts with the pins and lists every disagreement. `ratchet/check.ts` runs both and, if there is any disagreement, stops with an error, which is what makes an automated build fail.

**The demo.** `demo/break.ts` makes seven different changes to a throwaway copy of the app and prints what the check says each time. The changes are unrelated to the app's seven breakages. There is one for each of the seven ways the plain form can be got round, which are listed further down.

## Running it

You need [Bun](https://bun.sh), a JavaScript runtime, at version 1.4.4 or later.

Install the dependencies:

```bash
bun install
```

Run the check on the toy app. It should pass, since the pins match the seven breakages:

```bash
bun run check:ratchet
```

Run the demo:

```bash
bun run demo
```

Run the tests for the check itself, which cause each kind of error on purpose:

```bash
bun run test
```

## Seven ways a plain ratchet leaks

"Fail if the count goes up" is the plain form. I think it has holes, and this example closes the ones I've met. The demo causes each one.

- **A pin left too high hides new breakages.** If you fix a breakage and leave the pin where it was, the next new breakage still passes, because the count is back at the pin and not above it. Here the count has to equal the pin, so the change that fixes something also lowers the number.
- **A folder excused by name can get worse.** On an exemption list a folder is excused by name, so it can get worse unnoticed. Each pin stores a count, so an excused folder can't grow.
- **A pin outlives its reason.** A pin can stay in the file after its folder has been deleted or cleaned up. Here a pin for a folder that no longer exists, or is now clean, or has no reason written beside it, is an error.
- **New code inherits an old excuse.** A pin covers the files directly in one folder and not its subfolders. A new folder has no pin, so it is held to zero from the start.
- **The rule gets narrowed.** The scan is told which folders to read, and `ratchet/pins.ts` also names a few files it expects the scan to reach. If someone trims the folders and one of those files drops out, the check stops with an error.
- **Excusing single lines becomes the easy way out.** A line can be excused in place with a `colour-ok` comment. Those comments are counted too, file by file, and held to a pin in the same way. Each needs a reason of at least three words.
- **A check that looks at nothing passes.** If the scan reads no files, the check stops and says so.

## Reading the output

Each message the check prints is written as the next step. For example:

```
[stale-pin] app/src/buttons has 2 raw colour value(s), under its pin of 3.
Lower the pin to 2 in ratchet/pins.ts and add a line to the history.
```

I'd suggest keeping that habit if you copy this. Whoever acts on the message may be a coding agent, and the message could be the only instruction it reads.

## Trade-offs

- **One extra edited line per improvement.** Because the count has to equal the pin, every fix also edits `ratchet/pins.ts`. A gentler version lets an improvement pass and tightens the pin with a command. I use both, in different projects of my own, and I'm not sure yet which I'd recommend by default.
- **Merge conflicts on the numbers.** Two people who lower the same pin in separate branches will find Git can't combine their changes on its own, which is a merge conflict, and one of them resolves it by hand. Pinning per folder keeps that rare. I'd expect a single number for the whole codebase to make it common.
- **A crude counter.** The scan counts lines that hold a colour value. It matches text and doesn't read the code's structure the way a compiler would. That is enough for a number that only has to move when the code does, though it could miss a value written in an unusual way.
- **It keeps the count from rising and nothing more.** A ratchet can't tell you whether the rule was a good one.

## Copying it

The check is about 300 lines of TypeScript across three files, plus the pins file. It needs nothing beyond Bun to run; `bun install` only fetches the test runner and the type checker. To use it for a different rule, change what `scan.ts` counts, run the check, and copy the counts it reports into `ratchet/pins.ts`.

If you try it and find another way it leaks, I'd like to hear about it. Opening an issue on this repository is the easiest way.
