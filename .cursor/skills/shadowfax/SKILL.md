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
4. Substantive strategy deliverables go through `skills/review` before presenting.
5. Do not run a second specialist unless the founder named it.

The picker recognizes concrete mechanisms such as free tools, referrals, partnerships, waitlists, brand replies, lifecycle email, growth hacks, outreach operations, prospect reply triage, social listening, and lead magnets. These still require state and a suitable channel. If two named intents could apply, trust the script. Finding 15 people who already complained beats writing a post.

## Done

One specialist is named with a reason, that SKILL.md is open, and a second specialist has not started. Or `ask` and three questions, nothing else.

## Library maintenance

An explicit request to audit or edit this pack is skill authoring, not a founder campaign. Inspect the required definitions and test their routes; do not ask for a fictional founder brief because the working template is empty. Record maintenance in the Roadmap log.

## Refuse

Do not produce an ICP, a tweet pack, a launch checklist, and a sales script in one turn. Say which skill you are not opening.

Do not open `posts`, `content`, `content-audit`, or `aeo` because those folders exist. Open them when the picker says so.

## After the specialist

Draft work goes through `skills/write`. Strategy docs through `skills/review`. Then stop. Recommend one next human action.
