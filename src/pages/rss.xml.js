import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const products = await getCollection('products', ({ data }) => data.status === 'published');
  const pillars = await getCollection('pillars', ({ data }) => data.status === 'published');
  const articles = await getCollection('articles', ({ data }) => data.status === 'published');

  const items = [
    ...pillars.map((p) => ({
      title: p.data.title,
      link: `/pillars/${p.slug}/`,
      pubDate: p.data.publishedAt,
      description: p.data.excerpt,
    })),
    ...articles.map((a) => ({
      title: a.data.title,
      link: `/articles/${a.slug}/`,
      pubDate: a.data.publishedAt,
      description: a.data.excerpt,
    })),
    ...products.map((p) => ({
      title: p.data.title,
      link: `/products/${p.data.slug}/`,
      pubDate: p.data.lastSeen ? new Date(p.data.lastSeen) : new Date(),
      description: p.data.metaDescription || `Review: ${p.data.title}`,
    })),
  ].sort((a, b) => +new Date(b.pubDate) - +new Date(a.pubDate));

  return rss({
    title: 'Second Spring Club',
    description: 'Honest reviews for women in perimenopause and beyond.',
    site: context.site,
    items,
  });
}
