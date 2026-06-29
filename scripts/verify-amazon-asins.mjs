/**
 * Validate every curated Amazon ASIN before deploy.
 * - Registry + topic picks must have image map entries
 * - Optional Keepa product lookup when KEEPA_API_KEY is set
 * - Flags published /products/ entries outside the curated set on homepage surfaces
 *
 * Run: node scripts/verify-amazon-asins.mjs
 * Exit 1 on hard failures (missing images, unknown registry ASINs).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AMAZON_INLINE_IMAGE_BY_ASIN } from '../src/lib/amazon-inline-image-map.mjs';
import {
  allCuratedAsins,
  BOTTOM_STRIP_PICKS,
  HOMEPAGE_COMPARE_PICKS,
} from '../src/lib/site-amazon-registry.mjs';
import { TOPIC_PICKS } from '../src/lib/amazon-topic-picks.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsDir = path.join(__dirname, '..', 'src', 'content', 'products');
const UA = { 'User-Agent': 'RefillWatchAsinVerify/1.0' };

function collectTopicPickAsins() {
  const set = new Set();
  for (const picks of Object.values(TOPIC_PICKS)) {
    for (const pick of picks) set.add(String(pick.asin).toUpperCase());
  }
  return set;
}

function collectRegistryAsins() {
  return allCuratedAsins();
}

async function probeImage(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', headers: UA, redirect: 'follow' });
    const len = Number(res.headers.get('content-length') || 0);
    const type = res.headers.get('content-type') || '';
    return res.ok && len >= 512 && type.includes('image');
  } catch {
    return false;
  }
}

async function keepaLookup(asins, apiKey) {
  const url = `https://api.keepa.com/product?key=${apiKey}&domain=1&asin=${asins.join(',')}&stats=0`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Keepa HTTP ${res.status}`);
  const data = await res.json();
  const byAsin = new Map();
  for (const p of data.products || []) {
    if (p?.asin) byAsin.set(p.asin.toUpperCase(), p);
  }
  return byAsin;
}

function parseProductAsins() {
  const rows = [];
  for (const file of fs.readdirSync(productsDir).filter((f) => f.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(productsDir, file), 'utf8');
    const status = (raw.match(/^status:\s*(\S+)/m) || [])[1] || '';
    const asin = (raw.match(/^asin:\s*([A-Z0-9]{10})/im) || [])[1] || '';
    const title = (raw.match(/^title:\s*["']?([^"'\n]+)/im) || [])[1] || file;
    if (status === 'published' && asin) rows.push({ asin: asin.toUpperCase(), title, file });
  }
  return rows;
}

const OFF_NICHE =
  /cast iron|skillet|soldering|estradiol|paroxetine|estrogen|toner cartridge|ink cartridge|veozah|hakko|fanttik|yihua|wep-/i;

async function main() {
  const registry = collectRegistryAsins();
  const topic = collectTopicPickAsins();
  const required = new Set([...registry, ...topic]);
  const failures = [];
  const warnings = [];

  console.log(`Curated ASINs to verify: ${required.size}`);
  console.log(`  Registry homepage: ${HOMEPAGE_COMPARE_PICKS.length}`);
  console.log(`  Registry bottom strip: ${BOTTOM_STRIP_PICKS.length}`);
  console.log(`  Topic pick pool: ${topic.size}`);

  for (const asin of required) {
    const img = AMAZON_INLINE_IMAGE_BY_ASIN[asin];
    if (!img) {
      failures.push(`${asin}: missing from amazon-inline-image-map.mjs`);
      continue;
    }
    const ok = await probeImage(img);
    if (!ok) warnings.push(`${asin}: image URL not reachable (${img})`);
  }

  const published = parseProductAsins();
  const offNichePublished = published.filter(
    (p) => OFF_NICHE.test(p.title) || OFF_NICHE.test(p.file),
  );
  if (offNichePublished.length) {
    warnings.push(
      `${offNichePublished.length} published /products/ entries are off-niche (cast iron, pharma, soldering, etc.) — archive or set status: draft`,
    );
    for (const p of offNichePublished.slice(0, 5)) {
      warnings.push(`  off-niche: ${p.asin} ${p.title.slice(0, 48)}`);
    }
  }

  const apiKey = process.env.KEEPA_API_KEY?.trim();
  if (apiKey) {
    const batch = [...required];
    const byAsin = await keepaLookup(batch, apiKey);
    for (const asin of batch) {
      const p = byAsin.get(asin);
      if (!p) failures.push(`${asin}: Keepa returned no product`);
      else if (!p.title) warnings.push(`${asin}: Keepa product has empty title`);
    }
    console.log('Keepa: OK');
  } else {
    console.log('Keepa: skipped (set KEEPA_API_KEY for live ASIN health checks)');
  }

  if (warnings.length) {
    console.log('\nWarnings:');
    for (const w of warnings) console.log(`  ⚠ ${w}`);
  }

  if (failures.length) {
    console.error('\nFailures:');
    for (const f of failures) console.error(`  ✗ ${f}`);
    process.exit(1);
  }

  console.log('\nverify-amazon-asins: PASS');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
