/*
  Test de l'agrandissement des captures — charte, regles 6 et 10.

  learning-hub.js est partage par les 25 pages de la piste d'apprentissage. On
  verifie donc deux choses : que le mecanisme fonctionne la ou il y a des
  captures, et qu'il reste inerte la ou il n'y en a pas.

  Le stub reproduit ce que le script consomme reellement : querySelectorAll,
  createElement, closest, et l'API <dialog> (showModal / close).

  Usage : node scripts/test_lightbox.cjs
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JS = fs.readFileSync(path.join(ROOT, 'src', '_mock', 'learning-hub.js'), 'utf8');
const CSS = fs.readFileSync(path.join(ROOT, 'src', '_mock', 'cli-lesson.css'), 'utf8');
const LESSON = fs.readFileSync(
  path.join(ROOT, 'src', '_mock', 'studio-lesson-01-open-a-project.main.html'), 'utf8');

let pass = 0, fail = 0;
function check(name, cond, got) {
  if (cond) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  FAIL ' + name + '  ->  ' + got); }
}

/* ── DOM minimal ────────────────────────────────────────────────────────── */
function El(tag) {
  const el = {
    tagName: (tag || 'div').toUpperCase(), _a: {}, _h: {}, children: [], parent: null,
    className: '', src: '', alt: '', tabIndex: undefined, textContent: '', _innerHTML: '',
    open: false, _focused: false,
    set innerHTML(v) { this._innerHTML = v; },
    get innerHTML() { return this._innerHTML; },
    setAttribute(k, v) { this._a[k] = String(v); },
    getAttribute(k) { return k in this._a ? this._a[k] : null; },
    addEventListener(t, f) { (this._h[t] = this._h[t] || []).push(f); },
    appendChild(c) { c.parent = this; this.children.push(c); return c; },
    focus() { this._focused = true; },
    closest(sel) {
      let n = this;
      while (n) { if (n._matches && n._matches(sel)) return n; n = n.parent; }
      return null;
    },
    querySelector() { return null; },
    showModal() { this.open = true; },
    close() { this.open = false; },
    fire(type, extra) {
      let prevented = false;
      const ev = Object.assign(
        { type, target: this, preventDefault() { prevented = true; } }, extra);
      (this._h[type] || []).forEach((f) => f.call(this, ev));
      return prevented;
    },
  };
  return el;
}

function buildDom(shotCount) {
  const shots = [];
  for (let i = 0; i < shotCount; i++) {
    const fig = El('figure');
    fig._matches = (s) => s === 'figure';
    const cap = El('figcaption');
    cap.textContent = 'Caption ' + i;
    const img = El('img');
    img.src = '/tutorials/studio-01-open-a-project/screen' + (i + 1) + '.png';
    img.alt = 'Screenshot number ' + (i + 1);
    fig.appendChild(img);
    fig.appendChild(cap);
    fig.querySelector = (s) => (s === 'figcaption' ? cap : null);
    shots.push(img);
  }
  const body = El('body');
  global.document = {
    body,
    getElementById() { return null; },
    querySelectorAll(sel) {
      if (sel === '.shot img') return shots;
      return [];
    },
    createElement(tag) {
      const el = El(tag);
      if (tag === 'dialog') {
        el.querySelector = (s) => {
          if (s === 'img') return el._img || (el._img = El('img'));
          if (s === '.lightbox-cap') return el._cap || (el._cap = El('p'));
          if (s === '.lightbox-close') return el._btn || (el._btn = El('button'));
          return null;
        };
      }
      return el;
    },
    documentElement: { getAttribute: () => null, setAttribute() {} },
    addEventListener() {},
  };
  global.window = global;
  global.HTMLDialogElement = function () {};
  global.IntersectionObserver = undefined;
  global.localStorage = { setItem() {}, getItem: () => null };
  global.setTimeout = (fn) => fn;
  return { shots, body };
}

