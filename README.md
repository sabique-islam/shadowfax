<div align="center">
  <img src="./static/banner.png" alt="Shadowfax Banner" width="100%" />
</div>

---

Shadowfax is a founder-side GTM plugin. It finds where demand already talks, picks one bet, and drafts the reach. You send and post.

It does not write product code. It does not post.

## Install

One command. Works in Cursor, Claude Code, Codex, and 70+ agents ([skills CLI](https://github.com/vercel-labs/skills)):

```bash
npx skills add sabique-islam/shadowfax
```

All 24 skills, no prompts, copy files (Cursor skips skill-folder symlinks):

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
2. Fill product truth: what it does today, for whom.
3. `/shadowfax` with what you know. The router opens exactly one specialist.
4. You send or post. Then come back with what happened.

```
/shadowfax we have a CSV importer that hangs at 50k rows. indie hackers keep filing the same issue. what is the shortest path to ten users.
```

`/write` is the prose gate on anything you might paste.

## Skills

| Skill | What it does |
| --- | --- |
| `/shadowfax` | Routes to exactly one specialist |
| `/setup-shadowfax` | Creates cwd `.shadowfax/` if missing |
| `/write` | Prose gate on outbound drafts |
| `/market-research` | Who has the problem, how they solve it now |
| `/icp` | Who becomes an early user |
| `/competitive` | Their positioning, pricing, channels, launches |
| `/find-communities` | Discord, Reddit, Slack, forums, HN |
| `/find-complaints` | Reviews, G2, app stores, support threads |
| `/prospecting` | Named people, companies, creators |
| `/github` | Issues, PRs, discussions |
| `/youtube` | URL to timestamped script plus summary |
| `/positioning` | What to say and what not to say |
| `/distribution` | One path this cycle |
| `/experimentation` | One experiment with a kill |
| `/outreach` | One specific message per prospect |
| `/content` | Long-form from product, PRs, users |
| `/posts` | Short social for the chosen network |
| `/video-ideas` | Reel and short ideas |
| `/trends` | Live niche jokes and fun-post research |
| `/launches` | Coordinated drafts for this launch |
| `/sales` | Discovery, objections, follow-ups |
| `/analytics` | Acquisition, activation, retention |
| `/campaign-review` | Why this campaign failed or worked |
| `/iteration` | Write the next bet into run-state |

## Check

```bash
npm test
npm run validate
```
