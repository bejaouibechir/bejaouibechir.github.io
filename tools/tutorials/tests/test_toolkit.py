"""Self-tests of the tutorial toolkit. Run:  py -m unittest discover -s tests -v  (from the toolkit folder)."""
import json
import pathlib
import sqlite3
import subprocess
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import build_jsonld  # noqa: E402
import capture_studio  # noqa: E402
import check_freshness  # noqa: E402
import datagen  # noqa: E402
import lesson_lint  # noqa: E402
import new_lesson  # noqa: E402
import run_blocks  # noqa: E402
from common import code_blocks, evidence_rows, split_frontmatter  # noqa: E402

PNG = bytes.fromhex("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360000002000001e221bc330000000049454e44ae426082")
FILLER = ("Studio keeps the workflow file and the canvas in sync, so every change you make is written "
          "to the project folder and can be reviewed in the YAML panel. ") * 40

GOOD = f"""---
title: Fallback Workflow Setup in Studio | Hydra ETL
description: Declare a fallback workflow in Studio so your Hydra ETL pipeline keeps running when a source fails. Follow the steps and try it today.
slug: declare-a-fallback-workflow
lesson: 49
block: Orchestration
keyword: fallback workflow
author: Test Author
date_published: 2026-11-22
date_modified: 2026-11-23
tested_with: 0.22.0
---

# Fallback Workflow in Hydra ETL Studio: Declare a Backup

A fallback workflow in Hydra ETL replaces a failing workflow with a backup, so your pipeline keeps running. This lesson shows how to declare it in Studio, add a condition and test the switch. Hydra ETL is unrelated to Meta's Hydra configuration library and to the PostgreSQL extension of the same name.

## Prerequisites

- Hydra ETL 0.22.0 installed with `pip install hydra-etl`.

## Steps

### Step 1: Open the execution order

Open Project settings, then the Execution order tab. {FILLER}

![Execution order panel in Define mode showing two sequential stages](images/execution-order-define-light.png)

### Step 2: Add the backup

Click the life buoy button.

![Fallback editor listing the backup workflow and its condition](images/fallback-editor-condition-dark.png)

```powershell exec
echo ok
```

```yaml file=jobs/demo/sources.yaml
version: '1.0'
```

## What is a fallback workflow in Hydra ETL?

A fallback workflow is a backup that runs in place of another workflow when a condition is true. See [the rollback lesson](/studio/46-rollback/) and [the Check lesson](/studio/41-check/).

## Tips and tricks

- Use the dry run before the first real run.

## Common errors

The switch is blocked when data was already published.

## CLI equivalent

```bash exec
echo ok
```

## Frequently asked questions

### Can a fallback run after a failure?

Yes. See [the failure lesson](/studio/51-on-failure/) for details.

### Where is the fallback stored?

In the project thread file, as described in the [official YAML specification](https://yaml.org/spec/1.2.2/).

### Does it replace the rollback?

No, they work together. Read [the rollback lesson](/studio/46-rollback/) first.

## Related lessons

- [Rollback of a workflow](/studio/46-rollback/)
- [Validate before running](/studio/41-check/)
- [Conditions that trigger a switch](/studio/50-conditions/)

## Sources

- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)

Tested with Hydra ETL 0.22.0 on Windows 11, 2026-11-22.
"""


def make_lesson(tmp: pathlib.Path, text: str = GOOD, verify=True) -> pathlib.Path:
    d = tmp / "49-declare-a-fallback-workflow"
    (d / "images").mkdir(parents=True, exist_ok=True)
    (d / "images/execution-order-define-light.png").write_bytes(PNG)
    (d / "images/fallback-editor-condition-dark.png").write_bytes(PNG)
    md = d / "49-declare-a-fallback-workflow.md"
    md.write_text(text, encoding="utf-8")
    rows = ""
    if verify:
        _, body, _ = split_frontmatter(text)
        for b in code_blocks(body):
            rows += f"| {b.digest} | VERIFIED | {b.lang} | 0 | 0.22.0 | test | 2026-11-22 | x |\n"
    md.with_name(md.stem + ".evidence.md").write_text(
        "# Evidence\n\n<!-- BEGIN EXEC-LOG -->\n| Hash | Status |\n|---|---|\n" + rows + "<!-- END EXEC-LOG -->\n", encoding="utf-8")
    return md


def codes(rep):
    return {i["code"] for i in rep.items}


