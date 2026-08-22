---
name: youtube
description: Turns a YouTube URL into a markdown transcript with timestamps and a short summary at the end. Use when the user pastes a YouTube link and wants the script. Does not add GTM advice unless asked.
license: MIT
compatibility: Requires yt-dlp and network access
disable-model-invocation: true
---

# YouTube

URL in. Timestamped script out. Summary at the end. No positioning unless the founder asks.

## Process

From repo root:

```bash
node scripts/run-state-check.js youtube
bash skills/youtube/scripts/transcript.sh '<youtube-url>'
```

If `yt-dlp` is missing or the script prints `no captions`, say so and stop. Do not invent lines from the title.

Add a `## Summary` (5–10 lines) after the script body. What was said. No new claims. No CTA unless it was in the video.

Group is already done by the script. Do not rewrite the speech into a blog post.

## Output shape

Keep the script's header and `## Script` block. Then:

```markdown
## Summary

5–10 lines.
```

## Done

Timestamped script came from captions. Summary restates what was said. No invented lines.

## Refuse

Do not write reel ideas here. That is `video-ideas`.
