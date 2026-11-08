# Behavior-triggered email playbook

## Pick one flow

| Flow | Entry | Exit | Useful message |
| --- | --- | --- | --- |
| Activation | Signed up, first-value event absent | First value, opt-out, invalid address | Help finish one blocked task |
| Nurture | Explicitly subscribed for a relevant resource | Trial/purchase, opt-out | A concrete method and next step |
| Trial decision | Eligible trial approaching an actual end date | Purchase, extension, cancellation | What happens next and how to keep useful work |
| Reactivation | Previously valued product, normal use interval missed | Return, opt-out, terminal suppression | Ask if the recurring need still exists |
| Expansion | Observed usage indicates a real limit | Upgrade, decline, need disappears | Explain the limit and appropriate option |

Define time delays relative to the user's job. A weekly importer does not need a daily inactivity warning. No generic seven-email sequence by default.

## Hypothetical activation flow

Product: importer. Value event: completed a preview without blocking errors. Eligible: new users who created an account but have not reached that event. Exclude opted-out/bounced addresses and people already receiving a support conversation about the same blocker.

1. Immediately after signup, provide the exact next action: run a synthetic sample preview. If the product itself already explains this well, email may be unnecessary.
2. After 24 hours with no preview, offer the one troubleshooting aid supported by real friction evidence. Skip if the value event arrives before sending.
3. After another appropriate interval, ask whether the need still exists and offer a real support route. End the flow rather than escalating indefinitely.

The timings are example assumptions. The owner must resolve actual sending eligibility and preference rules before implementing. This skill prepares the brief, never enables the sequence.

## Message contract

For each email include trigger query in plain language, event source, delay/timezone, latest eligibility recheck, campaign frequency cap, subject, preview, body, one CTA, exact destination, fallbacks, suppression rules, and exit event. A completed step removes subsequent reminders even when a scheduled job already exists.

Avoid fictional “I noticed you…” personalization if the behavior was not observed or the founder would not actually write it. A real deadline comes from the user's account state, not marketing copy. Never threaten data deletion or loss of access unless the actual product policy establishes it.

## Measurement

Count eligible unique users, assigned cohort, delivered email, CTA action, first value, repeat value, conversion, opt-outs, bounces, and support complaints. Agree event definitions with the implementer. Deduplicate users across messages; three emails to one person do not create three opportunities.

Where practical, assign eligible people to a no-email comparison before the first send. Hypothetical: 40 eligible accounts, 20 in each group, seven first-value completions in the email group versus five in the holdout. This is descriptive pilot evidence, not a reliable claim of a ten-point lift. Longer windows and larger samples may be needed. No open-rate victory declarations.

If the message gets clicks but first value fails, inspect the destination and product friction. If opt-outs or complaints rise, pause and reassess relevance and frequency. If users complete the job without email, the flow may be unnecessary. Do not add more reminders to compensate for a broken importer.

## Two original message specimens

Hypothetical importer account, with a real sample-preview feature. Subject: try one sample. Preview: A safe way to check the first import. Body: “You can preview a sample before importing a full file. Open the sample, check the column mapping, and run the preview. If a column looks wrong, reply with its name and a synthetic example.” CTA destination: the working in-account sample route. Skip this message if a preview already succeeded. No claim that the founder personally checked the user's account.

Hypothetical meal-planning subscriber who explicitly requested weekly ideas. Subject: one dinner from what's left. Preview: Start with the ingredients you already have. Body: “Choose three ingredients in your kitchen. The planner will suggest a dinner using them and show what else you'd need. Save the one you want to cook this week.” CTA destination: the actual ingredient planner. Exit on opt-out; do not use a signup to a waitlist as permission for unrelated daily offers. These examples require verified features and a suitable subscriber relationship before use.
