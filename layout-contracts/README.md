# Layout contracts

The judging half of a rendered layout check: boxes in, breaches out. In a real setup a browser test records the boxes; here they are written by hand, because the judge never needs the page.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder:

```bash
bun judge.ts
```

It has no dependencies. The full version, with the browser walk, is [Parts](https://github.com/stefl/parts).

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/checking-what-the-browser-drew](https://stef.io/patterns/checking-what-the-browser-drew).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
