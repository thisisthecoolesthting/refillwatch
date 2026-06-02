/** One-off: resolve m.media-amazon.com image URL from /dp/ HTML. */
const asins = process.argv.slice(2);
const UA = { 'User-Agent': 'RefillWatchVerify/1.0' };

for (const asin of asins) {
  const url = `https://www.amazon.com/dp/${asin}`;
  const res = await fetch(url, { headers: UA, redirect: 'follow' });
  const html = await res.text();
  const m = html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+._%-]+\.jpg/i);
  console.log(asin, res.status, m?.[0] ?? 'NO_IMG');
}
