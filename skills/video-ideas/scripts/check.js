#!/usr/bin/env node
'use strict';

const fs = require('fs');

function check(text) {
  const errors = [];
  const raw = String(text || '');
  if (!/\bhook\b/i.test(raw)) errors.push('missing Hook');
  if (!/\b(shot|on camera|film)\b/i.test(raw)) errors.push('missing what to film');
  if (!/https?:\/\//i.test(raw) && !/\bevidence:/i.test(raw)) {
    errors.push('missing source URL or evidence: pointer');
  }
  if (/day in the life of a founder/i.test(raw) && !/https?:\/\//i.test(raw)) {
    errors.push('stock founder day with no source');
  }
  if (!/^\s*\d+[.)]/m.test(raw) && !/^## /m.test(raw)) {
    errors.push('no numbered or headed idea');
  }
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
  const errors = check(readInput(file));
  if (errors.length) {
    console.error(JSON.stringify({ ok: false, errors }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ ok: true }));
}

module.exports = { check };

if (require.main === module) main();
