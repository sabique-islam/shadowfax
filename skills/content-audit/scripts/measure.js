#!/usr/bin/env node
'use strict';

const fs = require('fs');

function lift(before, after) {
  const b = Number(before);
  const a = Number(after);
  if (!Number.isFinite(b) || !Number.isFinite(a)) return 'unknown';
  if (b === 0) return a === 0 ? 0 : 'no-before';
  return Number(((a - b) / b).toFixed(4));
}

function measure(data) {
  const post = data.post || {};
  const site = data.site || {};
  const kind = data.kind === 'new' ? 'new' : 'edit';
  const windowDays = Number(data.windowDays);
  const postLift = lift(post.clicksBefore, post.clicksAfter);
  const siteLift = lift(site.clicksBefore, site.clicksAfter);
  let relative = 'unknown';
  if (typeof postLift === 'number' && typeof siteLift === 'number') {
    relative = Number((postLift - siteLift).toFixed(4));
  }
  const growth = kind === 'new' || postLift === 'no-before';
  return {
    ok: true,
    kind: growth ? 'growth-curve' : kind,
    windowDays: Number.isFinite(windowDays) ? windowDays : 'unknown',
    postLift,
    siteLift,
    relative,
    caveat:
      'site-wide numbers for the same dates are a control, not a holdout. bounce-back can look like a win. leave some flagged posts unedited when the queue is long.',
  };
}

function readInput(file) {
  if (file) {
    if (!fs.existsSync(file)) {
      console.error('file not found: ' + file);
      process.exit(2);
    }
    return fs.readFileSync(file, 'utf8');
  }
  return fs.readFileSync(0, 'utf8');
}

function main() {
  const file = process.argv[2];
  const raw = readInput(file);
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(JSON.stringify({ ok: false, error: 'invalid json' }));
    process.exit(1);
  }
  const result = measure(data);
  console.log(JSON.stringify(result, null, 2));
}

module.exports = { lift, measure };

if (require.main === module) main();
