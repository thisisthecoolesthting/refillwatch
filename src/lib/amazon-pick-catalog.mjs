/**
 * Legacy re-exports — canonical logic in amazon-topic-picks.mjs + site-rotation.mjs.
 */
export {
  ASSOCIATE_TAG,
  amazonPickHref,
  amazonPickCardHtml,
  getTopicPicks,
} from './amazon-topic-picks.mjs';

/** Mid-article: one card after these h2 indices (1-based, skip title). */
export const MID_PICK_H2_INDICES = new Set([2, 4, 6]);
