---
name: lifecycle-email
description: Designs behavior-triggered onboarding, nurture, reactivation, and expansion email drafts with suppression and exit rules. Use when planning lifecycle email, welcome sequences, drip campaigns, trial reminders, or reactivation messages.
license: MIT
disable-model-invocation: true
---

# Lifecycle email

Email should help the user finish the next useful job. A calendar is not a reason to send.

Run `node scripts/run-state-check.js lifecycle-email`. Requires Product truth and Diagnosis. Confirm the existing relationship and permitted email audience; do not turn scraped prospects into subscribers. This is an owned relationship, not permission to add a second acquisition channel.

Read [references/playbook.md](references/playbook.md). If the brief concerns a cold prospect rather than a user/subscriber, recommend `outreach` instead.

## Process

1. Choose one lifecycle goal and a measurable value event. Read actual onboarding friction, support themes, or cohort data. Low activation caused by a broken product needs an activation fix first.
2. Describe the segment with entry event, eligibility, exclusions, delay, and the exit event. Define a frequency cap across concurrent campaigns, unsubscribe/bounce suppression, and the owner who checks stale data.
3. Build the smallest useful flow. For each message name the unfinished job, one action, and the branch if the user already completed it.
4. Draft subject, preview, plain-text body, CTA destination, and required dynamic values/fallbacks. Do not invent deadlines, usage statistics, or personal check-ins.
5. Define a holdout where practical and a sufficiently long conversion window. Measure unique eligible recipients, delivered messages, first-value events, and returns/purchases. Opens are not the primary outcome.
6. Apply `write`; review the offer, branches, and measurement with `review`. Present drafts and an implementation brief, not an activated automation.

Write thresholds to **Success / kill** and actual results to **Last observation**. Never send or configure a live flow.

## Output

Segment/event table, short flow, message drafts, suppression/exit rules, human owner, and measurement. For every message include channel, paste-ready text, where it belongs, and what to watch.

## Done

The flow helps one segment complete one job, stops on completion or opt-out, and can be evaluated against behavior rather than opens.
