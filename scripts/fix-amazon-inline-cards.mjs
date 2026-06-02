/**
 * Fix broken inline Amazon product cards in article markdown:
 * - Replace dead ws-na.amazon-adsystem widget image URLs
 * - Remove img self-close (/>) that breaks <a> wrapping in markdown
 * - Normalize card markup for stable parsing
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesDir = path.join(__dirname, '..', 'src', 'content', 'articles');

function amazonImage(asin) {
  return `https://m.media-amazon.com/images/P/${asin.toUpperCase()}.01._SL500_.jpg`;
}

function fixWidgetSrc(text) {
  return text.replace(
    /src="https:\/\/ws-na\.amazon-adsystem\.com\/widgets\/q\?[^"]*?ASIN=([A-Z0-9]{10})[^"]*"/gi,
    (_, asin) => `src="${amazonImage(asin)}"`,
  );
}

/** One-line legacy card → structured card (markdown-safe). */
function fixLegacyCards(text) {
  const legacyRe =
    /<a href="(https:\/\/www\.amazon\.com\/dp\/([A-Z0-9]{10})[^"]*)" rel="sponsored noopener" target="_blank" style="display:flex;align-items:center;gap:12px;text-decoration:none;margin:8px 0;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;"><img src="[^"]*" alt="([^"]*)" width="80" height="80" loading="lazy" style="width:80px;height:80px;object-fit:contain;flex-shrink:0;border-radius:6px;background:#fff;"\s*\/?><div style="min-width:0;"><strong style="display:block;color:#1e293b;font-size:0.9em;">([^<]*)<\/strong><span style="color:#64748b;font-size:0.82em;line-height:1.4;">([^<]*)<\/span><\/div><\/a>/gi;

  return text.replace(legacyRe, (_m, href, asin, alt, title, desc) => {
    return `<div class="amazon-inline-card not-prose">
<a class="amazon-inline-card__link" href="${href}" rel="nofollow sponsored noopener" target="_blank">
<img class="amazon-inline-card__img" src="${amazonImage(asin)}" alt="${alt}" width="80" height="80" loading="lazy">
<div class="amazon-inline-card__body">
<strong class="amazon-inline-card__title">${title}</strong>
<span class="amazon-inline-card__desc">${desc}</span>
<span class="amazon-inline-card__cta">Shop on Amazon →</span>
</div>
</a>
</div>`;
  });
}

function fixFile(filePath) {
  const before = fs.readFileSync(filePath, 'utf8');
  let after = fixWidgetSrc(before);
  after = fixLegacyCards(after);
  // Any remaining self-closing img inside amazon anchor lines
  after = after.replace(
    /(<a[^>]*amazon\.com\/dp\/[^>]*>[\s\S]*?<img[^>]*?)\s*\/>/gi,
    '$1>',
  );
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8');
    return true;
  }
  return false;
}

const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md'));
let changed = 0;
for (const f of files) {
  if (fixFile(path.join(articlesDir, f))) changed++;
}
console.log(`Updated ${changed} of ${files.length} article files.`);
