# Evidence: Diagnose a failure (lesson 17, slug diagnose-a-failed-run)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows. Project `diag-demo` (prepare, boom, report in one sequential stage; boom = Python step raising RuntimeError). Bat `run-block-diag.bat` (clean Studio port 5682, workspace `C:\Users\DELL\hydra-workspace-diag`, run through `/api/runs`, captures, then `hdrctl run .` in the CLI), reads `diag-spec.txt`; spec `lessons/diagnose/captures.json`; logs `block-diag.log`, `runs-diag.json`.
| Item | Type | Proof |
|---|---|---|
| CLI output: prepare OK; boom "Step 'fail_on_purpose' FAILED: Python script exited with code 1: RuntimeError: boom" + traceback; "report — not run (a previous workflow failed)"; "Project 'diag-demo' failed after 0.2s — failed: boom" | EXPERIENCE | block-diag.log |
| Run JSON: status failed, error "failed: boom", steps prepare ok / boom failed (5 log lines) / report skipped | EXPERIENCE | runs-diag.json |
| Studio detail: Failed badge, cards, Run error, timeline, failing step auto-open, "1 ok · 1 skip / 3" | EXPERIENCE | capture |
| Failing step opens automatically | FACT | RunDetail.tsx `firstFailedIdx` |
| Failed tab, replay button titled "Run again" starting a new run of the same path | EXPERIENCE + FACT | capture; Runs.tsx. The button was not clicked; the same API call (`POST /api/runs`) is what the bat used |
| Run again vs fix: advice | OPINION | labeled "our recommendation" in FAQ |
| Run list empty after server restart | FACT + EXPERIENCE | store.py `_runs`; see Insights evidence |
Generator `blocks/gen_diag_block.py`. Leftover to delete: `diag-demo`, `diag-bodies`, `diag-spec.txt`, `runs-diag.json`, `C:\Users\DELL\hydra-workspace-diag`.
