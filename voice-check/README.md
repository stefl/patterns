# Voice check

Keep drafts that an AI agent writes in your name sounding like you, and right for the person reading them. Name the register and the reader first, have a model that has not seen the session write it, check it against a profile measured from your own writing until it passes, read it cold, and fold every correction you make back into the lists with its date.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder:

```bash
bun check.ts
```

It has no dependencies. The three writing samples, the struck list and the three drafts are written out at the top of the file and are made up. It measures a profile from the samples, checks a before and an after paragraph, then adds a phrase a reader struck, dated, and checks the after paragraph again. Last, it checks one line in two registers: a gloss of "pull request" passes in an email to a client who doesn't write code and fails on a page for engineers. Add your own phrase to the struck list, or a longer sample, to see a draft pass or fail.

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/your-writing-voice-captured-and-checked](https://stef.io/patterns/your-writing-voice-captured-and-checked). The cold read has its own page, [stef.io/patterns/the-cold-reader](https://stef.io/patterns/the-cold-reader).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
