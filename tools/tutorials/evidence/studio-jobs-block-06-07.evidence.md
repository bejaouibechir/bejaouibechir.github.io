# Evidence - lessons 06 (transformations) and 07 (destinations)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows, project built by setup_course.py (20-row orders sample), script `evidence_jobs0607.py`.

| ID | Statement | Type | Proof |
|---|---|---|---|
| E1 | Palette: 20 transformations (order Filter..Script) and 10 destinations; 13 sources | FACT | studio/src/lib/nodeRegistry.ts + captures |
| E2 | Nominal first-job: 20 rows read, 14 written | EXPERIENCE | run A below |
| E3 | Select dropping `status` before Filter: validate OK, run fails `name 'status' is not defined` | EXPERIENCE | run D |
| E4 | Second destination declared but not referenced: valid, ignored | EXPERIENCE | run B |
| E5 | `to: [a, b]` refused: `Input should be a valid string` / `pipeline.to is missing or empty` | EXPERIENCE | run C |
| E6 | Connection rejected reasons (exists, cycle, cannot have input/output, max inputs/outputs) | FACT (source read, not triggered live) | studio/src/lib/nodeValidation.ts |
| E7 | Join/Merge/Union descriptions, no maxInputs set | FACT | nodeRegistry.ts |
| E8 | Dialog fields (Step name, Columns, Expression, File path, Location, Node ID) | FACT | captures |

Not verified live: the Connection rejected toast itself, a two-source convergence on Join (not claimed).

## Raw output
```
wrote C:\Users\DELL\hydra-workspace\jobs-evidence\jobs\first-job\data\orders.csv
== A. nominal job
$ hdrctl validate jobs/first-job -> exit 0
   ? DSL Validation  first-job
   
   ok  pipeline.yaml                        � present
   ok  sources.yaml                         � present
   ok  sources.yaml                         � Pydantic valid
   ok  destinations.yaml                    � present
   ok  destinations.yaml                    � Pydantic valid
   ok  transformations.yaml                 � present
   ok  transformations.yaml                 � Pydantic valid
   ok  pipeline.from                        � resolved: src_orders
   ok  pipeline.to                          � resolved: dest_paid
   
   
   ? DSL valid � no errors detected.
$ hdrctl run jobs/first-job -> exit 0
   | |_| |   \ V /   | | | |  | |_) |   / _ \
   |  _  |    | |    | |_| |  |  _ <   / ___ \
   |_| |_|    |_|    |____/   |_| \_\ /_/   \_\
   
   DevOps Edition  v0.22.0  ----------------------------
   
   
   ?  Pipeline  first-job  � jobs/first-job
   
   
   
   ? Pipeline completed successfully in 10.3s
   Rows read   : 20
   Rows written: 14
rows written: 14
== B. a second destination declared, pipeline keeps one `to`
$ hdrctl validate jobs/first-job -> exit 0
   ? DSL Validation  first-job
   
   ok  pipeline.yaml                        � present
   ok  sources.yaml                         � present
   ok  sources.yaml                         � Pydantic valid
   ok  destinations.yaml                    � present
   ok  destinations.yaml                    � Pydantic valid
   ok  transformations.yaml                 � present
   ok  transformations.yaml                 � Pydantic valid
   ok  pipeline.from                        � resolved: src_orders
   ok  pipeline.to                          � resolved: dest_paid
   
   
   ? DSL valid � no errors detected.
$ hdrctl run jobs/first-job --dry-run -> exit 0
   
   ok  sources.yaml                         � present
   ok  destinations.yaml                    � present
   ok  pipeline.yaml                        � present
   ok  transformations.yaml                 � present
   
   ok  sources.yaml                         � DSL valid
   ok  destinations.yaml                    � DSL valid
   ok  transformations.yaml                 � DSL valid
   ok  pipeline.from                        � resolved: src_orders
   ok  pipeline.to                          � resolved: dest_paid
   
   ? Dry-run complete � everything is valid. Ready to execute.
   Run: hdrctl run jobs/first-job
== C. pipeline lists two destinations
$ hdrctl validate jobs/first-job -> exit 1
   
   ok  pipeline.yaml                        � present
   ok  sources.yaml                         � present
   ok  sources.yaml                         � Pydantic valid
   ok  destinations.yaml                    � present
   ok  destinations.yaml                    � Pydantic valid
   ok  transformations.yaml                 � present
   ok  transformations.yaml                 � Pydantic valid
   ok  pipeline.from                        � resolved: src_orders
   
   err pipeline.yaml: to � Input should be a valid string
   err pipeline.to is missing or empty
   
   ? 2 error(s) detected.
$ hdrctl run jobs/first-job --dry-run -> exit 1
   ok  sources.yaml                         � present
   ok  destinations.yaml                    � present
   ok  pipeline.yaml                        � present
   ok  transformations.yaml                 � present
   
   ok  sources.yaml                         � DSL valid
   ok  destinations.yaml                    � DSL valid
   ok  transformations.yaml                 � DSL valid
   ok  pipeline.from                        � resolved: src_orders
   
   err pipeline.yaml: to � Input should be a valid string
   err pipeline.to is missing or empty
   
   ? Dry-run failed � validation errors detected. Fix them before running.
== D. filter before select on a dropped column
$ hdrctl validate jobs/first-job -> exit 0
   ? DSL Validation  first-job
   
   ok  pipeline.yaml                        � present
   ok  sources.yaml                         � present
   ok  sources.yaml                         � Pydantic valid
   ok  destinations.yaml                    � present
   ok  destinations.yaml                    � Pydantic valid
   ok  transformations.yaml                 � present
   ok  transformations.yaml                 � Pydantic valid
   ok  pipeline.from                        � resolved: src_orders
   ok  pipeline.to                          � resolved: dest_paid
   
   
   ? DSL valid � no errors detected.
$ hdrctl run jobs/first-job -> exit 1
   DevOps Edition  v0.22.0  ----------------------------
   
   
   ?  Pipeline  first-job  � jobs/first-job
   
   
   
   Cause:
   ValueError: Step 2/2: filter: invalid expression 'status == 'paid''. Error: name 'status' is not defined
   
   Hint: re-run with -v for more details
   Job 'first-job' failed: ValueError: Step 2/2: filter: invalid expression 'status == 'paid''. Error: name 'status' is not defined
   
   ? Pipeline FAILED in 2.9s
```
