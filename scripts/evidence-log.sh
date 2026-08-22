#!/usr/bin/env bash
# Append one evidence row. Usage: evidence-log.sh <source> <quote> <url>
set -euo pipefail

if [ "$#" -ne 3 ]; then
	printf 'usage: evidence-log.sh <source> <quote> <url>\n' >&2
	exit 2
fi

PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [ -d "$PWD/.shadowfax" ] || [ -w "$PWD" ]; then
	logfile="$PWD/.shadowfax/evidence.tsv"
else
	logfile="$PLUGIN_ROOT/.shadowfax/evidence.tsv"
fi
mkdir -p "$(dirname "$logfile")"

if [ ! -f "$logfile" ]; then
	printf 'ts\tsource\tquote\turl\n' >"$logfile"
fi

clean() {
	local v
	v=$(printf '%s' "$1" | tr '\t\n\r' '   ')
	case "$v" in
	=* | +* | -* | @*) printf "'%s" "$v" ;;
	*) printf '%s' "$v" ;;
	esac
}

ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
printf '%s\t%s\t%s\t%s\n' "$ts" "$(clean "$1")" "$(clean "$2")" "$(clean "$3")" >>"$logfile"
printf 'logged %s\n' "$logfile"
