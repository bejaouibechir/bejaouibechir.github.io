/*
  Checklist de CHARTE_SITE.md, passée par script.

  Deux régimes, distingués par le chemin de la page :
    · consultation  — règles 1 et 2 : un geste en 5 s, 250 mots maximum
    · tutoriel      — exception 2 bis : structure fixe, 900 mots, sortie réelle, commande

  Le contrôle porte sur les sources (fragments + châssis), pas sur le HTML construit.
  Les budgets Lighthouse restent à mesurer sur le site construit.

  Usage : node scripts/check_charte.cjs
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MOCK = path.join(ROOT, 'src', '_mock');
const PAGES = path.join(ROOT, 'src', 'pages');

const SHELL = fs.readFileSync(path.join(ROOT, 'src', 'components', 'DslShell.astro'), 'utf8');
const GUIDE_SHELL = fs.readFileSync(path.join(ROOT, 'src', 'components', 'GuideShell.astro'), 'utf8');
/* Sur une page de lecon, ProductLearningShell rend le slot a la place de la carte du
   cours. On retire donc la branche d'ensemble, qui n'est jamais servie ici — sinon le
   h1 du hero et celui de la lecon seraient comptes ensemble. */
const LEARN_SHELL = fs.readFileSync(path.join(ROOT, 'src', 'components', 'ProductLearningShell.astro'), 'utf8')
  .replace(/\{isLessonPage \? <slot \/> : \([\s\S]*?<\/Fragment>\s*\)\}/, '<slot />');

/* page -> { kind, parts } */
const PAGE_PARTS = {
  '/guide/sources/csv': { kind: 'workshop', shell: 'guide', parts: ['guide-csv.head.html', 'guide-csv.tail.html'] },
  '/guide/generated-workshops': { kind: 'workshop', shell: 'guide', astro: '../components/GuideTutorial.astro' },
  '/dsl/reference':     { kind: 'explanation', astro: 'dsl/reference.astro' },
  '/dsl':               { kind: 'reference', parts: ['dsl-rows.head.html', 'dsl-rows.tail.html'] },
  '/dsl/version':       { kind: 'explanation', parts: ['dsl-version.head.html', 'dsl-version.tail.html'] },
  '/dsl/sources-yaml':  { kind: 'explanation', parts: ['dsl-sources-yaml.head.html', 'dsl-sources-yaml.tail.html'] },
  '/dsl/transformations-yaml': { kind: 'explanation', parts: ['dsl-transformations-yaml.head.html', 'dsl-transformations-yaml.tail.html'] },
  '/dsl/destinations-yaml': { kind: 'explanation', parts: ['dsl-destinations-yaml.head.html', 'dsl-destinations-yaml.tail.html'] },
  '/dsl/pipeline-yaml': { kind: 'explanation', parts: ['dsl-pipeline-yaml.head.html', 'dsl-pipeline-yaml.tail.html'] },
  '/dsl/workflow-yaml': { kind: 'explanation', parts: ['dsl-workflow-yaml.head.html', 'dsl-workflow-yaml.tail.html'] },
  '/dsl/sources':       { kind: 'explanation', parts: ['dsl-sources.head.html', 'dsl-sources.tail.html'] },
  '/dsl/pipeline':      { kind: 'reference', parts: ['dsl-pipeline.main.html'] },
  '/dsl/interpolation': { kind: 'reference', parts: ['dsl-interpolation.main.html'] },
};

/* pages d'élément générées depuis le contenu vérifié */
const GENERATED_PAGES = require(path.join(ROOT, 'src', 'data', 'dsl-generated-pages.json'));
for (const page of GENERATED_PAGES) {
  PAGE_PARTS[page.route] = { kind: 'explanation', parts: page.parts };
}

/* les leçons sont découvertes automatiquement : une page oubliée doit se voir */
for (const f of fs.existsSync(path.join(MOCK)) ? fs.readdirSync(MOCK) : []) {
  const m = f.match(/^tutorial-(\d+)-([a-z-]+)\.main\.html$/);
  if (m) PAGE_PARTS[`/dsl/tutorial/${m[1]}-${m[2]}`] = { kind: 'tutorial', parts: [f] };
  /* exception 2 quater : les ateliers produit, sous /cli/ et /studio/ */
  const c = f.match(/^(cli|studio)-lesson-(\d+)-([a-z-]+)\.main\.html$/);
  if (c) PAGE_PARTS[`/${c[1]}/${c[2]}-${c[3]}`] = { kind: 'lesson', parts: [f], route: true };
}

