# Evidence: Manage projects (/studio/manage-jobs-and-parameters-from-the-cli/)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows. Log `block-manage.log`; probe `run/run-probe-manage.bat`; folder `manage-probe/manage-demo` (files kept: workflows/workflow1.yaml, parameters.yaml, environments/prod.yaml).

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | `job list` on a new project: job1 in workflow1, "1 job(s), 0 free" | EXPERIENCE | #job list |
| E2 | `job add extra workflow1`: created jobs\extra, attached at position 2, runs after job1; workflow1.yaml shows extra with depends_on [job1] | EXPERIENCE | #job add, #workflow1 |
| E3 | `job detach`: extra free, folder kept | EXPERIENCE | #detach |
| E4 | `job attach -p 1`: first step, job1 depends_on [extra] | EXPERIENCE | #attach p1 + workflow1.yaml |
| E5 | `param list` empty message; `param set min_value 0 --type int --description` writes parameters.yaml as shown | EXPERIENCE | #param list empty, #param set |
| E6 | filter `value > {{ param:min_value }}`: default 0 -> 3 read / 2 written | EXPERIENCE | #run default |
| E7 | `param set min_value 150 --env prod` -> environments/prod.yaml; `run jobs\job1 --env prod` -> 1 written (2,Bob,200.0) | EXPERIENCE | #param set prod, #run prod |
| E8 | `param unset --env prod`: prod cell inherits default; prod.yaml keeps `parameters: {}` | EXPERIENCE | #unset prod |

Notes: lesson title in the hub kept "Manage projects"; content is CLI-only (Studio Project settings are covered by "Project settings and Global settings" and the Execution order lessons). Not tested: `hdrctl run . --env prod` on a project, `job add --template`, error messages (job not found, etc. in the Common errors table are not reproduced: listed as causes/fixes only).
No screenshots: text-only lesson.

## Addendum (block-manage2.log, probe run-probe-manage2.bat)
- `job attach nojob workflow1` -> "job 'nojob' not found: ...\jobs\nojob (create it with: hdrctl job add nojob)" (matches "Job not found").
- `job add other noworkflow` -> "workflow 'noworkflow' not found in ...\workflows (create it with: hdrctl workflow add noworkflow)" (matches "Workflow not found").
- `job detach nojob workflow1` -> "Job 'nojob' not found (jobs\nojob) and used by no workflow."
- `hdrctl run jobs\job1 --env staging` (no such environment): ran with the default value, 2 written (matches "Same result with --env").
