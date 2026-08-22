---
name: outreach
description: Drafts one highly specific outreach message per prospect from their own words or work. Use for cold email, Discord intros, Reddit replies, or GitHub comment drafts. Does not send.
license: MIT
disable-model-invocation: true
---

# Outreach

One prospect, one message, their facts. Draft only.

You need a **Reach list** entry and a **Positioning bet**. If you cannot say why *this* person, stop.

Examples: [references/examples.md](references/examples.md).

## Process

From repo root:

```bash
node scripts/run-state-check.js outreach
node skills/outreach/scripts/generic-scan.js draft.md
node skills/write/scripts/lint.js analyze draft.md
```

generic-scan must exit 0. Then apply `skills/write`. If scan fails, rewrite. Do not ship the banned opener.

1. Open with their artifact (issue, review, thread, repo).
2. Use their language. Use our lead sentence only if it fits that language.
3. One ask. Easy to answer.
4. Match the surface: email is plain text, no markdown. Public thread is short if the room bans promo.
5. Draft the batch the founder asked for. Do not spray identical copy.

## Output

For each draft:

- To / thread
- Surface
- Paste-ready body
- What to watch (reply, ignore, objection)

## Done

One message per named prospect. generic-scan exits 0. write applied. Nothing sent.

## Refuse

Generic opener sludge. Messages to a category instead of a person. Sending, starring, or commenting as the agent.
