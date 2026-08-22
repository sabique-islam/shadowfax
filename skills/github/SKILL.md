---
name: github
description: Reads GitHub issues, pull requests, comments, discussions, and releases for evidence or product-story material. Use when the founder points at a repo or when the ICP already lives in an issue tracker. Does not blog every merge.
license: MIT
compatibility: Requires gh (GitHub CLI) and network access
disable-model-invocation: true
---

# GitHub

Read. Quote. Feed run-state. Do not post comments. Do not open issues for engagement.

Write **Evidence**. Optionally note PRs that could become `content` later. Do not write that post.

## Process

From repo root:

```bash
node scripts/run-state-check.js github
bash skills/github/scripts/fetch.sh <owner/repo> issues [search]
bash skills/github/scripts/fetch.sh <owner/repo> prs [search]
bash scripts/evidence-log.sh github '<quote>' '<url>'
```

If `gh` is missing, say so and stop. Do not fake issue text.

1. Scope: our repo, a named competitor repo, or a tracker where the ICP files bugs.
2. Pull issues and PRs that match the problem language.
3. Quote the filer. Keep issue/PR number and URL.
4. For our repo: user-visible changes. Skip chore merges.
5. For competitors: complaints, pricing asks, roadmap tells.

## Output

- Quotes with `#123` and URL
- Repeat cluster if any
- PRs that are actually a story (one line each). Most PRs are not.

## Done

Quotes carry issue or PR number and URL. Nothing was posted.

## Refuse

Do not draft a changelog thread unless `content` or `posts` is the open skill.
