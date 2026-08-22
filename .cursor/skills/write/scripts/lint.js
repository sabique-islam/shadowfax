#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const RULES_PATH = path.join(__dirname, 'rules.json');

function loadRules() {
  return JSON.parse(fs.readFileSync(RULES_PATH, 'utf8'));
}

function words(text) {
  return text.match(/[A-Za-z][A-Za-z'-]*/g) || [];
}

function sentences(text) {
  return text
    .split(/(?<=[.!?])\s+|\n{2,}/)
    .map((s) => s.trim())
    .filter((s) => words(s).length > 0);
}

function scan(text, rules) {
  const findings = [];
  const hay = text;

  function pushAll(list, category) {
    for (const rule of list) {
      const re = new RegExp(rule.re, 'gim');
      let m;
      while ((m = re.exec(hay))) {
        const before = hay.slice(0, m.index);
        const line = before.split('\n').length;
        findings.push({
          id: rule.id,
          category,
          line,
          match: m[0].replace(/\s+/g, ' ').slice(0, 80),
        });
        if (m.index === re.lastIndex) re.lastIndex += 1;
      }
    }
  }

  pushAll(rules.lexicon, 'lexicon');
  pushAll(rules.phrases, 'phrase');
  pushAll(rules.structure, 'structure');
  pushAll(rules.chatbot, 'chatbot');
  pushAll(rules.authenticity || [], 'authenticity');

  if (/[\u2014\u2013]/.test(hay) || / -- /.test(hay)) {
    findings.push({ id: 'punct.emdash', category: 'punct', line: 1, match: 'em/en dash' });
  }

  const sents = sentences(hay);
  const lens = sents.map((s) => words(s).length);
  for (let i = 0; i + 2 < lens.length; i++) {
    const a = lens[i];
    const b = lens[i + 1];
    const c = lens[i + 2];
    if (Math.abs(a - b) <= 2 && Math.abs(b - c) <= 2 && a >= 8) {
      findings.push({
        id: 'rhythm.metronome',
        category: 'rhythm',
        line: i + 1,
        match: `sentence lengths ${a}/${b}/${c}`,
      });
      break;
    }
  }

  return findings;
}

function cluster(findings) {
  const lex = findings.filter((f) => f.category === 'lexicon');
  const other = findings.filter((f) => f.category !== 'lexicon');
  if (lex.length === 1 && other.length === 0) return other;
  return findings;
}

function score(findings, text) {
  const n = words(text).length || 1;
  const density = findings.length / (n / 100);
  return Math.max(0, Math.min(100, Math.round(Math.log1p(density) * 28 + findings.length * 6)));
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

function analyze(text, rules) {
  const raw = scan(text, rules);
  const findings = cluster(raw);
  return { findings, score: score(findings, text), isolatedLexiconDropped: raw.length !== findings.length };
}

function main() {
  const cmd = process.argv[2] || 'analyze';
  const file = process.argv[3];
  if (cmd !== 'analyze' && cmd !== 'score') {
    console.error('usage: node skills/write/scripts/lint.js analyze|score [file]');
    process.exit(2);
  }
  const rules = loadRules();
  const text = readInput(file);
  const result = analyze(text, rules);
  if (cmd === 'score') {
    console.log(String(result.score));
    return;
  }
  console.log(JSON.stringify(result, null, 2));
}

module.exports = { loadRules, scan, cluster, score, analyze };

if (require.main === module) main();
