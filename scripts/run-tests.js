#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const tests = [
  'skills/write/tests/lint.test.js',
  'skills/shadowfax/tests/pick.test.js',
  'skills/growth-hacks/tests/select.test.js',
  'scripts/growth-state.test.js',
  'skills/outreach/tests/scan.test.js',
  'skills/outreach-ops/tests/ledger.test.js',
  'skills/experimentation/tests/check.test.js',
  'skills/analytics/tests/funnel.test.js',
  'skills/content/tests/gate.test.js',
  'skills/content-audit/tests/opportunity.test.js',
  'skills/content-audit/tests/measure.test.js',
  'skills/aeo/tests/citations.test.js',
  'skills/trends/tests/fetch.test.js',
  'skills/video-ideas/tests/check.test.js',
  'skills/review/tests/check.test.js',
  'scripts/missing-binaries.test.js',
  'scripts/setup-init.test.js',
];

let failed = 0;
for (const rel of tests) {
  const r = spawnSync(process.execPath, [path.join(ROOT, rel)], { encoding: 'utf8', cwd: ROOT });
  process.stdout.write(r.stdout);
  process.stderr.write(r.stderr);
  if (r.status !== 0) {
    console.error('FAIL ' + rel);
    failed++;
  }
}

if (failed) process.exit(1);
console.log('all tests passed (' + tests.length + ')');
