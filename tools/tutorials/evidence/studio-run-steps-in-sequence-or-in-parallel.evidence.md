# Evidence: Stages (lesson 37, slug run-steps-in-sequence-or-in-parallel)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows. Probes `probe-stages/`, `probe-stages-seq/`, `probe-stages-off/` (bats `run-probe-stages.bat`, `run-probe-stages2.bat`; logs `block-stages.log`, `block-stages2.log`). Captured copies `stages-demo/`, `stages-demo-seq/`.
| Item | Type | Proof |
|---|---|---|
| Stage = entry of `thread`; mode sequential/parallel; stages run one after another | FACT | workflow/thread.py docstring and models |
| `hdrctl run .` runs a project in thread order; project root = folder with `.hydra` | FACT + EXPERIENCE | hdrctl.py `cmd_run`, project.py `is_project_root`; run without `.hydra` was treated as a job (error: sources/destinations/pipeline missing) |
| Run output: Stage n/3 headers, parallel stage starts both workflows before either ends | EXPERIENCE | terminal capture, log |
| Parallel run 3.5 s (log) / 3.3 s (capture), loads 2.2-2.4 s each | EXPERIENCE | block-stages.log, capture |
| Sequential variant 5.3 s (log) / 5.4 s (capture) | EXPERIENCE | block-stages2.log, capture |
| `delay_after: 1s` prints "Waiting 1s before the next stage" | EXPERIENCE | log, capture |
| `active: false` prints "load_stock - inactive, skipped"; 3/3 workflow(s) OK in 3.2 s | EXPERIENCE | block-stages2.log (project name masked to stages-demo in the lesson; no capture, text from the log) |
| Failed workflow stops the project | CLAIM | Studio Execution order help text; failure NOT reproduced; lesson attributes it to Studio |
| `workflow validate` on thread.yaml | not covered | rejects it ("unknown key 'thread'"): validate targets workflow files only |
| delay_before, timeout, loops, fallback | not covered | other lessons (Loops and pauses, Timeouts, Fallback) |
Hub row title/description updated. Build: 185 pages, images, JSON-LD (TechArticle, HowTo, FAQPage, BreadcrumbList), title 59 chars. Generator `blocks/gen_stages_block.py`, spec `lessons/stages/captures.json`, bat `run-block-stages.bat`. `capture_studio.py` gained `drag_xy` (resize the bottom panel).
