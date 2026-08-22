#!/usr/bin/env bash
# Fetch captions via yt-dlp. Print timestamped markdown script. No summary.
# Usage: transcript.sh <youtube-url>
set -euo pipefail

if [ "$#" -lt 1 ]; then
	printf 'usage: transcript.sh <youtube-url>\n' >&2
	exit 2
fi

URL="$1"

if ! command -v yt-dlp >/dev/null 2>&1; then
	printf 'yt-dlp not found. Install it, then retry.\n' >&2
	exit 1
fi

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

if ! yt-dlp --skip-download --write-sub --write-auto-sub --sub-langs 'en.*,en,en-US,en-GB' --sub-format vtt --no-warnings -o "$tmpdir/vid" "$URL" >/dev/null 2>"$tmpdir/err"; then
	printf 'yt-dlp failed\n' >&2
	cat "$tmpdir/err" >&2 || true
	exit 1
fi

vtt="$(find "$tmpdir" -name '*.vtt' | head -n 1 || true)"
if [ -z "$vtt" ]; then
	printf 'no captions\n' >&2
	exit 1
fi

title="$(yt-dlp --print '%(title)s' --no-warnings --no-download "$URL" 2>/dev/null || printf 'untitled')"
duration="$(yt-dlp --print '%(duration_string)s' --no-warnings --no-download "$URL" 2>/dev/null || true)"
kind="auto"
case "$vtt" in
*.auto.*) kind="auto-generated" ;;
esac

printf '# %s\n\n' "$title"
printf 'Source: %s\n' "$URL"
if [ -n "$duration" ]; then
	printf 'Duration: %s\n' "$duration"
fi
printf 'Captions: %s\n\n' "$kind"
printf '## Script\n\n'

awk '
BEGIN { FS = "\n"; RS = ""; last = "" }
/-->/ {
  split($1, a, / --> /)
  ts = a[1]
  sub(/^[0-9]+:/, "", ts)
  split(ts, t, /[.]/)
  stamp = t[1]
  text = ""
  for (i = 2; i <= NF; i++) {
    line = $i
    gsub(/<[^>]+>/, "", line)
    gsub(/\r/, "", line)
    if (line != "") {
      if (text != "") text = text " "
      text = text line
    }
  }
  gsub(/  +/, " ", text)
  if (text != "" && text != last) {
    printf "**[%s]** %s\n\n", stamp, text
    last = text
  }
}
' "$vtt"
