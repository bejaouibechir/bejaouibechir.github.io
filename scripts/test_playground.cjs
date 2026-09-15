/**
 * test_playground.cjs — controle statique des quatre corrections de /playground.
 *
 *   1. le bandeau « Pipeline builder » est centre ;
 *   2. une poignee redimensionne le panneau Destinations ;
 *   3. le menu « + step » n'est plus ecrase par la pastille du bandeau ;
 *   4. la mention « Static mock … » a disparu.
 *
 * Usage : node scripts/test_playground.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const body = fs.readFileSync(path.join(ROOT, 'src/_mock/playground.body.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'src/_mock/playground.css'), 'utf8');
const js = fs.readFileSync(path.join(ROOT, 'src/_mock/playground.js'), 'utf8');

const results = [];
const ok = (cond, label) => results.push([Boolean(cond), label]);

/** Retourne le corps de la premiere regle CSS dont le selecteur correspond. */
function rule(selector) {
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = css.match(new RegExp('(^|\\n)\\s*' + esc + '\\s*\\{([^}]*)\\}'));
  return m ? m[2] : null;
}
/** Corps d'une media query. */
function media(maxWidth) {
  const m = css.match(new RegExp('@media\\(max-width:' + maxWidth + 'px\\)\\{([\\s\\S]*?)\\n\\}'));
  return m ? m[1] : null;
}

// -- 1. Centrage du bandeau -------------------------------------------------
const jobflow = rule('.jobflow') || '';
ok(/position:relative/.test(jobflow), 'jobflow etablit un contexte de positionnement');
ok(/justify-content:center/.test(jobflow), 'le groupe de noeuds est centre');
const pad = jobflow.match(/padding:12px (\d+)px/);
ok(pad && Number(pad[1]) >= 120, `marges symetriques reservees (${pad ? pad[1] : '?'}px)`);

const runstate = rule('.runstate') || '';
ok(/position:absolute/.test(runstate), "l'etat du run sort du flux");
ok(/right:16px/.test(runstate) && /top:50%/.test(runstate), "l'etat du run est cale a droite");
ok(!/margin-left:auto/.test(runstate), "plus de margin-left:auto qui decalait le centrage");

const m980 = media(980) || '';
const m720 = media(720) || '';
ok(/\.runstate\{position:static/.test(m980), 'sous 980px, retour dans le flux');
ok(/\.runstate\{position:static/.test(m720), 'sous 720px, retour dans le flux');
ok(/\.jobflow\{padding:12px 16px/.test(m980), 'sous 980px, les marges de centrage tombent');

// -- 2. Poignee de redimensionnement ----------------------------------------
ok(/id="destSplit"/.test(body), 'la poignee existe dans le DOM');
ok(/role="separator"/.test(body) && /aria-orientation="vertical"/.test(body),
   'la poignee porte un role de separateur');
ok(/id="destSplit"[^>]*tabindex="0"/.test(body), 'la poignee est atteignable au clavier');
ok(/id="destSplit"[^>]*aria-label="[^"]+"/.test(body), 'la poignee porte un aria-label');

const iSplit = body.indexOf('id="destSplit"');
const iFiles = body.indexOf('<div class="files">');
const iDest = body.indexOf('Destinations <span');
ok(iFiles > -1 && iSplit > iFiles && iSplit < iDest,
   "la poignee est placee entre l'editeur et le panneau Destinations");

const stage = rule('.stage') || '';
ok(/var\(--pgDestW,\s*224px\)/.test(stage), 'la largeur du panneau vient de --pgDestW');
ok((stage.match(/grid-template-columns:[^;]*/) || [''])[0].split(' ').length === 4,
   'la grille compte quatre colonnes');

const vsplit = rule('.vsplit') || '';
ok(/cursor:col-resize/.test(vsplit), 'le curseur annonce le redimensionnement');
ok(/touch-action:none/.test(vsplit), 'le tactile est pris en charge');
ok(/\.vsplit\{display:none\}/.test(m980), 'la poignee disparait quand le panneau passe pleine largeur');

ok(/destSplit/.test(js), 'le script cible la poignee');
ok(/pointerdown/.test(js) && /pointermove/.test(js) && /pointerup/.test(js),
   'glisser-deposer via les evenements pointeur');
ok(/setPointerCapture/.test(js), 'le pointeur est capture pendant le glissement');
ok(/Math\.max\(MIN,\s*Math\.min\(MAX/.test(js), 'la largeur est bornee');
ok(/dblclick/.test(js), 'le double-clic remet la largeur par defaut');
ok(/ArrowLeft/.test(js) && /ArrowRight/.test(js), 'les fleches ajustent la largeur');
ok(/sessionStorage/.test(js), 'la largeur est memorisee pour la session');
ok(/aria-valuenow/.test(js), 'la valeur courante est exposee aux lecteurs d ecran');
ok(!/fetch\(|XMLHttpRequest/.test(js.slice(js.indexOf('destSplit'))),
   'aucun appel reseau ajoute');

// -- 3. Menu « + step » -----------------------------------------------------
ok(rule('.file-h > .d') !== null, 'la pastille du bandeau cible un enfant direct');
ok(rule('.file-h .d') === null, 'plus de selecteur descendant qui fuit dans le menu');
ok(rule('.file.mut .file-h > .d') !== null, 'la variante muette cible aussi un enfant direct');

const aid = rule('.addmenu .ai .d') || '';
ok(/display:block/.test(aid), 'la description du menu est un bloc');
ok(/width:auto/.test(aid) && /height:auto/.test(aid), 'la description reprend ses dimensions');
ok(/background:none/.test(aid), 'la description n a plus de fond de pastille');
ok(/line-height/.test(aid), 'la description a un interligne explicite');

const ain = rule('.addmenu .ai .n') || '';
ok(/display:block/.test(ain), 'le nom de l operation est un bloc');
ok(/line-height/.test(ain), 'le nom a un interligne explicite');

// La pastille reste une pastille dans le bandeau.
const dot = rule('.file-h > .d') || '';
ok(/width:7px/.test(dot) && /height:7px/.test(dot), 'la pastille garde ses 7px');

// -- 4. Mention supprimee ---------------------------------------------------
ok(!/Static mock/.test(body), 'la mention « Static mock … » a disparu');
ok(!/class="note"/.test(body), 'plus de paragraphe .note sur la page');

// -- Rapport ----------------------------------------------------------------
console.log();
console.log('  test_playground.cjs');
console.log('  ' + '-'.repeat(58));
let failed = 0;
for (const [pass, label] of results) {
  console.log(`  ${pass ? 'ok  ' : 'FAIL'}   ${label}`);
  if (!pass) failed++;
}
console.log('  ' + '-'.repeat(58));
console.log(`  ${results.length - failed}/${results.length} verifications passent`);
console.log();
process.exit(failed ? 1 : 0);
