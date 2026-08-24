---
name: shadowfax
description: Routes founder GTM work to exactly one Shadowfax specialist. Use when the user asks about traction, customers, distribution, outreach, content, launches, sales, or what to do next with a product they already built.
license: MIT
---

# Shadowfax router

Read the working project's `.shadowfax/run-state.md` and this plugin's `AGENTS.md`. Execute the picker. Do not reimplement the tree.

## Process

1. Run:

```bash
node scripts/run-state-check.js shadowfax
node skills/shadowfax/scripts/pick.js --message '<founder message>'
```

2. The JSON `skill` field is the specialist. If it is `ask`, ask three product-truth questions and stop. Otherwise open that `SKILL.md` only.
3. Run `node scripts/run-state-check.js <skill>` before the specialist works. If that check fails, open the skill that fills the empty field, or ask the founder.
4. Do not run a second specialist unless the founder named it.

If two named intents could apply, trust the script. Finding 15 people who already complained beats writing a post.

## Done

One specialist is named with a reason, that SKILL.md is open, and a second specialist has not started. Or `ask` and three questions, nothing else.

## Refuse

Do not produce an ICP, a tweet pack, a launch checklist, and a sales script in one turn. Say which skill you are not opening.

Do not open `posts`, `content`, `content-audit`, or `aeo` because those folders exist. Open them when the picker says so.

## After the specialist

Draft work goes through `skills/write`. Then stop. Recommend one next human action.
