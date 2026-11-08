# A local outreach pipeline that preserves facts

## Storage and boundaries

The ledger is an append-only event history in `.shadowfax/outreach/ledger.json`. Commands are local and use Node 18+. They have no mailbox credentials, provider APIs, or sending capability. Imported verification and outcomes are reported evidence, not independently tested facts.

Run commands from the working founder project, using the actual plugin's script path if the plugin is elsewhere. Existing files are preserved on initialization; stable event IDs make exact reimports idempotent. A conflicting reused ID or invalid event rejects the entire import without partially updating the ledger. Writes use a lock and atomic replacement. If a crashed process leaves a lock, inspect whether it is still running before removing that lock manually.

```bash
node skills/outreach-ops/scripts/ledger.js init
node skills/outreach-ops/scripts/ledger.js apply --input events.json
node skills/outreach-ops/scripts/ledger.js plan
node skills/outreach-ops/scripts/ledger.js export > .shadowfax/outreach/handoff.csv
node skills/outreach-ops/scripts/ledger.js report
```

`--file` selects another ledger. `init --policy policy.json` sets pilot limits; defaults are two recorded touches, a seven-day minimum gap, 180 body words, and one HTTP(S) link. These are configurable planning defaults, not reply-rate benchmarks or an instruction to send two messages. `plan`/`export --limit N` bound the handoff. `--as-of` is useful for a synthetic rehearsal, but cannot precede recorded events and thereby bypass a later reply or suppression.

The default initialization adds a local Git ignore for this data directory. Keep real contact data and provider reports out of public fixtures. Protect exported copies too; a file outside the ignored directory is outside that protection. No command clears a suppression or resets reply history.

## Event contract

Each event has a unique lowercase `id`, `type`, and UTC ISO `at`. The ledger order is the time the observation was recorded; older source/check timestamps live inside that event. Do not backdate an import before the last recorded event. Use the source's actual observation date and your actual import timestamp. IDs are stable labels, not names or emails.

| Type | Fields in addition to id/type/at | Meaning |
| --- | --- | --- |
| account | `account: {id,name,domain,source}` | A business with a human-declared canonical domain; starts with unknown fit |
| qualification | `account_id,fit,reason,source` | Fit is yes/no/unknown, backed by a reason and source |
| contact | `contact: {id,account_id,name,role,email,source}` | A sourced person; email can be null; email syntax is not verification |
| signal | `signal: {id,account_id,kind,observation,interpretation,source,expires_at}` | Fact and buying inference are separate. Kinds: explicit-pain, evaluation, change, observed-gap, background |
| verification | `contact_id,email,status,method,reference,checked_at,expires_at` | Status deliverable/risky/unknown/invalid. Only provider or recipient-confirmed evidence can claim deliverable |
| draft | `draft: {id,contact_id,subject,body,signal_ids,claims,not_before?}` | Immutable version, with cited signals and factual text mapped to evidence |
| review | `draft_id,verdict,checks,note` | pass/revise. Pass requires facts/voice/offer checks all true |
| activity | `contact_id,kind,reference,draft_id?` | Actual reported sent/delivered/qualified/activated/won/lost/bounced event |
| reply | `contact_id,intent,reference,excerpt` | Human/model-reviewed disposition of supplied reply, never an autonomous inbox classification |
| suppression | `scope,target_id,reason` | Persistent contact or account exclusion |

A `source` is `{url,observed_at}`. Source URLs must be HTTP(S), without credentials; the CLI records them and never fetches them. A `claims` item is `{text,signal_id}` for a prospect fact or `{text,source_url}` for a product fact. The exact text must occur in the draft. This enforces traceability, not truth or coverage of every claim. Human/agent factual review must catch unsupported claims that were omitted from the map.

Verification methods include provider, recipient-confirmed, public-listing, syntax, and dns. The last three cannot substantiate deliverable status. Risky/catch-all is excluded by this tool's default handoff. Expiry dates are explicit user-chosen validity windows for the source, not a universal claim that email verification lasts a fixed number of days.

Reply intents: interested, question, objection, referral, not-now, not-interested, opt-out, auto-reply, unknown. Any reply pauses cold handoffs at the account level until a human handles the conversation outside this queue. This deliberately conservative queue does not automate resumed conversations.

## Why a row is blocked

Fit unknown/no; missing email/check; risky/invalid/expired check; stale signal; background-only evidence; unresolved merge token or HTML; failed/unrecorded review; placeholder or fake reply subject; known suppression/decline/bounce; a reply from a colleague; an existing account outcome; a used draft; too many touches; cooldown; missing new follow-up draft/date; or another eligible contact already selected for the account.

A new follow-up must be a newly recorded and reviewed draft after the last actual send, with a `not_before` date, fresh evidence, and something useful to add. Never log a send merely because a CSV was exported. A contact change is not a way around silence, a reply, or refusal. Subdomains, subsidiaries, common mail hosts, and aliases require deliberate account matching; this is not an identity-resolution service.

## Rehearse without real people

The [synthetic event batch](../assets/example-events.json) uses reserved `.test` domains and invented activity. Copy it to a temporary working project. Initialize a ledger, import it, and plan with `--as-of 2026-11-08T12:00:00Z`. One reviewed draft should be ready. Then import a matching opt-out event with a later `at`; it and account colleagues should disappear from ready handoffs. Never treat the sample's provider reference as a real verification report.

## Read a report

Counts use unique people with recorded sends. Human replies exclude automatic replies; questions and positive replies do not become qualified opportunities automatically. Delivery is counted only from a delivered event. Qualification, activation, and wins require separate reported events with references. Unknown outcomes stay unknown. Rates have the unique-contacted denominator and are null when nobody was contacted. No causal lift is inferred.

Before using a CSV externally, refresh the plan against current data and follow the chosen sender's requirements. A separate sequencer will not receive later ledger suppressions automatically. This limitation remains explicit in every handoff.
