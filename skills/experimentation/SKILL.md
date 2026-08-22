---
name: experimentation
description: Defines one distribution experiment with hypothesis, sample, signal, timebox, and kill. Use when proposing or tightening a GTM test. Does not run a content calendar or invent success.
license: MIT
disable-model-invocation: true
---

# Experimentation

One experiment. Sample, signal, timebox, kill.

Align with **Channel bet**. Write **Success / kill**. You may add a line to **Attempt log** if this replaces a dead test.

## Process

From repo root:

```bash
node scripts/run-state-check.js experimentation
node skills/experimentation/scripts/check.js experiment.md
```

The check file must contain the words hypothesis, sample, signal, timebox, kill, a number, and must not say "post and see".

1. Hypothesis: if we do X with this ICP, we will see Y because Z (Z from evidence).
2. Sample: number of people, threads, or posts.
3. Signal: a reply, a signup, a call. Not "awareness."
4. Timebox: a date or a count, whichever hits first.
5. Kill: what stop looks like.

## Output

Hypothesis, sample, signal, timebox, kill. Next human action to start the test (they send or post).

## Done

Hypothesis, sample, signal, timebox, and kill are present. check.js exits 0.

## Refuse

"Post and see" is not an experiment. Do not stack five tests. Do not declare success without founder-reported results.
