---
name: trends
description: Researches live niche jokes, meme formats, and fun-post material this session. Use when the founder wants timely community posts or niche humor. Does not invent jokes from memory.
license: MIT
disable-model-invocation: true
---

# Trends

Live only. The fetch is the source. Memory is not.

The joke still has to fit the ICP. You may add a sourced line to **Evidence**. You do not write the final social post unless the founder also asked; prefer handing angles to `posts`.

## Process

From repo root:

```bash
node scripts/run-state-check.js trends
node skills/trends/scripts/fetch.js '<query from ICP or problem language>'
```

If the script prints `no live hits`, skip the joke. Do not invent one from training data. After each usable quote: `bash scripts/evidence-log.sh <source> '<quote>' '<url>'`.

## Do

1. Query with their language, not our category theater.
2. For each hit you keep: format or joke, URL, date from the fetch, why the ICP would get it, risk (inside joke, already dead, off-brand).
3. Suggest one way it could attach to the product without lying. If it does not attach, say so.

## Output

Sourced list. Every row came from fetch.js. Dead or off-brand rows marked as such.

## Done

Each joke has a source and date from this session's fetch. Memory was not used as a source.

## Refuse

A joke factory from training data. “Relatable founder grind” with no link. Do not force a meme onto a B2B workflow that would look like a brand intern.
