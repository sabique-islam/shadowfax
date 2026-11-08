---
name: brand-replies
description: Drafts context-specific witty brand comments and reactive banter from real posts and a defined voice. Use when requesting funny social comments, Zomato or Swiggy style replies, Hinglish brand banter, or moment marketing responses.
license: MIT
disable-model-invocation: true
---

# Brand replies

A good reply belongs in that conversation. Earn the laugh before asking for attention.

Run `node scripts/run-state-check.js brand-replies`. Requires Product truth and Channel bet. Confirm the requested network is the chosen channel or an explicit founder request to change it; do not quietly overwrite the bet.

Read [references/reply-lab.md](references/reply-lab.md). This skill researches the supplied thread directly; opening `trends` as a second specialist is unnecessary. A source post is required for a live draft. If it cannot be fetched, use text the founder supplied and label freshness unverified. Never invent live opportunities.

## Process

1. Capture original URL, publication time, author, exact context, relevant replies, audience fit, and the participation window. Historical examples are not today's trends.
2. Establish voice from real brand/founder samples where available: language, formality, typical sentence length, acceptable teasing, and subjects to avoid. Without samples, propose a restrained voice assumption.
3. Choose the job: build affinity, answer a question, celebrate a customer, or de-escalate. Complaints about money, outages, safety, or a failed order need a helpful support response before humor.
4. Find one concrete detail to turn: a literal interpretation, self-own, unexpected comparison, callback, or tiny shared frustration. Original humor is allowed; fabricated context, quotations, metrics, and brand history are not.
5. Draft at most three meaningfully different candidates unless another number was requested. Match the thread's language; use Hinglish only when the audience and voice support it. Do not impersonate Zomato or Swiggy or recycle their lines.
6. Select one, explain its context in one sentence, and reject the weaker lines. Allow a no-reply verdict. Usually omit links and sales CTAs; never plan brigading or mass comments.
7. Apply `write` while preserving intentional wit. Review fit, factual support, and escalation risk with `review` before presenting.

Write the source opportunity to **Reach list** or **Evidence** if useful. Log performance only after the founder returns results. Replies/likes are attention signals; distinguish qualified conversations and activation.

## Output

Source and timestamp; selected line; channel, paste-ready text, exact thread, what to watch; when to stop or switch to support. Nothing posted.

## Done

One original reply fits a verified or founder-supplied context and voice, with no invented trend and an explicit no-reply alternative when warranted.
