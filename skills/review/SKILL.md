---
name: review
description: Stress-tests substantive GTM deliverables as a skeptic before presenting them. Use when shipping positioning, homepage copy, pricing, launch posts, roadmaps, or when the founder asks if a strategy doc is actually strong.
license: MIT
disable-model-invocation: true
---

# Review

Author submits. Skeptic judges. Present only what passes or name exact fixes.

Standard: [references/standard.md](references/standard.md).

## Process

From repo root:

```bash
node scripts/run-state-check.js review
node skills/review/scripts/check.js draft.md
```

1. Switch roles. You did not write this; try to break it.
2. Run check.js on the draft file or stdin capture.
3. Verdict: **PASS** or **REVISE** with failed checks and fixes. Name weakest point even on PASS.
4. If REVISE, fix and re-run before presenting.

Does not replace `write` on outbound paste-ready copy. Run both when the piece is customer-facing prose.

## Output

- Verdict (PASS / REVISE)
- Failed checks (if any) with specific fixes
- Weakest remaining claim (one line)
- Load-bearing `[assumption]` flagged (if any)

## Done

check.js ran. Verdict is explicit. REVISE items are fixed or named for the founder.

## Refuse

Rubber-stamp. "Looks good" with no weakness named. Letting puffery or unvalidated claims ship.
