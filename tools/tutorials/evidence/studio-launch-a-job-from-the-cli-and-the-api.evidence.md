# Evidence: Other launches (/studio/launch-a-job-from-the-cli-and-the-api/)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows. Log `block-launch.log`, probe `run/run-probe-launch.bat`, folder `launch-demo`, `launch-bodies/run.json`, `launch-runs.json`, workspace `C:\Users\DELL\hydra-workspace-launch` (port 5683 in the probe, 5678 shown in the lesson).

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | `hdrctl run jobs\job1`: completed in 2.3 s, 3 read, 2 written | EXPERIENCE | log #cli job |
| E2 | `hdrctl run .`: stage 1/1, workflow1 OK, "Project 'launch-demo' completed in 1.6s — 1/1 workflow(s) OK" | EXPERIENCE | log #cli project |
| E3 | /api/health answer (status ok, version 0.22.0) | EXPERIENCE | log #health |
| E4 | POST /api/runs -> 202 Accepted, run_id, status pending, name `project:<folder>`, trigger manual | EXPERIENCE | log #post run |
| E5 | GET /api/runs -> success, duration 0.62 s, one step workflow1, logs ["OK job1"] | EXPERIENCE | log #runs after |
| E6 | Fresh server list empty before the POST although 2 CLI runs completed earlier | EXPERIENCE (cause not tested) | log #runs before |
| E7 | output.csv written in jobs/job1/data | EXPERIENCE | log #output file |
| E8 | MCP tool hydra_run_job runs `hdrctl run <folder>` | CLAIM (source `mcp/server.py`), NOT tested | code reading |
| E9 | Run list is in memory | CLAIM (source `api/store.py`), consistent with charte | code reading |

Notes: path in lesson shown as `C:\Users\you\launch-demo` (substituted); port 5678 in lesson vs 5683 in probe; run_id differs per call. Not tested: `--dry-run` on this project (claim limited to the flag existing, see lesson define/dry-run), CLI run while a server runs (point 21), Run again.
No screenshots: text-only lesson.
