---
name: positioning
description: Writes the lead sentence and the refuse-to-say list from evidence. Use when deciding what to say, what angle to lead with, or what not to claim. Does not pick a channel or draft posts.
license: MIT
disable-model-invocation: true
---

# Positioning

What to say. What not to say. One lead sentence.

You need **Evidence** and preferably **ICP**. If fifteen quotes already name the problem, that language wins over founder-speak.

Write **Positioning bet**.

## Process

From repo root: `node scripts/run-state-check.js positioning`. If it fails, stop.

## Do

1. State the sentence a specific ICP would repeat back.
2. List claims we will not make (too broad, untrue today, competitor-echo, category theater).
3. If current positioning in run-state conflicts with evidence, say it is wrong and replace it.
4. Keep it short enough to use in outreach.

## Output

- Lead sentence
- Proof it came from evidence (quote pointers)
- Refuse-to-say (bullets)
- One line on what we used to say that we are dropping, if anything

## Done

Lead sentence and refuse-to-say list are written. No channel pick, no posts.

## Refuse

Do not write a brand manifesto. Do not draft the tweet that uses the sentence. That is `posts`. Do not pick Reddit vs email. That is `distribution`.
