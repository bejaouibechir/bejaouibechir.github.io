# Evidence - lesson 03 (read the canvas), rewritten on studio-course
Verified 2026-11-23, Hydra ETL 0.22.0, Windows, project built by `setup_course.py --stage two-jobs` (log `block-03.log`).

| ID | Statement | Type | Proof |
|---|---|---|---|
| E1 | Workflow scene: 2 nodes · 1 edge, Valid; palette Actions (9), Control Flow (2), Containers (3), Jobs (2); toolbar Import, Rollback, Hydra DSL, Run Workflow | EXPERIENCE | capture workflow-canvas-two-jobs-dark |
| E2 | first-job: 4 nodes · 3 edges (src_orders, select, filter, dest_paid) | EXPERIENCE | capture job-canvas-four-nodes-light |
| E3 | second-job: 3 nodes · 2 edges (src_paid_orders, select, dest_summary) | EXPERIENCE | capture job-canvas-second-job-light |
| E4 | Manifests and workflow.yaml shown are those written by setup_course.py | FACT | `hdrctl validate jobs/first-job`, `hdrctl workflow validate first-workflow` -> valid (block-03.log) |
| E5 | Dialog fields of select, filter, CSV destination | EXPERIENCE | captures of lessons 06 and 07 |
| E6 | DSL tab images | EXPERIENCE | studio-09-see-the-yaml captures |

Removed from the old lesson (not reproducible on studio-course): Log and PowerShell actions, Error Scope/Retry Scope walkthrough, import_bundle download, Hydra process list command.
