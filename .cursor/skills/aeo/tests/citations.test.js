#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { slugFrom, citations, rowsFromCsv } = require('../scripts/citations.js');

assert.strictEqual(slugFrom('https://example.com/blog/what-is-a-captcha-solver'), 'what-is-a-captcha-solver');
assert.strictEqual(slugFrom('/posts/foo.html'), 'foo');

const parsed = rowsFromCsv(`url,engine,citations
https://ex.com/blog/a,chatgpt,2
https://ex.com/blog/a,claude,1
https://ex.com/blog/b,chatgpt,1
`);
assert.strictEqual(parsed.ok, true);

const tallied = citations({ rows: parsed.rows, totalPosts: 77 });
assert.strictEqual(tallied.ok, true);
assert.strictEqual(tallied.domain.citedPosts, 2);
assert.strictEqual(tallied.domain.citedShare, 0.026);
assert.strictEqual(tallied.posts[0].slug, 'a');
assert.strictEqual(tallied.posts[0].citations, 3);
assert.strictEqual(tallied.posts[0].engines.chatgpt, 2);

const wide = citations({
  csv: `page,ChatGPT,Claude,AI Overviews
https://ex.com/x,1,0,2
https://ex.com/y,0,0,0
`,
});
assert.strictEqual(wide.posts.length, 1);
assert.strictEqual(wide.posts[0].engines['ai-overview'], 2);

const missing = citations({ csv: 'foo,bar\n1,2\n' });
assert.strictEqual(missing.ok, false);

console.log('ok citations', { cited: tallied.domain.citedPosts });
