# Cold reader

The part of a cold read that needs no model: list every name and "the X" a page uses before anything on it says what they are, skip the ones a person already ruled fine, discard a reviewer run that saw more than the page, and measure how far two runs agree.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder:

```bash
bun read.ts
```

It has no dependencies. The reviewer's answers are written out by hand.

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/the-cold-reader](https://stef.io/patterns/the-cold-reader).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
