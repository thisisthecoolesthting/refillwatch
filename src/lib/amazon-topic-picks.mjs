/**
 * Topic-aware Amazon pick sets for RefillWatch articles.
 * ASINs must exist in amazon-inline-image-map.mjs.
 */
import { amazonInlineImageUrl } from './amazon-inline-image-map.mjs';
import { siteDefaultTopic } from './site-rotation.mjs';

export const ASSOCIATE_TAG = 'refillwatch-20';

const TOPICS = [
  'deodorant',
  'shampoo',
  'oral',
  'cleaning',
  'printer-ink',
  'pet-food',
  'subscription',
  'razor',
  'water-grocery',
  'personal-care',
  'household-staples',
];

/** @typedef {{ asin: string, title: string, desc: string, cardTitle: string, cardPick: string }} TopicPick */

/** @type {Record<string, TopicPick>} */
const PICK = {
  nativeSensitiveDeo: {
    asin: 'B0973GJNCC',
    title: 'Native Sensitive Deodorant — Cotton & Lily',
    desc: 'Aluminum-free, baking-soda-free stick in plastic-free paperboard—72-hour odor control for sensitive skin.',
    cardTitle: 'Native Sensitive Deodorant — Cotton & Lily',
    cardPick: 'Paperboard stick with no aluminum—our pick for sensitive underarms without plastic waste.',
  },
  nativePlasticFreeDeo: {
    asin: 'B0BC244Z4W',
    title: 'Native Plastic Free Deodorant — Cucumber & Mint',
    desc: 'Compostable paperboard packaging with naturally derived ingredients—no aluminum or parabens.',
    cardTitle: 'Native Plastic Free Deodorant — Cucumber & Mint',
    cardPick: 'Compostable packaging and naturally derived scent—strong everyday deodorant without a plastic case.',
  },
  hibarDeo: {
    asin: 'B0CLBF6PLW',
    title: 'HiBAR Plastic Free Deodorant — Bergamot & Cedar',
    desc: 'Vegan, aluminum-free deodorant in recyclable tubes—plant-based waxes for all-day protection.',
    cardTitle: 'HiBAR Plastic Free Deodorant — Bergamot & Cedar',
    cardPick: 'Plant-based wax formula in minimal packaging—pairs well with their solid hair bars.',
  },
  ethiqueShampoo: {
    asin: 'B07571LXYD',
    title: 'Ethique Heali Kiwi Shampoo Bar',
    desc: 'Solid shampoo replacing 3 plastic bottles—gentle lather, works on color-treated hair.',
    cardTitle: 'Ethique Heali Kiwi Shampoo Bar',
    cardPick: 'One bar replaces multiple liquid bottles—best all-around plastic-free shampoo swap.',
  },
  hibarShampooSet: {
    asin: 'B07VQC79W4',
    title: 'HiBAR Maintain Shampoo + Conditioner Set',
    desc: 'Separate solid bars with salon-quality ingredients, zero plastic packaging.',
    cardTitle: 'HiBAR Maintain Shampoo + Conditioner Set',
    cardPick: 'Matched shampoo and conditioner bars—salon feel without pump bottles.',
  },
  liggettShampoo: {
    asin: 'B001W2K51O',
    title: 'J.R.LIGGETT Shampoo Bar',
    desc: 'One bar replaces multiple liquid bottles—travel-friendly and plastic-free.',
    cardTitle: 'J.R.LIGGETT Shampoo Bar',
    cardPick: 'Classic concentrated bar that lasts—great value per wash vs. liquid refills.',
  },
  ethiqueConditioner: {
    asin: 'B0DKPHHP5G',
    title: 'Ethique Hydrating Conditioner Bar',
    desc: 'Solid conditioner bar that pairs with shampoo bars for a full plastic-free routine.',
    cardTitle: 'Ethique Hydrating Conditioner Bar',
    cardPick: 'Completes a solid hair routine—pairs directly with Ethique shampoo bars.',
  },
  georganicsPaste: {
    asin: 'B084ZNXBN8',
    title: 'Georganics Mineral Toothpaste Powder',
    desc: 'Fluoride-free powder in glass jar—refillable-friendly oral care swap.',
    cardTitle: 'Georganics Mineral Toothpaste Powder',
    cardPick: 'Glass-jar powder you can refill—cuts tube waste without sacrificing clean ingredients.',
  },
  bambooBrush: {
    asin: 'B0DX7JF5HR',
    title: 'Bamboo Switch Biodegradable Toothbrush',
    desc: 'Plant-based bristles, compostable bamboo handle—pack of 4.',
    cardTitle: 'Bamboo Switch Biodegradable Toothbrush (4-Pack)',
    cardPick: 'Four bamboo handles for the price of one plastic brush run—easy oral-care plastic cut.',
  },
  bronnerBar: {
    asin: 'B07FQ46R24',
    title: "Dr. Bronner's Pure-Castile Bar Soap",
    desc: 'Concentrated refillable cleaner for body, home, and laundry dilutions.',
    cardTitle: "Dr. Bronner's Pure-Castile Soap Bar",
    cardPick: 'One concentrated bar dilutes into dozens of cleaners—ultimate refill economy.',
  },
  bronnerLiquidA: {
    asin: 'B00120VWJ0',
    title: "Dr. Bronner's Pure-Castile Liquid Soap",
    desc: 'Mild castile base for DIY hand soap—dilute and refill your own dispenser.',
    cardTitle: "Dr. Bronner's Pure-Castile Liquid Soap",
    cardPick: 'Refill your own pump bottle from one bulk jug—pennies per ounce when diluted.',
  },
  bronnerLiquidB: {
    asin: 'B00120VWJ0',
    title: "Dr. Bronner's Pure-Castile Liquid Soap",
    desc: 'The base for dozens of DIY cleaners, body wash, and floor cleaners—one bottle, 18 uses.',
    cardTitle: "Dr. Bronner's Castile — Bulk Refill Base",
    cardPick: 'Same 18-in-1 concentrate—buy once, refill dispensers for months of household use.',
  },
  bakingSoda: {
    asin: 'B00HNSJSX2',
    title: 'Arm & Hammer Pure Baking Soda 5 lb',
    desc: 'Food-grade baking soda in a large bag—the backbone of most DIY cleaning recipes.',
    cardTitle: 'Arm & Hammer Pure Baking Soda 5 lb',
    cardPick: 'Bulk bag beats tiny boxes—staple for DIY cleaners, deodorizing, and laundry boosts.',
  },
  beesWrap: {
    asin: 'B0126LMDFK',
    title: "Bee's Wrap Beeswax Food Wrap 3-Pack",
    desc: 'Beeswax + organic cotton keeps food fresh, replaces cling film, compostable end-of-life.',
    cardTitle: "Bee's Wrap Beeswax Food Wrap 3-Pack",
    cardPick: 'Reusable wraps replace single-use film—kitchen staple that pays back in weeks.',
  },
};

