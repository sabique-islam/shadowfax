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
  if (/\b(onboard|founder brief|start here|setup from scratch|five questions|generic advice)\b/i.test(m)) return 'onboard';
  if (/\b(roadmap|what (to|should I) work on next|diagnosis|now next later|gtm plan)\b/i.test(m)) return 'roadmap';
  if (/\b(interview users|talk to users|TAB|customer discovery|user interview)\b/i.test(m)) return 'talk-users';
  if (/\b(review (this|the)|stress.?test|is this (actually )?good|quality gate)\b/i.test(m)) return 'review';
  if (/\b(outreach (?:pipeline|operations|ops)|prospect ledger|sequencer (?:export|handoff)|pipeline readiness|outreach export|import prospect(?:s| records)?|track prospect(?:s| stages)?)\b/i.test(m)) return 'outreach-ops';
  if (/\b(prospect repl(?:y|ies)|sales inbox|inbox triage|reply triage|cold[ -]email objection|out[ -]of[ -]office (?:reply|response)|handle (?:this |these |the )?(?:sales |prospect )repl(?:y|ies))\b/i.test(m)) return 'reply-triage';
  // Specific mechanisms must precede generic pricing, competitor, launch, and outreach keywords.
  if (/\b(brand repl(?:y|ies)|funny (?:social )?comments?|witty (?:comments?|replies)|brand banter|moment marketing|(?:zomato|swiggy)[ -]style)\b/i.test(m)) return 'brand-replies';
  if (/\b(free tools?|engineering as marketing|(?:roi|savings) calculator|grader tool|free utilit(?:y|ies))\b/i.test(m)) return 'free-tools';
  if (/\b(referral (?:program|incentives?|rewards?)|refer[ -]a[ -]friend|affiliate(?:s| program| commissions?)?|ambassador program)\b/i.test(m)) return 'referrals';
  if (/\b(creator (?:partnerships?|outreach)|influencer(?: marketing| partnerships?)?|co[ -]marketing|newsletter (?:swap|sponsor)|channel partners?|integration partners?|sponsorship)\b/i.test(m)) return 'partnerships';
  if (/\b(waitlist|wait list|early[ -]access queue|prelaunch referrals?|invitation waves?)\b/i.test(m)) return 'waitlist';
  if (/\b(lifecycle email|welcome (?:email|sequence)|drip campaign|nurture (?:email|sequence)|reactivation (?:email|sequence)|onboarding emails?|trial reminders?)\b/i.test(m)) return 'lifecycle-email';
  if (/\b(growth hack(?:s|ing)?|clever (?:campaigns?|marketing)|unconventional marketing|guerrilla marketing|growth tricks?)\b/i.test(m)) return 'growth-hacks';
  if (/\b(pricing|what to charge|free tier|value metric|how much (should we|to) charge)\b/i.test(m)) return 'pricing';
  if (/\b(homepage|landing page|hero copy|above the fold)\b/i.test(m)) return 'homepage';
  if (/\b(value prop|jobs to be done|JTBD|why would they care)\b/i.test(m)) return 'value-prop';
  if (/\b(time to first value|first run|onboarding leak|activation|weekend test|friction log)\b/i.test(m)) return 'activation';
  if (/\b(first 50|first users|nobody came|shipped to silence)\b/i.test(m)) return 'first-users';
  if (/\b(growth loop|viral|referral loop|self.?reinforcing)\b/i.test(m)) return 'growth-loops';
  if (/\b(buyer|champion|devs love it.*(pay|paid)|market to devs)\b/i.test(m)) return 'buyer-gap';
  if (/\b(wrapper|just chatgpt|commodity model|ai wrapper)\b/i.test(m)) return 'beyond-wrapper';
  if (/\b(support ticket|customer (email|reply)|refund|help desk|respond to (this|the) (user|customer))\b/i.test(m)) {
    return 'support';
  }
  if (/\b(on a call|phone call|voicemail|booked a (demo|call)|inbound call|what (to|do I) say on the call)\b/i.test(m)) {
    return 'inbound';
  }
  if (/\b(competitor|rival|alternative to|how they price|market scan)\b/i.test(m)) return 'competitor';
  if (/\b(github\.com\/|issues? and prs|pull requests?)\b/i.test(m)) return 'github';
  if (/\b(show hn|product hunt|changelog launch|we are launching|launch week)\b/i.test(m)) return 'launch';
  if (/\b(what happened|the campaign failed|open rate|nobody replied|results from)\b/i.test(m)) return 'results';
  if (/\b(change the bet|kill positioning|next cycle|iterate the)\b/i.test(m)) return 'iteration';
  if (/\b(aeo|ai overviews?|answer engine|cited by (an )?ai|ai citations?|chatgpt citations?|claude citations?)\b/i.test(m)) {
    return 'aeo';
  }
  if (
    /\b(blog audit|audit (the |our |existing )?blog|empty SEO|search console|\bGSC\b|content audit|SEO performance|rank(ing)? existing posts|surgical (SEO )?edits?|\bSEO\b for (the )?site)\b/i.test(
      m
    )
  ) {
    return 'content-audit';
  }
  if (/\b(signed up but|retention|funnel|posthog|net developer retention|DREAM funnel)\b/i.test(m)) return 'analytics';
  if (/\b(g2|trustpilot|app store review|i hate .+ because)\b/i.test(m)) return 'complaints';
  if (/\b(reel|short-form|what to film|tiktok hook)\b/i.test(m)) return 'video';
  if (/\b(meme|joke format|trend to riff|fun post)\b/i.test(m)) return 'trends';
  if (/\b(article|changelog essay|show hn writeup|long-form|draft a blog|write a blog|blog post|near-miss quer)\b/i.test(m)) {
    return 'content';
  }
  if (/\b(tweet|linkedin post|reddit title|short post)\b/i.test(m)) return 'posts';
  if (/\b(discovery call|objection|follow-up email|demo outline|close language|founder.?led sales)\b/i.test(m)) {
    return 'sales';
  }
  if (/\b(named (people|companies)|outreach list|prospect list|who should we (email|message))\b/i.test(m)) {
    return 'prospecting';
  }
  if (/\b(distribution experiment|social experiments?|gtm test|one experiment with a kill|hypothesis, sample)\b/i.test(m)) {
    return 'experiment';
  }
  if (/\b(cold email|outreach|discord intro|draft (an )?email|follow.?up mail)\b/i.test(m)) return 'outreach';
  return 'gtm';
}

