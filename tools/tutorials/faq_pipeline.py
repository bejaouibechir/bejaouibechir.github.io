#!/usr/bin/env python3
"""
Chaine complete : assainir le site, le reconstruire, regenerer le corpus
NotebookLM, et dire ce qui reste a faire a la main.

Lancer :  run_faq_pipeline.bat
ou     :  py tools\\tutorials\\faq_pipeline.py

Options :
    --push              pousse sur GitHub a la fin (sinon : commit local seulement)
    --skip-releases     ne publie pas les Releases GitHub manquantes
    --skip-build        ne relance pas npm run build (rapide, pour reessayer la fin)
    --repo <chemin>     racine du depot (par defaut : deduit de ce fichier)

Chaque etape s'arrete au premier echec et dit quoi faire.
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

RELEASES = [
    ("v0.19.1", "v0.19.1"),
    ("v0.20.0", "v0.20.0 — SQLite and Snowflake source"),
    ("v0.21.0", "v0.21.0 — Snowflake destination"),
    ("v0.22.0", "v0.22.0 — BigQuery, MySQL CDC, object stores"),
]
PRODUCT_REPO = "bejaouibechir/Hydra"

step_no = 0
notes = []


def head(title):
    global step_no
    step_no += 1
    print()
    print("=" * 72)
    print(f"  ETAPE {step_no} — {title}")
    print("=" * 72)


def run(cmd, cwd, check=True, quiet=False):
    print(f"  $ {' '.join(cmd)}")
    r = subprocess.run(cmd, cwd=str(cwd), shell=False,
                       capture_output=True, text=True, encoding="utf-8",
                       errors="replace")
    out = ((r.stdout or "") + (r.stderr or "")).rstrip()
    if out and not quiet:
        for line in out.split("\n")[-25:]:
            print(f"    {line}")
    if check and r.returncode != 0:
        print(f"\n  ECHEC (code {r.returncode}).")
        raise SystemExit(1)
    return r.returncode, out


def which(name):
    return shutil.which(name) or shutil.which(name + ".cmd") or shutil.which(name + ".exe")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", default=None)
    ap.add_argument("--push", action="store_true")
    ap.add_argument("--skip-releases", action="store_true")
    ap.add_argument("--skip-build", action="store_true")
    args = ap.parse_args()

    here = Path(__file__).resolve()
    repo = Path(args.repo).resolve() if args.repo else here.parent.parent.parent
    tools = repo / "tools" / "tutorials"

    if not (repo / "package.json").is_file():
        raise SystemExit(f"Pas un depot de site : {repo}\nUtilise --repo <chemin>.")

    print(f"Depot : {repo}")
    npm = which("npm")
    node = which("node")
    gh = which("gh")
    git = which("git")
    for label, exe in (("node", node), ("npm", npm), ("git", git)):
        if not exe:
            raise SystemExit(f"{label} introuvable dans le PATH.")
    print(f"node={node}\nnpm={npm}\ngit={git}\ngh={gh or 'absent'}")

    # ------------------------------------------------------------------
    head("Publier les Releases GitHub manquantes")
    if args.skip_releases:
        print("  ignore (--skip-releases)")
    elif not gh:
        print("  gh introuvable : etape sautee.")
        notes.append(
            "Publier a la main les Releases v0.19.1, v0.20.0, v0.21.0 et v0.22.0 sur\n"
            f"       https://github.com/{PRODUCT_REPO}/releases/new — choisir le tag existant\n"
            f"       et coller le contenu de tools\\tutorials\\_releases\\notes-<version>.md")
    else:
        for tag, title in RELEASES:
            notes_file = tools / "_releases" / f"notes-{tag.lstrip('v')}.md"
            if not notes_file.is_file():
                print(f"  {tag} : notes absentes ({notes_file.name}), ignore")
                continue
            code, _ = run([gh, "release", "view", tag, "--repo", PRODUCT_REPO],
                          repo, check=False, quiet=True)
            if code == 0:
                print(f"  {tag} : deja publiee")
                continue
            run([gh, "release", "create", tag, "--repo", PRODUCT_REPO,
                 "--title", title, "--notes-file", str(notes_file)], repo)

    # ------------------------------------------------------------------
    head("Rafraichir les donnees de version")
    run([node, "scripts/fetch-releases.mjs"], repo)
    rel = repo / "src" / "data" / "releases.json"
    latest = None
    if rel.is_file():
        data = json.loads(rel.read_text(encoding="utf-8"))
        items = data if isinstance(data, list) else list(data.values())[0]
        latest = max((i.get("tag", "") for i in items),
                     key=lambda t: [int(x) for x in re.findall(r"\d+", t or "0")] or [0])
        print(f"  version la plus recente dans releases.json : {latest}")
        if latest != "v0.22.0":
            notes.append(
                f"releases.json culmine a {latest} : les Releases GitHub des versions\n"
                "       suivantes ne sont pas publiees. /changelog/ restera incomplet.")

    # ------------------------------------------------------------------
    head("Retirer les commentaires de revue internes")
    run([sys.executable, str(tools / "strip_review_comments.py"),
         "--repo", str(repo)], repo)

    # ------------------------------------------------------------------
    head("Reconstruire le site")
    if args.skip_build:
        print("  ignore (--skip-build)")
    else:
        run([npm, "run", "build"], repo)

    # ------------------------------------------------------------------
    head("Controle avant publication")
    code, _ = run([sys.executable, str(tools / "check_publish.py"),
                   "--repo", str(repo)], repo, check=False)
    if code != 0:
        print("\n  Le controle a echoue. Rien n'est commite.")
        print("  Corrige ce qui est signale, puis relance avec --skip-releases.")
        raise SystemExit(1)

    # ------------------------------------------------------------------
    head("Regenerer le corpus NotebookLM")
    run([sys.executable, str(tools / "make_notebooklm_bundles_v3.py"),
         "--repo", str(repo)], repo)
    run([sys.executable, str(tools / "extract_faq_index.py"),
         "--dir", str(tools / "_notebooklm")], repo)

    # ------------------------------------------------------------------
    head("Commit")
    run([git, "add", "-A"], repo)
    code, out = run([git, "diff", "--cached", "--quiet"], repo, check=False, quiet=True)
    if code == 0:
        print("  rien a commiter")
    else:
        run([git, "commit", "-m",
             "Site hygiene: remove internal notes, llms.txt 0.22.0, refresh releases"], repo)
        if args.push:
            run([git, "push"], repo)
        else:
            notes.append("Commit local fait, non pousse. Pour pousser : git push")

    # ------------------------------------------------------------------
    print()
    print("=" * 72)
    print("  TERMINE")
    print("=" * 72)
    if notes:
        print("\nA REGLER :")
        for n in notes:
            print(f"  - {n}")

    bundles = tools / "_notebooklm"
    print(f"""
