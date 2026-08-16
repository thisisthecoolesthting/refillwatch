/** Amazon Associates link helpers for RefillWatch. */

export const DEFAULT_ASSOCIATE_TAG = 'refillwatch-20';

export function amazonAffiliateUrlFromAsin(
  asin: string,
  associateTag = import.meta.env.PUBLIC_ASSOCIATE_TAG ?? DEFAULT_ASSOCIATE_TAG,
): string {
  const id = asin.trim().toUpperCase();
  if (!id) return '#';
  // Amazon Associates retired 2026-08 -- never return a live Amazon URL.
  return '#';
}

export type BottomAmazonPick = {
  asin: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  badge?: string;
  imageUrl?: string;
};
