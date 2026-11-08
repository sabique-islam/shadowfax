#!/usr/bin/env node
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const { append, replay, plan, report, csv, DEFAULT_POLICY } = require('../scripts/ledger.js');
const example = require('../assets/example-events.json');
const at = '2026-11-08T12:00:00Z';
const clone = value => JSON.parse(JSON.stringify(value));
const fresh = () => ({ version: 1, policy: { ...DEFAULT_POLICY }, events: [] });
const base = () => append(fresh(), clone(example)).ledger;
const add = (ledger, ...events) => append(ledger, events).ledger;
const activity = (id, kind, time = at, extra = {}) => ({ id, type: 'activity', at: time, contact_id: 'mina', kind, reference: id + '-ref', ...extra });
const source = { url: 'https://lantern.test/team', observed_at: '2026-11-01T09:00:00Z' };
const nextDraft = (id = 'second-draft', time = at, extra = {}) => ({ id: id + '-event', type: 'draft', at: time, draft: { ...clone(example[5].draft), id, not_before: time, ...extra } });
const review = (draft, time = at) => ({ id: draft + '-review', type: 'review', at: time, draft_id: draft, verdict: 'pass', checks: { facts: true, voice: true, offer: true }, note: 'Reviewed against the supplied source and product facts.' });
const reply = (intent = 'question') => ({ id: 'reply-' + intent, type: 'reply', at, contact_id: 'mina', intent, reference: 'inbox-' + intent, excerpt: 'Supplied message for ' + intent });
const reasons = ledger => plan(ledger, at).decisions.find(x => x.contact_id === 'mina').reasons;
assert.strictEqual(plan(base(), at).ready.length, 1);
assert.strictEqual(append(base(), clone(example)).added, 0);
const reversedKeys = clone(example).map(e => Object.fromEntries(Object.entries(e).reverse()));
assert.strictEqual(append(base(), reversedKeys).added, 0);
assert.throws(() => append(base(), [{ ...example[0], account: { ...example[0].account, name: 'Changed' } }]), /reused/);
assert.throws(() => append(base(), [null]));
assert.throws(() => add(base(), { id: 'bad', type: 'unknown', at }), /unknown event/);
assert.throws(() => add(base(), { ...clone(example[0]), id: 'account-two', at, account: { ...example[0].account, id: 'second', domain: 'www.LANTERN.test.' } }), /duplicate account domain/);
assert.throws(() => add(base(), { ...clone(example[2]), id: 'contact-two', at, contact: { ...example[2].contact, id: 'second', email: 'MINA@LANTERN.TEST' } }), /duplicate contact email/);
assert.throws(() => add(base(), { ...clone(example[1]), id: 'old-event', at: '2026-10-01T00:00:00Z' }), /order/);
assert.throws(() => add(base(), { ...clone(example[1]), id: 'future-source', at, source: { ...source, observed_at: '2026-12-01T00:00:00Z' } }), /observation/);
assert.throws(() => add(base(), { ...clone(example[4]), id: 'dns-is-not-verification', at, method: 'dns' }), /does not prove/);
assert.throws(() => add(base(), { ...clone(example[4]), id: 'listing-is-not-verification', at, method: 'public-listing' }), /does not prove/);
assert.throws(() => add(base(), { ...clone(example[4]), id: 'wrong-address', at, email: 'colleague@lantern.test' }), /exact address/);
assert.throws(() => add(base(), { ...clone(example[4]), id: 'impossible-date', at, checked_at: '2026-02-30T00:00:00Z' }), /valid date/);
const risky = add(base(), { ...clone(example[4]), id: 'risky-check', at, status: 'risky', checked_at: at, expires_at: '2026-12-01T00:00:00Z' });
assert(reasons(risky).includes('no-deliverable-evidence'));
const expired = add(base(), { ...clone(example[4]), id: 'expired-check', at, expires_at: '2026-11-02T00:00:00Z' });
assert(reasons(expired).includes('verification-expired'));
const stale = base(); stale.events.find(e => e.type === 'signal').signal.expires_at = '2026-11-02T00:00:00Z';
assert(reasons(stale).includes('signal-expired'));
const background = base(); background.events.find(e => e.type === 'signal').signal.kind = 'background';
assert(reasons(background).includes('background-is-not-buying-evidence'));
const noReview = base(); noReview.events.pop(); assert(reasons(noReview).includes('needs-review'));
assert.throws(() => add(base(), { ...review('mina-first'), id: 'bad-review', checks: { facts: false, voice: true, offer: true } }), /pass requires/);
for (const body of ['Hello {{first_name}}', 'Hello {first_name}', 'Hello ${first_name}', '[INSERT COMPANY]', '<p>Hello</p>', 'I came across your company and wanted to pitch.']) {
  const d = nextDraft('broken', at, { body, claims: [{ text: body, signal_id: 'weekly-work' }] });
  const ledger = add(base(), d, review('broken'));
  assert.strictEqual(plan(ledger, at).ready.length, 0, body);
}
const notDue = add(base(), nextDraft('future-draft', at, { not_before: '2026-11-09T00:00:00Z' }), review('future-draft'));
assert(reasons(notDue).includes('not-due'));
const otherAccount = { ...clone(example[0]), id: 'other-account-event', at, account: { ...clone(example[0].account), id: 'other', domain: 'other.test' } };
const otherSignal = { ...clone(example[3]), id: 'other-signal-event', at, signal: { ...clone(example[3].signal), id: 'other-signal', account_id: 'other' } };
assert.throws(() => add(base(), otherAccount, otherSignal, nextDraft('wrong-account', at, { signal_ids: ['other-signal'], claims: [{ text: 'weekly reconciliation', signal_id: 'other-signal' }] })), /another account/);
const fakeReply = add(base(), nextDraft('fake-reply', at, { subject: 'Re: weekly reconciliation' }), review('fake-reply'));
assert(reasons(fakeReply).includes('unsubstantiated-reply-subject'));
const revised = add(base(), nextDraft('later-one'), review('later-one'), nextDraft('latest-one'), review('latest-one'));
assert.strictEqual(plan(revised, at).ready[0].draft_id, 'latest-one', 'newest revision wins even at equal timestamps');
const colleagues = add(base(), { id: 'colleague', type: 'contact', at, contact: { id: 'tariq', account_id: 'lantern', name: 'Tariq Example', role: 'Evaluator', email: 'tariq@lantern.test', source } },
  { ...clone(example[4]), id: 'colleague-check', at, contact_id: 'tariq', email: 'tariq@lantern.test' },
  { id: 'colleague-draft', type: 'draft', at, draft: { ...clone(example[5].draft), id: 'tariq-first', contact_id: 'tariq' } }, review('tariq-first'));
