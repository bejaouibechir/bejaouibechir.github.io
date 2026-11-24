# Evidence: Delay node (lesson 51, slug wait-with-the-delay-node)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows. Probe project `probe-delay/` (`run-probe-delay.bat`, `probe-delay.log`).
| Item | Type | Proof |
|---|---|---|
| Delay dialog: Step name, Run condition (when), Delay (seconds)* placeholder 5, {x}, Node ID | EXPERIENCE | capture; NodeConfigDialog.tsx |
| YAML `action: delay` + `params.seconds` | FACT | runner.py `_action_delay` |
| validate -> "Workflow valid — no errors detected." | EXPERIENCE | log |
| run: before 0.0s, pause 3.0s, after 0.0s, total 3.0s, 3/3 OK | EXPERIENCE | log + terminal capture |
| seconds decimal; negative -> 0; non-number -> ValueError naming the step | FACT (code), not run | runner.py |
| Output symbols (✓, |) | EXPERIENCE | screenshot (log file loses them in cp1252) |
Build: 182 pages. Generator `blocks/gen_delay_block.py`, spec `lessons/delay/captures.json`, bat `run-block-delay.bat`.
