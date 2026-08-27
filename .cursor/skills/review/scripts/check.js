#!/usr/bin/env node
'use strict';

const fs = require('fs');

const BANNED = [
  /\bpowerful\b/i,
  /\bseamless\b/i,
  /\bbest-in-class\b/i,
  /\brevolutionary\b/i,
  /\bgame[- ]?changer\b/i,
  /\bcutting[- ]?edge\b/i,
  /\bsynergy\b/i,
  /\bleverage\b/i,
  /\bunlock\b/i,
  /\btransformative\b/i,
];

const HERO_PRODUCT = [
  /\bour (platform|product|tool|solution)\b/i,
  /\bthe platform\b/i,
];

function readInput(path) {
  if (path && path !== '-') return fs.readFileSync(path, 'utf8');
  return fs.readFileSync(0, 'utf8');
}

function main() {
  const file = process.argv[2];
  const text = readInput(file);
  const fails = [];

  for (const re of BANNED) {
    const m = text.match(re);
    if (m) fails.push('puffery: ' + m[0]);
  }
  for (const re of HERO_PRODUCT) {
    const m = text.match(re);
    if (m) fails.push('product-as-hero: ' + m[0]);
  }
  if (/\[assumption\]/i.test(text) && /\b(proven|validated|everyone knows|clearly)\b/i.test(text)) {
    fails.push('assumption smuggled as truth');
  }
  if (text.trim().length < 40) fails.push('too thin to review');

  if (fails.length) {
    console.error(JSON.stringify({ ok: false, fails }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ ok: true, fails: [] }));
}

main();
