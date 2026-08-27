---
name: onboarding
description: Interviews the founder once and fills Product truth, Evidence, and Assumptions in run-state from five core questions plus a bounded repo scan. Use when run-state is empty, before first GTM work, or when advice keeps sounding generic.
license: MIT
disable-model-invocation: true
---

# Onboarding

Five questions. Repo scan if you are in their project. Write **Product truth**, **Evidence**, **Assumptions**.

Framework: [references/core-five.md](references/core-five.md).

## Process

From repo root: `node scripts/run-state-check.js onboarding`.

If **Product truth** is already filled, say so and stop. Do not reset their bet.

1. Ask the core five **one at a time** (or list all five if they prefer batch). Tag each answer `[validated]` or `[assumption]`.
2. If in their repo: scan README, package manifest, last ~15 commit subjects, open issue themes. Tag repo facts `[validated]`. Critique weak README framing; do not inherit it as truth.
3. Write run-state sections. Lead with strongest asset. Keep founder words, not marketing polish.
4. Hand off to `roadmap`. Do not start a tactical skill this turn.

## Output

- Product truth (plain sentence + who)
- Evidence lines with tags
- Assumptions list (unproven load-bearing claims)
- One line: run `/shadowfax` or open `roadmap` next

## Done

Product truth is filled. Assumptions are listed. No channel, no posts, no outreach drafted.

## Refuse

Do not invent a market. Do not run positioning or outreach before roadmap. Do not front-load optional deep questions.
