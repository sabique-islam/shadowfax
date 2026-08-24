#!/usr/bin/env node
'use strict';

const fs = require('fs');

const FIX = {
  recover: 'regression',
  ctr: 'title-description',
  rank: 'content-push',
};

function expectedCtr(position) {
  const p = Number(position);
  if (!Number.isFinite(p) || p <= 0) return 0;
  if (p <= 1) return 0.28;
  if (p <= 2) return 0.15;
  if (p <= 3) return 0.1;
  if (p <= 5) return 0.06;
  if (p <= 7) return 0.04;
  if (p <= 10) return 0.025;
  return 0.01;
}

function num(v, fallback) {
  if (v === null || v === undefined || v === '') return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function materialDrop(post, absDropMin, propDropMin) {
  const clicks = num(post.clicks, null);
  const prev = num(post.prevClicks, null);
  if (clicks === null || prev === null) return false;
  const abs = prev - clicks;
  if (abs < absDropMin) return false;
  if (prev <= 0) return false;
  return abs / prev >= propDropMin;
}

function scorePost(post, opts) {
  const minImpressions = num(opts.minImpressions, 1000);
  const absDropMin = num(opts.absDropMin, 20);
  const propDropMin = num(opts.propDropMin, 0.2);
  const impressions = num(post.impressions, 0);
  const clicks = num(post.clicks, 0);
  const position = num(post.position, 0);
  const prevClicks = num(post.prevClicks, null);
  const actualCtr = impressions > 0 ? clicks / impressions : 0;
  const expect = expectedCtr(position);
  const recover = prevClicks === null ? 0 : Math.max(0, prevClicks - clicks);
  const ctr = Math.max(0, expect - actualCtr) * impressions;
  const rank = position > 10 ? Math.max(0, impressions * expectedCtr(10) - clicks) : 0;
  const levers = { recover, ctr, rank };
  let lever = 'ctr';
  let opportunity = ctr;
  for (const name of ['recover', 'ctr', 'rank']) {
    if (levers[name] > opportunity) {
      lever = name;
      opportunity = levers[name];
    }
  }
  const forced = materialDrop(post, absDropMin, propDropMin);
  if (forced) {
    lever = 'recover';
    opportunity = Math.max(opportunity, recover);
  }
  const lowVis = impressions < minImpressions && !forced;
  const queued = !lowVis && (forced || opportunity > 0);
  return {
    slug: post.slug || post.url || 'unknown',
    impressions,
    clicks,
    position,
    actualCtr,
    expectedCtr: expect,
    levers: {
      recover: Math.round(recover),
      ctr: Math.round(ctr),
      rank: Math.round(rank),
    },
    lever: queued ? lever : null,
    opportunity: Math.round(opportunity),
    fix: queued ? FIX[lever] : null,
    queued,
    reason: lowVis ? 'low-visibility' : forced ? 'click-loss' : queued ? lever : 'no-headroom',
  };
}

function rankPosts(data) {
  const posts = Array.isArray(data.posts) ? data.posts : [];
  if (!posts.length) return { ok: false, error: 'no posts' };
  const opts = {
    minImpressions: data.minImpressions,
    absDropMin: data.absDropMin,
    propDropMin: data.propDropMin,
  };
  const scored = posts.map((p) => scorePost(p, opts));
  const ranked = scored.filter((p) => p.queued).sort((a, b) => b.opportunity - a.opportunity);
  const dropped = scored.filter((p) => !p.queued);
  return { ok: true, ranked, dropped };
}

function readInput(file) {
  if (file) {
    if (!fs.existsSync(file)) {
      console.error('file not found: ' + file);
      process.exit(2);
    }
    return fs.readFileSync(file, 'utf8');
  }
  return fs.readFileSync(0, 'utf8');
}

function main() {
  const file = process.argv[2];
  const raw = readInput(file);
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(JSON.stringify({ ok: false, error: 'invalid json' }));
    process.exit(1);
  }
  const result = rankPosts(data);
  if (!result.ok) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(result, null, 2));
}

module.exports = { expectedCtr, scorePost, rankPosts };

if (require.main === module) main();
