# Evidence: Anatomy of a job (/studio/anatomy-of-a-job/)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows, Python 3.13.7. Logs: `block-anatomy.log`, `block-anatomy2.log` (probes `run-probe-anatomy*.bat`, folders `anatomy-probe`, `anatomy-probe2`).

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | `hdrctl init anatomy-demo` creates jobs/job1 with 4 manifests, README.md, data/input.csv, plus workflow1, thread.yaml, parameters.yaml, .hydra | EXPERIENCE | block-anatomy.log #init |
| E2 | Contents of sources/transformations/destinations/pipeline.yaml as shown | EXPERIENCE | block-anatomy.log |
| E3 | validate lists presence, Pydantic validity, pipeline.from/to resolved | EXPERIENCE | block-anatomy.log #validate |
| E4 | Run: 3 rows read, 2 written (value -5 filtered); output.csv in jobs/job1/data | EXPERIENCE | #run, #tree2 |
| E5 | Without transformations.yaml: validate OK, 3 written | EXPERIENCE | block-anatomy2.log |
| E6 | Unknown pipeline.from: "pipeline.from='src_missing' not found in sources.yaml", 1 error | EXPERIENCE | block-anatomy2.log |
| E7 | Missing destinations.yaml: "destinations.yaml MISSING" + pipeline.to not found, 2 errors | EXPERIENCE | block-anatomy2.log |
| E8 | Paths relative to the job folder | EXPERIENCE | output.csv appeared in jobs/job1/data after `hdrctl run jobs\job1` |
| E9 | Default template is csv | FACT | `hdrctl init` banner "[template: csv]" |

Not tested / not claimed: Studio node mapping (see lessons 03, 05, 08), non-csv templates, whether other missing files (sources, pipeline) give the same message (only the removal of destinations.yaml was tested).
No screenshots: text-only lesson (commands and output).
