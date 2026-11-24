#!/usr/bin/env python3
"""
Construit les paquets de sources pour NotebookLM depuis le depot hydra-site.

Usage (Windows, depuis n'importe ou) :
    py make_notebooklm_bundles.py --repo "C:\\Users\\DELL\\Desktop\\hydra-site"
    py make_notebooklm_bundles.py --repo "C:\\Users\\DELL\\Desktop\\hydra-site" --dry-run

Sortie : <repo>\\tools\\tutorials\\_notebooklm\\
    lessons-01-studio.md
    lessons-02-orchestration.md
    pillars.md
    inventory.tsv        (ce qui a ete trouve, a relire)

Stdlib uniquement. Aucune dependance a installer.
"""

import argparse
import html
import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

# Pages pilier recherchees, dans cet ordre.
PILLAR_NAMES = [
    "migrate", "guide", "cli", "get-started", "getting-started",
    "playground", "license", "licence",
]

# Dossiers ignores.
SKIP_DIRS = {
    ".git", "node_modules", "dist", ".astro", "_xfer", "evidence",
    "__pycache__", ".vscode", ".idea", "studio_dist",
}

# Blocs 1-3 = Studio / prise en main / jobs / sources. Blocs 4-8 = le reste.
# Heuristique par mot-cle du slug ; tout ce qui ne matche pas va dans le paquet 2.
BUNDLE1_HINTS = [
    "install", "tour", "anatomy", "create", "job", "workflow", "template",
    "settings", "bottom-panel", "launch", "manage", "import", "source",
    "transformation", "destination", "file", "database", "api", "load",
    "select", "filter", "join", "container", "sub-project", "subproject",
]


class TextExtractor(HTMLParser):
    """Convertit un fragment HTML en texte lisible, en gardant les titres."""

    DROP = {"script", "style", "noscript", "svg", "head"}
    BLOCK = {
        "p", "div", "section", "article", "li", "tr", "br", "pre",
        "h1", "h2", "h3", "h4", "h5", "h6", "table", "thead", "tbody",
        "blockquote", "figure", "figcaption", "ul", "ol", "dl", "dt", "dd",
    }

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self._drop_depth = 0
        self._heading = None
        self.first_h1 = None

    def handle_starttag(self, tag, attrs):
        if tag in self.DROP:
            self._drop_depth += 1
            return
        if self._drop_depth:
            return
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._heading = tag
            level = int(tag[1])
            self.parts.append("\n\n" + "#" * min(level + 2, 6) + " ")
            return
        if tag == "img":
            alt = dict(attrs).get("alt", "").strip()
            if alt:
                self.parts.append(f"\n[image: {alt}]\n")
            return
        if tag in self.BLOCK:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if tag in self.DROP:
            self._drop_depth = max(0, self._drop_depth - 1)
            return
        if self._drop_depth:
            return
        if tag == self._heading:
            self._heading = None
            self.parts.append("\n")
        elif tag in self.BLOCK:
            self.parts.append("\n")

    def handle_data(self, data):
        if self._drop_depth:
            return
        text = data.replace("\r", "")
        if not text.strip():
            if self.parts and not self.parts[-1].endswith((" ", "\n")):
                self.parts.append(" ")
            return
        if self._heading == "h1" and self.first_h1 is None:
            self.first_h1 = " ".join(text.split())
        self.parts.append(text)

    def text(self):
        raw = "".join(self.parts)
        raw = re.sub(r"[ \t]+", " ", raw)
        raw = re.sub(r" *\n *", "\n", raw)
        raw = re.sub(r"\n{3,}", "\n\n", raw)
        return raw.strip()


def html_to_text(raw_html):
    parser = TextExtractor()
    try:
        parser.feed(raw_html)
        parser.close()
    except Exception as exc:  # fragment casse : on degrade au lieu d'abandonner
        print(f"    ! parse partiel ({exc})", file=sys.stderr)
    return parser.text(), parser.first_h1


def strip_frontmatter_and_code(astro_source):
    """Retire le frontmatter --- --- et les imports d'une page .astro."""
    text = astro_source
    if text.lstrip().startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            text = parts[2]
    text = re.sub(r"\{/\*.*?\*/\}", " ", text, flags=re.S)
    text = re.sub(r"\{\s*[a-zA-Z_$][\w.$\[\]'\"() ]*\s*\}", " ", text)
    return text


def title_from_text(text, fallback):
    for line in text.splitlines():
        line = line.strip().lstrip("#").strip()
        if len(line) > 3 and not line.startswith("["):
            return line[:120]
    return fallback


def slug_from_path(path: Path):
    name = path.name
    for suffix in (".main.html", ".astro", ".html", ".md", ".mdx"):
        if name.endswith(suffix):
            name = name[: -len(suffix)]
            break
    name = re.sub(r"^studio-lesson-\d+-", "", name)
    name = re.sub(r"^\d+[-_]", "", name)
    return name.strip("-_") or path.stem


def scrub(text, home_hints):
    """Masque les chemins personnels avant envoi a Google."""
    for hint in home_hints:
        if not hint:
            continue
        text = re.sub(re.escape(hint), r"C:\\Users\\<user>", text, flags=re.I)
    text = re.sub(r"[A-Za-z]:\\Users\\[^\\\s\"'<>|]+", r"C:\\Users\\<user>", text)
    text = re.sub(r"/(?:home|Users)/[^/\s\"'<>|]+", "/home/<user>", text)
    return text


def walk_files(root: Path):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.endswith("-gen") and not d.endswith("-probe")]
        for fn in filenames:
            yield Path(dirpath) / fn


