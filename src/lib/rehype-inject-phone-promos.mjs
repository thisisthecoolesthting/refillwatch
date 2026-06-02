/**
 * Inserts lightweight text phone-case promos after selected h2s (no image ad weight).
 */
import { CASE_AD_STORES } from '../data/case-ad-stores.ts';

const AFF = 'refillwatch';

/** After the 2nd, 4th, and 6th h2 (skip title-area noise). */
const INJECT_ON_H2 = new Set([2, 4, 6]);

function miniPromoElement(slot) {
  const store = CASE_AD_STORES[slot % CASE_AD_STORES.length];
  const href = `https://${store.domain}/?utm_source=${AFF}&utm_medium=cross_promo_text&utm_campaign=15off&utm_content=longform-mid-${slot}_${store.slug}`;

  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['article-mid-phone-promo', 'not-prose'] },
    children: [
      {
        type: 'element',
        tagName: 'p',
        properties: { className: ['article-mid-phone-promo__eyebrow'] },
        children: [{ type: 'text', value: 'Phone cases · 15% off first order' }],
      },
      {
        type: 'element',
        tagName: 'a',
        properties: {
          href,
          className: ['article-mid-phone-promo__link'],
          rel: ['noopener', 'sponsored'],
          target: '_blank',
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['article-mid-phone-promo__name'] },
            children: [{ type: 'text', value: store.name }],
          },
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['article-mid-phone-promo__tag'] },
            children: [{ type: 'text', value: `${store.tagline} Code ${store.code}` }],
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
      if (INJECT_ON_H2.has(h2Count)) {
        next.push(miniPromoElement(h2Count));
      }
    }
  }

  node.children = next;
}

export function rehypeInjectPhonePromos() {
  return (tree) => {
    walkInsert(tree);
  };
}
