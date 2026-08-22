#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let errors = 0;
let warns = 0;

function fail(msg) {
  console.error('FAIL  ' + msg);
  errors++;
}

function warn(msg) {
  console.error('WARN  ' + msg);
  warns++;
}

function ok(msg) {
  console.log('PASS  ' + msg);
}

function loadJSON(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) {
    fail(rel + ' missing');
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    fail(rel + ' is not valid JSON: ' + e.message);
    return null;
  }
}

function kebab(s) {
  return /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/.test(s);
}

function relativeOk(p) {
  if (!p) return true;
  if (path.isAbsolute(p)) return false;
  const norm = p.replace(/\\/g, '/');
  if (norm.split('/').includes('..')) return false;
  return true;
}

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('|')) v = v.slice(1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[kv[1]] = v;
  }
  return out;
}

function existsRel(p) {
  return fs.existsSync(path.join(ROOT, p));
}

const NAME_RE = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/;

function main() {
  console.log('Shadowfax plugin check (Cursor + Claude, vs refs/anti-slop gates)\n');

  const agentPlugin = loadJSON('plugin.json');
  if (agentPlugin) {
    if (agentPlugin.$schema !== 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json') {
      fail('plugin.json $schema must be Agent Plugins 1.0.0');
    } else ok('Agent Plugins plugin.json');
    if (agentPlugin.name !== 'shadowfax') fail('plugin.json name must be shadowfax');
    const extra = Object.keys(agentPlugin).filter(
      (k) =>
        !['$schema', 'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions'].includes(
          k
        )
    );
    if (extra.length) fail('plugin.json extra fields (schema additionalProperties: false): ' + extra.join(', '));
  }

  const cursorPlugin = loadJSON('.cursor-plugin/plugin.json');
  if (agentPlugin && cursorPlugin && agentPlugin.version && agentPlugin.version !== cursorPlugin.version) {
    warn('Agent Plugins version ' + agentPlugin.version + ' != Cursor ' + cursorPlugin.version);
  }
  const cursorMarket = loadJSON('.cursor-plugin/marketplace.json');
  const claudePlugin = loadJSON('.claude-plugin/plugin.json');
  const claudeMarket = loadJSON('.claude-plugin/marketplace.json');

  if (cursorPlugin) {
    if (!cursorPlugin.name || !NAME_RE.test(cursorPlugin.name)) {
      fail('Cursor plugin.json name must be lowercase kebab-case');
    } else ok('Cursor plugin.json name=' + cursorPlugin.name);
    for (const k of ['version', 'description', 'author', 'license', 'keywords', 'homepage', 'repository']) {
      if (!cursorPlugin[k]) warn('Cursor plugin.json missing recommended ' + k);
    }
    if (cursorPlugin.author && !cursorPlugin.author.name) fail('Cursor author.name required');
    if (cursorPlugin.author && cursorPlugin.author.url) {
      fail('Cursor author.url is extra (schema additionalProperties: false; name+email only)');
    }
    for (const key of ['skills', 'rules', 'logo']) {
      if (cursorPlugin[key] && !relativeOk(cursorPlugin[key])) {
        fail('Cursor ' + key + ' path not relative: ' + cursorPlugin[key]);
      }
    }
    const skillsRel = (cursorPlugin.skills || './skills/').replace(/^\.\//, '').replace(/\/$/, '');
    const rulesRel = (cursorPlugin.rules || './rules/').replace(/^\.\//, '').replace(/\/$/, '');
    if (!existsRel(skillsRel)) fail('Cursor skills path missing: ' + skillsRel);
    else ok('Cursor skills path ' + skillsRel);
    if (cursorPlugin.rules && !existsRel(rulesRel)) fail('Cursor rules path missing: ' + rulesRel);
    else if (cursorPlugin.rules) ok('Cursor rules path ' + rulesRel);
    if (!existsRel('skills')) fail('skills/ missing (Claude + scripts)');
    else ok('skills/ exists');
    if (cursorPlugin.logo && !existsRel(cursorPlugin.logo)) fail('logo missing: ' + cursorPlugin.logo);
    else if (cursorPlugin.logo) ok('logo ' + cursorPlugin.logo);
  }

  if (cursorMarket) {
    if (!cursorMarket.name || !Array.isArray(cursorMarket.plugins)) {
      fail('Cursor marketplace.json needs name + plugins[]');
    } else ok('Cursor marketplace.json');
    for (const entry of cursorMarket.plugins || []) {
      if (!entry.name || !entry.source) fail('marketplace plugin missing name/source');
      if (entry.source.includes('..')) fail('marketplace source traverses ..');
      if (!existsRel(path.join(entry.source, '.cursor-plugin/plugin.json')) && entry.source !== './') {
        fail('marketplace source has no plugin.json: ' + entry.source);
      }
      if (cursorPlugin && entry.name !== cursorPlugin.name) {
        fail('marketplace name ' + entry.name + ' != plugin.json ' + cursorPlugin.name);
      }
      const extra = Object.keys(entry).filter((k) => !['name', 'source', 'description', 'minClientVersions'].includes(k));
      if (extra.length) fail('marketplace plugin entry extra fields (schema): ' + extra.join(', '));
    }
  }

  if (claudePlugin) {
    if (!claudePlugin.name || !kebab(claudePlugin.name)) fail('Claude plugin.json name invalid');
    else ok('Claude plugin.json name=' + claudePlugin.name);
    if (!claudePlugin.skills) warn('Claude plugin.json should declare skills');
    else ok('Claude skills=' + claudePlugin.skills);
    if (claudePlugin.homepage || claudePlugin.repository) ok('Claude homepage/repository');
    else warn('Claude plugin.json missing homepage/repository');
    if (claudePlugin.version && cursorPlugin && claudePlugin.version !== cursorPlugin.version) {
      warn('Claude version ' + claudePlugin.version + ' != Cursor ' + cursorPlugin.version);
    } else if (claudePlugin.version) ok('plugin versions aligned ' + claudePlugin.version);
  }

  if (claudeMarket) {
    if (!claudeMarket.plugins || !claudeMarket.plugins.length) fail('Claude marketplace has no plugins');
    else ok('Claude marketplace.json');
  }

  for (const f of ['README.md', 'LICENSE', 'AGENTS.md', 'CHANGELOG.md']) {
    if (!existsRel(f)) fail(f + ' missing (gold refs ship these)');
    else ok(f);
  }

  const cursorSkillsDir = path.join(ROOT, '.cursor', 'skills');
  if (!fs.existsSync(cursorSkillsDir)) fail('.cursor/skills missing (Cursor slash discovery)');
  else if (fs.lstatSync(cursorSkillsDir).isSymbolicLink()) {
    fail('.cursor/skills is a symlink; Cursor often skips those. Use a real directory.');
  } else ok('.cursor/skills is a real directory');

  const AUTO_INVOKE = new Set(['shadowfax', 'write']);
  const SKILL_NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const dirs = fs.readdirSync(cursorSkillsDir).filter((d) => {
    const p = path.join(cursorSkillsDir, d);
    return fs.statSync(p).isDirectory();
  });
  let skillCount = 0;
  for (const d of dirs) {
    const skillDir = path.join(cursorSkillsDir, d);
    if (fs.lstatSync(skillDir).isSymbolicLink()) {
      fail('.cursor/skills/' + d + ' is a symlink; Cursor often will not list it under /');
    }
    const skillFile = path.join(skillDir, 'SKILL.md');
    if (!fs.existsSync(skillFile)) {
      fail('.cursor/skills/' + d + ' has no SKILL.md');
      continue;
    }
    const raw = fs.readFileSync(skillFile, 'utf8');
    const fm = parseFrontmatter(raw);
    if (!fm) {
      fail('.cursor/skills/' + d + '/SKILL.md missing YAML frontmatter');
      continue;
    }
    if (!fm.name) fail('.cursor/skills/' + d + ' missing name');
    else if (!SKILL_NAME_RE.test(fm.name) || fm.name.length > 64) {
      fail('.cursor/skills/' + d + ' name fails agentskills.io (lowercase, hyphens, 1-64, no --)');
    }
    if (!fm.description) fail('.cursor/skills/' + d + ' missing description');
    else {
      const desc = fm.description;
      if (desc.length < 1 || desc.length > 1024) fail('.cursor/skills/' + d + ' description length ' + desc.length + ' (1-1024)');
      if (!/\bUse (when|for|after)\b/i.test(desc)) fail('.cursor/skills/' + d + ' description needs WHEN (Use when / Use for / Use after)');
      if (/^(I |You |I'll |We )/i.test(desc)) fail('.cursor/skills/' + d + ' description should be third person');
    }
    if (fm.name && fm.name !== d) fail('.cursor/skills/' + d + ' name=' + fm.name + ' (folder mismatch)');
    if (fm.license && fm.license !== 'MIT') warn('.cursor/skills/' + d + ' license=' + fm.license + ' (pack is MIT)');
    if (!fm.license) fail('.cursor/skills/' + d + ' missing license (agentskills.io optional; this pack requires MIT)');
    if (fm.compatibility && fm.compatibility.length > 500) fail('.cursor/skills/' + d + ' compatibility over 500 chars');
    const dm = String(fm['disable-model-invocation'] || '').toLowerCase();
    if (AUTO_INVOKE.has(d)) {
      if (dm === 'true' || dm === 'yes' || dm === '1') {
        fail('.cursor/skills/' + d + ' is the router/write gate and must stay model-invoked');
      }
    } else if (dm !== 'true') {
      fail('.cursor/skills/' + d + ' specialists must set disable-model-invocation: true');
    }
    const lines = raw.split('\n').length;
    if (lines > 500) warn('.cursor/skills/' + d + ' SKILL.md is ' + lines + ' lines (create-skill cap 500)');
    if (!/^## Done$/m.test(raw)) fail('.cursor/skills/' + d + ' missing ## Done (completion criterion)');
    const mdLinks = [...raw.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
    for (const href of mdLinks) {
      if (href.startsWith('http')) continue;
      if (href.split('/').includes('..')) {
        fail('.cursor/skills/' + d + ' link is not one-level-deep: ' + href);
      } else if (!href.startsWith('#')) {
        const target = path.join(skillDir, href);
        if (!fs.existsSync(target)) fail('.cursor/skills/' + d + ' broken link ' + href);
      }
    }
    const scriptMentions = [...raw.matchAll(/\b(skills\/[a-z0-9-]+\/scripts\/[A-Za-z0-9._-]+|scripts\/[A-Za-z0-9._-]+)/g)].map(
      (m) => m[1]
    );
    for (const rel of new Set(scriptMentions)) {
      if (existsRel(rel)) continue;
      if (fs.existsSync(path.join(skillDir, rel))) continue;
      fail('.cursor/skills/' + d + ' mentions missing ' + rel);
    }
    skillCount++;
  }
  ok(skillCount + ' skills pass agentskills.io + pack gates');

  const ruleFile = path.join(ROOT, 'rules', 'shadowfax.mdc');
  const cursorRule = path.join(ROOT, '.cursor', 'rules', 'shadowfax.mdc');
  if (fs.existsSync(ruleFile)) {
    const rfm = parseFrontmatter(fs.readFileSync(ruleFile, 'utf8'));
    if (!rfm || !rfm.description) fail('rules/shadowfax.mdc missing description frontmatter');
    else ok('rules/shadowfax.mdc frontmatter');
  }
  if (!fs.existsSync(cursorRule)) fail('.cursor/rules/shadowfax.mdc missing (Cursor rule discovery)');
  else if (fs.lstatSync(cursorRule).isSymbolicLink()) {
    fail('.cursor/rules/shadowfax.mdc is a symlink; Cursor often skips those');
  } else if (fs.existsSync(ruleFile) && fs.readFileSync(ruleFile, 'utf8') !== fs.readFileSync(cursorRule, 'utf8')) {
    fail('.cursor/rules/shadowfax.mdc does not match rules/shadowfax.mdc');
  } else ok('.cursor/rules/shadowfax.mdc');

  for (const rel of [
    'scripts/run-state-check.js',
    'scripts/run-state-lib.js',
    'scripts/install-cursor.js',
    'scripts/evidence-log.sh',
    'scripts/run-tests.js',
    'plugin.json',
    'skills/write/scripts/lint.js',
    'skills/write/scripts/rules.json',
    'skills/write/references/tells.md',
    'skills/write/references/examples.md',
    'skills/write/references/checklist.md',
    'skills/youtube/scripts/transcript.sh',
    'skills/github/scripts/fetch.sh',
    'skills/outreach/scripts/generic-scan.js',
    'skills/experimentation/scripts/check.js',
    'skills/analytics/scripts/funnel.js',
    'skills/shadowfax/scripts/pick.js',
    'skills/trends/scripts/fetch.js',
    'skills/video-ideas/scripts/check.js',
    'skills/setup-shadowfax/scripts/init.js',
  ]) {
    if (!existsRel(rel)) fail('bundled script missing: ' + rel);
  }
  ok('bundled scripts present');

  console.log('');
  if (errors) {
    console.error('Validation failed: ' + errors + ' error(s), ' + warns + ' warning(s).');
    process.exit(1);
  }
  console.log('Validation passed' + (warns ? ' with ' + warns + ' warning(s).' : '.'));
}

main();
