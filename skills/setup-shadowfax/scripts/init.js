#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function pluginRootFrom(start) {
  let dir = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(dir, 'plugin.json')) && fs.existsSync(path.join(dir, 'AGENTS.md'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error('shadowfax plugin root not found from ' + start);
    dir = parent;
  }
}

const PLUGIN_ROOT = pluginRootFrom(__dirname);
const TEMPLATE_STATE = path.join(PLUGIN_ROOT, '.shadowfax', 'run-state.md');
const TEMPLATE_EVIDENCE = path.join(PLUGIN_ROOT, '.shadowfax', 'evidence.tsv');

function main() {
  const destDir = path.join(process.cwd(), '.shadowfax');
  fs.mkdirSync(destDir, { recursive: true });

  const destState = path.join(destDir, 'run-state.md');
  const destEvidence = path.join(destDir, 'evidence.tsv');
  const created = [];
  const kept = [];

  if (!fs.existsSync(destState)) {
    fs.copyFileSync(TEMPLATE_STATE, destState);
    created.push(destState);
  } else {
    kept.push(destState);
  }

  if (!fs.existsSync(destEvidence)) {
    const header = fs.existsSync(TEMPLATE_EVIDENCE)
      ? fs.readFileSync(TEMPLATE_EVIDENCE, 'utf8')
      : 'ts\tsource\tquote\turl\n';
    fs.writeFileSync(destEvidence, header);
    created.push(destEvidence);
  } else {
    kept.push(destEvidence);
  }

  console.log(JSON.stringify({ ok: true, created, kept }, null, 2));
}

main();
