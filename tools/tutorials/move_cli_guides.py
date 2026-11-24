"""Moves the 13 command-line lessons from /studio to /cli/guides (24/11/2026)."""
import re, json, pathlib
R = pathlib.Path(__file__).resolve().parents[2]
CATS = [
 ("init", "Create a job", "init", ["anatomy-of-a-job"]),
 ("run", "Run and launch", "run", ["launch-a-job-from-the-cli-and-the-api"]),
 ("job", "Jobs and parameters", "job", ["manage-jobs-and-parameters-from-the-cli"]),
 ("sources", "Sources and transformations", None, ["read-csv-json-and-parquet-files", "read-and-write-sqlite-databases", "configure-snowflake-bigquery-and-cdc-sources", "clean-split-window-pivot-and-script"]),
 ("subprojects", "Sub-projects", None, ["call-a-project-from-a-project", "pass-parameters-to-a-sub-project"]),
 ("trigger", "Triggers", "trigger", ["declare-project-triggers"]),
 ("watch", "Watch", "watch", ["run-triggers-with-hdrctl-watch"]),
 ("serve", "Production", "serve", ["run-hydra-in-production-with-hdrctl-serve"]),
 ("mcp", "MCP server", "mcp", ["connect-claude-code-to-hydra-etl-with-mcp"]),
]
hubp = R/"src/data/studio-lessons.js"
hub = hubp.read_text(encoding="utf-8")
rows = {}
for m in re.finditer(r'^  \{"slug": "([^"]+)", "label": "([^"]*)".*?"title": "([^"]*)", "description": "([^"]*)"\},?\n', hub, re.M):
    rows[m.group(1)] = (m.group(2), m.group(3), m.group(4), m.group(0))
moved = [s for c in CATS for s in c[3]]
assert all(s in rows for s in moved), [s for s in moved if s not in rows]
cat_of = {s: c for c in CATS for s in c[3]}
mockfor = {}
for s in moved:
    mockfor[s] = next((R/"src/_mock").glob("studio-lesson-*-%s.main.html" % s))
def fix_links(t):
    for s in moved:
        t = t.replace('/studio/%s' % s, '/cli/guides/%s' % s)
    return t
# 1. data file
guides = []
for cid, ctitle, cmd, slugs in CATS:
    guides.append({"id": cid, "title": ctitle, "command": cmd,
                   "lessons": [{"slug": s, "label": rows[s][0], "title": rows[s][1], "description": rows[s][2]} for s in slugs]})
(R/"src/data/cli-guides.js").write_text("// Guides en ligne de commande, classes par commande (ou par theme sans commande).\nexport const cliGuideCategories = " + json.dumps(guides, indent=1, ensure_ascii=False) + ";\nexport const cliGuidesFor = (command) => cliGuideCategories.filter((c) => c.command === command).flatMap((c) => c.lessons);\n", encoding="utf-8")
# 2. mock html + astro
for s in moved:
    cid, ctitle, cmd, _ = cat_of[s]
    mp = mockfor[s]
    t = mp.read_text(encoding="utf-8")
    t = re.sub(r'<div class="crumbs">.*?</div>', '<div class="crumbs"><a href="/get-started">Get started</a><span>›</span><a href="/cli">Hydra CLI</a><span>›</span><a href="/cli/guides">Guides</a><span>›</span><span>%s</span></div>' % ctitle, t, 1, flags=re.S)
    t = re.sub(r'Lesson \d+ of \d+ · [^<]*', 'Guide · ' + ctitle, t, 1)
    t = t.replace('href="/studio">Back to the course map', 'href="/cli/guides">Back to all guides')
    t = fix_links(t)
    mp.write_text(t, encoding="utf-8")
    ap = R/"src/pages/studio"/(s+".astro")
    a = ap.read_text(encoding="utf-8")
    a = a.replace("'../../", "'../../../")
    a = re.sub(r"import \{ studioLessons \}[^\n]*\n", "", a)
    a = a.replace("import ProductLearningShell from '../../../components/ProductLearningShell.astro';", "import CliReferenceShell from '../../../components/CliReferenceShell.astro';")
    a = a.replace("path: '/studio/%s/'" % s, "path: '/cli/guides/%s/'" % s)
    a = re.sub(r"crumbs: \[.*?\],\n\}\);", lambda m: "crumbs: [['Get started', '/get-started'], ['Hydra CLI', '/cli/'], ['Guides', '/cli/guides/'], [%s, '/cli/guides/%s/']],\n});" % (json.dumps(rows[s][0]), s), a, 1, flags=re.S)
    a = re.sub(r"  <ProductLearningShell.*?</ProductLearningShell>", '  <CliReferenceShell current="%s" guide="%s">\n    <article class="cli-article cli-guide">\n      <Fragment set:html={main} />\n    </article>\n  </CliReferenceShell>' % (cmd or "", s), a, 1, flags=re.S)
    a = fix_links(a)
    out = R/"src/pages/cli/guides"; out.mkdir(parents=True, exist_ok=True)
    (out/(s+".astro")).write_text(a, encoding="utf-8")
    ap.write_text('---\nconst to = "/cli/guides/%s/";\n---\n<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>This guide moved | Hydra ETL</title><link rel="canonical" href={`https://hydraetl.com${to}`}><meta http-equiv="refresh" content={`0;url=${to}`}><meta name="robots" content="noindex"></head><body><p><a href={to}>This guide moved to the Hydra CLI section.</a></p></body></html>\n' % s, encoding="utf-8")
# 3. remove from hub
for s in moved:
    hub = hub.replace(rows[s][3], "")
hubp.write_text(hub, encoding="utf-8")
# 4. links to moved slugs elsewhere
n = 0
for f in list((R/"src/pages/studio").glob("*.astro")) + list((R/"src/_mock").glob("studio-lesson-*.main.html")):
    t = f.read_text(encoding="utf-8")
    if "<title>This guide moved" in t: continue
    u = fix_links(t)
    if u != t: f.write_text(u, encoding="utf-8"); n += 1
print("moved", len(moved), "files relinked", n)
