#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const init = path.join(root, 'skills/setup-shadowfax/scripts/init.js');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shadowfax-setup-'));

const first = spawnSync(process.execPath, [init], { cwd: dir, encoding: 'utf8' });
assert.strictEqual(first.status, 0, first.stderr);
const once = JSON.parse(first.stdout);
assert.strictEqual(once.created.length, 2);

// Installation must use pristine assets, never the maintainer's working state/evidence.
assert.strictEqual(fs.readFileSync(path.join(dir, '.shadowfax/run-state.md'), 'utf8'),
  fs.readFileSync(path.join(root, 'skills/setup-shadowfax/assets/run-state.md'), 'utf8'));
assert.strictEqual(fs.readFileSync(path.join(dir, '.shadowfax/evidence.tsv'), 'utf8'), 'ts\tsource\tquote\turl\n');
const founderNote = '\nFounder-specific note: preserve this.\n';
fs.appendFileSync(path.join(dir, '.shadowfax/run-state.md'), founderNote);
fs.appendFileSync(path.join(dir, '.shadowfax/evidence.tsv'), 'existing evidence\n');
const second = spawnSync(process.execPath, [init], { cwd: dir, encoding: 'utf8' });
assert.strictEqual(second.status, 0, second.stderr);
const twice = JSON.parse(second.stdout);
assert.strictEqual(twice.created.length, 0);
assert.strictEqual(twice.kept.length, 2);
assert(fs.readFileSync(path.join(dir, '.shadowfax/run-state.md'), 'utf8').endsWith(founderNote));
assert(fs.readFileSync(path.join(dir, '.shadowfax/evidence.tsv'), 'utf8').endsWith('existing evidence\n'));

fs.rmSync(dir, { recursive: true, force: true });
console.log('ok setup-init');
