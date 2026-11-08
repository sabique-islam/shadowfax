---
name: waitlist
description: Designs a prelaunch waitlist or access queue that qualifies demand and measures eventual activation. Use when planning a waitlist, prelaunch referrals, early-access queue, or launch invitation waves.
license: MIT
disable-model-invocation: true
---

# Waitlist

Collect evidence of demand and deliver access. Queue size is not product-market fit.

Run `node scripts/run-state-check.js waitlist`. Requires Product truth, ICP hypothesis, Diagnosis, and Channel bet. Prelaunch Product truth can describe a prototype and explicitly separate what works from the planned offer.

Read [references/playbook.md](references/playbook.md).

## Process

1. State the actual reason for limited access: capacity, required onboarding, geography, or unfinished capability. Without a constraint, consider letting users try the product now.
2. Define qualification and the learning goal. Ask the smallest useful question; do not require address-book access or public promotion to join.
3. Draft the promise, confirmation, invitation, and fallback if delivery slips. Give an honest next update date; explain eligibility and access selection.
4. Add referrals only if they help reach similar users. Define what counts, caps and cost of rewards, how duplicate/fake referrals are excluded, and whether referrals actually change access priority.
5. Design invitation waves around onboarding capacity, with entry cohort and invitation timestamps. Track delivery → claim → first value → return or purchase; distinguish uninvited people from drop-off.
6. Set pilot sample, timebox, threshold, kill, and handling for demand beyond capacity. Review the mechanism; apply `write` to all drafts.

Write **Success / kill**. Log actual invitation-cohort results in **Last observation**; do not label waitlist signup as retention.

## Output

Queue/access policy, qualification form outline, reward liability if any, invitation plan, and channel/paste-ready text/destination/watch for each needed message. Draft only.

## Done

The founder can collect qualified demand and issue a bounded invitation wave. Claims of scarcity and rewards match actual operations, and eventual activation is measurable.
