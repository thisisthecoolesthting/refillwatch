/**
 * Fix inline Amazon cards: use curated images/I URLs (not dead P/ASIN GIFs).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AMAZON_INLINE_IMAGE_BY_ASIN, amazonInlineImageUrl } from '../src/lib/amazon-inline-image-map.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesDir = path.join(__dirname, '..', 'src', 'content', 'articles');

function fixWidgetSrc(text) {
  return text.replace(
    /src="https:\/\/ws-na\.amazon-adsystem\.com\/widgets\/q\?[^"]*?ASIN=([A-Z0-9]{10})[^"]*"/gi,
    (_, asin) => `src="${amazonInlineImageUrl(asin)}"`,
  );
}

function fixPAsinSrc(text) {
  return text.replace(
    /src="https:\/\/m\.media-amazon\.com\/images\/P\/([A-Z0-9]{10})\.[^"]*"/gi,
    (_, asin) => `src="${amazonInlineImageUrl(asin)}"`,
  );
}

function fixLegacyCards(text) {
  const legacyRe =
    /<a href="(https:\/\/www\.amazon\.com\/dp\/([A-Z0-9]{10})[^"]*)" rel="sponsored noopener" target="_blank" style="display:flex;align-items:center;gap:12px;text-decoration:none;margin:8px 0;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;"><img src="[^"]*" alt="([^"]*)" width="80" height="80" loading="lazy" style="width:80px;height:80px;object-fit:contain;flex-shrink:0;border-radius:6px;background:#fff;"\s*\/?><div style="min-width:0;"><strong style="display:block;color:#1e293b;font-size:0.9em;">([^<]*)<\/strong><span style="color:#64748b;font-size:0.82em;line-height:1.4;">([^<]*)<\/span><\/div><\/a>/gi;

  return text.replace(legacyRe, (_m, href, asin, alt, title, desc) => cardHtml(href, asin, alt, title, desc));
}

function cardHtml(href, asin, alt, title, desc) {
  return `<div class="amazon-inline-card not-prose">
<a class="amazon-inline-card__link" href="${href}" rel="nofollow sponsored noopener" target="_blank">
<img class="amazon-inline-card__img" src="${amazonInlineImageUrl(asin)}" alt="${alt}" width="80" height="80" loading="lazy" decoding="async">
<div class="amazon-inline-card__body">
<strong class="amazon-inline-card__title">${title}</strong>
<span class="amazon-inline-card__desc">${desc}</span>
<span class="amazon-inline-card__cta">Shop on Amazon →</span>
</div>
</a>
</div>`;
}

/** Replace known-stale images/I URLs with current map entries (CDN ids rot). */
function fixStaleCuratedSrc(text) {
  let out = text;
  for (const [asin, url] of Object.entries(AMAZON_INLINE_IMAGE_BY_ASIN)) {
    const re = new RegExp(
      `(href="https://www\\.amazon\\.com/dp/${asin}[^"]*"[^>]*>[\\s\\S]*?<img class="amazon-inline-card__img" src=")[^"]+(")`,
      'gi',
    );
    out = out.replace(re, `$1${url}$2`);
  }
  return out;
}

function fixFile(filePath) {
  const before = fs.readFileSync(filePath, 'utf8');
  let after = fixWidgetSrc(before);
  after = fixPAsinSrc(after);
  after = fixStaleCuratedSrc(after);
  after = fixLegacyCards(after);
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
console.log(`Map has ${Object.keys(AMAZON_INLINE_IMAGE_BY_ASIN).length} ASINs. Updated ${changed} of ${files.length} articles.`);
