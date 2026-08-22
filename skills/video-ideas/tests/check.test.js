#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { check } = require('../scripts/check.js');

const stock = check('1. Day in the life of a founder. Just vibe.');
assert(stock.length > 0);

const ok = check(`1. Hook: the import bar stuck at 47%.
Shot: screen recording of the hang, then the streaming parse finishing.
Source: https://github.com/foo/bar/issues/12
evidence: issue #12
`);
assert.strictEqual(ok.length, 0, ok.join('; '));

console.log('ok video-ideas-check', { stock: stock.length });
