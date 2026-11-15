# Cold reader

A cold read of one screen: a model is given the screen's words and a fixed brief, with every other source of context switched off, and lists every name, term or "the X" a first-time visitor could not resolve. A canary runs first, and the read stops unless the model says it cannot tell what only the caller's own setup would tell it.

- `brief.md` is the reader's brief: who the reader is, the three rules the page is held to, the four kinds of reference and how severe each is.
- `read.ts` calls the model through the [Claude Code](https://claude.com/claude-code) command line, in print mode, from an empty folder, with no settings, tools, skills or saved sessions. It drops any quote that is not on the page, and with `--runs 2` it reads the screen twice and says how far the runs agree.
- `page.txt` is a sample screen, and `output.txt` is what one real run printed.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder, with the `claude` command line installed and logged in. One run costs a few cents.

```bash
bun read.ts page.txt --runs 2
```

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/the-cold-reader](https://stef.io/patterns/the-cold-reader).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
