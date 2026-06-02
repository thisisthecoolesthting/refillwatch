/**
 * Build-time: fix dead Amazon P/ASIN images → curated images/I URLs or local pick path.
 */
import { visit } from 'unist-util-visit';
import { rewriteAmazonInlineImgSrc } from './amazon-inline-image-map.mjs';

export function rehypeFixAmazonInline() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img' && node.properties?.src) {
        const src = String(node.properties.src);
        const cls = node.properties.className;
        const isInline =
          (Array.isArray(cls) && cls.includes('amazon-inline-card__img')) ||
          cls === 'amazon-inline-card__img' ||
          src.includes('media-amazon.com') ||
          src.includes('amazon-adsystem');

        if (isInline) {
          node.properties.src = rewriteAmazonInlineImgSrc(src, '');
          node.properties.referrerPolicy = 'no-referrer';
          node.properties.decoding = 'async';
          node.properties.loading = 'lazy';
        }

        const m = src.match(/ASIN=([A-Z0-9]{10})/i);
        if (m && src.includes('amazon-adsystem')) {
          node.properties.src = rewriteAmazonInlineImgSrc(src, `https://www.amazon.com/dp/${m[1]}`);
        }
      }

      if (node.tagName === 'a') {
        const cls = node.properties?.className;
        const isCard =
          (Array.isArray(cls) && cls.includes('amazon-inline-card__link')) ||
          cls === 'amazon-inline-card__link';
        if (isCard && Array.isArray(node.children)) {
          const href = String(node.properties.href || '');
          for (const child of node.children) {
            if (child.tagName === 'img' && child.properties?.src) {
              child.properties.src = rewriteAmazonInlineImgSrc(
                String(child.properties.src),
                href,
              );
              child.properties.referrerPolicy = 'no-referrer';
              child.properties.decoding = 'async';
              child.properties.loading = 'lazy';
            }
          }
        }
      }

      if (
        node.tagName === 'div' &&
        node.properties?.style === 'min-width:0;' &&
        Array.isArray(node.children) &&
        node.children[0]?.tagName === 'a'
      ) {
        node.properties.className = [
          ...(Array.isArray(node.properties.className) ? node.properties.className : []),
          'amazon-inline-card-orphan',
        ];
      }
    });
  };
}
