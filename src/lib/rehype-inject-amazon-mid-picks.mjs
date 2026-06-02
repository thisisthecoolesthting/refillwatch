/**
 * Injects compact Amazon inline cards after selected h2s (Pinterest-friendly on-page density).
 */
import {
  AMAZON_PICK_CATALOG,
  MID_PICK_H2_INDICES,
  amazonPickHref,
} from './amazon-pick-catalog.mjs';
import { amazonInlineImageUrl } from './amazon-inline-image-map.mjs';

function pickCardElement(pick) {
  const href = amazonPickHref(pick.asin);
  const src = amazonInlineImageUrl(pick.asin);
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['amazon-inline-card', 'amazon-inline-card--mid', 'not-prose'],
    },
    children: [
      {
        type: 'element',
        tagName: 'a',
        properties: {
          className: ['amazon-inline-card__link'],
          href,
          rel: ['nofollow', 'sponsored', 'noopener'],
          target: '_blank',
        },
        children: [
          {
            type: 'element',
            tagName: 'img',
            properties: {
              className: ['amazon-inline-card__img'],
              src,
              alt: pick.title,
              width: '80',
              height: '80',
              loading: 'lazy',
              decoding: 'async',
            },
          },
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['amazon-inline-card__body'] },
            children: [
              {
                type: 'element',
                tagName: 'strong',
                properties: { className: ['amazon-inline-card__title'] },
                children: [{ type: 'text', value: pick.title }],
              },
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['amazon-inline-card__desc'] },
                children: [{ type: 'text', value: pick.desc }],
              },
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['amazon-inline-card__cta'] },
                children: [{ type: 'text', value: 'Shop on Amazon →' }],
              },
            ],
          },
        ],
      },
    ],
  };
}

function walkInsert(node) {
  if (!node?.children || !Array.isArray(node.children)) return;

  let h2Count = 0;
  const next = [];

  for (const child of node.children) {
    next.push(child);
    walkInsert(child);

    if (child?.type === 'element' && child.tagName === 'h2') {
      h2Count += 1;
      if (MID_PICK_H2_INDICES.has(h2Count)) {
        const pick = AMAZON_PICK_CATALOG[(h2Count - 1) % AMAZON_PICK_CATALOG.length];
        next.push(pickCardElement(pick));
      }
    }
  }

  node.children = next;
}

export function rehypeInjectAmazonMidPicks() {
  return (tree) => {
    walkInsert(tree);
  };
}
