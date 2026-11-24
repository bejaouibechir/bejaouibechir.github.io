#!/usr/bin/env python3
"""
Recense toutes les questions deja publiees, depuis les paquets _notebooklm.

Remplace le prompt 1 : un LLM recense mal 400 lignes, un script les recense
toutes. Sortie : faq-index.tsv + un resume par section.

Usage :
    py extract_faq_index.py --dir "C:\\...\\tools\\tutorials\\_notebooklm"
"""

import argparse
import csv
import re
from collections import Counter
from pathlib import Path

HEAD_RE = re.compile(r"^## (?P<title>.+?) — slug: (?P<url>\S+)\s*$")
MIN_WORDS, MAX_WORDS = 3, 30

# Intitules structurels repris a l'identique dans chaque lecon : ce sont des
# titres de section, pas des entrees de FAQ.
BOILERPLATE = {
    "what will you learn in this lesson?",
    "what should i have at the end?",
    "what if something goes wrong?",
    "what do you need before you start?",
}


def sections(text):
    cur = None
    buf = []
    for line in text.split("\n"):
        m = HEAD_RE.match(line)
        if m:
            if cur:
                yield cur, buf
            cur, buf = m.groupdict(), []
        elif cur is not None:
            buf.append(line)
    if cur:
        yield cur, buf


def answer_after(lines, n):
    for k in range(n + 1, min(n + 6, len(lines))):
        s = lines[k].strip()
        if not s or s.startswith("#") or s == "---":
            continue
        if len(s.split()) < 4:
            continue
        return s
    return ""


def extract(path):
    rows = []
    for head, lines in sections(path.read_text(encoding="utf-8")):
        for n, raw in enumerate(lines):
            s = raw.strip()
            if not s.endswith("?"):
                continue
            depth = len(s) - len(s.lstrip("#"))
            q = s.lstrip("#").strip()
            if not (MIN_WORDS <= len(q.split()) <= MAX_WORDS):
                continue
            if q.lower() in BOILERPLATE:
                kind = "section"
            elif depth and depth <= 4:
                kind = "section"
            else:
                kind = "faq"
            rows.append({
                "question": q,
                "kind": kind,
                "url": head["url"],
                "title": head["title"],
                "bundle": path.name,
                "answer_preview": answer_after(lines, n)[:300],
            })
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    d = Path(args.dir).expanduser().resolve()
    rows = []
    for p in sorted(d.glob("*.md")):
        if p.name.startswith("faq-index"):
            continue          # sortie de ce script : la relire doublerait tout
        rows += extract(p)

    seen, uniq = set(), []
    for r in rows:
        key = (r["url"], r["question"].lower())
        if key in seen:
            continue
        seen.add(key)
        uniq.append(r)

    out = Path(args.out) if args.out else d / "faq-index.tsv"
    with out.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, delimiter="\t",
                           fieldnames=["question", "kind", "url", "title",
                                       "bundle", "answer_preview"])
        w.writeheader()
        w.writerows(uniq)

    faq = [r for r in uniq if r["kind"] == "faq"]
    print(f"Questions retenues : {len(uniq)}  (dont FAQ : {len(faq)}, "
          f"titres de section : {len(uniq) - len(faq)})")
    print(f"Pages concernees   : {len({r['url'] for r in faq})}")

    sec = Counter()
    for r in faq:
        parts = r["url"].strip("/").split("/")
        sec["/" + ("/".join(parts[:2]) if parts[0] == "cli" and len(parts) > 1
                   and parts[1] == "guides" else parts[0])] += 1
    print("\nQuestions de FAQ par section :")
    for k, v in sec.most_common():
        print(f"  {k:16} {v}")

    dup = Counter(r["question"].strip().lower() for r in faq)
    rep = [(q, c) for q, c in dup.items() if c > 1]
    print(f"\nQuestions posees sur plusieurs pages : {len(rep)}")
    for q, c in sorted(rep, key=lambda x: -x[1])[:15]:
        print(f"  {c}x  {q[:88]}")

    # liste d'exclusion a charger comme source dans NotebookLM
    md = out.parent / "faq-index.md"
    by = {}
    for r in sorted(faq, key=lambda r: r["url"]):
        by.setdefault((r["url"], r["title"]), []).append(r["question"])
    lines = [
        "# Questions already published on hydraetl.com",
        "",
        "This file is the exclusion list. Every question below is ALREADY answered",
        "on the page named above it. Do not propose any of them as a new question.",
        "",
        f"Total: {len(faq)} questions across {len(by)} pages.",
        "",
    ]
    for (url, title), qs in by.items():
        lines.append(f"## {title} — slug: {url}")
        lines += [f"- {q}" for q in qs]
        lines.append("")
    md.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"\nEcrit : {out}")
    print(f"Ecrit : {md}   <- a charger comme 7e source dans NotebookLM")


if __name__ == "__main__":
    main()
