---
name: content
description: Drafts long-form from product work, PRs, user language, or Search Console near-misses, then gates the draft (strategy, structure, code provenance, cannibalization). Use when the channel bet is content-shaped or the founder asks for an article, changelog essay, Show HN writeup, or a new SEO post. Does not publish. Does not write tweet threads.
license: MIT
disable-model-invocation: true
---

# Content

Long-form. Sourced from real work. Draft only. The founder publishes.

Open this when **Channel bet** is content-shaped (blog, Show HN, SEO piece, launch essay) or the founder asked. If the channel is cold email, refuse and point at `outreach`.

Facts come from run-state, a named PR/issue, GSC they pasted, or the founder. No invented users. No invented code.

Writing taste lives in this file. Automated gates live in `scripts/gate.js`. If the pipeline file starts deciding what good prose is, it is in the wrong file.

## Process

From repo root:

```bash
node scripts/run-state-check.js content
node skills/content/scripts/gate.js draft.json
node skills/write/scripts/lint.js analyze draft.md
```

Then apply `skills/write`.

`draft.json` shape:

```json
{
  "title": "...",
  "body": "## TL;DR\n\n...",
  "cluster": "notes",
  "persona": "STEM note-takers",
  "bannedTerms": ["second brain"],
  "targetQueries": ["notion latex paste"],
  "existingPosts": [{ "slug": "why-wings-exists", "queries": ["why wings"] }]
}
```

Banned terms come from **Positioning bet** (the refuse list) plus anything the founder named. Persona is the ICP. Cluster is the content bucket they already use, or one sentence they accept.

On gate failure: redraft at most twice, then stop with no draft. Do not save junk for later cleanup.

If the failure is cannibalization, stop. Name the owning slug. Next human action is `/content-audit` on that post. Do not open `content-audit` unless they named it. Do not retry with a rephrase.

## Pick a topic

Prefer a near-miss they can show in GSC: already showing 150+ times, average position 5–20, no dedicated post. A requested topic is not pre-approved. It still gets cluster, persona, banned-term, and cannibalization checks.

If they have no demand data, source the piece from a named PR, issue, or user quote instead. Do not invent a keyword.

## Write

1. One ICP. Lead with their problem language from evidence.
2. Label a **TL;DR** (or At a glance) near the top. The gate looks for that label. It does not judge whether the rest is any good.
3. Every fenced code block needs a docs URL: info string `docsUrl=https://...` or a first-line `docs:` comment. Pull the snippet from that URL this session. Do not invent APIs.
4. Structure follows the material. Do not bolt on “Challenges” and “The future looks bright.”
5. End on a concrete next step for the reader if the piece needs one.

## Measure

A new URL starts at zero. When they say it went live, enroll it for 28- and 56-day readings with the blog-wide numbers for the same dates (`node skills/content-audit/scripts/measure.js` with `"kind": "new"`). Publishing failure, enrollment, and recording are the founder's CMS. We only tell them to snapshot.

## Output

Title, paste-ready draft (unlisted until they publish), target queries, gate JSON, where it goes, what to watch (rank, citations later via `aeo`, silence).

## Done

One long-form draft, gated, linted, sourced from real work. Cannibalization did not create a second post. The founder can paste it.

## Refuse

A content calendar. A thread that belongs in `posts`. A recap of every merge this week. Publishing. A second post that splits an existing query.
