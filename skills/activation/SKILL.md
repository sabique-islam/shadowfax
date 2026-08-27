---
name: activation
description: Diagnoses time-to-first-value and the weekend test for dev tools. Use when people sign up or star then vanish, docs assume expertise, or traffic is planned before first-run works.
license: MIT
disable-model-invocation: true
---

# Activation

Fix the first ten minutes before scaling acquisition.

Framework: [references/friction-log.md](references/friction-log.md).

## Process

From repo root: `node scripts/run-state-check.js activation`.

1. Name ONE core path to first real win.
2. Walk it as a stranger (incognito/clean machine). Log question, frustration, barrier per step.
3. Circle top 3 quit points. Recommend fixes before any channel work.
4. Define metric: time-to-first-value or % signups reaching win in week one.
5. Write **Last observation** with finding.

If founder pasted funnel numbers, also run `node skills/analytics/scripts/funnel.js`.

## Output

- Core path (one sentence)
- Friction log (steps + barriers)
- Top 3 fixes (priority order)
- One metric to watch
- Gate: weekend test pass/fail

## Done

First-run leak named. No launch or outreach recommended until pass or explicit founder override.

## Refuse

Homepage tweaks while first run leaks. Celebrating signups without activation. Gating first win behind sales call or credit card.
