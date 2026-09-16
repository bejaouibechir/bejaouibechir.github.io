/*
  Test des interactions de la page /vscode — charte, règle 10.

  Le stub partagé (domstub.cjs) ne sert pas ici : il renvoie [] pour
  querySelectorAll, or toute la page repose dessus (onglets, panneaux, boutons
  de copie). On construit donc un DOM minimal mais complet, reproduisant le
  balisage réellement rendu par src/pages/vscode.astro, puis on exécute
  src/_mock/vscode.js et on compare chaque résultat à l'attendu.

  Usage : node scripts/test_vscode.cjs
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JS = fs.readFileSync(path.join(ROOT, 'src', '_mock', 'vscode.js'), 'utf8');
const PAGE = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'vscode.astro'), 'utf8');

let pass = 0, fail = 0;
function check(name, cond, got) {
  if (cond) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  FAIL ' + name + '  ->  ' + got); }
}

/* ── DOM minimal ────────────────────────────────────────────────────────── */
function El(tag, attrs) {
  return {
    tag, _a: Object.assign({}, attrs), _h: {}, hidden: false, tabIndex: 0,
    textContent: '', innerHTML: '', _focused: false,
    setAttribute(k, v) { this._a[k] = String(v); },
    getAttribute(k) { return k in this._a ? this._a[k] : null; },
    removeAttribute(k) { delete this._a[k]; },
    addEventListener(t, f) { (this._h[t] = this._h[t] || []).push(f); },
    focus() { this._focused = true; },
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); },
      contains(c) { return this._s.has(c); },
      toggle(c) { this._s.has(c) ? this._s.delete(c) : this._s.add(c); return this._s.has(c); },
    },
    fire(type, extra) {
      let prevented = false;
      const ev = Object.assign({ type, preventDefault() { prevented = true; }, target: this }, extra);
      (this._h[type] || []).forEach((f) => f.call(this, ev));
      return prevented;
    },
  };
}

const FILES = [
  'jobs/orders/sources.yaml', 'jobs/orders/destinations.yaml', 'jobs/orders/pipeline.yaml',
  'jobs/orders/transformations.yaml', 'workflow.yaml',
];

const tabs = FILES.map((f, i) => {
  const t = El('button', {
    role: 'tab',
    'aria-selected': i === 0 ? 'true' : 'false',
    'data-file': f,
    'data-note': 'Note for ' + f,
  });
  t.tabIndex = i === 0 ? 0 : -1;
  return t;
});
const panels = FILES.map((_, i) => { const p = El('pre', { 'data-panel': '' }); p.hidden = i !== 0; return p; });
const copyBtns = [El('button', { 'data-copy': 'python build_vsix.py' })];

const byId = {
  themeBtn: El('button', {}),
  burger: El('button', { 'aria-expanded': 'false', 'aria-label': 'Open menu' }),
  drawer: El('nav', {}),
  demoFile: El('span', {}),
  demoNote: El('p', {}),
};

let themeAttr = 'light';
global.document = {
  getElementById(id) { return byId[id] || null; },
  querySelectorAll(sel) {
    if (sel === '.demo-pick button') return tabs;
    if (sel === '.demo-view [data-panel]') return panels;
    if (sel === '[data-copy]') return copyBtns;
    return [];
  },
  documentElement: {
    getAttribute() { return themeAttr; },
    setAttribute(k, v) { if (k === 'data-theme') themeAttr = v; },
  },
};
global.window = global;
global.navigator = { clipboard: { writeText: () => ({ then: (ok) => ok() }) } };
global.localStorage = { _d: {}, setItem(k, v) { this._d[k] = v; }, getItem(k) { return this._d[k] || null; } };
global.setTimeout = (fn) => fn;

eval(JS);

