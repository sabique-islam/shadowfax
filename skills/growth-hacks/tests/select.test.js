#!/usr/bin/env node
'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { select, STAGES, CHANNELS } = require('../scripts/select.js');
const { tactics } = require('../references/tactics.json');
const base = { stage: 'early', channel: 'community', hours: 5, cash: 0, days: 7 };

const chosen = select(base).candidates;
assert(chosen.length > 0);
assert(chosen.some(c => c.id === 'answer-with-a-working-artifact'));
assert(chosen.every(c => c.channel === 'community' && c.planning.cash === 0));
assert(!chosen.some(c => c.id === 'permissioned-community-challenge'));
assert.deepStrictEqual(select({ ...base, hours: 0 }).candidates, []);
assert.deepStrictEqual(select({ ...base, days: 1 }).candidates, []);
assert.deepStrictEqual(select({ ...base, stage: 'prelaunch', channel: 'product', hours: 100, cash: 1000 }).candidates, []);
assert(select({ stage: 'prelaunch', channel: 'launch', hours: 5, cash: 25, days: 7 }).candidates.some(c => c.id === 'capacity-backed-waitlist'));
assert(!select({ ...base, channel: 'product', hours: 100, cash: 1000, days: 30 }).candidates.length);
assert(select({ ...base, stage: 'retained', channel: 'product', hours: 100, cash: 1000, days: 30 }).candidates.length > 0);
for (const bad of [null, [], {}, { ...base, cash: -1 }, { ...base, cash: '0' }, { ...base, hours: Infinity },
  { ...base, days: 0 }, { ...base, channel: 'everywhere' }, { ...base, stage: 'viral' }, { ...base, score: 99 }]) {
  assert.throws(() => select(bad));
}
// Every card is reachable within its stated constraints, and cannot leak across channel/stage/budget limits.
assert.strictEqual(new Set(tactics.map(c => c.id)).size, tactics.length);
for (const card of tactics) {
  assert(CHANNELS.includes(card.channel));
  assert(card.stages.length && card.stages.every(s => STAGES.includes(s)));
  assert(card.requires.length && card.artifact && card.manual_test && card.signal && card.stop && card.failure);
  for (const stage of card.stages) {
    const ctx = { stage, channel: card.channel, ...card.planning };
    assert(select(ctx).candidates.some(c => c.id === card.id), card.id);
    assert(!select({ ...ctx, hours: card.planning.hours - 0.01 }).candidates.some(c => c.id === card.id));
  }
}
// Exercise the installed CLI from another working project; it must resolve its own data, not cwd.
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shadowfax-tactics-'));
try {
  const file = path.join(dir, 'brief.json');
  fs.writeFileSync(file, JSON.stringify(base));
  const cli = path.resolve(__dirname, '../scripts/select.js');
  const run = spawnSync(process.execPath, [cli, '--context', file], { cwd: dir, encoding: 'utf8' });
  assert.strictEqual(run.status, 0, run.stderr);
  assert(JSON.parse(run.stdout).candidates.length > 0);
  const invalid = spawnSync(process.execPath, [cli, '--unknown', file], { encoding: 'utf8' });
  assert.strictEqual(invalid.status, 2);
  fs.writeFileSync(file, '{');
  assert.strictEqual(spawnSync(process.execPath, [cli, '--context', file]).status, 2);
} finally { fs.rmSync(dir, { recursive: true, force: true }); }
console.log('ok tactic feasibility, retention boundaries, invalid inputs, and CLI (' + tactics.length + ' cards)');
