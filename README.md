# Patterns

Small, runnable examples of approaches I keep using when I build software with AI coding agents. Each folder holds one pattern: a short example you can run with [Bun](https://bun.sh), a JavaScript runtime, and a `SKILL.md`, a set of instructions you can give your own coding agent so it applies the pattern.

The write-up for each one is on [stef.io/patterns](https://stef.io/patterns). The examples are drafted with an AI agent from my own working notes, with the names of projects and people taken out, and every example was run before it went in.

Written by [Stef Lewandowski](https://stef.io). MIT licence.

## Checks you can trust

- [`ratchet`](ratchet): switch on a rule over code that already breaks it, and let the count only fall. The fullest example here, with a demo and tests.
- [`prove-a-check`](prove-a-check): make a check fail on purpose before you trust it to pass.
- [`layout-contracts`](layout-contracts): judge where the browser put each piece of a page against written layout rules.

## Running agents

- [`stop-labels`](stop-labels): every agent turn ends with one label saying what it asks of you.
- [`failure-register`](failure-register): log the commands your agents got wrong, rank them, and catch a fix that did not take.
- [`overnight-hunt`](overnight-hunt): what an overnight bug hunt should let through, and what a quiet night means.
- [`follow-ups`](follow-ups): the steps only a person can do, each waiting on a fact.
- [`mine-your-transcripts`](mine-your-transcripts): read your own agent sessions for what recurs, keep only what you can check, and draft what clears a bar.

## Lists and pages that stay true

- [`claims-ledger`](claims-ledger): every factual sentence on a page, with its evidence.
- [`two-way-registry`](two-way-registry): one typed list, checked against the code in both directions.
- [`typed-journeys`](typed-journeys): the paths people take through a product, declared in code, with the prose generated.

## Judgement and taste

- [`machine-scores`](machine-scores): a model scores a long list but never rejects, and its verdict counts only as far as its surviving evidence.
- [`taste-record`](taste-record): agents write down how you react to design and wording, in your words; only you can turn one into a rule.
