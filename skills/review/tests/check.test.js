#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const check = path.join(__dirname, '..', 'scripts', 'check.js');
const tmp = path.join(__dirname, 'tmp-review-pass.md');
const bad = path.join(__dirname, 'tmp-review-fail.md');

fs.writeFileSync(
  tmp,
  'When deploys fail on Friday, teams want a rollback in minutes so they can ship again Monday. Named user at Acme cut recovery from 2 hours to 12 minutes.'
);
fs.writeFileSync(bad, 'Our powerful seamless platform unlocks transformative synergy for modern teams.');

try {
  execFileSync('node', [check, tmp], { stdio: 'pipe' });
  let failed = false;
  try {
    execFileSync('node', [check, bad], { stdio: 'pipe' });
  } catch (e) {
    failed = true;
  }
  assert.ok(failed, 'bad draft should fail');
  console.log('ok review check');
} finally {
  fs.unlinkSync(tmp);
  fs.unlinkSync(bad);
}
