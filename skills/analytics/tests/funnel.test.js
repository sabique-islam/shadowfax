#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { funnel } = require('../scripts/funnel.js');

const empty = funnel({ steps: [] });
assert.strictEqual(empty.ok, false);

const drop = funnel({
  steps: [
    { name: 'signup', count: 40 },
    { name: 'activated', count: 8 },
    { name: 'retained', count: 6 },
  ],
});
assert.strictEqual(drop.ok, true);
assert.strictEqual(drop.steepest.from, 'signup');
assert.strictEqual(drop.steepest.to, 'activated');

const unknown = funnel({
  steps: [
    { name: 'signup', count: 10 },
    { name: 'activated' },
  ],
});
assert.strictEqual(unknown.steps[1].count, 'unknown');

console.log('ok funnel', drop.steepest);
