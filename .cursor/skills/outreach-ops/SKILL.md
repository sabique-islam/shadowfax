---
name: outreach-ops
description: Maintains an evidence-backed local prospect ledger, checks batch readiness, and exports reviewed outreach for a human handoff. Use when managing an outreach pipeline, importing prospect records, preparing a sequencer export, or tracking prospect stages.
license: MIT
disable-model-invocation: true
---

# Outreach operations

Carry the evidence and conversation forward. A spreadsheet row is not a qualified buyer, and an exported draft is not a sent message.

Run `node scripts/run-state-check.js outreach-ops`. Requires Product truth, ICP hypothesis, Diagnosis, and Channel bet. The channel must be email for this email ledger; other channels can still use the existing research and draft workflows. Do not choose email merely because an export tool exists.

Read [references/workflow.md](references/workflow.md) for commands and event fields. The executable ledger performs no network requests, discovery, email verification, mailbox reading, sending, scheduling, or CRM writes. It records evidence and outcomes the founder or connected read-only sources actually provide.

## Process

1. Review the current bet, source-backed fit criteria, and exclusions. Choose a small named cohort; distinguish observed facts from buying interpretations. Read the signal/account research guidance named in the workflow when needed.
2. Initialize the working project's local ledger only if absent. Create events from inspected sources, with stable IDs and observation timestamps. Keep real contact data under `.shadowfax/outreach/`, which initialization ignores in Git.
3. Record accounts before contacts, then observations, qualification, and address-check evidence. Public listing, guessed patterns, syntax, and DNS alone cannot be imported as proof of deliverability. The tool does not authenticate an imported provider report; inspect it yourself.
4. Bring in actual drafts from the requested outreach work. Map factual text to its sources. Run `generic-scan` and `write` on the draft text, review factual support and the offer, then record a pass/revise event. A pass is a review record, not authority to send.
5. Run `plan`. Resolve its explicit blockers; never relabel stale evidence or silence to force a ready row. Only one contact per account enters a batch. Any recorded reply pauses that account for human conversation handling; opt-outs and suppressions cannot be cleared by reimporting drafts.
6. Export the currently eligible reviewed rows for the founder to inspect. The CSV is a timestamp-specific handoff: recheck it before use, and stop any separate sequencer yourself when a reply/opt-out arrives. The ledger cannot recall an external export.
7. Record human-reported sends, replies, delivery evidence, and outcomes as events. Run `report` for counts with denominators. Do not invent activity to make the funnel look complete.

## Output

Current cohort; ready/blocked counts with reasons; exact local handoff path if requested; unknowns; one next human action. When presenting a draft include channel, paste-ready text, recipient/destination, and what to watch. Nothing sent.

Write selected contacts to **Reach list** when useful. Write actual dated outcome counts to **Last observation**; proposed thresholds belong in **Success / kill**. Ledger data does not become customer validation merely because it parsed.

## Done

The cohort has a reproducible local history and a reviewable next-action queue. Unknown, risky, expired, declined, duplicate, paused, and unreviewed records cannot silently enter the ready export.
