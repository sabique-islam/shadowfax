---
name: campaign-review
description: "Reviews a specific campaign: what was sent, what happened, and whether the failure was message, audience, channel, or product. Use after a launch, outreach batch, or ad. Allowed to say it failed."
license: MIT
disable-model-invocation: true
---

# Campaign review

This campaign. What we sent. What happened. Allowed to say it failed.

The founder must provide results (or you have them in evidence). Write **Last observation**. You may append **Attempt log**. You do not change positioning unless they also want `iteration`.

## Process

From repo root: `node scripts/run-state-check.js campaign-review`.

## Do

1. Restate what was sent, to whom, on which channel, over what window.
2. Use the local outreach ledger report when present, or results the founder supplied. Separate unique contacted people, confirmed delivery, human replies, qualification, activation, and wins. A question is not qualification; a verification check is not delivery.
3. Results in numbers they gave. Unknown stays unknown.
4. Split the miss: message, audience, channel, product. Pick the primary. Say if you cannot tell.
5. Kill or continue against the written kill criteria. If none existed, say the campaign was not an experiment.

## Output

Sent, results, primary miss, keep or kill, one next question for `iteration` (do not run `iteration` unless asked).

## Done

Primary miss is message, audience, channel, or product. Success is not declared unless the founder reported results.

## Refuse

Softening a miss into “great learnings.” Recommending a bigger budget on the same broken step.
