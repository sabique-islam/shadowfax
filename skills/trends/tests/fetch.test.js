#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { hnHits, redditHits } = require('../scripts/fetch.js');

const hn = hnHits({
  hits: [
    {
      title: 'CSV import hangs',
      url: 'https://example.com/a',
      created_at: '2026-08-01T00:00:00.000Z',
      objectID: '1',
    },
  ],
});
assert.strictEqual(hn[0].source, 'hn');
assert.strictEqual(hn[0].date, '2026-08-01');
assert.strictEqual(hn[0].url, 'https://example.com/a');

const reddit = redditHits({
  data: {
    children: [{ data: { title: 'same hang', permalink: '/r/test/comments/1/', created_utc: 1754000000, selftext: '50k rows' } }],
  },
});
assert.strictEqual(reddit[0].source, 'reddit');
assert(reddit[0].url.includes('reddit.com'));

console.log('ok trends-fetch', { hn: hn.length, reddit: reddit.length });
