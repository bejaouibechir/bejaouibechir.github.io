#!/usr/bin/env python3
"""
Construit les paquets de sources pour NotebookLM depuis le depot hydra-site.

Deux modes :
  --from dist   (recommande) lit le site construit : URLs exactes, contenu rendu.
                Lancer `npm run build` avant, sinon les dernieres lecons manquent.
  --from src    (secours) lit les .main.html et deduit l'URL depuis src/pages.

Usage (Windows) :
    cd C:\\Users\\DELL\\Desktop\\hydra-site\\tools\\tutorials
    py make_notebooklm_bundles.py --repo "C:\\Users\\DELL\\Desktop\\hydra-site" --dry-run

Sortie : <repo>\\tools\\tutorials\\_notebooklm\\
    lessons-01-studio.md, lessons-02-orchestration.md, cli-guides.md,
    pillars.md, reference.md, inventory.tsv

Stdlib uniquement.
"""

import argparse
import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

SKIP_DIRS = {
    ".git", "node_modules", ".astro", "_xfer", "__pycache__", ".vscode",
    ".idea", "studio_dist", "_astro", "assets", "og", "_to_delete",
}

# Sections de dist a retenir, et dans quel paquet elles vont.
SECTION_BUNDLE = [
    ("/cli/guides/", "cli-guides"),
    ("/studio/", "lessons"),
    ("/migrate", "pillars"),
    ("/get-started", "pillars"),
    ("/install", "pillars"),
    ("/license", "pillars"),
    ("/playground", "pillars"),
    ("/firstjob", "pillars"),
    ("/guide", "guide"),
    ("/changelog", "pillars"),
    ("/vscode", "pillars"),
    ("/cli", "reference"),
    ("/dsl", "reference"),
]
EXCLUDE_PREFIXES = ("/blog", "/academy", "/examples", "/data", "/tutorials", "/build")
MIN_WORDS = 80
MIN_WORDS_PILLAR = 40
WORD_CAP = 500_000


class TextExtractor(HTMLParser):
    DROP = {"script", "style", "noscript", "svg", "head", "nav", "footer"}
    BLOCK = {
        "p", "div", "section", "article", "li", "tr", "br", "pre", "main",
        "h1", "h2", "h3", "h4", "h5", "h6", "table", "thead", "tbody",
        "blockquote", "figure", "figcaption", "ul", "ol", "dl", "dt", "dd",
    }

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self._drop = 0
        self._heading = None
        self._in_title = False
        self.title = None
        self.first_h1 = None

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self._in_title = True
            return
        if tag in self.DROP:
            self._drop += 1
            return
        if self._drop:
            return
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._heading = tag
            self.parts.append("\n\n" + "#" * min(int(tag[1]) + 2, 6) + " ")
            return
        if tag == "img":
            alt = dict(attrs).get("alt", "").strip()
            if alt:
                self.parts.append(f"\n[image: {alt}]\n")
            return
        if tag in self.BLOCK:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
            return
        if tag in self.DROP:
            self._drop = max(0, self._drop - 1)
            return
        if self._drop:
            return
        if tag == self._heading:
            self._heading = None
            self.parts.append("\n")
        elif tag in self.BLOCK:
            self.parts.append("\n")

    def handle_data(self, data):
        if self._in_title and self.title is None:
            self.title = " ".join(data.split())
            return
        if self._drop:
            return
        if not data.strip():
            if self.parts and not self.parts[-1].endswith((" ", "\n")):
                self.parts.append(" ")
            return
        if self._heading == "h1" and self.first_h1 is None:
            self.first_h1 = " ".join(data.split())
        self.parts.append(data)

    def text(self):
        raw = "".join(self.parts)
        raw = re.sub(r"[ \t]+", " ", raw)
        raw = re.sub(r" *\n *", "\n", raw)
        raw = re.sub(r"\n{3,}", "\n\n", raw)
        return raw.strip()


def html_to_text(raw):
    p = TextExtractor()
    try:
        p.feed(raw)
        p.close()
    except Exception as exc:
        print(f"    ! parse partiel : {exc}", file=sys.stderr)
    return p.text(), (p.first_h1 or p.title)


def clean_title(t, fallback):
    if not t:
        return fallback
    t = re.sub(r"\s*[|·—–-]\s*(Hydra ETL|Hydra Studio|Hydra).*$", "", t).strip()
    return t[:120] or fallback


