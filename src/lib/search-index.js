/* Construction de l'index de recherche plein texte du site.
   Lit les pages .astro et les fragments HTML qu'elles importent, decoupe par
   titre de section, et produit un enregistrement par section. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* Vite peut deplacer ce module dans un dossier temporaire au build : la racine
   du projet (cwd d'astro dev comme d'astro build) est la reference fiable, et
   import.meta.url ne sert que de secours. */
function findPages() {
  const candidates = [
    path.join(process.cwd(), 'src', 'pages'),
    path.join(fileURLToPath(new URL('../', import.meta.url)), 'pages'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, 'index.astro'))) return c;
  }
  return null;
}

const PAGES = findPages();

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', rarr: '→',
  larr: '←', times: '×', laquo: '«', raquo: '»',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  eacute: 'é', egrave: 'è', agrave: 'à', check: '✓',
};

function decode(s) {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, g) => {
    if (g[0] === '#') {
      const code = g[1] === 'x' || g[1] === 'X' ? parseInt(g.slice(2), 16) : parseInt(g.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return Object.prototype.hasOwnProperty.call(ENTITIES, g) ? ENTITIES[g] : m;
  });
}

function stripTags(html) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ').trim();
}

export function slug(text) {
  return stripTags(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith('.astro')) out.push(p);
  }
  return out;
}

function urlOf(file) {
  let rel = path.relative(PAGES, file).replace(/\\/g, '/').replace(/\.astro$/, '');
  if (rel === 'index') return '/';
  return '/' + rel.replace(/\/index$/, '');
}

/* Contenu d'une page : fragments HTML importes, puis balisage inline du .astro. */
function contentOf(file, raw) {
  const dir = path.dirname(file);
  let html = '';
  const importRe = /import\s+\w+\s+from\s+['"]([^'"]+\.(?:html|js))\?raw['"]/g;
  const scripts = [];
  let m;
  while ((m = importRe.exec(raw))) {
    const target = path.resolve(dir, m[1]);
    if (!fs.existsSync(target)) continue;
    const body = fs.readFileSync(target, 'utf8');
    if (m[1].endsWith('.js')) scripts.push(body);
    else html += '\n' + body;
  }
  const inline = raw.replace(/^---[\s\S]*?\n---/, '');
  return { html: html + '\n' + inline, extra: literals(scripts.join('\n')) };
}

/* Plusieurs pages (guide, migrate, build, playground) composent leur contenu en
   JavaScript. On en retient les chaines qui sont de la prose ou un identifiant,
   sans quoi ce vocabulaire resterait introuvable. */
function literals(js) {
  if (!js) return '';
  const out = [];
  const seen = new Set();
  const re = /(['"])((?:\\.|(?!\1)[^\\])*?)\1/g;
  let m;
  while ((m = re.exec(js))) {
    const v = m[2];
    if (v.length < 4 || v.length > 300 || seen.has(v)) continue;
    if (/[<>{}=()\[\];\\|`]/.test(v)) continue;
    if (/^[.#/]|^https?:/.test(v)) continue;
    if (!/^[A-Za-z]/.test(v)) continue;
    const ok = /^[a-z][a-z0-9_]*$/.test(v) ? v.includes('_') : /^[A-Za-z][^,]*\s+\S/.test(v);
    if (!ok) continue;
    seen.add(v);
    out.push(v);
  }
  return out.join(' · ');
}

function titleOf(raw, html, url) {
  const m = raw.match(/<BaseLayout[^>]*\stitle="([^"]+)"/);
  if (m) return decode(m[1]).replace(/\s*[—-]\s*Hydra.*$/, '').trim();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return stripTags(h1[1]);
  return url;
}

/* Une page devient une liste de sections, decoupees sur h1/h2/h3. */
function sectionsOf(html) {
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const re = /<h([123])[^>]*>([\s\S]*?)<\/h\1>/gi;
  const marks = [];
  let m;
  while ((m = re.exec(clean))) {
    marks.push({ level: +m[1], title: stripTags(m[2]), start: m.index, end: re.lastIndex });
  }
  const out = [];
  const intro = stripTags(clean.slice(0, marks.length ? marks[0].start : clean.length));
  if (intro.length > 40) out.push({ title: '', level: 0, text: intro });
  marks.forEach((h, i) => {
    const next = marks[i + 1] ? marks[i + 1].start : clean.length;
    const text = stripTags(clean.slice(h.end, next));
    if (h.title) out.push({ title: h.title, level: h.level, text });
  });
  return out;
}

export function buildIndex() {
  if (!PAGES) {
    console.warn('[search-index] dossier src/pages introuvable : index vide');
    return [];
  }
  const records = [];
  const seen = new Map();
  for (const file of walk(PAGES).sort()) {
    const raw = fs.readFileSync(file, 'utf8');
    if (/Astro\.redirect/.test(raw)) continue;
    const url = urlOf(file);
    const { html, extra } = contentOf(file, raw);
    const title = titleOf(raw, html, url);
    for (const sec of sectionsOf(html)) {
      if (!sec.title && sec.text.length < 60) continue;
      /* Anchors uniques par page, meme regle que le script client. */
      const base = sec.title ? slug(sec.title) : '';
      let anchor = base;
      if (base) {
        const key = url + '#' + base;
        const n = (seen.get(key) || 0) + 1;
        seen.set(key, n);
        if (n > 1) anchor = base + '-' + n;
      }
      records.push({
        u: url,
        p: title,
        s: sec.title,
        a: anchor,
        n: sec.level,
        t: sec.text.slice(0, 4000),
      });
    }
    if (extra.length > 60) {
      records.push({ u: url, p: title, s: '', a: '', n: 0, t: extra.slice(0, 6000) });
    }
  }
  return records;
}