CE QUI RESTE, ET QUI NE S'AUTOMATISE PAS

1. NotebookLM — remplacer les sources
   Supprime les anciennes, charge les 7 fichiers de :
     {bundles}
       faq-index.md      <- la liste d'exclusion, la plus importante
       pillars.md
       lessons-01-studio.md
       lessons-02-orchestration.md
       cli-guides.md
       guide.md
       reference.md
   Verifie que les 7 cases sont cochees.

2. Lancer les prompts, un chat neuf par prompt
   Ils sont dans tools\\tutorials\\prompts-notebooklm-faq.md
     P4  les trous            1 passage    <- deja fait
     P1  questions transverses 7 passages  (une intention par passage)
     P2  erreurs               4 passages  (une source par passage)
     P3  decision                1 passage
   Ajoute a chaque prompt :
     Copy each slug character by character from the source header.
     Never reconstruct a slug from the page title.
   Colle chaque sortie brute dans out-P1.md, out-P2.md, out-P3.md.

3. Me renvoyer les sorties
   Je verifie chaque slug et chaque citation contre le corpus, je trie,
   et je prepare la page /faq avec son JSON-LD et ses ancres.

RAPPEL : /faq route, elle ne republie pas. 541 questions existent deja,
dont 189 sur /migrate. Une question deja couverte se lie, elle ne se reecrit pas.
""")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nInterrompu.")
        sys.exit(130)
