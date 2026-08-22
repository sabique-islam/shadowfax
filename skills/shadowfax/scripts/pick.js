#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function pluginRootFrom(start) {
  let dir = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(dir, 'plugin.json')) && fs.existsSync(path.join(dir, 'AGENTS.md'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error('shadowfax plugin root not found from ' + start);
    dir = parent;
  }
}

const PLUGIN_ROOT = pluginRootFrom(__dirname);
const { flags: flagsFromMd } = require(path.join(PLUGIN_ROOT, 'scripts', 'run-state-lib.js'));

function intentFromMessage(message) {
  const m = String(message || '');
  if (/youtu\.be|youtube\.com/i.test(m)) return 'youtube';
  if (/\b(competitor|rival|alternative to|how they price)\b/i.test(m)) return 'competitor';
  if (/\b(github\.com\/|issues? and prs|pull requests?)\b/i.test(m)) return 'github';
  if (/\b(show hn|product hunt|changelog launch|we are launching|launch week)\b/i.test(m)) return 'launch';
  if (/\b(what happened|the campaign failed|open rate|nobody replied|results from)\b/i.test(m)) return 'results';
  if (/\b(change the bet|kill positioning|next cycle|iterate the)\b/i.test(m)) return 'iteration';
  if (/\b(signed up but|activation|retention|funnel|posthog)\b/i.test(m)) return 'analytics';
  if (/\b(g2|trustpilot|app store review|i hate .+ because)\b/i.test(m)) return 'complaints';
  if (/\b(reel|short-form|what to film|tiktok hook)\b/i.test(m)) return 'video';
  if (/\b(meme|joke format|trend to riff|fun post)\b/i.test(m)) return 'trends';
  if (/\b(article|changelog essay|show hn writeup|long-form)\b/i.test(m)) return 'content';
  if (/\b(tweet|linkedin post|reddit title|short post)\b/i.test(m)) return 'posts';
  if (/\b(discovery call|objection|follow-up email|demo outline|close language)\b/i.test(m)) return 'sales';
  if (/\b(named (people|companies)|outreach list|prospect list|who should we (email|message))\b/i.test(m)) {
    return 'prospecting';
  }
  if (/\b(distribution experiment|gtm test|one experiment with a kill|hypothesis, sample)\b/i.test(m)) {
    return 'experiment';
  }
  if (/\b(cold email|outreach|discord intro)\b/i.test(m)) return 'outreach';
  return 'gtm';
}

function pick(stateFlags, message) {
  const intent = intentFromMessage(message);
  if (intent === 'youtube') return { skill: 'youtube', intent };
  if (intent === 'competitor') return { skill: 'competitive', intent };
  if (intent === 'github') return { skill: 'github', intent };
  if (!stateFlags.productTruth) return { skill: 'ask', intent };

  if (intent === 'launch') return { skill: stateFlags.channel ? 'launches' : 'distribution', intent };
  if (intent === 'results') return { skill: 'campaign-review', intent };
  if (intent === 'iteration') {
    return { skill: stateFlags.lastObservation ? 'iteration' : 'campaign-review', intent };
  }
  if (intent === 'analytics') return { skill: 'analytics', intent };
  if (intent === 'complaints') return { skill: 'find-complaints', intent };
  if (intent === 'video') return { skill: 'video-ideas', intent };
  if (intent === 'trends') return { skill: 'trends', intent };
  if (intent === 'content') return { skill: 'content', intent };
  if (intent === 'posts') return { skill: 'posts', intent };
  if (intent === 'sales') {
    if (!stateFlags.icp) return { skill: 'icp', intent };
    if (!stateFlags.positioning) return { skill: 'positioning', intent };
    return { skill: 'sales', intent };
  }
  if (intent === 'prospecting') {
    if (!stateFlags.icp) return { skill: 'icp', intent };
    return { skill: 'prospecting', intent };
  }
  if (intent === 'experiment') {
    if (!stateFlags.channel) return { skill: 'distribution', intent };
    return { skill: 'experimentation', intent };
  }
  if (intent === 'outreach') {
    if (!stateFlags.reachList || !stateFlags.positioning) {
      if (!stateFlags.evidence) return { skill: 'market-research', intent };
      if (!stateFlags.icp) return { skill: 'icp', intent };
      if (!stateFlags.positioning) return { skill: 'positioning', intent };
      if (!stateFlags.channel) return { skill: 'distribution', intent };
      return { skill: 'find-communities', intent };
    }
    return { skill: 'outreach', intent };
  }

  if (!stateFlags.evidence) return { skill: 'market-research', intent };
  if (!stateFlags.icp) return { skill: 'icp', intent };
  if (!stateFlags.positioning) return { skill: 'positioning', intent };
  if (!stateFlags.channel) return { skill: 'distribution', intent };
  if (!stateFlags.reachList) return { skill: 'find-communities', intent };
  return { skill: 'outreach', intent };
}

function parseArgs(argv) {
  let statePath = null;
  let message = '';
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--message') {
      message = argv[++i] || '';
    } else if (argv[i] === '--state') {
      statePath = argv[++i];
    } else if (!argv[i].startsWith('-')) {
      statePath = argv[i];
    }
  }
  return { statePath, message };
}

function main() {
  const { statePath, message } = parseArgs(process.argv);
  const cwdState = path.join(process.cwd(), '.shadowfax', 'run-state.md');
  const pluginState = path.join(PLUGIN_ROOT, '.shadowfax', 'run-state.md');
  const file = path.resolve(statePath || (fs.existsSync(cwdState) ? cwdState : pluginState));
  if (!fs.existsSync(file)) {
    console.error('run-state missing: ' + file);
    process.exit(1);
  }
  const result = pick(flagsFromMd(fs.readFileSync(file, 'utf8')), message);
  console.log(JSON.stringify(result));
}

module.exports = { intentFromMessage, pick };

if (require.main === module) main();
