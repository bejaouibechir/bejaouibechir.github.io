/* Generate the documentation pages listed in src/data/dsl-page-content.json. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MOCK = path.join(ROOT, 'src', '_mock');
const ROUTES = path.join(ROOT, 'src', 'pages', 'dsl');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'dsl-page-content.json'), 'utf8'));

const RUN_HELP = 'hdrctl run --help';
const RUN_SYNTAX = 'hdrctl run [PATH]\n  -s, --sources FILE          explicit path to sources.yaml\n  -d, --destinations FILE     explicit path to destinations.yaml\n  -t, --transformations FILE  explicit path to transformations.yaml\n  -P, --param KEY=VALUE       override a parameter, repeatable';
const WORKFLOW_HELP = 'hdrctl workflow run --help';
const WORKFLOW_SYNTAX = 'hdrctl workflow run PATH\n  PATH          path to workflow.yaml\n  --lang LANG   interface language\n  -h, --help    show command help';
const FIXTURES = {
  source: {
    fullYaml: `version: "1.0"
sources:
  src_orders:
    type: csv
    connection:
      base_path: "data/canonical"
    extract:
      table: orders.csv
      batch_size: 10000
    schema:
      mode: manual
      fields:
        - name: order_id
          type: string
          required: true
        - name: amount
          type: float
      drift_policy: warn
      validation_policy: best_effort
      sample_size: 100
  src_orders_extra:
    type: csv
    connection:
      base_path: "data/canonical"
    extract:
      table: orders_extra.csv
      batch_size: 10000`,
    command: 'hdrctl run examples/tutorial/dsl-elements',
    output: '  ✅ Pipeline completed successfully in 2.6s\n  Rows read   : 30\n  Rows written: 6', help: RUN_HELP, syntax: RUN_SYNTAX,
  },
  destination: {
    fullYaml: `version: "1.0"
destinations:
  dest_output:
    type: csv
    connection:
      base_path: "examples/tutorial/dsl-elements/out"
    load:
      table: result.csv
      mode: replace
      batch_size: 10000`,
    command: 'hdrctl run examples/tutorial/dsl-elements',
    output: '  ✅ Pipeline completed successfully in 2.6s\n  Rows read   : 30\n  Rows written: 6', help: RUN_HELP, syntax: RUN_SYNTAX,
  },
  steps: {
    fullYaml: `version: "1.0"
transformations:
  steps:
    - cast:
        mapping:
          amount: float
    - filter:
        expr: "amount > 50"`,
    command: 'hdrctl run examples/tutorial/dsl-elements',
    output: '  ✅ Pipeline completed successfully in 2.6s\n  Rows read   : 30\n  Rows written: 6', help: RUN_HELP, syntax: RUN_SYNTAX,
  },
  columns: {
    fullYaml: `version: "1.0"
transformations:
  steps:
    - cast:
        mapping: {amount: float}
    - rename:
        mapping: {amount: total_amount}
    - select:
        columns: [order_id, customer_id, total_amount, status]`,
    command: 'hdrctl run examples/tutorial/dsl-elements -t columns.yaml',
    output: '  ✅ Pipeline completed successfully in 2.4s\n  Rows read   : 30\n  Rows written: 30', help: RUN_HELP, syntax: RUN_SYNTAX,
  },
  compute: {
    fullYaml: `version: "1.0"
transformations:
  steps:
    - cast:
        mapping: {amount: float}
    - calculate:
        column: amount_with_tax
        expr: "amount * 1.2"`,
    command: 'hdrctl run examples/tutorial/dsl-elements -t compute.yaml',
    output: '  ✅ Pipeline completed successfully in 2.9s\n  Rows read   : 30\n  Rows written: 30', help: RUN_HELP, syntax: RUN_SYNTAX,
  },
  aggregate: {
    fullYaml: `version: "1.0"
transformations:
  steps:
    - cast:
        mapping: {amount: float}
    - aggregate:
        by: [status]
        agg:
          total_amount: {func: sum, col: amount}
          order_count: {func: count, col: order_id}`,
    command: 'hdrctl run examples/tutorial/dsl-elements -t aggregate.yaml',
    output: '  ✅ Pipeline completed successfully in 4.0s\n  Rows read   : 30\n  Rows written: 3', help: RUN_HELP, syntax: RUN_SYNTAX,
  },
  combine: {
    fullYaml: `version: "1.0"
transformations:
  steps:
    - union:
        right: src_orders_extra
        distinct: false`,
    command: 'hdrctl run examples/tutorial/dsl-elements -t combine.yaml',
    output: '  ✅ Pipeline completed successfully in 2.7s\n  Rows read   : 30\n  Rows written: 34', help: RUN_HELP, syntax: RUN_SYNTAX,
  },
  reshape: {
    fullYaml: `version: "1.0"
transformations:
  steps:
    - unpivot:
        id_vars: [region]
        value_vars: [q1, q2, q3, q4]
        var_name: quarter
        value_name: revenue`,
    command: 'hdrctl run examples/tutorial/dsl-elements -s sources-revenue.yaml -t reshape.yaml',
    output: '  ✅ Pipeline completed successfully in 3.7s\n  Rows read   : 5\n  Rows written: 20', help: RUN_HELP, syntax: RUN_SYNTAX,
  },
  script: {
    fullYaml: `version: "1.0"
transformations:
  steps:
    - cast:
        mapping: {amount: float}
    - script:
        inputs: [amount]
        outputs: {amount_with_tax: float}
        mode: row
        code: |
          amount_with_tax = amount * 1.2`,
    command: 'hdrctl run examples/tutorial/dsl-elements -t script.yaml',
    output: '  ✅ Pipeline completed successfully in 2.4s\n  Rows read   : 30\n  Rows written: 30', help: RUN_HELP, syntax: RUN_SYNTAX,
  },
  parameters: {
    fullYaml: `version: "1.0"
transformations:
  steps:
    - cast:
        mapping: {amount: float}
    - filter:
        expr: "amount > {{ param:MIN_AMOUNT }}"`,
    command: 'hdrctl run examples/tutorial/dsl-elements -t parameter-filter.yaml -P MIN_AMOUNT=50',
    output: '  ✅ Pipeline completed successfully in 3.6s\n  Rows read   : 30\n  Rows written: 6', help: RUN_HELP, syntax: RUN_SYNTAX,
  },
  workflow: {
    fullYaml: `workflow:
  version: "1.0"
  name: docs_workflow
  description: Two actions used by the DSL documentation.
  trigger: {type: manual}
  steps:
    - name: prepare
      type: action
      action: log
      params: {message: "Preparation complete."}
      retry: {max: 2, delay: 0, backoff: fixed}
    - name: publish
      type: action
      action: log
      params: {message: "Publication complete."}
      depends_on: [prepare]
      when: "1 == 1"
      on_failure: fail`,
    command: 'hdrctl workflow run examples/tutorial/dsl-elements/workflow.yaml',
    output: "  ✓  Step 'prepare' OK (0.0s)\n  ✓  Step 'publish' OK (0.0s)\n\n  ✅ Workflow 'docs_workflow' completed in 0.0s — 2/2 steps OK",
    help: WORKFLOW_HELP, syntax: WORKFLOW_SYNTAX,
  },
};

for (const page of pages) {
  Object.assign(page, FIXTURES[page.fixture], page);
  page.runIntro ||= 'Copy this manifest from the verified documentation project, then run it from the repository root.';
  page.cases = page.cases.map(([value, label, yaml, notes, status]) => ({ value, label, yaml, notes, status }));
  page.tour = page.tour.map(([key, title, match, bubble, context]) => ({ key, title, match, bubble, context }));
}

const esc = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function head(p) {
  const options = p.cases.map((c) => `        <option value="${c.value}">${esc(c.label)}</option>`).join('\n');
  return `<div class="crumbs"><a href="/dsl">Hydra DSL</a><span>›</span><span>${p.chapter} · ${p.group}</span><span>›</span><span>${esc(p.label)}</span></div>

<div class="lesson-head">
  <div>
    <div class="eyebrow"><span class="dot"></span>Grammar element · ${esc(p.element)}</div>
    <h1>${p.title}</h1>
    <p class="lead">${p.lead}</p>
  </div>
</div>

<section class="workbench" aria-labelledby="goalTitle">
  <div class="editor-pane">
    <div class="pane-head"><span class="file-dot"></span><strong>${p.file}</strong><span class="edit-label">4 steps</span></div>
    <div class="codewrap" id="codewrap" aria-label="Hydra DSL manifest">
      <pre class="yaml" id="yaml"></pre>
      <div class="bubble" id="bubble" role="status" aria-live="polite"></div>
    </div>
    <div class="tourbar" role="group" aria-label="Guided walkthrough">
      <button class="tourbtn" id="tourPrev" type="button">‹ Back</button>
      <span class="tourpos"><b id="tourCount"></b><span id="tourTitle"></span></span>
      <button class="tourbtn primary" id="tourNext" type="button">Next ›</button>
    </div>
    <div class="control">
      <label for="selCase"><span>${p.selector}</span></label>
      <select id="selCase">
${options}
      </select>
    </div>
  </div>

  <div class="result-pane">
    <div class="goal"><div class="goal-icon" aria-hidden="true">${p.chapter}</div><div><b id="goalTitle">${p.goalTitle}</b><p>${p.goalText}</p></div></div>
    <div class="tourctx" id="tourContext"></div>
    <div class="verdict tall" id="verdict" aria-live="polite"></div>
    <div class="runbar">
      <span class="status ok" id="status" role="status" aria-live="polite">${p.cases[0].status}</span>
      <button class="btn" id="resetBtn" type="button">↺ Reset</button>
    </div>
  </div>
</section>
`;
}

function script(p) {
  const payload = JSON.stringify({ cases: p.cases, tour: p.tour });
  return `/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = ${payload};
  var $ = function (id) { return document.getElementById(id); };
  function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function paint(line) {
    var safe = escapeHtml(line);
    return safe.replace(/^(\s*(?:-\s*)?)([A-Za-z_][A-Za-z0-9_.-]*:)/, '$1<span class="c-key">$2</span>');
  }
  function row(text) { return '<div class="vrow"><span class="vdot ok" aria-hidden="true"></span><span>' + text + '</span></div>'; }
  var step = 0;
  function currentCase() { return DATA.cases.find(function (c) { return c.value === $('selCase').value; }) || DATA.cases[0]; }
  function render() {
    var c = currentCase();
    $('yaml').innerHTML = c.yaml.split('\\n').map(function (line) {
      var keys = DATA.tour.filter(function (t) { return t.match.some(function (m) { return line.indexOf(m) >= 0; }); }).map(function (t) { return t.key; });
      return '<span class="yl" data-key="' + keys.join(' ') + '">' + paint(line) + '</span>';
    }).join('\\n');
    $('verdict').innerHTML = c.notes.map(row).join('');
    $('status').className = 'status ok';
    $('status').textContent = c.status;
    showStep(step);
  }
  function showStep(i) {
    step = Math.max(0, Math.min(DATA.tour.length - 1, i));
    var s = DATA.tour[step];
    document.querySelectorAll('.yl').forEach(function (el) { el.classList.remove('lit'); });
    var targets = Array.prototype.filter.call(document.querySelectorAll('.yl'), function (el) {
      return (' ' + el.getAttribute('data-key') + ' ').indexOf(' ' + s.key + ' ') >= 0;
    });
    targets.forEach(function (el) { el.classList.add('lit'); });
    var bubble = $('bubble');
    bubble.innerHTML = '<b>' + s.title + '</b><span>' + s.bubble + '</span>';
    bubble.classList.add('show');
    if (targets.length && bubble.getBoundingClientRect) {
      var wrap = $('codewrap').getBoundingClientRect();
      var first = targets[0].getBoundingClientRect();
      var last = targets[targets.length - 1].getBoundingClientRect();
      bubble.style.top = Math.max(8, (first.top + last.bottom) / 2 - wrap.top + $('codewrap').scrollTop - bubble.offsetHeight / 2) + 'px';
    }
    $('tourContext').innerHTML = '<b>' + s.title + '</b><p>' + s.context + '</p>';
    $('tourCount').textContent = 'Step ' + (step + 1) + ' of ' + DATA.tour.length;
    $('tourTitle').textContent = s.title;
    $('tourPrev').disabled = step === 0;
    $('tourNext').disabled = step === DATA.tour.length - 1;
    $('tourNext').textContent = step === DATA.tour.length - 1 ? 'End of walkthrough' : 'Next ›';
  }
  $('selCase').addEventListener('change', render);
  $('resetBtn').addEventListener('click', function () { $('selCase').value = DATA.cases[0].value; step = 0; render(); });
  $('tourPrev').addEventListener('click', function () { showStep(step - 1); });
  $('tourNext').addEventListener('click', function () { showStep(step + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.target && e.target.tagName && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') showStep(step - 1);
    if (e.key === 'ArrowRight') showStep(step + 1);
  });
  render();
})();
`;
}

function tail(p) {
  const contains = p.contains.map(([name, text]) => `    <li><b>${name}</b> — ${text}</li>`).join('\n');
  const links = p.close.map(([href, label]) => `    <li><a href="${href}">${label}</a></li>`).join('\n');
  const [a, b, c] = p.diagram;
  return `<section class="doc">
  <h2>What <code>${esc(p.element)}</code> is</h2>
  <p>${p.definition[0]}</p>
  <p>${p.definition[1]}</p>

  <h2>What it contains</h2>
  <ul>
${contains}
  </ul>

  <h2>${p.thesisTitle}</h2>
  <p>${p.thesis}</p>

  <figure class="diagram">
    <svg viewBox="0 0 720 126" role="img" aria-labelledby="${p.slug}Title ${p.slug}Desc" class="cnx">
      <title id="${p.slug}Title">${esc(p.diagramTitle)}</title>
      <desc id="${p.slug}Desc">${esc(p.diagramDesc)}</desc>
      <rect class="d-box" x="12" y="28" width="184" height="54" rx="9"/><text class="d-txt" x="28" y="52">${esc(a[0])}</text><text class="d-sub" x="28" y="70">${esc(a[1])}</text>
      <path class="d-arrow lit" d="M200 55 H 258" marker-end="url(#${p.slug}Arrow)"/>
      <rect class="d-box lit" x="266" y="20" width="188" height="70" rx="9"/><text class="d-key lit" x="282" y="48">${esc(b[0])}</text><text class="d-sub" x="282" y="68">${esc(b[1])}</text>
      <path class="d-arrow lit" d="M458 55 H 516" marker-end="url(#${p.slug}Arrow)"/>
      <rect class="d-box" x="524" y="28" width="180" height="54" rx="9"/><text class="d-txt" x="540" y="52">${esc(c[0])}</text><text class="d-sub" x="540" y="70">${esc(c[1])}</text>
      <text class="d-foot" x="12" y="116">${esc(p.diagramFoot)}</text>
      <defs><marker id="${p.slug}Arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="d-head lit"/></marker></defs>
    </svg>
    <figcaption>${p.diagramCaption}</figcaption>
  </figure>

  <h2>Run the complete example</h2>
  <p>${p.runIntro}</p>
  <pre class="yaml">${esc(p.fullYaml)}</pre>
  <pre class="cmd">${esc(p.command)}</pre>
  <pre class="cmd out">${esc(p.output)}</pre>
  <p>The relevant command syntax, copied from <code>${esc(p.help)}</code>:</p>
  <pre class="cmd">${esc(p.syntax)}</pre>

  <h3>Close by</h3>
  <ul class="linklist">
${links}
  </ul>
</section>
`;
}

function astro(p) {
  const rel = p.route.replace(/^\/dsl\//, '');
  const depth = rel.split('/').length;
  const prefix = '../'.repeat(depth + 1);
  return `---
import BaseLayout from '${prefix}layouts/BaseLayout.astro';
import DslShell from '${prefix}components/DslShell.astro';
import css from '${prefix}_mock/dsl.css?raw';
import head from '${prefix}_mock/dsl-element-${p.slug}.head.html?raw';
import tail from '${prefix}_mock/dsl-element-${p.slug}.tail.html?raw';
import js from '${prefix}_mock/dsl-element-${p.slug}.js?raw';
---

<BaseLayout title="${p.label} — Hydra DSL" description="${p.description}">
  <style is:global set:html={css}></style>
  <DslShell current="${p.key}">
    <div class="main-inner"><Fragment set:html={head} /><Fragment set:html={tail} /></div>
  </DslShell>
  <script is:inline set:html={js}></script>
</BaseLayout>
`;
}

const registry = [];
for (const p of pages) {
  const base = `dsl-element-${p.slug}`;
  fs.writeFileSync(path.join(MOCK, `${base}.head.html`), head(p), 'utf8');
  fs.writeFileSync(path.join(MOCK, `${base}.js`), script(p), 'utf8');
  fs.writeFileSync(path.join(MOCK, `${base}.tail.html`), tail(p), 'utf8');
  const target = path.join(ROUTES, p.route.replace(/^\/dsl\//, '') + '.astro');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, astro(p), 'utf8');
  registry.push({ key: p.key, route: p.route, slug: p.slug, parts: [`${base}.head.html`, `${base}.tail.html`], js: `${base}.js`, defaultCase: p.cases[0].value });
}
fs.writeFileSync(path.join(ROOT, 'src', 'data', 'dsl-generated-pages.json'), JSON.stringify(registry, null, 2) + '\n', 'utf8');
console.log(`Generated ${pages.length} DSL element pages.`);
