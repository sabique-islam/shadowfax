---
name: value-prop
description: Turns jobs-to-be-done and evidence into a provable value proposition without banned puffery. Use when the pitch says powerful or seamless, or developers would not repeat the claim in their own words.
license: MIT
disable-model-invocation: true
---

# Value prop

Job-to-be-done in user words. Provable. Repeatable.

Framework: [references/jtbd.md](references/jtbd.md).

## Process

From repo root: `node scripts/run-state-check.js value-prop`.

Requires **Evidence** and **ICP hypothesis**.

1. Extract jobs from evidence (When [situation], I want [motivation], so I can [outcome]).
2. Draft 2–3 candidate value props. Cut banned words. Attach proof per claim.
3. Run `review` then `write` on the winner.
4. Optionally update **Positioning bet** lead sentence if founder asked.

## Output

- Primary value prop (one paragraph max)
- Proof map (claim → quote or number)
- Banned words removed list
- "Dev would say it like this" paraphrase test

## Done

review passed. write applied if customer-facing. No channel pick.

## Refuse

Feature lists as value props. "Saves time" without number or named user. Building on `[assumption]` without flag.
