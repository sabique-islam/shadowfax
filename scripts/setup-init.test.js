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

const second = spawnSync(process.execPath, [init], { cwd: dir, encoding: 'utf8' });
assert.strictEqual(second.status, 0, second.stderr);
const twice = JSON.parse(second.stdout);
assert.strictEqual(twice.created.length, 0);
assert.strictEqual(twice.kept.length, 2);

fs.rmSync(dir, { recursive: true, force: true });
console.log('ok setup-init');
