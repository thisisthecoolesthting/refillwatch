/**
 * Curated Amazon picks for Top Picks expansion and mid-article rehype injection.
 * ASINs must exist in amazon-inline-image-map.mjs (verify script).
 */
import { amazonInlineImageUrl } from './amazon-inline-image-map.mjs';

export const ASSOCIATE_TAG = 'refillwatch-20';

/** Default refill/eco picks (rotate for mid-article slots). */
export const AMAZON_PICK_CATALOG = [
  {
    asin: 'B07LDB5GLB',
    title: 'Ethique Eco-Friendly Shampoo Bar',
    desc: 'Solid shampoo replacing 3 plastic bottles—gentle lather, works on color-treated hair.',
  },
  {
    asin: 'B089QRFMZF',
    title: 'HiBAR Solid Shampoo + Conditioner Set',
    desc: 'Separate solid bars with salon-quality ingredients, zero plastic packaging.',
  },
  {
    asin: 'B082TRQ5Y1',
    title: 'J.R.LIGGETT Shampoo Bar',
    desc: 'One bar replaces multiple liquid bottles—travel-friendly and plastic-free.',
  },
  {
    asin: 'B086RYBBRH',
    title: 'Ethique Conditioner Bar',
    desc: 'Solid conditioner bar that pairs with shampoo bars for a full plastic-free routine.',
  },
  {
    asin: 'B07HNQXHTP',
    title: 'Georganics Natural Toothpaste',
    desc: 'Fluoride-free paste in glass jar—refillable-friendly oral care swap.',
  },
  {
    asin: 'B00BEYLTKY',
    title: 'Dr. Bronner\'s Pure-Castile Soap',
    desc: 'Concentrated refillable cleaner for body, home, and laundry dilutions.',
  },
];

/** Two extra cards appended to ## Top Picks blocks that still end at 3 cards. */
export const TOP_PICKS_EXTRA = AMAZON_PICK_CATALOG.slice(0, 2);

/** Mid-article: one card after these h2 indices (1-based, skip title). */
export const MID_PICK_H2_INDICES = new Set([2, 4, 6]);

export function amazonPickHref(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${ASSOCIATE_TAG}`;
}

export function amazonPickCardHtml(pick, { compact = false } = {}) {
  const href = amazonPickHref(pick.asin);
  const img = amazonInlineImageUrl(pick.asin);
  const alt = pick.title.replace(/"/g, '&quot;');
  const compactClass = compact ? ' amazon-inline-card--mid' : '';
  return `<div class="amazon-inline-card not-prose${compactClass}">
<a class="amazon-inline-card__link" href="${href}" rel="nofollow sponsored noopener" target="_blank">
<img class="amazon-inline-card__img" src="${img}" alt="${alt}" width="80" height="80" loading="lazy" decoding="async">
<div class="amazon-inline-card__body">
<strong class="amazon-inline-card__title">${pick.title}</strong>
<span class="amazon-inline-card__desc">${pick.desc}</span>
<span class="amazon-inline-card__cta">Shop on Amazon →</span>
</div>
</a>
</div>`;
}
