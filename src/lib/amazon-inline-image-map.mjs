/**
 * Curated m.media-amazon.com/images/I/* URLs.
 * P/ASIN paths return a 43-byte tracking GIF — do not use for <img src>.
 * Update via scripts/verify-amazon-inline-images.mjs (HEAD size check).
 */
export const AMAZON_INLINE_IMAGE_BY_ASIN = {
  B07LDB5GLB: 'https://m.media-amazon.com/images/I/41MhA9lNKAL.jpg',
  B089QRFMZF: 'https://m.media-amazon.com/images/I/519-Mz2WSeL.jpg',
  B082TRQ5Y1: 'https://m.media-amazon.com/images/I/51Z6zkSyVKL.jpg',
  B086RYBBRH: 'https://m.media-amazon.com/images/I/71wfafy0cXL.jpg',
  B07HNQXHTP: 'https://m.media-amazon.com/images/I/41KzfM5S8ML.jpg',
  B00120V7VA: 'https://m.media-amazon.com/images/I/414wogLMXDL.jpg',
  B00120VWKS: 'https://m.media-amazon.com/images/I/414wogLMXDL.jpg',
  B00BEYLTKY: 'https://m.media-amazon.com/images/I/81RK4MPMtHL.jpg',
  B00YBXVLWK: 'https://m.media-amazon.com/images/I/51v8EDjURsL.jpg',
  B01N7VKWVO: 'https://m.media-amazon.com/images/I/81bs7NnNN-L.jpg',
  /* B07NM4ZM3Z listing 404; image is Sea Turtle bamboo 4-pack (pack-of-4 card copy) */
  B07NM4ZM3Z: 'https://m.media-amazon.com/images/I/71FwXGTMvAL.jpg',
  /* Deodorant / sensitive-skin picks (topic-correct) */
  B0973GJNCC: 'https://m.media-amazon.com/images/I/21hqL-BxKnL.jpg',
  B0BC244Z4W: 'https://m.media-amazon.com/images/I/51eE1u7v3BL.jpg',
  B0CLBF6PLW: 'https://m.media-amazon.com/images/I/41sysnrYwhL.jpg',
};

export function amazonInlineImageUrl(asin) {
  const id = String(asin || '').trim().toUpperCase();
  if (!id) return '';
  return (
    AMAZON_INLINE_IMAGE_BY_ASIN[id] ||
    `/images/amazon-picks/${id}.jpg`
  );
}

export function rewriteAmazonInlineImgSrc(src, href) {
  let asin = '';
  const fromSrc = String(src || '').match(/\/P\/([A-Z0-9]{10})\./i);
  if (fromSrc) asin = fromSrc[1];
  if (!asin && href) {
    const fromHref = String(href).match(/\/dp\/([A-Z0-9]{10})/i);
    if (fromHref) asin = fromHref[1];
  }
  if (!asin) return src;
  return amazonInlineImageUrl(asin);
}
