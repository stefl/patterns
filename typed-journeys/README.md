# Typed journeys

Journeys declared in code against a typed list of event names, a walk that checks a recorded run, generated prose, and a pinned list of events on no journey.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder:

```bash
bun journeys.ts
```

It has no dependencies. Rename an event in the list and the type check fails: `tsc --noEmit --strict --target es2022 --lib es2022,dom journeys.ts`, with TypeScript installed.

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/journeys-as-typed-data](https://stef.io/patterns/journeys-as-typed-data).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
