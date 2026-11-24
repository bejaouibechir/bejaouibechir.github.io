#!/usr/bin/env python3
"""Run the code blocks of a lesson in a throw-away copy of a project and record the proof.

Block conventions (info string after the opening fence):
    ```bash exec                 run with bash, expect exit code 0
    ```powershell exec           run with pwsh (skipped when pwsh is not installed)
    ```python exec               run with the current Python
    ```bash exec-fail            run and expect a NON-zero exit code (to show an error on purpose)
    ```yaml file=jobs/x/sources.yaml   write this file into the project before the next blocks run
    ```text / ```output          never run, never checked

Every executed block gets a row in <lesson>.evidence.md between the EXEC-LOG markers:
hash, status, language, exit code, Hydra ETL version, system, date. The captured output is written to
<lesson>.outputs.json so the lesson can quote real output.

SAFETY: this executes the commands of the lesson. Run it only on lessons you wrote or reviewed. Commands run
inside a temporary copy of --project, but nothing prevents a command from touching absolute paths.

Usage:
    py run_blocks.py lessons/49-x/49-x.md --project C:/data/fallbackproject
    py run_blocks.py lesson.md --project proj --mark-verified 1a2b3c4d5e --note "checked in Studio"
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import platform
import re
import shutil
import subprocess
import sys
import tempfile

from common import Block, code_blocks, evidence_path_for, read_text, split_frontmatter

ANSI = re.compile(r"\x1b\[[0-9;?]*[A-Za-z]")
DENY = [r"rm\s+-rf\s+/(\s|$)", r"mkfs", r":\(\)\s*\{", r"format\s+[a-z]:", r"del\s+/s", r"Remove-Item\s+-Recurse\s+[A-Za-z]:\\\s*$"]
BEGIN, END = "<!-- BEGIN EXEC-LOG -->", "<!-- END EXEC-LOG -->"
HEADER = ("| Hash | Status | Language | Exit | Hydra ETL | System | Date | First line |\n"
          "|---|---|---|---|---|---|---|---|")


def hydra_version() -> str:
    try:
        out = subprocess.run(["hdrctl", "--version"], capture_output=True, text=True, timeout=60).stdout
        m = re.search(r"(\d+\.\d+\.\d+)", out)
        return m.group(1) if m else "unknown"
    except (OSError, subprocess.SubprocessError):
        return "not installed"


def runner_for(b: Block):
    if b.lang in ("bash", "sh", "shell"):
        return ["bash", "-c", b.code] if shutil.which("bash") else None
    if b.lang in ("powershell", "pwsh", "ps1"):
        exe = shutil.which("pwsh") or shutil.which("powershell")
        return [exe, "-NoProfile", "-Command", b.code] if exe else None
    if b.lang in ("python", "py"):
        return [sys.executable, "-c", b.code]
    return None


def clean(s: str, workdir: str) -> str:
    return ANSI.sub("", s).replace(workdir, "<project>").strip()


def update_evidence(path: pathlib.Path, new_rows: dict):
    """Merge rows (hash -> markdown row without leading hash cell handling) into the EXEC-LOG table."""
    text = read_text(path) if path.exists() else ""
    if BEGIN not in text:
        text += f"\n## Exec log\n\n{BEGIN}\n{HEADER}\n{END}\n"
    head, rest = text.split(BEGIN, 1)
    table, tail = rest.split(END, 1)
    merged = {}
    for line in table.strip().split("\n"):
        m = re.match(r"^\|\s*([0-9a-f]{10})\s*\|", line)
        if m:
            merged[m.group(1)] = line
    for h, row in new_rows.items():
        merged[h] = row
    body = "\n".join(merged[h] for h in merged)
    path.write_text(f"{head}{BEGIN}\n{HEADER}\n{body}{chr(10) if body else ''}{END}{tail}", encoding="utf-8")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("lesson")
    ap.add_argument("--project", help="project folder copied to a temporary directory before running")
    ap.add_argument("--timeout", type=int, default=300)
    ap.add_argument("--mark-verified", metavar="HASH", help="record a block as MANUAL (verified by hand)")
    ap.add_argument("--note", default="verified by hand")
    ap.add_argument("--dry-run", action="store_true", help="list the blocks without running them")
    a = ap.parse_args(argv)

    lesson = pathlib.Path(a.lesson)
    ev = evidence_path_for(lesson)
    _, body, _ = split_frontmatter(read_text(lesson))
    blocks = code_blocks(body)
    now = dt.date.today().isoformat()
    system = f"{platform.system()} {platform.release()}"
    version = hydra_version()

    if a.mark_verified:
        b = next((x for x in blocks if x.digest == a.mark_verified), None)
        if not b:
            print(f"no block with hash {a.mark_verified}", file=sys.stderr)
            return 1
        row = f"| {b.digest} | MANUAL | {b.lang} | - | {version} | {system} | {now} | {a.note} |"
        update_evidence(ev, {b.digest: row})
        print(f"{b.digest} recorded as MANUAL")
        return 0

    plan = [b for b in blocks if ("exec" in b.flags or "exec-fail" in b.flags or "file" in b.attrs)]
    if a.dry_run:
        for b in plan:
            print(f"{b.digest} {b.lang:10} line {b.start}: {b.code.strip().splitlines()[0] if b.code.strip() else ''}")
        return 0
    if not a.project:
        print("--project is required to run blocks", file=sys.stderr)
        return 2

    tmp = tempfile.mkdtemp(prefix="hydra-lesson-")
    work = str(pathlib.Path(tmp) / "project")
    shutil.copytree(a.project, work, ignore=shutil.ignore_patterns(".git", "node_modules", "__pycache__"))
    rows, outputs, failed = {}, {}, 0
    for b in plan:
        first = (b.code.strip().splitlines() or [""])[0][:60].replace("|", "\\|")
        if "file" in b.attrs:
            target = pathlib.Path(work) / b.attrs["file"]
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(b.code.strip("\n") + "\n", encoding="utf-8")
            rows[b.digest] = f"| {b.digest} | VERIFIED | {b.lang} | - | {version} | {system} | {now} | wrote {b.attrs['file']} |"
            continue
        if any(re.search(p, b.code) for p in DENY):
            rows[b.digest] = f"| {b.digest} | SKIPPED | {b.lang} | - | {version} | {system} | {now} | refused: destructive pattern |"
            failed += 1
            continue
        cmd = runner_for(b)
        if cmd is None:
            rows[b.digest] = f"| {b.digest} | SKIPPED | {b.lang} | - | {version} | {system} | {now} | interpreter not available here: run it on your machine and use --mark-verified |"
            continue
        try:
            p = subprocess.run(cmd, cwd=work, capture_output=True, text=True, timeout=a.timeout)
            code, out = p.returncode, clean(p.stdout + ("\n" + p.stderr if p.stderr.strip() else ""), work)
        except subprocess.TimeoutExpired:
            code, out = 124, f"timeout after {a.timeout}s"
        expect_fail = "exec-fail" in b.flags
        ok = (code != 0) if expect_fail else (code == 0)
        status = "VERIFIED" if ok else "FAILED"
        failed += 0 if ok else 1
        rows[b.digest] = f"| {b.digest} | {status} | {b.lang} | {code} | {version} | {system} | {now} | {first} |"
        outputs[b.digest] = {"line": b.start, "exit": code, "expect_fail": expect_fail, "output": out}
        print(f"{b.digest} {status:8} exit={code}  {first}")

    update_evidence(ev, rows)
    out_path = lesson.with_name(lesson.stem + ".outputs.json")
    out_path.write_text(json.dumps(outputs, indent=2, ensure_ascii=False), encoding="utf-8")
    shutil.rmtree(tmp, ignore_errors=True)
    print(f"evidence: {ev}\noutputs : {out_path}\n{len(plan)} block(s), {failed} problem(s)")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
