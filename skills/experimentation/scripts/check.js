#!/usr/bin/env node
'use strict';

const fs = require('fs');

const KEYS = ['hypothesis', 'sample', 'signal', 'timebox', 'kill'];

function check(text) {
  const lower = text.toLowerCase();
  const missing = KEYS.filter((k) => !lower.includes(k));
  const errors = missing.map((k) => `missing ${k}`);
  if (/post and see/.test(lower)) errors.push('post-and-see is not an experiment');
  if (!/\b\d+\b/.test(text)) errors.push('sample needs a number');
  return errors;
}

function readInput(file) {
  if (file) {
    if (!fs.existsSync(file)) {
      console.error('file not found: ' + file);
      process.exit(2);
    }
    return fs.readFileSync(file, 'utf8');
  }
  return fs.readFileSync(0, 'utf8');
}

function main() {
  const file = process.argv[2];
  const text = readInput(file);
  const errors = check(text);
  if (errors.length) {
    console.error(JSON.stringify({ ok: false, errors }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ ok: true }));
}

module.exports = { check };

if (require.main === module) main();
