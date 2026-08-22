# Security Policy

## Supported versions

The `main` branch and the latest published version (`package.json` / plugin manifests) are supported.

## Report a vulnerability

Do **not** open a public GitHub issue for a security report.

Use a [private GitHub security advisory](https://github.com/sabique-islam/shadowfax/security/advisories/new).

Include:

- What is affected (install script, skill script, leaked secret in the repo, supply chain)
- How to reproduce
- Impact

This pack is markdown skills plus small Node/bash scripts. It does not send outreach or post on the founder's behalf. Still report anything that could exfiltrate secrets, run unexpected network calls, or overwrite files outside the working project.

## Secrets in issues and PRs

Do not paste API keys, `.env` files, or customer PII. Redact.

## Maintainer response

Reports are reviewed by [@sabique-islam](https://github.com/sabique-islam). You should get an acknowledgement. Fixes land on `main` and in the next version bump of the plugin manifests.
