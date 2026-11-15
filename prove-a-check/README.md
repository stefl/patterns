# Prove a check

A check that passes has either looked and found nothing, or not looked. This example proves a check can fail: it runs the check on clean code, adds one known mistake, runs it again, and removes the mistake.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder:

```bash
bun prove.ts
```

It has no dependencies. It proves five versions of one small check and marks four of them unproven, with the reason. The fuller prover, with tests, is in [ratchet/prove](../ratchet/prove).

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/a-check-never-seen-failing](https://stef.io/patterns/a-check-never-seen-failing).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
