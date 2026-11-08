#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const TEMPLATE_STATE = path.join(__dirname, '..', 'assets', 'run-state.md');

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
    fs.writeFileSync(destEvidence, 'ts\tsource\tquote\turl\n');
    created.push(destEvidence);
  } else {
    kept.push(destEvidence);
  }

  console.log(JSON.stringify({ ok: true, created, kept }, null, 2));
}

main();
