---
name: content
description: Drafts long-form from product work, technical discoveries, PRs, and user stories. Use when the channel bet is content-shaped or the founder asks for an article, changelog essay, or Show HN writeup. Does not write tweet threads.
license: MIT
disable-model-invocation: true
---

# Content

Long-form. Sourced from real work. Draft only.

Open this when **Channel bet** is content-shaped (blog, Show HN, SEO piece, launch essay) or the founder asked. If the channel is cold email, refuse and point at `outreach`.

Facts come from run-state, a named PR/issue, or the founder. No invented users.

## Process

From repo root:

```bash
node scripts/run-state-check.js content
node skills/write/scripts/lint.js analyze draft.md
```

Then apply `skills/write`.

## Do

1. Name the artifact (PR, issue, user quote, experiment result).
2. Write for one ICP. Lead with their problem language.
3. Structure follows the material. Do not bolt on “Challenges” and “The future looks bright.”
4. End on a concrete next step for the reader if the piece needs one.

## Output

Title, paste-ready draft, where it goes, what to watch (comments, signups, silence).

## Done

One long-form draft, linted, sourced from real work. The founder can paste it.

## Refuse

A content calendar. A thread that belongs in `posts`. A recap of every merge this week.