/* ── 1. État initial ────────────────────────────────────────────────────── */
console.log('\n[1] etat initial');
check('premier onglet selectionne', tabs[0].getAttribute('aria-selected') === 'true', tabs[0].getAttribute('aria-selected'));
check('les autres ne le sont pas', tabs.slice(1).every((t) => t.getAttribute('aria-selected') === 'false'), 'un onglet reste selectionne');
check('premier panneau visible', panels[0].hidden === false, panels[0].hidden);
check('les autres panneaux caches', panels.slice(1).every((p) => p.hidden === true), 'un panneau reste visible');
check('tabindex roving', tabs[0].tabIndex === 0 && tabs.slice(1).every((t) => t.tabIndex === -1), tabs.map((t) => t.tabIndex).join(','));
check('nom de fichier affiche', byId.demoFile.textContent === FILES[0], byId.demoFile.textContent);

/* ── 2. Clic ────────────────────────────────────────────────────────────── */
console.log('\n[2] clic sur un onglet');
tabs[2].fire('click');
check('panneau 3 visible', panels[2].hidden === false, panels[2].hidden);
check('panneau 1 cache', panels[0].hidden === true, panels[0].hidden);
check('un seul panneau visible', panels.filter((p) => !p.hidden).length === 1, panels.filter((p) => !p.hidden).length);
check('aria-selected suit', tabs[2].getAttribute('aria-selected') === 'true' && tabs[0].getAttribute('aria-selected') === 'false', 'incoherent');
check('fichier mis a jour', byId.demoFile.textContent === FILES[2], byId.demoFile.textContent);
check('note mise a jour', byId.demoNote.innerHTML === 'Note for ' + FILES[2], byId.demoNote.innerHTML);

/* ── 3. Clavier — charte, règle 6 ───────────────────────────────────────── */
console.log('\n[3] navigation clavier');
tabs[2].fire('keydown', { key: 'ArrowDown' });
check('ArrowDown avance', panels[3].hidden === false, 'panneau 4 cache');
check('le focus suit', tabs[3]._focused === true, 'pas de focus');
tabs[3].fire('keydown', { key: 'ArrowUp' });
check('ArrowUp recule', panels[2].hidden === false, 'panneau 3 cache');
tabs[2].fire('keydown', { key: 'End' });
check('End va au dernier', panels[4].hidden === false, 'dernier panneau cache');
tabs[4].fire('keydown', { key: 'Home' });
check('Home revient au premier', panels[0].hidden === false, 'premier panneau cache');
tabs[0].fire('keydown', { key: 'ArrowUp' });
check('ArrowUp boucle sur le dernier', panels[4].hidden === false, 'pas de bouclage');
tabs[4].fire('keydown', { key: 'ArrowDown' });
check('ArrowDown boucle sur le premier', panels[0].hidden === false, 'pas de bouclage');
check('une touche inerte ne change rien', tabs[0].fire('keydown', { key: 'a' }) === false, 'preventDefault sur une touche libre');

/* ── 4. Thème et menu ───────────────────────────────────────────────────── */
console.log('\n[4] theme et menu mobile');
byId.themeBtn.fire('click');
check('bascule en sombre', themeAttr === 'dark', themeAttr);
byId.themeBtn.fire('click');
check('revient en clair', themeAttr === 'light', themeAttr);
byId.burger.fire('click');
check('le tiroir s ouvre', byId.drawer.classList.contains('open'), 'ferme');
check('aria-expanded suit', byId.burger.getAttribute('aria-expanded') === 'true', byId.burger.getAttribute('aria-expanded'));
byId.burger.fire('click');
check('le tiroir se ferme', !byId.drawer.classList.contains('open'), 'ouvert');

