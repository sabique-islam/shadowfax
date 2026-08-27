---
name: inbound
description: Drafts call scripts, voicemail, live-call talk tracks, and follow-ups for inbound sales or support calls. Use when someone booked a call, left a voicemail, or the founder needs what to say on the phone.
license: MIT
disable-model-invocation: true
---

# Inbound

Discovery on inbound. Listen 70%. Specific next step with date.

Framework: [references/call-flow.md](references/call-flow.md).

## Process

From repo root:

```bash
node scripts/run-state-check.js inbound
node skills/write/scripts/lint.js analyze draft.md
```

Requires **Product truth** and **Positioning bet**.

1. Classify: support, sales curiosity, buyer with budget, wrong ICP.
2. Draft opening, 5 discovery questions, demo path for their use case (not feature tour).
3. Objection handle for what they actually raised.
4. Close with specific next step + date.
5. Apply `write` on paste-ready scripts and follow-up email.

## Output

- Call type
- Opening (30 sec)
- Question list
- Demo outline (their substitute → their win)
- Follow-up email (paste-ready)
- What to watch (stall signals, missing buyer)

## Done

Script fits their inbound context. write applied. No invented case studies.

## Refuse

Pitch deck on a support call. Feature tour. Ending without next step and date. Treating "think about it" as yes.
