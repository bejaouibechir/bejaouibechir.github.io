#!/usr/bin/env python3
"""Detect stale facts in the lessons by comparing them with the Hydra repository.

Checks
  1. `tested_with` of each lesson against the latest released version in CHANGELOG.md;
  2. counts quoted in the prose ("seven sources", "18 transformations") against the Studio node registry.

Usage:
    py check_freshness.py --lessons lessons --hydra-repo "C:/Users/you/Desktop/Hydra"
    py check_freshness.py --lessons lessons --registry nodeRegistry.ts --changelog CHANGELOG.md
"""
from __future__ import annotations

import argparse
import collections
import pathlib
import re
import sys

from common import mask_code, plain, read_text, split_frontmatter

WORDS = {w: i for i, w in enumerate(
    "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen "
    "seventeen eighteen nineteen twenty".split())}
WORDS.update({"thirty": 30})
CATEGORIES = {"sources": "source", "source": "source", "transformations": "transformation",
              "destinations": "destination", "actions": "action", "control flow nodes": "control_flow"}


def registry_counts(ts_path) -> tuple[collections.Counter, dict]:
    text = read_text(ts_path)
    counts: collections.Counter = collections.Counter()
    labels: dict = collections.defaultdict(list)
    for m in re.finditer(r"\{\s*type:\s*'([^']+)'\s*,\s*label:\s*'([^']+)'\s*,\s*category:\s*'([^']+)'", text):
        counts[m.group(3)] += 1
        labels[m.group(3)].append(m.group(2))
    return counts, labels


def latest_version(changelog_path) -> str | None:
    for line in read_text(changelog_path).split("\n"):
        m = re.match(r"^##\s*\[(\d+\.\d+\.\d+)\]", line)
        if m:
            return m.group(1)
    return None


def check(lessons_dir, counts, latest):
    problems = []
    for md in sorted(pathlib.Path(lessons_dir).rglob("*.md")):
        if md.name.endswith(".evidence.md") or md.name.lower() == "readme.md":
            continue
        fm, body, _ = split_frontmatter(read_text(md))
        tw = str(fm.get("tested_with", ""))
        if latest and tw:
            a, b = tuple(map(int, tw.split("."))), tuple(map(int, latest.split(".")))
            if a[:2] != b[:2]:
                problems.append((md, f"tested with {tw}, latest release is {latest}: re-run the lesson"))
        text = plain(mask_code(body))
        for m in re.finditer(r"\b(\d+|" + "|".join(WORDS) + r")\s+(sources?|transformations|destinations|actions|control flow nodes)\b",
                             text, re.I):
            n = int(m.group(1)) if m.group(1).isdigit() else WORDS[m.group(1).lower()]
            cat = CATEGORIES[m.group(2).lower()]
            if counts and cat in counts and n != counts[cat]:
                problems.append((md, f"says '{m.group(0)}' but Studio has {counts[cat]} {cat} nodes"))
    return problems


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--lessons", required=True)
    ap.add_argument("--hydra-repo")
    ap.add_argument("--registry")
    ap.add_argument("--changelog")
    a = ap.parse_args(argv)
    reg = a.registry or (str(pathlib.Path(a.hydra_repo) / "studio/src/lib/nodeRegistry.ts") if a.hydra_repo else None)
    chg = a.changelog or (str(pathlib.Path(a.hydra_repo) / "CHANGELOG.md") if a.hydra_repo else None)
    counts, labels = (registry_counts(reg) if reg else (collections.Counter(), {}))
    latest = latest_version(chg) if chg else None
    if counts:
        print("Studio palette:", ", ".join(f"{k}={v}" for k, v in sorted(counts.items())))
    if latest:
        print("Latest released version:", latest)
    problems = check(a.lessons, counts, latest)
    for md, msg in problems:
        print(f"STALE {md}: {msg}")
    print(f"{len(problems)} stale item(s)")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