/* routes réellement servies */
const routes = new Set(['/']);
(function walk(dir, base) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name), `${base}/${e.name}`);
    else if (e.name.endsWith('.astro')) routes.add(`${base}/${e.name.replace(/\.astro$/, '')}`.replace(/\/index$/, '') || '/');
  }
})(PAGES, '');

/* Fichiers statiques de public/ : un lien vers une archive ou une image
   telechargeable resout aussi, meme si aucune page .astro ne porte ce nom.
   On les indexe avec leur extension, contrairement aux routes. */
const PUBLIC = path.join(ROOT, 'public');
const assets = new Set();
(function walkAssets(dir, base) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walkAssets(path.join(dir, e.name), `${base}/${e.name}`);
    else assets.add(`${base}/${e.name}`);
  }
})(PUBLIC, '');

function prose(html) {
  return html
    /* le budget porte sur le contenu éditorial, jamais sur la navigation partagée */
    .replace(/<aside\b[\s\S]*?<\/aside>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<table[\s\S]*?<\/table>/gi, ' ')
    .replace(/<code[\s\S]*?<\/code>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .split(/\s+/).filter((w) => /[A-Za-zÀ-ÿ]/.test(w));
}

/* ─────────── règles communes aux deux régimes ─────────── */
const COMMON = [
  ['exemples tous corrects', (h, route) => {
    if (route === '/dsl/interpolation') return null;
    const marks = [];
    if (/c-bad/.test(h)) marks.push('un exemple est marqué fautif (c-bad)');
    if (/status err/.test(h)) marks.push("un état d'échec est mis en scène (status err)");
    return marks.length ? marks.join(' · ') : null;
  }],
  ['aucun appel réseau au chargement', (h) => {
    const bad = [/\bfetch\s*\(/, /XMLHttpRequest/, /<script[^>]+src=/i, /<img[^>]+src=["']https?:/i];
    const hit = bad.find((re) => re.test(h));
    return hit ? `motif interdit : ${hit}` : null;
  }],
  ['tous les liens résolvent', (h) => {
    const bad = [...h.matchAll(/href="([^"]+)"/g)].map((m) => m[1])
      .filter((x) => !/^(https?:|mailto:|\{|#[a-z])/i.test(x))
      .filter((x) => {
        if (x === '#') return true;
        const p = x.split('#')[0].split('?')[0];
        return !assets.has(p) && !routes.has(p.replace(/\/$/, '') || '/');
      });
    return bad.length ? bad.join(', ') : null;
  }],
  ['aucun secret en clair', (h) => {
    const m = h.match(/(password|token|api[_-]?key)\s*:\s*["']?(?!\$\{|\{\{|&|<)[A-Za-z0-9_\-.]{6,}/i);
    return m ? m[0].slice(0, 40) : null;
  }],
  ['une seule balise h1', (h) => {
    const n = (h.match(/<h1\b/g) || []).length;
    return n === 1 ? null : `${n} h1`;
  }],
  ['toute icône a un aria-label', (h) => {
    const bad = [...h.matchAll(/<button\b[^>]*>/g)].map((m) => m[0])
      .filter((b) => /iconbtn|burger/.test(b) && !/aria-label=/.test(b));
    return bad.length ? `${bad.length} bouton(s) sans aria-label` : null;
  }],
];

/* ─────────── règles 1 et 2, pages de consultation ─────────── */
const REFERENCE = [
  ['≤ 250 mots de prose', (h) => {
    const n = prose(h).length;
    return n <= 250 ? null : `${n} mots`;
  }],
  ['un élément manipulable', (h) => {
    const controls = (h.match(/<(input|select|textarea)\b/g) || []).length +
      (h.match(/<button(?![^>]*\b(id="(burger|themeBtn|searchBtn)"))/g) || []).length;
    return controls > 0 ? null : 'aucun contrôle dans le contenu principal';
  }],
];

/* ─────────── exception 2 bis, pages de tutoriel ─────────── */
const SECTIONS = ['what to expect', 'implementation', 'execution', 'next'];
const TUTORIAL = [
  ['≤ 900 mots de prose', (h) => {
    const n = prose(h).length;
    return n <= 900 ? null : `${n} mots`;
  }],
  ['structure fixe respectée', (h) => {
    const heads = [...h.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
      .map((m) => m[1].replace(/<[^>]+>/g, ' ').toLowerCase());
    const missing = SECTIONS.filter((s) => !heads.some((x) => x.includes(s)));
    return missing.length ? `section(s) absente(s) : ${missing.join(', ')}` : null;
  }],
  ['objectifs, description, étapes', (h) => {
    const heads = [...h.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)]
      .map((m) => m[1].replace(/<[^>]+>/g, ' ').toLowerCase());
    const need = ['objectives', 'description', 'steps'];
    const missing = need.filter((s) => !heads.some((x) => x.includes(s)));
    return missing.length ? `sous-section(s) absente(s) : ${missing.join(', ')}` : null;
  }],
  ['au moins un bloc YAML', (h) => {
    const n = (h.match(/class="[^"]*yaml/g) || []).length;
    return n > 0 ? null : 'aucun manifeste montré';
  }],
  ['la sortie réelle est montrée', (h) => {
    return /class="[^"]*(outrows|resulttable|subst)/.test(h) || /<table/.test(h)
      ? null : 'aucune sortie affichée après les étapes';
  }],
  ['une commande copiable', (h) => {
    return /class="[^"]*cmd/.test(h) ? null : 'aucun bloc de commande marqué class="cmd"';
  }],
  ['un lien vers la leçon suivante', (h) => {
    return /href="\/dsl\/tutorial\//.test(h) ? null : 'aucun lien vers une autre leçon';
  }],
];

/* ─────────── exception 2 quater, ateliers produit (/cli, /studio) ───────────
   Structure Microsoft : objectif, etapes numerotees, resultat attendu a chaque etape.
   Le plafond de mots est leve — la derogation de Bechir vaut pour tout tutoriel. */
const LESSON_SECTIONS = ['objective', 'steps', 'checklist', 'troubleshooting', 'next lesson'];
const LESSON = [
  ['structure d atelier respectée', (h) => {
    const heads = [...h.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
      .map((m) => m[1].replace(/<[^>]+>/g, ' ').toLowerCase());
    const missing = LESSON_SECTIONS.filter((s) => !heads.some((x) => x.includes(s)));
    return missing.length ? `section(s) absente(s) : ${missing.join(', ')}` : null;
  }],
  ['chaque étape porte un objectif', (h) => {
    const steps = (h.match(/class="step"/g) || []).length;
    const goals = [...h.matchAll(/<h4\b[^>]*>([\s\S]*?)<\/h4>/gi)]
      .filter((m) => /objective/i.test(m[1])).length;
    if (steps < 3) return 'moins de trois étapes';
    return goals >= steps ? null : `${steps} étape(s) pour ${goals} objectif(s)`;
  }],
  ['des actions numérotées', (h) => {
    const n = (h.match(/<ol\b/g) || []).length;
    return n >= 3 ? null : `${n} liste(s) numérotée(s)`;
  }],
  ['le résultat attendu est montré', (h) => {
    const steps = (h.match(/class="step"/g) || []).length;
    const seen = (h.match(/class="expect"/g) || []).length;
    return seen >= steps ? null : `${steps} étape(s) pour ${seen} bloc(s) « What you should see »`;
  }],
  ['la sortie réelle est montrée', (h) => {
    return /class="out"/.test(h) ? null : 'aucune sortie de terminal affichée';
  }],
  ['une commande copiable', (h) => /class="cmd"/.test(h) ? null : 'aucun bloc class="cmd"'],
  ['un retour vers la piste', (h) => /href="\/(cli|studio)"/.test(h) ? null : 'aucun lien vers la carte du cours'],
  ['des liens vers les sujets voisins', (h) => /class="linklist"/.test(h) ? null : 'aucune liste de liens voisins'],
];

/* ─────────── exception 2 quinquies, ateliers du Guide ─────────── */
const WORKSHOP_SECTIONS = ['context', 'question', 'steps', 'expected result', 'reading the results', 'answer', 'before and after'];
const WORKSHOP = [
  ['≤ 900 mots de prose', (h) => {
    const n = prose(h).length;
    return n <= 900 ? null : `${n} mots`;
  }],
  ['structure d atelier respectée', (h) => {
    const heads = [...h.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/gi)]
      .map((m) => m[1].replace(/<[^>]+>/g, ' ').toLowerCase());
    const missing = WORKSHOP_SECTIONS.filter((s) => !heads.some((x) => x.includes(s)));
    return missing.length ? `section(s) absente(s) : ${missing.join(', ')}` : null;
  }],
  ['les contraintes sont listées', (h) => /class="constraints"/.test(h) ? null : 'aucune liste de contraintes'],
  ['des étapes numérotées', (h) => {
    const literal = (h.match(/<ol\b/g) || []).length;
    const generated = /tutorial\.steps\.map[\s\S]*?<ol\b/.test(h);
    return literal >= 3 || generated ? null : 'moins de trois étapes numérotées';
  }],
  ['au moins un encart Tip, Trap ou Check', (h) => /class="callout/.test(h) ? null : 'aucun encart'],
  ['une commande copiable', (h) => /class="[^"]*cmd/.test(h) || /class:list=\{[^}]*"cmd"/.test(h) ? null : 'aucun bloc de commande'],
  ['des liens vers les sujets voisins', (h) => /class="linklist"/.test(h) ? null : 'aucune liste de liens voisins'],
];

/* ─────────── exception 2 ter, pages d'explication ─────────── */
const EXPLANATION = [
  ['≤ 500 mots de prose', (h) => {
    const n = prose(h).length;
    return n <= 500 ? null : `${n} mots`;
  }],
  ['un élément manipulable', REFERENCE[1][1]],
  ['des liens vers les sujets voisins', (h) => {
    return /class="linklist"/.test(h) ? null : 'aucune liste de liens voisins';
  }],
];

let fail = 0;
const entries = Object.entries(PAGE_PARTS);
for (const [route, { kind, parts, astro, shell }] of entries) {
  /* une page peut etre faite de fragments _mock, ou etre une page .astro entiere */
  const body = astro
    ? fs.readFileSync(path.join(PAGES, astro), 'utf8')
        .replace(/^---[\s\S]*?---/, '')          // frontmatter
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')  // commentaires JSX
    : parts.map((f) => fs.readFileSync(path.join(MOCK, f), 'utf8')).join('\n');
  const chassis = kind === 'lesson' ? LEARN_SHELL : shell === 'guide' ? GUIDE_SHELL : SHELL;
  const html = chassis.replace(/^---[\s\S]*?---/, '') + body;
  const checks = COMMON.concat(
    kind === 'tutorial' ? TUTORIAL :
    kind === 'lesson' ? LESSON :
    kind === 'workshop' ? WORKSHOP :
    kind === 'explanation' ? EXPLANATION : REFERENCE);
  console.log(`\n${route}   [${kind}]   ${prose(html).length} mots de prose`);
  for (const [label, fn] of checks) {
    const problem = fn(html, route);
    if (problem) { fail++; console.log(`  ECHEC  ${label} — ${problem}`); }
    else console.log(`  ok     ${label}`);
  }
}

const count = (k) => entries.filter(([, v]) => v.kind === k).length;
console.log(`\n${entries.length} pages contrôlées — ${count('reference')} de consultation, ${count('explanation')} d'explication, ${count('tutorial')} de tutoriel, ${count('lesson')} d'atelier produit, ${count('workshop')} d'atelier`);
console.log(fail ? `*** ${fail} point(s) de charte en échec` : 'Toutes les pages passent leur checklist');
console.log('Reste à mesurer sur le site construit : budgets Lighthouse, LCP, poids JS.');
process.exit(fail ? 1 : 0);
