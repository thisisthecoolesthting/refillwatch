/** Product image URLs — curated catalog URL first, ASIN fallback, optional local asset, SVG last. */

import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

const FALLBACK_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>` +
      `<rect width='120' height='120' fill='#EBE6DF'/>` +
      `<g fill='none' stroke='#64748B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'>` +
      `<rect x='28' y='34' width='64' height='52' rx='6'/>` +
      `<circle cx='46' cy='52' r='5'/>` +
      `<path d='m34 78 16-16 14 12 10-8 12 14'/>` +
      `</g></svg>`,
  );

const MIN_IMAGE_BYTES = 512;

export function localProductImagePath(slug: string): string {
  return `/images/products/${slug}.jpg`;
}

/** Prefer curated images/I map — P/ASIN hotlinks return a 43-byte GIF. */
const AMAZON_I_BY_ASIN: Record<string, string> = {
  B07LDB5GLB: 'https://m.media-amazon.com/images/I/41MhA9lNKAL.jpg',
  B089QRFMZF: 'https://m.media-amazon.com/images/I/519-Mz2WSeL.jpg',
  B082TRQ5Y1: 'https://m.media-amazon.com/images/I/51Z6zkSyVKL.jpg',
  B086RYBBRH: 'https://m.media-amazon.com/images/I/71wfafy0cXL.jpg',
  B07HNQXHTP: 'https://m.media-amazon.com/images/I/41KzfM5S8ML.jpg',
  B00120V7VA: 'https://m.media-amazon.com/images/I/414wogLMXDL.jpg',
  B00120VWKS: 'https://m.media-amazon.com/images/I/414wogLMXDL.jpg',
  B00BEYLTKY: 'https://m.media-amazon.com/images/I/71St0Xv0ZPL.jpg',
  B00YBXVLWK: 'https://m.media-amazon.com/images/I/81C8iFvxnfL.jpg',
  B01N7VKWVO: 'https://m.media-amazon.com/images/I/81fdrmuMVFL.jpg',
  B07NM4ZM3Z: 'https://m.media-amazon.com/images/I/71yDGNi8wXL.jpg',
  B0973GJNCC: 'https://m.media-amazon.com/images/I/21hqL-BxKnL.jpg',
  B0BC244Z4W: 'https://m.media-amazon.com/images/I/31vJmG0wQZL.jpg',
  B0CLBF6PLW: 'https://m.media-amazon.com/images/I/41sysnrYwhL.jpg',
};

export function amazonAsinImageUrl(asin: string): string {
  const id = asin.trim().toUpperCase();
  if (!id) return FALLBACK_SVG;
  return AMAZON_I_BY_ASIN[id] || `/images/amazon-picks/${id}.jpg`;
}

/** Prefer m.media-amazon.com — survives hotlink better than legacy ssl-images host. */
export function normalizeAmazonImageUrl(url: string): string {
  const trimmed = url.trim();
  const match = trimmed.match(/\/images\/I\/([^/?]+)/i);
  if (match?.[1]) return `https://m.media-amazon.com/images/I/${match[1]}`;
  return trimmed.replace(/images-na\.ssl-images-amazon\.com/i, 'm.media-amazon.com');
}

export function productImageCandidates(
  slug: string,
  asin: string,
  imageUrl?: string | null,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (candidate?: string | null) => {
    const value = (candidate ?? '').trim();
    if (!value || seen.has(value)) return;
    seen.add(value);
    out.push(value);
  };

  if (imageUrl?.trim()) {
    add(normalizeAmazonImageUrl(imageUrl));
    add(imageUrl.trim());
  }
  if (asin?.trim()) add(amazonAsinImageUrl(asin));
  add(localProductImagePath(slug));
  add(FALLBACK_SVG);
  return out;
}

function localFileOk(publicRoot: string, src: string): boolean {
  const full = path.join(publicRoot, src.replace(/^\//, ''));
  if (!existsSync(full)) return false;
  try {
    return statSync(full).size >= MIN_IMAGE_BYTES;
  } catch {
    return false;
  }
}

async function remoteUrlOk(url: string): Promise<boolean> {
  if (url.startsWith('data:')) return true;
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'RefillWatchBuild/1.0' },
      redirect: 'follow',
    });
    if (!res.ok) return false;
    const len = Number(res.headers.get('content-length') || 0);
    return len >= MIN_IMAGE_BYTES;
  } catch {
    return false;
  }
}

/** Pick the first candidate that exists locally or responds with a real image body. */
export async function resolveProductImageSources(
  slug: string,
  asin: string,
  imageUrl: string | null | undefined,
  publicRoot: string,
): Promise<{ primary: string; fallbacks: string[] }> {
  const candidates = productImageCandidates(slug, asin, imageUrl);
  const valid: string[] = [];

  for (const src of candidates) {
    if (src.startsWith('/images/')) {
      if (localFileOk(publicRoot, src)) valid.push(src);
      continue;
    }
    if (src.startsWith('data:')) {
      valid.push(src);
      continue;
    }
    if (await remoteUrlOk(src)) valid.push(src);
  }

  if (!valid.length) {
    return { primary: FALLBACK_SVG, fallbacks: [] };
  }

  return { primary: valid[0], fallbacks: valid.slice(1) };
}

export function primaryProductImage(
  slug: string,
  asin: string,
  imageUrl?: string | null,
): string {
  return productImageCandidates(slug, asin, imageUrl)[0] ?? FALLBACK_SVG;
}

export { FALLBACK_SVG, MIN_IMAGE_BYTES };
