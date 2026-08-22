#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'skills');
const DEST = path.join(ROOT, '.cursor', 'skills');

function main() {
  if (!fs.existsSync(path.join(SRC, 'shadowfax', 'SKILL.md'))) {
    console.error('missing skills/shadowfax/SKILL.md (canonical tree)');
    process.exit(1);
  }
  if (fs.lstatSync(SRC).isSymbolicLink()) {
    console.error('skills/ is a symlink. npx skills add needs a real skills/ folder.');
    process.exit(1);
  }

  fs.rmSync(DEST, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  fs.cpSync(SRC, DEST, { recursive: true, dereference: true });
  console.log('copied skills/ → .cursor/skills/');
}

main();
