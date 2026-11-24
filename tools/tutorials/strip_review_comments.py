#!/usr/bin/env python3
"""
Retire les commentaires de revue internes du livre blanc, sans les perdre.

Les commentaires HTML <!-- REVIEW ... --> de DSL-whitebook/*.md sont invisibles
a l'ecran mais presents dans le source des pages publiees : lisibles par
n'importe qui et par les robots des assistants IA.

Ce script les extrait dans un fichier interne, puis les retire des sources.

Usage :
    py tools\\tutorials\\strip_review_comments.py --repo "C:\\...\\hydra-site" --dry-run
    py tools\\tutorials\\strip_review_comments.py --repo "C:\\...\\hydra-site"
"""

import argparse
import re
from datetime import date
from pathlib import Path

# Un commentaire est "interne" s'il contient un de ces marqueurs.
INTERNAL = re.compile(
    r"(?i)\b(REVIEW|d[ée]cision|TODO|FIXME|XXX|à corriger|a corriger|"
    r"ne pas publier|note interne|brouillon|non document[ée])\b"
)
COMMENT = re.compile(r"[ \t]*<!--(.*?)-->[ \t]*\n?", re.S)


def line_of(text, pos):
    return text.count("\n", 0, pos) + 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    repo = Path(args.repo).expanduser().resolve()
    book = repo / "DSL-whitebook"
    if not book.is_dir():
        raise SystemExit(f"Introuvable : {book}")

    extracted, changes = [], []

    for path in sorted(book.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        kept, removed = [], []

        def repl(m):
            body = m.group(1).strip()
            if INTERNAL.search(body):
                removed.append((line_of(text, m.start()), body))
                return ""
            kept.append(body)
            return m.group(0)

        new = COMMENT.sub(repl, text)
        if not removed:
            print(f"  {path.name:28} rien a retirer ({len(kept)} commentaire(s) conserve(s))")
            continue

        new = re.sub(r"\n{4,}", "\n\n\n", new)
        changes.append((path, new, len(text), len(new)))
        for ln, body in removed:
            extracted.append((path.name, ln, " ".join(body.split())))
        print(f"  {path.name:28} {len(removed)} retire(s), {len(kept)} conserve(s)"
              f"   {len(text)} -> {len(new)} octets")

    if not extracted:
        print("\nAucun commentaire interne. Rien a faire.")
        return

    out = repo / "tools" / "tutorials" / "review-notes-extracted.md"
    lines = [
        "# Notes de revue retirees du livre blanc",
        "",
        f"Extraites le {date.today().isoformat()} par `strip_review_comments.py`.",
        "Elles etaient publiees en commentaires HTML dans les pages `/dsl/*`.",
        "**Interne. Ne pas republier.** A verser dans le registre des points bloquants.",
        "",
    ]
    current = None
    for fname, ln, body in extracted:
        if fname != current:
            current = fname
            lines += ["", f"## {fname}", ""]
        lines.append(f"- **l.{ln}** — {body}")
    lines.append("")

    print(f"\n{len(extracted)} commentaire(s) interne(s) dans {len(changes)} fichier(s).")

    if args.dry_run:
        print("\n--dry-run : rien ecrit. Apercu de l'extraction :\n")
        print("\n".join(lines[:26]))
        return

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines), encoding="utf-8")
    for path, new, _, _ in changes:
        path.write_text(new, encoding="utf-8")

    print(f"\nExtrait dans : {out}")
    print("Sources nettoyees. Etape suivante : npm run build, puis git push.")


if __name__ == "__main__":
    main()
