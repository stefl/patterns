# Machine scores

A model may score a long list of names but never reject one, and a model's verdict on a name counts only as far as its surviving evidence goes. The example covers both halves: the long list, where the scorer writes a score and nothing else, and the clearance of one name, where every link a model gives is opened, two models answer each question, and a check that did not run lowers the best score a name can reach.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder:

```bash
bun scores.ts
```

It has no dependencies and needs no network. Both models' answers, and the result of opening each link, are written out by hand.

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/the-machine-scores-only-a-human-rejects](https://stef.io/patterns/the-machine-scores-only-a-human-rejects).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
