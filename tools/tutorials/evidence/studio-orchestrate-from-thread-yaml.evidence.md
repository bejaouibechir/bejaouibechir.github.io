# Evidence: thread.yaml (lesson 59, slug orchestrate-from-thread-yaml)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows. Probes `thr-a` (valid, copy of eo-full), `thr-b` (modee), `thr-c` (delay_before 5x), `thr-d` (loop forward), `thr-e` (times 0); bat `run-probe-thr.bat`, log `block-thr.log`. Capture copies `thread-demo`, `thread-demo-loop`; bat `run-block-thread.bat`, spec `lessons/thread/captures.json`.
| Item | Type | Proof |
|---|---|---|
| Keys at each level (version/thread/loops; mode/delay_after/workflows; name/active/delay_before/timeout/fallback; use/when/on_failure/on_probe_error; from/to/times/delay) | FACT | workflow/thread.py models |
| Dry run plan of a valid thread incl. timeout, fallback, wait lines | EXPERIENCE | capture, block-thr.log |
| Error "thread.1.modee: Extra inputs are not permitted" | EXPERIENCE | block-thr.log |
| Error "thread.1.workflows.1.delay_before: invalid delay '5x' (use a number of seconds or 30s, 5m, 1h)" | EXPERIENCE | block-thr.log |
| Error "loop prepare -> report: 'report' must come before 'prepare' in the thread (a loop goes back)" | EXPERIENCE | capture, block-thr.log |
| Error "loops.0.times: Input should be greater than or equal to 1" | EXPERIENCE | block-thr.log |
| Positions count from zero | EXPERIENCE | inferred from the messages above (thread.1 = second stage, workflows.1 = load_stock) |
| `hdrctl workflow validate` rejects thread.yaml ("unknown key 'thread'") | EXPERIENCE | block-stages.log |
| No thread.yaml: alphabetical order until Save | CLAIM | Studio text (ThreadEditor.tsx), not tested on the CLI |
| Exit codes of failed dry runs | not reported | the bat's `%ERRORLEVEL%` printed 0 inside a for loop (delayed expansion): unreliable |
Build checked after generation. Generator `blocks/gen_thread_block.py`. Leftover to delete: thr-a..thr-e, thread-demo, thread-demo-loop (registry point 18).
