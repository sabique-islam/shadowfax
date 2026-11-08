---
name: growth-hacks
description: Selects and adapts a concrete acquisition mechanism to one audience, channel, and resource limit. Use when the founder asks for growth hacks, clever campaigns, unconventional marketing, or a reusable tactic beyond generic advice.
license: MIT
disable-model-invocation: true
---

# Growth hacks

Find a useful asymmetry: existing demand, an underused distribution surface, or a valuable artifact the founder can produce cheaply. Novelty alone is not a mechanism.

Run `node scripts/run-state-check.js growth-hacks`. Read Product truth, ICP hypothesis, Diagnosis, Channel bet, and Attempt log. Missing evidence of where the audience gathers means the next move is research, not a stunt. If arrivals fail to activate, name `activation` before more acquisition.

## Select

Read [references/tactics.json](references/tactics.json) through the selector, not as an instruction to execute every card. Create a local brief JSON with `stage` (`prelaunch`, `early`, `retained`), `channel` (`email`, `community`, `social`, `search`, `partners`, `product`, `launch`), `hours`, `cash` (USD equivalent, an explicit planning assumption if converted), and `days`. Budget caps are resource limits; card estimates are planning allowances, not market prices.

```bash
node skills/growth-hacks/scripts/select.js --context brief.json
```

The selector filters feasibility; it does not predict ROI or select a winner. No match means change the scope or choose no tactic, not silently raise the budget. Read [references/cases.md](references/cases.md) only for a relevant precedent.

1. Compare at most three feasible cards against the actual audience and failed attempts. Explain the causal chain from exposure to value to qualified action.
2. Choose one. Name the specific place/person, what makes this useful to them, and the manual version before engineering or spend.
3. Draft the deliverable needed to test it: artifact outline, campaign brief, or context-specific outreach. State assumptions and a hard resource ceiling.
4. Specify sample unit, primary activation or qualified-conversation signal, denominator, observation window, success threshold, kill, and owner. Small pilots establish directional evidence, not statistical certainty.
5. Include a pre-mortem: likely failure, how to detect it, and what would change the decision. Run `review`; apply `write` to paste-ready copy.

## Output

Chosen mechanism and evidence; one execution brief; human next action; tracking plan and kill. If copy is included: channel, paste-ready text, exact destination, what to watch. Never send, spend, or post.

Write **Success / kill**; log a completed test in **Attempt log** only when results exist. A proposed tactic is not an observed result.

## Done

One feasible tactic is adapted to the founder with a concrete manual test, bounded cost, and a falsifiable business signal. Unsupported case results remain labeled. No giant idea dump.
