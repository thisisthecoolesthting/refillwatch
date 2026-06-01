/** Product image URLs — local assets first, then Amazon ASIN fallback, then SVG placeholder. */

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

export function localProductImagePath(slug: string): string {
  return `/images/products/${slug}.jpg`;
}

export function amazonAsinImageUrl(asin: string): string {
  return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`;
}

export function productImageCandidates(
  slug: string,
  asin: string,
  imageUrl?: string | null,
): string[] {
  const local = localProductImagePath(slug);
  const candidates: string[] = [local];
  if (imageUrl && imageUrl.trim() && imageUrl.trim() !== local) {
    candidates.push(imageUrl.trim());
  }
  if (asin) candidates.push(amazonAsinImageUrl(asin));
  candidates.push(FALLBACK_SVG);
  return candidates;
}

export function primaryProductImage(
  slug: string,
  asin: string,
  imageUrl?: string | null,
): string {
  return localProductImagePath(slug);
}

export { FALLBACK_SVG };
