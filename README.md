<div align="center">
  <img src="./static/banner.png" alt="Shadowfax Banner" width="100%" />
</div>

<div align="center">

[![skills.sh](https://skills.sh/b/sabique-islam/shadowfax)](https://skills.sh/sabique-islam/shadowfax)

</div>

---

Shadowfax is an agent plugin for Cursor, Claude Code, and other coding agents. It keeps a short notes file in your project (what the product does, who you've talked to, what's been tried), researches where people already complain about your problem, and drafts the next step - cold email, launch post, support reply, pricing call prep, SEO fix.

## Install

One command. Works in Cursor, Claude Code, Codex, and 70+ agents ([skills CLI](https://github.com/vercel-labs/skills)):

```bash
npx skills add sabique-islam/shadowfax
```

All 47 skills, no prompts, copy files (Cursor skips skill-folder symlinks):

```bash
npx skills add sabique-islam/shadowfax --all --copy -y
```

Cursor, every project on this machine (`~/.cursor/skills/`):

```bash
npx skills add sabique-islam/shadowfax -g -a cursor --all --copy -y
```

Reload the window. Type `/` in Agent chat.

### This repo as a plugin

**Cursor** (skills + constitution rule):

```bash
npx github:sabique-islam/shadowfax
```

Same thing from a clone (zero dependencies):

```bash
git clone https://github.com/sabique-islam/shadowfax.git
cd shadowfax
npm run install-cursor
```

That copies skills into `~/.cursor/skills/` and points `~/.cursor/plugins/local/shadowfax` at the clone. Reload.

**Claude Code:**

```
/plugin marketplace add github.com/sabique-islam/shadowfax
/plugin install shadowfax@shadowfax
```

**Agent Plugins** (portable): root [`plugin.json`](plugin.json) follows [agent-plugins.org](https://agent-plugins.org). Canonical skills live in [`skills/`](skills/) so [`npx skills add`](https://github.com/vercel-labs/skills) can find them. `.cursor/skills/` is a copy for Cursor slash in this repo (`npm run sync-cursor-skills` after you edit a skill).

## Get started

1. `/setup-shadowfax` (creates `.shadowfax/` in the working project if missing).
2. `/onboarding` (five questions + repo scan) or fill product truth by hand.
3. `/roadmap` for diagnosis and the one Now move.
4. `/shadowfax` with what you need. The router opens exactly one specialist.
5. You send, post, or take the call. Come back with what happened.

```
/shadowfax we have a CSV importer that hangs at 50k rows. indie hackers keep filing the same issue. what is the shortest path to ten users.
```

`/write` gates outbound paste-ready copy. `/review` gates strategy deliverables.

## Concrete growth playbooks

Shadowfax now includes free tools as marketing, referral/affiliate economics, creator and newsletter partnerships, qualified waitlists, behavior-triggered email, and context-specific brand replies. The growth-hacks library has 22 original tactic cards with prerequisites, a manual pilot, planning allowances, a business signal, and a stop rule.

Try one request after filling your project state:

```text
/shadowfax test a free tool for the job our buyers already search for
/shadowfax find a creator partnership for our existing channel bet
/shadowfax draft a Zomato-style funny comment for this specific thread
/shadowfax choose one growth hack within six hours and no cash spend
```

The router chooses one specialist and checks prerequisites. Brand replies need the actual thread and a suitable voice; the examples are original teaching material, not copied brand posts or claims of virality. Campaigns remain research and drafts: you send, post, and spend.

The [source audit](docs/research/2026-11-08-growth-library-audit.md) records eight public libraries inspected, primary campaign sources, evidence limits, and what was added. Case reports are distinguished from measured results in your product. None of this establishes a promise of traction.

## Skills

| Skill | What it does |
| --- | --- |
| `/shadowfax` | Routes to exactly one specialist |
| `/setup-shadowfax` | Creates cwd `.shadowfax/` if missing |
| `/onboarding` | Five questions + repo scan → product truth |
| `/roadmap` | Diagnosis, Now/Next/Later plan |
| `/review` | Skeptic gate on strategy deliverables |
| `/write` | Prose gate on outbound drafts |
| `/talk-to-users` | TAB interviews, validated vs assumption |
| `/market-research` | Who has the problem, how they solve it now |
| `/icp` | Who becomes an early user |
| `/competitive` | Rivals' positioning, pricing, channels |
| `/find-communities` | Discord, Reddit, Slack, forums, HN |
| `/find-complaints` | Reviews, G2, app stores, support threads |
| `/prospecting` | Named people, companies, creators |
| `/github` | Issues, PRs, discussions |
| `/youtube` | URL to timestamped script plus summary |
| `/positioning` | What to say and what not to say |
| `/value-prop` | JTBD, provable value proposition |
| `/homepage` | Landing page for the developer who visits |
| `/beyond-wrapper` | AI products vs commodity model |
| `/pricing` | Value metric, packaging, price |
| `/buyer-gap` | Developer adopter vs budget holder |
| `/distribution` | One path this cycle |
| `/experimentation` | One experiment with a kill |
| `/activation` | Time-to-first-value, friction log |
| `/first-users` | First 50 through one channel |
| `/outreach` | One specific message per prospect |
| `/launches` | Coordinated launch drafts |
| `/growth-loops` | Self-reinforcing usage → users |
| `/growth-hacks` | Select and adapt a concrete bounded acquisition pilot |
| `/free-tools` | Useful free tools with a credible paid next step |
| `/referrals` | Customer/affiliate rewards, qualification, and economics |
| `/partnerships` | Creator, newsletter, integration, and agency pilots |
| `/waitlist` | Honest access queues and invitation-cohort activation |
| `/brand-replies` | Source-specific witty comments, banter, and Hinglish |
| `/lifecycle-email` | Behavior-triggered email drafts with exits and suppression |
| `/content` | Long-form from product, PRs, users |
| `/content-audit` | Rank existing posts by SEO opportunity |
| `/posts` | Short social for the chosen network |
| `/video-ideas` | Reel and short ideas |
| `/trends` | Live niche jokes and fun-post research |
| `/customer-support` | Support ticket and email reply drafts |
| `/inbound` | Call scripts, voicemail, follow-ups |
| `/sales` | Discovery, objections, follow-ups |
| `/analytics` | Acquisition, activation, retention |
| `/aeo` | Crawl / cite / click for answer engines |
| `/campaign-review` | Why this campaign failed or worked |
| `/iteration` | Write the next bet into run-state |

## Check

```bash
npm test
npm run validate
```
