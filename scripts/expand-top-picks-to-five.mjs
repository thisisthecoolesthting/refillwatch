/**
 * Appends two catalog picks to ## Top Picks sections that have exactly three cards.
 * Run: node scripts/expand-top-picks-to-five.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOP_PICKS_EXTRA, amazonPickCardHtml } from '../src/lib/amazon-pick-catalog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesDir = path.join(__dirname, '..', 'src', 'content', 'articles');

const extraBlock = TOP_PICKS_EXTRA.map((p) => amazonPickCardHtml(p)).join('\n\n');

function countCards(section) {
  return (section.match(/<div class="amazon-inline-card not-prose">/g) || []).length;
}

function expandFile(filePath) {
  let text = fs.readFileSync(filePath, 'utf8');
  const idx = text.indexOf('## Top Picks');
  if (idx < 0) return false;

  const after = text.slice(idx);
  const nextH2 = after.search(/\n## [^#]/);
  const section = nextH2 < 0 ? after : after.slice(0, nextH2);
  const cards = countCards(section);
  if (cards !== 3) return false;
  if (section.includes('B07LDB5GLB') && section.includes('B089QRFMZF')) return false;

  const insertAt = text.length;
  const tail = nextH2 < 0 ? '' : text.slice(idx + nextH2);
  const head = nextH2 < 0 ? text : text.slice(0, idx + nextH2);
  const updated = `${head.trimEnd()}\n\n${extraBlock}\n${tail}`;
  if (updated === text) return false;
  fs.writeFileSync(filePath, updated, 'utf8');
  return true;
}

const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md'));
let changed = 0;
for (const f of files) {
  if (expandFile(path.join(articlesDir, f))) changed++;
}
console.log(`Expanded Top Picks (3→5) in ${changed} of ${files.length} articles.`);
