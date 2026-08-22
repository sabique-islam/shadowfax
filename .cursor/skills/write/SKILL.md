---
name: write
description: Removes AI slop from outbound GTM prose while keeping claims and voice. Use when drafting or editing outreach, posts, content, launch copy, sales language, or when text sounds like a chatbot.
license: MIT
---

# Write

Gate on anything the founder might paste. You do not pick the channel or the ICP. You fix the sentences.

Lineage (do not vendor the repos): elithrar anti-slop, stop-slop, soundshuman, slopbeth, Orwell. Catalog: [references/tells.md](references/tells.md). Examples: [references/examples.md](references/examples.md). Pre-delivery: [references/checklist.md](references/checklist.md).

## Command

From repo root, on the draft (file or stdin). Execute this. Do not skip it.

```bash
node scripts/run-state-check.js write
node skills/write/scripts/lint.js analyze draft.md
node skills/write/scripts/lint.js score draft.md
```

Rules live in [scripts/rules.json](scripts/rules.json). The score is a signal, not a detector verdict. Isolated lexicon (one "robust") is dropped. Clusters stay. Judgment in this file still wins on voice vs slop.

## Rules

1. **Slop vs voice.** Slop is formula with no load. Voice is a choice the founder would defend. When unsure, leave it. Flat voiceless prose is its own tell.
2. **Claims stay.** Do not add a fact, metric, customer, date, quote, or trend that is not in the source or the run-state. Vague stays vague or becomes a question. No fake 2am stories.
3. **Phrasing first.** Do not reorder the argument unless the founder asked for a rewrite. Surgical edits.
4. **Plain words.** is/has, not serves as. Short word unless the long one is the term (`latency`, `idempotent`).
5. **Name the actor.** Decisions do not emerge. Someone decides.
6. **Rhythm.** Mix sentence length. Two items beat a forced three. No em dashes unless the founder's sample uses them.
7. **Trust the reader.** Delete throat-clearing and "this matters because." State the thing.
8. **Platform.** Emails and DMs stay plain text. Contractions are fine. No "I hope this email finds you well."
9. **Break a rule** sooner than write something untrue, unclear, or graceless.

## Refuse

- Run a banned-word crusade that flattens a founder who says "robust" on purpose.
- Inject personality the source does not have.
- Invent a joke or a trend to sound human.
- Turn the draft into a new template of clipped aphorisms.

## Process

1. Read the draft and the intended channel.
2. Run `node skills/write/scripts/lint.js analyze` on it.
3. Collect tell candidates. Do not edit yet. Drop isolated hits the linter already dropped. Validate slop vs voice.
4. Apply surviving edits. Keep every claim.
5. Lint again. Audit: what still sounds machine-written? Did you add or drop a fact?
6. Return the draft. If you changed meaning, say so in one line.

## Output

Paste-ready text for the channel. One line if meaning changed. Lint JSON if findings remain.

## Done

Lint ran. Every claim from the source still holds. The founder can paste.

## Score (optional)

Directness, rhythm, trust, authenticity, density: 1-10 each. Below 35/50, another pass.
