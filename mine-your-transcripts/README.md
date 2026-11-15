# Mine your own transcripts

Read the transcripts of your own sessions with coding agents for what keeps recurring, and keep only what you can check. A note counts only when the line it quotes is really in the session it cites. A habit becomes a draft when it clears a bar of three sessions or two projects. The draft has project names swapped out, and it is held if any name is left.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder:

```bash
bun mine.ts
```

It has no dependencies. The six sessions and the reader's notes on them are written out by hand at the top of the file; in real use a model writes the notes. Change the bar, or add a session, to see habits pass or drop.

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/mining-your-own-transcripts](https://stef.io/patterns/mining-your-own-transcripts).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
