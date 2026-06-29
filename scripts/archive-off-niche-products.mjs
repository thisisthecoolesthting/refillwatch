/**
 * Set status: draft on spawn-catalog products that do not match RefillWatch niche.
 * Safe to re-run; only touches published off-niche entries.
 *
 * Run: node scripts/archive-off-niche-products.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsDir = path.join(__dirname, '..', 'src', 'content', 'products');

const OFF_NICHE =
  /cast iron|skillet|soldering|estradiol|paroxetine|estrogen|toner cartridge|ink cartridge|veozah|solder|hakko|fanttik|yihua|wep-/i;

let archived = 0;
for (const file of fs.readdirSync(productsDir).filter((f) => f.endsWith('.md'))) {
  const fp = path.join(productsDir, file);
  let raw = fs.readFileSync(fp, 'utf8');
  if (!/^status:\s*published/m.test(raw)) continue;
  const title = (raw.match(/^title:\s*["']?([^"'\n]+)/im) || [])[1] || '';
  if (!OFF_NICHE.test(title) && !OFF_NICHE.test(file)) continue;
  raw = raw.replace(/^status:\s*published/m, 'status: draft');
  fs.writeFileSync(fp, raw, 'utf8');
  archived++;
  console.log(`draft: ${file}`);
}
console.log(`\nArchived ${archived} off-niche product(s).`);
