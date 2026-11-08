#!/usr/bin/env node
'use strict';

// Original Shadowfax local evidence ledger. No network, mailbox, or send capability.
const fs = require('fs');
const path = require('path');
const { scan: genericScan } = require('../../outreach/scripts/generic-scan.js');
const DEFAULT_POLICY = { max_touches: 2, min_gap_days: 7, max_words: 180, max_links: 1 };
const INTENTS = ['interested', 'question', 'objection', 'referral', 'not-now', 'not-interested', 'opt-out', 'auto-reply', 'unknown'];
const ACTIVITIES = ['sent', 'delivered', 'qualified', 'activated', 'won', 'lost', 'bounced'];
const SIGNALS = ['explicit-pain', 'evaluation', 'change', 'observed-gap', 'background'];
const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
function need(ok, message) { if (!ok) throw new Error(message); }
function str(value, label) { need(typeof value === 'string' && value.trim().length > 0, label + ' is required'); return value.trim(); }
function id(value, label) { need(typeof value === 'string' && /^[a-z][a-z0-9-]{0,79}$/.test(value), label + ' must be a lowercase stable ID'); return value; }
function stamp(value, label) {
  need(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value), label + ' must be a UTC ISO timestamp');
  const ms = Date.parse(value);
  need(Number.isFinite(ms) && new Date(ms).toISOString().replace('.000Z', 'Z') === value.replace('.000Z', 'Z'), label + ' is not a valid date');
  return ms;
}
function url(value, label) {
  str(value, label); let parsed;
  try { parsed = new URL(value); } catch (_) { throw new Error(label + ' must be an HTTP(S) source URL'); }
  need(['http:', 'https:'].includes(parsed.protocol) && !parsed.username && !parsed.password, label + ' must be an HTTP(S) source URL without credentials');
  return value;
}
function domain(value) {
  const raw = str(value, 'domain').toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
  need(/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(raw), 'domain must be a bare ASCII/IDNA domain');
  return raw;
}
function email(value) {
  const raw = str(value, 'email').toLowerCase();
  need(/^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(raw), 'invalid email syntax');
  domain(raw.split('@')[1]); return raw;
}
function policy(value = DEFAULT_POLICY) {
  need(value && typeof value === 'object' && !Array.isArray(value), 'policy must be an object');
  for (const key of Object.keys(value)) need(Object.hasOwn(DEFAULT_POLICY, key), 'unknown policy field: ' + key);
  const result = { ...DEFAULT_POLICY, ...value };
  for (const key of Object.keys(result)) need(Number.isFinite(result[key]) && Number.isInteger(result[key]) && result[key] >= (key === 'max_links' || key === 'min_gap_days' ? 0 : 1), 'invalid policy ' + key);
  return result;
}
function source(value, at) {
  need(value && typeof value === 'object', 'source is required'); url(value.url, 'source.url');
  need(stamp(value.observed_at, 'source.observed_at') <= at, 'source observation cannot follow the recorded event');
}
function entity(map, key, label) { need(map.has(key), 'unknown ' + label + ': ' + key); return map.get(key); }
function replay(ledger) {
  need(ledger && ledger.version === 1 && Array.isArray(ledger.events), 'unsupported or malformed ledger');
  const s = { accounts: new Map(), contacts: new Map(), signals: new Map(), drafts: new Map(), reviews: new Map(), verifications: new Map(), activities: [], replies: [], suppressions: [], ids: new Map(), references: new Set(), latest: 0 };
  policy(ledger.policy);
  let previous = 0;
  for (const e of ledger.events) {
    need(e && typeof e === 'object' && !Array.isArray(e), 'event must be an object'); id(e.id, 'event.id');
    need(!s.ids.has(e.id), 'duplicate event ID in stored ledger: ' + e.id);
    const at = stamp(e.at, 'event.at'); need(at >= previous, 'events must be in nondecreasing recorded-time order'); previous = at;
    s.ids.set(e.id, canonical(e)); s.latest = at;
    switch (e.type) {
      case 'account': {
        const a = e.account; need(a && typeof a === 'object', 'account is required'); id(a.id, 'account.id'); str(a.name, 'account.name');
        const host = domain(a.domain); source(a.source, at);
        need(!s.accounts.has(a.id), 'account ID already exists');
        need(![...s.accounts.values()].some(v => v.domain === host), 'duplicate account domain; reuse its existing account ID');
        s.accounts.set(a.id, { ...a, domain: host, fit: 'unknown' }); break;
      }
      case 'qualification': {
        entity(s.accounts, e.account_id, 'account'); need(['yes', 'no', 'unknown'].includes(e.fit), 'fit must be yes, no, or unknown');
        str(e.reason, 'qualification.reason'); source(e.source, at);
        s.accounts.set(e.account_id, { ...s.accounts.get(e.account_id), fit: e.fit, fit_reason: e.reason }); break;
      }
      case 'contact': {
        const c = e.contact; need(c && typeof c === 'object', 'contact is required'); id(c.id, 'contact.id'); entity(s.accounts, c.account_id, 'account');
        str(c.name, 'contact.name'); str(c.role, 'contact.role'); source(c.source, at); need(!s.contacts.has(c.id), 'contact ID already exists');
        const address = c.email ? email(c.email) : null;
        need(!address || ![...s.contacts.values()].some(v => v.email === address), 'duplicate contact email; reuse its existing contact ID');
        s.contacts.set(c.id, { ...c, email: address }); break;
      }
      case 'signal': {
        const g = e.signal; need(g && typeof g === 'object', 'signal is required'); id(g.id, 'signal.id'); entity(s.accounts, g.account_id, 'account');
        need(!s.signals.has(g.id), 'signal ID already exists'); need(SIGNALS.includes(g.kind), 'invalid signal kind'); str(g.observation, 'signal.observation');
        str(g.interpretation, 'signal.interpretation'); source(g.source, at);
        need(stamp(g.expires_at, 'signal.expires_at') > stamp(g.source.observed_at, 'source.observed_at'), 'signal expiry must follow observation');
        s.signals.set(g.id, g); break;
      }
      case 'verification': {
        const c = entity(s.contacts, e.contact_id, 'contact'); need(c.email && email(e.email) === c.email, 'verification must name the contact\'s exact address');
        need(['deliverable', 'risky', 'unknown', 'invalid'].includes(e.status), 'invalid verification status');
        need(['provider', 'recipient-confirmed', 'public-listing', 'syntax', 'dns'].includes(e.method), 'invalid verification method');
        need(e.status !== 'deliverable' || ['provider', 'recipient-confirmed'].includes(e.method), 'listing, syntax, or DNS evidence does not prove deliverability');
        str(e.reference, 'verification.reference'); const checked = stamp(e.checked_at, 'verification.checked_at');
        need(checked <= at && stamp(e.expires_at, 'verification.expires_at') > checked, 'invalid verification time window');
        const old = s.verifications.get(c.id); need(!old || checked >= stamp(old.checked_at, 'checked_at'), 'cannot replace verification with an older check');
        s.verifications.set(c.id, e); break;
      }
      case 'draft': {
        const d = e.draft; need(d && typeof d === 'object', 'draft is required'); id(d.id, 'draft.id'); const c = entity(s.contacts, d.contact_id, 'contact');
        need(!s.drafts.has(d.id), 'drafts are immutable; use a new draft ID for a revision'); str(d.subject, 'draft.subject'); str(d.body, 'draft.body');
        need(Array.isArray(d.signal_ids) && d.signal_ids.length > 0, 'draft.signal_ids must name evidence');
        for (const key of d.signal_ids) need(entity(s.signals, key, 'signal').account_id === c.account_id, 'draft signal belongs to another account');
        need(Array.isArray(d.claims) && d.claims.length > 0, 'draft.claims must map factual text to evidence');
        for (const claim of d.claims) {
          str(claim.text, 'claim.text'); need((d.subject + '\n' + d.body).includes(claim.text), 'claim.text must occur in the draft');
          if (claim.signal_id) need(d.signal_ids.includes(claim.signal_id), 'claim.signal_id must be one of the draft signals');
          else url(claim.source_url, 'claim.source_url');
        }
        if (d.not_before) stamp(d.not_before, 'draft.not_before'); s.drafts.set(d.id, { ...d, recorded_at: e.at }); break;
      }
      case 'review': {
        entity(s.drafts, e.draft_id, 'draft'); need(['pass', 'revise'].includes(e.verdict), 'review verdict must be pass or revise'); str(e.note, 'review.note');
        need(e.verdict !== 'pass' || e.checks && ['facts', 'voice', 'offer'].every(k => e.checks[k] === true), 'pass requires factual, voice, and offer review');
        s.reviews.set(e.draft_id, e); break;
      }
      case 'activity': {
        const c = entity(s.contacts, e.contact_id, 'contact'); need(ACTIVITIES.includes(e.kind), 'invalid activity kind'); str(e.reference, 'activity.reference');
        if (e.draft_id) need(entity(s.drafts, e.draft_id, 'draft').contact_id === c.id, 'activity draft/contact mismatch');
        const key = e.kind + ':' + e.reference; need(!s.references.has(key), 'duplicate activity reference'); s.references.add(key); s.activities.push(e); break;
      }
      case 'reply': {
        entity(s.contacts, e.contact_id, 'contact'); need(INTENTS.includes(e.intent), 'invalid reply intent'); str(e.reference, 'reply.reference'); str(e.excerpt, 'reply.excerpt');
        const key = 'reply:' + e.reference; need(!s.references.has(key), 'duplicate reply reference'); s.references.add(key); s.replies.push(e); break;
      }
      case 'suppression': {
        need(['account', 'contact'].includes(e.scope), 'suppression scope must be account or contact'); entity(e.scope === 'account' ? s.accounts : s.contacts, e.target_id, e.scope);
        str(e.reason, 'suppression.reason'); s.suppressions.push(e); break;
      }
      default: throw new Error('unknown event type: ' + e.type);
    }
  }
  return s;
}
function append(ledger, events) {
  need(Array.isArray(events), 'input must be an array of events'); const s = replay(ledger); const added = []; const ids = new Map(s.ids);
  for (const e of events) {
    const text = canonical(e); if (e && ids.has(e.id)) { need(ids.get(e.id) === text, 'event ID reused with different content: ' + e.id); continue; }
    if (e) ids.set(e.id, text); added.push(e);
  }
  const next = JSON.parse(JSON.stringify({ ...ledger, events: [...ledger.events, ...added] })); replay(next);
  return { ledger: next, added: added.length };
}
function draftIssues(d, s, p) {
  const issues = []; const text = d.subject + '\n' + d.body;
  issues.push(...genericScan(text).map(hit => 'copy:' + hit.id));
  if (/\{\{[^}]*\}\}|\$\{[^}]*\}|\{\s*[A-Za-z_][\w.-]*\s*\}|\[(?:TODO|INSERT|NAME|COMPANY|LINK|PRODUCT|PRICE)[^\]]*\]/i.test(text)) issues.push('unresolved-placeholder');
  if (/\r|\n/.test(d.subject)) issues.push('multiline-subject');
  if (/<\/?[a-z][^>]*>/i.test(d.body)) issues.push('html-body');
  if (d.body.trim().split(/\s+/).length > p.max_words) issues.push('word-limit');
  if ((text.match(/https?:\/\//gi) || []).length > p.max_links) issues.push('link-limit');
  if (/^(?:re|fw|fwd)\s*:/i.test(d.subject)) {
    const prior = s.activities.some(a => a.contact_id === d.contact_id && a.kind === 'sent' && stamp(a.at, 'at') <= stamp(d.recorded_at, 'recorded_at'));
    if (!prior) issues.push('unsubstantiated-reply-subject');
  }
  return issues;
}
function plan(ledger, asOf = new Date().toISOString(), limit = 10) {
  const s = replay(ledger); const now = stamp(asOf, 'as_of'); need(now >= s.latest, 'as_of cannot precede recorded events or ignore a later suppression/reply');
  need(Number.isInteger(limit) && limit > 0, 'limit must be a positive integer'); const p = policy(ledger.policy);
  const decisions = [], candidates = [];
  const ordered = [...s.drafts.values()].reverse().sort((a, b) => stamp(b.recorded_at, 'recorded_at') - stamp(a.recorded_at, 'recorded_at'));
  const latestDrafts = new Map(); for (const d of ordered) if (!latestDrafts.has(d.contact_id)) latestDrafts.set(d.contact_id, d);
  for (const c of s.contacts.values()) {
    const a = s.accounts.get(c.account_id), d = latestDrafts.get(c.id), v = s.verifications.get(c.id), reasons = [];
    if (a.fit !== 'yes') reasons.push('account-fit-' + a.fit);
    if (s.suppressions.some(x => x.scope === 'account' && x.target_id === a.id || x.scope === 'contact' && x.target_id === c.id)) reasons.push('suppressed');
    if (s.replies.some(x => x.contact_id === c.id && ['opt-out', 'not-interested'].includes(x.intent))) reasons.push('declined-or-opted-out');
    const accountContact = key => s.contacts.get(key).account_id === a.id;
    if (s.replies.some(x => accountContact(x.contact_id))) reasons.push('account-reply-needs-human');
    if (s.activities.some(x => x.contact_id === c.id && x.kind === 'bounced')) reasons.push('bounced');
    if (s.activities.some(x => accountContact(x.contact_id) && ['qualified', 'activated', 'won', 'lost'].includes(x.kind))) reasons.push('account-has-outcome');
    if (!c.email) reasons.push('no-email');
    if (!v || v.status !== 'deliverable') reasons.push('no-deliverable-evidence');
    else if (stamp(v.expires_at, 'expires_at') <= now) reasons.push('verification-expired');
    if (!d) reasons.push('needs-draft');
    else {
      reasons.push(...draftIssues(d, s, p));
      if (!s.reviews.has(d.id) || s.reviews.get(d.id).verdict !== 'pass') reasons.push('needs-review');
      if (d.signal_ids.some(key => stamp(s.signals.get(key).expires_at, 'expires_at') <= now)) reasons.push('signal-expired');
      if (d.signal_ids.every(key => s.signals.get(key).kind === 'background')) reasons.push('background-is-not-buying-evidence');
      if (d.not_before && stamp(d.not_before, 'not_before') > now) reasons.push('not-due');
    }
    const sends = s.activities.filter(x => x.kind === 'sent' && accountContact(x.contact_id));
    if (sends.some(x => x.contact_id !== c.id)) reasons.push('another-contact-already-approached');
    if (sends.length >= p.max_touches) reasons.push('touch-limit');
    if (sends.length) {
      const last = sends[sends.length - 1];
      if (now - stamp(last.at, 'at') < p.min_gap_days * 86400000) reasons.push('account-cooldown');
      if (d && (!d.not_before || stamp(d.recorded_at, 'recorded_at') <= stamp(last.at, 'at'))) reasons.push('followup-needs-new-draft-and-date');
      if (d && sends.some(x => x.draft_id === d.id)) reasons.push('draft-already-used');
    }
    const decision = { contact_id: c.id, account_id: a.id, reasons: [...new Set(reasons)] };
    decisions.push(decision);
    if (!reasons.length) candidates.push({ ...decision, email: c.email, name: c.name, company: a.name, subject: d.subject, body: d.body, draft_id: d.id, signal_ids: d.signal_ids, source_urls: d.signal_ids.map(key => s.signals.get(key).source.url) });
  }
  const chosen = [], accounts = new Set();
  for (const candidate of candidates) {
    const reason = accounts.has(candidate.account_id) ? 'one-contact-per-account' : chosen.length >= limit ? 'batch-limit' : null;
    if (reason) decisions.find(x => x.contact_id === candidate.contact_id).reasons.push(reason);
    else { accounts.add(candidate.account_id); chosen.push(candidate); }
  }
  return { as_of: asOf, policy: p, notice: 'Local review handoff only. Evidence is imported, not independently verified. Recheck current facts, suppression, and sending requirements before any human action.', ready: chosen, decisions };
}
function report(ledger) {
  const s = replay(ledger), sent = new Set(s.activities.filter(e => e.kind === 'sent').map(e => e.contact_id));
  const count = list => new Set(list.filter(e => sent.has(e.contact_id)).map(e => e.contact_id)).size;
  const metric = n => ({ count: n, denominator: sent.size, rate: sent.size ? n / sent.size : null });
  return { accounts: s.accounts.size, contacts: s.contacts.size, sent_contacts: sent.size,
    delivered: metric(count(s.activities.filter(e => e.kind === 'delivered'))), human_replies: metric(count(s.replies.filter(e => e.intent !== 'auto-reply'))),
    qualified: metric(count(s.activities.filter(e => e.kind === 'qualified'))), activated: metric(count(s.activities.filter(e => e.kind === 'activated'))),
    won: metric(count(s.activities.filter(e => e.kind === 'won'))), bounced: metric(count(s.activities.filter(e => e.kind === 'bounced'))),
    notice: 'Counts reflect recorded human-reported activity. Missing delivery or outcomes are unknown, not failures. Rates use unique contacted people; they do not establish causal lift.' };
}
function csv(value) {
  const cells = ['contact_id', 'account_id', 'email', 'name', 'company', 'subject', 'body', 'draft_id', 'source_urls'];
  const cell = v => { let text = String(v ?? ''); if (/^[=+\-@]/.test(text.trimStart())) text = "'" + text; return '"' + text.replace(/"/g, '""') + '"'; };
  return cells.map(cell).join(',') + '\r\n' + value.ready.map(row => cells.map(k => cell(Array.isArray(row[k]) ? row[k].join(' | ') : row[k])).join(',')).map(row => row + '\r\n').join('');
}
function load(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeAtomic(file, value) {
  const tmp = file + '.tmp-' + process.pid;
  let fd, owned = false;
  try {
    fd = fs.openSync(tmp, 'wx', 0o600); owned = true;
    fs.writeFileSync(fd, JSON.stringify(value, null, 2) + '\n');
    fs.closeSync(fd); fd = undefined;
    fs.renameSync(tmp, file);
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
    if (owned && fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
}
function mutate(file, action) {
  fs.mkdirSync(path.dirname(file), { recursive: true }); const lock = file + '.lock'; let fd;
  try { fd = fs.openSync(lock, 'wx', 0o600); } catch (error) { if (error.code === 'EEXIST') throw new Error('ledger is locked; finish the other operation before retrying'); throw error; }
  try { return action(); } finally { fs.closeSync(fd); fs.unlinkSync(lock); }
}
function main(args) {
  const command = args.shift(), options = {};
  const allowed = { init: ['file', 'policy'], apply: ['file', 'input'], plan: ['file', 'as-of', 'limit'], export: ['file', 'as-of', 'limit'], report: ['file'] };
  need(Object.hasOwn(allowed, command), 'usage: ledger.js init|apply|plan|export|report [--file ledger.json] [--input events.json] [--policy policy.json] [--as-of ISO] [--limit N]');
  while (args.length) { const key = args.shift(); need(/^--/.test(key) && allowed[command].includes(key.slice(2)) && !Object.hasOwn(options, key.slice(2)), 'unknown or duplicate option: ' + key); const value = args.shift(); need(value && !value.startsWith('--'), 'missing value for ' + key); options[key.slice(2)] = value; }
  const file = path.resolve(options.file || '.shadowfax/outreach/ledger.json');
  if (command === 'init') {
    mutate(file, () => { need(!fs.existsSync(file), 'ledger already exists; existing history was preserved'); const p = policy(options.policy ? load(options.policy) : DEFAULT_POLICY); writeAtomic(file, { version: 1, policy: p, events: [] }); });
    if (path.dirname(file) === path.resolve('.shadowfax/outreach')) {
      const ignore = path.join(path.dirname(file), '.gitignore'); if (!fs.existsSync(ignore)) fs.writeFileSync(ignore, '*\n!.gitignore\n', { flag: 'wx' });
    }
    console.log(JSON.stringify({ initialized: file })); return;
  }
  if (command === 'apply') {
    need(options.input, 'apply requires --input events.json'); const events = load(path.resolve(options.input));
    const result = mutate(file, () => { const result = append(load(file), events); if (result.added) writeAtomic(file, result.ledger); return result; });
    console.log(JSON.stringify({ added: result.added, total: result.ledger.events.length })); return;
  }
  const ledger = load(file); if (command === 'report') { console.log(JSON.stringify(report(ledger), null, 2)); return; }
  const result = plan(ledger, options['as-of'] || new Date().toISOString(), options.limit ? Number(options.limit) : 10);
  if (command === 'export') process.stdout.write(csv(result)); else console.log(JSON.stringify(result, null, 2));
}
module.exports = { append, replay, plan, report, csv, policy, DEFAULT_POLICY };
if (require.main === module) { try { main(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exitCode = 2; } }
