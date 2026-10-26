// Build-time Amazon stripper (active when disableAmazon flag is true).
// - drops inline Amazon product cards
// - unwraps <a> to amazon.* / amzn.to / tag=...-2x / internal /products/* (keeps text)
// - removes <img> hosted on Amazon; prunes elements left empty
const AMAZON_HREF = /(^|\/\/)([a-z0-9.-]*\.)?(amazon\.[a-z.]+|amzn\.to|amzn\.com|a\.co|amazon-adsystem\.com)(\/|$|\?)|[?&]tag=[a-z0-9-]+-2[0-9]/i;
const AMAZON_IMG = /amazon\.|amazon-adsystem|images-amazon|media-amazon/i;
const PRODUCT_HREF = /^(https?:\/\/(www\.)?[a-z0-9.-]+)?\/products(\/|$|\?|#)/i;

const cls = (n) => {
  const c = n.properties && n.properties.className;
  return Array.isArray(c) ? c.join(' ') : String(c || '');
};
const isEl = (n) => n && n.type === 'element';
const isStripLink = (n) =>
  isEl(n) && n.tagName === 'a' && typeof n.properties?.href === 'string' &&
  (AMAZON_HREF.test(n.properties.href) || PRODUCT_HREF.test(n.properties.href));
const isAmazonImg = (n) =>
  isEl(n) && n.tagName === 'img' && AMAZON_IMG.test(String(n.properties?.src || ''));
const isCard = (n) => isEl(n) && /amazon-inline-card|product-link-pair|amazon-cta/.test(cls(n));

const AMZ_ANY = /amazon|amzn\.to|amzn\.com|[?&]tag=[a-z0-9-]+-2[0-9]/i;
const meaningful = (n) => {
  if (n.type === 'raw') return n.value.trim().length > 0;
  if (n.type === 'text') return n.value.trim().length > 0;
  if (n.type !== 'element') return false;
  if (['img', 'hr', 'table', 'svg', 'iframe', 'video'].includes(n.tagName)) return true;
  return (n.children || []).some(meaningful);
};
const PRUNABLE = new Set(['p', 'div', 'span', 'li', 'figure', 'strong', 'em', 'center']);

function walk(node) {
  if (!node || !Array.isArray(node.children)) return;
  const out = [];
  let closePending = 0;
  for (const child of node.children) {
    if (child.type === 'raw') {
      const v = child.value;
      if (/amazon-inline-card|amazon-adsystem|media-amazon|images-amazon/i.test(v)) continue;
      if (/^\s*<a\s/i.test(v) && AMZ_ANY.test(v)) {
        if (!/<\/a>/i.test(v)) closePending++;
        continue;
      }
      if (closePending && /^\s*<\/a>\s*$/i.test(v)) { closePending--; continue; }
    }
    if (isCard(child)) continue;
    if (isAmazonImg(child)) continue;
    if (isStripLink(child)) {
      walk(child);
      out.push(...child.children);
      continue;
    }
    walk(child);
    if (isEl(child) && PRUNABLE.has(child.tagName) && !meaningful(child)) continue;
    out.push(child);
  }
  node.children = out;
}

export default function rehypeStripAmazon() {
  return (tree) => walk(tree);
}
