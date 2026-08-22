#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKILLS_SRC = path.join(ROOT, 'skills');
const USER_SKILLS = path.join(os.homedir(), '.cursor', 'skills');
const USER_AGENTS = path.join(os.homedir(), '.agents', 'skills');
const PLUGIN_LOCAL = path.join(os.homedir(), '.cursor', 'plugins', 'local', 'shadowfax');

function copyDir(src, dest) {
  fs.cpSync(src, dest, { recursive: true, dereference: true });
}

function main() {
  if (!fs.existsSync(path.join(SKILLS_SRC, 'shadowfax', 'SKILL.md'))) {
    console.error('missing skills/shadowfax/SKILL.md');
    process.exit(1);
  }
  if (fs.lstatSync(SKILLS_SRC).isSymbolicLink()) {
    console.error('skills/ is a symlink; npx skills add needs a real folder');
    process.exit(1);
  }

  const names = fs.readdirSync(SKILLS_SRC).filter((d) => {
    const p = path.join(SKILLS_SRC, d);
    return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'SKILL.md'));
  });

  fs.mkdirSync(USER_SKILLS, { recursive: true });
  for (const name of names) {
    const dest = path.join(USER_SKILLS, name);
    fs.rmSync(dest, { recursive: true, force: true });
    copyDir(path.join(SKILLS_SRC, name), dest);
    fs.rmSync(path.join(USER_AGENTS, name), { recursive: true, force: true });
  }

  const localDir = path.dirname(PLUGIN_LOCAL);
  fs.mkdirSync(localDir, { recursive: true });
  try {
    fs.lstatSync(PLUGIN_LOCAL);
    fs.unlinkSync(PLUGIN_LOCAL);
  } catch (_) {
    /* nothing to replace */
  }
  fs.symlinkSync(ROOT, PLUGIN_LOCAL);

  console.log('Cursor discovery:');
  console.log('  repo skills     ' + SKILLS_SRC);
  console.log('  user skills     ' + USER_SKILLS + ' (' + names.length + ' copied)');
  console.log('  local plugin    ' + PLUGIN_LOCAL);
  console.log('');
  console.log('Reload Cursor (Cmd+Shift+P → Developer: Reload Window).');
  console.log('In Agent chat type / then shadowfax, write, outreach.');
}

main();
