# Failure register

Failed agent commands, grouped into kinds and ranked, with a register of fixes. A failure before its fix stops counting; one after it, in the same codebase, is reported as a regression.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder:

```bash
bun rank.ts
```

It has no dependencies. The log is nine records written out by hand, from two made-up codebases.

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/agent-mistakes-are-a-dataset](https://stef.io/patterns/agent-mistakes-are-a-dataset).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