/* ── 1. Page avec captures ──────────────────────────────────────────────── */
console.log('\n[1] page portant des captures');
let dom = buildDom(8);
eval(JS);
let dialog = dom.body.children.find((c) => c.tagName === 'DIALOG');
check('un dialog est cree', !!dialog, 'aucun');
check('un seul dialog', dom.body.children.filter((c) => c.tagName === 'DIALOG').length === 1);
check('chaque image devient atteignable au clavier',
  dom.shots.every((i) => i.tabIndex === 0), dom.shots.map((i) => i.tabIndex).join(','));
check('chaque image est annoncee comme un bouton',
  dom.shots.every((i) => i.getAttribute('role') === 'button'));
check('chaque image porte un aria-label explicite',
  dom.shots.every((i) => /^Enlarge this screenshot: /.test(i.getAttribute('aria-label') || '')),
  dom.shots[0].getAttribute('aria-label'));

console.log('\n[2] ouverture');
dom.shots[6].fire('click');
check('le clic ouvre la vue', dialog.open === true, dialog.open);
check('la bonne image est chargee', dialog.querySelector('img').src === dom.shots[6].src,
  dialog.querySelector('img').src);
check('le texte alternatif suit', dialog.querySelector('img').alt === dom.shots[6].alt);
check('la legende suit', dialog.querySelector('.lightbox-cap').textContent === 'Caption 6',
  dialog.querySelector('.lightbox-cap').textContent);

console.log('\n[3] clavier');
dialog.close();
check('Entree ouvre', (dom.shots[7].fire('keydown', { key: 'Enter' }), dialog.open) === true);
dialog.close();
check('Espace ouvre', (dom.shots[7].fire('keydown', { key: ' ' }), dialog.open) === true);
check('Espace annule le defilement de la page',
  (dialog.close(), dom.shots[7].fire('keydown', { key: ' ' })) === true);
dialog.close();
dom.shots[7].fire('keydown', { key: 'a' });
check('une touche inerte n ouvre rien', dialog.open === false, dialog.open);

console.log('\n[4] fermeture');
dom.shots[0].fire('click');
dialog.querySelector('.lightbox-close').fire('click');
check('le bouton ferme', dialog.open === false, dialog.open);
dom.shots[0].fire('click');
dialog.fire('click', { target: dialog });
check('un clic sur le fond ferme', dialog.open === false, dialog.open);
dom.shots[0].fire('click');
dialog.fire('click', { target: dialog.querySelector('img') });
check('un clic sur l image ne ferme pas', dialog.open === true, dialog.open);

/* ── 5. Page sans capture : le mecanisme doit rester inerte ─────────────── */
console.log('\n[5] page sans capture');
dom = buildDom(0);
eval(JS);
check('aucun dialog cree', dom.body.children.filter((c) => c.tagName === 'DIALOG').length === 0,
  'un dialog inutile est injecte');

/* ── 6. Styles et balisage ──────────────────────────────────────────────── */
console.log('\n[6] styles et balisage');
check('curseur zoom-in', /\.shot img\[role="button"\]\{[^}]*cursor:zoom-in/.test(CSS));
check('anneau de focus visible', /\.shot img\[role="button"\]:focus-visible\{[^}]*outline:/.test(CSS));
check('fond du dialog defini', /dialog\.lightbox::backdrop/.test(CSS));
check('bouton de fermeture stylise', /\.lightbox-close\{/.test(CSS));
check('les deux captures de l etape 07 sont dans une grille',
  /<div class="shots">[\s\S]*?screen7\.png[\s\S]*?screen8\.png[\s\S]*?<\/div>/.test(LESSON));
check('les huit captures sont concernees',
  (LESSON.match(/class="shot"/g) || []).length === 8,
  (LESSON.match(/class="shot"/g) || []).length);
check('aucun appel reseau ajoute', !/\bfetch\s*\(|XMLHttpRequest/.test(JS));

console.log('\n' + '='.repeat(56));
console.log(fail ? `ECHEC — ${fail} test(s) en echec sur ${pass + fail}` : `Tous les tests passent (${pass})`);
process.exit(fail ? 1 : 0);
