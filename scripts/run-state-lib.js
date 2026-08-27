'use strict';

const TEMPLATE_NOISE = [
  /^what it does today/i,
  /^dated, sourced quotes/i,
  /^load-bearing guesses/i,
  /^one primary/i,
  /^lead sentence:?$/i,
  /^refuse to say:?$/i,
  /^the single biggest bottleneck/i,
  /^now \(one move/i,
  /^next:?$/i,
  /^later:?$/i,
  /^log \(date, move/i,
  /^one path this cycle/i,
  /^specific people/i,
  /^what would make this bet true/i,
  /^what happened/i,
  /^bets that already died/i,
  /^success:?$/i,
  /^kill:?$/i,
  /^named people or companies/i,
  /^complaints, replies/i,
  /^not the vision/i,
  /^not a category/i,
  /^why this path/i,
  /^when we abandon/i,
  /^what that implies/i,
  /^date, channel, why/i,
  /^tag `/i,
  /^route to `talk-to-users`/i,
];

function parseSections(md) {
  const sections = {};
  let current = null;
  const lines = String(md || '').split(/\r?\n/);
  for (const line of lines) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      current = h[1].trim();
      sections[current] = [];
      continue;
    }
    if (current) sections[current].push(line);
  }
  return sections;
}

function filled(body) {
  const text = (body || [])
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => l !== '-')
    .filter((l) => !TEMPLATE_NOISE.some((re) => re.test(l)))
    .join(' ')
    .replace(/^lead sentence:\s*/i, '')
    .replace(/^refuse to say:\s*/i, '')
    .replace(/^success:\s*/i, '')
    .replace(/^kill:\s*/i, '')
    .trim();
  return text.length >= 8;
}

function flags(md) {
  const s = parseSections(md);
  return {
    productTruth: filled(s['Product truth']),
    evidence: filled(s['Evidence']),
    icp: filled(s['ICP hypothesis']),
    positioning: filled(s['Positioning bet']),
    diagnosis: filled(s['Diagnosis']),
    roadmap: filled(s['Roadmap']),
    channel: filled(s['Channel bet']),
    reachList: filled(s['Reach list']),
    lastObservation: filled(s['Last observation']),
  };
}

module.exports = { TEMPLATE_NOISE, parseSections, filled, flags };
