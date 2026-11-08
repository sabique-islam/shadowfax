---
name: write
description: Removes AI slop from outbound GTM prose while keeping claims, voice, and authenticity. Use when drafting or editing outreach, posts, content, launch copy, sales language, or when text sounds like a chatbot or like a different person than the founder.
license: MIT
---

# Write

Gate on anything the founder might paste. You do not pick the channel or the ICP. You fix the sentences so they still sound like the same person.

Lineage (do not vendor the repos): elithrar anti-slop (voice vs slop), stop-slop (authenticity score), soundshuman (match a sample, no invented facts), slopbeth (no detector tricks), Orwell. Catalog: [references/tells.md](references/tells.md). Examples: [references/examples.md](references/examples.md). Pre-delivery: [references/checklist.md](references/checklist.md).

## Command

From repo root, on the draft (file or stdin). Execute this. Do not skip it.

```bash
node scripts/run-state-check.js write
node skills/write/scripts/lint.js analyze draft.md
node skills/write/scripts/lint.js score draft.md
```

Rules live in [scripts/rules.json](scripts/rules.json). The score is a signal, not a detector verdict. Isolated lexicon (one "robust") is dropped. Clusters stay. Judgment in this file still wins on voice vs slop.

## Rules

1. **Authenticity first.** Would a person who lived this say it this way, in this channel, with this much certainty? If not, it is slop even if the lexicon is clean.
2. **Match a sample.** If the founder pasted their own writing or run-state has a voice note, match register, contractions, and how they hedge. No sample: stay specific and plain. Do not invent a personality.
3. **Slop vs voice.** Slop is formula with no load. Voice is a choice the founder would defend. When unsure, leave it. Flat voiceless prose is its own tell.
4. **Claims stay.** Do not add a fact, metric, customer, date, quote, trend, or lived anecdote that is not in the source or the run-state. Vague stays vague or becomes a question.
5. **Phrasing first.** Do not reorder the argument unless the founder asked for a rewrite. Surgical edits.
6. **Plain words.** is/has, not serves as. Short word unless the long one is the term (`latency`, `idempotent`).
7. **Name the actor.** "You" and a named person beat "people" and "teams everywhere." Decisions do not emerge.
8. **Rhythm.** Mix sentence length. Two items beat a forced three. No em dashes unless the founder's sample uses them.
9. **Trust the reader.** Delete throat-clearing and "this matters because." State the thing.
10. **Platform.** Emails and DMs stay plain text. Contractions are fine. No "I hope this email finds you well."
11. **Break a rule** sooner than write something untrue, unclear, or graceless.

## Refuse

- Run a banned-word crusade that flattens a founder who says "robust" on purpose.
- Inject personality, slang, typos, or "soul" the source does not have.
- Invent a lived anecdote, source post, quotation, or trending event to sound human. Original humor grounded in supplied or verified context is allowed; preserve the founder’s intentional wit.
- Claim the draft is undetectable or detector-proof.
- Turn the draft into a new template of clipped aphorisms.

## Process

1. Read the draft, the intended channel, and any founder sample.
2. Run `node skills/write/scripts/lint.js analyze` on it.
3. Collect tell candidates. Do not edit yet. Drop isolated hits the linter already dropped. Validate slop vs voice vs authenticity (could they defend this sentence? did we add a life we don't have?).
4. Apply surviving edits. Keep every claim. Keep mixed feelings and hedges that were in the source.
5. Lint again. Audit: what still sounds machine-written? Did you add or drop a fact? Did the voice change authors?
6. Return the draft. If you changed meaning, say so in one line.

## Output

Paste-ready text for the channel. One line if meaning changed. Lint JSON if findings remain.

## Done

Lint ran. Every claim from the source still holds. The sentences could come from the founder. The founder can paste.

## Score (optional)

Directness, rhythm, trust, **authenticity**, density: 1-10 each. Authenticity is "would they say it this way?" Below 35/50, another pass. A 10 on density with a 3 on authenticity is a fail.
