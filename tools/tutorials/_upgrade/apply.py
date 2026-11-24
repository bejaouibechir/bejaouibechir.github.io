# -*- coding: utf-8 -*-
"""Mise à niveau des leçons Studio : à exécuter depuis hydra-site/src (python3 apply.py)."""
import re, html, os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from data import L, LI

MOCK = "_mock/studio-lesson-{s}.main.html"
PAGE = "pages/studio/{s}.astro"
warn = []

def sub1(t, a, b, slug, label=""):
    if a not in t:
        warn.append(f"{slug}: missing [{label or a[:50]}]"); return t
    return t.replace(a, b, 1)

def esc_js(s): return json.dumps(s, ensure_ascii=False)

def plain(h): return html.unescape(re.sub(r"<[^>]+>", "", h)).strip()

PATCH = {}

# ---- 04 palette
def p04(t, s):
    for a, b in [("seven connectors, eighteen transformations, nine actions, three containers — and your own jobs",
                  "thirteen sources, twenty transformations, ten destinations, nine actions, two control-flow nodes, three containers — and your own jobs"),
                 ("Sources (7)  Transformations (18)  Destinations (6)  Containers (3)", "Sources (13)  Transformations (20)  Destinations (10)  Containers (3)"),
                 ('<pre class="cmd">Sources (7) · Destinations (6)</pre>', '<pre class="cmd">Sources (13) · Destinations (10)</pre>'),
                 ("Six connectors work in both directions: three file formats and three databases. The seventh, <b>Web API</b>, reads only — Hydra pulls from an HTTP endpoint but does not push to one.",
                  "Ten connectors work in both directions: three file formats and seven databases or warehouses. Three sources read only: <b>Web API</b>, <b>PostgreSQL CDC</b> and <b>MySQL CDC</b>. Hydra pulls from an HTTP endpoint but does not push to one."),
                 ("Seven on the way in, six on the way out. The difference is one entry, and it is not an oversight.",
                  "Thirteen on the way in, ten on the way out. The three missing ones are not an oversight."),
                 ("Sources        CSV  JSON  Parquet  MySQL  PostgreSQL  MongoDB  Web API\nDestinations   CSV  JSON  Parquet  MySQL  PostgreSQL  MongoDB",
                  "Sources        CSV  JSON  Parquet  MySQL  PostgreSQL  SQL Server  SQLite  PostgreSQL CDC  MySQL CDC  Snowflake  BigQuery  MongoDB  Web API\nDestinations   CSV  JSON  Parquet  MySQL  PostgreSQL  SQL Server  SQLite  Snowflake  BigQuery  MongoDB"),
                 ("<h3><i>10</i>Eighteen ways to reshape data</h3>", "<h3><i>10</i>Twenty ways to reshape data"+"</h3>"),
                 ('<pre class="cmd">Transformations (18)</pre>', '<pre class="cmd">Transformations (20)</pre>'),
                 ("<tr><td><b>Change</b></td><td>Rename · Cast · Derive · Fill Null · Trim · Clean</td></tr>", "<tr><td><b>Change</b></td><td>Rename · Cast · Derive · Fill Null · Trim · Clean · Window</td></tr>"),
                 ("<tr><td><b>Reshape</b></td><td>Sort · Aggregate · Pivot · Unpivot · Transpose</td></tr>", "<tr><td><b>Reshape</b></td><td>Sort · Aggregate · Pivot · Unpivot · Transpose · Text to Rows</td></tr>"),
                 ("Seventeen named operations, then one that is not an operation at all.", "Nineteen named operations, then one that is not an operation at all."),
                 ("Filter  Select  Rename  Cast  Aggregate  Sort  Deduplicate  Derive  Join\nFill Null  Trim  Clean  Pivot  Unpivot  Transpose  Merge  Union  Script",
                  "Filter  Select  Rename  Cast  Aggregate  Sort  Deduplicate  Derive  Join  Fill Null\nTrim  Clean  Pivot  Unpivot  Transpose  Merge  Union  Text to Rows  Window  Script"),
                 ("none of the seventeen operations fits", "none of the nineteen operations fits"),
                 ("Seventeen named operations are read by everyone", "Nineteen named operations are read by everyone"),
                 ("<td>Seven in, six out — <b>Web API</b> reads only</td>", "<td>Thirteen in, ten out — <b>Web API</b> and the two CDC sources read only</td>"),
                 ("<td>Eighteen, the last one being <b>Script</b></td>", "<td>Twenty, the last one being <b>Script</b></td>")]:
        t = sub1(t, a, b, s, a[:40])
    t = t.replace("Seventeen", "Nineteen").replace("seventeen", "nineteen")
    return t
