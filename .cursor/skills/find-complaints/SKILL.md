---
name: find-complaints
description: Finds reviews, G2, Trustpilot, app-store, and support-thread complaints in the buyer's words. Use when looking for "I hate X because" language, switching triggers, or review-site pain. Does not write ads from the quotes.
license: MIT
disable-model-invocation: true
---

# Find complaints

“I hate X because.” Exact language. Reviews, G2, Capterra, Trustpilot, app stores, Reddit rants, support threads, changelog comments.

Write **Evidence**.

Search recipes: [references/sources.md](references/sources.md).

## Process

From repo root: `node scripts/run-state-check.js find-complaints`. After each quote: `bash scripts/evidence-log.sh <source> '<quote>' '<url>'`.

## Do

1. Search the substitute and the category, not only our product name.
2. Pull quotes that name a job, a failure, a workaround, or a churn reason.
3. Keep source, date, product reviewed.
4. Cluster repeats. If fifteen people say the same thing, say that in one line. That cluster is positioning input, not a slogan you write here.

## Output

- Quote table: quote, source, date, product
- Repeat cluster (if any)
- Language we should steal vs language that is just venting

## Done

Sourced complaint quotes with date and product. No landing copy.

## Refuse

Do not write a landing page. Do not turn one one-star review into a market. Flag sample size.
