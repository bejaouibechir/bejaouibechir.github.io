/*
  Barre de navigation commune (src/components/SiteHeader.astro).
  Verifie sur des pages de chaque famille (shells, maquettes, pages .astro) :
  une seule barre, lien actif, theme qui bascule UNE fois (pas de double
  gestionnaire), tiroir mobile, recherche globale, aucun debordement mobile.

  Prerequis : site servi sur HYDRA_SITE_URL (defaut http://localhost:4321).
  Navigateur : HYDRA_BROWSER_PATH (sinon celui de Playwright).
*/
const { chromium } = require('playwright');

const BASE = process.env.HYDRA_SITE_URL || 'http://localhost:4321';
const PAGES = [
  ['/get-started', 'Get started'],
  ['/install', 'Get started'],
  ['/build', 'Get started'],
  ['/firstjob', 'Get started'],
  ['/cli', 'Hydra CLI'],
  ['/studio/04-use-the-palette', 'Hydra Studio'],
  ['/playground', 'Playground'],
  ['/dsl', 'Hydra DSL'],
  ['/dsl/transformations/columns', 'Hydra DSL'],
  ['/guide', 'Guide'],
  ['/guide/sources/csv', 'Guide'],
  ['/migrate', 'Migrate'],
  ['/migrate/airflow', 'Migrate'],
  ['/vscode', 'VS Code extension'],
];

(async () => {
  const launch = { headless: true };
  if (process.env.HYDRA_BROWSER_PATH) launch.executablePath = process.env.HYDRA_BROWSER_PATH;
  const browser = await chromium.launch(launch);
  const failures = [];
  let checks = 0;
  const check = (ok, msg) => { checks++; if (!ok) failures.push(msg); };

  const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const mob = await browser.newPage({ viewport: { width: 390, height: 900 } });
  const errors = [];
  for (const p of [desk, mob]) p.on('pageerror', (e) => errors.push(`${p.url()}: ${e.message}`));

  for (const [route, active] of PAGES) {
    await desk.goto(`${BASE}${route}/`, { waitUntil: 'load' });
    check(await desk.locator('.sh-top').count() === 1, `${route}: expected one site header`);
    check(await desk.locator('.topbar').count() === 0, `${route}: legacy .topbar still present`);
    check(await desk.locator('#themeBtn').count() === 1, `${route}: #themeBtn must be unique`);
    const on = await desk.locator('.sh-nav a.sh-on').allTextContents();
    check(on.length === 1 && on[0] === active, `${route}: active link is ${JSON.stringify(on)}, expected ${active}`);

    const before = await desk.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await desk.click('#themeBtn');
    const after = await desk.evaluate(() => document.documentElement.getAttribute('data-theme'));
    check(before !== after, `${route}: theme did not toggle exactly once (${before} -> ${after})`);
    await desk.click('#themeBtn');

    await desk.click('.sh-search');
    check(await desk.locator('#hsOverlay.open').count() === 1, `${route}: search button does not open site search`);
    await desk.keyboard.press('Escape');

    await mob.goto(`${BASE}${route}/`, { waitUntil: 'load' });
    check(await mob.locator('#burger').isVisible(), `${route}: burger hidden on mobile`);
    await mob.click('#burger');
    check(await mob.locator('#drawer.open').count() === 1, `${route}: drawer does not open`);
    check(await mob.getAttribute('#burger', 'aria-expanded') === 'true', `${route}: aria-expanded not updated`);
    await mob.keyboard.press('Escape');
    check(await mob.locator('#drawer.open').count() === 0, `${route}: Escape does not close drawer`);
    const sw = await mob.evaluate(() => document.documentElement.scrollWidth);
    check(sw <= 391, `${route}: mobile page is ${sw}px wide`);
  }

  check(errors.length === 0, `JS errors:\n  ${errors.join('\n  ')}`);
  await browser.close();
  if (failures.length) {
    console.error(failures.join('\n'));
    console.error(`ECHEC — ${failures.length} sur ${checks}`);
    process.exit(1);
  }
  console.log(`Header checks passed: ${checks} verifications sur ${PAGES.length} pages.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
