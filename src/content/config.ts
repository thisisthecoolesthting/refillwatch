// Astro Content Collections schema for RefillWatch.
//
// Four collections:
//   authors   -- named humans who write or edit (E-E-A-T layer)
//   products  -- amazon products reviewed for the watchdog angle
//   pillars   -- long-form authority investigations
//   articles  -- pricing alerts + supporting Q&A
//
// All pieces default to Dana Wolff as editor; override with a specific
// author slug in frontmatter when adding a guest contributor.

import { defineCollection, z } from 'astro:content';

// Coerce null → [] for relatedProducts (some articles have bare `relatedProducts:` in frontmatter)
const relatedProductsField = z.preprocess((v) => (v == null ? [] : v), z.array(z.string())).optional().default([]);

const authors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    credentials: z.string().optional().default(''),
    photoUrl: z.string(),
    shortBio: z.string(),
    joinedAt: z.coerce.date().optional(),
    location: z.string().optional().default(''),
    socials: z.object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      email: z.string().email().optional(),
    }).optional(),
  }),
});

const products = defineCollection({
  type: 'content',
  schema: z.object({
    asin: z.string(),
    title: z.string(),
    seoTitle: z.string().optional().default(''),
    metaDescription: z.string().optional().default(''),
    cardTitle: z.string().optional().default(''),
    cardPick: z.string().optional().default(''),
    category: z.string(),
    price: z.number().nullable().optional(),
    rating: z.number().nullable().optional(),
    reviewCount: z.number().nullable().optional(),
    bsr: z.number().nullable().optional(),
    commissionPerSale: z.number().optional().default(0),
    score: z.number().optional().default(0),
    imageUrl: z.string().optional().default(''),
    imageFlagged: z.boolean().optional().default(false),
    affiliateUrl: z.string(),
    isPrime: z.boolean().optional().default(false),
    status: z.enum(['draft', 'in_review', 'published']).default('draft'),
    firstSeen: z.string().optional().default(''),
    lastSeen: z.string().optional().default(''),
    tags: z.array(z.string()).optional().default([]),
    author: z.string().optional().default('dana-wolff'),
    reviewedAt: z.coerce.date().optional(),
  }),
});

const pillars = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    metaDescription: z.string().optional().default(''),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    excerpt: z.string().optional().default(''),
    targetKeyword: z.string().optional().default(''),
    relatedProducts: relatedProductsField,
    status: z.enum(['draft', 'in_review', 'published']).default('draft'),
    tags: z.array(z.string()).optional().default([]),
    author: z.string().optional().default('dana-wolff'),
    reviewedAt: z.coerce.date().optional(),
  }),
});

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    metaDescription: z.string().optional().default(''),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    excerpt: z.string().optional().default(''),
    pillarSlug: z.string().optional(),
    relatedProducts: relatedProductsField,
    status: z.enum(['draft', 'in_review', 'published']).default('draft'),
    subtopic: z.string().optional().default(''),
    tags: z.array(z.string()).optional().default([]),
    author: z.string().optional().default('dana-wolff'),
    reviewedAt: z.coerce.date().optional(),
  }),
});

export const collections = {
  authors,
  products,
  pillars,
  articles,
};