assert.strictEqual(plan(colleagues, at).ready.length, 1);
assert(plan(colleagues, at).decisions.some(x => x.reasons.includes('one-contact-per-account')));
for (const intent of ['interested', 'question', 'objection', 'referral', 'auto-reply', 'unknown', 'not-now', 'not-interested', 'opt-out']) {
  const paused = add(colleagues, reply(intent));
  assert.strictEqual(plan(paused, at).ready.length, 0, intent + ' must hold the whole account');
  assert.throws(() => plan(paused, '2026-11-07T12:00:00Z'), /cannot precede/);
}
const opted = add(base(), reply('opt-out'), nextDraft('after-optout'), review('after-optout'));
assert.strictEqual(plan(opted, at).ready.length, 0);
assert.strictEqual(csv(plan(opted, at)).split('\r\n').filter(Boolean).length, 1, 'opt-out excluded from export');
for (const scope of ['account', 'contact']) {
  const suppressed = add(base(), { id: 'hold-' + scope, type: 'suppression', at, scope, target_id: scope === 'account' ? 'lantern' : 'mina', reason: 'Existing relationship / do not contact' });
  assert(reasons(suppressed).includes('suppressed'));
}
assert(reasons(add(base(), activity('bounce', 'bounced'))).includes('bounced'));
let sent = add(base(), activity('first-send', 'sent', '2026-11-01T10:00:00Z', { draft_id: 'mina-first' }));
assert(reasons(sent).includes('draft-already-used'));
assert(reasons(sent).includes('followup-needs-new-draft-and-date'));
const followup = add(sent, nextDraft('followup', '2026-11-08T11:00:00Z'), review('followup', '2026-11-08T11:00:00Z'));
assert.strictEqual(plan(followup, at).ready.length, 1);
const limited = add(followup, activity('second-send', 'sent', at, { draft_id: 'followup' }));
assert(reasons(limited).includes('touch-limit'));
const cool = add(base(), activity('recent-send', 'sent', '2026-11-08T10:00:00Z'), nextDraft('recent-followup', '2026-11-08T11:00:00Z'), review('recent-followup', '2026-11-08T11:00:00Z'));
assert(reasons(cool).includes('account-cooldown'));
assert.strictEqual(report(base()).human_replies.rate, null);
let results = add(sent, reply('auto-reply'));
assert.strictEqual(report(results).human_replies.count, 0);
results = add(results, reply('question'));
assert.strictEqual(report(results).human_replies.count, 1);
assert.strictEqual(report(results).qualified.count, 0);
assert.strictEqual(report(results).delivered.count, 0, 'verification is not delivery');
results = add(results, activity('delivery', 'delivered'), activity('success', 'qualified'));
assert.deepStrictEqual(report(results).qualified, { count: 1, denominator: 1, rate: 1 });
assert.throws(() => add(results, { ...activity('dupe-reference', 'delivered'), reference: 'delivery-ref' }), /duplicate activity/);
const formula = plan(base(), at); formula.ready[0].name = ' =SUM(1,2)'; formula.ready[0].body = 'First line\n"quoted", second line';
const output = csv(formula);
assert(output.includes("\"' =SUM(1,2)\"")); assert(output.includes('"First line\n""quoted"", second line"'));
assert.throws(() => plan(base(), at, 0));
// Validate transactional writes, local privacy defaults, CLI rejection, and operation from another project.
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shadowfax-ledger-'));
const cli = path.resolve(__dirname, '../scripts/ledger.js');
function run(...args) { return spawnSync(process.execPath, [cli, ...args], { cwd: dir, encoding: 'utf8' }); }
try {
  assert.strictEqual(run('init').status, 0);
  const ledgerFile = path.join(dir, '.shadowfax/outreach/ledger.json');
  assert(fs.readFileSync(path.join(dir, '.shadowfax/outreach/.gitignore'), 'utf8').includes('*'));
  assert.strictEqual(run('init').status, 2, 'init does not overwrite');
  const eventsFile = path.join(dir, 'events.json'); fs.writeFileSync(eventsFile, JSON.stringify(example));
  assert.strictEqual(run('apply', '--input', eventsFile).status, 0);
  const before = fs.readFileSync(ledgerFile, 'utf8');
  fs.writeFileSync(eventsFile, JSON.stringify([activity('valid-before-invalid', 'sent'), { id: 'invalid', type: 'oops', at }]));
  assert.strictEqual(run('apply', '--input', eventsFile).status, 2);
  assert.strictEqual(fs.readFileSync(ledgerFile, 'utf8'), before, 'invalid batch never partially applies');
  fs.writeFileSync(ledgerFile + '.lock', '');
  fs.writeFileSync(eventsFile, JSON.stringify([activity('send-while-locked', 'sent')]));
  assert.strictEqual(run('apply', '--input', eventsFile).status, 2);
  fs.unlinkSync(ledgerFile + '.lock');
  const planned = run('plan', '--as-of', at); assert.strictEqual(planned.status, 0, planned.stderr);
  assert.strictEqual(JSON.parse(planned.stdout).ready.length, 1);
  assert.strictEqual(run('export', '--as-of', at).status, 0);
  assert.strictEqual(run('send').status, 2, 'no send command exists');
  assert.strictEqual(run('plan', '--unknown', 'value').status, 2);
  assert.strictEqual(run('report').status, 0);
} finally { fs.rmSync(dir, { recursive: true, force: true }); }
console.log('ok outreach ledger: atomic imports, evidence/review gates, idempotency, account holds, suppressions, follow-ups, reporting, CSV, and CLI');
