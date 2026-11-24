# Evidence: Loops and pauses (lesson 38, slug repeat-workflows-with-loops)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows. Probes `probe-loops/` (times 3, log steps; `run-probe-loops.bat`, `block-loops.log`) and `loops-demo/` (times 2, Python `pass` steps; `run-block-loops.bat`, `run-probe-loops2.bat`, `block-loops2.log`).
| Item | Type | Proof |
|---|---|---|
| loops keys from/to/times/delay; times = total passes (1 = no repeat); to before from or same workflow | FACT | workflow/thread.py docstring |
| times 2: 4 workflow runs, 1.6 s (capture); times 3: 6 runs, 2.0 s, two waits of 1 s | EXPERIENCE | capture; block-loops.log |
| Output lines "(pass n/N)", "Loop check -> fetch: pass 2/2 - waiting 1s" | EXPERIENCE | capture |
| `--dry-run` plan: stage, workflows, "loop check -> fetch, 2 pass(es), waiting 1s", "Dry run OK" | EXPERIENCE | capture, block-loops2.log |
| Failure stops the project, loops included | CLAIM | thread.py docstring; not reproduced |
| `to` after `from` rejected: "loop prepare -> report: 'report' must come before 'prepare' in the thread (a loop goes back)" | EXPERIENCE | probe thr-d, `block-thr.log` (23/11) |
| `hdrctl workflow list` shows "1 sequential fetch active 1 step(s)" | EXPERIENCE | block-loops2.log; not used in the lesson |
Build: 186 pages, images, JSON-LD, title 53 chars. Generator `blocks/gen_loops_block.py`, spec `lessons/loops/captures.json`, bat `run-block-loops.bat`.
