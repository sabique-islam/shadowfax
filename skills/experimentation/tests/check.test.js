#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { check } = require('../scripts/check.js');

const dead = check('Post and see what happens.');
assert(dead.includes('post-and-see is not an experiment'));
assert(dead.some((e) => e.startsWith('missing')));

const live = check(`Hypothesis: if we reply to 20 CSV-import issues, we will see 3 people try the gist because they already have the hang.
Sample: 20 issues
Signal: a clone or a question about the gist
Timebox: 14 days or 20 replies, whichever first
Kill: zero replies after 20 issues
`);
assert.strictEqual(live.length, 0);

console.log('ok experiment-check', { dead: dead.length });
