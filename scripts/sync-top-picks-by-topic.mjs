/**
 * Replace ## Top Picks through end of file with 5 topic-classified Amazon cards.
 * Run: node scripts/sync-top-picks-by-topic.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  classifyArticleTopic,
  getTopicPicks,
  amazonPickCardHtml,
} from '../src/lib/amazon-topic-picks.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesDir = path.join(__dirname, '..', 'src', 'content', 'articles');

function parseMeta(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { fm: '', body: raw, prefix: '' };
  return { fm: m[1], body: m[2], prefix: `---\n${m[1]}\n---\n` };
}

function readFmField(fm, key) {
  const line = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  if (!line) return '';
  return line[1].trim().replace(/^["']|["']$/g, '');
}

function readTags(fm) {
  const tags = [];
  const block = fm.match(/^tags:\s*\n((?:[ \t]*-\s+.+\n)+)/m);
  if (block) {
    for (const line of block[1].split('\n')) {
      const t = line.match(/^\s*-\s+(.+)$/);
      if (t) tags.push(t[1].trim().replace(/^["']|["']$/g, ''));
    }
  }
  return tags;
}

/** Insert or replace ## Top Picks block (before FAQ/meta tail when missing). */
const META_HEADING = /^## (?:FAQ|How we tracked|Bottom Line|Frequently asked)/im;

function applyTopPicks(body, cardsHtml) {
  const idx = body.indexOf('## Top Picks');
  if (idx >= 0) {
    const before = body.slice(0, idx).trimEnd();
    const section = `## Top Picks\n\n${cardsHtml.trim()}\n`;
    return `${before}\n\n${section}`;
  }
  const section = `\n\n## Top Picks\n\n${cardsHtml.trim()}\n`;
  const metaMatch = body.match(META_HEADING);
  if (metaMatch?.index != null) {
    const before = body.slice(0, metaMatch.index).trimEnd();
    return `${before}${section}\n\n${body.slice(metaMatch.index).trimStart()}`;
  }
  return `${body.trimEnd()}${section}`;
}

const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md'));
const counts = {};
let updated = 0;

for (const f of files) {
  const filePath = path.join(articlesDir, f);
  const slug = f.replace(/\.md$/, '');
  const raw = fs.readFileSync(filePath, 'utf8');
  const { fm, body, prefix } = parseMeta(raw);

  const topic = classifyArticleTopic({
    slug,
    title: readFmField(fm, 'title') || slug.replace(/-/g, ' '),
    subtopic: readFmField(fm, 'subtopic'),
    tags: readTags(fm),
  });
  counts[topic] = (counts[topic] || 0) + 1;

  const picks = getTopicPicks(topic);
  const cards = picks.map((p) => amazonPickCardHtml(p)).join('\n\n');
  const newBody = applyTopPicks(body, cards);
  if (newBody === body) continue;

  fs.writeFileSync(filePath, `${prefix}${newBody}`, 'utf8');
  updated++;
}

console.log('Top Picks synced by topic:');
for (const [t, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${t}: ${n}`);
}
const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(`Total with ## Top Picks: ${total}`);
console.log(`Files updated: ${updated}`);
