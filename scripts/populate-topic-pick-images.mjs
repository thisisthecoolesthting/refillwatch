/**
 * Fetch m.media-amazon.com/images/I/* URLs for all topic-pick ASINs
 * and print JSON for amazon-inline-image-map.mjs merge.
 */
const ASINS = [
  'B0973GJNCC', 'B0BC244Z4W', 'B0CLBF6PLW', 'B07LDB5GLB', 'B089QRFMZF',
  'B082TRQ5Y1', 'B086RYBBRH', 'B07HNQXHTP', 'B07NM4ZM3Z', 'B00BEYLTKY',
  'B00120V7VA', 'B00120VWKS', 'B01N7VKWVO', 'B00YBXVLWK',
];

const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; RefillWatchBot/1.0)' };

async function fetchImage(asin) {
  const url = `https://www.amazon.com/dp/${asin}`;
  const res = await fetch(url, { headers: UA, redirect: 'follow' });
  const html = await res.text();
  const m = html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+._%-]+\.jpg/i);
  return m ? m[0] : null;
}

const out = {};
for (const asin of ASINS) {
  try {
    const img = await fetchImage(asin);
    out[asin] = img;
    console.log(asin, img ? 'OK' : 'FAIL');
    await new Promise((r) => setTimeout(r, 800));
  } catch (e) {
    console.log(asin, 'ERR', e.message);
    out[asin] = null;
  }
}
console.log('\n--- MAP ENTRIES ---');
for (const [asin, url] of Object.entries(out)) {
  if (url) console.log(`  "${asin}": '${url}',`);
}
