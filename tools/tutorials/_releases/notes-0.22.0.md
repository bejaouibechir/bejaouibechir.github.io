
### Added

- **BigQuery connector** (`type: bigquery`), source and destination (`pip install "hydra-etl[bigquery]"`).
  `connection`: `project` (required), `dataset` (default dataset), `location`, `credentials_file` (service account
  key, relative to the job folder; without it, the default credentials of `gcloud auth application-default login`).
  - Source: `table` (`table`, `dataset.table` or `project.dataset.table`) or `query` (`SELECT` / `WITH` only). Exact
    types: `NUMERIC` / `BIGNUMERIC` as decimals, `DATETIME` without time zone, `TIMESTAMP` with its time zone, `JSON`
    as values (`json: text` for the JSON text).
  - Destination: `append`, `replace`, `upsert`, **all-or-nothing in every mode by default**. Each batch goes to a
    staging table of the same dataset (`_hydra_stage_…`, load jobs, expires after 24 h); the target is written in one
    statement at the end: `INSERT … SELECT`, `DELETE` + `INSERT` in a transaction for `replace`, `MERGE` for
    `upsert` (the last row of a key wins; the deletes of a PostgreSQL CDC source are applied). Every value is
    converted by BigQuery into the type of its column: no integer or decimal goes through a float. A missing table
    is created from the data (`INT64`, `NUMERIC` / `BIGNUMERIC`, `FLOAT64`, `BOOL`, `DATE`, `DATETIME`,
    `TIMESTAMP`, `JSON`, `BYTES`, `STRING`). `load.atomic: false` writes after each batch.
  - Columns are matched regardless of case. A column the table does not have, two columns that only differ by
    case, a `RECORD` / `ARRAY` column, or a row without a key value in `upsert` are refused.
  - `rollback: true` in a workflow is not available for BigQuery yet: the workflow is refused before it starts.
- Studio — **BigQuery** source and destination nodes. MCP server and `/api/nodes`: BigQuery listed.
- **MySQL CDC source** (`type: mysql_cdc`, `pip install "hydra-etl[mysql-cdc]"`): the inserts, updates and deletes
  of a MySQL table, read from the binlog in the order of the transactions, with the same `_op`, `_lsn` and
  `_commit_time` columns as the PostgreSQL CDC source (a destination in `upsert` keeps a mirror up to date).
  - MySQL has no replication slot: the binlog position is saved in `.hydra/cdc/<state>.json`, only after the
    destination is published; a failed run reads the same changes again. A transaction is emitted whole.
  - First run: current position, then the whole table in a consistent snapshot (`snapshot: false` to skip it), no
    global lock.
  - Checked before reading: `log_bin`, `binlog_format = ROW`, `binlog_row_image = FULL`. A position whose binlog was
    purged by MySQL fails the run with the steps to rebuild the mirror; `lag_warning_mb` warns before.
  - Studio node **MySQL CDC**; VS Code schema and snippet `hsrc-mysql-cdc`.
- Fallback conditions — **`cdc.lag('source')`** (changes still to read, in bytes) and **`cdc.status('source')`**
  (`ok`, `at_risk`, `lost`, `missing`) for any CDC source, PostgreSQL or MySQL. `cdc.slot_lag` and
  `cdc.slot_status` keep working for PostgreSQL.
- Relative paths of `bigquery` (`credentials_file`) sources and destinations are read from the job folder.
- **Object stores — S3, Azure Blob / ADLS and Google Cloud Storage** for CSV, JSON and Parquet sources and destinations
  (`pip install "hydra-etl[s3]"`, `"hydra-etl[azure]"`, `"hydra-etl[gcs]"`). A location is a URI in the keys that
  already exist: `connection.base_path: az://landing/sales/` with a relative table, or `table: s3://bucket/path/file.csv`
  (`s3://`, `az://`, `abfs://`, `abfss://`, `gs://`). Credentials go in `connection.storage` (passed to the fsspec file
  system: `key` / `secret` / `endpoint_url` for S3 and MinIO, `account_name` / `account_key` / `connection_string` /
  `sas_token` for Azure, `token` / `project` for GCS), or come from the usual environment variables of each service.
  - Sources: the file, or every file of a pattern (`orders_*.csv`), is copied to a temporary folder and read with the
    usual readers (native CSV reader, large-volume engine, multi-file sources).
  - Destinations: the file is written locally, then uploaded in one go after the load is published; an object store only
    shows an object once complete, so the remote file is the old one or the new one, never half written. `append`
    downloads the existing file first. A failed upload leaves the remote file unchanged.
  - `rollback: true` is not available yet with a destination on an object store. `sftp://` is refused with a clear message
    (planned).
- Studio — CSV, JSON and Parquet nodes get a **Location** field (local, S3, Azure, GCS) and the credential fields of
  the chosen service, written to `connection.storage`; a path without `s3://` / `az://` / `gs://` gets the prefix of
  the chosen location.
- File triggers — `path` can be an object store pattern (`s3://bucket/landing/*.csv`, `az://…`, `gs://…`), with the
  credentials in `storage` (`${SECRET:…}` and `${ENV:…}` are resolved).
