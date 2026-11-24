# Evidence: Insights (lesson 18, slug read-the-insights-statistics)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows. Clean Studio on port 5681, workspace `C:\Users\DELL\hydra-workspace-ins`, project `insights-demo` (copy of stages-demo + `boom.yaml`). Bat `run-block-insights.bat` (starts the server, adopts the project, POSTs 3 runs through `/api/runs`, saves `runs-insights.json`, captures), spec `lessons/insights/captures.json`.
| Item | Type | Proof |
|---|---|---|
| Counters total/successful/failed/running + average duration card; computed in the browser | FACT | studio/src/pages/Insights.tsx |
| 3 runs: project:insights-demo Success 3.13 s, prepare Success 0.0 s, boom Failed 0.12 s -> 3/2/1/0, average 1.09 s shown as 1.1 s | EXPERIENCE | runs-insights.json, capture |
| Runs page summary "3 total · 0 running · 2 success · 1 failed", tabs All/Running/Success/Failed/Pending | EXPERIENCE | capture |
| Average includes failed runs (all runs with a duration) | FACT | Insights.tsx |
| Runs kept in memory: counters back to 0 after restarting the server | FACT + EXPERIENCE | api/store.py `_runs` dict; first capture after a restart showed 0 runs |
| Terminal runs (`hdrctl run`) not listed | FACT (code) | server store only; not tested |
| Total > sum of other three when a run is pending | FACT (code) | Insights.tsx; not reproduced |
| Runs started through the API, not by clicking Run buttons | EXPERIENCE | disclosed in the lesson |
Generator `blocks/gen_insights_block.py`. Leftover to delete: `insights-demo`, `insights-bodies`, `runs-insights.json`, `C:\Users\DELL\hydra-workspace-ins` (registry point 18).
