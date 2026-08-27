#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { parseSections, filled } = require('./run-state-lib.js');

const PLUGIN_ROOT = path.resolve(__dirname, '..');
const CWD_STATE = path.join(process.cwd(), '.shadowfax', 'run-state.md');
const PLUGIN_STATE = path.join(PLUGIN_ROOT, '.shadowfax', 'run-state.md');
const DEFAULT_STATE = fs.existsSync(CWD_STATE) ? CWD_STATE : PLUGIN_STATE;

const RULES = {
  shadowfax: {},
  write: {},
  youtube: {},
  onboarding: {},
  roadmap: { all: ['Product truth'] },
  'talk-to-users': { any: ['Product truth', 'Assumptions'] },
  review: {},
  pricing: { all: ['ICP hypothesis'] },
  homepage: { all: ['ICP hypothesis', 'Positioning bet'] },
  'value-prop': { all: ['Evidence', 'ICP hypothesis'] },
  activation: { any: ['Product truth', 'Last observation'] },
  'first-users': { all: ['ICP hypothesis'] },
  'growth-loops': { all: ['ICP hypothesis'] },
  'buyer-gap': { all: ['ICP hypothesis', 'Evidence'] },
  'beyond-wrapper': { all: ['Product truth', 'Evidence'] },
  'customer-support': { all: ['Product truth'] },
  inbound: { all: ['Product truth', 'Positioning bet'] },
  'market-research': {},
  icp: { all: ['Evidence'] },
  competitive: {},
  'find-communities': { any: ['ICP hypothesis', 'Evidence'] },
  'find-complaints': {},
  prospecting: { all: ['ICP hypothesis'] },
  github: {},
  positioning: { all: ['Evidence'] },
  distribution: { all: ['ICP hypothesis'] },
  experimentation: { all: ['Channel bet'] },
  outreach: { all: ['Reach list', 'Positioning bet'] },
  content: { all: ['Channel bet'] },
  'content-audit': { all: ['Channel bet'] },
  posts: { all: ['Channel bet'] },
  'video-ideas': { all: ['ICP hypothesis'] },
  trends: {},
  launches: { all: ['Channel bet'] },
  sales: { all: ['ICP hypothesis', 'Positioning bet'] },
  analytics: {},
  aeo: {},
  'campaign-review': {},
  iteration: { all: ['Last observation'] },
  'setup-shadowfax': {},
};

function usage() {
  console.error('usage: node scripts/run-state-check.js <skill> [run-state.md]');
  process.exit(2);
}

function main() {
  const skill = process.argv[2];
  const statePath = path.resolve(process.argv[3] || DEFAULT_STATE);
  if (!skill) usage();
  if (!RULES[skill]) {
    console.error(`unknown skill: ${skill}`);
    process.exit(2);
  }
  if (!fs.existsSync(statePath)) {
    console.error(`run-state missing: ${statePath}`);
    process.exit(1);
  }

  const sections = parseSections(fs.readFileSync(statePath, 'utf8'));
  const rule = RULES[skill];
  const missing = [];

  for (const name of rule.all || []) {
    if (!filled(sections[name])) missing.push(name);
  }
  if (rule.any && rule.any.length && !rule.any.some((name) => filled(sections[name]))) {
    missing.push(`one of: ${rule.any.join(', ')}`);
  }

  if (missing.length) {
    console.error(`run-state-check ${skill}: empty [${missing.join('; ')}]`);
    process.exit(1);
  }
  console.log(`run-state-check ${skill}: ok`);
}

main();
