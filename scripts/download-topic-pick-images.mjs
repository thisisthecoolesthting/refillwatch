import fs from "node:fs";
import path from "node:path";
import { AMAZON_INLINE_IMAGE_BY_ASIN } from '../src/lib/amazon-inline-image-map.mjs';
const out = path.join("public","images","amazon-picks");
fs.mkdirSync(out,{recursive:true});
const topic = ["B0973GJNCC","B0BC244Z4W","B0CLBF6PLW","B07571LXYD","B07VQC79W4","B001W2K51O","B0DKPHHP5G","B084ZNXBN8","B0DX7JF5HR","B07FQ46R24","B00120VWJ0","B00HNSJSX2","B0126LMDFK"];
for (const asin of topic) {
  const url = AMAZON_INLINE_IMAGE_BY_ASIN[asin];
  if (!url) { console.log(asin, "NO_MAP"); continue; }
  const res = await fetch(url);
  if (!res.ok) { console.log(asin, "FAIL", res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(out, `${asin}.jpg`), buf);
  console.log(asin, "OK", buf.length);
}
