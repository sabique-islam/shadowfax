#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { expectedCtr, scorePost, rankPosts } = require('../scripts/opportunity.js');

assert.strictEqual(expectedCtr(9.4), 0.025);
assert.strictEqual(expectedCtr(1), 0.28);
assert.strictEqual(expectedCtr(12), 0.01);

const ctrPost = scorePost(
  { slug: 'ranking-no-clicks', impressions: 329454, clicks: 857, position: 9.4 },
  { minImpressions: 1000 }
);
assert.strictEqual(ctrPost.queued, true);
assert.strictEqual(ctrPost.lever, 'ctr');
assert.strictEqual(ctrPost.fix, 'title-description');
assert.strictEqual(ctrPost.opportunity, 7379);

const quiet = scorePost(
  { slug: 'nobody-searches', impressions: 40, clicks: 0, position: 8 },
  { minImpressions: 1000 }
);
assert.strictEqual(quiet.queued, false);
assert.strictEqual(quiet.reason, 'low-visibility');

const drop = scorePost(
  { slug: 'lost-traffic', impressions: 200, clicks: 10, prevClicks: 80, position: 12 },
  { minImpressions: 1000, absDropMin: 20, propDropMin: 0.2 }
);
assert.strictEqual(drop.queued, true);
assert.strictEqual(drop.lever, 'recover');
assert.strictEqual(drop.reason, 'click-loss');

const pageTwo = scorePost(
  { slug: 'near-miss', impressions: 20000, clicks: 200, position: 12 },
  { minImpressions: 1000 }
);
assert.strictEqual(pageTwo.lever, 'rank');
assert.strictEqual(pageTwo.fix, 'content-push');

const ranked = rankPosts({
  posts: [
    { slug: 'quiet', impressions: 10, clicks: 0, position: 3 },
    { slug: 'ranking-no-clicks', impressions: 329454, clicks: 857, position: 9.4 },
    { slug: 'near-miss', impressions: 20000, clicks: 200, position: 12 },
  ],
});
assert.strictEqual(ranked.ok, true);
assert.strictEqual(ranked.ranked[0].slug, 'ranking-no-clicks');
assert.strictEqual(ranked.dropped[0].slug, 'quiet');

console.log('ok opportunity', { ctr: ctrPost.opportunity, rank: pageTwo.levers.rank });