def collect(root: Path):
    lessons, pillars = [], []
    seen_slugs = set()

    for path in walk_files(root):
        name = path.name.lower()
        rel = path.relative_to(root)

        if name.endswith(".main.html"):
            raw = path.read_text(encoding="utf-8", errors="replace")
            text, h1 = html_to_text(raw)
            if len(text.split()) < 80:
                continue
            slug = slug_from_path(path)
            if slug in seen_slugs:
                continue
            seen_slugs.add(slug)
            lessons.append({
                "slug": slug,
                "url": f"/studio/{slug}/",
                "title": h1 or title_from_text(text, slug),
                "text": text,
                "src": str(rel),
            })
            continue

        if name.endswith(".astro"):
            stem = slug_from_path(path)
            if stem.lower() not in PILLAR_NAMES:
                continue
            raw = strip_frontmatter_and_code(path.read_text(encoding="utf-8", errors="replace"))
            text, h1 = html_to_text(raw)
            if len(text.split()) < 40:
                continue
            pillars.append({
                "slug": stem,
                "url": f"/{stem}/",
                "title": h1 or title_from_text(text, stem),
                "text": text,
                "src": str(rel),
            })

    lessons.sort(key=lambda d: d["slug"])
    order = {n: i for i, n in enumerate(PILLAR_NAMES)}
    pillars.sort(key=lambda d: order.get(d["slug"].lower(), 99))
    return lessons, pillars


def split_lessons(lessons):
    b1, b2 = [], []
    for item in lessons:
        hay = (item["slug"] + " " + item["title"]).lower()
        (b1 if any(h in hay for h in BUNDLE1_HINTS) else b2).append(item)
    # Reequilibrage grossier si un paquet est tres petit.
    if b2 and len(b1) > 3 * len(b2):
        cut = len(b1) // 2
        b2 = b1[cut:] + b2
        b1 = b1[:cut]
    elif b1 and len(b2) > 3 * len(b1):
        cut = len(b2) // 2
        b1 = b1 + b2[:cut]
        b2 = b2[cut:]
    return b1, b2


def render(items, heading, home_hints):
    out = [f"# {heading}", ""]
    out.append("Chaque section ci-dessous est une page du site. L'en-tete porte le titre exact")
    out.append("et le slug : cite-les tels quels comme source.")
    out.append("")
    for item in items:
        out.append("")
        out.append(f"## {item['title']} — slug: {item['url']}")
        out.append("")
        body = item["text"]
        # Le H1 de la page est deja dans l'en-tete ci-dessus : on evite le doublon.
        first = body.lstrip().split("\n", 1)
        if first and first[0].lstrip("#").strip() == item["title"].strip():
            body = first[1] if len(first) > 1 else ""
        out.append(scrub(body.strip(), home_hints))
        out.append("")
        out.append("---")
    return "\n".join(out) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True, help="chemin du depot hydra-site")
    ap.add_argument("--out", default=None, help="dossier de sortie")
    ap.add_argument("--dry-run", action="store_true", help="inventaire seul, rien d'ecrit")
    args = ap.parse_args()

    root = Path(args.repo).expanduser().resolve()
    if not root.is_dir():
        sys.exit(f"Depot introuvable : {root}")

    home_hints = [str(Path.home()), os.environ.get("USERPROFILE", "")]

    print(f"Depot : {root}")
    lessons, pillars = collect(root)
    print(f"Lecons trouvees  : {len(lessons)}")
    print(f"Pages pilier     : {len(pillars)}  ({', '.join(p['slug'] for p in pillars) or 'aucune'})")

    found = {p["slug"].lower() for p in pillars}
    wanted = {
        "migrate": ("migrate",),
        "license": ("license", "licence"),
        "cli": ("cli",),
        "guide": ("guide",),
        "get-started": ("get-started", "getting-started"),
        "playground": ("playground",),
    }
    missing = [label for label, aliases in wanted.items()
               if not found.intersection(aliases)]
    if missing:
        print(f"  ! absentes : {', '.join(missing)} — a ajouter a la main dans pillars.md")

    b1, b2 = split_lessons(lessons)
    bundles = [
        ("lessons-01-studio.md", "Hydra Studio lessons — part 1", b1),
        ("lessons-02-orchestration.md", "Hydra Studio lessons — part 2", b2),
        ("pillars.md", "Hydra ETL — pillar pages", pillars),
    ]

    print()
    for fname, heading, items in bundles:
        words = sum(len(i["text"].split()) for i in items)
        flag = "  !! DEPASSE 500 000 MOTS, a scinder" if words > 500_000 else ""
        print(f"{fname:32} {len(items):3} pages  {words:>8} mots{flag}")

    if args.dry_run:
        print("\n--dry-run : rien ecrit.")
        return

    out_dir = Path(args.out) if args.out else root / "tools" / "tutorials" / "_notebooklm"
    out_dir.mkdir(parents=True, exist_ok=True)

    for fname, heading, items in bundles:
        if not items:
            print(f"  (vide, non ecrit) {fname}")
            continue
        (out_dir / fname).write_text(render(items, heading, home_hints), encoding="utf-8")

    inv = ["slug\turl\ttitle\tbundle\tsource_file"]
    for label, items in (("lessons-01", b1), ("lessons-02", b2), ("pillars", pillars)):
        for i in items:
            inv.append(f"{i['slug']}\t{i['url']}\t{i['title']}\t{label}\t{i['src']}")
    (out_dir / "inventory.tsv").write_text("\n".join(inv) + "\n", encoding="utf-8")

    print(f"\nEcrit dans : {out_dir}")
    print("Relis inventory.tsv : un titre vide ou un slug bizarre = en-tete a corriger")
    print("avant d'uploader, sinon NotebookLM citera une source fausse.")


if __name__ == "__main__":
    main()