PATCH["04-use-the-palette"] = p04

# ---- 06 transformations
def p06(t, s):
    for a, b in [("Eighteen operations sit between", "Twenty operations sit between"),
                 ("learn the eighteen the palette offers", "learn the twenty the palette offers"),
                 ("Read the eighteen operations", "Read the twenty operations"),
                 ("Jobs configuration → Transformations (18)", "Jobs configuration → Transformations (20)"),
                 ("Seventeen named operations, then one escape hatch. Grouping them by intent is faster than memorising eighteen names",
                  "Nineteen named operations, then one escape hatch. Grouping them by intent is faster than memorising twenty names"),
                 ("Your own Python, when none of the seventeen fits.", "Your own Python, when none of the nineteen fits."),
                 ("Seventeen named operations are read by everyone", "Nineteen named operations are read by everyone"),
                 ("Eighteen transformations, <b>Script</b> last", "Twenty transformations, <b>Script</b> last"),
                 ("listing the eighteen operations", "listing the twenty operations"),
                 ("<td>Rename · Cast · Derive · Fill Null · Trim · Clean</td>", "<td>Rename · Cast · Derive · Fill Null · Trim · Clean · Window</td>"),
                 ("<td>Sort · Aggregate · Pivot · Unpivot · Transpose</td>", "<td>Sort · Aggregate · Pivot · Unpivot · Transpose · Text to Rows</td>")]:
        t = sub1(t, a, b, s, a[:40])
    t = t.replace("Eighteen", "Twenty").replace("eighteen", "twenty").replace("Seventeen", "Nineteen").replace("seventeen", "nineteen")
    return t
PATCH["06-add-a-transformation"] = p06

# ---- 07 destinations
def p07(t, s):
    for a, b in [("Read the six destinations", "Read the ten destinations"),
                 ("Jobs configuration → Destinations (6)", "Jobs configuration → Destinations (10)"),
                 ("Six connectors, and you have met all six already — three file formats and three databases. The seventh source, <b>Web API</b>, has no counterpart here: Hydra reads from an HTTP endpoint but never writes to one.",
                  "Ten connectors, and you have met all ten already — three file formats and seven databases or warehouses. Three of the thirteen sources have no counterpart here: <b>Web API</b>, <b>PostgreSQL CDC</b> and <b>MySQL CDC</b>. Hydra reads from an HTTP endpoint but never writes to one."),
                 ("Seven entries on the way in, six on the way out. The difference is one, and it is deliberate.", "Thirteen entries on the way in, ten on the way out. The three missing ones are deliberate."),
                 ("Sources        CSV  JSON  Parquet  MySQL  PostgreSQL  MongoDB  Web API\nDestinations   CSV  JSON  Parquet  MySQL  PostgreSQL  MongoDB",
                  "Sources        CSV  JSON  Parquet  MySQL  PostgreSQL  SQL Server  SQLite  PostgreSQL CDC  MySQL CDC  Snowflake  BigQuery  MongoDB  Web API\nDestinations   CSV  JSON  Parquet  MySQL  PostgreSQL  SQL Server  SQLite  Snowflake  BigQuery  MongoDB"),
                 ("<tr><td><b>MySQL · PostgreSQL · MongoDB</b></td><td>A connection and a target table or collection.</td></tr>",
                  "<tr><td><b>MySQL · PostgreSQL · SQL Server · MongoDB</b></td><td>A connection and a target table or collection.</td></tr>\n      <tr><td><b>SQLite</b></td><td>A database file and a target table.</td></tr>\n      <tr><td><b>Snowflake · BigQuery</b></td><td>The warehouse connection and a target table, with append, replace or upsert.</td></tr>"),
                 ("<td>Six destinations, no Web API</td>", "<td>Ten destinations, no Web API</td>"),
                 ("Six destinations, no Web API", "Ten destinations, no Web API")]:
        t = sub1(t, a, b, s, a[:40])
    return t
PATCH["07-add-a-destination"] = p07

# ---- 08 and 12: job step serialization
NEWYAML_NOTE = ('<div class="callout"><b>How a job step is written</b><p>Each job node becomes a step with <code>type: job</code> and a <code>job</code> path to its folder, '
                'here <code>../jobs/first-job</code>. The step name is the node\'s step name, which stays an internal identifier until you set a readable one in the node dialog. '
                'An action node becomes <code>type: action</code> with an <code>action</code> name.</p></div>')
