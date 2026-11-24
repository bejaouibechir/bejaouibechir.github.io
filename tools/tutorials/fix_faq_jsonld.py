"""Rebuilds the FAQPage JSON-LD of each lesson page from the visible FAQ of its .main.html (24/11/2026)."""
import re, json, html, pathlib, sys
R = pathlib.Path(__file__).resolve().parents[2]
txt = lambda s: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", s))).strip()
fixed = 0
for f in sorted(list((R/"src/pages/studio").glob("*.astro")) + list((R/"src/pages/cli/guides").glob("*.astro"))):
    a = f.read_text(encoding="utf-8")
    m = re.search(r"studio-lesson-[\w-]+\.main\.html", a)
    if not m or "faq:" not in a: continue
    main = (R/"src/_mock"/m.group(0)).read_text(encoding="utf-8")
    i = main.find("<h2>Frequently asked questions</h2>")
    if i < 0: print("no faq section", f.name); continue
    sec = main[i+len("<h2>Frequently asked questions</h2>"):]
    sec = sec.split("<h2", 1)[0]
    pairs = [(txt(q), txt(r)) for q, r in re.findall(r"<h3>(.*?)</h3>\s*<p>(.*?)</p>", sec, re.S)]
    if not pairs: print("no pairs", f.name); continue
    cur = re.search(r"  faq: \[.*?\],\n(?=  crumbs)", a, re.S)
    if not cur: print("no faq match", f.name); continue
    new = "  faq: " + json.dumps([list(p) for p in pairs], ensure_ascii=False) + ",\n"
    if cur.group(0) != new:
        a = a.replace(cur.group(0), new, 1); f.write_text(a, encoding="utf-8"); fixed += 1
print("fixed", fixed)
