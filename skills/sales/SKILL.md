---
name: sales
description: Drafts discovery questions, qualification, demo outlines, objection handles, follow-ups, and close language. Use when running founder-led sales conversations. Does not send mail or book the calendar.
license: MIT
disable-model-invocation: true
---

# Sales

Discovery, qualification, demo, objections, follow-ups, close. Draft only. Do deals yourself until ~10–20 repeat.

Deal framework: [references/deal.md](references/deal.md). Inbound calls: `inbound`. Buyer gap: `buyer-gap`.

Use **ICP**, **Positioning bet**, and any **Evidence** from real calls the founder pasted.

## Process

From repo root:

```bash
node scripts/run-state-check.js sales
node skills/write/scripts/lint.js analyze draft.md
```

Then apply `skills/write`.

## Do

1. Discovery: questions that test the problem and the substitute, not a 20-question ritual.
2. Qualification: who can say yes, who has the pain now, who will stall. Be willing to say “not a buyer.”
3. Demo: the path that matches *their* substitute, not a feature tour.
4. Objections: answer the one they raised. Do not inventory fake objections.
5. Follow-up: one specific next step, referring to their words.

## Output

The artifact they asked for (question list, outline, email, objection reply). Paste-ready. What to watch on the next call.

## Done

The artifact they asked for is paste-ready. Nothing sent, no invented case studies.

## Refuse

A full sales playbook when they asked for one follow-up. Invented case studies. CRM updates you cannot make.
