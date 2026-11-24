# Evidence: Triggers (/studio/declare-project-triggers/)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows. Log `block-trig.log`, probe `run/run-probe-trig.bat`, folder `triggers-demo`, bodies `trig-bodies/*.yaml`.

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | `trigger list` without file: "No trigger. Add them to triggers.yaml at the project root." | EXPERIENCE | log #list none |
| E2 | 4 triggers (cron+timezone, interval, file, marker enabled:false) listed on/off with summaries | EXPERIENCE | log #list |
| E3 | `trigger validate` -> "Triggers valid — 4 trigger(s)" | EXPERIENCE | log #validate |
| E4 | `trigger fire nightly` ran the project in 2.8 s; history shows manual 2.76 s | EXPERIENCE | log #fire, #history |
| E5 | `fire nope` -> "Trigger 'nope' not found in triggers.yaml" + known names | EXPERIENCE | log #fire unknown |
| E6 | 4 error messages (cron 99, evry, cron on interval + cron missing, missing-wf) | EXPERIENCE | log #bad1..#bad4 |
| E7 | 7 trigger types | CLAIM (source `triggers/models.py`) | cron, interval, file, marker tested as declared/listed/validated only; fired: cron only |
| E8 | Triggers run inside `hdrctl watch` and `hdrctl serve` | CLAIM (help text of `hdrctl trigger`), NOT tested | locale en.json |
| E9 | path must be relative, inside the project | CLAIM (source), not tested | models.py |

Observation not published, to check: after `fire`, `hdrctl trigger list` did not print the "last run" line although `history` showed the run (registry point 23).
No screenshots: text-only lesson. Note: validate printed the cron summary with `timezone: UTC`; a time zone other than UTC not tested.
