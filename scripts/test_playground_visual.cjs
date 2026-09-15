/**
 * test_playground_visual.cjs — verification de rendu de /playground.
 *
 * Complete test_playground.cjs, qui ne lit que les fichiers source. Celui-ci
 * ouvre reellement la page et mesure la geometrie : centrage du bandeau,
 * lisibilite du menu « + step », effet de la poignee de redimensionnement.
 *
 * Prerequis : le site tourne (npm run dev) et un navigateur est disponible.
 *
 *   node scripts/test_playground_visual.cjs
 *
 * Variables d'environnement :
 *   HYDRA_SITE_URL      defaut http://localhost:4321
 *   HYDRA_BROWSER_PATH  defaut Microsoft Edge sous Windows
 */
const { chromium } = require('playwright');

const BASE = process.env.HYDRA_SITE_URL || 'http://localhost:4321';
const EXE = process.env.HYDRA_BROWSER_PATH
  || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
  const results = [];
  const ok = (cond, label) => results.push([Boolean(cond), label]);

  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(String(e)));

  await page.goto(`${BASE}/playground`, { waitUntil: 'networkidle' });

  // -- 1. Le bandeau est centre ---------------------------------------------
  const flow = await page.evaluate(() => {
    const el = document.getElementById('jobFlow');
    const box = el.getBoundingClientRect();
    const parts = [...el.querySelectorAll('.jfnode, .jfarr')];
    const left = Math.min(...parts.map(n => n.getBoundingClientRect().left));
    const right = Math.max(...parts.map(n => n.getBoundingClientRect().right));
    const state = document.getElementById('runState').getBoundingClientRect();
    return {
      leftGap: left - box.left,
      rightGap: box.right - right,
      overlaps: state.left < right,
    };
  });
  const skew = Math.abs(flow.leftGap - flow.rightGap);
  ok(skew <= 12, `groupe centre a ${Math.round(skew)}px pres`);
  ok(!flow.overlaps, "l'etat du run ne recouvre pas le dernier noeud");

  // -- 2. Le menu « + step » est lisible ------------------------------------
  await page.click('#hAddStep');
  await page.waitForTimeout(200);
  const items = await page.evaluate(() =>
    [...document.querySelectorAll('#addMenu .ai')].map(a => {
      const n = a.querySelector('.n').getBoundingClientRect();
      const d = a.querySelector('.d').getBoundingClientRect();
      return { op: a.dataset.op, dW: d.width, dH: d.height, gap: d.top - n.bottom };
    }));
  ok(items.length >= 5, `${items.length} operations dans le menu`);
  ok(items.every(i => i.dW > 60), 'chaque description occupe toute la largeur');
  ok(items.every(i => i.dH >= 12), 'chaque description a une hauteur de texte');
  ok(items.every(i => i.gap >= -1), 'aucun chevauchement nom / description');
  await page.keyboard.press('Escape');
  await page.mouse.click(5, 5);
  await page.waitForTimeout(150);

  // -- 3. La poignee redimensionne ------------------------------------------
  const widthOf = () => page.evaluate(() =>
    document.querySelector('#stageWrap > .panel.side:last-child').getBoundingClientRect().width);

  const before = await widthOf();
  const box = await page.locator('#destSplit').boundingBox();
  ok(box && box.width >= 4 && box.height > 80, 'la poignee est visible et saisissable');

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 - 200, box.y + box.height / 2, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(200);
  const wider = await widthOf();
  ok(wider > before + 150, `le panneau s'elargit : ${Math.round(before)} -> ${Math.round(wider)}`);

  await page.mouse.move(box.x + box.width / 2 - 200, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 400, box.y + box.height / 2, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(200);
  const narrow = await widthOf();
  ok(narrow >= 185 && narrow < wider, `le panneau se retrecit sans disparaitre : ${Math.round(narrow)}px`);

  await page.dblclick('#destSplit');
  await page.waitForTimeout(200);
  const reset = await widthOf();
  ok(Math.abs(reset - 224) <= 2, `le double-clic revient a 224px (${Math.round(reset)})`);

  // -- 4. Mention supprimee --------------------------------------------------
  const note = await page.locator('p.note').count();
  ok(note === 0, 'aucune mention « Static mock … » sur la page');

  // -- 5. Rien de casse ------------------------------------------------------
  ok(jsErrors.length === 0, `aucune erreur JS${jsErrors.length ? ' : ' + jsErrors[0] : ''}`);

  await page.screenshot({ path: 'playground-check.png', fullPage: false });

  console.log();
  console.log('  test_playground_visual.cjs — ' + BASE + '/playground');
  console.log('  ' + '-'.repeat(58));
  let failed = 0;
  for (const [pass, label] of results) {
    console.log(`  ${pass ? 'ok  ' : 'FAIL'}   ${label}`);
    if (!pass) failed++;
  }
  console.log('  ' + '-'.repeat(58));
  console.log(`  ${results.length - failed}/${results.length} verifications passent`);
  console.log('  capture : playground-check.png');
  console.log();

  await browser.close();
  process.exit(failed ? 1 : 0);
})();
