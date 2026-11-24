#!/usr/bin/env python3
"""Shared helpers for the Hydra Studio tutorial toolkit (standard library only)."""
from __future__ import annotations

import hashlib
import pathlib
import re
from dataclasses import dataclass, field

VERIFY_LANGS = {"bash", "sh", "shell", "powershell", "pwsh", "ps1", "cmd", "bat",
                "python", "py", "yaml", "yml", "json"}


def read_text(path) -> str:
    return pathlib.Path(path).read_text(encoding="utf-8").replace("\r\n", "\n")


def _scalar(v: str):
    v = v.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
        return v[1:-1]
    if v.startswith("[") and v.endswith("]"):
        return [_scalar(x) for x in v[1:-1].split(",") if x.strip()]
    if re.fullmatch(r"-?\d+", v):
        return int(v)
    return v


def parse_simple_yaml(block: str) -> dict:
    """Tiny YAML subset: `key: value`, quoted values, `[a, b]`, and `- item` lists."""
    data: dict = {}
    key = None
    for raw in block.split("\n"):
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        m = re.match(r"^([A-Za-z_][\w-]*):\s*(.*)$", raw)
        if m:
            key, val = m.group(1), m.group(2).strip()
            data[key] = [] if val == "" else _scalar(val)
        elif raw.strip().startswith("- ") and key is not None:
            if not isinstance(data.get(key), list):
                data[key] = []
            data[key].append(_scalar(raw.strip()[2:]))
    return data


def split_frontmatter(text: str) -> tuple[dict, str, int]:
    """Return (frontmatter, body, number_of_lines_removed)."""
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            after = text.find("\n", end + 1)
            after = len(text) if after == -1 else after + 1
            fm = parse_simple_yaml(text[4:end])
            removed = text[:after].count("\n")
            return fm, text[after:], removed
    return {}, text, 0


@dataclass
class Block:
    lang: str
    flags: set
    attrs: dict
    code: str
    start: int  # 1-based line of the opening fence (in body)
    end: int

    @property
    def digest(self) -> str:
        norm = "\n".join(l.rstrip() for l in self.code.strip("\n").split("\n"))
        return hashlib.sha1(norm.encode("utf-8")).hexdigest()[:10]


def code_blocks(body: str) -> list[Block]:
    lines = body.split("\n")
    out: list[Block] = []
    i = 0
    while i < len(lines):
        m = re.match(r"^\s*(`{3,}|~{3,})\s*(.*)$", lines[i])
        if not m:
            i += 1
            continue
        fence, info = m.group(1), m.group(2).strip()
        closer = re.compile(r"^\s*" + re.escape(fence[0]) + "{" + str(len(fence)) + r",}\s*$")
        j, buf = i + 1, []
        while j < len(lines) and not closer.match(lines[j]):
            buf.append(lines[j])
            j += 1
        tokens = info.split()
        lang = tokens[0].lower() if tokens else ""
        flags, attrs = set(), {}
        for t in tokens[1:]:
            if "=" in t:
                k, v = t.split("=", 1)
                attrs[k] = v
            else:
                flags.add(t)
        out.append(Block(lang, flags, attrs, "\n".join(buf), i + 1, j + 1))
        i = j + 1
    return out


def mask_code(body: str) -> str:
    """Blank out fenced code (keeping line numbers) and inline code."""
    lines = body.split("\n")
    for b in code_blocks(body):
        for k in range(b.start - 1, min(b.end, len(lines))):
            lines[k] = ""
    text = "\n".join(lines)
    return re.sub(r"`[^`\n]*`", "", text)


def headings(masked: str) -> list[tuple[int, str, int]]:
    out = []
    for n, line in enumerate(masked.split("\n"), 1):
        m = re.match(r"^(#{1,6})\s+(.*?)\s*#*\s*$", line)
        if m:
            out.append((len(m.group(1)), m.group(2).strip(), n))
    return out


def plain(text: str) -> str:
    """Markdown to plain text (links keep their label, images and html comments dropped)."""
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"[*_`>#]", "", text)
    return re.sub(r"\s+", " ", text).strip()


def word_count(text: str) -> int:
    return len(re.findall(r"[A-Za-z0-9][\w'’.-]*", text))


LINK_RE = re.compile(r"(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")

EVIDENCE_ROW = re.compile(r"^\|\s*([0-9a-f]{10})\s*\|\s*(VERIFIED|FAILED|SKIPPED|MANUAL)\s*\|(.*)$")


def evidence_rows(path) -> dict[str, tuple[str, str]]:
    """hash -> (status, rest of the row)."""
    p = pathlib.Path(path)
    if not p.exists():
        return {}
    rows = {}
    for line in read_text(p).split("\n"):
        m = EVIDENCE_ROW.match(line.strip())
        if m:
            rows[m.group(1)] = (m.group(2), m.group(3))
    return rows


def evidence_path_for(lesson_md) -> pathlib.Path:
    p = pathlib.Path(lesson_md)
    return p.with_name(p.stem + ".evidence.md")
