# Ratchet

A small, runnable example of a ratchet check, named after the tool that turns one way only. A rule, such as "colours are only written in the theme folder", is switched on in a codebase that already breaks it, and the number of breakages, counted folder by folder, may only go down.

Written by [Stef Lewandowski](https://stef.io).

## The problem it answers

Say you want a new rule in a codebase that already breaks it in four hundred places. Fixing all four hundred first rarely happens. The usual alternative is an exemption list, a file naming the places the rule is allowed to skip. It works on the first day and tends to be forgotten within a month.

I've found the exemption list wears out faster when coding agents write most of the code. A coding agent is an AI tool, such as [Claude Code](https://claude.com/claude-code), that writes and edits code on your behalf. An agent that meets a failing check and an exemption list will often add a line to the list, because that is the cheapest way to make the check pass.

A ratchet is the middle path. You write down today's count for each folder, which I call a pin. In the plain form the check fails if the count goes above the pin. This example is stricter, for reasons given further down: the count has to equal the pin. The existing breakages then get fixed a few at a time, by whoever happens to be editing that code.

## What is in here

The code is [TypeScript](https://www.typescriptlang.org), which is JavaScript with types added.

**A toy app.** `app/src` holds nine small files of button, card and navigation styles. The rule is that a colour value, such as `#2456d6`, may only be written in `app/src/theme`, so every other file refers to a colour by its name. Seven lines elsewhere break it.

**The pins.** `ratchet/pins.ts` records how many breakages each folder has today, with a reason for each, and a dated history of every time a number moved. It also lists the folders the check looks in.

**The check.** `ratchet/scan.ts` reads the files and counts. `ratchet/judge.ts` compares the counts with the pins and lists every disagreement. `ratchet/check.ts` runs both and, if there is any disagreement, stops with an error, which is what makes an automated build fail.

**The demo.** `demo/break.ts` makes seven different changes to a throwaway copy of the app and prints what the check says each time. The changes are unrelated to the app's seven breakages. There is one for each of the seven ways the plain form can be got round, which are listed further down.

**The prover.** `prove/prove.ts` tests whether a check can fail at all. It adds a known mistake, confirms the check fails, takes the mistake out and confirms the check passes again. `prove/gates.ts` lists the checks to prove: the one this example relies on, and four faulty ones for comparison. A check that can stop a build is sometimes called a gate, which is where the file gets its name.

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

Prove the check can fail, and see four faulty checks marked unproven:

```bash
bun run prove
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
- **New code inherits an old excuse.** If a pin covered a folder and everything beneath it, a new subfolder would start with the old allowance. Here a pin covers the files directly in one folder and not its subfolders. A new folder has no pin, so it is held to zero from the start.
- **The rule gets narrowed.** The scan is told which folders to read, and `ratchet/pins.ts` also names a few files it expects the scan to reach. If someone trims the folders and one of those files drops out, the check stops with an error.
- **Excusing single lines becomes the easy way out.** A line can be excused in place with a `colour-ok` comment. Those comments are counted too, file by file, and held to a pin in the same way. Each needs a reason of at least three words.
- **A check that looks at nothing passes.** If the scan reads no files, the check stops and says so.

## Proving a check can fail

A passing check tells you one of two things. Either it looked and found nothing, or it didn't look. I've had both, and on the day they looked the same.

So the prover runs each check three times in a throwaway copy of the app. The first run is unchanged and has to pass. The second has a mistake added, a new folder with a colour value in it, and has to fail. The third has the mistake removed and has to pass again. A check that manages all three is marked proven. Anything else is marked unproven, with the reason.

`prove/gates.ts` holds four checks that pass on an ordinary day for the wrong reason. Each is a mistake I've made myself or accepted into a codebase from someone else:

- **It reads a folder that doesn't exist.** The check finds no files, so it finds no problems.
- **Its output is passed through `tail`.** `tail` is a tool that trims output to its last few lines, and sending one command's output into another like this is called a pipe. The shell, the program that runs the commands you type, then reports whether the last command in the pipe succeeded. That is `tail`, which I'd expect to succeed whatever the check found.
- **Its rule has been switched off.** Someone turned the rule off, perhaps with a good reason, and the check carries on passing.
- **Its command no longer exists.** This one fails before the mistake is added, so failing afterwards proves nothing. The first of the three runs is there to catch it.

The prover marks all four unproven.

Two limits are worth knowing. One mistake shows that a check can fail, and doesn't show that it fails for every form of the problem. A proof also dates: the check was seen failing today, and the code around it will keep changing.

## Reading the output

Each message the check prints is written as the next step. For example:

```
[stale-pin] app/src/buttons has 2 raw colour value(s), under its pin of 3.
Lower the pin to 2 in ratchet/pins.ts and add a line to the history.
```

I'd suggest keeping that habit if you copy this. Whoever acts on the message may be a coding agent, and the message could be the only instruction it reads.

## Trade-offs

- **One extra edited line per improvement.** Because the count has to equal the pin, every fix also edits `ratchet/pins.ts`. A gentler version lets an improvement pass and tightens the pin with a command. I use both, in different projects of my own, and I'm not sure yet which I'd recommend by default.
- **Merge conflicts on the numbers.** Two people who lower the same pin in separate branches will find Git can't combine their changes on its own, which is a merge conflict, and one of them resolves it by hand. I've found pinning per folder keeps that rare. I'd expect a single number for the whole codebase to make it common.
- **A crude counter.** The scan counts lines that hold a colour value. It matches text and doesn't read the code's structure the way a compiler would. That is enough for a number that only has to move when the code does, though it could miss a value written in an unusual way.
- **It keeps the count from rising and nothing more.** A ratchet can't tell you whether the rule was a good one.

## Copying it

The check is about 300 lines of TypeScript across three files, plus the pins file. It needs nothing beyond Bun to run; `bun install` only fetches the test runner and the type checker. To use it for a different rule, change what `scan.ts` counts, run the check, and copy the counts it reports into `ratchet/pins.ts`.

If you try it and find another way it leaks, I'd like to hear about it. Opening an issue on this repository is the easiest way.
