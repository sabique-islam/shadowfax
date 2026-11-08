#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { pick, intentFromMessage } = require('../scripts/pick.js');

const empty = {
  productTruth: false,
  evidence: false,
  icp: false,
  positioning: false,
  diagnosis: false,
  roadmap: false,
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
      diagnosis: true,
      roadmap: true,
      channel: true,
      reachList: true,
      lastObservation: true,
    },
    over
  );
}

const cases = [
  { flags: empty, message: 'what is the shortest path to traction', skill: 'ask' },
  { flags: empty, message: 'run start here five questions', skill: 'onboarding' },
  { flags: { ...empty, productTruth: true }, message: 'what should I work on next', skill: 'roadmap' },
  { flags: empty, message: 'transcribe https://www.youtube.com/watch?v=dQw4w9WgXcQ', skill: 'youtube' },
  { flags: empty, message: 'how does the competitor price this', skill: 'competitive' },
  { flags: empty, message: 'read github.com/foo/bar issues', skill: 'github' },
  { flags: { ...empty, productTruth: true }, message: 'help with customers', skill: 'market-research' },
  { flags: { ...empty, productTruth: true, evidence: true }, message: 'who is the user', skill: 'icp' },
  { flags: { ...empty, productTruth: true, evidence: true, icp: true }, message: 'what do we say', skill: 'positioning' },
  {
    flags: { ...empty, productTruth: true, evidence: true, icp: true, positioning: true },
    message: 'where should we show up',
    skill: 'roadmap',
  },
  {
    flags: { ...empty, productTruth: true, evidence: true, icp: true, positioning: true, diagnosis: true },
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
  { flags: full(), message: 'time to first value friction log', skill: 'activation' },
  { flags: full(), message: 'what should we charge pricing', skill: 'pricing' },
  { flags: full(), message: 'draft homepage hero copy', skill: 'homepage' },
  { flags: full(), message: 'customer support ticket reply', skill: 'customer-support' },
  { flags: full(), message: 'booked a demo call what do I say', skill: 'inbound' },
  { flags: full(), message: 'first 50 users nobody came', skill: 'first-users' },
  { flags: full(), message: 'talk to users TAB interview', skill: 'talk-to-users' },
  { flags: full(), message: 'review this positioning is it good', skill: 'review' },
  { flags: { ...empty, productTruth: true }, message: 'draft a tweet about the hang', skill: 'posts' },
  { flags: { ...empty, productTruth: true }, message: 'what to film for a reel', skill: 'video-ideas' },
  { flags: { ...empty, productTruth: true }, message: 'find a meme format to riff', skill: 'trends' },
  { flags: full({ positioning: false }), message: 'objection on the discovery call', skill: 'positioning' },
  { flags: full(), message: 'objection on the discovery call', skill: 'sales' },
  { flags: { ...empty, productTruth: true }, message: 'pull G2 quotes, I hate X because', skill: 'find-complaints' },
  { flags: { ...empty, productTruth: true }, message: 'write a changelog essay from the last PR', skill: 'content' },
  { flags: { ...empty, productTruth: true }, message: 'run the blog audit on empty SEO titles', skill: 'content-audit' },
  { flags: { ...empty, productTruth: true }, message: 'SEO for the website surgical edits', skill: 'content-audit' },
  { flags: { ...empty, productTruth: true }, message: 'are we getting ChatGPT citations or AEO', skill: 'aeo' },
  { flags: full({ icp: false }), message: 'build an outreach list of named people', skill: 'icp' },
  { flags: full(), message: 'build an outreach list of named people', skill: 'prospecting' },
  { flags: full({ channel: false }), message: 'define one experiment with a kill', skill: 'distribution' },
  { flags: full(), message: 'define one experiment with a kill', skill: 'experimentation' },
  {
    flags: full({ diagnosis: false }),
    message: 'help with traction',
    skill: 'roadmap',
  },
];

const additions = [
  ['find a clever campaign and growth hacks', 'growth-hacks'],
  ['engineering as marketing with a free tool', 'free-tools'],
  ['a free tool for a competitor workflow', 'free-tools'],
  ['design a referral program with rewards', 'referrals'],
  ['an affiliate program for existing customers', 'referrals'],
  ['creator outreach for a newsletter partnership', 'partnerships'],
  ['a newsletter sponsorship', 'partnerships'],
  ['plan a waitlist for our launch', 'waitlist'],
  ['prelaunch referrals with an early-access queue', 'waitlist'],
  ['Zomato style funny comments on social media', 'brand-replies'],
  ['Swiggy-style witty replies', 'brand-replies'],
  ['a welcome sequence of onboarding emails', 'lifecycle-email'],
  ['reactivation email drafts', 'lifecycle-email'],
];
for (const [message, skill] of additions) {
  cases.push({ flags: full(), message, skill });
  cases.push({ flags: empty, message, skill: 'ask' });
  cases.push({ flags: full({ diagnosis: false }), message, skill: 'roadmap' });
  if (!['brand-replies', 'lifecycle-email'].includes(skill)) {
    cases.push({ flags: full({ icp: false }), message, skill: 'icp' });
  }
  if (skill !== 'lifecycle-email') {
    cases.push({ flags: full({ channel: false }), message, skill: 'distribution' });
  }
}
cases.push({ flags: full(), message: 'one social experiment with a sample and kill', skill: 'experimentation' });
cases.push({ flags: full(), message: 'customer support ticket reply for a failed order', skill: 'customer-support' });

cases.push(
  { flags: full(), message: 'manage the outreach pipeline', skill: 'outreach-ops' },
  { flags: full(), message: 'prepare a sequencer export of prospect records', skill: 'outreach-ops' },
  { flags: full(), message: 'import prospects into the prospect ledger', skill: 'outreach-ops' },
  { flags: empty, message: 'manage the outreach pipeline', skill: 'ask' },
  { flags: full({ icp: false }), message: 'outreach pipeline readiness', skill: 'icp' },
  { flags: full({ icp: false, evidence: false }), message: 'outreach pipeline readiness', skill: 'market-research' },
  { flags: full({ diagnosis: false }), message: 'outreach pipeline readiness', skill: 'roadmap' },
  { flags: full({ channel: false }), message: 'outreach pipeline readiness', skill: 'distribution' },
  { flags: full(), message: 'handle this prospect reply about pricing', skill: 'reply-triage' },
  { flags: full(), message: 'triage the sales inbox', skill: 'reply-triage' },
  { flags: full(), message: 'out-of-office response', skill: 'reply-triage' },
  { flags: empty, message: 'handle this prospect reply', skill: 'ask' },
  { flags: { ...empty, productTruth: true }, message: 'handle this prospect reply', skill: 'reply-triage' }
);

for (const c of cases) {
  const got = pick(c.flags, c.message);
  assert.strictEqual(got.skill, c.skill, JSON.stringify({ want: c.skill, got, message: c.message }));
}

assert.strictEqual(intentFromMessage('https://youtu.be/abc'), 'youtube');
assert.strictEqual(intentFromMessage('pricing tiers'), 'pricing');
assert.strictEqual(intentFromMessage('hello'), 'gtm');

console.log('ok', cases.length, 'router fixtures');
