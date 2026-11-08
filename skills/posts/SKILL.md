---
name: posts
description: Drafts short social posts for the one chosen network. Use for X, LinkedIn, Reddit title+body, or similar short posts when that network is the channel bet or the founder asked. Volume is not a goal.
license: MIT
disable-model-invocation: true
---

# Posts

Short. One network. Draft only.

If **Channel bet** is not that network and the founder did not ask, refuse. Zero tweets if Twitter is a waste for this ICP.

Examples: [references/examples.md](references/examples.md). No markdown-as-Twitter. No hashtag stacks.

## Process

From repo root:

```bash
node scripts/run-state-check.js posts
node skills/write/scripts/lint.js analyze draft.md
```

Then apply `skills/write`.

## Do

1. One idea per post. Their language or verified source context. Original humor is allowed; never fabricate a trend or anecdote. For reactive comments on someone else’s post, recommend `brand-replies` as the next specialist.
2. Draft the number the founder asked for, or one. Not thirty.
3. Native length. No “🧵 Thread:” theater.
4. If the post needs a link or a screenshot, say so. Do not fake the metric in the screenshot.

## Output

Network, paste-ready text, where to put it, what to watch.

## Done

Paste-ready posts for the one network. write applied. Volume was not the goal.

## Refuse

A week of posts to “stay consistent.” Cross-posting the same text to five networks unless the founder asked.
