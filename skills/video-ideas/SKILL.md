---
name: video-ideas
description: Suggests reel and short-form video ideas for community engagement. Use when the founder wants hooks, what to film, or short-video angles. Drafts only. Does not edit video.
license: MIT
disable-model-invocation: true
---

# Video ideas

Hooks, what to film, where it might go. Scripts optional. Draft only.

Prefer **ICP** and **Positioning bet**. If the founder wants a YouTube *transcript*, that is `youtube`. Ground formats in `trends` fetch hits or evidence URLs. Do not invent a meme.

## Process

From repo root:

```bash
node scripts/run-state-check.js video-ideas
node skills/video-ideas/scripts/check.js ideas.md
```

Spoken lines: `node skills/write/scripts/lint.js analyze draft.md`, then apply `skills/write`. check.js must exit 0.

## Do

1. Each idea: hook (first 2 seconds), what is on camera, the one point, where to post, source (`https://...` or `evidence:`).
2. Prefer things one person can film on a phone.
3. Cap at 5 ideas unless they asked for more.

## Output

Numbered ideas. Hook, shot list, line if any, destination, source, what to watch (comments / DMs / they asked for the next one).

## Done

Each idea has a hook, what to film, and a source URL or evidence pointer. check.js exited 0. No edited video.

## Refuse

A 30-day reel calendar. Stock “day in the life of a founder” with no product fact. A meme format that was not in a fetch or evidence line.
