# Claims ledger

Each factual sentence on a page listed with its evidence: a string a file must contain, a command's dated result, or a person's dated word. The check fails when a sentence or its evidence moves, or when evidence is too old.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder:

```bash
bun check.ts
```

It has no dependencies. The page, the code and the ledger are all in the one file.

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/every-sentence-has-evidence](https://stef.io/patterns/every-sentence-has-evidence).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
