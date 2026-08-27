---
name: customer-support
description: Drafts support replies, ticket responses, and FAQ entries from product truth and evidence. Use when handling customer emails, in-app tickets, refund requests, or repetitive support questions. Does not send.
license: MIT
disable-model-invocation: true
---

# Customer support

Their words. Honest limits. One clear next step. Draft only.

## Process

From repo root:

```bash
node scripts/run-state-check.js customer-support
node skills/write/scripts/lint.js analyze draft.md
```

Requires **Product truth**. Prefer **Evidence** (past tickets, complaints).

1. Restate the customer's issue in their language.
2. Answer what is true today. Say what is not built yet if relevant.
3. One next step (doc link, workaround, escalation, refund policy pointer).
4. Match channel: email plain text, chat short, public reply careful.
5. Apply `write`. Log useful new quotes to evidence if founder pasted thread.

## Output

- Paste-ready reply per ticket/thread
- Surface (email, chat, public)
- Escalate flag (yes/no + why)
- FAQ candidate (if question repeats)

## Done

One reply per case. write applied. Nothing sent. No invented SLA or refund policy.

## Refuse

Blame the user. Over-promise roadmap dates. Copy-paste template that ignores their detail. Arguing in public threads.
