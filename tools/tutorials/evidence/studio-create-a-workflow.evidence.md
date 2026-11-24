# Evidence: Create a workflow (lesson 33, slug create-a-workflow)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows. Probe `wf-demo` (copy of stages-demo), bat `run-probe-wfadd.bat`, log `block-wfadd.log`; captures from `cap1/wf-demo`, `cap2/wf-demo` (recopied by `run-block-createwf.bat`), spec `lessons/createwf/captures.json`.
| Item | Type | Proof |
|---|---|---|
| `workflow list` output (stage·mode, name, active, steps) | EXPERIENCE | block-wfadd.log, capture |
| `workflow add archive`: created, "Added to workflows/thread.yaml, stage 3 (sequential)", Next hint | EXPERIENCE | block-wfadd.log, capture |
| Added to the last stage; thread.yaml rewritten with comment header and `active: true` on every workflow | EXPERIENCE | `type workflows\thread.yaml` in the log |
| File content (name, description "", trigger manual, steps []) | EXPERIENCE | log |
| Name-less add generates `workflow-109f7411` (8 hex chars) | EXPERIENCE | log; value differs per run |
| validate OK; run alone "completed in 0.0s — 0/0 steps OK"; dry run lists `archive  (0)` | EXPERIENCE | log |
| `remove archive -y`: deletes file and thread entry; confirmation without -y | EXPERIENCE + FACT | log; hdrctl.py `cmd_workflow_remove` (confirmation not triggered) |
| Terminal captures show the repo path `C:\Users\you\Desktop\hydra-site\tools\tutorials\cap2\wf-demo` in the list header | note | username masked only |
| `--fallback-for` option, Studio Import, import by copying a file | not tested | not claimed except the file-copy FAQ answer, phrased "according to the Studio source" (ThreadEditor.tsx notInThread), untested |
Generator `blocks/gen_createwf_block.py`. Leftovers to delete: `wf-demo`, `cap1`, `cap2`.
