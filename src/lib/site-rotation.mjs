/**
 * Layer 1 (site/niche) + Layer 3 (pin template rotation).
 * Layer 2 (topic picks) stays in amazon-topic-picks.mjs.
 *
 * At spawn: copy this file from templates/ssc-site and set SITE_MONETIZATION
 * from niche_specs/<slug>.json monetization block.
 */
import spawnHome from '../data/spawn-home.json' with { type: 'json' };

/** @type {{ slug: string, defaultTopic: string, associateTag: string, pinTemplates: string[], rotateBy: string }} */
export const SITE_MONETIZATION = {
  slug: 'refillwatch',
  defaultTopic: 'household-staples',
  associateTag: 'refillwatch-20',
  pinTemplates: [
    'watchdog-alert',
    'savings-checklist',
    'comparison-table',
    'product-strip',
  ],
  rotateBy: 'article_slug',
};

/** Optional override from spawn-home when niche_spec adds monetization. */
export function loadSiteMonetizationFromSpawn() {
  const m = /** @type {Record<string, unknown>} */ (spawnHome).monetization;
  if (!m || typeof m !== 'object') return SITE_MONETIZATION;
  const pin = /** @type {Record<string, unknown>} */ (m.pinterest || {});
  return {
    ...SITE_MONETIZATION,
    defaultTopic:
      typeof m.default_topic === 'string' ? m.default_topic : SITE_MONETIZATION.defaultTopic,
    associateTag:
      typeof m.amazon_associate_tag === 'string'
        ? m.amazon_associate_tag
        : SITE_MONETIZATION.associateTag,
    pinTemplates: Array.isArray(pin.pin_templates)
      ? pin.pin_templates.map(String)
      : SITE_MONETIZATION.pinTemplates,
    rotateBy: typeof pin.rotate_by === 'string' ? pin.rotate_by : SITE_MONETIZATION.rotateBy,
  };
}

const ACTIVE = loadSiteMonetizationFromSpawn();

/**
 * Stable template id for an article (Layer 3).
 * @param {string} articleSlug
 * @param {number} [variant] — 0 = default pin; 1..n for extra pin creatives per post
 */
export function pinTemplateIndex(articleSlug, variant = 0) {
  const templates = ACTIVE.pinTemplates;
  if (!templates.length) return 0;
  const key = `${articleSlug}:${variant}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % templates.length;
}

export function pinTemplateId(articleSlug, variant = 0) {
  return ACTIVE.pinTemplates[pinTemplateIndex(articleSlug, variant)] || 'default';
}

/** Fallback topic when classifyArticleTopic finds no keyword match (Layer 1 → 2 bridge). */
export function siteDefaultTopic() {
  return ACTIVE.defaultTopic;
}

export function siteSlug() {
  return ACTIVE.slug;
}
