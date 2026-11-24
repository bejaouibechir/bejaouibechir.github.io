# Evidence: Start from a Hydra Studio workflow template (hub row "Start from a template", slug start-from-a-template)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows. Source: `studio/src/pages/Templates.tsx`; YAML read from `GET /api/templates` (`templates.json`, via `run-block-tpl.bat`).

| Item | Type | Proof |
|---|---|---|
| 3 templates csv_to_csv, api_to_db, parallel_etl, category ETL, descriptions | EXPERIENCE | api/templates + captures |
| YAML of csv_to_csv, api_to_db, parallel_etl quoted as served | EXPERIENCE | templates.json |
| View YAML / Hide YAML; Copy YAML shows Copied 1.5 s | FACT (code) + EXPERIENCE (View) | Templates.tsx; capture. Copy not clicked (clipboard) |
| Templates are workflow files; jobs not included (paths ./jobs/...) | FACT | YAML content |
| Schedule fires only under hdrctl serve | FACT | Hydra profile (api/scheduler.py) |
| `{{ env.WEBHOOK_URL }}` placeholder: meaning not tested | NOT VERIFIED | quoted only |
| Pasting into a project and validating | NOT RUN | not claimed |

Hub row title/description corrected: the page offers workflow templates, not job templates.
Captures: `lessons/templates/captures.json`, `run/run-block-tpl.bat`. Generator: `blocks/gen_template_block.py`. Build: 181 pages.
