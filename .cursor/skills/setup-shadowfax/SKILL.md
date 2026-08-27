---
name: setup-shadowfax
description: Initializes .shadowfax/run-state.md and evidence.tsv in the working project. Use when installing Shadowfax, starting a new product, or the run-state file is missing.
license: MIT
disable-model-invocation: true
---

# Setup Shadowfax

Working-project state, not plugin doctrine. Idempotent. Does not overwrite a filled run-state.

## Process

From the plugin root:

```bash
node skills/setup-shadowfax/scripts/init.js
```

In Cursor, also:

```bash
node scripts/install-cursor.js
```

Then reload the window. Empty run-state → `/onboarding`. Filled product truth → `/roadmap` then `/shadowfax`.

If `.shadowfax/run-state.md` already has product truth, say so and stop. Do not reset their bet.

## Output

Paths created or left alone. One sentence: empty run-state → `/onboarding` or fill product truth, then `/roadmap`, then `/shadowfax`.

## Done

cwd `.shadowfax/run-state.md` exists. Template noise is still template, or their text was not overwritten.

## Refuse

Do not invent a market to fill the file. Do not copy skills into a product repo. The plugin stays the plugin.
