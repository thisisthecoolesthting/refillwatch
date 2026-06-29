/**
 * Fix broken Amazon monetization in articles:
 * 1. Strip nonsense prose links like [with](amazon.com/dp/...) on random words
 * 2. Close unclosed amazon-inline-card HTML blocks (missing </a></div>)
 * 3. Remove duplicate mid-article cards (keep ## Top Picks section only)
 *
 * Run: node scripts/fix-broken-amazon-links.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesDir = path.join(__dirname, '..', 'src', 'content', 'articles');

/** Markdown inline Amazon affiliate links in running text */
const proseAmazonRe =
  /\[([^\]]+)\]\(https?:\/\/(?:www\.)?amazon\.com\/dp\/[A-Z0-9]{10}[^)]*\)/gi;

function stripProseAmazonLinks(text) {
  return text.replace(proseAmazonRe, '$1');
}

/** Close cards where </div> (body) is not followed by </a></div> */
function closeUnclosedCards(text) {
  return text.replace(
    /(<div class="amazon-inline-card__body">[\s\S]*?<span class="amazon-inline-card__cta">Shop on Amazon →<\/span>\s*<\/div>)(\s*)(?!<\/a>)/g,
    '$1\n</a>\n</div>\n',
  );
}

/** Remove amazon-inline-card blocks that appear before ## Top Picks */
function removeMidArticleCards(body) {
  const topIdx = body.indexOf('## Top Picks');
  if (topIdx < 0) {
    return body.replace(/<div class="amazon-inline-card[\s\S]*?<\/div>\s*<\/a>\s*<\/div>\s*/g, '');
  }
  const before = body.slice(0, topIdx);
  const after = body.slice(topIdx);
  const cleanedBefore = before.replace(
    /<div class="amazon-inline-card[\s\S]*?<\/div>\s*<\/a>\s*<\/div>\s*/g,
    '',
  );
  return cleanedBefore + after;
}

function fixFile(filePath) {
  const before = fs.readFileSync(filePath, 'utf8');
  let after = stripProseAmazonLinks(before);
  after = closeUnclosedCards(after);
  after = removeMidArticleCards(after);
  after = after.replace(/\n{4,}/g, '\n\n\n');
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8');
    return true;
  }
  return false;
}

const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md'));
let changed = 0;
let proseStripped = 0;

for (const f of files) {
  const raw = fs.readFileSync(path.join(articlesDir, f), 'utf8');
  const matches = raw.match(proseAmazonRe);
  if (matches) proseStripped += matches.length;
  if (fixFile(path.join(articlesDir, f))) changed++;
}

console.log(`Fixed ${changed}/${files.length} articles.`);
console.log(`Stripped ${proseStripped} broken prose Amazon links.`);
