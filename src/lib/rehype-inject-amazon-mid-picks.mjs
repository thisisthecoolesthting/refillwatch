/**

 * Injects compact Amazon inline cards after selected h2s (Pinterest-friendly on-page density).

 */

import path from 'node:path';

import {

  MID_PICK_H2_INDICES,

  amazonPickHref,

} from './amazon-pick-catalog.mjs';

import { classifyArticleTopic, getTopicPicks } from './amazon-topic-picks.mjs';

import { amazonInlineImageUrl } from './amazon-inline-image-map.mjs';



function slugFromVfile(file) {

  const raw = file?.path || '';

  if (!raw) return '';

  const base = path.basename(raw, path.extname(raw));

  if (base && base !== 'index') return base;

  const normalized = raw.replace(/\\/g, '/');

  const m = normalized.match(/\/articles\/([^/]+)\.md$/i);

  return m ? m[1] : '';

}



function frontmatterFromVfile(file) {

  const fm = file?.data?.astro?.frontmatter;

  return fm && typeof fm === 'object' ? fm : {};

}



function midPickIndex(h2Count) {

  const slots = [...MID_PICK_H2_INDICES].sort((a, b) => a - b);

  const idx = slots.indexOf(h2Count);

  return idx >= 0 ? idx : 0;

}



function pickCardElement(pick) {

  const href = amazonPickHref(pick.asin);

  const src = amazonInlineImageUrl(pick.asin);

  const linkProps = {

    className: ['amazon-inline-card__link'],

    href,

    rel: ['nofollow', 'sponsored', 'noopener'],

    target: '_blank',

  };

  if (pick.cardTitle) linkProps['data-card-title'] = pick.cardTitle;

  if (pick.cardPick) linkProps['data-card-pick'] = pick.cardPick;



  return {

    type: 'element',

    tagName: 'div',

    properties: {

      className: ['amazon-inline-card', 'amazon-inline-card--mid', 'not-prose'],

    },

    children: [

      {

        type: 'element',

        tagName: 'a',

        properties: linkProps,

        children: [

          {

            type: 'element',

            tagName: 'img',

            properties: {

              className: ['amazon-inline-card__img'],

              src,

              alt: pick.title,

              width: '80',

              height: '80',

              loading: 'lazy',

              decoding: 'async',

            },

          },

          {

            type: 'element',

            tagName: 'div',

            properties: { className: ['amazon-inline-card__body'] },

            children: [

              {

                type: 'element',

                tagName: 'strong',

                properties: { className: ['amazon-inline-card__title'] },

                children: [{ type: 'text', value: pick.title }],

              },

              {

                type: 'element',

                tagName: 'span',

                properties: { className: ['amazon-inline-card__desc'] },

                children: [{ type: 'text', value: pick.desc }],

              },

              {

                type: 'element',

                tagName: 'span',

                properties: { className: ['amazon-inline-card__cta'] },

                children: [{ type: 'text', value: 'Shop on Amazon →' }],

              },

            ],

          },

        ],

      },

    ],

  };

}



function walkInsert(node, picks) {

  if (!node?.children || !Array.isArray(node.children)) return;



  let h2Count = 0;

  const next = [];



  for (const child of node.children) {

    next.push(child);

    walkInsert(child, picks);



    if (child?.type === 'element' && child.tagName === 'h2') {

      h2Count += 1;

      if (MID_PICK_H2_INDICES.has(h2Count)) {

        const pick = picks[midPickIndex(h2Count)] ?? picks[0];

        if (pick) next.push(pickCardElement(pick));

      }

    }

  }



  node.children = next;

}



export function rehypeInjectAmazonMidPicks() {

  return (tree, file) => {

    const fm = frontmatterFromVfile(file);

    const slug = slugFromVfile(file);

    const topic = classifyArticleTopic({

      slug,

      title: fm.title || slug.replace(/-/g, ' '),

      subtopic: fm.subtopic || '',

      tags: fm.tags || [],

    });

    const picks = getTopicPicks(topic);

    walkInsert(tree, picks);

  };

}


