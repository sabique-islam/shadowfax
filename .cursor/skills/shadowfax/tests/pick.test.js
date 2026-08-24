#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { pick, intentFromMessage } = require('../scripts/pick.js');

const empty = {
  productTruth: false,
  evidence: false,
  icp: false,
  positioning: false,
  channel: false,
  reachList: false,
  lastObservation: false,
};

function full(over) {
  return Object.assign(
    {
      productTruth: true,
      evidence: true,
      icp: true,
      positioning: true,
      channel: true,
      reachList: true,
      lastObservation: true,
    },
    over
  );
}

const cases = [
  { flags: empty, message: 'what is the shortest path to traction', skill: 'ask' },
  { flags: empty, message: 'transcribe https://www.youtube.com/watch?v=dQw4w9WgXcQ', skill: 'youtube' },
  { flags: empty, message: 'how does the competitor price this', skill: 'competitive' },
  { flags: empty, message: 'read github.com/foo/bar issues', skill: 'github' },
  { flags: { ...empty, productTruth: true }, message: 'help with customers', skill: 'market-research' },
  { flags: { ...empty, productTruth: true, evidence: true }, message: 'who is the user', skill: 'icp' },
  { flags: { ...empty, productTruth: true, evidence: true, icp: true }, message: 'what do we say', skill: 'positioning' },
  {
    flags: { ...empty, productTruth: true, evidence: true, icp: true, positioning: true },
    message: 'where should we show up',
    skill: 'distribution',
  },
  { flags: full({ reachList: false }), message: 'get in front of people', skill: 'find-communities' },
  { flags: full(), message: 'help with traction', skill: 'outreach' },
  { flags: full({ channel: false }), message: 'we are launching on Thursday', skill: 'distribution' },
  { flags: full(), message: 'we are launching on Thursday', skill: 'launches' },
  { flags: full(), message: 'nobody replied. what happened', skill: 'campaign-review' },
  { flags: full(), message: 'change the bet for next cycle', skill: 'iteration' },
  { flags: full({ lastObservation: false }), message: 'change the bet for next cycle', skill: 'campaign-review' },
  { flags: full(), message: 'people signed up but nobody stayed', skill: 'analytics' },
  { flags: { ...empty, productTruth: true }, message: 'draft a tweet about the hang', skill: 'posts' },
  { flags: { ...empty, productTruth: true }, message: 'what to film for a reel', skill: 'video-ideas' },
  { flags: { ...empty, productTruth: true }, message: 'find a meme format to riff', skill: 'trends' },
  { flags: full({ positioning: false }), message: 'objection on the discovery call', skill: 'positioning' },
  { flags: full(), message: 'objection on the discovery call', skill: 'sales' },
  { flags: { ...empty, productTruth: true }, message: 'pull G2 quotes, I hate X because', skill: 'find-complaints' },
  { flags: { ...empty, productTruth: true }, message: 'write a changelog essay from the last PR', skill: 'content' },
  { flags: { ...empty, productTruth: true }, message: 'run the blog audit on empty SEO titles', skill: 'content-audit' },
  { flags: { ...empty, productTruth: true }, message: 'are we getting ChatGPT citations or AEO', skill: 'aeo' },
  { flags: { ...empty, productTruth: true }, message: 'draft a blog from a near-miss query', skill: 'content' },
  { flags: full({ icp: false }), message: 'build an outreach list of named people', skill: 'icp' },
  { flags: full(), message: 'build an outreach list of named people', skill: 'prospecting' },
  { flags: full({ channel: false }), message: 'define one experiment with a kill', skill: 'distribution' },
  { flags: full(), message: 'define one experiment with a kill', skill: 'experimentation' },
];

for (const c of cases) {
  const got = pick(c.flags, c.message);
  assert.strictEqual(got.skill, c.skill, JSON.stringify({ want: c.skill, got, message: c.message }));
}

assert.strictEqual(intentFromMessage('https://youtu.be/abc'), 'youtube');
assert.strictEqual(intentFromMessage('hello'), 'gtm');

console.log('ok', cases.length, 'router fixtures');
