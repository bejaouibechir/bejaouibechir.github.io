# Evidence: Sub-projects and Sub-project parameters
Lessons: /studio/call-a-project-from-a-project/ and /studio/pass-parameters-to-a-sub-project/. Verified 2026-11-24, Hydra ETL 0.22.0, Windows. Logs `block-sub.log`, `block-sub2.log`, `block-sub3.log`; probes `run/run-probe-sub*.bat`; data `sub-gen/`; folders `sub-probe`, `sub-probe3` (child/master).

## Call a project from a project
| ID | Claim | Type | Proof |
|---|---|---|---|
| A1 | `hdrctl init child` / `master` create projects; child runs alone: completed 2.1 s, 1/1 OK | EXPERIENCE | block-sub3 #child alone |
| A2 | Step `type: project, project: ../child, depends_on [job1]`: master run shows Step 'call_child' OK and child workflow1/job1 under it; completed 1.5 s | EXPERIENCE | block-sub3 #master run |
| A3 | Dry run: "Dry run OK", plan line `workflow1 (2: job1, call_child)`; child steps not listed | EXPERIENCE | block-sub3 #master dry |
| A4 | `project: ../nothing` -> "project folder not found: ../nothing (resolved from the project root: ...)" (dry run and run) | EXPERIENCE | block-sub #wf-missing |
| A5 | `project: .` -> "the project calls itself" | EXPERIENCE | block-sub #wf-cycle |
| A6 | Loop through several projects also detected | CLAIM (source subprojects.py), not tested | |

## Sub-project parameters
| ID | Claim | Type | Proof |
|---|---|---|---|
| B1 | `params: {min_value: 150}` reaches the child: child output only (2,Bob,200.0), 1 row | EXPERIENCE | block-sub #wf-ok child output, block-sub2 |
| B2 | `outputs: [result_rows]` + child set_param (int 2): placeholders `{{ project:call_child.status }}` = success, `.rows` = 1, `.param.result_rows` = 2; log line "child success, 1 row(s), published 2" | EXPERIENCE | block-sub2 |
| B3 | Plain `{{ param:result_rows }}` fails: "ParameterError: unresolved parameter: 'result_rows'" | EXPERIENCE | block-sub #wf-ok run |
| B4 | `outputs: [nope]` -> "project child did not publish nope (outputs: set them with set_param / assign_param, or declare them)" | EXPERIENCE | block-sub #wf-noout |
| B5 | Undeclared param `not_declared: 1`: run OK, ignored | EXPERIENCE | block-sub #wf-badparam |
| B6 | params/variables may not carry secrets | CLAIM (source models.py), not tested | |

Not tested: `ref: name`, `env`, `variables`, `workflows`, `isolation`, `timeout`, `overlap`, parallel call (switches to a subprocess per source), child failure shown in master. No screenshots: text-only lessons. Tree glyphs (✓, indentation) are transcribed from the console where cp1252 hid them; check on a UTF-8 console if exactness matters.
