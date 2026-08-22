#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { analyze, loadRules } = require('../scripts/lint.js');

const rules = loadRules();

const ai = `In today's rapidly evolving landscape, it's worth noting that this serves as a testament to our seamless, groundbreaking approach. Let's dive in. It's not just a tool, it's a journey. Great question! I hope this helps. The future looks bright.`;

const human = `The compiler is robust enough for our test suite. We ship on Fridays. If the build fails, we roll back.`;

const aiResult = analyze(ai, rules);
const humanResult = analyze(human, rules);

assert(aiResult.score >= 50, `AI sample should score high, got ${aiResult.score}`);
assert(aiResult.findings.length >= 4, `AI sample should flag clusters, got ${aiResult.findings.length}`);
assert(humanResult.score < 25, `human sample with one robust should score low, got ${humanResult.score}`);
assert(humanResult.findings.length === 0, 'isolated robust should drop under cluster rule');

const filler = `In order to ship this, it is important to note that the team is blocked. Here's what you need to know.`;
const fillerResult = analyze(filler, rules);
assert(fillerResult.findings.length >= 2, `filler sample should flag phrases, got ${fillerResult.findings.length}`);

console.log('ok', { ai: aiResult.score, human: humanResult.score, filler: fillerResult.findings.length });
