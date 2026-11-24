# Evidence — read-and-write-sqlite-databases (Database sources)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows, probe `run-probe-sqlite.bat` (log `block-sqlite.log`, data `sqlite-gen/`).

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | table source: 5 read / 5 written, CSV identical to table | EXPERIENCE | log #run read-table |
| E2 | query source: 3 rows, 3 columns | EXPERIENCE | log #run read-query |
| E3 | sqlite destination upsert creates DB + table, key = PRIMARY KEY | EXPERIENCE | sqlite_master dump |
| E4 | 2nd run after change: 6 rows, order 2 'paid', order 6 added; 3rd run: still 6 | EXPERIENCE | log #load 2, #load 3 |
| E5 | missing file: "SQLiteConnector [src_app]: database file not found: <path>" | EXPERIENCE | log #run missing-db |
| E6 | missing table: "OperationalError: no such table: nothing" | EXPERIENCE | log #run missing-table |
| E7 | validate passes in both error cases | EXPERIENCE | log |
| E8 | path relative to job folder; append/replace/upsert; no install | FACT | sqlite_connector.py docstring + test |
| E9 | "Two rows for one key" with append/replace | OPINION/logic | not tested, listed in Common errors as cause; mild |

Not tested: append and replace modes, `load.atomic`, WAL, Studio UI for SQLite (no captures).