/* ── 5. Contrôles statiques sur la source de la page ────────────────────── */
console.log('\n[5] source de la page');
check('un seul h1', (PAGE.match(/<h1\b/g) || []).length === 1, (PAGE.match(/<h1\b/g) || []).length);
check('aucun appel reseau', !/\bfetch\s*\(|XMLHttpRequest|<img[^>]+src=["']https?:/.test(PAGE), 'motif reseau present');
check('aucun secret en clair', !/(password|token|api[_-]?key)\s*:\s*["']?(?!\$\{|\{\{|&|<)[A-Za-z0-9_\-.]{6,}/i.test(PAGE), 'secret detecte');
check('chaque bouton icone a un aria-label',
  [...PAGE.matchAll(/<button\b[^>]*>/g)].filter((m) => /iconbtn|burger|class="copy"/.test(m[0]) && !/aria-label=/.test(m[0])).length === 0,
  'bouton sans aria-label');
/* La nav vit desormais dans SiteHeader.astro (barre commune a tout le site). */
const HEADER = fs.readFileSync(path.join(ROOT, 'src', 'components', 'SiteHeader.astro'), 'utf8');
check('lien VS Code apres Migrate dans la nav',
  /href: '\/migrate'[^\n]*\n\s*\{ href: '\/vscode'/.test(HEADER), 'ordre de navigation');
check('autant de panneaux que d onglets', (PAGE.match(/data-panel/g) || []).length === 1, 'le panneau est rendu par map');
check('chaque commande est copiable', (PAGE.match(/class="cmd"/g) || []).length === (PAGE.match(/class="copy"/g) || []).length,
  (PAGE.match(/class="cmd"/g) || []).length + ' cmd / ' + (PAGE.match(/class="copy"/g) || []).length + ' copy');
check('chaque etape montre un resultat attendu',
  (PAGE.match(/class="step"/g) || []).length === (PAGE.match(/class="expect"/g) || []).length,
  (PAGE.match(/class="step"/g) || []).length + ' step / ' + (PAGE.match(/class="expect"/g) || []).length + ' expect');

/* ── 6. Captures d'ecran ────────────────────────────────────────────────── */
console.log('\n[6] captures d ecran');
const imgs = [...PAGE.matchAll(/<img\b[^>]*>/g)].map((m) => m[0])
  .filter((t) => /\/tutorials\/vscode\//.test(t));
check('les huit captures sont utilisees', imgs.length === 8, imgs.length + ' image(s)');
check('aucune capture en double',
  new Set(imgs.map((t) => /src="([^"]+)"/.exec(t)[1])).size === imgs.length, 'doublon');
check('chaque capture a un alt non vide',
  imgs.every((t) => /alt="[^"]{20,}"/.test(t)), 'alt manquant ou trop court');
check('chaque capture a width et height', imgs.every((t) => /width="\d+"/.test(t) && /height="\d+"/.test(t)),
  'dimensions absentes — decalage de mise en page au chargement');
check('chargement paresseux', imgs.every((t) => /loading="lazy"/.test(t)), 'loading absent');
check('aucune capture distante', imgs.every((t) => /src="\/tutorials\//.test(t)), 'src externe');

/* les fichiers existent reellement dans public/ */
const missing = imgs
  .map((t) => /src="([^"]+)"/.exec(t)[1])
  .filter((src) => !fs.existsSync(path.join(ROOT, 'public', src.replace(/^\//, ''))));
check('chaque fichier existe dans public/', missing.length === 0, missing.join(', '));

check('chaque capture porte une legende',
  (PAGE.match(/<figcaption>/g) || []).length === imgs.length,
  (PAGE.match(/<figcaption>/g) || []).length + ' legende(s) pour ' + imgs.length + ' image(s)');

check('les deux voies d installation sont presentes',
  (PAGE.match(/class="route"/g) || []).length === 2, (PAGE.match(/class="route"/g) || []).length + ' voie(s)');

check('le test des snippets mentionne la touche Esc',
  /<kbd>Esc<\/kbd>[\s\S]{0,120}hsrc-pg/.test(PAGE), 'etape Esc absente');

console.log('\n' + '='.repeat(56));
console.log(fail ? `ECHEC — ${fail} test(s) en echec sur ${pass + fail}` : `Tous les tests passent (${pass})`);
process.exit(fail ? 1 : 0);
