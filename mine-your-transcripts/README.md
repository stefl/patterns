# Mine your own transcripts

One night of the miner: a scheduled agent reads a folder of transcripts, sessions between a person and a coding agent, and writes the habits it finds as candidate patterns, each with its evidence quoted and marked checked or relayed. Nothing in the code judges what a habit is; the agent does, following a brief. Publishing stays a person's job.

- `nightly.md` is the standing instruction for the scheduled run: take two lines of the queue, read only, write only into the private folder, never publish, leave a morning note.
- `miner.md` is the brief for one source: what to look for, the form of a candidate, and the rule that names go only under the evidence.
- `transcripts/` holds six short made-up sessions from three projects.
- `mine.ts` copies the brief and the transcripts into a private folder of its own and runs the agent there through the [Claude Code](https://claude.com/claude-code) command line, with read tools and permission to write one file. `output.txt` is what one real run wrote.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder, with the `claude` command line installed and logged in. One run costs well under a dollar.

```bash
bun mine.ts
```

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/mining-your-own-transcripts](https://stef.io/patterns/mining-your-own-transcripts).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
