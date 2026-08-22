---
name: competitive
description: Records competitors' positioning, launches, pricing, channels, and messaging as dated facts. Use when the founder asks who else is in the space or how a rival talks. Does not write our positioning.
license: MIT
disable-model-invocation: true
---

# Competitive

Facts. Dated. Sourced. You do not write our lead sentence. That is `positioning`.

Write **Evidence** with competitor lines. You may add an **Attempt log** note if we already copied a dead rival tactic.

## Process

From repo root: `node scripts/run-state-check.js competitive`. After each quote: `bash scripts/evidence-log.sh <source> '<quote>' '<url>'`.

## Do

1. Name the rivals the founder cares about, or the ones buyers already mention in evidence.
2. For each: what they claim, price if public, where they show up, last visible launch.
3. Quote their homepage or launch line. Do not paraphrase into strategy-speak.
4. Note what buyers complain about in *their* reviews or issues (`find-complaints` / `github` if you need more, but do not run those skills unless asked).

## Output

Per rival:

- Claim (quote)
- Price (or unknown)
- Channel they actually use
- Last launch you can date
- Source URL, date retrieved

Then: one line on what we should *not* copy.

## Done

Each rival has dated, sourced facts. Our lead sentence is untouched.

## Refuse

Do not produce a 2x2. Do not say we should “own the whitespace.” If you cannot find a price, write “unknown.”
