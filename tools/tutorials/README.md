# Tutorial toolkit: Hydra Studio lessons

Standard-library Python (3.9+), no installation needed except Playwright for screenshots.
Charter: see `charte-tutoriels-studio.md` in the Claude project "site".

## Workflow for one lesson

```powershell
py new_lesson.py --number 49 --slug declare-a-fallback-workflow --h1 "Fallback Workflow in Hydra ETL Studio" --keyword "fallback workflow" --block Orchestration --out lessons
# 1. write the lesson (replace every TODO), fill captures.json, adapt prepare.py
py lessons/49-declare-a-fallback-workflow/prepare.py             # generates the lesson's data files
py capture_studio.py lessons/49-declare-a-fallback-workflow/captures.json --channel msedge   # screenshots (your machine)
py run_blocks.py lessons/49-declare-a-fallback-workflow/49-declare-a-fallback-workflow.md --project C:/data/fallbackproject
py lesson_lint.py lessons/49-declare-a-fallback-workflow/49-declare-a-fallback-workflow.md
py build_jsonld.py lessons/49-declare-a-fallback-workflow/49-declare-a-fallback-workflow.md
py check_freshness.py --lessons lessons --hydra-repo C:/Users/you/Desktop/Hydra
```

## Scripts

| Script | Role |
|---|---|
| `new_lesson.py` | Scaffold: markdown with all required sections, evidence file, `captures.json`, `prepare.py`, `datagen.py`. |
| `lesson_lint.py` | Enforces the charter: title, meta, H1, 40-60 word answer, sections, FAQ, images, links, en-US, brand, evidence. Exit 1 on error. `--crosspost` requires UTM on hydraetl.com links. |
| `run_blocks.py` | Runs the code blocks in a temporary copy of a project, records VERIFIED rows in the evidence file and the real output in `*.outputs.json`. `--mark-verified HASH` for blocks checked by hand (for example in Studio or PowerShell). |
| `build_jsonld.py` | TechArticle, HowTo, FAQPage and BreadcrumbList JSON-LD built from the visible markdown only. |
| `check_freshness.py` | Compares lesson claims with the Studio palette (`nodeRegistry.ts`) and the latest release in `CHANGELOG.md`. |
| `capture_studio.py` | Playwright screenshots from `captures.json`: alternating light and dark themes, crop on a selector or box, optional highlight, text replacement to hide personal paths. Run it on your machine. |
| `datagen.py` | Deterministic CSV, JSON and SQLite sample data. Copied into each lesson folder. |
| `templates/docker-compose.db.yml` | PostgreSQL and MySQL for the lessons that need a server (untested here). |

## Code block conventions

- ```` ```bash exec ````, ```` ```powershell exec ````, ```` ```python exec ````: executed by `run_blocks.py`, exit code 0 expected.
- ```` ```bash exec-fail ````: executed, non-zero exit expected (to demonstrate an error).
- ```` ```yaml file=jobs/x/sources.yaml ````: written into the project before the next blocks run.
- ```` ```text ```` and ```` ```output ````: never executed nor checked. Use them for real output copied from `*.outputs.json`.
- `hdrctl --version` prints an ASCII banner: quote only the first line.

## What is tested

`py -m unittest discover -s tests -v` (12 tests): lint rules, scaffold, JSON-LD, data generator, block runner
(with a real `hdrctl` 0.22.0 on Linux), capture spec validation, freshness check.
Not tested: the browser part of `capture_studio.py` (no browser could be downloaded in the authoring environment),
PowerShell blocks (no `pwsh` there) and the Docker file.

## Interpreter

On the author's Windows machine the Python launcher is **`py`** (not `python`): `py new_lesson.py ...`,
`py -m unittest discover -s tests -v`. Public lessons tell readers `py` on Windows and `python3` on macOS and Linux.
