---
name: prospecting
description: Finds named people, companies, creators, teams, and issue filers worth reaching. Use when building a specific outreach list. Does not write the message.
license: MIT
disable-model-invocation: true
---

# Prospecting

Named humans and orgs. Not “developers on Twitter.”

You want **ICP**. If the channel is empty, still list people, but do not invent a channel.

Write **Reach list** (people and companies).

Use [references/signals-and-accounts.md](references/signals-and-accounts.md) for signal limits, disqualifiers, account roles, contact evidence, and freshness. A hiring/funding observation is not proof of budget or buying intent.

## Process

From repo root: `node scripts/run-state-check.js prospecting`. If it fails, stop.

## Do

1. Hunt in the rooms and threads already in the reach list or evidence: issue filers, “me too” comments, review authors, newsletter authors, toolmakers who have the problem.
2. Each prospect needs a reason that is *theirs*: a quote, a repo, a thread, a hire, a launch.
3. Cap a first list at 20. Quality over a CSV dump.
4. Note the best place to reach them (email unknown, public thread, GitHub) without drafting the text.

## Output

Numbered list. Name or handle, why them (one fact), where they already spoke, suggested surface (email / thread / issue). Unknowns stay unknown. Keep observation separate from buying interpretation, record source/date and a recheck window, and name rejected candidates rather than padding the list. If a local operational record is needed, recommend `outreach-ops` as the next skill.

## Done

Named people or companies with a reason that is theirs. No message draft.

## Refuse

Do not write “I came across your company.” That is `outreach`. Do not pad the list with stretch-fit logos.
