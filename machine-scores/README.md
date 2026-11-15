# Machine scores

A model scores a long list of names but never rejects one, and a model's verdict on a name counts only as far as its cited links survive being fetched. Both models are real.

- `score.md` is the scoring prompt, and `clear.md` the clearance prompt, which asks a model with web search for clashes and their links. Its last paragraph is a ruling a person made about the rubric, written into the prompt.
- `scores.ts` asks for scores through the [Claude Code](https://claude.com/claude-code) command line, applies them without removing anything, shows how an undo keyed on the rejection's reason restores only the machine's rejections, then clears the top name with two models, fetches every link each one cites, drops the ones that are not there, and rebuilds the verdict from what survived.
- `output.txt` is what one real run printed. It prints the kind of each clash, not its name: the names are real businesses the search found.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder, with the `claude` command line installed and logged in. One run costs well under a dollar, and its scores and clashes differ from run to run.

```bash
bun scores.ts
```

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/the-machine-scores-only-a-human-rejects](https://stef.io/patterns/the-machine-scores-only-a-human-rejects).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