/** @type {Record<string, TopicPick[]>} */
export const TOPIC_PICKS = {
  deodorant: [
    PICK.nativeSensitiveDeo,
    PICK.nativePlasticFreeDeo,
    PICK.hibarDeo,
    PICK.ethiqueShampoo,
    PICK.georganicsPaste,
  ],
  shampoo: [
    PICK.ethiqueShampoo,
    PICK.hibarShampooSet,
    PICK.liggettShampoo,
    PICK.ethiqueConditioner,
    PICK.hibarDeo,
  ],
  oral: [
    PICK.bambooBrush,
    PICK.georganicsPaste,
    PICK.hibarDeo,
    PICK.nativePlasticFreeDeo,
    PICK.bronnerBar,
  ],
  cleaning: [
    PICK.bronnerBar,
    PICK.bronnerLiquidA,
    PICK.bronnerLiquidB,
    PICK.bakingSoda,
    PICK.beesWrap,
  ],
  'printer-ink': [
    PICK.bronnerLiquidB,
    PICK.bronnerLiquidA,
    PICK.bronnerBar,
    PICK.bakingSoda,
    PICK.beesWrap,
  ],
  'pet-food': [
    PICK.bakingSoda,
    PICK.bronnerLiquidB,
    PICK.bronnerBar,
    PICK.beesWrap,
    PICK.bronnerLiquidA,
  ],
  subscription: [
    PICK.bronnerLiquidB,
    PICK.bakingSoda,
    PICK.ethiqueShampoo,
    PICK.nativeSensitiveDeo,
    PICK.beesWrap,
  ],
  razor: [
    PICK.bronnerBar,
    PICK.bronnerLiquidA,
    PICK.hibarDeo,
    PICK.bambooBrush,
    PICK.ethiqueShampoo,
  ],
  'water-grocery': [
    PICK.bronnerLiquidB,
    PICK.bakingSoda,
    PICK.beesWrap,
    PICK.bronnerLiquidA,
    PICK.bronnerBar,
  ],
  'personal-care': [
    PICK.ethiqueShampoo,
    PICK.hibarShampooSet,
    PICK.georganicsPaste,
    PICK.nativeSensitiveDeo,
    PICK.bambooBrush,
  ],
  'household-staples': [
    PICK.bronnerLiquidB,
    PICK.bakingSoda,
    PICK.bronnerBar,
    PICK.beesWrap,
    PICK.ethiqueShampoo,
  ],
};

