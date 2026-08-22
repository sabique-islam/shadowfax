#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { spawnSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

function run(rel, args) {
  return spawnSync('/bin/bash', [path.join(root, rel), ...args], {
    encoding: 'utf8',
    env: { PATH: '' },
  });
}

const gh = run('skills/github/scripts/fetch.sh', ['acme/widget', 'issues']);
assert.notStrictEqual(gh.status, 0);
assert.match(gh.stderr, /gh not found/);

const yt = run('skills/youtube/scripts/transcript.sh', ['https://www.youtube.com/watch?v=x']);
assert.notStrictEqual(yt.status, 0);
assert.match(yt.stderr, /yt-dlp not found/);

console.log('ok missing-binaries');
