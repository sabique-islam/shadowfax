#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { scan } = require('../scripts/generic-scan.js');

const bad = scan('I came across your company and I hope this email finds you well. Quick question!');
assert(bad.some((h) => h.id === 'generic.came-across'));
assert(bad.some((h) => h.id === 'generic.hope-finds'));

const good = scan('Saw issue #41 on the CSV import hanging at 50k rows. Want a 20-line repro against a public sample?');
assert.strictEqual(good.length, 0);

console.log('ok outreach-scan', { bad: bad.length, good: good.length });
