#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { lift, measure } = require('../scripts/measure.js');

assert.strictEqual(lift(100, 120), 0.2);
assert.strictEqual(lift(0, 12), 'no-before');
assert.strictEqual(lift('x', 1), 'unknown');

const edit = measure({
  kind: 'edit',
  windowDays: 28,
  post: { clicksBefore: 100, clicksAfter: 130 },
  site: { clicksBefore: 1000, clicksAfter: 1100 },
});
assert.strictEqual(edit.kind, 'edit');
assert.strictEqual(edit.postLift, 0.3);
assert.strictEqual(edit.siteLift, 0.1);
assert.strictEqual(edit.relative, 0.2);

const born = measure({
  kind: 'new',
  windowDays: 28,
  post: { clicksBefore: 0, clicksAfter: 40 },
  site: { clicksBefore: 1000, clicksAfter: 1100 },
});
assert.strictEqual(born.kind, 'growth-curve');
assert.strictEqual(born.postLift, 'no-before');
assert.strictEqual(born.relative, 'unknown');

console.log('ok measure', { relative: edit.relative });
