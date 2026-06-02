/**
 * Set article-level cardTitle / cardPick for Pinterest pins (topic-aware).
 * Run: node scripts/sync-article-pinterest-frontmatter.mjs
 *
 * Does not remove other frontmatter keys. Uses yaml-safe quoting for values
 * that contain colons, quotes, or other YAML-significant characters.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesDir = path.join(__dirname, '..', 'src', 'content', 'articles');
const picksModuleUrl = new URL('../src/lib/amazon-topic-picks.mjs', import.meta.url);

/** @type {Record<string, string>} */
const CARD_PICK_BY_TOPIC = {
  deodorant:
    'Five sensitive-skin deodorant picks we would actually refill—plastic-free options compared.',
  shampoo:
    'Solid shampoo and conditioner bars that cut bottle waste without sacrificing results.',
  oral: 'Low-waste oral care swaps—paste, brushes, and refills worth the shelf space.',
  cleaning:
    'Concentrates and refill-friendly cleaners that shrink plastic and repeat cost.',
  'printer-ink':
    'Household staples that dodge the printer-ink price trap—real $/use math inside.',
  'pet-food': 'Bulk-buy angles and pantry staples when pet food prices creep up.',
  subscription: 'Cancel creep and swap to staples that actually lower your monthly burn.',
  razor: 'Refill-friendly grooming swaps that beat subscription blade markup.',
  'water-grocery':
    'Water and grocery price traps—pitcher, coffee, and bulk staples compared.',
  'personal-care':
    'Refillable personal care picks vetted for plastic reduction and daily use.',
  'household-staples': 'Bulk household staples scored for cost-per-use—not hype.',
};

/** @param {{ slug?: string, title?: string, subtopic?: string, tags?: string[] }} input */
function stubClassifyArticleTopic(input) {
  const slug = String(input.slug || '');
  const title = String(input.title || '');
  const subtopic = String(input.subtopic || '');
  const tags = (input.tags || []).join(' ');
  const hay = `${slug} ${title} ${subtopic} ${tags}`.toLowerCase();

  if (/\b(deodorant|antiperspirant)\b/.test(hay)) return 'deodorant';
  if (/\b(shampoo|conditioner|hair)\b/.test(hay)) return 'shampoo';
  if (/\b(toothpaste|toothbrush|mouthwash|oral)\b/.test(hay)) return 'oral';
  if (/\b(ink|printer|toner|cartridge)\b/.test(hay)) return 'printer-ink';
  if (/\b(pet[- ]?food|dog food|cat food|kibble)\b/.test(hay)) return 'pet-food';
  if (/\b(streaming|subscription|prime|hulu|netflix)\b/.test(hay)) return 'subscription';
  if (/\b(razor|blade|shav)\b/.test(hay)) return 'razor';
  if (/\b(water|walmart|coffee|folgers|grocery|bottle)\b/.test(hay)) return 'water-grocery';
  if (/\b(cleaning|laundry|detergent|dish|concentrate)\b/.test(hay)) return 'cleaning';
  if (subtopic === 'personal-care') return 'personal-care';
  if (subtopic === 'cleaning') return 'cleaning';
  return 'household-staples';
}

async function loadTopicLib() {
  try {
    const mod = await import(picksModuleUrl.href);
    return {
      classifyArticleTopic:
        typeof mod.classifyArticleTopic === 'function'
          ? mod.classifyArticleTopic
          : stubClassifyArticleTopic,
      cardPickForTopic:
        typeof mod.articlePinterestMeta === 'function'
          ? (topic, title) => mod.articlePinterestMeta(topic, title).cardPick
          : (topic) => CARD_PICK_BY_TOPIC[topic] || CARD_PICK_BY_TOPIC['household-staples'],
    };
  } catch {
    return {
      classifyArticleTopic: stubClassifyArticleTopic,
      cardPickForTopic: (topic) =>
        CARD_PICK_BY_TOPIC[topic] || CARD_PICK_BY_TOPIC['household-staples'],
    };
  }
}

/**
 * Pin title: derived from article title, ≤72 chars, scannable—not verbatim SEO spam.
 * @param {string} title
 */