class TestLint(unittest.TestCase):
    def test_good_lesson_has_no_error(self):
        with tempfile.TemporaryDirectory() as t:
            rep = lesson_lint.lint(make_lesson(pathlib.Path(t)))
            self.assertEqual([], [i for i in rep.items if i["level"] == "ERROR"], rep.items)

    def test_each_rule_fires(self):
        cases = {
            "T001": GOOD.replace("title: Fallback Workflow Setup in Studio | Hydra ETL",
                                 "title: Fallback Workflow Setup in Hydra ETL Studio With Many Extra Words | Hydra ETL"),
            "T002": GOOD.replace("Setup in Studio | Hydra ETL", "Setup in Studio"),
            "D001": GOOD.replace("Follow the steps and try it today.", "Follow the steps and try it today. " + "x" * 40),
            "A001": GOOD.replace("so your pipeline keeps running.", "so your pipeline keeps running now."
                                 + " More words here to be way over the limit of sixty words in the answer paragraph." * 3),
            "E001": GOOD.replace("Click the life buoy button.", "Click the life buoy button and read the licence."),
            "B001": GOOD.replace("# Fallback Workflow in Hydra ETL Studio: Declare a Backup", "# Fallback Workflow in Hydra Core: Declare a Backup"),
            "E004": GOOD.replace("## Tips and tricks\n\n- Use", "## Tips and tricks\n\n- TODO Use"),
            "S001": GOOD.replace("## Common errors", "## Troubleshooting"),
            "F001": GOOD.replace("### Does it replace the rollback?", "## Extra"),
            "L003": GOOD.replace("[the failure lesson]", "[here]"),
            "V003": GOOD.replace("Tested with Hydra ETL 0.22.0", "Tested with Hydra ETL 0.21.0"),
            "I005": GOOD.replace("execution-order-define-light.png", "screen1.png"),
            "E005": GOOD + "\nAndaluz Lab\n",
        }
        for code, text in cases.items():
            with self.subTest(code=code), tempfile.TemporaryDirectory() as t:
                self.assertIn(code, codes(lesson_lint.lint(make_lesson(pathlib.Path(t), text, verify=True), check_files=False)))

    def test_unverified_code_is_an_error(self):
        with tempfile.TemporaryDirectory() as t:
            self.assertIn("EV003", codes(lesson_lint.lint(make_lesson(pathlib.Path(t), verify=False))))

    def test_missing_evidence_file(self):
        with tempfile.TemporaryDirectory() as t:
            md = make_lesson(pathlib.Path(t))
            md.with_name(md.stem + ".evidence.md").unlink()
            self.assertIn("EV001", codes(lesson_lint.lint(md)))

    def test_same_theme_warns(self):
        with tempfile.TemporaryDirectory() as t:
            md = make_lesson(pathlib.Path(t), GOOD.replace("condition-dark.png", "condition-light.png"), verify=True)
            (md.parent / "images/fallback-editor-condition-light.png").write_bytes(PNG)
            self.assertIn("I008", codes(lesson_lint.lint(md)))

    def test_crosspost_requires_utm(self):
        text = GOOD.replace("[the rollback lesson](/studio/46-rollback/) and", "[the rollback lesson](https://hydraetl.com/studio/46-rollback/) and")
        with tempfile.TemporaryDirectory() as t:
            md = make_lesson(pathlib.Path(t), text)
            self.assertIn("L005", codes(lesson_lint.lint(md, crosspost=True)))
            self.assertNotIn("L005", codes(lesson_lint.lint(md)))

    def test_scaffold_fails_until_filled(self):
        with tempfile.TemporaryDirectory() as t:
            self.assertEqual(0, new_lesson.main(["--number", "49", "--slug", "declare-a-fallback-workflow", "--h1",
                                                 "Fallback Workflow in Hydra ETL Studio", "--keyword", "fallback workflow",
                                                 "--block", "Orchestration", "--out", t]))
            folder = pathlib.Path(t) / "49-declare-a-fallback-workflow"
            for f in ("49-declare-a-fallback-workflow.md", "49-declare-a-fallback-workflow.evidence.md",
                      "captures.json", "prepare.py", "datagen.py"):
                self.assertTrue((folder / f).exists(), f)
            rep = lesson_lint.lint(folder / "49-declare-a-fallback-workflow.md", check_files=False)
            self.assertIn("E004", codes(rep))
            self.assertEqual(1, new_lesson.main(["--number", "49", "--slug", "declare-a-fallback-workflow", "--h1", "x",
                                                 "--keyword", "x", "--block", "x", "--out", t]))
            # the generated prepare.py really runs
            r = subprocess.run([sys.executable, "prepare.py"], cwd=folder, capture_output=True, text=True)
            self.assertEqual(0, r.returncode, r.stderr)
            self.assertTrue((folder / "data/orders.csv").exists())


class TestJsonLd(unittest.TestCase):
    def test_types_and_content(self):
        with tempfile.TemporaryDirectory() as t:
            data = build_jsonld.build(make_lesson(pathlib.Path(t)), "https://hydraetl.com", None)
        kinds = [d["@type"] for d in data]
        self.assertEqual(["TechArticle", "HowTo", "FAQPage", "BreadcrumbList"], kinds)
        self.assertEqual(2, len(data[1]["step"]))
        self.assertEqual("Open the execution order", data[1]["step"][0]["name"])
        self.assertEqual(3, len(data[2]["mainEntity"]))
        self.assertEqual("https://hydraetl.com/studio/49-declare-a-fallback-workflow/", data[0]["mainEntityOfPage"])
        self.assertNotIn("aggregateRating", json.dumps(data))


