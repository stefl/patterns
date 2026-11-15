# Two-way registry

Also called manifests for everything.

A registry of environment variables checked against the code in both directions: a read with no row fails, and so does a row nothing reads. Exceptions need a reason and fail once their use has gone.

Run it with [Bun](https://bun.sh), a JavaScript runtime, from this folder:

```bash
bun check.ts
```

It has no dependencies. It runs the check seven times, changing one thing each time, and prints what it says.

`SKILL.md` is a draft skill: instructions you can give your own coding agent so it applies the pattern. The write-up is at [stef.io/patterns/manifests-for-everything](https://stef.io/patterns/manifests-for-everything).

Written by [Stef Lewandowski](https://stef.io). MIT licence, as in the [ratchet folder](../ratchet/LICENSE).
