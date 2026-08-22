#!/usr/bin/env node
'use strict';

const fs = require('fs');

function funnel(data) {
  const steps = Array.isArray(data.steps) ? data.steps : [];
  if (!steps.length) {
    return { ok: false, error: 'unknown', reason: 'no steps' };
  }
  const rows = steps.map((s, i) => {
    const count = s.count;
    if (count === null || count === undefined || count === '') {
      return { name: s.name || `step-${i}`, count: 'unknown', drop: 'unknown' };
    }
    const n = Number(count);
    if (Number.isNaN(n)) {
      return { name: s.name || `step-${i}`, count: 'unknown', drop: 'unknown' };
    }
    return { name: s.name || `step-${i}`, count: n, drop: null };
  });

  let steepest = null;
  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1].count;
    const cur = rows[i].count;
    if (prev === 'unknown' || cur === 'unknown') {
      rows[i].drop = 'unknown';
      continue;
    }
    const drop = prev === 0 ? 0 : (prev - cur) / prev;
    rows[i].drop = drop;
    if (steepest === null || drop > steepest.drop) {
      steepest = { from: rows[i - 1].name, to: rows[i].name, drop };
    }
  }

  return {
    ok: true,
    steps: rows,
    steepest: steepest
      ? { from: steepest.from, to: steepest.to, drop: Number(steepest.drop.toFixed(4)) }
      : { from: 'unknown', to: 'unknown', drop: 'unknown' },
  };
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
  const raw = readInput(file);
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(JSON.stringify({ ok: false, error: 'unknown', reason: 'invalid json' }));
    process.exit(1);
  }
  const result = funnel(data);
  if (!result.ok) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(result, null, 2));
}

module.exports = { funnel };

if (require.main === module) main();
