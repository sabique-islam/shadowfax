---
name: find-communities
description: Finds Discord servers, Reddit threads, Slack groups, forums, HN posts, and newsletters where the ICP already talks. Use when looking for rooms, communities, or threads to enter. Does not write the message.
license: MIT
disable-model-invocation: true
---

# Find communities

Rooms and threads. Links and why that room. Niche is the point: twelve people in one Discord beats “developers on Twitter.”

Prefer **ICP hypothesis**. If empty, use evidence and say the ICP is still a guess.

Write **Reach list** with rooms, not people. People are `prospecting`.

Search recipes: [references/sources.md](references/sources.md).

## Process

From repo root: `node scripts/run-state-check.js find-communities`. After each real quote: `bash scripts/evidence-log.sh <source> '<quote>' '<url>'`.

## Do

1. Search Discord listings, Reddit, Indie Hackers, HN, Slack directories, forums, newsletters, GitHub Discussions, for the problem language in evidence.
2. Prefer rooms where the complaint already appears.
3. For each: URL or how to find it, size or activity if visible, why the ICP is there, any rule that blocks promo.
4. Rank by time-to-a-real-conversation, not follower count.

## Output

A short ranked list. Each row: place, link, why, promo rules, next human action (join, lurk, reply to thread X).

## Done

Ranked rooms with links you found this session. No intro draft.

## Refuse

Do not draft the intro message. That is `outreach`. Do not invent a server you did not find.
