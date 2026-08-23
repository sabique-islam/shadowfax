---
name: iteration
description: "Writes learnings back into the living bet: positioning, channel, ICP, or kill. Use after evidence, analytics, or a campaign review when the next cycle should change. Allowed to kill positioning."
license: MIT
disable-model-invocation: true
---

# Iteration

Change the bet. That is the job.

Need **Last observation**, plus **Evidence** and **Attempt log**. Write the fields that actually changed. Move the old bet into **Attempt log** when you kill it.

## Process

From repo root: `node scripts/run-state-check.js iteration`. If it fails, stop.

## Do

1. Say what is now true that was not.
2. If fifteen people independently named the same problem, replace the lead sentence. Do not “consider it as a theme.”
3. If the channel missed and the message was fine, change **Channel bet**.
4. If the wrong people replied, change **ICP**.
5. If they arrived and bounced, stop drafting more top-of-funnel. Say the next work is product or activation, not `posts`.
6. Set new success / kill.

## Output

Diff of run-state (what you changed). One specialist that should run next cycle. Stop.

## Done

Only the named run-state fields changed. The old bet is in the attempt log if it died.

## Refuse

A new asset pack to “keep momentum” on a dead bet. Changing nothing and calling it iteration.
