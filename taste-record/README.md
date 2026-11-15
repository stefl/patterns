# Taste record

A dated record of how a person reacts to design and wording, in their own words, kept as three Markdown files that agents load before any design work. Agents add observations; only the person can promote one to a rule. Each rule says what to use instead and where it is enforced, and open tensions stay open until the person closes them. Nothing here is code: the record is loaded by an instruction, and most of its rules are not yet checked by anything.

- `TASTE.md` holds the principles and the hard rejections, each one "never X; instead Y", dated, with where it is enforced or "not yet enforced".
- `observations.md` is the agents' inbox: dated reactions in the person's exact words. None of it is a rule.
- `open-register.md` holds the tensions an agent must not resolve.
- The entries are made-up examples in the format of a real record.
- `review.md` is the instruction an agent gets before it changes a screen: test every element, chosen or defaulted? `review.ts` gives it the record and `card.html`, a generated card, through the [Claude Code](https://claude.com/claude-code) command line, and `output.txt` is what one real run printed.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder, with the `claude` command line installed and logged in. One run costs a few cents.

```bash
bun review.ts card.html
```

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/taste-as-a-record](https://stef.io/patterns/taste-as-a-record).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
