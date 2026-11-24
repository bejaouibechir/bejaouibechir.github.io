#!/usr/bin/env python3
"""
Controle avant publication : ce qui ne doit pas sortir, et ce qui doit etre a jour.

Verifie, dans les sources ET dans le site construit :
  1. texte francais sur des pages anglaises
  2. commentaires de revue internes
  3. chemins personnels et chemins de code interne
  4. notes a faire (TODO, FIXME, a corriger)
  5. coherence de version entre llms.txt et releases.json

Sort en code 1 si une verification echoue : branchable sur le build.

Usage :
    py tools\\tutorials\\check_publish.py --repo "C:\\...\\hydra-site"
    py tools\\tutorials\\check_publish.py --repo "C:\\...\\hydra-site" --skip-dist
"""

import argparse
import json
import re
import sys
import time
from pathlib import Path

SKIP_DIRS = {"_astro", "assets", "og", "node_modules", ".git", "_to_delete"}

# (nom, motif, occurrences minimales, bloquant en source ?, bloquant en dist ?)
CHECKS = [
    ("texte francais", re.compile(
        r"(?<![\w-])(les|des|une|est|sont|avec|pour|dans|cette|aux|afin|doit|peut|"
        r"sans|chaque|toute|ainsi|alors|mais|nous|vous|leur|dérive|fichier|erreur|"
        r"sortie|étape|défaut|impact|absence|perte|silencieuse|actualiser|conserver|"
        r"décision|corriger|publié|documenté)(?![\w-])", re.I), 3, True, True),
    ("note de revue interne", re.compile(
        r"(?i)(\bREVIEW\s*\(|\bnote interne\b|\bne pas publier\b|\bbrouillon\b)"), 1, True, True),
    # XXX dans une URL d'exemple (hooks.slack.com/services/XXX) n'est pas une note
    ("note a faire", re.compile(
        r"(?i)(\bTODO\b|\bFIXME\b|(?<!/)\bXXX\b(?!/)|\bà corriger\b|\ba corriger\b)"),
     1, True, True),
    # dans les sources : cosmetique, le prebuild les reecrit. Dans dist : fuite.
    ("chemin personnel", re.compile(
        r"[A-Za-z]:\\+Users\\+(?!<user>|you\b|user\b|username\b|%USERNAME%|USER\b)[A-Za-z0-9_.-]+"), 1, False, True),
    # citer ses propres fichiers en provenance est legitime ; seul le detail
    # d'implementation interne pose probleme
    ("chemin de code interne", re.compile(
        r"hydra_etl[/\\](internal|plugins)[/\\][\w/\\.-]+\.py"), 1, False, True),
]
STALE_DAYS = 14

TAG_FILES = ("*.md", "*.html")


def strip_html(t):
    t = re.sub(r"<(script|style)\b.*?</\1>", " ", t, flags=re.S | re.I)
    # les commentaires restent : on veut justement les inspecter
    return re.sub(r"<(?!!--)[^>]+>", " ", t)


def scan(root, label, html=False, dist=False):
    findings = []
    if not root.is_dir():
        return findings
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix not in (".md", ".html"):
            continue
        if any(p in SKIP_DIRS for p in path.parts):
            continue
        # cote source, seuls les chapitres numerotes sont importes par
        # src/pages/dsl/[chapter].astro : le reste n'est pas publie
        if not dist and path.suffix == ".md" and not re.match(r"\d", path.name):
            continue
        raw = path.read_text(encoding="utf-8", errors="replace")
        text = strip_html(raw) if html else raw
        for name, rx, floor, block_src, block_dist in CHECKS:
            blocking = block_dist if dist else block_src
            for line in text.split("\n"):
                s = line.strip()
                if len(s) < 25:
                    continue
                if len(rx.findall(s)) >= floor:
                    findings.append((blocking, label, name,
                                     str(path.relative_to(root)), s[:120]))
                    break
    return findings


def check_version(repo):
    problems = []
    llms = repo / "dist" / "llms.txt"
    rel = repo / "src" / "data" / "releases.json"
    if not llms.is_file() or not rel.is_file():
        return ["llms.txt ou releases.json introuvable"]

    age = (time.time() - rel.stat().st_mtime) / 86400
    if age > STALE_DAYS:
        problems.append(
            f"releases.json date de {age:.0f} jours : il ne connait peut-etre pas "
            f"la version courante -> `node scripts/fetch-releases.mjs`")

    data = json.loads(rel.read_text(encoding="utf-8"))
    items = data if isinstance(data, list) else list(data.values())[0]

    def key(tag):
        return [int(x) for x in re.findall(r"\d+", tag or "0")] or [0]

    latest = max((i.get("tag", "") for i in items), key=key)
    txt = llms.read_text(encoding="utf-8")
    m = re.search(r"Latest version:\s*([0-9]+(?:\.[0-9]+)*)", txt)
    shown = m.group(1) if m else None

    if shown is None:
        problems.append("llms.txt ne declare aucune version")
    elif key(shown) != key(latest):
        problems.append(
            f"llms.txt annonce {shown}, releases.json culmine a {latest.lstrip('v')} "
            f"-> lancer `node scripts/fetch-releases.mjs` puis corriger llms.txt")
    return problems


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True)
    ap.add_argument("--skip-dist", action="store_true")
    args = ap.parse_args()

    repo = Path(args.repo).expanduser().resolve()
    findings = scan(repo / "DSL-whitebook", "source")
    if not args.skip_dist:
        findings += scan(repo / "dist", "dist", html=True, dist=True)

    groups = {}
    for blocking, label, name, path, snippet in findings:
        groups.setdefault((blocking, label, name), []).append((path, snippet))

    errors = {k: v for k, v in groups.items() if k[0]}
    warns = {k: v for k, v in groups.items() if not k[0]}

    def show(title, g):
        print(f"{title}\n")
        for (_, label, name), rows in sorted(g.items(), key=lambda x: x[0][1:]):
            print(f"  [{label}] {name} — {len(rows)} ligne(s)")
            for path, snippet in rows[:3]:
                print(f"      {path}")
                print(f"        {snippet}")
            if len(rows) > 3:
                print(f"      … et {len(rows)-3} autre(s)")
            print()

    if errors:
        show("BLOQUANT", errors)
    if warns:
        show("AVERTISSEMENTS (non bloquants)", warns)
    if not errors and not warns:
        print("Contenu : rien a signaler.")

    vp = check_version(repo)
    if vp:
        print("PROBLEMES DE VERSION\n")
        for p in vp:
            print(f"  {p}")
    else:
        print("Version : llms.txt est aligne sur releases.json.")

    if errors or vp:
        print("\nEchec du controle.")
        sys.exit(1)
    print("\nControle passe.")


if __name__ == "__main__":
    main()
