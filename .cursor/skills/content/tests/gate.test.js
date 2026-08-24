#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { gate, extractCodeBlocks, hasTldr } = require('../scripts/gate.js');

assert.strictEqual(hasTldr('## TL;DR\n\nWe audit first.'), true);
assert.strictEqual(hasTldr('# Hello\n\nNo summary here.'), false);

const blocks = extractCodeBlocks('```js docsUrl=https://docs.example.com/x\nconsole.log(1)\n```');
assert.strictEqual(blocks[0].docsUrl, 'https://docs.example.com/x');

const good = gate({
  title: 'Paste math into notes',
  body: '## TL;DR\n\nPasted `$...$` stays source.\n\n```js docsUrl=https://docs.example.com/math\nconst x = 1\n```\n',
  cluster: 'notes',
  persona: 'STEM note-takers',
  bannedTerms: ['second brain'],
  targetQueries: ['notion latex paste'],
  existingPosts: [{ slug: 'why-wings-exists', queries: ['why wings'] }],
});
assert.strictEqual(good.ok, true);

const clash = gate({
  title: 'Why it exists',
  body: '## TL;DR\n\nAlready covered.',
  cluster: 'notes',
  persona: 'STEM note-takers',
  targetQueries: ['why wings'],
  existingPosts: [{ slug: 'why-wings-exists', queries: ['why wings'] }],
});
assert.strictEqual(clash.ok, false);
assert.strictEqual(clash.owner, 'why-wings-exists');
assert(clash.failures.some((f) => f.startsWith('cannibalization')));

const banned = gate({
  title: 'Your second brain',
  body: '## TL;DR\n\nNotes.',
  cluster: 'notes',
  persona: 'students',
  bannedTerms: ['second brain'],
});
assert.strictEqual(banned.ok, false);
assert(banned.failures.some((f) => /banned/.test(f)));

const noDocs = gate({
  title: 'Code',
  body: '## TL;DR\n\n```js\nconst x = 1\n```\n',
  cluster: 'notes',
  persona: 'students',
});
assert.strictEqual(noDocs.ok, false);
assert(noDocs.failures.some((f) => /docsUrl/.test(f)));

console.log('ok content-gate', { failures: clash.failures.length });
