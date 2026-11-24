
### Added

- **SQLite connector** (`type: sqlite`), source and destination, built in: `sqlite3` is part of Python, nothing to
  install, no server. `connection.path` is the database file, relative to the job folder. Source: `table` or
  `query`; a missing file is an error and is never created by a read or by `hdrctl test`. Destination: the file
  and the table are created at the first batch (types from the data; in `upsert` the key becomes the primary
  key); `append`, `replace`, `upsert` (`INSERT … ON CONFLICT … DO UPDATE`, primary key or unique index required
  on an existing table, with the `CREATE UNIQUE INDEX` to run in the error). All-or-nothing by default in the
  three modes (one transaction, table creation included; `load.atomic: false` commits batch by batch).
  `rollback: true` undoes a SQLite load; `source_change` triggers count and max with one SQL query. The
  database uses the WAL journal, so a job can read one table while it writes another in the same file.
- Studio — **SQLite** source and destination nodes in the palette: database file, table or SQL query; in
  destination, mode, key columns for `upsert` and all-or-nothing. Read from and written to the YAML files like
  the other nodes; **View data** reads the destination table. The node catalogue of the API (`/api/nodes`) lists
  SQLite, and its descriptions are in English. The data viewer also reads SQL Server destinations (it fell back
  to CSV).
- VS Code extension 0.1.10: `type: sqlite` in `sources.yaml` and `destinations.yaml` (`connection.path`
  required, server keys refused), `sqlserver` / `mssql` in the list of types; snippets `hsrc-sqlite`,
  `hdst-sqlite`.
- **Snowflake connector** (`type: snowflake`), read-only source (`pip install "hydra-etl[snowflake]"`).
  `connection`: `account`, `user`, `password` (or `private_key_file` / `authenticator`), `warehouse`,
  `database`, `schema`, `role`. Source: `table` (`table`, `schema.table` or `database.schema.table`) or
  `query`, which must start with SELECT, WITH, SHOW or DESCRIBE; `extract.limit` is applied. Values keep their
  exact type: `NUMBER(p,0)` → integers, even beyond 64 bits; `NUMBER(p,s)` → exact decimals; `DATE` → dates;
  `TIMESTAMP_NTZ` → timestamps without time zone; `TIMESTAMP_TZ` / `TIMESTAMP_LTZ` → timestamps with their time
  zone; `VARIANT`, `OBJECT`, `ARRAY` → JSON values (`connection.json: text` keeps the JSON text).
  `connection.column_case: lower` lowercases the column names (what PostgreSQL expects); two columns that only
  differ by case are refused before any row is read. Reads Arrow batches when the driver provides them,
  otherwise `fetchmany`, with the same values. Refused as a destination. Every query is tagged `hydra-etl`
  (`QUERY_TAG`). `source_change` triggers count and max with one SQL query. An unknown account
  (`404 Not Found` at login) gets a hint on the expected `connection.account` format.
- **PostgreSQL CDC source** (`type: postgresql_cdc`, alias `postgres_cdc`): the changes of a table (inserts,
  updates, deletes) read by logical replication (`pgoutput` plugin, nothing to install on the server), in the order
  of the transactions. `connection`: the usual PostgreSQL keys plus `slot` and `publication`, created at the first
  run (`create: false` to require them); `extract.table`. The first run reads the whole table (`snapshot: false` to
  skip it), the next runs only the changes. Each row carries `_op` (`snapshot`, `insert`, `update`, `delete`),
  `_lsn` and `_commit_time`; values keep their PostgreSQL type (integers, exact decimals, dates, timestamps with
  their time zone, JSON). The changes are read without being consumed, and the slot only moves on after the
  destination has published (the job confirms the source at the end): a failed load reads the same changes again
  at the next run. A workflow with `rollback: true` refuses a CDC source. Needs `wal_level = logical`, PostgreSQL 11+
  and a role with `REPLICATION`. Example: `examples/postgres-cdc-mirror`.
- PostgreSQL destination — in `upsert`, rows that carry `_op` (from a CDC source) are applied as changes: the last
  change of each key in a batch wins, deletes are applied by key, an update whose large value was not changed
  (TOAST) keeps the current value, and `_op`, `_lsn`, `_commit_time` are not written. In `append`, they are all
  written (a log of the changes).
- Studio — **Snowflake** source node in the palette: account, user, private key file or password, warehouse,
  database, schema, role, column names (`preserve` / `lower`), JSON columns (`parse` / `text`), table or SELECT
  query. Read from and written to `sources.yaml` like the other nodes; a field emptied in the form is removed
  from the file, and references such as `{{ env:SNOWFLAKE_ACCOUNT }}` are kept as written.
- Studio — **PostgreSQL CDC** source node: host, port, database, user, password, table, replication slot,
  publication, and two yes / no lists (create slot and publication if missing; first run copies the whole table).
- VS Code extension 0.1.11: `type: snowflake` in `sources.yaml` (`account` and `user` required, unknown
  connection keys refused, `column_case` and `json` offered as lists, `extract.query` limited to SELECT /
  WITH / SHOW / DESCRIBE), refused in `destinations.yaml`; snippet `hsrc-snowflake`.
- VS Code extension 0.1.12: `type: postgresql_cdc` / `postgres_cdc` in `sources.yaml` (`user`, `database`, `slot`,
  `publication` required, slot and publication names checked, `create` and `snapshot` booleans, `extract.table`
  required and `extract.query` refused), refused in `destinations.yaml`; snippet `hsrc-cdc`.

### Changed

- PostgreSQL destination — a table created by Hydra ETL now gets exact types from all the values of the first
  batch: exact decimals and integers beyond 64 bits → `NUMERIC` (decimals were `TEXT`), dates → `DATE` (were
  `TIMESTAMP`), timestamps with a time zone → `TIMESTAMPTZ` (the time zone was dropped), dicts and lists →
  `JSONB` (were refused). In `upsert`, a missing table is created with the key as primary key (the load used to
  fail and ask for a `CREATE UNIQUE INDEX`); an existing table still needs a primary key or unique index on the
  key. Existing tables are not changed.
- PostgreSQL destination — an integer too large for a `smallint`, `integer` or `bigint` column is reported before
  the batch is written, with the column, the value and the `ALTER TABLE … TYPE NUMERIC(38,0)` to run (the error
  was `bigint out of range`, without the column).
- PostgreSQL destination — rows are written in multi-row statements of 1,000 rows instead of one statement per
  row, in the three modes (in `upsert`, a batch that holds the same key twice is still written row by row, so the
  last row wins as before). In `append`, a missing table is now created at the first batch, as in `replace` and
  `upsert`.

### Fixed

- Studio — saving no longer damages the YAML files written by hand: a file whose content did not change is not
  rewritten at all; a changed file keeps, for every unchanged line, its original text (quotes, inline lists,
  end-of-line comments) and the comments above it. The `description` of a workflow is kept, and Studio no longer
  adds `trigger: {type: manual}` or `pipeline.name` to files that did not have them.
- Studio — a workflow file added on disk after the project was opened (by `hdrctl`, `git pull`, or after Studio's
  metadata was deleted) now appears in the project's list without reopening the project. A YAML file of
  `workflows/` that is not a workflow is no longer listed as one.
