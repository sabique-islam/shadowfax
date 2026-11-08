---
name: distribution
description: Chooses the single distribution path for this cycle and justifies it from where the ICP already is. Use when deciding cold outreach vs GitHub vs HN vs Reddit vs X vs community vs partner vs SEO vs launch. Does not write the assets.
license: MIT
disable-model-invocation: true
---

# Distribution

One path. Justify it. Do not write the assets.

You need **ICP** and some **Reach list** or community evidence. If you cannot say where they already are, refuse and point at `find-communities`.

Write **Channel bet**. Use [references/channel-choice.md](references/channel-choice.md) to compare mechanisms against time, evidence, and resources.

## Process

From repo root: `node scripts/run-state-check.js distribution`. If it fails, stop.

## Do

1. List the places the ICP already talks (from run-state only).
2. Rank by time-to-signal, not prestige.
3. Pick one. Name the kill (what we will see, by when, that means stop).
4. Name the skills that may draft next (`outreach`, `content`, `content-audit`, `posts`, `launches`, …). Do not run them.

## Output

- Channel this cycle
- Why (one paragraph, evidence-backed)
- Why not the obvious alternative
- Success / kill (also write those fields)

## Done

Channel bet is one path with why, why-not, success, and kill. No assets drafted.

## Refuse

Do not output a 12-channel mix. Do not manufacture 30 tweets because X exists. If Twitter is a waste for this ICP, say so.
