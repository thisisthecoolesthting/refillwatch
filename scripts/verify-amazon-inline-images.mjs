/**

 * HEAD/GET-check curated Amazon image URLs (must be >512 bytes, image/*).

 * Scans articles for dead P/ASIN src patterns.

 * Run: node scripts/verify-amazon-inline-images.mjs

 */

import fs from 'node:fs';

import path from 'node:path';

import { fileURLToPath } from 'node:url';

import { AMAZON_INLINE_IMAGE_BY_ASIN } from '../src/lib/amazon-inline-image-map.mjs';



const __dirname = path.dirname(fileURLToPath(import.meta.url));

const articlesDir = path.join(__dirname, '..', 'src', 'content', 'articles');

const MIN = 512;

const UA = { 'User-Agent': 'RefillWatchVerify/1.0' };



async function probe(url, method) {

  const res = await fetch(url, { method, headers: UA, redirect: 'follow' });

  const type = res.headers.get('content-type') || '';

  let len = Number(res.headers.get('content-length') || 0);

  if (method === 'GET' && (!len || len < MIN) && res.ok) {

    const buf = await res.arrayBuffer();

    len = buf.byteLength;

  }

  const ok = res.ok && len >= MIN && type.includes('image');

  return { ok, len, type, status: res.status };

}



async function check(url) {

  try {

    const head = await probe(url, 'HEAD');

    if (head.ok) return head;

    const get = await probe(url, 'GET');

    return get;

  } catch (e) {

    return { ok: false, error: String(e) };

  }

}



let bad = 0;

console.log('--- Map URLs ---');

for (const [asin, url] of Object.entries(AMAZON_INLINE_IMAGE_BY_ASIN)) {

  const r = await check(url);

  if (!r.ok) {

    bad++;

    console.log('FAIL', asin, url, r);

  } else {

    console.log('OK', asin, r.len, r.type);

  }

}



console.log('--- Article scan (P/ASIN dead pattern) ---');

const deadRe = /media-amazon\.com\/images\/P\/[A-Z0-9]{10}/i;

const widgetRe = /amazon-adsystem\.com\/widgets/i;

let articleBad = 0;

for (const f of fs.readdirSync(articlesDir).filter((n) => n.endsWith('.md'))) {

  const text = fs.readFileSync(path.join(articlesDir, f), 'utf8');

  if (deadRe.test(text) || widgetRe.test(text)) {

    articleBad++;

    console.log('FAIL article', f, deadRe.test(text) ? 'P/ASIN' : '', widgetRe.test(text) ? 'widget' : '');

  }

}

if (articleBad) bad += articleBad;



console.log(

  `Summary: ${Object.keys(AMAZON_INLINE_IMAGE_BY_ASIN).length} map entries, ${articleBad} articles with dead patterns, ${bad} total failures`,

);

process.exit(bad > 0 ? 1 : 0);


