import type { BottomAmazonPick } from '@/utils/amazon-affiliate';

/**
 * Curated high-AOV household picks (bulk refills, ink, appliances).
 * Shown site-wide at the bottom of every page; merged with /products/ catalog.
 */
export const BOTTOM_AMAZON_PICKS: BottomAmazonPick[] = [
  {
    asin: 'B00C2O7C7O',
    title: 'Scott 1000 Sheets Per Roll — 36 Rolls',
    subtitle: 'Bulk toilet paper — track cost-per-sheet vs. “mega” 2-ply packs.',
    priceLabel: 'From ~$29',
    badge: 'Bulk staple',
    imageUrl: 'https://m.media-amazon.com/images/I/515nKDNSU5L.jpg',
  },
  {
    asin: 'B07QR6Z1JB',
    title: 'Tide PODS Laundry Detergent — 112 Count',
    subtitle: 'Family-size tub — compare $/load before shrinkflation shrinks the count.',
    priceLabel: 'From ~$24',
    badge: 'High volume',
    imageUrl: 'https://m.media-amazon.com/images/I/51OpfxMruwL.jpg',
  },
  {
    asin: 'B07D4G66DD',
    title: 'HP 67XL Black + Tri-Color Ink Cartridges',
    subtitle: 'Printer ink is a classic price trap — XL yields lower cost per page.',
    priceLabel: 'From ~$55',
    badge: 'Ink & toner',
    imageUrl: 'https://m.media-amazon.com/images/I/71Y8bRjqGZL.jpg',
  },
  {
    asin: 'B09JZKX7MZ',
    title: 'Brother TN760 High-Yield Toner',
    subtitle: 'Laser toner in bulk yield — beats buying “starter” cartridges every month.',
    priceLabel: 'From ~$52',
    badge: 'Office / home',
  },
  {
    asin: 'B08J8F8GF9',
    title: 'Keurig K-Classic Coffee Maker',
    subtitle: 'Pod machines lock you into K-Cup pricing — pair with refillable cups below.',
    priceLabel: 'From ~$90',
    badge: 'Big-ticket',
  },
  {
    asin: 'B082TRQ5Y1',
    title: 'Blueland Clean Essentials Starter Kit',
    subtitle: 'Refill tablets + forever bottles — cuts repeat plastic cleaner spend.',
    priceLabel: 'From ~$39',
    badge: 'Refill swap',
  },
  {
    asin: 'B01N5IB20Q',
    title: 'Amazon Basics AA Batteries — 48 Pack',
    subtitle: 'Benchmark bulk batteries — cost-per-cell vs. name brands.',
    priceLabel: 'From ~$16',
    badge: 'Repeat buy',
    imageUrl: 'https://m.media-amazon.com/images/I/41VtUi6pMDL.jpg',
  },
  {
    asin: 'B000WKWMWS',
    title: 'Dawn Ultra Dish Soap — 75 oz (2-Pack)',
    subtitle: 'Concentrated dish soap twin pack — watch per-ounce hikes on “new” bottles.',
    priceLabel: 'From ~$18',
    badge: 'Kitchen staple',
    imageUrl: 'https://m.media-amazon.com/images/I/51rRWjWC7bL.jpg',
  },
];
