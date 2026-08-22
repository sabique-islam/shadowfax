#!/usr/bin/env node
'use strict';

const fs = require('fs');

const BANNED = [
  { id: 'generic.came-across', re: /i came across your (?:company|profile|website|work)/i },
  { id: 'generic.hope-finds', re: /i hope this (?:email )?finds you/i },
  { id: 'generic.touching-base', re: /just touching base/i },
  { id: 'generic.circling-back', re: /circling back/i },
  { id: 'generic.synergy', re: /\bsynerg(?:y|ies)\b/i },
  { id: 'generic.unlock-potential', re: /unlock (?:your )?(?:full )?potential/i },
  { id: 'generic.quick-question', re: /^quick question[!:.]/im },
];

function scan(text) {
  const hits = [];
  for (const rule of BANNED) {
    const m = text.match(rule.re);
    if (m) hits.push({ id: rule.id, match: m[0] });
  }
  return hits;
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
  const hits = scan(text);
  if (hits.length) {
    console.error(JSON.stringify({ ok: false, hits }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ ok: true, hits: [] }));
}

module.exports = { scan };

if (require.main === module) main();
