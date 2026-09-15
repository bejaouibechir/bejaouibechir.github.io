const { chromium } = require('playwright');

const BASE = process.env.HYDRA_SITE_URL || 'http://localhost:4321';

(async () => {
  const executablePath = process.env.HYDRA_BROWSER_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage();
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };

  await page.goto(`${BASE}/guide`, { waitUntil: 'networkidle' });
  const cards = page.locator('#catalog .card');
  check(await cards.count() === 41, `catalogue: ${await cards.count()} cards instead of 41`);
  check(await page.locator('#catalog .soon, #catalog .notyet').count() === 0, 'catalogue still contains soon/notyet cards');

  const hrefs = await cards.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  check(new Set(hrefs).size === 41, 'catalogue routes are not unique');
  for (const href of hrefs) {
    const response = await page.request.get(`${BASE}${href}`);
    check(response.ok(), `${href}: HTTP ${response.status()}`);
  }

  const generated = hrefs.filter((href) => href !== '/guide/sources/csv');
  for (const href of generated) {
    await page.goto(`${BASE}${href}`, { waitUntil: 'domcontentloaded' });
    check(await page.locator('main h1').count() === 1, `${href}: expected one content h1`);
    check(await page.locator('.workbench').count() === 1, `${href}: workbench missing`);
    check(await page.locator('.doc h2').count() >= 5, `${href}: workshop sections missing`);
    const before = await page.locator('#tourCount').textContent();
    await page.locator('#tourNext').click();
    const after = await page.locator('#tourCount').textContent();
    check(before !== after, `${href}: Next does not change step`);
    await page.locator('#resetBtn').click();
    check((await page.locator('#tourCount').textContent() || '').includes('Step 1'), `${href}: reset does not return to step 1`);
  }

  await page.goto(`${BASE}/guide/sources/json`, { waitUntil: 'domcontentloaded' });
  await page.locator('#searchBtn').click();
  await page.locator('#palInput').fill('retrying');
  check(await page.locator('.palitem:not([hidden])').count() === 1, 'Guide palette does not filter to one matching workshop');

  await browser.close();
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
  }
  console.log(`Guide checks passed: 41 cards, ${hrefs.length} live routes, ${generated.length} generated workshops, interactions and search.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
