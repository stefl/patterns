# Overnight hunt

One night of a bug hunt, over a sample repository with one change in it: a script builds the brief from what changed, a finder reads it, a refuter tries to disprove each finding in a session of its own, and the morning report shows only what survived. A night with no findings file is reported as broken, not quiet.

- `finder.md` and `refuter.md` are the two prompts.
- `hunt.ts` builds the sample repository and the brief, then calls the model through the [Claude Code](https://claude.com/claude-code) command line for the finder and once per finding for the refuter, each in a new process with no settings, skills or hooks.
- `sample/` holds the code before and after the night's change. The change has one real bug and one thing that looks like a bug but is guarded elsewhere.
- `output.txt` is what one real run printed.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder, with git and the `claude` command line installed and logged in. One run costs well under a dollar.

```bash
bun hunt.ts
```

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/software-that-hunts-its-own-bugs](https://stef.io/patterns/software-that-hunts-its-own-bugs).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
