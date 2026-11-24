# Evidence: Condition node (lesson 50, slug branch-with-the-condition-node)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows. Probe `probe-cond/` (`run-probe-cond.bat`, `run-probe-cond5.bat`).
| Item | Type | Proof |
|---|---|---|
| Dialog: result variable name (placeholder check), Expression / Structured, left/op/right, node ID; subtitle "Evaluates a condition into a variable (used by downstream when)" | EXPERIENCE | capture |
| Condition stores bool in runtime param `name` (default step name); `when` reads it | FACT | runner.py `_action_condition`, `_eval_when` |
| count 15 > 10: small_batch skipped, big_batch OK, 4/4 steps OK | EXPERIENCE | probe-cond.log + terminal capture |
| count 5: big_batch skipped, small_batch OK, 4/4 OK | EXPERIENCE | probe-cond5.log |
| Operators ==, !=, <, <=, >, >=, contains; Expression mode grammar (comparisons, and/or/not, literals) | FACT (code), expression mode not run | workflow/expr.py |
| `not {{ param:big }}` guard | EXPERIENCE | probe run |
| Missing parameter behavior | NOT VERIFIED | not claimed |
Build: 183 pages. Generator `blocks/gen_condition_block.py`, spec `lessons/condition/captures.json`, bat `run-block-cond.bat`.