function deriveCardTitle(title) {
  let t = String(title || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!t) return '';

  t = t
    .replace(
      /\b(exposed!?|revealed!?|shocking|you won't believe|must[- ]read|ultimate guide)\b/gi,
      '',
    )
    .replace(/\s+/g, ' ')
    .trim();

  const colonParts = t.split(/\s*:\s*/);
  if (colonParts.length >= 2) {
    const head = colonParts[0].trim();
    const tail = colonParts.slice(1).join(': ').trim();
    if (head.length >= 18 && head.length <= 68) {
      t = head;
    } else if (head.length < 18 && tail.length > 0) {
      const hook = tail.split(/[.!?]/)[0].trim();
      const merged = hook.length <= 48 ? `${head}: ${hook}` : head;
      t = merged.length <= 72 ? merged : head;
    }
  }

  t = t
    .replace(/\b(a complete guide|in-depth analysis|everything you need to know)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (t.length > 72) {
    const cut = t.slice(0, 72);
    const lastSpace = cut.lastIndexOf(' ');
    t = (lastSpace > 36 ? cut.slice(0, lastSpace) : cut).trim();
    if (t.length < title.length) t = `${t}…`;
  }

  return t;
}

/**
 * YAML scalar safe for frontmatter (single line).
 * @param {string} s
 */
function yamlQuote(s) {
  const v = String(s).replace(/\r?\n/g, ' ').trim();
  if (!v) return '""';
  if (!/[:#\[\]{}&*!|>'"%@`\n]/.test(v) && !v.includes('"')) {
    return v;
  }
  if (!v.includes('"') && !v.includes('\n')) {
    return `'${v.replace(/'/g, "''")}'`;
  }
  return `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/**
 * @param {string} fm
 * @param {string} key
 */
function readFmField(fm, key) {
  const line = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  if (!line) return '';
  let v = line[1].trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).replace(/''/g, "'");
  }
  return v;
}

/**
 * @param {string} fm
 */
function readTags(fm) {
  const tags = [];
  const block = fm.match(/^tags:\s*\n((?:[ \t]*-\s+.+\n)+)/m);
  if (block) {
    for (const line of block[1].split('\n')) {
      const t = line.match(/^\s*-\s+(.+)$/);
      if (t) {
        let tag = t[1].trim();
        if (
          (tag.startsWith('"') && tag.endsWith('"')) ||
          (tag.startsWith("'") && tag.endsWith("'"))
        ) {
          tag = tag.slice(1, -1);
        }
        tags.push(tag);
      }
    }
  }
  return tags;
}

/**
 * Remove a frontmatter key and any folded continuation lines beneath it.
 * @param {string} fm
 * @param {string} key
 */
function removeField(fm, key) {
  const lines = fm.split('\n');
  const out = [];
  let skipping = false;

  for (const line of lines) {
    if (new RegExp(`^${key}:`).test(line)) {
      skipping = true;
      continue;
    }
    if (skipping) {
      if (/^\s{2,}\S/.test(line) && !/^\s*-\s/.test(line) && !/^\w[\w-]*:/.test(line.trim())) {
        continue;
      }
      skipping = false;
    }
    out.push(line);
  }
  return out.join('\n');
}

/**
 * @param {string} fm
 * @param {string} key
 * @param {string} value
 */
function upsertField(fm, key, value) {
  const line = `${key}: ${yamlQuote(value)}`;
  let next = removeField(fm, key).trimEnd();
  const insertBefore = /^(heroImage|status|updatedAt|reviewedAt|author):/m;
  const anchor = next.match(insertBefore);
  if (anchor && anchor.index !== undefined) {
    next = `${next.slice(0, anchor.index).trimEnd()}\n${line}\n${next.slice(anchor.index)}`;
  } else {
    next = `${next}\n${line}`;
  }
  return next.endsWith('\n') ? next : `${next}\n`;
}

const { classifyArticleTopic, cardPickForTopic } = await loadTopicLib();

let updated = 0;
const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md'));

for (const f of files) {
  const filePath = path.join(articlesDir, f);
  const slug = f.replace(/\.md$/, '');
  const raw = fs.readFileSync(filePath, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) continue;

  const fm = m[1];
  const body = m[2];
  const title = readFmField(fm, 'title') || slug.replace(/-/g, ' ');
  const subtopic = readFmField(fm, 'subtopic');
  const tags = readTags(fm);

  const topic = classifyArticleTopic({ slug, title, subtopic, tags });
  const cardTitle = deriveCardTitle(title);
  const cardPick = cardPickForTopic(topic, title);

  const prevTitle = readFmField(fm, 'cardTitle');
  const prevPick = readFmField(fm, 'cardPick');
  if (prevTitle === cardTitle && prevPick === cardPick) continue;

  let nextFm = upsertField(fm, 'cardTitle', cardTitle);
  nextFm = upsertField(nextFm, 'cardPick', cardPick);

  const nl = raw.includes('\r\n') ? '\r\n' : '\n';
  fs.writeFileSync(filePath, `---${nl}${nextFm}---${nl}${body}`, 'utf8');
  updated++;
}

console.log(`Updated cardTitle/cardPick on ${updated} of ${files.length} articles.`);