def scrub(text, hints):
    for h in hints:
        if h:
            text = re.sub(re.escape(h), r"C:\\Users\\<user>", text, flags=re.I)
    text = re.sub(r"[A-Za-z]:\\Users\\[^\\\s\"'<>|]+", r"C:\\Users\\<user>", text)
    text = re.sub(r"/(?:home|Users)/[^/\s\"'<>|]+", "/home/<user>", text)
    return text


def walk(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames
                       if d not in SKIP_DIRS
                       and not d.endswith("-gen") and not d.endswith("-probe")]
        for fn in filenames:
            yield Path(dirpath) / fn


def bundle_for(url):
    if url.startswith(EXCLUDE_PREFIXES) or url == "/":
        return None
    for prefix, name in SECTION_BUNDLE:
        if url.startswith(prefix):
            return name
    return None


def collect_dist(dist):
    pages = []
    for path in walk(dist):
        if path.name != "index.html":
            continue
        rel = path.parent.relative_to(dist).as_posix()
        url = "/" if rel == "." else "/" + rel + "/"
        bundle = bundle_for(url)
        if bundle is None:
            continue
        text, title = html_to_text(path.read_text(encoding="utf-8", errors="replace"))
        floor = MIN_WORDS_PILLAR if bundle in ("pillars", "reference") else MIN_WORDS
        if len(text.split()) < floor:
            continue
        slug = url.strip("/").split("/")[-1]
        pages.append({"slug": slug, "url": url, "bundle": bundle,
                      "title": clean_title(title, slug), "text": text,
                      "src": str(path.relative_to(dist.parent))})
    return pages


def route_index(pages_dir):
    """slug (sans prefixe NN-) -> liste de (url, taille)."""
    idx = {}
    if not pages_dir.is_dir():
        return idx
    for path in walk(pages_dir):
        if path.suffix != ".astro" or "[" in path.name or "[" in str(path.parent):
            continue
        rel = path.relative_to(pages_dir).with_suffix("").as_posix()
        if rel.endswith("/index"):
            rel = rel[: -len("/index")]
        url = "/" + rel + "/"
        last = rel.split("/")[-1]
        key = re.sub(r"^\d+[-_]", "", last)
        idx.setdefault(key, []).append((url, path.stat().st_size))
    return idx


def collect_src(repo):
    idx = route_index(repo / "src" / "pages")
    pages, unresolved = [], []
    for path in walk(repo):
        if not path.name.endswith(".main.html"):
            continue
        text, title = html_to_text(path.read_text(encoding="utf-8", errors="replace"))
        if len(text.split()) < MIN_WORDS:
            continue
        slug = re.sub(r"^studio-lesson-\d+-", "", path.name[: -len(".main.html")])
        slug = re.sub(r"^\d+[-_]", "", slug).strip("-_")
        cands = idx.get(slug, [])
        if cands:
            # la vraie page est la plus grosse : les redirections pesent ~400 o
            url = max(cands, key=lambda c: c[1])[0]
        else:
            url = f"/studio/{slug}/"
            unresolved.append(slug)
        bundle = bundle_for(url) or "lessons"
        pages.append({"slug": slug, "url": url, "bundle": bundle,
                      "title": clean_title(title, slug), "text": text,
                      "src": str(path.relative_to(repo))})
    return pages, unresolved


def split_lessons(items):
    """Coupe en deux a taille de texte egale, en gardant l'ordre des slugs."""
    items = sorted(items, key=lambda d: d["slug"])
    total = sum(len(i["text"].split()) for i in items)
    half, acc, cut = total / 2, 0, len(items)
    for n, it in enumerate(items):
        acc += len(it["text"].split())
        if acc >= half:
            cut = n + 1
            break
    return items[:cut], items[cut:]


