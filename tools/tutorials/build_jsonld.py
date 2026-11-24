#!/usr/bin/env python3
"""Build the Schema.org JSON-LD (TechArticle, HowTo, FAQPage, BreadcrumbList) of a lesson.

Only visible content is described: the H1, the steps (H3 under 'Steps') and the FAQ come from the markdown.
Nothing is invented: the author comes from the frontmatter, dates from the frontmatter.

Usage:
    py build_jsonld.py lessons/49-x/49-x.md [--base-url https://hydraetl.com] [--author-url URL] [--out file.json]
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys

from common import (LINK_RE, headings, mask_code, plain, read_text, split_frontmatter)


def sections(body: str):
    """Yield (level, title, text) for each heading with the text up to the next heading."""
    masked = mask_code(body)
    heads = headings(masked)
    lines = body.split("\n")
    for k, (lvl, title, ln) in enumerate(heads):
        end = heads[k + 1][2] - 1 if k + 1 < len(heads) else len(lines)
        yield lvl, title, "\n".join(lines[ln:end]).strip()


def first_paragraph(text: str) -> str:
    for para in re.split(r"\n\s*\n", text):
        p = plain(para)
        if p and not para.lstrip().startswith(("```", "~~~", "!", "|", "-", "*")):
            return p
    return ""


def build(md_path, base_url: str, author_url: str | None):
    fm, body, _ = split_frontmatter(read_text(md_path))
    secs = list(sections(body))
    h1 = next((t for l, t, _ in secs if l == 1), fm.get("title", ""))
    slug = fm["slug"]
    number = int(fm["lesson"])
    path = fm.get("url_path") or f"/studio/{number:02d}-{slug}/"
    url = base_url.rstrip("/") + path

    author = {"@type": "Person", "name": fm["author"]}
    if author_url:
        author["url"] = author_url
    tech = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": h1,
        "description": fm["description"],
        "inLanguage": "en-US",
        "author": author,
        "datePublished": fm["date_published"],
        "dateModified": fm["date_modified"],
        "mainEntityOfPage": url,
        "keywords": fm["keyword"],
        "about": {"@type": "SoftwareApplication", "name": "Hydra ETL", "applicationCategory": "DeveloperApplication",
                  "softwareVersion": str(fm["tested_with"]), "url": base_url},
    }

    steps_i = next((i for i, (l, t, _) in enumerate(secs) if l == 2 and t.lower().startswith(("steps", "step-by-step"))), None)
    steps = []
    if steps_i is not None:
        for l, t, txt in secs[steps_i + 1:]:
            if l <= 2:
                break
            if l == 3:
                steps.append({"@type": "HowToStep", "name": re.sub(r"^Step\s*\d+\s*[:.-]\s*", "", t),
                              "text": first_paragraph(txt) or t})
    howto = {"@context": "https://schema.org", "@type": "HowTo", "name": h1, "step": steps} if steps else None

    faq_i = next((i for i, (l, t, _) in enumerate(secs) if l == 2 and t.lower().startswith("frequently asked")), None)
    questions = []
    if faq_i is not None:
        for l, t, txt in secs[faq_i + 1:]:
            if l <= 2:
                break
            if l == 3 and t.endswith("?"):
                questions.append({"@type": "Question", "name": t,
                                  "acceptedAnswer": {"@type": "Answer", "text": plain(txt)}})
    faq = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": questions} if questions else None

    crumbs = [("Home", base_url.rstrip("/") + "/"), ("Hydra Studio", base_url.rstrip("/") + "/studio/"),
              (str(fm["block"]), None), (h1, url)]
    items, pos = [], 0
    for name, link in crumbs:
        pos += 1
        entry = {"@type": "ListItem", "position": pos, "name": name}
        if link:
            entry["item"] = link
        items.append(entry)
    breadcrumb = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}

    return [x for x in (tech, howto, faq, breadcrumb) if x]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("lesson")
    ap.add_argument("--base-url", default="https://hydraetl.com")
    ap.add_argument("--author-url")
    ap.add_argument("--out")
    a = ap.parse_args(argv)
    data = build(a.lesson, a.base_url, a.author_url)
    out = pathlib.Path(a.out) if a.out else pathlib.Path(a.lesson).with_suffix(".jsonld.json")
    out.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {out} ({', '.join(d['@type'] for d in data)})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
