/*
  Test de fidélité : le moteur JavaScript du site doit reproduire exactement les sorties
  du moteur Python de Hydra, enregistrées comme fixtures par Hydra/scripts/gen_fixtures.py.

  Usage : node scripts/test_engine.cjs
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FIX = path.join(ROOT, 'src', '_fixtures');
const ENGINE = path.join(ROOT, 'src', 'scripts', 'dsl-engine.js');

const module_ = { exports: {} };
new Function('module', 'exports', fs.readFileSync(ENGINE, 'utf8'))(module_, module_.exports);
const H = module_.exports;

/* comparaison : arrondi des flottants à 9 décimales, l'ordre des lignes compte */
const norm = (v) => (typeof v === 'number' && !Number.isInteger(v) ? Number(v.toFixed(9)) : v);
function same(a, b) {
  if (a.length !== b.length) return `nombre de lignes ${a.length} au lieu de ${b.length}`;
  for (let i = 0; i < a.length; i++) {
    const ka = Object.keys(a[i]), kb = Object.keys(b[i]);
    if (ka.join('|') !== kb.join('|')) return `ligne ${i} : colonnes [${ka}] au lieu de [${kb}]`;
    for (const k of kb) {
      const x = norm(a[i][k]), y = norm(b[i][k]);
      if (x !== y && !(x === null && y === null)) {
        return `ligne ${i}, colonne ${k} : ${JSON.stringify(x)} au lieu de ${JSON.stringify(y)}`;
      }
    }
  }
  return null;
}

/*
  Cas particulier de `sort`. pandas trie avec numpy quicksort, qui n'est pas stable :
  l'ordre de deux lignes de meme cle est un artefact de l'implementation, pas une regle
  du DSL. On verifie donc ce qui est specifie — la suite des cles de tri — et l'identite
  de l'ensemble des lignes, pas l'ordre des ex aequo.
*/
function sameSort(got, exp, params) {
  const by = [].concat(params.by);
  if (got.length !== exp.length) return `nombre de lignes ${got.length} au lieu de ${exp.length}`;
  for (let i = 0; i < exp.length; i++) {
    const a = JSON.stringify(by.map((c) => norm(got[i][c])));
    const b = JSON.stringify(by.map((c) => norm(exp[i][c])));
    if (a !== b) return `ligne ${i} : cle de tri ${a} au lieu de ${b}`;
  }
  const key = (rows) => rows.map((r) => JSON.stringify(r)).sort().join('\u0001');
  if (key(got) !== key(exp)) return 'les lignes ne sont pas les memes (au-dela de l ordre)';
  return null;
}

const index = JSON.parse(fs.readFileSync(path.join(FIX, 'index.json'), 'utf8'));
let pass = 0, fail = 0;

for (const c of index.cases) {
  const f = JSON.parse(fs.readFileSync(path.join(FIX, `${c.op}.json`), 'utf8'));
  let got, err = null;
  try {
    got = H.applyOp(f.input, f.op, f.params, f.right);
  } catch (e) {
    err = e.message;
  }
  let diff;
  if (err) diff = `exception : ${err}`;
  else if (c.op === 'sort') diff = sameSort(got, f.expected, f.params);
  else diff = same(got, f.expected);
  if (diff) { fail++; console.log(`  ECHEC  ${c.op.padEnd(12)} ${diff}`); }
  else {
    pass++;
    const note = c.op === 'sort' ? 'cles de tri identiques (ordre des ex aequo non specifie)' : 'lignes identiques au moteur Python';
    console.log(`  ok     ${c.op.padEnd(12)} ${f.expected.length} ${note}`);
  }
}

/* script doit être refusé explicitement, jamais ignoré */
let refused = false;
try { H.applyOp([{ a: 1 }], 'script', { code: 'x = 1' }); } catch (e) { refused = /n'est pas simulée/.test(e.message); }
if (refused) { pass++; console.log('  ok     script       refusé explicitement, comme prévu'); }
else { fail++; console.log('  ECHEC  script       devrait être refusé avec un message'); }

console.log(`\n${pass} opérations fidèles, ${fail} en écart`);
process.exit(fail ? 1 : 0);
