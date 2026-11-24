# Evidence: File sources (/studio/read-csv-json-and-parquet-files/)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows. Logs `block-files.log`, `block-files2.log`; probes `run/run-probe-files*.bat`; generator data `files-gen/`, working copy `files-probe/`.

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | csv-job, json-job, parquet-job: each 3 read / 3 written, same output csv | EXPERIENCE | block-files.log |
| E2 | Paths like data/people.csv read from the job folder | EXPERIENCE | files in jobs/<job>/data worked |
| E3 | JSON = list of objects (only shape tested) | EXPERIENCE | people.json |
| E4 | Missing file: "CSVConnector [src_missing_file]: source file not found." | EXPERIENCE | #run missing-file |
| E5 | Semicolon CSV: `connection.delimiter` and a flat `delimiter` both ignored; with `select [name,value]` -> "unknown columns ['name', 'value']. Available columns: ['id;name;value']"; without select the run reports success | EXPERIENCE | block-files2.log (3 variants identical) |
| E6 | Parquet needs optional extra `parquet` (pyarrow) | CLAIM (pyproject.toml), not tested (pyarrow already present) | pyproject.toml line 57 |

Product defect to report (registry 24): CSVConnector reads `delimiter`/`encoding` at the root of its config (csv_connector.py `_normalize_settings`), but the executor passes only `{type, connection, extract}` (`executor.py _build_connector`); Studio's own test (`hdrSerializer.test.ts`) writes `connection.delimiter`. `ExtractConfig` has no `delimiter`/`encoding`. Not tested: encoding, other JSON shapes, validate output (not captured).
No screenshots: text-only lesson. The public lesson states the semicolon limit for 0.22 only; remove if fixed.