def render(items, heading, hints):
    out = [f"# {heading}", "",
           "Chaque section est une page du site. L'en-tete porte le titre exact et",
           "l'URL : cite-les tels quels comme source.", ""]
    for it in items:
        out += ["", f"## {it['title']} — slug: {it['url']}", ""]
        body = it["text"]
        first = body.lstrip().split("\n", 1)
        if first and first[0].lstrip("#").strip() == it["title"].strip():
            body = first[1] if len(first) > 1 else ""
        out += [scrub(body.strip(), hints), "", "---"]
    return "\n".join(out) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True)
    ap.add_argument("--from", dest="source", choices=["dist", "src"], default=None)
    ap.add_argument("--out", default=None)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    repo = Path(args.repo).expanduser().resolve()
    if not repo.is_dir():
        sys.exit(f"Depot introuvable : {repo}")
    hints = [str(Path.home()), os.environ.get("USERPROFILE", "")]

    dist = repo / "dist"
    mode = args.source or ("dist" if (dist / "index.html").is_file() else "src")
    print(f"Depot : {repo}")
    print(f"Mode  : {mode}")

    unresolved = []
    if mode == "dist":
        if not (dist / "index.html").is_file():
            sys.exit("dist absent : lance `npm run build`, ou utilise --from src")
        newest_src = max((p.stat().st_mtime for p in walk(repo / "src")), default=0)
        if newest_src > (dist / "index.html").stat().st_mtime:
            print("  ! dist est plus ancien que src : relance `npm run build`")
            print("    sinon les dernieres lecons ne seront pas dans les paquets.")
        pages = collect_dist(dist)
    else:
        pages, unresolved = collect_src(repo)
        print("  ! mode src : URLs deduites de src/pages, a verifier dans inventory.tsv")

    by = {}
    for p in pages:
        by.setdefault(p["bundle"], []).append(p)

    l1, l2 = split_lessons(by.get("lessons", []))
    bundles = [
        ("lessons-01-studio.md", "Hydra Studio lessons — part 1", l1),
        ("lessons-02-orchestration.md", "Hydra Studio lessons — part 2", l2),
        ("cli-guides.md", "Hydra ETL CLI guides", sorted(by.get("cli-guides", []), key=lambda d: d["slug"])),
        ("pillars.md", "Hydra ETL — pillar and entry pages", sorted(by.get("pillars", []), key=lambda d: d["url"])),
        ("guide.md", "Hydra ETL — guide section", sorted(by.get("guide", []), key=lambda d: d["url"])),
        ("reference.md", "Hydra ETL — CLI and DSL reference", sorted(by.get("reference", []), key=lambda d: d["url"])),
    ]

    print(f"\nPages retenues : {len(pages)}")
    print()
    for fname, _, items in bundles:
        w = sum(len(i["text"].split()) for i in items)
        flag = f"  !! > {WORD_CAP} mots, a scinder" if w > WORD_CAP else ""
        print(f"{fname:30} {len(items):3} pages {w:>8} mots{flag}")

    prefixes = {}
    for p in pages:
        key = "/" + p["url"].strip("/").split("/")[0]
        if p["url"].startswith("/cli/guides/"):
            key = "/cli/guides"
        prefixes[key] = prefixes.get(key, 0) + 1
    print("\nRepartition par section :")
    for k in sorted(prefixes, key=lambda k: -prefixes[k]):
        print(f"  {k:16} {prefixes[k]}")

    if unresolved:
        print(f"\n! {len(unresolved)} lecons sans page correspondante dans src/pages")
        print("  (URL provisoire /studio/<slug>/, a verifier ou a exclure) :")
        for s in unresolved:
            print(f"    {s}")

    if args.dry_run:
        print("\n--dry-run : rien ecrit.")
        return

    out_dir = Path(args.out) if args.out else repo / "tools" / "tutorials" / "_notebooklm"
    out_dir.mkdir(parents=True, exist_ok=True)
    written = []
    for fname, heading, items in bundles:
        if not items:
            continue
        (out_dir / fname).write_text(render(items, heading, hints), encoding="utf-8")
        written.append(fname)

    inv = ["slug\turl\ttitle\tbundle\tsource"]
    for fname, _, items in bundles:
        for i in items:
            inv.append(f"{i['slug']}\t{i['url']}\t{i['title']}\t{fname}\t{i['src']}")
    (out_dir / "inventory.tsv").write_text("\n".join(inv) + "\n", encoding="utf-8")

    print(f"\nEcrit dans : {out_dir}")
    print("Fichiers   : " + ", ".join(written) + ", inventory.tsv")
    print("Relis inventory.tsv : une URL fausse = NotebookLM citera une source fausse")
    print("dans toutes les reponses.")


if __name__ == "__main__":
    main()
