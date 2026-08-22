#!/usr/bin/env bash
# Dump issues or PRs as JSON. Usage: fetch.sh <owner/repo> <issues|prs> [search]
set -euo pipefail

if [ "$#" -lt 2 ]; then
	printf 'usage: fetch.sh <owner/repo> <issues|prs> [search]\n' >&2
	exit 2
fi

REPO="$1"
KIND="$2"
QUERY="${3:-}"

if ! command -v gh >/dev/null 2>&1; then
	printf 'gh not found. Install GitHub CLI, then retry.\n' >&2
	exit 1
fi

case "$KIND" in
issues)
	if [ -n "$QUERY" ]; then
		gh issue list -R "$REPO" --limit 50 --search "$QUERY" --state all --json number,title,body,url,author,state,createdAt
	else
		gh issue list -R "$REPO" --limit 50 --state all --json number,title,body,url,author,state,createdAt
	fi
	;;
prs)
	if [ -n "$QUERY" ]; then
		gh pr list -R "$REPO" --limit 50 --search "$QUERY" --state all --json number,title,body,url,author,state,createdAt
	else
		gh pr list -R "$REPO" --limit 50 --state all --json number,title,body,url,author,state,createdAt
	fi
	;;
*)
	printf 'kind must be issues or prs\n' >&2
	exit 2
	;;
esac