function gateTactical(stateFlags, skill, intent) {
  const spine = new Set(['onboarding', 'roadmap', 'market-research', 'talk-to-users', 'review', 'ask']);
  if (spine.has(skill)) return skill;
  if (!stateFlags.diagnosis && !spine.has(skill)) return 'roadmap';
  return skill;
}

function pick(stateFlags, message) {
  const intent = intentFromMessage(message);
  if (intent === 'youtube') return { skill: 'youtube', intent };
  if (intent === 'onboard') return { skill: 'onboarding', intent };
  if (intent === 'roadmap') return { skill: stateFlags.productTruth ? 'roadmap' : 'onboarding', intent };
  if (intent === 'review') return { skill: 'review', intent };
  if (intent === 'competitor') return { skill: 'competitive', intent };
  if (intent === 'github') return { skill: 'github', intent };
  if (!stateFlags.productTruth) {
    if (intent === 'support' || intent === 'inbound') return { skill: 'onboarding', intent };
    return { skill: 'ask', intent };
  }

  if (intent === 'reply-triage') return { skill: 'reply-triage', intent };
  if (intent === 'outreach-ops') {
    if (!stateFlags.icp) return { skill: stateFlags.evidence ? 'icp' : 'market-research', intent };
    if (!stateFlags.diagnosis) return { skill: 'roadmap', intent };
    if (!stateFlags.channel) return { skill: 'distribution', intent };
    return { skill: 'outreach-ops', intent };
  }
  if (['growth-hacks', 'free-tools', 'referrals', 'partnerships', 'waitlist', 'brand-replies', 'lifecycle-email'].includes(intent)) {
    if (!['brand-replies', 'lifecycle-email'].includes(intent) && !stateFlags.icp) return { skill: 'icp', intent };
    if (!stateFlags.diagnosis) return { skill: 'roadmap', intent };
    if (intent !== 'lifecycle-email' && !stateFlags.channel) return { skill: 'distribution', intent };
    return { skill: intent, intent };
  }
  if (intent === 'talk-users') return { skill: 'talk-to-users', intent };
  if (intent === 'pricing') {
    if (!stateFlags.icp) return { skill: 'icp', intent };
    return { skill: gateTactical(stateFlags, 'pricing', intent), intent };
  }
  if (intent === 'homepage') {
    if (!stateFlags.icp) return { skill: 'icp', intent };
    if (!stateFlags.positioning) return { skill: 'positioning', intent };
    return { skill: gateTactical(stateFlags, 'homepage', intent), intent };
  }
  if (intent === 'value-prop') {
    if (!stateFlags.evidence) return { skill: 'market-research', intent };
    if (!stateFlags.icp) return { skill: 'icp', intent };
    return { skill: gateTactical(stateFlags, 'value-prop', intent), intent };
  }
  if (intent === 'activation') return { skill: gateTactical(stateFlags, 'activation', intent), intent };
  if (intent === 'first-users') {
    if (!stateFlags.icp) return { skill: 'icp', intent };
    return { skill: gateTactical(stateFlags, 'first-users', intent), intent };
  }
  if (intent === 'growth-loops') {
    if (!stateFlags.icp) return { skill: 'icp', intent };
    return { skill: gateTactical(stateFlags, 'growth-loops', intent), intent };
  }
  if (intent === 'buyer-gap') {
    if (!stateFlags.icp) return { skill: 'icp', intent };
    return { skill: gateTactical(stateFlags, 'buyer-gap', intent), intent };
  }
  if (intent === 'beyond-wrapper') return { skill: gateTactical(stateFlags, 'beyond-wrapper', intent), intent };
  if (intent === 'support') return { skill: 'customer-support', intent };
  if (intent === 'inbound') {
    if (!stateFlags.positioning) return { skill: 'positioning', intent };
    return { skill: 'inbound', intent };
  }

  if (intent === 'launch') return { skill: stateFlags.channel ? 'launches' : 'distribution', intent };
  if (intent === 'results') return { skill: 'campaign-review', intent };
  if (intent === 'iteration') {
    return { skill: stateFlags.lastObservation ? 'iteration' : 'campaign-review', intent };
  }
  if (intent === 'analytics') return { skill: 'analytics', intent };
  if (intent === 'aeo') return { skill: 'aeo', intent };
  if (intent === 'content-audit') return { skill: 'content-audit', intent };
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
  if (!stateFlags.diagnosis) return { skill: 'roadmap', intent };
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

module.exports = { intentFromMessage, pick, gateTactical };

if (require.main === module) main();
