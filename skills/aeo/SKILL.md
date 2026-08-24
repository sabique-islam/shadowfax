---
name: aeo
description: Splits answer-engine visibility into crawl, cite, and click, and maps citation exports back to post slugs. Use when the founder asks about AEO, AI Overviews, ChatGPT/Claude citations, or whether LLMs quote the blog. Does not invent citation counts.
license: MIT
disable-model-invocation: true
---

# AEO

Crawl, cite, click. Three different questions.

GSC can show that Google sent a person. It does not tell you whether ChatGPT, Claude, or AI Overviews quoted the page. Do not collapse those into "AI traffic."

You need an export, a referrer table, or crawl logs they actually have. Write **Last observation** only with numbers they gave.

## Process

From repo root:

```bash
node scripts/run-state-check.js aeo
node skills/aeo/scripts/citations.js export.csv [totalPosts]
```

CSV needs a `url`, `page`, or `slug` column. Long form: `engine`, `citations`. Wide form: engine names as headers (`ChatGPT`, `Claude`, `AI Overviews`) with counts. JSON `{ "rows": [{ "url": "...", "engine": "chatgpt", "citations": 2 }], "totalPosts": 77 }` is fine.

If the file is missing columns, say so and stop. Do not guess citations from training data.

Click layer: use the GSC / referrer numbers they pasted, not the citation export. If they also have before/after for a URL, `node skills/content-audit/scripts/measure.js` is the control math. Do not open `content-audit` this turn unless they named it; you may still run that script.

Crawl layer: only if they have logs (CDN, host, bot UA). If that access is behind SSO or out of scope, name it deferred. Do not pretend a sitemap ping is a crawl proof.

## Split

1. **Crawl** — did an engine fetch the page?
2. **Cite** — did an answer quote it? (export → `citations.js`)
3. **Click** — did a person land? (referrer / GSC, including AI Overviews folded into search if that is how their account reports)

Posts that win in Google and posts that get cited are often not the same set. Do not assume the top search URLs are the cited URLs.

## Output

- Cited slugs, counts, engines (from the script)
- Domain: cited posts / total posts they gave, or `unknown`
- Click numbers they gave, kept separate
- Crawl: measured, deferred, or unknown
- Why a named post is not cited, only if the export or the page itself supports it (wrong question, thin answer, no crawl). Otherwise unknown.

## Done

Cite counts come from the file they provided. Click and crawl are labelled separately. No engine was queried from here.

## Refuse

An "AEO strategy" with no export and no referrers. Invented ChatGPT quotes. Treating impressions as citations. Publishing, submitting URLs, or emailing webmaster tools.
