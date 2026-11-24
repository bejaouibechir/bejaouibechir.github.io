# Evidence: Execution order Define / Preview / Check (lessons 34-36, slugs define-the-execution-order, preview-the-execution-order, check-the-execution-order)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows. Clean Studio on port 5680, workspace `C:\Users\DELL\hydra-workspace-eo` (projects eo-demo, eo-full, eo-bad adopted through `POST /api/projects/open`). Sources `tools/tutorials/eo-demo|eo-full|eo-bad`. Bat `run-block-eo.bat` (reads `eo-spec.txt`), spec `lessons/execution-order/captures.json`, log `block-eo-cap.log`.
| Item | Type | Proof |
|---|---|---|
| Tab location Settings > Project settings > Execution order; Define / Preview; Check; Save/Saved button | EXPERIENCE | captures |
| Header "Saved in workflows/thread.yaml, for everyone who opens the project" | EXPERIENCE | capture |
| Stage controls (mode, then wait, checkbox, wait, max, lifebuoy, arrows, cross), Not in the thread, Loops box wording | EXPERIENCE + FACT | captures; ThreadEditor.tsx |
| "+ cleanup" adds the workflow after `report` (stage 3) and enables Save | EXPERIENCE | capture |
| "Add loop" proposes last workflow -> first workflow, times 2 | FACT (code) | ThreadEditor.tsx; not clicked |
| Check saves first when dirty; button disabled when a delay/loop is invalid; leave-page confirm | FACT (code) | ThreadEditor.tsx; not triggered |
| Preview diagram symbols (stacked = parallel, diamond = wait, dashed blue = loop x2, orange dashed = fallback, clock = wait before, hourglass = timeout) | EXPERIENCE | captures + legend text |
| Click a block opens the workflow | FACT (code, legend) | not clicked |
| Check OK line "Ready: prepare -> load_sales -> load_stock -> report (+ 1 loop)" | EXPERIENCE | capture |
| Check error "workflows/thread.yaml: workflow 'ghost' has no file workflows/ghost.yaml"; only the first problem reported (missing `backup` fallback file not reported) | EXPERIENCE | capture; project.py raises after the missing-file pass |
| What Check validates (missing files, broken workflow YAML, missing job folders, fallback files, rollback, sub-project calls) | FACT (code) | workflow/project.py `prepare_project` |
| Second Check after fixing | not run | step phrased as instruction only; see registry |
Build: 189 pages, images, JSON-LD, titles 58/58/54. Generator `blocks/gen_eo_block.py` (3 lessons). Hub rows updated (titles/descriptions corrected: Define edits workflows, not "jobs by drag and drop"; Check lists missing files, not cycles). Leftover to delete (registry point 18): `eo-demo`, `eo-full`, `eo-bad`, `C:\Users\DELL\hydra-workspace-eo`, `eo-spec.txt`, `run-probe-eo.bat`.
