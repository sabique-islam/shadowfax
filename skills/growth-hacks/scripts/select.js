#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const library = require('../references/tactics.json');
const STAGES = ['prelaunch', 'early', 'retained'];
const CHANNELS = ['email', 'community', 'social', 'search', 'partners', 'product', 'launch'];

function validateContext(context) {
  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    throw new Error('context must be a JSON object');
  }
  const allowed = new Set(['stage', 'channel', 'hours', 'cash', 'days']);
  for (const key of Object.keys(context)) {
    if (!allowed.has(key)) throw new Error('unknown context field: ' + key);
  }
  if (!STAGES.includes(context.stage)) throw new Error('stage must be ' + STAGES.join(', '));
  if (!CHANNELS.includes(context.channel)) throw new Error('channel must be ' + CHANNELS.join(', '));
  for (const key of ['hours', 'cash', 'days']) {
    const value = context[key];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      throw new Error(key + ' must be a finite nonnegative number');
    }
  }
  if (context.days === 0) throw new Error('days must be greater than zero');
}

function select(context) {
  validateContext(context);
  const feasible = library.tactics.filter((card) =>
    card.channel === context.channel && card.stages.includes(context.stage) &&
    card.planning.hours <= context.hours && card.planning.cash <= context.cash &&
    card.planning.days <= context.days
  );
  return {
    context,
    notice: 'Feasibility filter only. Planning allowances are not benchmarks; verify every prerequisite. Order is not a ranking.',
    candidates: feasible,
    next: feasible.length ? 'Compare evidence fit and choose one manual pilot.' :
      'No feasible card. Research another mechanism or explicitly revise constraints; do not invent a match.',
  };
}

function main(argv) {
  if (argv.length !== 2 || argv[0] !== '--context') {
    throw new Error('usage: node skills/growth-hacks/scripts/select.js --context brief.json');
  }
  const context = JSON.parse(fs.readFileSync(path.resolve(argv[1]), 'utf8'));
  console.log(JSON.stringify(select(context), null, 2));
}

module.exports = { select, validateContext, STAGES, CHANNELS };
if (require.main === module) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 2; }
}
