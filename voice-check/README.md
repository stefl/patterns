# Voice check

Keep drafts that an AI agent writes in your name sounding like you. A profile measured from your own writing, a mechanical check that counts struck phrases and absolutes until the draft passes, a cold reader that sees only the finished text, and every correction you make folded back into the lists with its date.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder:

```bash
bun check.ts
```

It has no dependencies. The three writing samples, the struck list and the three drafts are written out at the top of the file and are made up. It measures a profile from the samples, checks a before and an after paragraph, then adds a phrase a reader struck, dated, and checks the after paragraph again. Add your own phrase to the struck list, or a longer sample, to see a draft pass or fail.

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/your-writing-voice-captured-and-checked](https://stef.io/patterns/your-writing-voice-captured-and-checked). The cold read has its own page, [stef.io/patterns/the-cold-reader](https://stef.io/patterns/the-cold-reader).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
