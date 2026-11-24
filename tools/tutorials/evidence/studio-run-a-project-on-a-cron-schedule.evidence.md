# Evidence — run-a-project-on-a-cron-schedule (Schedule trigger)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows, probe `run-probe-sched.bat` (log `block-sched.log`).

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | `trigger validate` accepts 2 cron triggers | EXPERIENCE | log "Triggers valid — 2 trigger(s)" |
| E2 | `trigger list` shows expression + timezone, no next run | EXPERIENCE | log #list |
| E3 | `watch` prints next run per trigger | EXPERIENCE | watch.log |
| E4 | cron `* * * * *` runs at second 00, 2.4 s / 2.6 s | EXPERIENCE | watch.log 07:38:00, 07:39:00 |
| E5 | history in UTC, one hour before local lines | EXPERIENCE | history.jsonl output |
| E6 | 5 validation errors (61, 4 fields, Mars/Base, timezone on interval, every on cron) | EXPERIENCE | log #bad1-#bad5 |
| E7 | 5 fields, lists/ranges/steps/names, dom OR dow | FACT | hydra_etl/triggers/cron.py docstring |
| E8 | no timezone = machine time zone | FACT (source) | cron.py `zone()`; not tested |
| E9 | watch needs no server extra | FACT (source) | cron.py docstring |
| E10 | scheduler of `hdrctl serve` | UNVERIFIED | not tested, stated as such |

Not tested: Europe/Paris firing (next run 2026-11-25 02:00 only), DST, missed runs when watch is closed (stated as logical consequence), serve scheduler.
