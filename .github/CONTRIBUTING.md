# Contributing

Shadowfax is a founder-side GTM skill pack. Draft and research only. Do not write product code for a customer's app. Do not send, post, star, or open issues for engagement.

## Setup

Node 18+. Zero runtime dependencies.

```bash
git clone https://github.com/sabique-islam/shadowfax.git
cd shadowfax
npm test
npm run validate
```

Canonical skills live in `skills/`. After you edit a skill, copy them for Cursor slash:

```bash
npm run sync-cursor-skills
```

CI fails if `skills/` and `.cursor/skills/` drift.

## What to change

- One skill per PR unless the router or a shared script forces more.
- SKILL.md: `name` matches the folder, WHEN in `description` (`Use when` / `Use for` / `Use after`), `license: MIT`, `## Process`, `## Done`, `## Refuse`. Specialists set `disable-model-invocation: true`. Router and `write` stay model-invoked.
- Scripts named in a SKILL.md must exist. Execute them in the skill; do not reimplement them in prose.
- `write`: distill anti-slop refs into `skills/write` only. Do not vendor `refs/anti-slop/` into skills.
- Do not add a CHANGELOG.

## Tests

```bash
npm test
npm run validate
```

If you change the router, add a fixture in `skills/shadowfax/tests/pick.test.js`. If you change `write` lint rules, add a sample in `skills/write/tests/lint.test.js`.

## Pull requests

Use the PR template. Maintainers will not merge if validate or tests fail, or if the Cursor skill copy is out of sync.

## Conduct and security

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security](SECURITY.md) — private advisories, not public issues, for vulnerabilities
