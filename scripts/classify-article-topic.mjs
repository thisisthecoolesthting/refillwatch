/**
 * Print topic classification for one article (slug + frontmatter).
 * Run: node scripts/classify-article-topic.mjs <slug>
 *
 * Topic rules live in ../src/lib/amazon-topic-picks.mjs (classifyArticleTopic).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyArticleTopic } from '../src/lib/amazon-topic-picks.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesDir = path.join(__dirname, '..', 'src', 'content', 'articles');

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

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  return m ? m[1] : '';
}

const slugArg = process.argv[2];
if (!slugArg) {
  console.error('Usage: node scripts/classify-article-topic.mjs <slug>');
  process.exit(1);
}

const slug = slugArg.replace(/\.md$/i, '');
const filePath = path.join(articlesDir, `${slug}.md`);

if (!fs.existsSync(filePath)) {
  console.error(`Article not found: ${filePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf8');
const fm = parseFrontmatter(raw);
const title = readFmField(fm, 'title') || slug.replace(/-/g, ' ');

const topic = classifyArticleTopic({
  slug,
  title,
  subtopic: readFmField(fm, 'subtopic'),
  tags: readTags(fm),
});

console.log(topic);
