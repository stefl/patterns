# Stop labels

A closed list of labels for how an agent's turn ended, and a stop hook that refuses an unlabelled stop once and never twice.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder:

```bash
bun stop.ts
```

It has no dependencies. It runs six stops through the hook and shows what the label command says about two bad labels. The full version runs in [Fibers](https://fibers.dev), a tool for keeping track of many coding agents at once.

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/agents-say-how-they-stopped](https://stef.io/patterns/agents-say-how-they-stopped).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
