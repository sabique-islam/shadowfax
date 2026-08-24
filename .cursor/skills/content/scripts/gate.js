#!/usr/bin/env node
'use strict';

const fs = require('fs');

function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalize(q) {
  return String(q || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function bannedHits(text, terms) {
  const list = Array.isArray(terms) ? terms : [];
  const hits = [];
  for (const term of list) {
    const q = String(term || '').trim();
    if (!q) continue;
    if (/\s/.test(q)) {
      if (text.toLowerCase().includes(q.toLowerCase())) hits.push(q);
      continue;
    }
    if (new RegExp('\\b' + escapeRe(q) + '\\b', 'i').test(text)) hits.push(q);
  }
  return hits;
}

function hasTldr(body) {
  const head = String(body || '').slice(0, 2000);
  return /\b(tl;?dr|at a glance)\b/i.test(head) || /^#{1,3}\s*(summary|tldr|tl;?dr)\b/im.test(body || '');
}

function extractCodeBlocks(body) {
  const blocks = [];
  const re = /```([^\n]*)\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(body || ''))) {
    const info = m[1].trim();
    const code = m[2];
    let docsUrl = null;
    const flagged = info.match(/docsUrl=(\S+)/i);
    if (flagged) docsUrl = flagged[1];
    if (!docsUrl) {
      const inline = info.match(/https?:\/\/\S+/i);
      if (inline) docsUrl = inline[0];
    }
    if (!docsUrl) {
      const line = code.match(/^\s*(?:\/\/|#|--|<!--)\s*docs(?:Url)?:\s*(\S+)/i);
      if (line) docsUrl = line[1].replace('-->', '').trim();
    }
    const language = (info.split(/\s+/)[0] || '').replace(/^docsUrl=.*$/i, '') || 'unknown';
    let version = null;
    const ver = info.match(/version=(\S+)/i);
    if (ver) version = ver[1];
    blocks.push({ language, docsUrl, version, code });
  }
  return blocks;
}

function cannibalized(targetQueries, existingPosts) {
  const targets = (targetQueries || []).map(normalize).filter(Boolean);
  const posts = Array.isArray(existingPosts) ? existingPosts : [];
  for (const q of targets) {
    for (const post of posts) {
      const owned = (post.queries || []).map(normalize).filter(Boolean);
      if (owned.includes(q)) {
        return { query: q, slug: post.slug || post.url || 'unknown' };
      }
    }
  }
  return null;
}

function gate(input) {
  const title = String(input.title || '');
  const body = String(input.body || '');
  const hay = title + '\n' + body;
  const failures = [];
  const advisories = [];

  const cluster = String(input.cluster || '').trim();
  const persona = String(input.persona || '').trim();
  if (!cluster) failures.push('strategy: missing cluster');
  if (!persona) failures.push('strategy: missing persona');
  const banned = bannedHits(hay, input.bannedTerms);
  if (banned.length) failures.push('strategy: banned terms: ' + banned.join(', '));

  const requireTldr = input.requireTldr !== false;
  if (requireTldr && !hasTldr(body)) failures.push('structure: missing labelled TL;DR (or At a glance) near the top');

  const blocks = Array.isArray(input.codeBlocks) && input.codeBlocks.length ? input.codeBlocks : extractCodeBlocks(body);
  blocks.forEach((block, i) => {
    const url = block.docsUrl;
    if (!url) {
      failures.push('code block ' + i + ' (' + (block.language || 'unknown') + ') has no docsUrl (source of truth)');
    } else if (!/^https?:\/\//i.test(String(url))) {
      failures.push('code block ' + i + ' docsUrl is not an http(s) URL: "' + url + '"');
    }
    if (!block.version) advisories.push('code block ' + i + ' has no version pin');
  });

  const clash = cannibalized(input.targetQueries, input.existingPosts);
  if (clash) {
    failures.push('cannibalization: query "' + clash.query + '" is owned by ' + clash.slug + ' — edit that post, do not write a second');
  }

  return {
    ok: failures.length === 0,
    failures,
    advisories,
    owner: clash ? clash.slug : null,
  };
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
  const result = gate(data);
  if (!result.ok) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(result, null, 2));
}

module.exports = { gate, extractCodeBlocks, hasTldr, cannibalized };

if (require.main === module) main();
