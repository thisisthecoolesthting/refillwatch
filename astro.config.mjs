import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { rehypeFixAmazonInline } from './src/lib/rehype-fix-amazon-inline.mjs';
import { rehypeInjectAmazonMidPicks } from './src/lib/rehype-inject-amazon-mid-picks.mjs';
import { rehypeInjectPhonePromos } from './src/lib/rehype-inject-phone-promos.mjs';

// Sitemap temporarily disabled — @astrojs/sitemap 3.x crashes with
// our current route set. Re-enable once upstream ships a fix or we
// build a custom sitemap via pages/sitemap.xml.ts.
// import sitemap from '@astrojs/sitemap';

// Custom rehype plugin:
// For every anchor whose href matches /products/<slug>/ we append an
// inline "Check on Amazon →" pill button that links directly to Amazon
// with our associate tag. Works at build time so authors don't need to
// remember to add affiliate CTAs in markdown.
const ASSOCIATE_TAG = process.env.PUBLIC_ASSOCIATE_TAG || 'refillwatch-20';

function rehypeAugmentProductLinks() {
  const productHrefRe = /^\/products\/([a-z0-9]+)-/i;

  function walk(node) {
    if (!node || !Array.isArray(node.children)) return;
    const out = [];
    for (const child of node.children) {
      if (
        child &&
        child.type === 'element' &&
        child.tagName === 'a' &&
        child.properties &&
        typeof child.properties.href === 'string'
      ) {
        const m = child.properties.href.match(productHrefRe);
        if (m) {
          const asin = m[1].toUpperCase();
          const amazonHref =
            'https://www.amazon.com/dp/' + asin + '?tag=' + ASSOCIATE_TAG + '&linkCode=ll1';

          out.push({
            type: 'element',
            tagName: 'span',
            properties: { className: ['product-link-pair'] },
            children: [
              child,
              {
                type: 'element',
                tagName: 'a',
                properties: {
                  href: amazonHref,
                  rel: 'nofollow sponsored noopener',
                  target: '_blank',
                  className: ['amazon-cta-inline'],
                },
                children: [{ type: 'text', value: 'Check on Amazon →' }],
              },
            ],
          });
          continue;
        }
      }
      walk(child);
      out.push(child);
    }
    node.children = out;
  }

  return (tree) => walk(tree);
}

export default defineConfig({
  site: 'https://refillwatch.org',
  trailingSlash: 'never',
  integrations: [
    tailwind(),
    // sitemap(),
  ],
  build: {
    format: 'directory',
  },
  markdown: {
    rehypePlugins: [
      rehypeFixAmazonInline,
      rehypeAugmentProductLinks,
      rehypeInjectAmazonMidPicks,
      rehypeInjectPhonePromos,
    ],
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
