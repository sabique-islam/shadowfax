---
name: market-research
description: Identifies who has the problem, how they solve it now, and where that shows up in their words. Use when researching a market, current workarounds, or problem language. Does not pick channels or write campaigns.
license: MIT
disable-model-invocation: true
---

# Market research

Who has the problem. How they solve it today. Exact language. Not a channel plan. Not an ICP write-up. Those are other skills.

Write **Evidence** and **Product truth** if the founder gave new product facts.

## Process

From repo root: `node scripts/run-state-check.js market-research`. After each quote: `bash scripts/evidence-log.sh <source> '<quote>' '<url>'`.

## Do

1. Restate the product in one line from product truth, not the pitch.
2. Search for people describing the pain, the workaround, and the substitute (spreadsheet, agency, incumbent, ignoring it).
3. Capture quotes with source and date. Prefer independent repetition.
4. Note substitutes and switching cost in one sentence each.
5. Stop at evidence. Do not recommend Twitter. Do not draft posts.

## Output

- Problem in their words (quotes)
- Who is speaking (role, context, if known)
- Current substitute
- Gaps in the evidence (what you could not find)

## Done

Evidence has dated, sourced quotes. No channel or campaign was picked.

## Refuse

Do not output a persona board, a TAM slide, or a content calendar. If you already have 15 quotes saying the same thing, say that and stop.
