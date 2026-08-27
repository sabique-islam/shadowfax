---
name: icp
description: Names the one primary early-user ICP from evidence. Use when deciding who is most likely to become a first user or customer. Does not write positioning or pick a channel.
license: MIT
disable-model-invocation: true
---

# ICP

One primary. Named if possible. Secondary only if the founder asks. Sharp "not for" makes yes believable.

Framework: [references/framework.md](references/framework.md).

You need **Evidence**. If evidence is thin, refuse and point at `market-research`, `find-complaints`, or `talk-to-users`.

Write **ICP hypothesis** only.

## Process

From repo root: `node scripts/run-state-check.js icp`. If it fails, stop.

## Do

1. Cluster who already complained, paid a substitute, or tried a hack.
2. Pick the cluster most likely to try an unfinished product (pain now, reachable, can act without a committee if that is true).
3. Name them: role, company type, trigger, why they move first.
4. Name who is *not* the ICP this cycle and why (too slow, no pain, wrong stage).

## Output

- Primary ICP in 5–8 lines
- 3 example companies or people if you can find them (or “none found”)
- Not-ICP this cycle

## Done

ICP hypothesis is written. The positioning sentence is not.

## Refuse

Do not invent a “forward-deployed platform engineer at Series B” if the quotes are from indie hackers. Do not write the positioning sentence. That is `positioning`.
