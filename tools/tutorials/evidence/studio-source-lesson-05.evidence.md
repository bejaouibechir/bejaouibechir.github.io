# Evidence - lesson 05 (create a job, add a source)
Verified 2026-11-23, Hydra ETL 0.22.0, Studio on Windows (project studio-course, stage `empty` of setup_course.py).

| ID | Statement | Type | Proof |
|---|---|---|---|
| E1 | `+` adds an in-memory job named `job<N>` with an empty canvas, no name prompt, no API call | FACT | WorkflowEditor.tsx `addJob` + captures |
| E2 | Rename: tab options menu or double-click the tab | FACT | WorkflowEditor.tsx, captures |
| E3 | Archive renames `jobs/<name>` to `<name>.backup` (timestamp suffix if present); refused while the job is on the workflow canvas | FACT | `api/routers/jobs.py`, `archiveJob` |
| E4 | Delete asks via confirm whether to also delete the folder; refused while on the workflow canvas | FACT | `deleteJob` |
| E5 | Palette Jobs (1) lists first-job without registration | EXPERIENCE | capture |
| E6 | CSV dialog: Step name, file path, Location local, Node ID; red badge until the path is filled | EXPERIENCE | captures |
| E7 | PostgreSQL dialog: Table / SQL query, Table*, Host*, Port, Database*, User*, Password | EXPERIENCE | capture + NodeConfigDialog.tsx |
| E8 | Web API: URL*, Method GET/POST/PUT/DELETE | FACT | NodeConfigDialog.tsx `source_api` |
| E9 | sources.yaml entry `src_orders` (csv, data/orders.csv, batch_size 50000) | FACT | setup_course.py (validated by hdrctl validate) |

Not verified live: the Save click writing the four manifests from a Studio-created job (the YAML shown is the one setup_course.py writes and `hdrctl validate` accepts); the ${ENV:NAME} hint under the password field.
