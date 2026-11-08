---
name: launches
description: Drafts a coordinated launch across the channels already chosen for this launch. Use when shipping a Show HN, Product Hunt, changelog launch, or similar. Not a single post declared as victory.
license: MIT
disable-model-invocation: true
---

# Launches

Coordinated drafts. The founder still posts. One deep launch beats ten shallow ones.

Launch guide: [references/launch-guide.md](references/launch-guide.md).

**Channel bet** (or an explicit launch channel list from `distribution`) is required. If empty, refuse and open `distribution` via the router, do not invent five channels.

## Process

From repo root:

```bash
node scripts/run-state-check.js launches
node skills/write/scripts/lint.js analyze draft.md
```

Then apply `skills/write` to every draft. Run `review` on the primary launch post before presenting.

## Do

1. List the channels this launch actually uses. Two is fine. Twelve is usually theater.
2. For each: paste-ready text, timing relative to the others (what goes first), what to watch.
3. Reuse the positioning sentence. Do not rewrite the product for each site.
4. Include a follow-up draft for comments/objections if the room will have them (HN, PH).

## Output

Per channel: when, where, paste-ready, watch.

Then: what we are *not* doing (the leftover networks).

## Done

Paste-ready drafts exist only for channels already chosen. write applied. Record the launch hypothesis and thresholds in **Success / kill**; put actual dated results in **Last observation** after the founder reports them.

## Refuse

“Post everywhere and call it a launch.” Assets for a channel that was not chosen.
