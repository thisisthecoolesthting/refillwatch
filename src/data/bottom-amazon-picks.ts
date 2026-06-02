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
    asin: 'B082Y7X9H5',
    title: 'E-Z Ink 252XL Combo (Epson)',
    subtitle: 'Printer ink is a classic price trap — compare $/page before you restock.',
    priceLabel: 'From ~$28',
    badge: 'Ink & toner',
    imageUrl: 'https://m.media-amazon.com/images/I/41KzfM5S8ML.jpg',
  },
  {
    asin: 'B00NQ1CLTI',
    title: 'Brother HL-L2300D Laser Printer',
    subtitle: 'Laser cost-per-page beats inkjet “starter” cartridges for document-heavy homes.',
    priceLabel: 'From ~$120',
    badge: 'Office / home',
    imageUrl: 'https://m.media-amazon.com/images/I/41Em5XfxbwL.jpg',
  },
  {
    asin: 'B00HHQX0BQ',
    title: 'Folgers Classic Roast — 48 oz',
    subtitle: 'Bulk coffee vs. pods — track per-ounce hikes before your morning habit gets expensive.',
    priceLabel: 'From ~$14',
    badge: 'Big-ticket',
    imageUrl: 'https://m.media-amazon.com/images/I/81RK4MPMtHL.jpg',
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
