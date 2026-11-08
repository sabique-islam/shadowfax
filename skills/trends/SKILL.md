---
name: trends
description: Researches live niche jokes, meme formats, and fun-post material this session. Use when the founder wants timely community posts or niche humor. Does not invent jokes from memory.
license: MIT
disable-model-invocation: true
---

# Trends

Live source context only. Fetch or inspect the original; memory is not evidence of a current trend.

The joke still has to fit the ICP. You may add a sourced line to **Evidence**. You do not write the final social post unless the founder also asked; prefer handing angles to `posts`.

## Process

From repo root:

```bash
node scripts/run-state-check.js trends
node skills/trends/scripts/fetch.js '<query from ICP or problem language>'
```

For X, Instagram, or other sources the script cannot access, inspect the original post through available search/browser tools or use founder-supplied text with freshness labeled unverified. If no source context can be established, skip a live trend claim. If the script prints `no live hits`, do not claim that proves no trend exists. Do not invent one from training data. After each usable quote: `bash scripts/evidence-log.sh <source> '<quote>' '<url>'`.

## Do

1. Query with their language, not our category theater.
2. For each hit you keep: format or joke, URL, publication date and retrieval method, why the ICP would get it, risk (inside joke, already dead, off-brand).
3. Suggest one way it could attach to the product without lying. If it does not attach, say so.

## Output

Sourced list. Every row has an original URL, date, retrieval method, and context. Dead or off-brand rows marked as such.

## Done

Each trend has a source and date inspected this session, or is explicitly labeled founder-supplied with freshness unverified. Memory was not used as a source.

## Refuse

Fabricated trending material. Original lines grounded in sourced context are allowed; no invented source or event. “Relatable founder grind” with no link. Do not force a meme onto a B2B workflow that would look like a brand intern.
