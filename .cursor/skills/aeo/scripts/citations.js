#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ENGINE_HEADERS = [
  [/chatgpt/i, 'chatgpt'],
  [/claude/i, 'claude'],
  [/ai[\s_-]*overview/i, 'ai-overview'],
  [/perplexity/i, 'perplexity'],
  [/gemini/i, 'gemini'],
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let i = 0;
  let inQuotes = false;
  const s = String(text || '').replace(/^\uFEFF/, '');
  while (i < s.length) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cell += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ',') {
      row.push(cell);
      cell = '';
      i++;
      continue;
    }
    if (c === '\r') {
      i++;
      continue;
    }
    if (c === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      i++;
      continue;
    }
    cell += c;
    i++;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((x) => String(x).trim()));
}

function slugFrom(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  let last;
  if (!/^https?:\/\//i.test(raw)) {
    last = raw.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean).pop() || raw;
  } else {
    try {
      const u = new URL(raw);
      const parts = u.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
      last = parts[parts.length - 1] || u.hostname;
    } catch (e) {
      last = raw;
    }
  }
  return String(last).replace(/\.(html?|md)$/i, '');
}

function headerIndex(headers, names) {
  const lower = headers.map((h) => h.trim().toLowerCase());
  for (const name of names) {
    const i = lower.indexOf(name);
    if (i !== -1) return i;
  }
  return -1;
}

function rowsFromCsv(text) {
  const table = parseCsv(text);
  if (!table.length) return { ok: false, error: 'empty csv' };
  const headers = table[0].map((h) => String(h).trim());
  const urlIdx = headerIndex(headers, ['url', 'page', 'landing_page', 'landing page', 'slug']);
  if (urlIdx === -1) return { ok: false, error: 'csv needs a url, page, or slug column' };
  const engineIdx = headerIndex(headers, ['engine', 'ai_engine', 'ai engine', 'source']);
  const countIdx = headerIndex(headers, ['citations', 'cited', 'ai_citations', 'ai citations']);
  const wide = [];
  headers.forEach((h, i) => {
    for (const [re, engine] of ENGINE_HEADERS) {
      if (re.test(h)) wide.push({ i, engine });
    }
  });
  const rows = [];
  for (const line of table.slice(1)) {
    const loc = line[urlIdx];
    if (wide.length) {
      for (const col of wide) {
        const n = Number(line[col.i]);
        if (!Number.isFinite(n) || n <= 0) continue;
        rows.push({ url: loc, engine: col.engine, citations: n });
      }
      continue;
    }
    const cited = countIdx === -1 ? 1 : Number(line[countIdx]);
    if (!Number.isFinite(cited) || cited <= 0) continue;
    rows.push({
      url: loc,
      engine: engineIdx === -1 ? 'unknown' : line[engineIdx],
      citations: cited,
    });
  }
  return { ok: true, rows };
}

function tally(rows, totalPosts) {
  const bySlug = {};
  for (const row of rows) {
    const slug = slugFrom(row.url || row.page || row.slug);
    if (!slug) continue;
    const engine = String(row.engine || 'unknown').toLowerCase().trim() || 'unknown';
    const n = Number(row.citations ?? row.cited ?? 1);
    if (!Number.isFinite(n) || n <= 0) continue;
    if (!bySlug[slug]) bySlug[slug] = { slug, citations: 0, engines: {} };
    bySlug[slug].citations += n;
    bySlug[slug].engines[engine] = (bySlug[slug].engines[engine] || 0) + n;
  }
  const posts = Object.values(bySlug).sort((a, b) => b.citations - a.citations);
  const domainCitations = posts.reduce((s, p) => s + p.citations, 0);
  const known = Number(totalPosts);
  return {
    ok: true,
    posts,
    domain: {
      citedPosts: posts.length,
      citations: domainCitations,
      totalPostsKnown: Number.isFinite(known) && known > 0 ? known : 'unknown',
      citedShare:
        Number.isFinite(known) && known > 0 ? Number((posts.length / known).toFixed(4)) : 'unknown',
    },
    caveat: 'rows you did not import do not exist. crawl is a different layer than cite or click.',
  };
}

function citations(input) {
  if (input && Array.isArray(input.rows)) {
    return tally(input.rows, input.totalPosts);
  }
  if (input && typeof input.csv === 'string') {
    const parsed = rowsFromCsv(input.csv);
    if (!parsed.ok) return parsed;
    return tally(parsed.rows, input.totalPosts);
  }
  return { ok: false, error: 'need rows[] or csv' };
}

function readInput(file) {
  if (file) {
    if (!fs.existsSync(file)) {
      console.error('file not found: ' + file);
      process.exit(2);
    }
    return { raw: fs.readFileSync(file, 'utf8'), file };
  }
  return { raw: fs.readFileSync(0, 'utf8'), file: '' };
}

function main() {
  const file = process.argv[2];
  const totalPosts = process.argv[3];
  const { raw, file: name } = readInput(file);
  let result;
  const looksJson = /^\s*[\{\[]/.test(raw);
  const ext = name ? path.extname(name).toLowerCase() : '';
  if (looksJson && ext !== '.csv') {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error(JSON.stringify({ ok: false, error: 'invalid json' }));
      process.exit(1);
    }
    if (totalPosts && data.totalPosts == null) data.totalPosts = Number(totalPosts);
    result = citations(data);
  } else {
    result = citations({ csv: raw, totalPosts: totalPosts ? Number(totalPosts) : undefined });
  }
  if (!result.ok) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(result, null, 2));
}

module.exports = { parseCsv, slugFrom, rowsFromCsv, citations, tally };

if (require.main === module) main();