class TestDatagen(unittest.TestCase):
    def test_deterministic_and_bad_row(self):
        with tempfile.TemporaryDirectory() as t:
            a = datagen.write_orders_csv(pathlib.Path(t) / "a.csv", rows=20).read_text()
            b = datagen.write_orders_csv(pathlib.Path(t) / "b.csv", rows=20).read_text()
            self.assertEqual(a, b)
            self.assertEqual(21, len(a.strip().split("\n")))
            bad = datagen.write_orders_csv(pathlib.Path(t) / "c.csv", rows=10, bad_row=3).read_text()
            self.assertEqual(1, bad.count(",abc,"))
            db = datagen.write_sqlite(pathlib.Path(t) / "s.db", orders=15)
            con = sqlite3.connect(db)
            self.assertEqual(15, con.execute("select count(*) from orders").fetchone()[0])
            con.close()


class TestRunBlocks(unittest.TestCase):
    def test_runs_and_records(self):
        text = """---
slug: x
---
# T

```bash exec
echo hello-from-block
```

```bash exec-fail
exit 3
```

```python exec
print(open('data.txt').read().strip())
```

```yaml file=jobs/x/sources.yaml
version: '1.0'
```

```bash exec
rm -rf /
```
"""
        with tempfile.TemporaryDirectory() as t:
            t = pathlib.Path(t)
            proj = t / "proj"
            proj.mkdir()
            (proj / "data.txt").write_text("from-project")
            lesson = t / "lesson.md"
            lesson.write_text(text, encoding="utf-8")
            rc = run_blocks.main([str(lesson), "--project", str(proj)])
            self.assertEqual(1, rc)  # the destructive block is refused
            rows = evidence_rows(t / "lesson.evidence.md")
            statuses = sorted(s for s, _ in rows.values())
            self.assertEqual(["SKIPPED", "VERIFIED", "VERIFIED", "VERIFIED", "VERIFIED"], statuses)
            out = json.loads((t / "lesson.outputs.json").read_text())
            outs = [v["output"] for v in out.values()]
            self.assertIn("hello-from-block", outs)
            self.assertIn("from-project", outs)
            self.assertFalse((proj / "jobs").exists())  # the original project is untouched
            # manual verification
            h = next(b.digest for b in code_blocks(text) if "echo" in b.code)
            self.assertEqual(0, run_blocks.main([str(lesson), "--project", str(proj), "--mark-verified", h]))
            self.assertEqual("MANUAL", evidence_rows(t / "lesson.evidence.md")[h][0])


class TestCapture(unittest.TestCase):
    def test_spec_validation_and_theme_alternation(self):
        spec = {"shots": [
            {"name": "alpha-beta-gamma", "path": "/overview", "alt": "A descriptive alt text for the shot"},
            {"name": "alpha-beta-delta", "path": "/runs", "alt": "Another descriptive alt text here", "theme": "dark"},
            {"name": "alpha-beta-omega", "path": "/settings", "alt": "Yet another descriptive alt text"}]}
        with tempfile.TemporaryDirectory() as t:
            p = pathlib.Path(t) / "c.json"
            p.write_text(json.dumps(spec))
            s = capture_studio.load_spec(p)
        self.assertEqual([], capture_studio.validate(s))
        self.assertEqual(["light", "dark", "dark"], capture_studio.resolve_themes(s))
        bad = capture_studio.load_spec.__globals__["json"].loads(json.dumps(spec))
        bad.update({"base_url": "x", "viewport": {}, "scale": 2, "theme_cycle": ["pink"], "replace_text": {}})
        bad["shots"][0]["name"] = "screen1"
        bad["shots"][1]["alt"] = "short"
        problems = capture_studio.validate(bad)
        self.assertEqual(3, len(problems), problems)


class TestFreshness(unittest.TestCase):
    def test_detects_stale_facts(self):
        ts = ("{ type: 'source_csv', label: 'CSV', category: 'source', color: 'x' },\n"
              "{ type: 'source_json', label: 'JSON', category: 'source', color: 'x' },\n"
              "{ type: 'transform_filter', label: 'Filter', category: 'transformation', color: 'x' },\n")
        with tempfile.TemporaryDirectory() as t:
            t = pathlib.Path(t)
            (t / "n.ts").write_text(ts)
            (t / "CHANGELOG.md").write_text("## [Unreleased]\n\n## [0.22.0] — 2026-11-16\n")
            (t / "l.md").write_text("---\ntested_with: 0.19.0\n---\n# T\n\nHydra offers seven sources and one transformations here.\n")
            counts, _ = check_freshness.registry_counts(t / "n.ts")
            self.assertEqual({"source": 2, "transformation": 1}, dict(counts))
            self.assertEqual("0.22.0", check_freshness.latest_version(t / "CHANGELOG.md"))
            msgs = [m for _, m in check_freshness.check(t, counts, "0.22.0")]
            self.assertTrue(any("0.19.0" in m for m in msgs), msgs)
            self.assertTrue(any("seven sources" in m for m in msgs), msgs)


if __name__ == "__main__":
    unittest.main()
