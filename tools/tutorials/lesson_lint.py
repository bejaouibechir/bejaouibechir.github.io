#!/usr/bin/env python3
"""Lint a Hydra Studio tutorial against the writing charter (SEO, GEO, AEO and evidence rules).

Usage:
    py lesson_lint.py lessons/49-fallback/49-fallback.md [more.md ...] [--crosspost] [--json]
    py lesson_lint.py lessons/ --no-file-check

Exit code 1 when at least one ERROR is found. Standard library only.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import re
import sys

from common import (IMAGE_RE, LINK_RE, VERIFY_LANGS, code_blocks, evidence_path_for,
                    evidence_rows, headings, mask_code, plain, read_text,
                    split_frontmatter, word_count)

REQUIRED_FM = ["title", "description", "slug", "lesson", "block", "keyword", "author",
               "date_published", "date_modified", "tested_with"]

SECTIONS = [
    ("Prerequisites", ("prerequisites",)),
    ("Steps", ("steps", "step-by-step")),
    ("Tips and tricks", ("tips and tricks",)),
    ("Common errors", ("common errors",)),
    ("CLI equivalent", ("cli equivalent",)),
    ("Frequently asked questions", ("frequently asked questions",)),
    ("Related lessons", ("related lessons",)),
    ("Sources", ("sources",)),
]

BRITISH = ["licence", "behaviour", "colour", "organisation", "centre", "favourite", "catalogue",
           "optimise", "initialise", "customise", "recognise", "grey"]
GENERIC_ANCHORS = {"here", "click here", "link", "read more", "this", "this page", "more", "this link"}
SUPERLATIVES = ["fastest", "blazing", "best-in-class", "revolutionary", "10x", "game-changing", "effortless"]
RELATIVE_TIME = ["recently", "last week", "yesterday", "the other day", "a few days ago", "last month"]
PLACEHOLDERS = ["TODO", "TBD", "UNVERIFIED", "lorem ipsum", "FIXME"]
FORBIDDEN = ["Andaluz"]  # clients of the author must never be mentioned


class Report:
    def __init__(self, path):
        self.path = str(path)
        self.items = []

    def add(self, level, code, msg, line=None):
        self.items.append({"level": level, "code": code, "message": msg, "line": line})

    def err(self, code, msg, line=None):
        self.add("ERROR", code, msg, line)

    def warn(self, code, msg, line=None):
        self.add("WARN", code, msg, line)

    @property
    def errors(self):
        return [i for i in self.items if i["level"] == "ERROR"]


def _norm(s: str) -> str:
    return re.sub(r"[\s\-_]+", " ", s.lower()).strip()


def lint(path, crosspost=False, check_files=True, no_images=False) -> Report:
    path = pathlib.Path(path)
    rep = Report(path)
    text = read_text(path)
    fm, body, removed = split_frontmatter(text)
    off = removed  # add to body line numbers to get file line numbers

    # --- frontmatter -------------------------------------------------------
    for k in REQUIRED_FM:
        if k not in fm or fm[k] in ("", None, []):
            rep.err("FM001", f"frontmatter key '{k}' is missing or empty")
    title = str(fm.get("title", ""))
    desc = str(fm.get("description", ""))
    kw = str(fm.get("keyword", ""))
    if title:
        if len(title) > 60:
            rep.err("T001", f"title is {len(title)} characters (maximum 60)")
        if not title.rstrip().endswith("| Hydra ETL"):
            rep.err("T002", "title must end with '| Hydra ETL' (brand last)")
        if kw and _norm(kw) not in _norm(title):
            rep.err("T003", f"primary keyword '{kw}' is not in the title")
        elif kw and _norm(title).find(_norm(kw)) > 25:
            rep.warn("T004", "primary keyword should come first in the title")
    if desc:
        if len(desc) > 155:
            rep.err("D001", f"meta description is {len(desc)} characters (maximum 155)")
        elif len(desc) < 70:
            rep.warn("D002", f"meta description is short ({len(desc)} characters)")
        if kw and _norm(kw) not in _norm(desc):
            rep.warn("D003", "primary keyword is missing from the meta description")
    try:
        d1 = dt.date.fromisoformat(str(fm.get("date_published", "")))
        d2 = dt.date.fromisoformat(str(fm.get("date_modified", "")))
        if d2 < d1:
            rep.err("DT001", "date_modified is earlier than date_published")
    except ValueError:
        rep.err("DT002", "date_published and date_modified must be ISO dates (YYYY-MM-DD)")
    tested = str(fm.get("tested_with", ""))
    if tested and not re.fullmatch(r"\d+\.\d+\.\d+", tested):
        rep.err("V001", "tested_with must look like 0.22.0")

    masked = mask_code(body)
    heads = headings(masked)
    h1s = [h for h in heads if h[0] == 1]

    # --- H1 and answer block ----------------------------------------------
    if len(h1s) != 1:
        rep.err("H001", f"expected exactly one H1, found {len(h1s)}")
    elif kw and _norm(kw) not in _norm(h1s[0][1]):
        rep.err("H002", f"primary keyword '{kw}' is not in the H1", h1s[0][2] + off)
    if h1s:
        lines = masked.split("\n")
        i = h1s[0][2]  # 1-based line of H1 -> index i is the next line
        while i < len(lines) and not lines[i].strip():
            i += 1
        if i >= len(lines) or re.match(r"^\s*(#|[-*>!|]|\d+\.)", lines[i]):
            rep.err("A002", "the H1 must be followed directly by the answer paragraph", i + 1 + off)
        else:
            para = []
            while i < len(lines) and lines[i].strip():
                para.append(lines[i])
                i += 1
            n = word_count(plain(" ".join(para)))
            if not 40 <= n <= 60:
                rep.err("A001", f"answer block has {n} words (expected 40 to 60)", h1s[0][2] + off)
            if "Hydra ETL" not in " ".join(para):
                rep.warn("A003", "name 'Hydra ETL' in the answer block")

    # --- sections ----------------------------------------------------------
    h2s = [h for h in heads if h[0] == 2]
    for label, keys in SECTIONS:
        if not any(_norm(h[1]).startswith(k) for h in h2s for k in keys):
            rep.err("S001", f"missing section: {label}")
    if sum(1 for h in h2s if h[1].endswith("?")) < 2:
        rep.warn("S002", "use question-style H2 headings where natural (at least 2)")
    if not re.search(r"Tested with Hydra ETL\s+(\d+\.\d+\.\d+)", body):
        rep.err("V002", "add the line 'Tested with Hydra ETL x.y.z on <OS>, <date>'")
    else:
        v = re.search(r"Tested with Hydra ETL\s+(\d+\.\d+\.\d+)", body).group(1)
        if tested and v != tested:
            rep.err("V003", f"'Tested with' says {v} but frontmatter says {tested}")

    # --- FAQ ---------------------------------------------------------------
    faq_idx = next((k for k, h in enumerate(heads) if h[0] == 2 and _norm(h[1]).startswith("frequently asked")), None)
    if faq_idx is not None:
        faq_qs, faq_start, faq_end = [], heads[faq_idx][2], len(masked.split("\n")) + 1
        for h in heads[faq_idx + 1:]:
            if h[0] <= 2:
                faq_end = h[2]
                break
            if h[0] == 3:
                faq_qs.append(h)
        if not 3 <= len(faq_qs) <= 5:
            rep.err("F001", f"FAQ has {len(faq_qs)} questions (expected 3 to 5)")
        for h in faq_qs:
            if not h[1].endswith("?"):
                rep.err("F002", f"FAQ heading must be a question: '{h[1]}'", h[2] + off)
        faq_text = "\n".join(body.split("\n")[faq_start:faq_end - 1])
        links = LINK_RE.findall(faq_text)
        has_ext = any(_is_external(u) for _, u in links)
        has_int = any(not _is_external(u) for _, u in links)
        if not has_int:
            rep.warn("F003", "FAQ should link to at least one related lesson or topic")
        if not has_ext:
            rep.warn("F004", "FAQ should link to at least one external reference")

    # --- images ------------------------------------------------------------
    imgs = IMAGE_RE.findall(body)
    if not imgs and not no_images:
        rep.err("I001", "the lesson has no screenshot")
    elif len(imgs) < 2 and not no_images:
        rep.warn("I002", "add more screenshots (at least 2 recommended)")
    themes = set()
    for alt, src in imgs:
        name = pathlib.PurePosixPath(src).name
        if len(alt.strip()) < 20:
            rep.err("I003", f"alt text too short for '{name}' (describe what the reader sees)")
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+){2,}\.(png|webp|jpg)", name):
            rep.err("I004", f"image file name '{name}' must be descriptive kebab-case (3 words minimum)")
        if re.match(r"screen\d*", name):
            rep.err("I005", f"image file name '{name}' is not descriptive")
        m = re.search(r"-(light|dark|midnight|ocean)\.\w+$", name)
        if m:
            themes.add("light" if m.group(1) == "light" else "dark")
        else:
            rep.warn("I006", f"image '{name}' should end with its theme (-light or -dark)")
        if check_files and not src.startswith(("http://", "https://", "/")):
            if not (path.parent / src).exists():
                rep.err("I007", f"image file not found: {src}")
    if len(imgs) >= 2 and len(themes) == 1:
        rep.warn("I008", "all screenshots use the same theme: mix light and dark")

    # --- links -------------------------------------------------------------
    links = LINK_RE.findall(body)
    internal = [(a, u) for a, u in links if not _is_external(u)]
    external = [(a, u) for a, u in links if _is_external(u)]
    if len(internal) < 3:
        rep.warn("L001", f"only {len(internal)} internal links (3 or more recommended)")
    if not external:
        rep.err("L002", "add at least one external link to an authoritative source")
    for a, u in links:
        if a.strip().lower() in GENERIC_ANCHORS:
            rep.err("L003", f"non-descriptive link text '{a}' -> {u}")
        if u.startswith("http://"):
            rep.err("L004", f"insecure link: {u}")
        if re.match(r"https?://(www\.)?hydraetl\.com", u):
            if crosspost:
                if not all(f"utm_{k}=" in u for k in ("source", "medium", "campaign")):
                    rep.err("L005", f"link to hydraetl.com needs utm_source, utm_medium and utm_campaign: {u}")
            else:
                rep.warn("L006", f"use a root-relative link instead of {u}")

    # --- prose checks ------------------------------------------------------
    prose = re.sub(r"https?://\S+", "", re.sub(r"!\[[^\]]*\]\([^)]*\)", "", masked))
    words = word_count(plain(prose))
    if words < 300:
        rep.err("C001", f"only {words} words: thin content")
    elif words < 600:
        rep.warn("C002", f"{words} words: consider adding depth (600 or more recommended)")
    low = prose.lower()
    for w in BRITISH:
        if re.search(r"\b" + w + r"(?:s|d)?\b", low):
            rep.err("E001", f"British spelling '{w}': use en-US")
    for w in SUPERLATIVES:
        if w in low:
            rep.warn("E002", f"unproven superlative '{w}'")
    for w in RELATIVE_TIME:
        if w in low:
            rep.warn("E003", f"relative time '{w}': give a date")
    for p in PLACEHOLDERS:
        if re.search(re.escape(p), text, re.I if p == "lorem ipsum" else 0):
            rep.err("E004", f"placeholder or unverified marker '{p}' left in the lesson")
    for p in FORBIDDEN:
        if p.lower() in text.lower():
            rep.err("E005", f"'{p}' must not be mentioned")
    clean = re.sub(r"https?://\S+|\([^)]*\.(?:png|webp|jpg)\)", "", prose)
    firsts = [m for m in re.finditer(r"\bHydra\b", clean)]
    if firsts:
        nxt = clean[firsts[0].end():firsts[0].end() + 8]
        if not re.match(r"\s+(ETL|Studio)", nxt):
            rep.err("B001", "first mention must be 'Hydra ETL' (never 'Hydra' alone)")
        bare = [m for m in firsts if not re.match(r"\s+(ETL|Studio|DSL|CLI)", clean[m.end():m.end() + 8])]
        if bare:
            rep.warn("B002", f"'Hydra' used alone {len(bare)} time(s): prefer 'Hydra ETL'")
    if not re.search(r"(not|un)related to", body[:2500], re.I):
        rep.warn("B003", "add a disambiguation sentence (unrelated to Meta's Hydra config library and to the PostgreSQL extension)")

    # --- code and evidence -------------------------------------------------
    ev_path = evidence_path_for(path)
    if not ev_path.exists():
        rep.err("EV001", f"evidence file missing: {ev_path.name}")
    rows = evidence_rows(ev_path)
    for b in code_blocks(body):
        if b.lang not in VERIFY_LANGS or {"output", "text"} & b.flags:
            continue
        if "nocheck" in b.flags:
            rep.warn("EV002", f"code block {b.digest} is flagged nocheck (not verified)", b.start + off)
            continue
        st = rows.get(b.digest, ("", ""))[0]
        if st not in ("VERIFIED", "MANUAL"):
            rep.err("EV003", f"code block {b.digest} ({b.lang}) has no VERIFIED entry in the evidence file "
                    f"(status: {st or 'absent'})", b.start + off)
    return rep


def _is_external(url: str) -> bool:
    return bool(re.match(r"https?://", url)) and not re.match(r"https?://(www\.)?hydraetl\.com", url)


def collect(paths):
    out = []
    for p in map(pathlib.Path, paths):
        if p.is_dir():
            out += sorted(x for x in p.rglob("*.md") if not x.name.endswith(".evidence.md")
                          and x.name.lower() != "readme.md")
        else:
            out.append(p)
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="+")
    ap.add_argument("--crosspost", action="store_true", help="require UTM parameters on hydraetl.com links")
    ap.add_argument("--no-file-check", action="store_true", help="do not check that image files exist")
    ap.add_argument("--no-images", action="store_true", help="allow a lesson without screenshots")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args(argv)
    reports = [lint(p, a.crosspost, not a.no_file_check, a.no_images) for p in collect(a.paths)]
    if a.json:
        print(json.dumps([{"path": r.path, "items": r.items} for r in reports], indent=2))
    else:
        for r in reports:
            print(f"\n{r.path}")
            if not r.items:
                print("  OK")
            for i in r.items:
                loc = f":{i['line']}" if i["line"] else ""
                print(f"  {i['level']:5} {i['code']:6}{loc} {i['message']}")
        n_err = sum(len(r.errors) for r in reports)
        n_warn = sum(len(r.items) - len(r.errors) for r in reports)
        print(f"\n{len(reports)} lesson(s): {n_err} error(s), {n_warn} warning(s)")
    return 1 if any(r.errors for r in reports) else 0


if __name__ == "__main__":
    sys.exit(main())
