#!/usr/bin/env node
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const skills = ['growth-hacks', 'free-tools', 'referrals', 'partnerships', 'waitlist', 'brand-replies', 'lifecycle-email', 'outreach-ops', 'lead-magnets'];
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shadowfax-state-'));
const state = path.join(dir, 'run-state.md');
const required = ['Product truth', 'ICP hypothesis', 'Diagnosis', 'Channel bet'];
function run(skill) { return spawnSync(process.execPath, [path.join(root, 'scripts/run-state-check.js'), skill, state], { encoding: 'utf8' }); }
function write(excluded) {
  fs.writeFileSync(state, required.filter(n => n !== excluded).map(n => '## ' + n + '\nSpecific founder evidence here.\n').join('\n'));
}
try {
  for (const skill of skills) {
    write(); assert.strictEqual(run(skill).status, 0, skill);
    for (const section of ['Product truth', 'Diagnosis']) {
      write(section); assert.strictEqual(run(skill).status, 1, skill + ' must require ' + section);
    }
    if (skill !== 'lifecycle-email') {
      write('Channel bet'); assert.strictEqual(run(skill).status, 1, skill + ' must require channel');
    }
    if (!['brand-replies', 'lifecycle-email'].includes(skill)) {
      write('ICP hypothesis'); assert.strictEqual(run(skill).status, 1, skill + ' must require ICP');
    }
    assert(fs.existsSync(path.join(root, 'skills', skill, 'SKILL.md')));
  }
  write('Channel bet'); assert.strictEqual(run('lifecycle-email').status, 0);
  write(); assert.strictEqual(run('reply-triage').status, 0);
  write('Product truth'); assert.strictEqual(run('reply-triage').status, 1);
  write(); assert.strictEqual(run('social-listening').status, 0);
  write('Product truth'); assert.strictEqual(run('social-listening').status, 1);
  write('ICP hypothesis'); assert.strictEqual(run('social-listening').status, 1);
  write('Diagnosis'); assert.strictEqual(run('social-listening').status, 0);
  write('Channel bet'); assert.strictEqual(run('social-listening').status, 0);
} finally { fs.rmSync(dir, { recursive: true, force: true }); }
console.log('ok growth skill state prerequisites and standalone CLI failures');
