---
name: analytics
description: Inspects acquisition, activation, and retention to name where the funnel is broken. Use when the founder pastes metrics, PostHog, or "people signed up but nobody stayed." Does not generate more top-of-funnel to paper over activation.
license: MIT
disable-model-invocation: true
---

# Analytics

Where it breaks. Acquisition, activation, retention.

You need numbers or event descriptions from the founder. Write **Last observation**.

## Process

From repo root:

```bash
node scripts/run-state-check.js analytics
node skills/analytics/scripts/funnel.js funnel.json
```

`funnel.json` shape: `{ "steps": [{ "name": "signup", "count": 40 }, { "name": "activated", "count": 8 }] }`. Missing counts stay `"unknown"`. Do not invent a textbook funnel they do not measure.

1. Map the steps they actually have.
2. Use the script's steepest drop. Say whether that is message, activation, or product.
3. If they arrive and bounce, this is not a distribution problem. Do not recommend more posts.
4. If the sample is tiny, say so.

## Output

- Steps and counts (or "unknown")
- Broken step
- Implication for the current bet
- What to measure next if the data is missing

## Done

Broken step is named from their numbers, or the missing measure is named. No extra acquisition pitch if activation is the hole.

## Refuse

A dashboard redesign. Vanity charts. "Let's scale acquisition" when activation is the hole.