const CLASSIFY_RULES = [
  {
    topic: 'deodorant',
    re: /\b(deodorants?|antiperspirants?|underarm|pit paste|pit stick)\b/,
  },
  {
    topic: 'printer-ink',
    re: /\b(printers?|ink cartridges?|ink refills?|toner cartridges?|cartridge gouging)\b|\bink\b/,
  },
  {
    topic: 'subscription',
    re: /\b(subscriptions?|subscribe|auto-?ship|prime member|streaming|membership fees?|recurring)\b/,
  },
  {
    topic: 'pet-food',
    re: /\b(pet foods?|dog foods?|cat foods?|kibble|pet treats?|pet supplies?)\b|\bpet\b/,
  },
  {
    topic: 'razor',
    re: /\b(razors?|shav(e|ing|er)|blade refills?|aftershave|grooming)\b/,
  },
  {
    topic: 'water-grocery',
    re: /\b(water bottles?|bottled water|reusable bottles?|coffee|groceries?|beverages?|hydration)\b|\bwater\b/,
  },
  {
    topic: 'shampoo',
    re: /\b(shampoos?|conditioners?|hair care|hair bars?|hair routines?)\b|\bhair\b/,
  },
  {
    topic: 'oral',
    re: /\b(toothpastes?|mouthwashes?|toothbrushes?|dental|floss|oral care|teeth)\b/,
  },
  {
    topic: 'cleaning',
    re: /\b(laundry|detergents?|dish soaps?|dishwashing|cleaners?|cleaning|concentrates?|castile|disinfect|soap refills?)\b/,
  },
  {
    topic: 'personal-care',
    re: /\b(lotions?|body wash|skin care|skincare|sunscreens?|sanitizers?|personal care|makeup|moisturizers?)\b/,
  },
];

function normalizeSearchText({ slug = '', title = '', subtopic = '', tags = [] } = {}) {
  const tagStr = Array.isArray(tags) ? tags.join(' ') : String(tags || '');
  return `${slug} ${title} ${subtopic} ${tagStr}`.toLowerCase().replace(/[_-]+/g, ' ');
}

/**
 * @param {{ slug?: string, title?: string, subtopic?: string, tags?: string[] | string }} input
 * @returns {typeof TOPICS[number]}
 */
export function classifyArticleTopic(input = {}) {
  const haystack = normalizeSearchText(input);
  for (const { topic, re } of CLASSIFY_RULES) {
    if (re.test(haystack)) return topic;
  }
  return siteDefaultTopic();
}

/**
 * @param {string} topic
 * @returns {TopicPick[]}
 */
export function getTopicPicks(topic) {
  const key = String(topic || '').trim();
  if (TOPIC_PICKS[key]?.length === 5) return TOPIC_PICKS[key];
  return TOPIC_PICKS[siteDefaultTopic()] || TOPIC_PICKS['household-staples'];
}

function escapeAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

export function amazonPickHref(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${ASSOCIATE_TAG}`;
}

/**
 * Extended card HTML: adds data-card-title / data-card-pick on the link when present.
 * @param {TopicPick} pick
 * @param {{ compact?: boolean }} [options]
 */
export function amazonPickCardHtml(pick, { compact = false } = {}) {
  const href = amazonPickHref(pick.asin);
  const img = amazonInlineImageUrl(pick.asin);
  const alt = pick.title.replace(/"/g, '&quot;');
  const compactClass = compact ? ' amazon-inline-card--mid' : '';
  const cardTitleAttr = pick.cardTitle
    ? ` data-card-title="${escapeAttr(pick.cardTitle)}"`
    : '';
  const cardPickAttr = pick.cardPick
    ? ` data-card-pick="${escapeAttr(pick.cardPick)}"`
    : '';
  return `<div class="amazon-inline-card not-prose${compactClass}">
<a class="amazon-inline-card__link" href="${href}" rel="nofollow sponsored noopener" target="_blank"${cardTitleAttr}${cardPickAttr}>
<img class="amazon-inline-card__img" src="${img}" alt="${alt}" width="80" height="80" loading="lazy" decoding="async">
<div class="amazon-inline-card__body">
<strong class="amazon-inline-card__title">${pick.title}</strong>
<span class="amazon-inline-card__desc">${pick.desc}</span>
<span class="amazon-inline-card__cta">Shop on Amazon →</span>
</div>
</a>
</div>`;
}
