/**
 * Build-time safety net: fix dead Amazon widget images and orphan card fragments.
 */
import { visit } from 'unist-util-visit';

function amazonImage(asin) {
  return `https://m.media-amazon.com/images/P/${String(asin).toUpperCase()}.01._SL500_.jpg`;
}

export function rehypeFixAmazonInline() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img' && node.properties?.src) {
        const src = String(node.properties.src);
        const m = src.match(/ASIN=([A-Z0-9]{10})/i);
        if (m && src.includes('amazon-adsystem')) {
          node.properties.src = amazonImage(m[1]);
        }
      }

      // Merge orphan div after <p><a><img></a></p> pattern (legacy markdown split)
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
