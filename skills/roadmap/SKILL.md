---
name: roadmap
description: Turns run-state into a one-line Diagnosis and a Now/Next/Later roadmap saved in run-state. Use after onboarding, when the founder does not know what to work on next, or before opening a tactical skill that is not the current Now move.
license: MIT
disable-model-invocation: true
---

# Roadmap

Diagnosis before tactics. One Now move. Persist in **Diagnosis** and **Roadmap**.

Stage table: [references/stages.md](references/stages.md).

## Process

From repo root: `node scripts/run-state-check.js roadmap`.

Requires **Product truth**. If empty, open `onboarding` first.

1. Read run-state. Count `[assumption]` vs `[validated]`. Name the single bottleneck (not five).
2. Pick Now from stage table. Map to one skill. Define done.
3. Write **Diagnosis** (one sentence) and **Roadmap** (Now / Next / Later / Log stub).
4. If they asked for a tactic that is not Now, name the cost, then let them choose.
5. Run `review` before presenting the roadmap if you drafted positioning-like claims inside it.

## Output

- Diagnosis (one sentence)
- Now: move, skill name, done looks like
- Next (2–3 queued)
- Later (parked on purpose)

## Done

Diagnosis and Roadmap fields are written. One skill named as Now. No assets drafted unless that is the Now move.

## Refuse

A re-saved copy of product truth as the roadmap. Padding when the honest answer is "talk to ten users." Starting homepage work when assumptions dominate without flagging it.
