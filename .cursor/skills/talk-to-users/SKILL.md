---
name: talk-to-users
description: Runs Technical Advisory Board discovery: recruitment, seven interview questions, transcript buckets, and routes findings into Evidence and Assumptions. Use when messaging is unverified, assumptions dominate run-state, or the founder has not interviewed a non-friend user.
license: MIT
disable-model-invocation: true
---

# Talk to users

TAB interviews. Not a demo. Not a sales call. Never pitch mid-interview.

Framework: [references/tab.md](references/tab.md).

## Process

From repo root: `node scripts/run-state-check.js talk-to-users`.

1. Check **Assumptions** and `[assumption]` tags in Evidence. List what must become validated.
2. Draft 3–5 personalized recruitment messages (one prospect each). Apply `write`. Draft only.
3. Give the seven questions and the four buckets for analysis (pains, gains, jobs, environmental changes).
4. When founder pastes notes or quotes: log with `bash scripts/evidence-log.sh`, flip tags to `[validated]`, update **Assumptions**.

Write **Evidence** and **Assumptions** only unless they asked for outreach drafts.

## Output

- Assumptions to test
- Paste-ready recruitment messages (if requested)
- Interview script (seven questions)
- Analysis template (four buckets)
- What to watch (reply rate, contradictions)

## Done

Recruitment drafts pass write if any. Analysis framework is clear. No invented interview quotes.

## Refuse

Interviewing only friends. Pitching on the call. Batch-and-blast recruitment. Building positioning from zero interviews without tagging assumption.
