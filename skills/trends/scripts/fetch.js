#!/usr/bin/env node
'use strict';

const fs = require('fs');
const https = require('https');

const UA = 'shadowfax/0.3.0 (https://github.com/sabique-islam/shadowfax)';

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { 'User-Agent': UA, Accept: 'application/json' } },
      (res) => {
        let body = '';
        res.on('data', (c) => {
          body += c;
        });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(url + ' -> ' + res.statusCode));
            return;
          }
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('timeout ' + url));
    });
  });
}

function hnHits(data) {
  return (data.hits || []).map((h) => ({
    source: 'hn',
    title: h.title || '',
    url: h.url || 'https://news.ycombinator.com/item?id=' + h.objectID,
    date: (h.created_at || '').slice(0, 10),
    snippet: (h.story_text || h.comment_text || '').replace(/\s+/g, ' ').slice(0, 180),
  }));
}

function redditHits(data) {
  const children = (((data || {}).data || {}).children || []).map((c) => c.data || {});
  return children.map((p) => ({
    source: 'reddit',
    title: p.title || '',
    url: p.permalink ? 'https://www.reddit.com' + p.permalink : p.url || '',
    date: p.created_utc ? new Date(p.created_utc * 1000).toISOString().slice(0, 10) : '',
    snippet: (p.selftext || '').replace(/\s+/g, ' ').slice(0, 180),
  }));
}

function printHits(hits) {
  if (!hits.length) {
    console.error('no live hits');
    process.exit(1);
  }
  console.log('# Live hits\n');
  for (const h of hits) {
    console.log('- ' + (h.date || 'unknown') + ' | ' + h.source + ' | ' + h.title);
    console.log('  ' + h.url);
    if (h.snippet) console.log('  ' + h.snippet);
    console.log('');
  }
}

function parseArgs(argv) {
  let query = '';
  let fixture = null;
  const rest = [];
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--fixture') fixture = argv[++i];
    else rest.push(argv[i]);
  }
  query = rest.join(' ').trim();
  return { query, fixture };
}

async function main() {
  const { query, fixture } = parseArgs(process.argv);
  if (fixture) {
    const data = JSON.parse(fs.readFileSync(fixture, 'utf8'));
    printHits([].concat(data.hn || [], data.reddit || []));
    return;
  }
  if (!query) {
    console.error('usage: node skills/trends/scripts/fetch.js <query> [--fixture file.json]');
    process.exit(2);
  }
  const q = encodeURIComponent(query);
  const results = [];
  try {
    const hn = await get('https://hn.algolia.com/api/v1/search_by_date?query=' + q + '&tags=story&hitsPerPage=8');
    results.push.apply(results, hnHits(hn));
  } catch (e) {
    console.error('hn: ' + e.message);
  }
  try {
    const reddit = await get('https://www.reddit.com/search.json?q=' + q + '&sort=new&limit=8');
    results.push.apply(results, redditHits(reddit));
  } catch (e) {
    console.error('reddit: ' + e.message);
  }
  printHits(results);
}

module.exports = { hnHits, redditHits, printHits };

if (require.main === module) {
  main().catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  });
}
