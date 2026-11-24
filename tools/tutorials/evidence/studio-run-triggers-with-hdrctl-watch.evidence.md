# Evidence: Other triggers (/studio/run-triggers-with-hdrctl-watch/)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows. Logs `watch-probe/watch.log`, `watch-probe/watch2.log` (utf-8, from `hdrctl watch` redirected with PYTHONIOENCODING=utf-8), `block-watch.log`, `block-watch2.log`; probes `run/run-probe-watch.bat`, `run-probe-watch2.bat`; data `watch-gen/`; folder `watch-probe/watch-demo`.

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | `trigger validate` -> 4 triggers valid (interval, marker, file, source_change) | EXPERIENCE | block-watch.log #validate |
| E2 | `watch` start listing: next run for interval, marker/file "checked every 5s", source "checked every 60s", reference value printed | EXPERIENCE | watch.log |
| E3 | Marker: go.flag -> run 2.4 s, flag removed afterwards | EXPERIENCE | watch.log, block-watch.log |
| E4 | File `Data/incoming/*.csv`: copy of a CSV fired the trigger (also a freshly created CSV and a copy kept with an old date) | EXPERIENCE | watch.log, watch2.log |
| E5 | `path: Data/incoming` (folder, no pattern): nothing fired, no message (first run, same session) | EXPERIENCE | first watch.log (overwritten by the corrected run; cause confirmed from `files.py` glob + is_file) |
| E6 | source_change (checksum): old -> new value printed after a row was appended; run reported skipped with empty reason while an interval run was in progress | EXPERIENCE (cause of the skip not established) | watch.log |
| E7 | Interval 30 s: runs at ~30 s spacing | EXPERIENCE | watch.log |
| E8 | History lists the 5 runs (origin `watch`) | EXPERIENCE | block-watch.log #history |
| E9 | Files present at start fire nothing | CLAIM (source `files.py` docstring), not tested | |
| E10 | `hdrctl serve` also runs triggers | CLAIM (help text), not tested | |

Not tested: after_project, cron under watch (lesson Schedule trigger), webhook, Ctrl+C stop message (process stopped from a script), `--env`, `retry`, `overlap: wait|fail`, remote paths (s3/az/gs). No screenshots: text-only lesson.