def yaml_fix(t, s, second_job_depends=True):
    t, n = re.subn(r'<div class="callout"><b>Known defect.*?</div>', lambda m: NEWYAML_NOTE, t, count=1, flags=re.S)
    if not n: warn.append(f"{s}: callout not found")
    # first webhook block -> first-job, second -> second-job
    for job in ("first-job", "second-job"):
        t = sub1(t, "type: action\n      action: webhook", f"type: job\n      job: ../jobs/{job}", s, "yaml "+job)
    return t
def p08(t, s):
    t = yaml_fix(t, s)
    t = sub1(t, "<tr><td>Job steps written as <code>action: webhook</code></td><td>Known serialization defect</td><td>Expected for now; a job step should read <code>type: job</code></td></tr>",
             "<tr><td>Job steps show names like <code>job_1786…</code></td><td>The step name is the node's internal identifier</td><td>Open the node and set a readable step name</td></tr>", s, "ts row")
    return t
PATCH["08-see-the-yaml"] = p08
def p12(t, s):
    t = yaml_fix(t, s)
    t = sub1(t, "<tr><td>Job steps serialized as <code>action: webhook</code></td><td>Known serialization defect</td><td>Expected for now; <code>depends_on</code> is still correct</td></tr>",
             "<tr><td>Job steps show names like <code>job_1786…</code></td><td>The step name is the node's internal identifier</td><td>Open the node and set a readable step name; <code>depends_on</code> follows the edges</td></tr>", s, "ts row")
    return t
PATCH["12-compose-jobs"] = p12

EVID_HEAD = "# Evidence: {h1} (lesson {n}, slug {s})\nUpgraded 2026-11-22 against Hydra ETL 0.22.0 (Studio source in the Hydra repository).\n\n| ID | Statement | Type | Evidence | Status |\n|---|---|---|---|---|\n"

