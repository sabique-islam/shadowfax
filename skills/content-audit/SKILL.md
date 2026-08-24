---
name: content-audit
description: Ranks existing blog posts by search opportunity (recover, CTR gap, rank-to-page-one), flags hygiene, and drafts surgical edits. Use when the founder pastes GSC, empty SEO fields, a blog audit, or "ranking but no clicks." Does not publish. Does not write a new post.
license: MIT
disable-model-invocation: true
---

# Content audit

Rank by headroom, not age. Propose. The founder applies.

Open this when **Channel bet** is the blog / SEO, or the founder pasted Search Console (or equivalent) and asked to audit. If the channel this cycle is not the blog, refuse.

This skill has no write tool. Cards are Approve / Edit / Skip for a human. Do not push a CMS, Slack button handler, or git commit that changes the site.

## Process

From repo root:

```bash
node scripts/run-state-check.js content-audit
node skills/content-audit/scripts/opportunity.js posts.json
```

`posts.json` shape: `{ "posts": [{ "slug": "foo", "impressions": 1000, "clicks": 10, "position": 9.4, "prevClicks": 40 }] }`. Optional: `minImpressions` (default 1000), `absDropMin` (20), `propDropMin` (0.2). Missing counts stay out of the math. Do not invent GSC numbers.

Then, for every paste-ready title or sentence, `node skills/write/scripts/lint.js analyze` and apply `skills/write`.

## Score

The script scores each post three ways against the window they gave (default last 28 days). The biggest estimate wins and picks the fix type.

- **recover** → clicks lost vs the previous window. Regression.
- **ctr** → page-one clicks the post did not get vs `expectedCtr(position)` in the script. Title / description.
- **rank** → extra clicks if a page-two post landed at position 10. Content push.

CTR uses average position, which blends every query the page ranks for. Treat the click estimate as an ordering signal, not a forecast.

Guardrails already in the script:

- Low impressions + no real click loss → `low-visibility`. Nobody is searching. Drop it from the queue.
- A real click loss (absolute and proportional) surfaces even when impressions are small.

Do not retune `expectedCtr` from memory. Change the function in the script if the founder has a better curve, and test it.

## Cheap vs expensive

Cheap, every published post they listed: empty SEO title/description, dead links they already know, traffic drop vs last window, a word search for refused positioning.

Expensive (load the live page and quote a contradiction against docs): only the top ~15 queued posts, plus 3 more as a buffer so low-impression URLs are not unverified forever. No contradiction from memory.

## Edits

A suggestion may change the SEO title, the SEO description, or swap one exact phrase or link. If it is not one clean swap, the card is Edit and Skip only. A human writes the rest.

Mark two classes **safe-apply** (founder still pastes; we still do not publish): dead link with a known replacement, and filling an empty SEO title or description.

Do not refresh a post because it is old.

## Measure

When they say an edit went live, snapshot that post and the whole blog for the same dates:

```bash
node skills/content-audit/scripts/measure.js snapshot.json
```

`snapshot.json`: `{ "kind": "edit"|"new", "windowDays": 28, "post": { "clicksBefore": 100, "clicksAfter": 130 }, "site": { "clicksBefore": 1000, "clicksAfter": 1100 } }`. Re-read at 28 and 56 days. A 20% lift on one URL means nothing if the whole blog moved. Leave some flagged posts unedited when the queue is long so bounce-back is visible. New posts have no before: `kind: "new"` (growth curve, same site dates).

Do not say the audit worked unless the founder reported those readings.

## Output

1. Hygiene list (empty SEO, known dead links). Safe-apply vs needs prose.
2. Ranked queue from the script. Lever, opportunity, proposed fix.
3. One card per queued URL:

```
Approve / Edit / Skip
slug:
lever: recover | ctr | rank
opportunity: N clicks (soft)
edit: "exact before" → "exact after"
or: Edit/Skip only (not one swap)
safe-apply: yes/no
watch: +28d / +56d vs site-wide
```

4. What you did not edit, and why (low-visibility, holdout, not one swap).

## Done

Queue is ordered by the script. Each card is one surgical edit or Edit/Skip. write ran on prose. Nothing was published.

## Refuse

A rewrite of the blog. A second post for a query an existing post already owns (that is `content`, and `content` must stop). Invented rankings. Declaring the CTR gap recovered.