def process(s, d):
    f = MOCK.format(s=s)
    t = open(f, encoding="utf-8").read()
    n = d["n"]
    # head
    t = re.sub(r"<h1>.*?</h1>", lambda m: f"<h1>{d['h1']}</h1>", t, count=1, flags=re.S)
    byline = (f'\n<p class="byline">By <a href="https://github.com/bejaouibechir" rel="author">Bechir Bejaoui</a> '
              f'(<a href="{LI}" rel="author noopener">LinkedIn</a>) · Published 4 November 2026 · Last verified 22 November 2026 · '
              f'Tested with Hydra ETL 0.22.0 (Studio source and API checks on Linux)</p>')
    if 'class="byline"' not in t:
        t, k = re.subn(r'(<p class="lead">.*?</p>)(</div>)', lambda m: m.group(1) + byline + m.group(2), t, count=1, flags=re.S)
        if not k: warn.append(f"{s}: lead not found")
    # prereqs
    new_li = ('<li>Hydra ETL 0.22 installed with the server extra, and <code>hdrctl serve</code> running: Studio is then at <code>http://127.0.0.1:5678</code>. '
              'See <a href="/studio/02-check-the-api">lesson 3, Check the API</a> if the top bar does not say <b>API online</b>.</li>')
    a1 = "<li>Hydra API started with <code>hdrctl serve</code>.</li>"
    a2 = "<li>Studio started from <code>Hydra/studio</code> with <code>npm run dev</code>.</li>"
    if a1 in t:
        t = t.replace(a1, new_li, 1)
        t = t.replace(a2, "", 1)
    elif "npm run dev" in t:
        warn.append(f"{s}: dev prerequisites not matched")
    t = t.replace("http://localhost:5173", "http://127.0.0.1:5678")
    # specific patches
    if s in PATCH: t = PATCH[s](t, s)
    # quick answer
    qa = f'<div class="callout"><b>Quick answer</b><p>{d["answer"]}</p></div>\n  '
    if "Quick answer" not in t:
        t = sub1(t, '<section class="doc">\n  ', '<section class="doc">\n  ' + qa, s, "section doc")
    # headings
    t = sub1(t, "<h2>1. Objective</h2>", "<h2>What will you learn in this lesson?</h2>", s, "h2-1")
    t = sub1(t, "<h2>2. Steps</h2>", f"<h2>{d['steps_q']}</h2>", s, "h2-2")
    t = sub1(t, "<h2>3. Checklist</h2>", "<h2>What should I have at the end?</h2>", s, "h2-3")
    t = sub1(t, "<h2>4. Troubleshooting</h2>", "<h2>What if something goes wrong?</h2>", s, "h2-4")
    # tips
    tips = "".join(f'\n  <p data-kind="{k}">{h}</p>' for k, h in d["tips"])
    rules = f'<div class="rules">\n  <h5>Tips and tricks</h5>{tips}\n</div>'
    t, k = re.subn(r'<div class="rules">.*?</div>', lambda m: rules, t, count=1, flags=re.S)
    if not k: warn.append(f"{s}: rules not found")
    # FAQ + related + next
    faq = "".join(f"\n  <h3>{q}</h3>\n  <p>{a}</p>" for q, a in d["faq"])
    rel = "".join(f'<li><a href="{h}">{l}</a></li>' for l, h in d["related"])
    block = (f'<h2>Frequently asked questions</h2>{faq}\n\n  <h2>Related lessons</h2>\n  <ul class="linklist">{rel}</ul>\n\n  <h2>Next lesson</h2>')
    t = sub1(t, "<h2>5. Next lesson</h2>", block, s, "h2-5")
    # CTA
    cta = ('<div class="cta"><b>Try Hydra ETL</b><p>Install it in a minute, or explore a job in your browser first.</p>'
           '<a class="primary" href="/get-started">Get started</a><a href="/playground">Open the Playground</a><a href="/license">Commercial license</a></div>')
    t, k = re.subn(r'<h4>Close by</h4><ul class="linklist">.*?</ul>', lambda m: cta, t, count=1, flags=re.S)
    if not k: warn.append(f"{s}: close-by not found")
    open(f, "w", encoding="utf-8").write(t)

    # steps for HowTo
    steps = [plain(x) for x in re.findall(r"<h3><i>\d+</i>(.*?)</h3>", t, flags=re.S)]
    # astro page
    pf = PAGE.format(s=s); a = open(pf, encoding="utf-8").read()
    if "lessonJsonLd" not in a:
        a, k = re.subn(r'<BaseLayout title="[^"]*" description="[^"]*">',
            lambda m: f'<BaseLayout title="{plain(d["h1"]).replace(chr(34), "")}" exactTitle="{d["title"]}" description="{d["desc"]}" article={{article}} jsonld={{jsonld}}>', a, count=1)
        if not k: warn.append(f"{s}: BaseLayout tag not matched")
        faq_js = ",\n".join(f"    [{esc_js(plain(q))}, {esc_js(plain(an))}]" for q, an in d["faq"])
        front = (f"import {{ lessonJsonLd }} from '../../data/lesson-jsonld.js';\n"
                 f"const article = {{ headline: {esc_js(plain(d['h1']))}, description: {esc_js(d['desc'])}, datePublished: '2026-11-04', dateModified: '2026-11-22', author: 'Bechir Bejaoui' }};\n"
                 f"const jsonld = lessonJsonLd({{\n  path: '/studio/{s}/',\n  name: article.headline,\n  steps: {json.dumps(steps, ensure_ascii=False)},\n  faq: [\n{faq_js},\n  ],\n"
                 f"  crumbs: [['Get started', '/get-started'], ['Hydra Studio', '/studio'], [{esc_js(d['short'])}, '/studio/{s}/']],\n}});\n")
        i = a.index("---", 3); a = a[:i] + front + a[i:]
        open(pf, "w", encoding="utf-8").write(a)
    # evidence
    ev = EVID_HEAD.format(h1=plain(d["h1"]), n=n, s=s)
    for i, e in enumerate(d.get("expect_ev", []), 1):
        ev += f"| E{i} | {e} | FACT | Studio source | VERIFIED (source) |\n"
    ev += f"| E{len(d.get('expect_ev', []))+1} | Screenshots of this lesson | EXPERIENCE | taken with Hydra ETL 0.17 era Studio | TO REDO (capture_studio.py) |\n"
    ev += f"| E{len(d.get('expect_ev', []))+2} | Step-by-step UI wording kept from the previous version | EXPERIENCE | not re-run in the 0.22 UI | MANUAL, to re-check while retaking screenshots |\n"
    os.makedirs("../tools/tutorials/evidence", exist_ok=True)
    open(f"../tools/tutorials/evidence/studio-{s}.evidence.md", "w", encoding="utf-8").write(ev)

for s, d in L.items():
    process(s, d)
print("done", len(L), "lessons")
print("\n".join(warn) or "no warnings")
