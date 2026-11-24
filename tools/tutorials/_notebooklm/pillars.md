# Hydra ETL — pillar and entry pages

Chaque section est une page du site. L'en-tete porte le titre exact et
l'URL : cite-les tels quels comme source.


## Hydra ETL changelog — slug: /changelog/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

### Hydra ETL changelog

Every release of Hydra ETL, newest first. Each one lists its new features, then its patches and fixes.

Latest version: 0.22.0 — released 24 November 2026.

Install or upgrade: pip install -U hydra-etl

#### v0.22.0 — BigQuery, MySQL CDC, object stores

24 November 2026 latest GitHub release PyPI

###### Added

BigQuery connector (type: bigquery), source and destination (pip install "hydra-etl[bigquery]").
connection: project (required), dataset (default dataset), location, credentials_file (service account

key, relative to the job folder; without it, the default credentials of gcloud auth application-default login).

Source: table (table, dataset.table or project.dataset.table) or query (SELECT / WITH only). Exact

types: NUMERIC / BIGNUMERIC as decimals, DATETIME without time zone, TIMESTAMP with its time zone, JSON

as values (json: text for the JSON text).

Destination: append, replace, upsert, all-or-nothing in every mode by default. Each batch goes to a

staging table of the same dataset (_hydra_stage_…, load jobs, expires after 24 h); the target is written in one

statement at the end: INSERT … SELECT, DELETE + INSERT in a transaction for replace, MERGE for
upsert (the last row of a key wins; the deletes of a PostgreSQL CDC source are applied). Every value is

converted by BigQuery into the type of its column: no integer or decimal goes through a float. A missing table

is created from the data (INT64, NUMERIC / BIGNUMERIC, FLOAT64, BOOL, DATE, DATETIME,
TIMESTAMP, JSON, BYTES, STRING). load.atomic: false writes after each batch.

Columns are matched regardless of case. A column the table does not have, two columns that only differ by

case, a RECORD / ARRAY column, or a row without a key value in upsert are refused.

rollback: true in a workflow is not available for BigQuery yet: the workflow is refused before it starts.

Studio — BigQuery source and destination nodes. MCP server and /api/nodes: BigQuery listed.

MySQL CDC source (type: mysql_cdc, pip install "hydra-etl[mysql-cdc]"): the inserts, updates and deletes

of a MySQL table, read from the binlog in the order of the transactions, with the same _op, _lsn and
_commit_time columns as the PostgreSQL CDC source (a destination in upsert keeps a mirror up to date).

MySQL has no replication slot: the binlog position is saved in .hydra/cdc/<state>.json, only after the

destination is published; a failed run reads the same changes again. A transaction is emitted whole.

First run: current position, then the whole table in a consistent snapshot (snapshot: false to skip it), no

global lock.

Checked before reading: log_bin, binlog_format = ROW, binlog_row_image = FULL. A position whose binlog was

purged by MySQL fails the run with the steps to rebuild the mirror; lag_warning_mb warns before.

Studio node MySQL CDC; VS Code schema and snippet hsrc-mysql-cdc.

Fallback conditions — cdc.lag('source') (changes still to read, in bytes) and cdc.status('source')

(ok, at_risk, lost, missing) for any CDC source, PostgreSQL or MySQL. cdc.slot_lag and
cdc.slot_status keep working for PostgreSQL.

Relative paths of bigquery (credentials_file) sources and destinations are read from the job folder.

Object stores — S3, Azure Blob / ADLS and Google Cloud Storage for CSV, JSON and Parquet sources and destinations

(pip install "hydra-etl[s3]", "hydra-etl[azure]", "hydra-etl[gcs]"). A location is a URI in the keys that

already exist: connection.base_path: az://landing/sales/ with a relative table, or table: s3://bucket/path/file.csv

(s3://, az://, abfs://, abfss://, gs://). Credentials go in connection.storage (passed to the fsspec file

system: key / secret / endpoint_url for S3 and MinIO, account_name / account_key / connection_string /
sas_token for Azure, token / project for GCS), or come from the usual environment variables of each service.

Sources: the file, or every file of a pattern (orders_*.csv), is copied to a temporary folder and read with the

usual readers (native CSV reader, large-volume engine, multi-file sources).

Destinations: the file is written locally, then uploaded in one go after the load is published; an object store only

shows an object once complete, so the remote file is the old one or the new one, never half written. append

downloads the existing file first. A failed upload leaves the remote file unchanged.

rollback: true is not available yet with a destination on an object store. sftp:// is refused with a clear message

(planned).

Studio — CSV, JSON and Parquet nodes get a Location field (local, S3, Azure, GCS) and the credential fields of

the chosen service, written to connection.storage; a path without s3:// / az:// / gs:// gets the prefix of

the chosen location.

File triggers — path can be an object store pattern (s3://bucket/landing/*.csv, az://…, gs://…), with the

credentials in storage (${SECRET:…} and ${ENV:…} are resolved).

#### v0.21.0 — Snowflake destination

24 November 2026 GitHub release PyPI

###### Added

Snowflake destination (type: snowflake in destinations.yaml): append, replace and upsert.

Every value is sent as text and converted by Snowflake into the type of the target column: no integer or

decimal goes through a float (NUMBER(p, s), FLOAT, DATE, TIME, TIMESTAMP_NTZ / _TZ / _LTZ,
VARIANT / OBJECT / ARRAY from dict / list or JSON text, BINARY).

A missing table is created at the first batch, with types taken from the data (integers NUMBER(38,0),

decimals NUMBER(38,s), datetimes with a time zone TIMESTAMP_TZ, dict / list VARIANT…). Simple column

names are written without quotes, so Snowflake stores them in upper case (order_id → ORDER_ID).

Columns are matched with the table's columns regardless of case. Two columns of the data that only differ

by case, or a column the table does not have, are refused with the list of the table's columns.

replace deletes and inserts in one transaction (all-or-nothing by default). upsert runs a MERGE on
load.key: a row without a key value is refused (it would be added again at every run), and when a batch

holds the same key twice the last row wins. The deletes of a PostgreSQL CDC source are applied.

Snowflake commits every DDL statement at once: when an all-or-nothing load fails, the table it created is

dropped.

rollback: true in a workflow undoes a Snowflake load, as for the other databases.

Studio — Snowflake destination node: account, key pair or password, warehouse, database, schema, role,

table, mode, upsert key and all-or-nothing.

MCP server — hydra_list_connectors lists Snowflake as a source and a destination.

###### Changed

Studio — Global settings and Project settings are displayed twice as large: the text (11 to 13 px)

was hard to read, and the page had room to spare. On a narrow screen, the project header and the execution

order wrap to the next line instead of overlapping.

#### v0.20.0 — SQLite and Snowflake source

24 November 2026 GitHub release PyPI

###### Added

SQLite connector (type: sqlite), source and destination, built in: sqlite3 is part of Python, nothing to

install, no server. connection.path is the database file, relative to the job folder. Source: table or
query; a missing file is an error and is never created by a read or by hdrctl test. Destination: the file

and the table are created at the first batch (types from the data; in upsert the key becomes the primary

key); append, replace, upsert (INSERT … ON CONFLICT … DO UPDATE, primary key or unique index required

on an existing table, with the CREATE UNIQUE INDEX to run in the error). All-or-nothing by default in the

three modes (one transaction, table creation included; load.atomic: false commits batch by batch).
rollback: true undoes a SQLite load; source_change triggers count and max with one SQL query. The

database uses the WAL journal, so a job can read one table while it writes another in the same file.

Studio — SQLite source and destination nodes in the palette: database file, table or SQL query; in

destination, mode, key columns for upsert and all-or-nothing. Read from and written to the YAML files like

the other nodes; View data reads the destination table. The node catalogue of the API (/api/nodes) lists

SQLite, and its descriptions are in English. The data viewer also reads SQL Server destinations (it fell back

to CSV).

VS Code extension 0.1.10: type: sqlite in sources.yaml and destinations.yaml (connection.path

required, server keys refused), sqlserver / mssql in the list of types; snippets hsrc-sqlite,
hdst-sqlite.

Snowflake connector (type: snowflake), read-only source (pip install "hydra-etl[snowflake]").
connection: account, user, password (or private_key_file / authenticator), warehouse,
database, schema, role. Source: table (table, schema.table or database.schema.table) or
query, which must start with SELECT, WITH, SHOW or DESCRIBE; extract.limit is applied. Values keep their

exact type: NUMBER(p,0) → integers, even beyond 64 bits; NUMBER(p,s) → exact decimals; DATE → dates;
TIMESTAMP_NTZ → timestamps without time zone; TIMESTAMP_TZ / TIMESTAMP_LTZ → timestamps with their time

zone; VARIANT, OBJECT, ARRAY → JSON values (connection.json: text keeps the JSON text).
connection.column_case: lower lowercases the column names (what PostgreSQL expects); two columns that only

differ by case are refused before any row is read. Reads Arrow batches when the driver provides them,

otherwise fetchmany, with the same values. Refused as a destination. Every query is tagged hydra-etl

(QUERY_TAG). source_change triggers count and max with one SQL query. An unknown account

(404 Not Found at login) gets a hint on the expected connection.account format.

PostgreSQL CDC source (type: postgresql_cdc, alias postgres_cdc): the changes of a table (inserts,

updates, deletes) read by logical replication (pgoutput plugin, nothing to install on the server), in the order

of the transactions. connection: the usual PostgreSQL keys plus slot and publication, created at the first

run (create: false to require them); extract.table. The first run reads the whole table (snapshot: false to

skip it), the next runs only the changes. Each row carries _op (snapshot, insert, update, delete),
_lsn and _commit_time; values keep their PostgreSQL type (integers, exact decimals, dates, timestamps with

their time zone, JSON). The changes are read without being consumed, and the slot only moves on after the

destination has published (the job confirms the source at the end): a failed load reads the same changes again

at the next run. A workflow with rollback: true refuses a CDC source. Needs wal_level = logical, PostgreSQL 11+

and a role with REPLICATION. Example: examples/postgres-cdc-mirror.

PostgreSQL destination — in upsert, rows that carry _op (from a CDC source) are applied as changes: the last

change of each key in a batch wins, deletes are applied by key, an update whose large value was not changed

(TOAST) keeps the current value, and _op, _lsn, _commit_time are not written. In append, they are all

written (a log of the changes).

Studio — Snowflake source node in the palette: account, user, private key file or password, warehouse,

database, schema, role, column names (preserve / lower), JSON columns (parse / text), table or SELECT

query. Read from and written to sources.yaml like the other nodes; a field emptied in the form is removed

from the file, and references such as {{ env:SNOWFLAKE_ACCOUNT }} are kept as written.

Studio — PostgreSQL CDC source node: host, port, database, user, password, table, replication slot,

publication, and two yes / no lists (create slot and publication if missing; first run copies the whole table).

VS Code extension 0.1.11: type: snowflake in sources.yaml (account and user required, unknown

connection keys refused, column_case and json offered as lists, extract.query limited to SELECT /

WITH / SHOW / DESCRIBE), refused in destinations.yaml; snippet hsrc-snowflake.

VS Code extension 0.1.12: type: postgresql_cdc / postgres_cdc in sources.yaml (user, database, slot,
publication required, slot and publication names checked, create and snapshot booleans, extract.table

required and extract.query refused), refused in destinations.yaml; snippet hsrc-cdc.

###### Changed

PostgreSQL destination — a table created by Hydra ETL now gets exact types from all the values of the first

batch: exact decimals and integers beyond 64 bits → NUMERIC (decimals were TEXT), dates → DATE (were
TIMESTAMP), timestamps with a time zone → TIMESTAMPTZ (the time zone was dropped), dicts and lists →
JSONB (were refused). In upsert, a missing table is created with the key as primary key (the load used to

fail and ask for a CREATE UNIQUE INDEX); an existing table still needs a primary key or unique index on the

key. Existing tables are not changed.

PostgreSQL destination — an integer too large for a smallint, integer or bigint column is reported before

the batch is written, with the column, the value and the ALTER TABLE … TYPE NUMERIC(38,0) to run (the error

was bigint out of range, without the column).

PostgreSQL destination — rows are written in multi-row statements of 1,000 rows instead of one statement per

row, in the three modes (in upsert, a batch that holds the same key twice is still written row by row, so the

last row wins as before). In append, a missing table is now created at the first batch, as in replace and
upsert.

###### Fixed

Studio — saving no longer damages the YAML files written by hand: a file whose content did not change is not

rewritten at all; a changed file keeps, for every unchanged line, its original text (quotes, inline lists,

end-of-line comments) and the comments above it. The description of a workflow is kept, and Studio no longer

adds trigger: {type: manual} or pipeline.name to files that did not have them.

Studio — a workflow file added on disk after the project was opened (by hdrctl, git pull, or after Studio's

metadata was deleted) now appears in the project's list without reopening the project. A YAML file of
workflows/ that is not a workflow is no longer listed as one.

#### v0.19.1

24 November 2026 GitHub release PyPI

###### Fixed

aggregate with sum or mean on a text column concatenated the values instead of adding them

("19.9" + "49.9" → "19.949.9"), with no error: a CSV column read without cast is text, so a job that

re-read a CSV written by another job produced a wrong total. The step now fails with
aggregate.agg.revenue: sum needs a numeric column ('amount' is object). Add a cast step before aggregate, for example: cast: {mapping: {amount: float}}. Same message with the large-volume engine (DuckDB hands the

step back to pandas instead of raising a Binder Error). count, min, max, first and last still

accept text.

The log action's message was written to the logger only, so hdrctl run did not show it. It is now the

step's output: shown under the step, like the output of a script action, and kept in the run result.

Error messages still in French are in English: transformations (select, rename, cast, filter,
calculate, clean, join, merge, union, script, transpose, aggregate), manifest checks

(clean.case must be none, lower or upper, join.how, cast types), the job runner (Cannot create the source 'raw_orders' (type='csv'), Step 2/3: … instead of Erreur à l'étape 2/3), parameters, .env

files, the MCP workspace guard and the API routes.

###### Added

examples/end-to-end-retail: a master project runs two sub-projects in parallel, then a job and actions

read what they returned. Files only, runs in a few seconds.

#### v0.19.0 — Project triggers and sub-projects

4 November 2026 GitHub release PyPI

Start a project when a file arrives, a table changes, a webhook is called or another project ends — and let one project run another — without an external scheduler or message broker.

pip install -U hydra-etl

##### New features

Project triggers — triggers.yaml

A triggers.yaml file at the project root, seven types:

Type Starts the project when… Parameters received

cron the schedule matches (cron, IANA timezone) —

interval every every —

file a file matching path (glob, **) is added or modified trigger.file, trigger.files

marker a marker file such as inbox/READY appears (removed unless consume: false) —

source_change a job source changes (check: count | max | checksum) trigger.value, trigger.previous

webhook POST …/triggers/{name}/webhook with a valid token none (nothing from the request)

after_project another project ends (on: success | failure | any) trigger.project, trigger.status

Common keys: env, workflows (default: the thread), params (no secret), overlap (skip by default), timeout, retry: {max, delay}, enabled, description. A trigger always runs the project in its own process, under .hydra/run.lock.

hdrctl watch [PROJECT]... [--env] runs the triggers of one or more projects. It prints each trigger and its next run, then every start and end.

hdrctl serve runs the same engine for every project of the Studio list.

hdrctl trigger list | validate | fire <name> | history | token <name> [--rotate]. validate checks workflows, called projects, sources, webhook secrets and refuses after_project loops. Every run is recorded in .hydra/triggers/history.jsonl.

Guarantees:

a trigger still running is not started again (the missed run is recorded as skipped); runs missed while the engine was stopped are not replayed;

triggers.yaml is reloaded without restart; an invalid file keeps the previous triggers running;

a file is taken only once unchanged for debounce (no half-copied file); a file arriving during a run starts the next run;

a source_change measure runs apart from the engine (a slow database does not hold up other triggers); on PostgreSQL, MySQL/MariaDB and SQL Server count and max are a single SELECT COUNT(*) / SELECT MAX(col);

webhook tokens are ${SECRET:…} references, compared in constant time (401 / 404 / 503); keep hdrctl serve on 127.0.0.1 unless an HTTPS reverse proxy stands in front;

first Ctrl+C on hdrctl watch waits for running projects; a second stops at once.

Cron expressions are parsed by Hydra itself (no extra package); tzdata is installed on Windows.

Studio — Project settings › Triggers: triggers with event, environment, next run, running state and last run; a form per type; enable/disable, delete, Run now; create or rotate a webhook token (shown once, with PowerShell and curl calls); run history. An invalid change is not written; the previous file is backed up to ~/.hydra/_backups.

API: GET|PUT /api/projects/{id}/triggers, …/triggers/history, POST …/triggers/{name}/fire, …/{name}/webhook, …/{name}/token.

Sub-projects — type: project step

A workflow of a "master" project runs another project: its thread.yaml, or only the workflows listed. Keys: project (relative path, or ref: a Studio project), env (inherit by default), params, variables, workflows, outputs, isolation (inprocess or subprocess), timeout, overlap (wait, skip, fail).

Nothing is passed implicitly except the environment; the called project keeps its own secrets, and ${SECRET:…} is refused in params and variables.

Checked before anything runs (hdrctl run, --dry-run, workflow validate, Studio Check): project not found or ambiguous, cycles (a → b → a), more than 5 levels. workflow validate prints the tree of called projects.

Results readable by the next steps: {{ project:STEP.status }}, .rows, .duration, .param.NAME.

A called project runs once at a time (.hydra/run.lock, also between processes; a stale lock is taken over).

hdrctl run <project> -w <workflow> (repeatable): run only these workflows.

Studio — Project node: a Projects section in the palette; a cycle is refused with its path; one window sets path, environment, workflows, parameters, outputs, process, timeout and overlap.

Tools

VS Code extension 0.1.8 (type: project) and 0.1.9 (triggers.yaml: the seven types, token as a secret reference only, 8 snippets).

MCP: hydra_project_calls and hydra_project_triggers (read-only).

API: POST /api/projects/{id}/project-step.

##### Patches and fixes

Workflow actions lost the values of environments/<env>.yaml when a required parameter was given at run time (-P, or params of a project step): {{ param:X }} fell back to the defaults while the jobs of the same run used the environment.

hdrctl workflow run refuses project steps that form a cycle, call a missing project or nest more than 5 levels, before anything runs.

An optional {{ env:NAME }} or a parameter without value inside a text becomes an empty string instead of None.

Parameter errors are in English: missing required parameter, unresolved parameter, missing environment variable.

##### Documentation

White paper (FR/EN): 1.4 Sub-projects and 1.5 Project triggers. README and 03-workflows.md updated.

Full changelog: v0.18.0...v0.19.0

#### v0.18.0 — Environments, global variables and secrets per environment

4 November 2026 GitHub release PyPI

One project, several environments: global variables shared by the machine, parameter values and secrets per environment, managed from the CLI or Studio.

pip install -U hydra-etl

##### New features

Global environment variables, shared by every project of the machine: ~/.hydra/env (all environments) and ~/.hydra/env.<env> (one environment), selected by --env / HYDRA_ENV; location HYDRA_HOME. Order, weakest first: env < env.<env> < project .env < job .env < --env-file. When a run switches environment (Studio, API), the variables of the previous one are removed. Workflow actions see these variables and the project .env from the first step.

Secrets per environment: .hydra/secrets.<env> (plain or SOPS-encrypted) wins over .hydra/secrets with --env <env>; sops.file accepts {env}. The .gitignore written by hdrctl init ignores .hydra/secrets.* but keeps secrets.yaml and encrypted files.

--env-file FILE on hdrctl run and hdrctl workflow run: extra variables for one run, above every other layer.

hdrctl workflow run accepts --env and -P/--param.

New commands:

hdrctl env list|show|create|rename|delete|set|unset — environments and global variables; rename and delete also move parameter values and secrets, after a backup to ~/.hydra/_backups/;

hdrctl param list|set|unset — parameters, default value and value per environment;

hdrctl secret list|set|delete — the value is typed hidden or read from stdin, never passed as an argument; list shows names only.

Studio:

active environment selector on the project page and in the editor, used by every run and by the Expression Assistant;

Global settings › Environments: create, rename, delete environments and edit their global variables;

Project settings: tabs Execution order, Parameters (one column per environment) and Secrets (names only).

parameters.yaml accepts the short form name: value (it stopped the run with an internal error).

VS Code extension 0.1.7: schemas and snippets for parameters.yaml, environments/<env>.yaml and .hydra/secrets.yaml.

MCP: hydra_project_settings (read-only; never a secret or variable value); hydra_run_workflow accepts env.

API: /api/global-env; /api/secrets accepts env; inline job and action runs accept env.

##### Patches and fixes

hdrctl run jobs/<job> reads the .env at the project root, not only the one of the job's parent folder.

bash, powershell and python actions without working_dir run in the project root; a relative working_dir is resolved from there. Scheduled and webhook runs started by hdrctl serve used to run in the server's folder, so relative paths failed.

Studio: a project whose .hydra/project.json had no id got the id ""; the id is now added to the file.

Studio: the schedule workflows of a project opened in Studio are planned at once, not at the next start of hdrctl serve.

Studio: runs with no environment selected sent env: "default"; "default" now means no environment.

Full changelog: v0.17.0...v0.18.0

#### v0.17.0 — Secrets masked everywhere, SOPS, window and text_to_rows

4 November 2026 GitHub release PyPI

##### New features

Secrets

Secrets are masked everywhere Hydra shows or keeps text: logs (every logger, step logs, API), error messages, tracebacks, the output of bash, powershell, python and ssh actions, webhook and email log lines, the rollback report and the runs stored by the API. URL-encoded and JSON-escaped forms are masked too. Values sent to connectors, scripts and webhooks are unchanged.

Visibility, as in GitLab: plain (debugging, with a warning), masked (default, [MASKED]) or hidden (lines containing a secret are dropped and counted). Set it in .hydra/secrets.yaml, with HYDRA_SECRETS_VISIBILITY or --secrets-visibility. Values shorter than 4 characters are not masked; a warning names them.

.hydra/secrets.yaml: project secrets settings, with no secret inside, safe to commit (visibility, provider). Unknown keys and providers are reported, never ignored.

SOPS provider (provider: sops; age, PGP, cloud KMS): secrets decrypted in memory on first use; nested keys read as ${SECRET:db.password}. A SOPS-encrypted .hydra/secrets or --secrets-file is detected and decrypted as well.

Provider interface (SecretProvider, register_provider) for external vaults.

Transformations

join with how: cross (cartesian product), guarded by max_rows (default 10,000,000 rows produced): the run stops before the batch that would exceed it.

text_to_rows: one row per value of a text column ("a;b;c" → 3 rows). Options sep, regex, trim, keep_empty, index_column. No input row is lost.

window: window functions that add columns and keep every row in order — rank (row_number, rank, dense_rank), offset (lag, lead), running (cumsum, cumcount, cummin, cummax) and whole-partition (sum, mean, min, max, count, first, last). Runs in DuckDB with the large-volume engine, same results as pandas.

Studio and tools

Expression Assistant: lists the project's parameters (with their value in the active environment), environment variables and, on reference fields, secrets. Double-click or drag an item; Insert writes it into the field. Opens from fx on expressions and from a new {x} button on fields such as paths, host, SQL query, URL or timeouts. Numeric fields accept a reference.

Text to Rows and Window nodes; the Join node offers cross with a Max rows field.

DSL specification: 20 operations. MCP: hydra_list_operations lists them, hydra_explain_error explains the new errors, hydra_check_job warns when a request needs window, text_to_rows or join.

VS Code extension 0.1.6: schema and snippets for the additions.

##### Patches and fixes

Studio: the Script node showed a generic icon in the palette and its dialog.

Studio: the MySQL and PostgreSQL nodes show the official logos; the SQL Server node shows a database icon.

Full changelog: v0.16.1...v0.17.0

#### v0.16.1 — MongoDB schema drift policy now applies

4 November 2026 GitHub release PyPI

##### New features

None.

##### Patches and fixes

MongoDB source: schema.drift_policy now applies. The schema block never reached the connector, and documents were normalised before drift detection, so fail / warn / adapt / ignore had no effect. Now:

fail raises SchemaDriftError naming the field and the document;

warn logs each new field once, plus a summary;

adapt extends the schema;

ignore stays silent.

schema.sample_size is honoured. Regression tests: tests/test_mongodb_drift.py.

Full changelog: v0.16.0...v0.16.1

#### v0.16.0 — engine: key per job, right and outer join in DuckDB

4 November 2026 GitHub release PyPI

##### New features

engine: auto | pandas | duckdb in transformations.yaml (at the root or under transformations:) chooses the engine of a job's global operations; HYDRA_ENGINE still takes precedence. Studio: Engine selector on a job's canvas, kept on round-trips with the YAML files. JSON schemas (Hydra DSL, VS Code extension 0.1.5) updated.

Right and outer join run in DuckDB in the large-volume engine, with the same rows, columns, order and types as pandas; only the columns the following aggregation needs are copied. 20 million rows, right join then aggregation (2 CPUs): 71.8 s / 3.4 GB → 27.7 s / 2.6 GB.

##### Patches and fixes

sort is stable: rows with equal sort keys keep their input order (it already was for several columns, not always for one).

Full changelog: v0.15.0...v0.16.0

#### v0.15.0 — Large-volume engine: 20 M rows in 34 s instead of 113 s

4 November 2026 GitHub release PyPI

##### New features

Large-volume engine (optional: pip install "hydra-etl[duckdb]", which now also installs pyarrow). Above HYDRA_LARGE_VOLUME_ROWS estimated rows (2,000,000 by default), a job with a global operation reads its CSV source with pyarrow and runs aggregate and sort in a temporary on-disk DuckDB database. pandas keeps every other step and stays the default below the threshold.

HYDRA_ENGINE=auto | pandas | duckdb forces the choice.

No silent fallback: a global step DuckDB cannot translate goes back to pandas with a log message; the fast reader hands over to the Python reader with a warning.

Measured on 20 million rows (2 CPUs): 112.8 s / 5.4 GB → 34.3 s / 1.4 GB, identical results.

--profile shows the engine chosen and why.

##### Patches and fixes

DuckDB sums are byte-identical to pandas (compensated, ordered summation), so switching engine never changes a result.

Full changelog: v0.14.0...v0.15.0

#### v0.14.0 — Fallback after a failure, timeout per workflow

4 November 2026 GitHub release PyPI

##### New features

Fallback after a failure (fallback.on_failure: true): a workflow that fails is replaced by its first backup, only if it left nothing published — no load published and no outside action done (except actions marked undo: none), or everything undone by rollback: true. If the backup fails too, the next one in use runs. Otherwise the project stops and says why: ⛔ load_crm: fallback load_crm_backup not started — step 'load1' had already published its data. The replaced run is reported as recovered (CLI ↯, Studio badge replaced by …); the project succeeds if the backup does.

timeout per workflow in thread.yaml (30s, 5m, 1h): beyond it the workflow is stopped at the next step or batch (an all-or-nothing load is cancelled; an action already started finishes) and counts as failed, which can trigger the fallback. Shown by --dry-run, in Studio, in the VS Code schema and in the DSL reference.

hdrctl run --dry-run and Studio's Check warn when a workflow with on_failure publishes in several steps without rollback: true.

Studio — wait field (delay_before) on each workflow of the execution order; the Preview shows the wait above the block, the run page a waited … badge. The run API returns waited on each step.

Studio — Settings has two tabs: Global settings (editor preferences) and Project settings (execution order, fallbacks, loops, written to workflows/thread.yaml).

Studio — the project page lists the workflows with Project settings and Run project (the project is checked first; errors link to Project settings).

##### Patches and fixes

Studio: the run page of a workflow kept by its condition, then replaced after a failure, is shown correctly.

Studio: a workflow opened from the Preview opens on its Workflow configuration tab and returns to Project settings.

Studio asks before leaving the execution order with unsaved changes.

CLI: durations of whole minutes or hours are shown as 5m, 1h.

Full changelog: v0.13.0...v0.14.0

#### v0.13.0 — Fallback workflows, all-or-nothing loads and workflow rollback

4 November 2026 GitHub release PyPI

A failed or risky run no longer leaves half-written data behind: each job loads all or nothing, a workflow can undo what it did, and a backup workflow can take over before the start.

##### New features

Declarative fallback (thread.yaml)

A workflow can declare backup workflow(s): use (tried in order), when (condition checked just before the start) and on_probe_error (keep by default, or replace).

when uses a closed language analysed by Hydra, never Python eval: source_available, destination_available, file_exists, file_size, file_age, url_ok, secret_defined, db.load, previous.status, previous.rows, and/or/not, comparisons, durations (24h) and sizes (5MB).

At run time, quick probes with a time limit (HYDRA_PROBE_TIMEOUT, 15 s) read no data. True → the first backup runs in place (↪ Fallback: a → a_backup — <reason>).

hdrctl run <project> --use-fallback <workflow> forces a fallback to rehearse a recovery.

hdrctl workflow add <name> --fallback-for <workflow>; workflow list shows backups; workflow remove cleans the references.

--dry-run and Studio's Check check backups, their jobs and the sources/destinations named in when, and warn when a backup writes elsewhere.

Studio: fallback editor in Define (condition checked as you type, helper to insert functions and project resources), backups drawn as dashed blocks in Preview, the decision and its reason on the run page.

All-or-nothing load per job

A job writes its destination through one load session (begin → stage → publish | abort), common to every connector. Nothing is visible before the end of the job; a failure or Ctrl+C leaves the destination as it was.

On by default for replace (PostgreSQL / SQL Server: TRUNCATE in one transaction; MySQL / MariaDB: DELETE in one transaction, InnoDB; CSV / Parquet: temporary file then swap) and for CSV / Parquet append.

load.atomic: true | false in destinations.yaml; true on a connector that cannot honour it is an error before anything is read.

Two jobs of the same run writing the same destination take turns.

Workflow rollback

rollback: true in workflow.yaml: if the workflow fails, the steps already done are undone, last first. Files restored, CSV append truncated back, replaced tables restored, rows added by append/upsert removed and changed rows restored (PostgreSQL, MySQL / MariaDB, SQL Server).

Actions declare undo: (an action, or none), required for webhook, email, bash, powershell, ssh, python.

A destination changed by someone else since the run is not undone: the rest is kept in .hydra/undo/<workflow>.json and the workflow refuses to run until hdrctl workflow undo <workflow> finishes it.

Studio: Rollback on/off in the toolbar, Undo section on actions, undone steps on the run page.

Also

delay_before on a workflow: wait before starting it (staggered starts in a parallel stage).

API: GET /api/projects/{id}/conditions, POST /api/projects/{id}/conditions/check; project run steps carry a fallback object.

VS Code schema and DSL reference updated.

##### Patches and fixes

Studio: a job whose operations were written as top-level steps: in transformations.yaml (the form of hdrctl init and the CLI) lost them when saved. Both forms are now read.

A job keeps one connection / one open file for all its batches; Parquet no longer copies the whole file for every batch.

Without all-or-nothing, a failed job logs that the destination keeps the batches written before the failure.

Full changelog: v0.12.3...v0.13.0

#### v0.12.3 — Studio and disk stay in sync, validate counts every error

4 November 2026 GitHub release PyPI

##### New features

Studio and the job files stay in sync, both ways. Studio keeps a job and its jobs/<name>/*.yaml files in step, and the latest change wins, made in Studio or outside (editor, hdrctl, git).

The sync button (Hydra DSL panel, or Sync with disk in the toolbar) compares canvas and files: only the disk changed → the canvas is rebuilt (node positions kept); only Studio changed → the files are written; both changed → the most recent change wins.

Automatic sync of the open job every few seconds (Settings, default 5 s, 0 = off), and when a job is opened.

Formatting and comments are not changes: Studio compares the content.

API: GET /api/jobs/files also returns hashes, hash and mtime.

The Hydra DSL panel buttons show three states: ready, busy (spinning) and unavailable.

/api/health returns studio_build; a tab running an older Studio shows New Studio version — reload.

##### Patches and fixes

Studio no longer loses what the canvas does not edit. A job rebuilt from its YAML and saved again reset batch_size to 1000, dropped fields such as delimiter or encoding, and renamed source/destination keys, which changed pipeline.from/to.

hdrctl validate printed "0 error(s) detected" when the only errors were in pipeline.yaml, in strict checks or a missing file. The total now counts every error shown.

pipeline.yaml is checked the way the engine reads it: old nested format, missing or empty from/to, unknown keys. Same check in hdrctl run <job> --dry-run.

hdrctl run <project> (and --dry-run, Studio's Check and Run project) checks pipeline.yaml of every job used by an active workflow before starting: a broken pipeline.from no longer passes as valid.

hdrctl serve sends index.html with Cache-Control: no-cache, so an update is not hidden by the browser cache.

Connector messages (CSV, JSON, Parquet, PostgreSQL, MySQL/MariaDB, SQL Server) and Studio templates are in English.

Full changelog: v0.12.2...v0.12.3

#### v0.12.2 — Rearrange workflow cards in Studio

4 November 2026 GitHub release PyPI

##### New features

Studio: the workflow cards of a project page can be rearranged by drag and drop. Grab a card by its title and drop it on another card (dashed outline) to swap them. Display only: the order is kept in .hydra/card-order.json and does not change thread.yaml or hdrctl run. API: PUT /api/projects/{id}/card-order.

##### Patches and fixes

None.

Full changelog: v0.12.1...v0.12.2

#### v0.12.1 — Project secrets, execution order in Studio, loops

4 November 2026 GitHub release PyPI

##### New features

Project secrets in .hydra/secrets: one name=value per line, read by ${SECRET:name} in jobs and in workflow action parameters. An environment variable wins over the file (${SECRET:db.password} first reads DB_PASSWORD). Keep the file elsewhere with HYDRA_SECRETS_FILE or --secrets-file on hdrctl run and hdrctl workflow run. Parse errors give the line, never the value.

hdrctl init (and a project created in Studio) writes a commented secrets template and a .gitignore that excludes .hydra/secrets, .env and .env.*.

Studio — Secrets tab in the workflow editor: names only (values never leave the server), add, replace, delete, copy the ${SECRET:name} reference, and see when an environment variable overrides a secret. A plain-text password field offers Move to Secrets. API: GET|PUT /api/secrets, DELETE /api/secrets/{name}.

Studio — Execution order panel on the project page, editing workflows/thread.yaml: stages, sequential/parallel, delay_after, active or skipped workflows, order. Check runs the same checks as hdrctl run --dry-run; Run project runs every active workflow in that order, followed live. API: GET|PUT /api/projects/{id}/thread, POST /api/projects/{id}/check.

Loops in thread.yaml: loops: [{from, to, times, delay}] replays the part of the thread from to to from, times passes in total, with an optional pause. hdrctl run shows (pass i/N); --dry-run lists the loops; the VS Code schema validates them.

Studio — the Execution order panel has two tabs: Define (stages and loops, checked as you type) and Preview (the thread drawn left to right, parallel workflows stacked, delays as diamonds, loops as dashed return arrows ×N).

The demo project has the same layout as hdrctl init, and hdrctl run . runs it whole.

##### Patches and fixes

Studio no longer overwrites changes made outside it. A job attached with hdrctl job attach, or a file edited by hand, was not shown and was erased by the next save. Studio now records a fingerprint of every file it writes: a workflow whose files changed is rebuilt from disk with a notice; a save over a file changed meanwhile is refused (HTTP 409, nothing written), auto-save pauses, and Studio offers Reload from disk or Overwrite with Studio's version.

init no longer creates an empty .hydra/workflows/.

Studio's example paths for CSV, JSON and Parquet destinations point to the project's outputs/.

Full changelog: v0.12.0...v0.12.1

#### v0.12.0 — The project becomes the unit you create and run

4 November 2026 GitHub release PyPI

A project is now the unit you create and run: one command checks it whole, then runs its workflows in a declared order.

##### New features

workflows/thread.yaml: the order in which the project's workflows run. Stages run one after the other; each stage is sequential or parallel, takes an optional delay_after (30s, 5m, 1h), and a workflow can be set active: false to skip it while debugging.

hdrctl run <project> (or hdrctl run .) runs every workflow in the order of thread.yaml. Before starting anything it checks the thread, every active workflow and the job folders they use, and lists every problem found. A failed workflow stops the project (exit code 1); workflows not reached are reported as not run. Without thread.yaml, workflows/*.yaml run in alphabetical order. --dry-run prints the execution plan; --env, -P and the --on-success/--on-failure/--on-finish hooks apply to the whole project.

hdrctl workflow add | remove | list: create a workflow and add it to the thread, delete it (jobs are kept, confirmation unless -y), list workflows in thread order with stage, mode, state and step count, plus workflows missing from the thread and entries without a file.

hdrctl job add | attach | detach | list: create a job from the init templates and attach it to a workflow at a position (-p N), attach an existing job, detach it (the following steps inherit its dependencies, the folder is kept), list free jobs, the workflows that use each job and missing files. Every change is validated before the workflow file is written.

hdrctl workflow run and workflow validate accept a workflow name as well as a file path, and --project.

hdrctl init <path> creates the full project layout: .hydra/, Data/, environments/, jobs/job1/, outputs/ (was output/), parameters.yaml, README.md, scripts/, and workflows/ with workflow1.yaml and thread.yaml.

Studio keeps thread.yaml in step when a workflow is created or deleted.

API: POST /api/jobs/workflow/add, /workflow/remove, /job/add, /job/attach, /job/detach (Postman collection updated).

##### Patches and fixes

A workflow stored in workflows/ did not see the project's parameters.yaml and environments/, so {{ param:X }} stayed unresolved. The runner now finds the project root (the folder holding .hydra/); a python action's file_path is also looked up from there.

The output of a failing python, bash, powershell or ssh action is shown under the step (it was dropped). The error reads Python script exited with code 3: <last stderr line>.

A failed workflow's log line is no longer printed twice on stderr.

Workflow engine messages are in English, like the rest of the CLI.

hdrctl list on a project folder lists its jobs (it answered "No jobs found"), and no longer prints "OK" twice.

hdrctl --help gives each command a one-line description; help texts and hints no longer mention the old hydra command.

Removed: hdrctl workflow init (use hdrctl workflow add), and the incomplete CLI translations that were never loaded. The Spanish translation is now complete.

Full changelog: v0.11.4...v0.12.0

#### v0.11.4 — PostgreSQL upsert fixed, hdrctl init scaffolds a project

4 November 2026 GitHub release PyPI

##### New features

hdrctl init now scaffolds a project, not a bare job folder: jobs/job1, workflows/workflow1.yaml, Data/, output/ and .hydra/project.json, which marks the folder as a Hydra project. The six job templates are unchanged (--template). Run a job with hdrctl run my_project/jobs/job1, or the workflow with hdrctl workflow run my_project/workflows/workflow1.yaml.

A demo project ships inside the package (hydra_etl/samples/hydra-demo), with an endpoint that installs it: a fresh install has something to run without writing any YAML.

The Studio file picker tells a Hydra project from an ordinary folder (is_project), so an existing project opens directly.

##### Patches and fixes

mode: upsert now works on PostgreSQL. Every PostgreSQL upsert failed with KeyError: 0, even with a PRIMARY KEY on exactly the key columns. Two defects in the pre-flight constraint check:

array_agg over a sql_identifier column came back as raw text {col}, so columns were compared character by character;

the RealDictCursor row was unpacked as a tuple, which hid the real error.

The aggregate is now cast to text and the row read by key. New unit tests run without a database (tests/test_postgresql_upsert_key_validation.py).

"Driver missing" errors name the extra to install: pip install "hydra-etl[postgres]", pip install "hydra-etl[mysql]", and the same for MongoDB.

Full changelog: v0.11.3...v0.11.4

#### v0.11.3 — ${SECRET:} placeholders now resolve

4 November 2026 GitHub release PyPI

##### New features

None.

##### Patches and fixes

${SECRET:NAME} now resolves. The CLI built its resolver with an empty secret store, so every ${SECRET:…} placeholder failed with Secret manquant, although the README and the DSL reference documented it. A secret is now looked up in the injected store first, then in the process environment: the name is upper-cased and dots and dashes become underscores, so ${SECRET:db.password} reads DB_PASSWORD. When a secret is missing, the error names the environment variable to define.

Full changelog: v0.11.2...v0.11.3

#### Hydra ETL 0.11.2 - validation no longer lets mistakes through

26 September 2026 GitHub release PyPI

##### Hydra ETL 0.11.2 — validation no longer lets mistakes through

pip install -U hydra-etl

This release fixes a class of bugs that contradicted the core promise of Hydra ETL: validate before you run. Several mistakes in a workflow.yaml were silently ignored, and the run could report success for work that never happened.

###### Fixed

Unknown actions are rejected. A typo such as action: powersheII used to make the step do nothing while the run reported success. hdrctl workflow validate now fails and suggests the closest action (did you mean 'powershell'?), and hdrctl workflow run refuses to start.

Unknown keys are rejected at every level. depend_on: [fetch] (instead of depends_on) used to validate, and the step ran without its dependency. Unknown keys at the top level, under workflow, in steps, trigger and retry are now refused with a suggestion.

Action parameters are checked. Unknown parameters (mesage: under log) and missing required ones (command for bash, url for webhook, script or file_path for python…) are reported by validate, not at 2 a.m.

webhook sends headers. Studio offered the field but the runner ignored it, so an Authorization header was never sent. A text body is now sent as written.

hdrctl workflow run output: no Python traceback on an invalid file, steps that never ran after a failure are listed as skipped, and validation errors are printed one per line.

###### Behaviour change

A workflow that relied on a misspelled or misplaced key being ignored now fails validation. The error names the key to fix or remove:

❌ Invalid workflow:
- steps.1: Step 'b': unknown key 'depend_on' — did you mean 'depends_on'?

Full details: CHANGELOG.md

#### Hydra ETL 0.11.1

26 September 2026 GitHub release PyPI

pip install hydra-etl==0.11.1

###### Added

Hydra Studio offers SQL Server as a source and as a destination. The engine

had the connector since 0.11.0, but the visual editor gave no way to pick it,

so a SQL Server pipeline could not be built there at all.

The form carries host, instance, port, database, schema, user and
password, then table or query as a source, table and mode as a destination.

The port is deliberately not defaulted to 1433 the way MySQL and PostgreSQL

default to 3306 and 5432. An explicit port short-circuits the SQL Browser

lookup, so writing one by default would make named instances unreachable from

Studio — that is, SQL Express, whose instance is named by construction. The

field label says so: leave it empty for a named instance.

Proven end to end: a SQL Server source resolved through SQL Browser, no port

given, loading into a CSV destination.

Full history: CHANGELOG.md

#### Hydra ETL 0.11.0

26 September 2026 GitHub release PyPI

pip install hydra-etl==0.11.0

###### Added

Microsoft SQL Server connector, aliases sqlserver and mssql. Extract with

a table or a query, load in append, replace or upsert mode, with

auto-creation of the target table. Install it with
pip install "hydra-etl[mssql]".

The driver is pymssql, which ships FreeTDS inside its wheels, rather than
pyodbc, which needs the msodbcsql system driver installed separately.

One command, nothing to deploy.

Upsert runs UPDATE then INSERT ... WHERE NOT EXISTS inside a

transaction. MERGE is deliberately not used: its concurrency problems are

documented and many SQL Server teams ban it outright.

Auto-created tables use NVARCHAR rather than VARCHAR and DATETIME2

rather than DATETIME, so accented text and timestamps behave identically

whatever the server's collation.

A named instance is resolved by Hydra itself. pymssql embeds FreeTDS,

which unlike the Microsoft drivers never queries the SQL Browser service, so
MACHINE\\SQLEXPRESS would reach port 1433 and fail — the default setup of

SQL Express, that is, of the audience this connector targets. Hydra sends

the SSRP datagram itself over UDP 1434 and connects on the port it gets

back. An explicit port short-circuits the lookup; a silent SQL Browser falls

back to an error message that says which of the two to fix.

Tested end to end against two live servers: SQL Server 2022 on Windows with

a named instance on a static TCP port, and
mcr.microsoft.com/mssql/server:2022-latest in Docker on Linux. Same major

version on both, so the operating system was the only variable. 74 unit

tests need no server; 11 end-to-end tests are skipped unless
HYDRA_E2E_MSSQL is set.

###### Known limitation

Azure AD authentication and Always Encrypted are out of reach with
pymssql. They need pyodbc and the msodbcsql system driver, which will

be added as an option the day a user asks for it.

Full history: CHANGELOG.md

#### Hydra ETL 0.10.3

26 September 2026 GitHub release PyPI

pip install hydra-etl==0.10.3

###### Changed

The MCP server now speaks English. The instructions of the server and the

descriptions and annotation titles of its 17 tools were in French; they are

what an AI client reads to decide which tool to call, and what MCP

registries publish.

serverInfo reported an empty version. It now carries the package version,

and adds a title and the website URL when the installed MCP SDK accepts

them. The server name is hydra-etl, matching the package.

hydra-mcp --help is in English.

Full history: CHANGELOG.md

#### Hydra ETL 0.10.2

26 September 2026 GitHub release PyPI

pip install hydra-etl==0.10.2

###### Fixed

hdrctl validate --strict now recognises the steps of a transformations.yaml

written as transformations: steps:; it previously reported "none" on the

manifests shipped in examples/.

hdrctl validate --strict checks the syntax of filter and calculate

expressions with pandas' own parser, without evaluating them. An invalid

expression now fails validation (exit code 1) instead of failing at run time.

###### Added

hdrctl workflow run prints what a python, bash or powershell action

wrote on stdout/stderr, under the corresponding step (capped at 20 lines).
StepResult carries it in a new output field.

Full history: CHANGELOG.md

#### HYDRA ETL v0.10.1

17 September 2026 GitHub release PyPI

##### [0.10.1] — 2026-09-17

#### Fixed

hdrctl run no longer ends with "Critical error: TypeError" on Python 3.9 (click 8.1 passed None as verbosity when no -v flag was given).
The mcp extra now installs only on Python 3.10+, so pip install "hydra-etl[all]" works again on Python 3.9.

#### Changed

httpx and requests-mock are declared in the dev extra.
CI now runs on Linux, Windows and macOS, Python 3.9 to 3.13.

This page is built from the GitHub releases.
The detailed history, including unreleased changes, is in
CHANGELOG.md.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Build your first Studio job — slug: /firstjob/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Get started›Build your first job

Hydra Studio quickstart

### Build your first Studio job

Download a working file-to-file example, import it into a blank Studio project, inspect its four manifests, and verify its first execution.

Download the complete example ↓Review project creation

first-project / first-workflow / first-job-exampleabout 20 minutes4 manifests + 1 CSV

#### 1. Download the example

Take the complete archive or download only the files you need. The archive preserves the expected folder structure.

ZIPfirst-job-example.zipFour manifests, input data, and README↓ YAMLsources.yamlDeclares the orders CSV input↓ YAMLdestinations.yamlWrites the cleaned orders CSV↓ YAMLtransformations.yamlFilters, casts, cleans, selects, and sorts↓ YAMLpipeline.yamlConnects source to destination↓ CSVorders.csvTwelve input rows↓

Expected project structure
Studio stores jobs below the project. Keep the input and output folders at project level so the relative paths in the manifests resolve unchanged.

first-project/
├── data/
│ └── orders.csv
├── output/
├── jobs/
│ └── first-job-example/
│ ├── sources.yaml
│ ├── destinations.yaml
│ ├── transformations.yaml
│ └── pipeline.yaml
└── workflows/
└── first-workflow/

#### 2. Integrate the job in Studio

##### 01Create a blank project

###### Actions

Open Hydra Studio.

Create a project named first-project.

Choose the blank or empty project option.

Open the new project.

What you should see
first-project opens without an existing workflow or job.

##### 02Create the first workflow

###### Actions

Create a workflow named first-workflow.

Choose Manual as its trigger.

Open the workflow editor.

What you should see
The header identifies first-workflow and the editor opens on an empty canvas.

##### 03Import the downloaded job

###### Actions

Extract first-job-example.zip.

In Studio, select Workflow configuration.

Open Import, then select Import a job.

Choose the extracted folder that contains the four YAML manifests.

When the browser asks for permission, select Upload.

What you should see
Studio reads the four manifests, creates a job named from the selected folder, and adds it to the project.

[image: Hydra Studio Workflow configuration with the Import menu open on Import a job]

Choose the job folder. The import command expects a folder containing four YAML files.

[image: Browser confirmation asking permission to upload every file from the first-job-example folder]

Allow the folder upload. Confirm only after checking that the selected folder is the extracted example.

Manual alternative
If folder import is unavailable, open Jobs configuration, select the + button, create first-job-example, then paste the four downloaded manifests into their matching Hydra DSL tabs.

##### 04Explore the imported job

###### Actions

Switch to Jobs configuration.

Select the first-job-example tab.

Read the source node, destination node, connecting edge, and validity indicator.

Confirm that Run Job is available.

What you should see
The imported declarations become a two-node graph: src_orders flows to dst_orders_clean, and the header reports Valid.

[image: Imported first-job-example open in Jobs configuration with source and destination nodes connected]

The job after import. The tab at the bottom identifies the imported folder; the canvas shows the pipeline reconstructed from its manifests.

##### 05Explore the four DSL manifests

###### Actions

Select Hydra DSL.

Open Sources, Transformations, Destinations, and Pipeline in turn.

Compare each panel with the downloaded file of the same name.

If a panel is empty or incomplete, paste the matching downloaded manifest.

Save after all four panels match the example.

Downloaded filePaste intoPurpose

sources.yamlSourcesRead orders

destinations.yamlDestinationsWrite cleaned orders

transformations.yamlTransformationsKeep and normalize valid rows

pipeline.yamlPipelineWire src_orders to dst_orders_clean

What you should see
Studio regenerates a source-to-destination graph and the header reports Valid.

[image: Hydra DSL button highlighted above the imported job canvas]

Open the DSL inspector. The four manifest tabs appear in a panel beside the canvas.

[image: Hydra DSL Sources tab showing a CSV source and the relative orders data path]

Sources. Confirm the CSV type, source identifier, and relative path to orders.csv.

[image: Hydra DSL Transformations tab open beside the job canvas]

Transformations. If the tab contains an empty step list, replace it with the downloaded transformation chain.

[image: Hydra DSL Destinations tab showing a CSV destination configuration]

Destinations. Confirm that load.table points to the project output file; an empty value must be replaced.

[image: Hydra DSL Pipeline tab showing source and destination references]

Pipeline. Its from and to values must match the identifiers declared in Sources and Destinations.

##### 06Place the input data

###### Actions

Open the workspace folder used by Studio.

Create first-project/data if it does not exist.

Copy the downloaded orders.csv to first-project/data/orders.csv.

Create first-project/output for the generated result.

first-project/data/orders.csv

What you should see
The input file contains twelve orders and is reachable through ../../data/orders.csv from the imported job folder.

##### 07Run the job

###### Actions

Return to the first-job-example canvas.

Confirm the API is online and the job is valid.

Select Run Job.

Wait for a terminal state before editing anything.

What you should see
The lower execution panel opens and the job moves from pending to running, then to success.

##### 08Verify the execution

###### Actions

Read the terminal status and row counters.

Open first-project/output/orders_clean.csv.

Confirm pending, cancelled, and zero-amount orders are absent.

Open Runs to inspect the persisted execution.

StatusSUCCESS

Rows in12

Rows out8

id,order_date,region,customer,amount
1001,2026-01-04,north,Alice,120.5
1002,2026-01-05,south,Bob,89.0
…
1012,2026-01-14,west,Lea,64.3

###### Tips and traps

Keep the downloaded filenames unchanged so each manifest is pasted into the correct editor.

Paths are resolved from jobs/first-job-example. Moving orders.csv without updating sources.yaml breaks the run.

Wait for Valid before selecting Run Job.

A successful animation is not enough. Confirm the terminal state, counters, and output file.

#### 3. Completion checklist

VerificationExpected result

Projectfirst-project

Workflowfirst-workflow, Manual trigger

Jobfirst-job-example

ManifestsFour files saved and Valid

InputTwelve rows in data/orders.csv

ExecutionSuccess, 12 rows in, 8 rows out

Outputoutput/orders_clean.csv

Review the run →Back to Get started

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## From raw data to a repeatable pipeline — slug: /get-started/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Get started with Hydra

### From raw data to a repeatable pipeline

Hydra turns a data task into a small set of readable YAML files. Describe what enters, what changes and where the result goes—then validate and run the same contract anywhere.

Nothing to install

#### Try Hydra in your browser first

1Guided labs — no account neededKillercoda gives you a Linux terminal inside your browser, with a lesson beside it telling you what to type. Six labs, 10–15 minutes each. Start with Meet hdrctl.

2A full environment, with Hydra StudioGitHub Codespaces opens an editor in your browser, with MySQL already running beside it. Type ./tour and a five-minute walkthrough shows you every command. Needs a free GitHub account.

Your first 30 minutes

#### A short path from reading to running

1Run a complete exampleDownload, integrate and run a complete Studio job.

2Change one decisionExplore valid variants without installing.

3Read the exact grammarUnderstand every manifest block.

01

#### Overview

[image: The Hydra emblem: seven dragon heads growing from a single body, inside a circle.]

HYDRA One body, many heads

##### What is Hydra?

Hydra is an open-source declarative ETL platform. A job connects one source to one destination through an ordered list of transformations. Larger processes combine those jobs in a workflow.

The manifests are the contract. They are readable in a code review, testable before execution and reusable from the CLI, API or Studio.

See Hydra Studio

02

#### The core idea

##### Everything is YAML

YAML is the main language of Hydra: sources, transformations, destinations and workflows are all declared in it. Version them, review them and move them between environments.

##### Declare the outcome

Choose a connector and compose proven operations. Hydra handles batching, execution order and delivery while the business rule stays visible.

##### One path from check to run

Validate the manifest first, execute it through the same CLI and read row counts and step states from the run.

##### Jobs compose into workflows

A workflow is the pipeline of your jobs. Keep each job independently runnable, then add dependencies, schedules, actions and retry policies only where orchestration needs them.

Install HydraGet the CLI, the engine and the Studio — every installation path. →
03

#### Start where you are

CLIHydra CLI tutorialsCreate, validate, run and automate from the terminal.→ UIHydra Studio tutorialsDesign, validate and follow jobs on the visual canvas.→
Data engineersBuild the first file-to-file job, then replace either end with the connector you need. → Platform and operations teamsOrchestrate existing jobs, schedule them and follow every terminal state. →
Three commands to a first run See the CLI
$ hdrctl init my_job
$ hdrctl test my_job
$ hdrctl run my_job -vv

Requires Python 3.9+. The repository install uses pip install -e .
Build the guided example → Explore the language
No Python on this machine?Run the engine, the CLI, the API and the Studio as one container — nothing installed on the host. Step-by-step for Linux, Windows and macOS. → What's new — version 0.22.0Latest release 24 November 2026. Every release of Hydra ETL, with its new features and fixes. →

###### Which connector?

In a manifest, type is the discriminator that selects the connector interpreting the declaration. The outer YAML stays stable; the connector owns connection and extract.

CSVBuilt in

JSONBuilt in

DatabaseSame slot, optional connector

Web APISame slot, optional connector

sources:
src_orders:
type: csv
connection:
base_path: "data/canonical"
extract:
table: orders.csv
Read the full contract →

###### Validate before running

hdrctl test checks the manifests and the connections without writing anything to the destination.

hdrctl test [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml

Example: hdrctl test examples/tutorial/01-first-job
Explore the language →

###### One CLI: hdrctl

The same binary validates and executes. run takes the identical flags as test, plus parameter overrides.

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable
-vv verbose run output

Also available: hdrctl init, hdrctl ls sources, hdrctl run --help.
Run the guided example →
×

#####

×
‹ ›

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Install Hydra — slug: /install/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Get Hydra on your machine

### Install Hydra

Hydra is one Python package on PyPI. A single command installs the engine and the hdrctl command line. The API server, the Studio and the database connectors are extras you add only when you need them.

$ pip install hydra-etl Copy

Requires Python 3.9 or later. Package page: pypi.org/project/hydra-etl

#### Before you start

Python 3.9 or laterCheck with python --version

pip, up to dateRefresh with python -m pip install --upgrade pip

Git — source install onlyNeeded to clone the repository

#### Activate an environment

The one command that differs per terminal

macOS / Linuxsource .venv/bin/activate

Windows — PowerShell.\.venv\Scripts\Activate.ps1

Windows — cmd.exe.venv\Scripts\activate.bat

##### Read this before you run any command

Every command on this page installs software on your machine, with your own rights. Three habits make that safe — here and anywhere else.

Install from a source you can name. On this page that means PyPI for hydra-etl, the Hydra repository on GitHub for the source build, GitHub Container Registry for the image, and astral.sh for uv. Nothing else.

Never pipe a remote script into a shell before reading it. curl … | sh and irm … | iex download code and execute it in the same breath, leaving you no chance to look at it. Open the URL in a browser and read it first — or use a package manager such as brew, winget or pip, which spares you the trade-off entirely.

Check what actually landed. pip show hydra-etl prints the version and the exact install location, so you can confirm you got what you asked for.

#### Installation paths

Pick the one that matches what you need

01

##### The CLI and the engine
AVAILABLE

The default path. Installs hdrctl and the execution engine — enough to write a manifest and run a job on files.

# create an isolated environment, then activate it $ python -m venv .venv
$ source .venv/bin/activate

$ pip install hydra-etl

The virtual environment is optional but recommended: it keeps Hydra and its dependencies away from your system Python.

02

##### With the API and the Studio
AVAILABLE

Adds the HTTP server and unlocks hdrctl serve, which starts the API and the visual canvas. The Studio ships inside the package — no Node, no separate download.

$ pip install "hydra-etl[server]"
$ hdrctl serve

# Studio and API on http://127.0.0.1:5678

Keep the quotes around "hydra-etl[server]": zsh and PowerShell read the square brackets as their own syntax.

03

##### From the repository
AVAILABLE

For reading the connectors, following unreleased changes or contributing. The editable install keeps hdrctl pointed at your working copy.

$ git clone https://github.com/bejaouibechir/Hydra.git
$ cd hydra
$ pip install -e ".[all]"

Editable mode: any change in the source tree is picked up on the next hdrctl call.

04

##### Container image
AVAILABLE

Run the CLI, API and bundled Studio without installing Python or Node. The official image is published on GitHub Container Registry.

$ docker pull ghcr.io/bejaouibechir/hydra:0.9.6
$ docker run --rm -p 5678:5678 -v hydra-workspace:/workspace ghcr.io/bejaouibechir/hydra:0.9.6

Open http://localhost:5678. Your projects remain in the hydra-workspace Docker volume after the container stops.

05

##### With uv, without a virtual environment
THIRD PARTY

uv installs Hydra as a standalone tool: it provisions its own Python, keeps it isolated and puts hdrctl on your PATH. Nothing to activate — the path with the fewest steps to get wrong.

uv is built by Astral, not by the Hydra team. We do not control its releases and cannot vouch for its content. Install it through a package manager you already trust, rather than through the curl | sh bootstrap advertised on its own site.

# 1. install uv once, with the package manager you already use $ brew install uv
# Windows : winget install --id=astral-sh.uv -e # Python present : pip install uv # 2. install Hydra as an isolated tool $ uv tool install "hydra-etl[server]"

If hdrctl is still not found, run uv tool update-shell and open a new terminal.

#### Install with Docker

Hydra Core, CLI, API and Studio in one image

Before you start Install Docker Desktop, or Docker Engine on Linux, and make sure docker version can reach the server.

01

##### Download the image

Use the versioned tag for a reproducible installation.

docker pull ghcr.io/bejaouibechir/hydra:0.9.6 Copy

02

##### Start Hydra Studio

Publish port 5678 and keep projects in a named Docker volume.

docker run --rm -p 5678:5678 -v hydra-workspace:/workspace ghcr.io/bejaouibechir/hydra:0.9.6 Copy

When the container is healthy, open http://localhost:5678. Stop it with Ctrl+C; the workspace volume is preserved.

03

##### Use the CLI on a local project

Mount the current folder at /project. On PowerShell, ${PWD} resolves to your current directory.

docker run --rm -v "${PWD}:/project" -w /project ghcr.io/bejaouibechir/hydra:0.9.6 hdrctl validate . Copy

docker run --rm -v "${PWD}:/project" -w /project ghcr.io/bejaouibechir/hydra:0.9.6 hdrctl run . Copy

04

##### Verify and update

Confirm the packaged CLI, then pull the tag again whenever a new Hydra image is released.

docker run --rm ghcr.io/bejaouibechir/hydra:0.9.6 hdrctl --version Copy

Or build it yourself

The repository builds Hydra Core, the CLI, the API and the Studio into one image on your own machine, with no registry involved. The steps are the same on the three systems — only the shell syntax differs, so each guide gives the commands for that shell.

Install on LinuxDocker Engine, your user in the docker group, then bash GHCR/build-local.sh

Install on WindowsDocker Desktop with the Linux container engine, driven from PowerShell

Install on macOSDocker Desktop; on Apple Silicon the image builds natively for arm64, with no emulation

Image tags. Use 0.9.6 in production or CI so every pull resolves to the intended release. Use latest only when you explicitly want the newest published version.

#### Verify the installation

Run this from any folder except the Hydra source tree

$ hdrctl --version
hydra 0.9.6 | Hydra ETL Framework | Python 3.12.0

$ hdrctl --help

#### What you just installed

One package, four surfaces

CLI

##### hdrctl

Scaffolds, validates, runs and lists your jobs and workflows. Also available as hydra.

ENGINE

##### Execution engine

Reads the manifests, resolves connectors and executes the steps in declared order.

API

##### API server

Serves the same jobs over HTTP so schedulers and services can trigger a run. Needs the server extra.

UI

##### Hydra Studio

The visual canvas, bundled inside the package. Started by hdrctl serve with the server extra.

#### Optional extras

Written as pip install "hydra-etl[name]"

ExtraWhat it addsAdd it when

serverAPI server, scheduler and Hydra StudioYou want the visual canvas or you trigger runs over HTTP

postgresPostgreSQL connectorA source or a destination is a PostgreSQL database

mysqlMySQL connectorA source or a destination is a MySQL database

mongodbMongoDB connectorA source or a destination is a MongoDB collection

duckdbDuckDB connectorYou query files with SQL, or use DuckDB as a local warehouse

parquetParquet read and writeYour files are Parquet rather than CSV or JSON

httpHTTP and REST connectorA source is a web API

allEverything above, in one commandYou are exploring and do not want to pick yet

#### If something goes wrong

The five failures we see most

hdrctl: command not found
The environment is not active, or the terminal still holds an older PATH. Activate the environment, then check which binary answers:
$ which hdrctl # macOS, Linux $ where.exe hdrctl # Windows

The path must point inside your .venv. If it does not, open a new terminal and activate again.

pip says "Requirement already satisfied" and downloads nothing
You are installing into the system Python, not into the environment. The prompt must show (.venv) before you run pip. If it does not, the activation step silently failed — see the next entry.
On Windows, the activation script does nothing or raises a SyntaxError
Each terminal has its own script, and activate is never run through Python. In PowerShell use .\.venv\Scripts\Activate.ps1; in cmd.exe use .venv\Scripts\activate.bat. If PowerShell refuses to run scripts, allow it for that window only:
PS> Set-ExecutionPolicy -Scope Process RemoteSigned

ModuleNotFoundError when hdrctl starts
An older Hydra is installed in your system Python and its launcher shadows the new one. Remove it outside any environment, then open a new terminal:
$ pip uninstall hydra-etl

Nothing works when I test inside the Hydra source folder
Python imports the local hydra_etl/ directory instead of the installed package, so you are never testing what your users get. Run the verification from any other folder.

#### Once installed

Create a Hydra project→The CLI reference for creating a project. Build your first job→CSV in, two operations, CSV out — the complete guided example. Read the grammar→Every manifest block, field by field.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## License — slug: /license/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

### License

Hydra ETL is open source under the
GNU Affero General Public License v3.0 or later
(AGPL-3.0-or-later).

#### You can, for free

Use Hydra ETL for any purpose, including inside a company and for commercial work.

Run your own pipelines with it, internally or for clients.

Modify it and redistribute it.

Using Hydra ETL to move your data does not place your data, your YAML pipelines or your other
applications under the AGPL.

#### The one obligation

If you modify Hydra ETL itself and make it available to others — including over a network,
for example as a hosted service — you must publish your modified source code under the same license.

#### Commercial license

If that obligation does not fit your case — typically, you embed a modified Hydra ETL in a proprietary
product, or offer it as a service without publishing your changes — a commercial license is available.

Contact: admin@hydraetl.com — reply within two business days.

#### Questions we are often asked

We run Hydra ETL on our own servers to load our own warehouse. Nothing to publish. The AGPL applies to Hydra ETL's source code, not to the data it moves.

We wrote our own connector for internal use only. Nothing to publish, as long as it is not distributed or exposed to third parties over a network.

We ship a product that bundles a modified Hydra ETL. Either publish your changes under the AGPL, or take a commercial license.

This page summarises the license in plain language; the
LICENSE file
is what applies. It is not legal advice.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Where Hydra ETL fits in your data stack — slug: /migrate/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Compare & migrate

### Where Hydra ETL fits in your data stack

Choose the tool you already use. Each guide answers what overlaps, where the products differ, and how to try Hydra without interrupting an existing pipeline.

Python ELT library

#### Hydra vs dlt ↗

dlt is a Python-first library for extracting, normalizing and loading data. Hydra is a YAML-defined ETL engine with explicit transformations and workflows. Both move data; the better fit depends on whether your team wants Python sources and automatic schema handling or reviewed declarative jobs.
Visual data integration

#### Hydra vs Talend ↗

Talend Studio builds data integration Jobs from linked components. Hydra defines jobs in YAML and runs built-in ETL steps. Talend is stronger when its component ecosystem and visual mappings are essential; Hydra suits smaller pipelines that a team wants to review as text.
Warehouse transformation

#### Hydra vs dbt ↗

dbt transforms data in a warehouse using SQL models and provides tests, documentation and lineage features. Hydra moves and transforms data across sources and destinations. They overlap for simple transformations, but often work better together: Hydra can prepare or load data while dbt retains warehouse models and tests.
Data replication

#### Hydra vs Airbyte ↗

Airbyte specializes in connector-based replication from sources to destinations. Hydra defines ETL jobs with transformations and workflows. Airbyte can keep owning difficult ingestion while Hydra processes its output; replacement only makes sense for sources Hydra supports and after sync semantics are checked.
Composable ELT project

#### Hydra vs Meltano ↗

Meltano composes extractors, loaders and utilities such as dbt and orchestrators. Hydra provides an ETL engine and YAML jobs in one project. They can coexist: keep Meltano/Singer plugins for ingestion, then use Hydra for a bounded transformation or workflow.
Workflow orchestration

#### Hydra vs Airflow ↗

Airflow is a general workflow orchestrator, not an ETL engine. Hydra includes ETL jobs and workflow orchestration. Compare their orchestration only: Airflow is strong for diverse operators and complex DAG operations; Hydra suits ETL-focused workflows where jobs and actions can live in one project.
YAML orchestration

#### Hydra vs Kestra ↗

Kestra and Hydra both describe workflows in YAML. Kestra is a broad orchestration platform with tasks and triggers; Hydra combines ETL jobs with workflows. For ETL-heavy projects compare the whole data path, not only how short the YAML looks.
Declarative Spark ETL

#### Hydra vs Flowman ↗

Flowman and Hydra both use declarative YAML for ETL. Flowman builds data flows on Apache Spark; Hydra executes supported ETL jobs through its own engine. Flowman is the better fit when distributed Spark computation is required. Hydra is worth evaluating for smaller file and database workloads.
Asset-oriented orchestration

#### Hydra vs Dagster ↗

Dagster organizes data workflows around software-defined assets, jobs, schedules and sensors. Hydra defines ETL jobs and workflow steps. Dagster is a stronger choice when asset lineage and materialization history are core requirements; Hydra can simplify a bounded source-to-destination ETL chain.

How these guides are made
Each comparison has a specific scope, cites product documentation, distinguishes overlap from limits, and offers a browser-local example. The simulator is a teaching aid, not an engine run or an independent benchmark.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra ETL vs Airbyte — slug: /migrate/airbyte/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All comparisons
Compare with Hydra ETL
Explore Hydra CLI ↗

Compare & migrate/Airbyte

Product comparison · Data replication

### Hydra ETL vs Airbyte

Airbyte specializes in connector-based replication from sources to destinations. Hydra defines ETL jobs with transformations and workflows. Airbyte can keep owning difficult ingestion while Hydra processes its output; replacement only makes sense for sources Hydra supports and after sync semantics are checked.

Scope: Airbyte connection and sync compared with a Hydra batch ETL job. Reviewed 17 November 2026

Comparison Simulator Migration & integration

01 / Compare

#### Where the tools overlap and diverge

Short answer
Airbyte specializes in connector-based replication from sources to destinations. Hydra defines ETL jobs with transformations and workflows. Airbyte can keep owning difficult ingestion while Hydra processes its output; replacement only makes sense for sources Hydra supports and after sync semantics are checked.

Product contextCapabilitiesDetailed analysisTechnical evaluationWorked exampleDecision20 questions

##### What Airbyte does, and what Hydra changes

Airbyte’s central unit is a connection between a configured source and destination. The connection selects streams, sync modes, schedules and schema propagation behavior. Hydra’s central ETL unit is a job that reads a supported source, applies transformations and writes a destination; project workflows can sequence jobs and actions. Those models meet at the landing zone, but they should not be treated as identical products.

Airbyte is often retained for a specialized SaaS connector or CDC stream. Hydra can begin after Airbyte writes a raw table or file, where it casts, filters, joins or aggregates data for a second destination. A full connector replacement is a much higher bar: the new path must reproduce incremental cursor behavior, deletes, normalization, schema changes, retries and monitoring. A first pilot should deliberately avoid a high-value CDC feed.

The simulator’s CSV fixture is only a transformation exercise. It cannot model Airbyte connector availability, replication checkpoints or sync modes. The comparison below separates ingestion from downstream ETL so teams can decide where coexistence is useful and where a connector migration is genuinely justified.

##### What both can do

Configure sources and destinations

Repeat data movement

Observe run outcomes

##### Key differences

AreaAirbyteHydra ETL

Primary roleConnector-driven replicationETL transformations and workflows

Connector choiceLarge source and destination catalogUse only supported Hydra connectors

TransformationReplication with typing/deduping; dbt integration in some editionsTransformation steps inside the job

Sync stateConnection sync modes and resumabilityJob load modes and run behavior; test equivalence

##### Detailed comparison for a production decision

###### Connectors and source-specific behavior

Airbyte connector configuration can include API authentication, pagination, stream selection and source-specific state. A Hydra source declaration is concise when a supported connector covers the requirement, but “both read APIs” is not evidence that a particular SaaS source behaves the same. Connector maturity and operational support are part of the decision.

Inventory the exact Airbyte source and destination versions, selected streams and fields, and whether the connector is managed or self-hosted. If any part of the source is not supported by Hydra, keep Airbyte as the extraction layer and add Hydra after the landing table. That hybrid design avoids rewriting a reliable connector to improve a downstream transformation.

Product documentation: Airbyte core concepts ↗

###### Full refresh, incremental and CDC

Airbyte sync mode has two sides: how the source is read and how the destination is written. Incremental reading can use a cursor or CDC, and the first incremental run is generally a full load. Hydra load modes describe the destination side of a job; they do not automatically supply Airbyte’s source checkpoints or deletion semantics.

Build a test matrix that includes initial snapshot, new row, updated row, deleted row, connector restart and schema change. For CDC, also inspect transaction ordering and how the source database log is retained. A replacement that matches the initial table but loses deletes or late updates is not equivalent.

Product documentation: Airbyte sync modes ↗

###### Landing-zone contract

An Airbyte connection may write raw or typed tables depending on destination and configuration. Hydra should read a named, stable relation or file, not an undocumented intermediate that a connector upgrade may change. Give the handoff an owner: schema, completion signal, retry policy and the moment when downstream readers may start.

For a coexistence pilot, keep the Airbyte connection active and point Hydra at a separate staging read or copied snapshot. After each sync, compare Airbyte’s stream count and the Hydra output count by business key. If Airbyte retries a sync, make sure the downstream Hydra load mode does not duplicate already processed rows.

Product documentation: Airbyte core concepts ↗

###### Transformation and quality responsibilities

Airbyte primarily replicates data, with typing and deduplication features depending on destination and edition. Hydra can apply in-job transformations, but it should not be credited with Airbyte’s connector reach. Define which tool casts, deduplicates and filters each field to avoid applying the same rule twice.

If dbt already transforms Airbyte output, the professional comparison is three-way: Airbyte ingests, dbt models, and Hydra could replace only a bounded part. A Hydra introduction should simplify a real handoff or add a needed output, not create another opaque stage with no clear quality contract.

Product documentation: Airbyte core concepts ↗

###### Scheduling and observability

Airbyte can schedule syncs or start them manually or by API. Hydra can run jobs under its own project workflow. Leaving both schedules enabled for the same destination can create duplicate writes, conflicting retries and ambiguous incident ownership. Decide which system initiates the chain before cutover.

Record connection ID, sync job ID, Hydra run ID and input batch identifier together. When a downstream transformation fails, the operator must know whether to rerun only Hydra or to repeat the Airbyte sync. That decision depends on whether the Airbyte landing output is immutable and whether the Hydra destination load is idempotent.

Product documentation: Airbyte sync schedules ↗

##### Technical evaluation: Airbyte and Hydra ETL in production

###### An Airbyte connection is a replication contract

An Airbyte connection ties a configured source to a destination and selects the streams and sync behavior. It may replicate dozens of tables at different grains, so replacing “Airbyte” with one Hydra job is rarely a meaningful unit of work. Inventory the actual connection, source connector version, selected streams, destination namespace and schedule. For each stream, record primary key, cursor, sync mode and whether the consumer reads a raw table or a typed final table. These details determine whether Hydra can replace, complement or should leave the connection intact.

Select one stream for a first Hydra pilot. Use a frozen source snapshot and a separate target schema. Compare the source records requested, the destination rows written and the metadata Airbyte adds. If the connection contains a specialized SaaS connector, keep Airbyte for ingestion and introduce Hydra after the landed table. If it is a supported file or SQL path, a direct Hydra replacement may be feasible, but the decision must come from connector behavior and repeated-run tests.

Further reading: Airbyte core concepts ↗

###### Read mode and write mode must be evaluated separately

Airbyte sync modes combine a source-read choice, such as Full Refresh or Incremental, with a destination-write choice such as Append, Overwrite or Append Deduped. Hydra append, replace and upsert primarily describe target writes. Equating Airbyte Incremental Append Deduped with Hydra upsert loses the extraction cursor and possibly the history table. A professional comparison separates what the source connector reads from what the destination connector publishes.

Create an input timeline: first snapshot, updated record, new record, deletion and replay of the same batch. Run the configured Airbyte stream and inspect both raw history and final table. Run the proposed Hydra job with an explicit source selection strategy and compare keys and values after every event. Record whether the target represents history or current state. Only then can a migration guide recommend an equivalent load mode or conclude that Airbyte must keep the replication stage.

Further reading: Airbyte sync modes ↗

###### CDC is more than an updated_at filter

For supported database sources, Airbyte change data capture can read a database log position after an initial snapshot and follow inserts, updates and deletes. A timestamp query is not automatically equivalent: deletes may leave no row to query, multiple updates can share a timestamp and transaction ordering may matter. The Hydra proposal must either preserve Airbyte CDC upstream or design and test another mechanism with the same event coverage. A destination upsert alone cannot reproduce a source log.

Test the candidate against a source table with one insert, two updates and a delete, including a transaction committed while a sync is interrupted. Compare the final table and any history or tombstone representation. Note Airbyte’s CDC metadata fields and whether downstream transformations use them. If the business requires deletion propagation, keeping Airbyte CDC and letting Hydra transform the stable landed table is often the lower-risk integration. State this boundary explicitly instead of presenting Hydra as a generic CDC substitute.

Further reading: Airbyte CDC ↗

###### Deduplication depends on a key and cursor

Airbyte Incremental Append Deduped stores incoming changes and builds a final view with one current row per primary key, ordered by the cursor. Hydra deduplicate or upsert behavior needs to be evaluated against the same rule. A row with a null key, two changes at the same cursor value or a late correction can produce different winners. Comparing only row counts would miss a wrong current value. The source-defined primary key and cursor must be recorded before translation.

Build a five-record fixture with two versions of one key, an unrelated key, a duplicate cursor and a late older version. Inspect the raw and final Airbyte tables, then the Hydra target. Document tie-breaking, null handling and deletion markers. If downstream consumers rely on Airbyte’s history table for audits, a Hydra current-state target is insufficient even when the final view matches. The correct design may preserve Airbyte replication and add Hydra only for the subsequent business transformation.

Further reading: Airbyte incremental append deduped ↗

###### Connector breadth is a product capability, not a fixture result

Airbyte’s value often comes from a particular connector that understands an external API, authentication method, incremental cursor or schema discovery process. The 14-row CSV simulator on this site shows a Hydra transformation path; it cannot prove that a specific Airbyte source connector has a Hydra equivalent. For a credible migration analysis, name the exact source product and destination product, then compare required operations at that connector boundary.

Inspect OAuth refresh, pagination, rate-limit behavior, deleted-record handling, nested objects and connector upgrade policy. Test the real endpoint with a low-privilege credential and count API requests and records. If Hydra’s connector does not cover the behavior, Airbyte can remain the extraction layer. If the path is a standard supported database or file source, a Hydra replacement can be judged on simpler terms. Record the result per connector and version rather than generalizing to every Airbyte source.

Further reading: Airbyte core concepts ↗

###### Schema propagation can change destination contracts

Airbyte can detect source schema changes and apply a configured propagation policy. Connector upgrades can also change field types, stream shape or destination formatting. A Hydra job may instead use explicit schema and drift controls. The migration question is not whether both mention schema evolution; it is who approves a new column, whether existing columns change type and what happens when a consumer expects the prior relation.

Prepare a controlled source change: add a nullable column, rename a field and change a number to text. Record the Airbyte connection setting, sync outcome and destination DDL for each. Repeat with the Hydra proposal and compare both the run result and physical schema. Include an alert or review step for breaking changes. If a source connector version change requires a full refresh, document how that refresh interacts with Hydra’s downstream target and whether it invalidates a watermark.

Further reading: Airbyte schema change management ↗

###### A stable raw landing layer is the easiest integration point

A team already operating Airbyte can gain Hydra transformation capabilities without replacing replication. Let Airbyte continue syncing into a raw schema, then configure Hydra to read one stable typed table or export and write to a separate published schema. This boundary is easier to reason about than adding a transformation inside a connector because the upstream sync state remains intact. Record the expected table name, batch freshness, column types and the signal that the sync completed successfully.

The scheduler should start Hydra only after Airbyte has committed the relevant stream. A fixed clock delay is weak because sync duration varies; use a completed-run signal or an explicit orchestration dependency. Give both stages a shared batch identifier and keep their logs linked. Test a failed sync, a successful sync with zero new rows and a failed Hydra load. The downstream consumer should never read a half-written table or mistake a skipped sync for fresh data.

Further reading: Airbyte core concepts ↗

###### Avoid two writers on the same destination table

During a replacement pilot, Airbyte and Hydra should write to different targets. If both write to the same table, a matching row count cannot identify which system produced a row, and concurrent append or overwrite operations can damage the comparison. Use a side-by-side schema with identical column definitions and business keys. Compare deterministic row hashes and update outcomes after each run, including a rerun of the same input interval.

At cutover, choose one owner for the destination. Document the exact moment the old Airbyte schedule is disabled, the last cursor or log position it processed and the first interval Hydra will read. Keep the Airbyte connection and state available for rollback. If the source is mutable, an immutable snapshot or a transactionally consistent export is necessary for a fair parallel comparison; otherwise differences may be caused by source changes rather than either engine.

Further reading: Airbyte sync modes ↗

###### Recovery testing must distinguish sync and transform failures

A pipeline with Airbyte followed by Hydra has two failure domains. The Airbyte connector may fail while extracting, while Hydra may fail after reading a completed landing table or during destination loading. Retrying the whole chain by default can repeat a successful sync and create unnecessary source traffic. Define a replay rule for each stage: what is idempotent, what state is preserved and which output can be safely regenerated.

Force three failures: source authentication denied, destination unavailable during an Airbyte sync, and Hydra transformation validation failure after a completed sync. Observe run status, state advancement and target rows. The operator runbook should say whether to rerun Airbyte, rerun only Hydra or restore a previous target. This is essential for teams asking how to integrate Hydra with Airbyte, because a functioning happy-path demo says little about production recoverability.

Further reading: Airbyte CDC ↗

###### Replacement decisions should be made stream by stream

A single Airbyte deployment may contain database CDC, SaaS APIs and ordinary file imports. The right Hydra role can differ for every connection. Classify each stream as retain Airbyte ingestion, integrate Hydra after landing, or evaluate a full Hydra replacement. Support that classification with connector requirements, incremental state behavior, schema policy, target contract and an operating-cost estimate. A blanket claim that one platform replaces the other is not technically useful.

For the chosen stream, save a decision record with the source and destination versions, sync mode, primary key, cursor, pilot fixture, output diff, failure drill and rollback command. A reviewer should be able to see why Hydra is introduced and which behavior remains Airbyte-owned. The conclusion should identify the conditions that would change the decision, such as a new Hydra connector, a source API change or a downstream need for history rather than current-state data.

Further reading: Airbyte sync modes ↗

##### Worked evaluation: customer replication with CDC

Consider an Airbyte connection that copies a customers table from PostgreSQL to a warehouse using incremental CDC and a deduplicated final table. The source logs inserts, updates and deletes; Airbyte remembers its log position and writes metadata alongside the records. Before proposing a Hydra replacement, capture the connection version, stream selection, primary key, sync mode, cursor or CDC state and the exact table the analytics team queries. A 14-row CSV simulation cannot answer whether a source log will be read or a deletion propagated.

Create a controlled sequence: insert customer 10, update the name, insert customer 11, delete customer 10 and pause the source during a sync. Run the current Airbyte connection and inspect raw history, final table and state after each event. A Hydra candidate can either read the Airbyte-landed table for a downstream transformation or attempt direct source extraction. In the direct variant, specify how it will observe the delete. A full table read plus replace might reproduce current state at a small scale; an updated_at query plus upsert will not automatically do so.

Use separate destination schemas. Let Airbyte continue writing its current target while Hydra writes a trial target from the same consistent source interval. Compare final keys and values, deleted-record behavior, column types and metadata needed by downstream consumers. Include a new nullable source column and a type change to test schema propagation. Record both pipeline status and physical DDL. If a new field appears in the Airbyte final table but is rejected or silently dropped by the Hydra job, the difference needs an explicit approval or redesign.

For the integration variant, the orchestration boundary is the completed Airbyte sync. Hydra should start only after that signal and read a stable landed relation. A sync failure must block the transformation; a Hydra failure should allow Hydra alone to retry without resetting the Airbyte connection state. Tag both runs with a shared batch ID and keep the raw and published schemas separate. Test an empty incremental sync and a sync that runs longer than normal so a fixed clock delay is not mistaken for a reliable dependency.

For the replacement variant, interrupt the destination after partial writes and restart both implementations. Check whether the source position moves and whether the final table contains duplicates or misses a delete. The candidate is acceptable only if the selected stream’s connector, state, schema and recovery contract are met. An Airbyte connector that handles a specialized SaaS API may remain essential even when Hydra is a better place for the downstream business transformation.

The decision record should classify this customers stream as retain, integrate or replace, with evidence from the insert-update-delete sequence. Keep the Airbyte connection and state during the Hydra pilot. At cutover, disable one writer, record the last log position or cursor and reconcile the interval before enabling the new target. If rollback is needed, restore consumers to the Airbyte final table and resume from preserved state. The verdict applies to this stream and its CDC configuration; another connector may require a different boundary.

Related product documentation: Airbyte CDC and sync modes ↗

##### Decision criteria for an existing Airbyte deployment

The final Airbyte review should be performed per stream. A connection may mix full refresh tables, incremental cursors and CDC streams; one Hydra plan may be appropriate for only one of them. For each stream, list the source connector version, selected fields, primary key, cursor, sync mode, deletion policy and consumer table. Mark whether Hydra will read the original source or the Airbyte landing layer. That table of ownership is the practical answer to “Airbyte versus Hydra” for an existing deployment.

Cost analysis should include API request limits, replication volume, raw-history retention and the extra storage created by a parallel Hydra pilot. Avoid reading a production API twice without checking its rate and quota limits. Where possible, compare against a frozen export or a database snapshot. If the real source must be queried by both systems, schedule the tests so each sees the same interval and record requests made. A low line count in the simulator says nothing about connector reliability or consumption cost.

When a stream is kept in Airbyte, make the handoff stable: one completed sync, one landed table contract, one Hydra transformation owner and one published target. When replacement is chosen, preserve Airbyte state and target through the observation window. Report the insert-update-delete test and failure drill with keys and values, not just a green status. These details let a technical reader assess whether the proposed Hydra role is safe for their own replication workload.

The published comparison should specify whether downstream readers use Airbyte raw history or the typed final table. Those are different contracts under deduplicated sync modes. If Hydra reads raw records, it must account for update and deletion metadata before calculating business metrics. If it reads the final table, it should wait until the sync has committed that view. A source update that arrives during the handoff is an important test because it reveals whether the ETL job processed a coherent snapshot or a mixture of versions.

##### Where each approach fits

##### Keep Airbyte when

Keep Airbyte for specialized SaaS connectors, CDC and existing replication contracts.

##### Evaluate Hydra when

Use Hydra on a downstream transformation or a simple supported file/database transfer.

##### Should you replace Airbyte with Hydra ETL?

Keep Airbyte for specialized SaaS connectors, CDC and existing replication contracts. Use Hydra on a downstream transformation or a simple supported file/database transfer. For a first test, document the Airbyte stream, sync mode, cursor and destination schema. See the complete integration plan.

##### Frequently asked questions about Airbyte and Hydra ETL

These answers cover product fit, data movement, orchestration, migration testing and rollback. Check the linked product documentation for version-specific behavior.

Can Hydra replace an Airbyte connector?
Only when Hydra supports the exact source, destination and sync semantics required. Airbyte’s specialized connector catalog is often a reason to keep it and use Hydra downstream instead.

How it works: An Airbyte connector may understand source-specific authentication, pagination, cursor state and schema discovery. Hydra can replace it only when its supported connector covers the exact source and destination behavior. Matching a generic connector category or producing the same first table is insufficient.

Practical check: Record the Airbyte connector and version, stream selection, auth method, cursor, primary key and sync mode. Test the same source snapshot through a Hydra staging target. Include an updated row, deletion, schema change and interrupted request. Compare source requests and destination keys after more than one run.

Pitfall to avoid: Avoid a broad “Airbyte replacement” claim from a CSV example. A specialized SaaS connector may be the reason the current pipeline works. If Hydra cannot reproduce one required source behavior, keep Airbyte for replication and introduce Hydra after its landed table instead.
Can Airbyte feed Hydra?
Yes. Airbyte can write a stable table or file and Hydra can read it after the sync completes. Define a completion signal and let one scheduler own retries so an ETL failure does not automatically repeat ingestion.

How it works: Airbyte can land a raw or typed table that a Hydra database source reads. The handoff works when the upstream sync has completed, the table schema is stable and one orchestrator owns the sequence. Hydra can then apply supported transformations and publish a separate destination.

Practical check: Name the Airbyte stream, final table, freshness marker and batch ID. Configure Hydra to read a completed snapshot and write to an isolated schema. Test a successful sync, empty sync and failed sync; Hydra should start only after an appropriate success signal. Link the two run reports for support.

Pitfall to avoid: A same-time schedule does not guarantee Hydra reads the new Airbyte batch. Avoid reading a raw table while Airbyte is still writing or assuming it has the same columns as the typed final table. Keep one writer per published target and define retry boundaries.
Is Hydra upsert the same as Airbyte incremental sync?
No. Airbyte incremental sync controls source extraction state; Hydra upsert controls destination writes. Both sides must be tested with new, changed, late and deleted records.

How it works: Airbyte incremental sync controls which records the source connector extracts, often by cursor or CDC. Hydra upsert controls how already-extracted records update destination keys. These solve different parts of the pipeline. An upsert can be perfectly configured while a changed source row is never read.

Practical check: Run a first snapshot, update an existing key, insert a new key and delete another. Compare Airbyte state and emitted records with the proposed Hydra source strategy, then compare final rows. If Hydra uses a full read, measure its cost; if it uses a watermark, test late data.

Pitfall to avoid: Do not translate Incremental Append Deduped to “upsert” without accounting for history, cursor and delete semantics. A matching final row count can hide an old value or missing tombstone. Record source position separately from target key behavior and verify both after a failed run.
What should be done with CDC streams?
Keep CDC in Airbyte during the first Hydra pilot. If considering replacement, test initial snapshot, updates, deletes, transaction ordering and recovery after interruption. A static CSV comparison cannot establish CDC parity.

How it works: Airbyte CDC can read database log positions after an initial snapshot and propagate inserts, updates and deletes for supported sources. A periodic Hydra query using updated_at may see inserts and updates yet miss deletes entirely. CDC also has state and metadata that downstream tables may use.

Practical check: Keep Airbyte CDC upstream unless a fully specified alternative is tested. Build an insert-update-delete fixture, pause and resume replication, then inspect raw and final tables plus log position. If Hydra reads the landed table, check whether deletion metadata is resolved before transformation and whether each batch is committed.

Pitfall to avoid: Do not assume a target upsert recreates log-based capture. A deleted source row is absent from an updated_at query. Also test schema additions and a log retention gap; a full resnapshot may be necessary. Retain the Airbyte connection state during any Hydra pilot.
How do I prevent duplicate loads?
Assign one owner for the schedule, use a stable batch or sync identifier, and choose a destination mode that is safe to retry. Turn off the old schedule only after the new sequence has been validated.

How it works: Duplicate loads can arise from source replay, two schedules, shared targets or retries after a partial write. Airbyte’s state and sync mode govern extraction and destination behavior; Hydra’s source selection and load mode govern its stage. Both need an idempotency strategy.

Practical check: Use distinct target schemas, a shared batch ID and a stable primary key. Execute the same batch twice, then fail a destination midway and retry. Count rows by key and compare values, not only total rows. Disable one production writer before cutover and record the last completed source interval.

Pitfall to avoid: Avoid concurrent Airbyte and Hydra writes to one table. An append target can duplicate replayed rows even when the upstream state is correct. A full-chain retry after only Hydra failed may also repeat Airbyte requests. Assign one owner for retries at each boundary.
Should Hydra read an Airbyte raw table?
Only if the raw table’s schema and lifecycle are understood. A typed or explicitly exported staging relation may be safer than relying on an internal layout that could change with connector or destination settings.

How it works: An Airbyte raw table can contain history records, JSON payloads or metadata, depending on connector and destination. The typed final table may apply normalization or deduplication. Hydra can read either through a supported connector, but the chosen layer changes transformation responsibility.

Practical check: Inspect actual DDL and five representative rows from raw and final tables. Identify primary key, cursor, deletion marker and ingestion timestamp. Define the Hydra source schema against the chosen layer and compare results after an update and delete. If using raw history, write explicit current-state selection rules.

Pitfall to avoid: Do not point a Hydra job at a raw table assuming one row per business key. Aggregates may double-count updates. Conversely, reading only the final table can remove history needed for audits. Name the exact relation and contract in the handoff document.
Can Airbyte and dbt remain alongside Hydra?
Yes. Airbyte can ingest, Hydra can handle a bounded ETL step or delivery, and dbt can keep warehouse models and tests. Document the handoff contracts and avoid two systems applying the same cleaning rule.

How it works: Airbyte can continue replication, Hydra can perform supported ETL and dbt can model the resulting warehouse relations. Each stage adds a useful capability only if its input and output boundary is explicit and a single orchestrator orders the stages.

Practical check: Use Airbyte completion as the trigger for Hydra, verify Hydra’s published table, then run dbt build and tests. Pass a batch ID across stages and retain all three run statuses. Test failure at each stage and confirm the next stage does not publish from stale data.

Pitfall to avoid: Do not run three independent 06:00 schedules or allow both Hydra and dbt to own the same final relation. A failure in Airbyte should not silently be treated as an empty successful batch. Define who retries each stage and which target remains visible to consumers.
How should schema changes be evaluated?
Run fixtures with added, removed and type-changed fields. Inspect Airbyte schema propagation, Hydra source validation and the final destination schema. A successful sync does not guarantee downstream consumers still see the expected types.

How it works: Airbyte can detect and propagate source schema changes according to connection settings. Hydra has its own schema and drift handling. A schema change can affect raw payloads, typed final tables and downstream transformations differently, so the comparison needs physical DDL and row values.

Practical check: Add a nullable field, rename a field and change a numeric type in a controlled source. Run Airbyte with its current propagation policy and inspect both tables. Run the Hydra candidate against the resulting data and a separate target. Record whether each stage accepts, warns, rejects or changes the published schema.

Pitfall to avoid: A green sync can leave Hydra failing on a cast, while a green Hydra run can omit a newly added field. Do not rely on row counts alone. Also account for connector upgrades that alter stream or destination format; pin versions during the pilot.
Does the simulator compare connector performance?
No. It runs no Airbyte connector and no Hydra engine. It uses local sample rows to explain one transformation and cannot measure throughput, cost or recovery behavior.

How it works: The simulator runs a small browser-side data example, not an Airbyte connector or the Hydra runtime. It cannot exercise OAuth, API pagination, CDC, state checkpoints, typing, deduplication or destination network behavior. Its line counts describe only the displayed snippets.

Practical check: Benchmark the selected connector with the same source snapshot, destination class and representative volume. Record API requests, bytes moved, sync duration, errors, schema changes and final rows. Repeat with an update and failure. Publish conditions with any performance claim so the result can be reproduced.

Pitfall to avoid: Avoid treating a shorter YAML file as evidence of faster replication or lower operating cost. The expensive work may be in a connector, network or warehouse. Do not extrapolate 14 CSV rows to a production CDC stream or specialized SaaS API.
What is the rollback path?
Keep the Airbyte connection and its state unchanged, stop the Hydra step and restore the previous downstream target. Re-run only the necessary downstream processing; resetting the Airbyte source cursor may create duplicates.

How it works: Rollback relies on preserving the Airbyte connection, its source state and the previous published table while Hydra runs separately. Restoring a schedule without reconciling the source interval can duplicate or miss records. A distinct Hydra target makes consumer reversal safer.

Practical check: Record the last Airbyte cursor or CDC position and last valid target batch before cutover. On failure, stop Hydra, point consumers back to the Airbyte target and resume Airbyte from preserved state. Compare keys, updates and deletes during the transition window before declaring recovery complete.

Pitfall to avoid: Do not reset Airbyte state or allow both paths to write the same target during the pilot. Blind full refresh can be costly and may destroy the evidence needed to diagnose a mismatch. Keep a rollback drill and owner in the runbook.

###### Migration and integration questions

How do Airbyte and Hydra ETL integrate?
Let Airbyte replicate a source into a landing table, then run Hydra against that table for supported transformations and a controlled destination load. One scheduler should wait for the Airbyte sync to finish before starting Hydra.

How it works: The simplest integration leaves Airbyte responsible for source replication and Hydra responsible for a supported transformation after a completed landing table. A full replacement is possible only for a selected stream whose connector and state requirements Hydra can meet.

Practical check: Inventory stream and sync mode, define a durable handoff, build a Hydra job to an isolated target and compare two cycles. Link Airbyte job ID, Hydra report and batch ID. Test a failed sync, zero-row sync and failed Hydra load. Decide which system remains scheduler owner.

Pitfall to avoid: Do not mix Airbyte raw history with its typed final table or start Hydra from a fixed timer that ignores sync completion. Avoid moving CDC and business transformation simultaneously; separating them makes a row mismatch diagnosable.
What connector checks are needed before moving an Airbyte sync to Hydra?
Verify that Hydra supports the exact source and destination plus the required authentication, pagination, CDC and schema behavior. Airbyte has a large connector catalog; a CSV simulator cannot establish connector parity.

How it works: Connector coverage includes authentication, pagination, incremental reads, schema discovery, deletes and target writes. Airbyte connectors can differ by product and version. Hydra’s broad connector labels must be checked against the specific stream settings rather than assumed equivalent.

Practical check: Capture connector version and configuration, then test an expiring token, multi-page result, late update, deletion and new field with a low-privilege account. Count requests and rows produced by both paths. Compare the destination DDL and failure status. Classify each requirement as supported, externalized or retained in Airbyte.

Pitfall to avoid: A first page of API records can look complete while later pages are skipped. A database connector that reads rows may still lack CDC. Do not turn off Airbyte until all required source behaviors are covered and a recovery drill has passed.
Does Hydra support Airbyte CDC behavior?
Do not infer CDC parity from append or upsert support. Inspect the Airbyte stream cursor, change events, deletes and sync mode, then test those cases against the proposed Hydra design or retain Airbyte for replication.

How it works: Airbyte CDC uses database change logs and state, including deletion information for supported sources. Hydra may read a current-state table or supported source query, but the same result requires a defined way to observe updates and deletes. Destination upsert is only one part.

Practical check: Run initial snapshot, update, delete and resnapshot tests. Compare the Airbyte log position, raw metadata and final deduplicated table with the Hydra proposal. If Hydra follows Airbyte, verify it reads the committed final relation. If direct replacement is proposed, document and test the alternative capture mechanism.

Pitfall to avoid: Do not assume updated_at detects deletes or that a target upsert removes deleted source records. A CDC log retention gap may force a refresh. A migration can pass insert tests yet fail on the first deletion, so keep this case mandatory.
How does Airbyte incremental sync compare with Hydra upsert?
Airbyte incremental sync controls which source records are extracted. Hydra upsert controls destination writes. A migration must separately reproduce the source cursor and verify updates, deletes and late changes.

How it works: Airbyte incremental sync determines the source delta; Hydra upsert applies target key updates. Airbyte’s Append Deduped modes may also maintain raw history and a current final table. A Hydra single table cannot be treated as equivalent without deciding whether history is part of the contract.

Practical check: Inspect source cursor, primary key and sync mode. Feed new, changed, duplicate-cursor and deleted records through both designs. Compare raw history, final values and source state after each cycle. Measure a full reread if that is the proposed Hydra extraction strategy.

Pitfall to avoid: A matching count can hide a stale current value, duplicate history or missed delete. Do not collapse read mode and write mode into one “upsert” setting. Test null keys and tie-breaking when two updates share a cursor value.
Should I replace Airbyte with Hydra ETL?
Replace only a specific supported pipeline after testing connector behavior and recovery. If Airbyte is already providing reliable specialized ingestion, a lower-risk option is to keep it and add Hydra after its landing layer.

How it works: Replace Airbyte only where a chosen source and destination are supported and the required sync state, schema and recovery behavior can be reproduced. Many deployments use Airbyte specifically for specialized connectors or CDC, making a mixed architecture more appropriate.

Practical check: Select one ordinary stream first, not a whole connection. Run both paths into separate targets with the same snapshot, then test update, delete, schema change and interruption. Record connector versions and operating cost. Keep Airbyte extraction if it continues to supply a hard-to-replace source capability.

Pitfall to avoid: Do not use a broad “Airbyte vs Hydra” result to decide every stream. A CSV import and a log-based database stream have different migration risks. Avoid turning off a working connection until the chosen stream passes its own acceptance and rollback tests.
How do you move an Airbyte sync to a Hydra job?
Record source and destination configuration, stream selection, sync mode, cursor, primary key and schedule. Create a separate Hydra target and compare initial and repeated runs, including a source update and a deleted record.

How it works: Moving a sync requires mapping stream selection, source cursor or CDC state, destination mode, primary key and schedule to a Hydra job and its surrounding orchestration. The apparent source-to-target path hides important behavior on second runs and after failures.

Practical check: Export connection configuration, save a baseline target and create Hydra sources, transformations, pipeline and destination files in a new project. Validate and run against a staging table. Compare first load, update, delete, new field and retry. Assign one owner for each schedule and target before cutover.

Pitfall to avoid: Do not copy credentials into YAML or change the production Airbyte target for a test. A direct source query without state may reread everything; a destination upsert cannot compensate for missing deletes. Keep the original connection and state for rollback.
Can Hydra transform Airbyte raw tables?
Yes when a Hydra database source can read the landed tables and their types. Check whether Airbyte writes raw JSON or normalized columns, and establish a stable table contract before building Hydra steps.

How it works: Hydra can transform Airbyte raw tables through a supported database connector, but raw records may include multiple versions per key and CDC metadata. The transformation must decide whether it wants history or current state before grouping or publishing business metrics.

Practical check: Inspect the raw table schema and sample update and delete records. Define a deterministic current-state selection using key, cursor and deletion marker if needed. Then run Hydra against an isolated target and compare with Airbyte’s typed final table. Test tie values and an empty stream.

Pitfall to avoid: Do not sum all raw versions of a changed order; that double-counts revenue. Do not discard deletion markers without deciding how the target removes the deleted key. If Airbyte’s final table already provides the desired state, reading that stable relation may be safer than rebuilding deduplication.
Who should own retries when Airbyte and Hydra are chained?
Give the orchestrator a clear boundary: retry a failed Airbyte sync without duplicating a successful Hydra load, and retry Hydra without silently rerunning extraction. Record run identifiers and destination keys for recovery.

How it works: Airbyte and Hydra form two failure domains. The orchestrator must know when an upstream sync is complete and whether a downstream Hydra failure can be retried independently. State advancement and target commits determine safe replay boundaries.

Practical check: Tag both stages with a batch ID, record Airbyte job state and Hydra report, and test source failure, partial Airbyte destination write and Hydra validation failure. For each case write the restart command and target query that proves consistency. Prefer retrying only the failed stage when its input is durable.

Pitfall to avoid: A blanket full-chain retry can repeat source API requests and append duplicate rows. Retrying Hydra against a table still being updated can produce mixed batches. Do not leave retry ownership implicit between two schedulers or allow a successful downstream process to mask an upstream sync failure.
What metrics should an Airbyte-to-Hydra pilot compare?
Compare stream row counts, unique keys, schema, nulls, deleted records, sync duration and recovery after interruption. Inspect destination values, not only a green status in either product.

How it works: A pilot needs measures of correctness, operations and resource use. Airbyte sync status alone does not prove the final relation matches Hydra, while a row count alone can hide stale updates or missed deletions. Connector behavior is part of the comparison.

Practical check: Collect source records requested, API calls or log position, rows emitted, unique target keys, values by key, schema, null rates, deleted-key behavior, duration and recovery time. Repeat across first run, update and interruption. Include versions and an immutable input window so the result can be reproduced.

Pitfall to avoid: Do not infer cost or throughput from the browser simulator. Comparing two runs against a changing source without a shared snapshot produces false differences. If downstream readers use Airbyte history, compare that layer as well as the final typed table.
How do you roll back an Airbyte replacement?
Preserve the Airbyte connection and its state during the pilot. Stop the Hydra schedule, point consumers to the original Airbyte target and resume the sync from the preserved cursor after checking the cutover interval.

How it works: A replacement rollback must restore source position, schedule and consumer target. Airbyte state determines what the original connector reads next; the prior target provides a known-good published relation. An isolated Hydra target keeps the recovery boundary visible.

Practical check: Before cutover, save the Airbyte connection state and last completed sync ID. If Hydra fails, disable its trigger, restore consumer reads to the old table and resume Airbyte without resetting its position. Reconcile the transition interval by key, update and delete. Rehearse the steps with a staging connection.

Pitfall to avoid: Do not run both writers on the same table or blindly trigger a full refresh. A rollback that restores the connection but not its state can skip or repeat changes. Keep old configuration, credentials and target data available until the new stream has survived several cycles and a failure drill.

Sources and method
The product descriptions were checked against the vendor references below and the Hydra DSL documentation. The comparison concerns the stated workflow, not all features or editions. The browser simulator is neither an engine run nor a performance benchmark.

Airbyte: core concepts ↗

Airbyte core concepts ↗

Airbyte sync modes ↗

Airbyte CDC behavior ↗

Airbyte sync schedules ↗

02 / Try

#### Airbyte vs Hydra: sample pipeline

#### Same small batch, two definitions

Read 14 sample orders, keep amounts above 50, sum by status and sort by total. Right-click inside either editor or use ⋯ for its line actions. Edit the Hydra threshold to recalculate the result; the source threshold follows where the displayed example includes one. The browser models this fixture and does not run either product.

Browser simulation

AirbyteData replication
⧉↓⬡⤢⋯

Airbyte connection (configuration summary)

Source: orders CSV connector
Destination: warehouse connector
Stream: orders
Sync mode: full refresh
Schedule: daily

A downstream SQL/dbt job filters, groups and sorts.
This is a configuration map, not an Airbyte export.
CopyDownloadIllustrative example

Hydra ETLYAML job files
✓▶⇢⧉⤢⋯

# sources.yaml
sources:
orders:
type: csv
extract:
table: data/orders.csv

# pipeline.yaml
pipeline:
from: orders
to: report

# transformations.yaml
steps:
- cast:
mapping: { amount: float }
- filter:
expr: "amount > 50"
- aggregate:
by: [status]
agg:
total: { func: sum, col: amount }
- sort:
by: [total]
ascending: false

# destinations.yaml
destinations:
report:
type: csv
load:
table: data/by_status.csv
mode: replace
Run sampleResetCopyDownload textRunnable ZIP

Lines in these examples Airbyte / Hydra

Files representedConfiguration map / 4 Hydra files

Run scope14 browser-local rows

Line counts are live counts of the text shown above, not a product benchmark. The Airbyte pane is illustrative and is not executed. The Hydra pane shows four files in one editor for comparison; only the displayed cast, filter, aggregate and sort operations are simulated. “Download text” includes your edits; “Runnable ZIP” contains the original four files and input CSV, validated with Hydra 0.22.0.

##### Simulated run result
×

StatusTotal

×

03 / Integrate

#### Introduce Hydra in an Airbyte environment

Start with a reversible pilot. Keep the current system running until the new output and failure behavior are verified.

##### Before you change a schedule or destination

The exact Airbyte connection, stream list, sync mode and cursor or CDC configuration.

A stable landed table or file that Hydra can read without modifying Airbyte state.

A separate Hydra target, plus credentials and schema access.

A replayable sample containing inserts, updates, deletes and schema drift where applicable.

##### Step-by-step integration and migration

01

###### Record connection behavior

Export or document the Airbyte source, destination, stream selection, sync schedule and destination namespace. For each stream record full-refresh or incremental reading, append/overwrite/deduped writing, cursor and primary key. This is the contract the next stage receives.

02

###### Start at the landing zone

Keep Airbyte as ingestion owner. Give Hydra read access to one completed stream table or export. Avoid reading a partially written table; use the Airbyte job success state or a controlled snapshot as the readiness condition.

03

###### Create Hydra transformation output

Define a Hydra job that reads the landed relation and writes a distinct staging destination. Start with cast and filter operations before adding joins or aggregation. Validate the YAML strictly, then run against a frozen Airbyte output snapshot.

04

###### Compare records and sync cycles

Reconcile keys, nulls, types and counts for the first sync. Repeat after inserts and updates. If the source uses CDC, verify deletes and ordering. Inspect how a repeated Airbyte sync affects the Hydra target, especially with append or upsert modes.

05

###### Choose one trigger

Either keep Airbyte’s schedule and start Hydra after a successful sync, or place both under one external orchestrator. Do not enable Hydra and Airbyte triggers independently against the same writable target. Record how a failed Hydra run is retried without re-extracting source data.

06

###### Consider connector replacement separately

Only after the hybrid path is stable should you test replacing a simple Airbyte connection. Use a supported source and destination, parallel outputs and a CDC or cursor test suite. Retain the old connection configuration until multiple normal and recovery cycles pass.

##### Run Hydra after a completed Airbyte sync

# First confirm the Airbyte sync is SUCCESS in its UI/API.
# Configure Hydra sources.yaml for the landed table or export.
hdrctl validate /srv/hydra/airbyte_orders --strict
hdrctl run /srv/hydra/airbyte_orders
# The Hydra destination must be separate during the pilot.
# Record the Airbyte job ID beside the Hydra run report.

Adapt the paths, project files and credentials to your deployment. The runnable orders fixture ZIP is a safe starting point for the Hydra side; its local YAML was validated with Hydra 0.22.0.

##### Acceptance checks before cutover

Initial, repeated and incremental syncs produce the expected key set.

CDC deletes and updates are preserved where used.

Hydra never reads a partially completed landing table.

A retry does not duplicate destination rows.

Exactly one schedule owns the sequence.

##### Rollback plan

Stop the Hydra downstream step and return consumers to the Airbyte landing or previous transformation path. Keep the Airbyte connection, state and schedule intact until the replacement path has passed recovery tests; never reset its cursor merely to rerun Hydra.

##### Practical pitfalls

Do not turn on two schedules for the same load.

Do not equate an upsert with an Airbyte incremental sync without checking state.

Keep the raw landing table if other consumers use it.

Build the pilot
Use the CLI reference to create and validate a project, then use the DSL guide for source, transformation and destination syntax.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra ETL vs Airflow — slug: /migrate/airflow/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All comparisons
Compare with Hydra ETL
Explore Hydra CLI ↗

Compare & migrate/Airflow

Product comparison · Workflow orchestration

### Hydra ETL vs Airflow

Airflow is a general workflow orchestrator, not an ETL engine. Hydra includes ETL jobs and workflow orchestration. Compare their orchestration only: Airflow is strong for diverse operators and complex DAG operations; Hydra suits ETL-focused workflows where jobs and actions can live in one project.

Scope: Orchestration versus orchestration. The ETL logic itself is not credited to Airflow. Reviewed 17 November 2026

Comparison Simulator Migration & integration

01 / Compare

#### Where the tools overlap and diverge

Short answer
Airflow is a general workflow orchestrator, not an ETL engine. Hydra includes ETL jobs and workflow orchestration. Compare their orchestration only: Airflow is strong for diverse operators and complex DAG operations; Hydra suits ETL-focused workflows where jobs and actions can live in one project.

Product contextCapabilitiesDetailed analysisTechnical evaluationWorked exampleDecision20 questions

##### What Airflow does, and what Hydra changes

Airflow is a general-purpose orchestrator. A DAG defines tasks, dependencies and scheduling; the work performed inside those tasks may be Python, SQL, a container command or an external ETL product. Hydra includes its own ETL engine and can orchestrate Hydra jobs and workflow actions. A fair comparison asks whether Hydra should own an ETL-focused workflow, not whether Airflow itself can transform a CSV.

The lowest-risk integration is often to keep the Airflow DAG and make Hydra one task in it. Airflow continues to own scheduling, retries, backfills and cross-system dependencies, while hdrctl runs a versioned ETL job. A full move to Hydra becomes reasonable when the DAG is mostly a linear chain of Hydra-supported jobs and actions and the team does not need Airflow-specific operators or distributed scheduling behavior.

The old side-by-side code demonstration can make a Hydra job look shorter than an Airflow DAG, but the two snippets carry different responsibilities. The new page separates DAG orchestration from the ETL payload, and the browser simulation is explicitly limited to the payload on sample data.

##### What both can do

Schedule work

Express dependencies

Retry and observe workflow runs

##### Key differences

AreaAirflowHydra ETL

Primary roleGeneral orchestration of external tasksETL engine plus project workflows

DefinitionDAGs and task/operator APIs; current Airflow also documents YAML DAG authoringYAML workflows, jobs and actions

EcosystemBroad provider/operator integrationsETL-specific DSL and supported actions

ScaleDistributed scheduler and executorsFit depends on Hydra deployment and workload

##### Detailed comparison for a production decision

###### Orchestration versus ETL execution

An Airflow DAG specifies when tasks run and how they depend on one another. The task body or provider performs the extraction, transformation or load. Hydra jobs contain supported ETL behavior themselves, while Hydra workflows arrange jobs and actions. Therefore, compare the Airflow DAG to the Hydra workflow, and separately compare the ETL code inside an Airflow task to the Hydra job.

This distinction prevents a misleading line-count claim. A one-line Airflow BashOperator can invoke an entire external pipeline; a short DAG is not evidence of a simple ETL. Conversely, a Hydra job that includes extraction and transformation is not an equivalent substitute for a broad DAG with many unrelated providers.

Product documentation: Airflow DAG concepts ↗

###### Scheduling, data intervals and backfill

Airflow schedules produce DAG runs associated with data intervals, and its backfill tooling can create runs for a historical date range. A move to Hydra must decide how an execution date or batch identifier is passed into jobs and whether historical reruns are required. Merely copying a cron expression is not enough.

For a pilot, capture one normal scheduled run, one manually triggered run and one historical backfill. Verify the effective dates, parameter values and output partition paths. If the Hydra workflow cannot represent the current backfill policy, retain Airflow as the scheduler and call Hydra inside a task.

Product documentation: Airflow backfill ↗

###### Operators, sensors and provider ecosystem

Airflow can coordinate many systems through operators, sensors and providers. A DAG that waits for an external dataset, launches a cloud job, branches, and updates several services is not automatically an ETL workflow. Hydra actions and triggers cover specific patterns, but provider names should never be translated by label alone.

List each task with its input, output, retry rule and external dependency. A task that simply runs a Hydra-supported ETL job is a candidate to move; a specialized cloud provider task may remain in Airflow. Hybrid architecture avoids rebuilding mature integrations without a business reason.

Product documentation: Airflow DAG concepts ↗

###### Failure and retry boundaries

Airflow retries task instances and records DAG-run state. Hydra can validate jobs and report its run results. When Airflow invokes hdrctl, the process exit code must tell Airflow whether the task succeeded. The Hydra job’s destination mode must also be safe when Airflow retries a task after a partial failure.

Test a deliberate failure after the source is read but before the destination is complete. Determine whether retry duplicates rows, overwrites a target, or resumes safely. Keep Airflow and Hydra logs linked by a shared run identifier or batch date so operators can diagnose both sides.

Product documentation: Airflow architecture ↗

###### When to migrate the DAG itself

A DAG dominated by one or two ETL jobs and a notification may be simpler as a Hydra workflow. A DAG with backfills, dynamic mapping, multiple providers or organization-wide observability may be better left in Airflow. The decision should include the people who maintain scheduling, not only the author of the data transformation.

Move one DAG only after a parallel run demonstrates dependency order, parameter transfer, retry behavior, alerts and historical reruns. Keep the Airflow DAG paused rather than deleted during the cutover window so the team can restore the previous schedule quickly.

Product documentation: Airflow DAG concepts ↗

##### Technical evaluation: Airflow and Hydra ETL in production

###### Airflow orchestrates tasks; Hydra executes ETL jobs

Apache Airflow models a DAG with tasks, dependencies, a schedule and runtime policies. A task may start a database operation, container, API call or arbitrary program; Airflow itself does not define the data transformation semantics inside that task. Hydra ETL defines supported extraction, transformation and loading in YAML jobs and can coordinate those jobs in workflows. A comparison should therefore distinguish replacing a Python ETL body inside an Airflow task from replacing the entire Airflow DAG and its scheduler.

Map a representative DAG into three layers: orchestration decisions, ETL logic and external integrations. A Hydra job can often replace hand-written pandas or SQL glue for a supported data path while Airflow continues to schedule it. A full orchestration migration is a separate decision requiring equivalent triggers, dependency rules, retries, alerts and backfill strategy. This precise distinction answers “Hydra vs Airflow” without mislabeling Airflow as an ETL engine.

Further reading: Airflow core concepts ↗

###### Airflow now documents YAML DAGs as well as Python DAGs

It would be inaccurate to present Airflow as exclusively Python-based. Current Airflow documentation includes a YAML DAG authoring option with its own restrictions and supported shapes. Python remains central to many installed DAGs and provider integrations, but the meaningful comparison is not simply YAML versus Python. Hydra YAML defines ETL sources, transformations and destinations; Airflow YAML defines orchestration tasks and schedules. Similar file syntax does not make their runtime contracts interchangeable.

For a migration assessment, inspect the actual deployed Airflow version and the authoring mode used by the candidate DAG. If it is a Python DAG, inventory imports, operators, TaskFlow functions and dynamic behavior. If it is a YAML DAG, inspect which task types and templating features it uses. Compare the executable behavior and operational environment, not the count of braces or lines. Record the version because supported authoring features can change between releases.

Further reading: Airflow YAML DAGs ↗

###### Task dependencies include trigger rules, not just arrows

An Airflow DAG edge says one task is upstream of another, but trigger rules decide which upstream states permit the downstream task to run. Branches, skipped tasks, setup and teardown behavior can change the result even when the graph looks simple. Hydra workflow dependencies and failure policies must be tested against these semantics. A five-step drawing is useful for teaching, but a production migration needs the trigger_rule and retry settings of every task.

Prepare a state matrix for a candidate DAG: upstream succeeds, fails, skips or times out. Record whether each downstream task runs, skips or fails. Execute the same matrix in the candidate Hydra workflow. Pay special attention to cleanup tasks and notifications that should run after failure. If a Hydra action cannot express the intended condition, keep Airflow as orchestrator and call Hydra from one task. A graph that merely preserves task names is not an equivalent workflow.

Further reading: Airflow DAG trigger rules ↗

###### Data intervals and catchup are scheduling contracts

Airflow scheduled DAG runs may represent a logical data interval, and catchup or backfill controls whether past intervals are created. A Hydra cron trigger that fires at the same wall-clock time does not automatically select the same data window or replay history. For a daily sales DAG, document which date a 06:00 run processes, what happens after a two-day outage and how a historical rerun receives its interval. This is often more important than the cron string itself.

Test normal execution, a missed schedule and a manual historical run. Compare the source query parameters and target partition produced by each system. If the old DAG relies on Airflow macros or timetable behavior, pass an explicit interval to the Hydra job or keep Airflow in charge of scheduling. Avoid shifting from a logically dated partition to “whatever data exists now” during migration; that change can create gaps and duplicate revenue in downstream reports.

Further reading: Airflow timetables ↗

###### Dynamic task mapping is not a static workflow graph

Airflow dynamic task mapping can create task instances at runtime based on upstream data. A Hydra workflow with a fixed list of steps is not an automatic replacement for that behavior. Before migrating such a DAG, identify what generates the mapping values, the maximum fan-out, the aggregation point and the failure policy when one mapped instance fails. The business unit may be a customer, file or partition rather than the DAG as a whole.

Build a fixture with zero, one and many mapping values and record the task instances created by Airflow. Determine whether the Hydra design can express the same iteration or whether an external launcher should call a Hydra job for each value. If the mapped tasks use provider operators or per-item retries, keeping Airflow and replacing only the ETL code inside each mapped task is usually a more faithful integration path.

Further reading: Airflow dynamic task mapping ↗

###### Workers, files and credentials need explicit placement

Airflow tasks may run on different workers or machines. A relative path written by one task is not necessarily visible to the next, and an Airflow connection or secret backend is not automatically available to a child process running hdrctl. A Hydra integration must specify where project YAML, input data and credentials live in the task execution environment. Mounting a path in the scheduler container alone may not make it available to the worker.

Run hdrctl validate and hdrctl run in the same worker image that will execute production tasks. Use absolute paths and a dedicated credential injection mechanism. Force a missing-file and a network-denied failure to verify that Airflow marks the task failed and surfaces Hydra logs. If a prior DAG task produces a file, publish it to a shared location or pass a durable object reference rather than relying on a local /tmp path. This operational detail decides whether the hybrid architecture is real.

Further reading: Airflow architecture ↗

###### XCom is control metadata, not a universal data pipe

An Airflow DAG may use XCom to pass small values such as an object key, batch identifier or status between tasks. A Hydra workflow parameter can carry some of these values, but an arbitrary XCom dependency does not map automatically to a YAML placeholder. Inventory each XCom producer, key and consumer, including templated operator arguments. Classify whether it identifies data, carries a decision, or changes the destination. Preserve that meaning when the ETL body moves.

For a hybrid design, let Airflow pass a batch or partition identifier to the hdrctl invocation and keep large data in a file or table. Verify that the parameter value appears in the Hydra run report and the destination partition. Test a missing XCom and a malformed value. If the entire DAG is migrated, replace the XCom contract with an explicit Hydra parameter or workflow output and document how the downstream action reads it. Avoid silently falling back to a current-date default.

Further reading: Airflow core concepts ↗

###### Retries and side effects should be audited task by task

Airflow can retry a failed task while other completed tasks stay successful. Hydra may retry a job or workflow step under its own policy. If the ETL operation writes externally before failure, a retry can duplicate rows, send a webhook twice or overwrite a partition. Record which Airflow task owns each side effect and whether it is idempotent. A migration that preserves the DAG drawing but changes retry scope can alter data or notifications.

Inject a failure after the destination has accepted part of the batch, then compare run status, committed rows and the next retry in Airflow and Hydra. Separately test a notification task after an upstream failure, because trigger rules may intentionally let it run. The acceptance matrix should specify which task is retried, the delay, maximum attempts, backoff, timeout and alert. Keep Airflow as the owner if its task-level control is essential and Hydra cannot match it without extra code.

Further reading: Airflow tasks and retries ↗

###### The lowest-risk integration is one Hydra task in an existing DAG

For a team already committed to Airflow, begin by replacing a bounded Python ETL task with a Hydra job. Keep the DAG schedule, upstream dependencies, downstream tasks, alerts and run history. The task runs hdrctl validate in deployment checks and hdrctl run in production against a versioned project. The exit code must determine task success, and the output table or file should be verified before downstream tasks proceed.

Run both implementations against isolated targets for several intervals. Compare row keys, values, nulls, schema, rerun behavior and failure logs. Use the same Airflow logical date as a parameter so the old and new tasks process the same interval. Only after the ETL body is proven should a team evaluate migrating the orchestration graph itself. This phased approach captures Hydra’s value while retaining Airflow features that the organization already operates reliably.

Further reading: Airflow DAG runs ↗

###### A full orchestration replacement needs a separate scorecard

A full Airflow-to-Hydra workflow migration is credible only after assessing DAG topology, provider operators, sensors, dynamic mapping, catchup, concurrency limits, secrets, worker placement, observability and incident response. Rank each feature as required, replaceable, retainable through an external service or unsupported. Then compare an equivalent run under normal, failed and historical conditions. This prevents a simple CSV DAG from being used to generalize about a production Airflow estate.

The decision record should state which DAG is being replaced, its version and schedule, its data interval rule, all task outcomes tested and the rollback point. Preserve the original DAG deployment during the observation period. At cutover, disable only one schedule and reconcile the last Airflow interval against the first Hydra interval. Keep Airflow for provider-heavy or dynamic orchestration when those capabilities remain required; move only the supported ETL body when that is the proven boundary.

Further reading: Airflow core concepts ↗

##### Worked evaluation: a daily orders DAG

Take an Airflow DAG scheduled daily at 06:00 with tasks that export orders, transform them in pandas, load a warehouse table and notify an operator. Record the DAG version, timetable, logical data interval, task dependencies, retry settings, trigger rules, worker image and every operator connection. The first migration question is whether the team wants to replace only the pandas transformation or the entire orchestration graph. A Hydra job may express the supported filter, cast and aggregate operations while Airflow remains responsible for when and where the job runs.

In the hybrid variant, build four Hydra job files for the ETL body and call hdrctl from one Airflow task. Pass the Airflow interval explicitly to select the source partition and name the Hydra output partition. Put the project and connector dependencies in the worker image; a scheduler-local path is not sufficient. Capture hdrctl exit status and run report so the task fails when Hydra fails. Keep the existing downstream notification and alert paths. This isolates the new ETL engine without changing schedule, backfill or provider integrations at the same time.

Run the old pandas task and Hydra task against separate targets for three intervals: a normal day, an empty day and a day with a late correction. Compare rows by order ID and aggregate totals, including null amount, duplicate IDs and a changed status. Verify that a 06:00 DAG run processes the same logical day on both sides. A cron expression alone does not prove this. If the Hydra source query defaults to current date while Airflow uses the previous data interval, a parallel run can appear successful yet write the wrong partition.

Force the source export to fail and confirm Hydra does not start. Then let Hydra fail after a partial target write and observe Airflow’s task retry. Check whether the destination load is idempotent and whether notification tasks run under their configured trigger rules. If a branch is skipped, inspect the downstream state rather than assuming all graph edges behave identically. The retry test must identify whether Airflow retries only the Hydra task or whether an entire Hydra workflow also retries internally.

A full orchestration replacement needs another experiment: pause the schedule for two days, backfill a historical interval, run a dynamic branch and make one downstream task fail. Compare Airflow’s interval, catchup, trigger-rule and task-instance behavior with the proposed Hydra workflow. Airflow 3.4 also documents YAML DAG authoring, so the decision cannot be reduced to Python versus YAML. Keep Airflow if provider operators, dynamic mapping, sensors or its operational history remain essential; Hydra can still own the ETL body.

At cutover, disable only the duplicated ETL task or schedule, record the last interval each implementation wrote and preserve the previous DAG version. A rollback restores the prior task body or DAG, reconciles any partially written partition and reruns only intervals not already published. The evaluation report should state the chosen boundary, output diff, failure results and operational owner. Those artifacts justify the specific orchestration decision and can be reviewed by the team that supports the DAG.

Related product documentation: Airflow DAG runs and data intervals ↗

##### Decision criteria for an existing Airflow deployment

An Airflow decision should be version-specific. Current Airflow documentation includes YAML DAG authoring, while many deployed DAGs still use Python and provider operators. Inspect the actual DAG syntax, Airflow version and task types before claiming an authoring advantage. Hydra YAML expresses ETL behavior directly, whereas Airflow DAG authoring expresses orchestration. This difference remains meaningful even when both files are YAML; the reader should compare what the runtime executes, not merely which file extension appears in Git.

The operational scorecard should include data interval, catchup, backfill, trigger rules, dynamic mapping, sensors, retries, worker environment and alerting. Mark each as required, retained in Airflow or reproduced in Hydra. If several capabilities stay Airflow-owned, a hybrid design with a Hydra ETL task is the honest conclusion. If the DAG is a simple chain of supported Hydra jobs, a full workflow pilot can be tested. The distinction prevents an orchestration comparison from being distorted by a small example.

Measure the same daily interval in both paths and record output rows, failed-task state, recovery time and worker resource use. A line-count comparison cannot show whether a late partition was backfilled or a notification ran after a skipped branch. The case study and failure matrix are therefore central evidence. A professional reader should leave knowing which exact Airflow responsibilities Hydra can take over in this candidate, and which require Airflow or a separate design.

An Airflow integration should also be tested through the deployment process. Confirm the DAG parser accepts the changed task, the worker image contains the pinned Hydra version, secrets resolve at execution time and logs are retained under the expected run. A passing hdrctl command on a laptop does not prove that the scheduler worker can reach the source database. These deployment checks are part of the comparison because they determine whether the proposed Hydra task is maintainable in an existing Airflow estate.

##### Where each approach fits

##### Keep Airflow when

Keep Airflow for cross-platform DAGs, provider operators and established scheduling operations.

##### Evaluate Hydra when

Try Hydra for an ETL-focused workflow whose steps are Hydra jobs or actions.

##### Should you replace Airflow with Hydra ETL?

Keep Airflow for cross-platform DAGs, provider operators and established scheduling operations. Try Hydra for an ETL-focused workflow whose steps are Hydra jobs or actions. For a first test, inventory DAG tasks, dependencies, schedules, retries and backfills. See the complete integration plan.

##### Frequently asked questions about Airflow and Hydra ETL

These answers cover product fit, data movement, orchestration, migration testing and rollback. Check the linked product documentation for version-specific behavior.

Is Airflow an ETL engine?
No. Airflow orchestrates tasks and their dependencies. ETL logic lives in task code or external tools. Hydra can be the ETL engine that an Airflow task invokes.

How it works: Airflow schedules and monitors tasks in a DAG; it does not prescribe a single extraction, transformation and loading engine. An Airflow task may call SQL, Spark, dbt, Python or Hydra. Hydra can own the ETL contract while Airflow remains the coordinator.

Practical check: Inventory each DAG task by actual work, data boundary and side effect. Identify which tasks can become one Hydra job and which depend on Airflow operators or infrastructure. Compare output data and recovery behavior, not just the shape of the graph.

Pitfall to avoid: Do not describe Airflow as incapable of data transformation: its tasks can execute transformation code. The distinction is operational ownership. Replacing a DAG without mapping sensors, backfills and cross-system dependencies can remove important behavior.
Can Airflow orchestrate Hydra?
Yes. Deploy Hydra where an Airflow worker can call hdrctl, invoke validation and run in a task, and use the process status to mark task success or failure. Keep one scheduler owner.

How it works: An Airflow task can call hdrctl with a project path, environment and run parameters. Airflow then owns scheduling and task retries while Hydra owns the job or workflow execution. The command exit status is the handoff signal.

Practical check: Package the Hydra project with its dependencies on every worker. Pass the Airflow logical date as an explicit parameter, capture the Hydra run report, and make the operator fail on a nonzero exit. Store secrets in a managed runtime rather than the DAG source.

Pitfall to avoid: Do not let both schedulers launch the same job. A worker retry after partial success can duplicate a load unless the Hydra destination is keyed or the run is otherwise idempotent. Test a killed worker and a repeated logical date.
When should a DAG be replaced by a Hydra workflow?
Consider it when the DAG is mainly Hydra-supported ETL jobs and simple actions, and when schedule, retry, alert and backfill behavior can be reproduced. Keep Airflow for broad provider-heavy orchestration.

How it works: A Hydra workflow may replace a DAG when the graph primarily sequences Hydra jobs and actions. Airflow remains useful for heterogeneous systems, complex sensors, large backfill estates and organization-wide scheduling standards.

Practical check: Draw the DAG with dependencies, trigger rules, SLA, retries, datasets and external integrations. Recreate one bounded graph in Hydra and compare run order, failure paths, observability and operator effort. Keep the Airflow schedule disabled during the direct Hydra pilot.

Pitfall to avoid: A shorter YAML file does not prove full feature parity. Hidden behavior in custom operators, templated fields or plugins can disappear in a mechanical rewrite. Preserve an executable Airflow rollback until the same production scenarios pass.
How does Airflow backfill affect migration?
Backfill creates runs for historical intervals. Verify how each interval becomes a Hydra parameter, source filter and output partition. Copying a cron string without this mapping can process the wrong data.

How it works: Airflow backfill and catchup create scheduled runs for historical logical intervals. A Hydra job receives only the dates and partitions you explicitly pass or model. A single Hydra run does not automatically reproduce an Airflow history.

Practical check: List the DAG schedule, data interval semantics, catchup setting and historical partitions. Build a deterministic Hydra invocation per interval and test an old date, a current date and an overlapping replay. Verify destination keys and partition boundaries.

Pitfall to avoid: Do not use wall-clock now as a replacement for Airflow logical date in a historical run. This silently loads the wrong partition. Prevent concurrent backfills from replacing the same table or racing on a shared checkpoint.
What happens to Airflow operators and sensors?
Inventory them individually. Some may map to Hydra actions or triggers, but many specialized providers and sensors have no direct equivalent. Those tasks can remain in Airflow while Hydra handles the ETL payload.

How it works: Operators wrap external work; sensors wait for external conditions. Some operator bodies can become Hydra jobs or actions, but an Airflow sensor may encode a polling contract, timeout and reschedule policy that needs separate treatment.

Practical check: Classify each operator and sensor by API, credentials, trigger condition and output. Migrate the data transformation first, leaving specialized sensors in Airflow where appropriate. Test timeout and missed-event behavior before changing the scheduler.

Pitfall to avoid: Do not translate every Airflow task into one Hydra step by name. An operator might perform provisioning or a side effect outside ETL, while a sensor may guard data completeness. Omitting either can produce a successful but premature load.
How should Airflow retries be configured around Hydra?
Make the Hydra destination idempotent for the chosen batch and let a nonzero hdrctl exit status fail the task. Test a partial failure and retry before using the pattern in production.

How it works: Airflow retries rerun an entire task; Hydra may retry an internal action or recover a job at a different boundary. Nesting both mechanisms multiplies attempts and can repeat external calls or database writes.

Practical check: Choose one owner for transient retries at each boundary. Record Airflow try number and Hydra run ID together. Inject a failure after a partial load, then verify that the next attempt is safe and that alerts fire only after the final policy is exhausted.

Pitfall to avoid: Avoid configuring three Airflow retries around three Hydra retries without calculating the maximum attempts. Nine side effects may occur. A webhook or append load especially needs an idempotency key or compensating action.
Can both Airflow and Hydra schedules be enabled?
They can, but not for the same writable workload without careful coordination. For the migration pilot, keep Airflow as owner; during cutover, pause the DAG before enabling the corresponding Hydra trigger.

How it works: Parallel scheduling is safe only when targets and side effects are isolated. Two enabled schedules can overlap in time and write the same partition even if each pipeline is individually correct.

Practical check: Run the replacement into a separate schema or versioned output during comparison. Use the same logical date and compare rows, checksums and duration. At cutover, pause one scheduler, wait for in-flight runs to finish, then enable the other.

Pitfall to avoid: Do not enable both schedules against a production append or replace target. A late Airflow run may overwrite a newer Hydra result. Check for queued, running and backfill tasks before changing ownership.
Does a shorter Hydra YAML prove lower operating cost?
No. Code length does not measure scheduler capacity, reliability or team operations. Compare the real deployment, recovery drills and maintenance effort for the selected workload.

How it works: Code length measures neither execution cost nor operational cost. Airflow may reuse a mature scheduler and worker pool; Hydra may simplify a focused ETL flow but still incur connector, database and monitoring costs.

Practical check: Measure runtime, worker resources, memory, database load, failure recovery, time spent on maintenance and onboarding effort. Compare a representative month of schedules and incidents. Include the cost of retaining Airflow for unrelated DAGs.

Pitfall to avoid: Do not infer cost savings from the simulator’s line counter. A short configuration can issue expensive database queries, while a longer DAG may efficiently orchestrate existing services. Base the decision on observed workloads.
What does the browser simulator execute?
It calculates a four-step transformation on local sample rows. It does not start an Airflow scheduler, run a DAG or invoke the Hydra engine.

How it works: The browser example illustrates equivalent pipeline intent and a small local transformation. It does not start an Airflow scheduler, workers, metadata database or external operators, and therefore cannot validate production DAG behavior.

Practical check: Use the simulator to inspect the conceptual mapping, then run a separate test with the actual Airflow deployment and Hydra CLI. Compare logical dates, dependency order, retries, row results and resource use under the same input.

Pitfall to avoid: Do not cite browser timing as an Airflow benchmark. It excludes queue delay, executor behavior, network services and storage. Make performance claims only from a controlled deployment with reported hardware and dataset.
What is the safest Airflow rollback?
Keep the previous DAG code and schedule configuration. Pause the new trigger, restore the old ETL task or DAG revision, and rerun only the affected data interval after checking destination idempotency.

How it works: Rollback restores a known Airflow DAG version, schedule state and data target. The changeover must preserve the last successfully processed interval so the old path does not skip or double-process a partition.

Practical check: Keep the DAG deployable, record the cutover logical date and snapshot the published target. If the new path fails, stop its trigger, restore consumer routing, unpause Airflow and replay only documented missing intervals. Reconcile each partition.

Pitfall to avoid: Simply unpausing the old DAG can trigger queued catchup runs. Review catchup and max active runs before recovery. Prevent both paths from writing the same partition during the handback.

###### Migration and integration questions

Can Hydra ETL replace Apache Airflow?
Hydra can orchestrate supported ETL jobs and workflow actions, but Airflow is a general Python orchestration platform with a large operator ecosystem. Evaluate a replacement for a bounded DAG, not an entire Airflow deployment by assumption.

How it works: Hydra can replace the ETL portion of some Airflow DAGs and may orchestrate a bounded project, but Airflow also coordinates arbitrary services, sensors and organization-wide workflows. Replacement scope follows the actual DAG responsibilities.

Practical check: Separate extraction and loading tasks from notifications, approvals and external infrastructure operations. Pilot one ETL-heavy DAG, then compare dependency semantics, retries, backfill needs and monitoring. Retain Airflow where its broader orchestration still provides value.

Pitfall to avoid: Avoid a platform-wide replacement claim from a single data pipeline. A successful Hydra job does not reproduce every Airflow operator, executor or historical schedule. Treat each DAG as a distinct migration decision.

For each DAG, identify who owns the schedule, historical intervals, alert routing and final published relation; these responsibilities determine whether a complete replacement is realistic.
How do you run Hydra ETL from an Airflow DAG?
Run hdrctl as a task after upstream data is ready, capture its exit code and logs, and let downstream tasks depend on success. Keep Airflow as schedule owner during the integration pilot.

How it works: The Airflow operator starts an external process or container that runs hdrctl. Passing the logical date and a stable run ID ties the Hydra output to an Airflow task instance, while the process return code determines task success.

Practical check: Set the project directory and environment explicitly; pin the Hydra package version on workers. Capture stdout and the structured report, mask secrets, and fail the task if validation or execution fails. Test a retry after the process is terminated.

Pitfall to avoid: Do not rely on a shell command that hides a nonzero exit behind a later successful command. Avoid mutable latest images, which make retries run different code. Keep the same input snapshot available for replay.
How do Airflow DAG dependencies map to Hydra workflows?
Document tasks, upstream edges, trigger rules, retries and branching. Recreate only supported dependencies in Hydra, then compare actual start order and failure propagation on a five-step fixture.

How it works: Both systems model directed dependencies, but their step semantics differ. An Airflow DAG may use trigger rules, task groups and dynamically mapped tasks; a Hydra workflow graph expresses its own jobs and actions with its own failure policies.

Practical check: Translate edges and branch conditions into a table before writing YAML. Test a successful run, one upstream failure and a skipped branch. Compare which descendants ran and which were marked skipped, then inspect the final published output.

Pitfall to avoid: Do not preserve only the visual graph. A default trigger rule or branch skip can be crucial to correctness. A downstream task that used to run after partial success may stop, or vice versa, after migration.
Does Hydra support Airflow backfill and catchup?
Do not assume equivalent historical scheduling. If an Airflow DAG depends on catchup, data intervals or backfill, preserve that behavior explicitly in the migration plan and test historical runs before cutover.

How it works: Airflow creates scheduled historical intervals under catchup and can backfill them. Hydra can process historical intervals when invoked with matching parameters, but the operator must define the interval list, ordering and concurrency.

Practical check: Write an explicit driver that passes start and end boundaries to each Hydra invocation. Reconcile one partition at a time and cap concurrent writers. Test daylight-saving transitions and late-arriving data if the source uses local timestamps.

Pitfall to avoid: Do not rerun historical data with a current-date default or a global replace destination. A backfill can erase current results or miss boundary rows. Make each interval output independently verifiable.
How do Airflow XCom values map to Hydra parameters?
Map only the values that a Hydra workflow or job can pass explicitly. XCom may carry task-specific runtime data; document each producer and consumer instead of treating parameters as a universal replacement.

How it works: XCom is an Airflow mechanism for passing task data; Hydra parameters are inputs to a project or run. Moving a value requires deciding where it is produced, serialized, validated and stored across the boundary.

Practical check: Pass small identifiers such as a partition key, file URI or batch ID as CLI parameters. Put large datasets in durable storage and pass a reference. Validate parameter types and log a redacted run summary so an operator can trace the source of each value.

Pitfall to avoid: Do not pass a large dataframe or credential through a command line argument. Shell process listings and logs can expose secrets, and size limits make large payloads unreliable. Keep sensitive values in the configured secret store.
What is the difference between Airflow orchestration and Hydra ETL?
Airflow schedules and coordinates arbitrary tasks; it is not itself a data transformation engine. Hydra includes ETL source, transformation and destination execution alongside its workflow features.

How it works: Airflow coordinates arbitrary tasks over time; Hydra defines and executes ETL jobs and can orchestrate its own workflow steps. A DAG may invoke Hydra just as it invokes SQL or Spark, so the tools can be complementary.

Practical check: For each pipeline, decide which layer owns schedule, retries and the final published dataset. Draw the handoff and write an exit-code contract. Compare a direct Hydra schedule with Airflow orchestration only where both are feasible.

Pitfall to avoid: Avoid presenting a feature matrix as a universal winner. Airflow’s strength in heterogeneous orchestration and Hydra’s data job model solve different parts of the problem. Duplicated ownership is the main operational risk.
Can Airflow schedule a Hydra YAML pipeline?
Yes. An Airflow BashOperator or equivalent execution task can call hdrctl validate and hdrctl run for a Hydra project, provided the worker has Hydra, the project files and credentials available.

How it works: An Airflow schedule can trigger a Hydra YAML project through a task that runs hdrctl. Hydra YAML describes the project behavior, while Airflow sets the logical interval and execution window.

Practical check: Template the interval into an explicit parameter, pin code and dependency versions, and save the Hydra report under the Airflow run ID. Make the command idempotent for repeated task instances and test with one historical and one current interval.

Pitfall to avoid: Do not also enable a Hydra cron trigger for the same target. Two clocks can overlap and produce duplicate writes. Treat the Airflow logical date as data, not just a display timestamp.
How do you migrate Airflow retries and failure policies?
Record retry count, delay, backoff, trigger rule and alerting for each task. Exercise a deliberate failure in both systems and compare which downstream steps run, skip or retry.

How it works: Failure policy has two levels when Airflow runs Hydra: the internal workflow may retry an action, then Airflow may retry the entire invocation. Branch skip and terminal failure states also need mapping.

Practical check: Document maximum attempts, delay and side effects for each level. Pick one retry owner for non-idempotent steps. Force a database outage and a webhook failure, then compare descendant execution and final Airflow state to the intended policy.

Pitfall to avoid: Unexamined nested retries cause long delays and duplicate side effects. An Airflow success state after a Hydra partial failure is also possible if the wrapper swallows the return code. Test the wrapper itself.
When should Airflow remain the orchestrator?
Retain Airflow when the DAG uses many provider operators, dynamic task mapping, sensors or established operational controls. Hydra can still replace Python ETL code inside selected Airflow tasks.

How it works: Airflow should remain when a DAG integrates many external services, sensors, task mapping, cross-team scheduling or established operational controls. Hydra can still own the data movement inside one or more tasks.

Practical check: Keep the DAG and replace one transformation task with a Hydra invocation. Verify that observability, credentials and dependency signals remain understandable to the existing operations team. Review whether consolidating adjacent ETL tasks would reduce unnecessary data handoffs.

Pitfall to avoid: Migrating the scheduler just to reduce configuration files may sacrifice important backfill or governance behavior. Conversely, keeping every trivial step in Airflow can obscure the ETL contract; choose the boundary deliberately.
How do you roll back an Airflow-to-Hydra workflow migration?
Keep the original DAG disabled but deployable while the Hydra workflow is piloted. Stop the new schedule, restore the original DAG and verify that run intervals and destination writes will not be replayed twice.

How it works: Rollback requires preserving the old DAG, scheduler state, logical intervals and published target. A Hydra-owned workflow may have written later partitions that the restored Airflow DAG does not know about.

Practical check: Record the cutover interval and reconcile output per partition. Stop Hydra triggers, wait for active runs, restore the target pointer and re-enable Airflow with a reviewed catchup range. Reprocess only gaps and compare checksums.

Pitfall to avoid: Do not unpause the DAG before examining queued runs and active tasks. Duplicate historical runs can overwrite new data. Keep the old executable environment and dependencies until the handback drill succeeds.

Include queued tasks and paused schedules in the recovery checklist, because a successful data restore can still be undone by an unexpected late task.

Sources and method
The product descriptions were checked against the vendor references below and the Hydra DSL documentation. The comparison concerns the stated workflow, not all features or editions. The browser simulator is neither an engine run nor a performance benchmark.

Airflow: DAGs and tasks ↗

Airflow DAG concepts ↗

Airflow architecture ↗

Airflow backfill ↗

02 / Try

#### Airflow vs Hydra: sample pipeline

#### Same small batch, two definitions

Read 14 sample orders, keep amounts above 50, sum by status and sort by total. Right-click inside either editor or use ⋯ for its line actions. Edit the Hydra threshold to recalculate the result; the source threshold follows where the displayed example includes one. The browser models this fixture and does not run either product.

Browser simulation

AirflowWorkflow orchestration
⧉↓⬡⤢⋯

# Airflow orchestration example
from airflow.sdk import dag, task
import pendulum

@dag(schedule="0 6 * * *", start_date=pendulum.datetime(2025, 1, 1))
def orders_daily():
@task
def run_etl():
run_external_etl_job() # ETL is outside Airflow
run_etl()

orders_daily()
CopyDownloadIllustrative example

Hydra ETLYAML job files
✓▶⇢⧉⤢⋯

# sources.yaml
sources:
orders:
type: csv
extract:
table: data/orders.csv

# pipeline.yaml
pipeline:
from: orders
to: report

# transformations.yaml
steps:
- cast:
mapping: { amount: float }
- filter:
expr: "amount > 50"
- aggregate:
by: [status]
agg:
total: { func: sum, col: amount }
- sort:
by: [total]
ascending: false

# destinations.yaml
destinations:
report:
type: csv
load:
table: data/by_status.csv
mode: replace
Run sampleResetCopyDownload textRunnable ZIP

Lines in these examples Airflow / Hydra

Files representedExample / 4 Hydra files

Run scope14 browser-local rows

Line counts are live counts of the text shown above, not a product benchmark. The Airflow pane is illustrative and is not executed. The Hydra pane shows four files in one editor for comparison; only the displayed cast, filter, aggregate and sort operations are simulated. “Download text” includes your edits; “Runnable ZIP” contains the original four files and input CSV, validated with Hydra 0.22.0.

##### Simulated run result
×

StatusTotal

×

03 / Integrate

#### Introduce Hydra in an Airflow environment

Start with a reversible pilot. Keep the current system running until the new output and failure behavior are verified.

##### Before you change a schedule or destination

The selected DAG file, schedule, task graph, retry policy and backfill expectations.

An isolated Hydra job and destination for the ETL payload.

hdrctl installed in the Airflow task environment with absolute project paths.

A run identifier or date that can be correlated across Airflow and Hydra logs.

##### Step-by-step integration and migration

01

###### Separate DAG control from data logic

For each Airflow task, note whether it schedules/waits, invokes a service or transforms records. Extract the ETL payload as its own unit. Do not count Airflow’s operator plumbing as if it were ETL implementation.

02

###### Wrap one Hydra job in Airflow

Install Hydra in the worker environment and deploy the YAML project at a stable path. Add a task that invokes hdrctl validate --strict and hdrctl run. Keep the DAG schedule and surrounding tasks unchanged.

03

###### Propagate parameters and status

Pass the Airflow batch date or run ID into the Hydra job through a reviewed parameter mechanism. Use a command that exits nonzero on validation or run failure. Capture the Hydra report path or run ID in the Airflow task log.

04

###### Test retries and backfill

Run a normal interval, a failed task retry and a historical interval. Verify idempotency at the destination and that the same input period is selected each time. If these semantics diverge, keep the DAG as the orchestrator.

05

###### Evaluate a workflow move

Only after the Hydra task is stable, map DAG dependencies and actions to a Hydra workflow. Compare task order, branching, failure rules and alerts. Leave specialized Airflow provider tasks in the DAG if Hydra has no equivalent.

06

###### Cut over without duplicate schedules

When a full move is justified, enable the Hydra trigger and pause the Airflow DAG for the same workload. Observe several scheduled cycles, then retire the old DAG according to the team’s normal change process.

##### Airflow task invoking a Hydra ETL job

# Airflow 3 example; adapt imports for your installed version.
import pendulum
from airflow.sdk import dag
from airflow.providers.standard.operators.bash import BashOperator

@dag(
schedule="0 6 * * *",
start_date=pendulum.datetime(2025, 1, 1, tz="UTC"),
catchup=False,
)
def hydra_orders():
BashOperator(
task_id="run_hydra_orders",
bash_command=(
"hdrctl validate /srv/hydra/orders --strict && "
"hdrctl run /srv/hydra/orders"
),
)

hydra_orders()
# Keep Airflow as the sole scheduler during this pilot.

Adapt the paths, project files and credentials to your deployment. The runnable orders fixture ZIP is a safe starting point for the Hydra side; its local YAML was validated with Hydra 0.22.0.

##### Acceptance checks before cutover

Airflow marks a Hydra failure as a failed task.

Task retry does not duplicate or corrupt the destination.

A historical run selects the correct input period.

Task and Hydra logs share a batch identifier.

Only one schedule runs the production workload.

##### Rollback plan

Pause the new Hydra trigger or remove the Hydra task from the active DAG revision, restore the previous ETL task, and rerun the affected Airflow interval. Keep the old DAG code and output contract available throughout the pilot.

##### Practical pitfalls

Airflow is not the ETL transformation layer; compare like with like.

Backfill and scheduling semantics need separate testing.

Do not assume provider operators map to Hydra actions.

Build the pilot
Use the CLI reference to create and validate a project, then use the DSL guide for source, transformation and destination syntax.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra ETL vs Dagster — slug: /migrate/dagster/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All comparisons
Compare with Hydra ETL
Explore Hydra CLI ↗

Compare & migrate/Dagster

Product comparison · Asset-oriented orchestration

### Hydra ETL vs Dagster

Dagster organizes data workflows around software-defined assets, jobs, schedules and sensors. Hydra defines ETL jobs and workflow steps. Dagster is a stronger choice when asset lineage and materialization history are core requirements; Hydra can simplify a bounded source-to-destination ETL chain.

Scope: A linear ETL chain compared with a Dagster asset job, not a full asset platform. Reviewed 17 November 2026

Comparison Simulator Migration & integration

01 / Compare

#### Where the tools overlap and diverge

Short answer
Dagster organizes data workflows around software-defined assets, jobs, schedules and sensors. Hydra defines ETL jobs and workflow steps. Dagster is a stronger choice when asset lineage and materialization history are core requirements; Hydra can simplify a bounded source-to-destination ETL chain.

Product contextCapabilitiesDetailed analysisTechnical evaluationWorked exampleDecision20 questions

##### What Dagster does, and what Hydra changes

Dagster is organized around software-defined assets and their materializations, with jobs, schedules, sensors and a UI that makes the asset graph visible. Hydra is organized around ETL jobs and workflow steps. A linear data transformation can look similar in both, but an asset has identity, history, partitions and downstream consumers that a job output does not automatically replace.

The safest integration is to keep Dagster as the asset owner and let an asset or op invoke a Hydra job. The Hydra job writes a defined output, and Dagster records a materialization or check after verifying that output. Full migration is a narrower option for a pipeline whose intermediate stages are not valuable as separately tracked assets and whose consumers can accept a different operational model.

The browser example demonstrates only a small order aggregation. It cannot measure asset lineage, materialization metadata, partition backfills, sensors or Dagster’s run coordination. A professional comparison should evaluate those capabilities as first-class requirements rather than treating them as framework overhead.

##### What both can do

Model dependencies

Schedule and observe runs

Keep pipeline definitions in source control

##### Key differences

AreaDagsterHydra ETL

Unit of designAssets and materializationsETL jobs and workflow steps

AuthoringPython definitionsYAML job and workflow definitions

ObservabilityAsset catalog and lineageJob/workflow reports and status

Best fitData product dependencies and lineageDirect ETL chains and project automation

##### Detailed comparison for a production decision

###### Asset identity versus pipeline output

A Dagster asset is a named data product with dependencies and materialization events. An asset job targets a selection of assets. Hydra jobs read, transform and write data, and a Hydra workflow sequences jobs and actions. A table written by Hydra can represent the same physical data, but Dagster’s logical asset identity and history remain separate unless the integration records them.

Before migration, ask which assets are truly consumed as products and which are implementation intermediates. Keep published assets with downstream owners in Dagster. A chain of private intermediate frames may be consolidated into a Hydra job if the final contract and diagnostic visibility remain adequate.

Product documentation: Dagster asset jobs ↗

###### Lineage, partitions and freshness

Dagster’s asset catalog exposes dependencies, partition status and run information. A Hydra report can show that a job ran, but it does not automatically reproduce Dagster’s lineage view. If an audit or operations team uses asset materializations and partition status, losing them is a meaningful regression.

For a hybrid design, let Dagster retain the asset definition and call Hydra during its computation. After the Hydra output is checked, Dagster can record the materialization under the existing key. Test a missing partition and a late partition as well as the normal daily path.

Product documentation: Dagster webserver and asset catalog ↗

###### Schedules, sensors and automation

Dagster jobs can be started by schedules or sensors. A sensor may make decisions based on external events and run keys. Hydra triggers can start project workflows, but event deduplication, partition mapping and sensor evaluation behavior must be assessed separately.

During coexistence, keep Dagster automation active and do not add an independent Hydra trigger for the same asset. If a full move is considered, map every schedule and sensor to an explicit replacement and test a repeated event so the same output is not built twice.

Product documentation: Dagster schedules and sensors ↗

###### Invoking Hydra from Dagster

Dagster can run shell commands and capture their outcomes. A bounded Hydra job can therefore be invoked from an asset or op using a subprocess or shell integration. The Dagster execution environment must contain hdrctl, the Hydra project and access to its source and destination.

Use a stable path and a process call that raises on nonzero exit. Do not mark the Dagster asset materialized merely because the command was launched; verify that the Hydra destination contains the expected partition or batch and propagate failure to Dagster.

Product documentation: Dagster shell integration ↗

###### Choosing a full migration

A full move may suit a small linear ETL pipeline where asset lineage, sensors and partition history are not central. It is less suitable where the asset graph is the team’s operational language or where downstream users rely on materialization metadata.

Evaluate the complete work of the pipeline: execution, data contract, alerting, replay and lineage. The goal is not to replace Python with YAML at any cost. A hybrid system can keep Dagster’s asset model while Hydra provides the data transformation.

Product documentation: Dagster asset jobs ↗

##### Technical evaluation: Dagster and Hydra ETL in production

###### Dagster assets describe data products, not only task order

Dagster asset definitions identify data products and dependencies, and an asset job selects assets for materialization. Hydra jobs describe supported extraction, transformation and loading, with workflows to coordinate execution. A Hydra output table can correspond to a Dagster asset, but the asset also carries identity, dependency context and operational metadata. A comparison should therefore distinguish replacing the computation behind an asset from replacing Dagster’s asset graph and catalog.

Draw the candidate asset’s immediate parents and children. Record its storage target, partitioning, checks, freshness expectations and consumers. A low-risk integration keeps the Dagster asset and calls a Hydra job to produce its data; Dagster continues to represent the materialization. A full migration is more demanding because operators may rely on the asset catalog, lineage and backfill controls. This distinction gives a technical reader a precise answer to “Hydra vs Dagster”.

Further reading: Dagster asset jobs ↗

###### Materialization success must mean the target is actually valid

A Dagster asset can be marked materialized after its compute function completes. If that function simply launches hdrctl, it must check the exit code and confirm the expected table or file exists before returning success. Otherwise the asset catalog can claim a fresh data product while the Hydra target is empty or incomplete. The integration contract should identify the target location, schema, partition and minimum quality checks for each materialization.

Build a Dagster asset wrapper that calls Hydra against a versioned project, then reads back the destination count and required columns. Exercise a missing source, invalid Hydra YAML and destination outage. In every case, Dagster should show failure and downstream assets should not proceed as if a valid materialization occurred. Capture the Hydra report path or run ID as asset metadata if the project supports it. That creates a navigable link between the orchestration view and ETL execution evidence.

Further reading: Dagster asset jobs ↗

###### Asset lineage and checks are independent migration requirements

A Dagster graph can tell operators which upstream data product feeds which downstream product. Asset checks can express expectations about a table or file. Replacing an asset implementation with Hydra does not automatically remove those benefits if the wrapper remains in Dagster. Replacing Dagster entirely, however, requires a plan for lineage, quality checks, ownership and incident navigation. A shorter YAML workflow is not a substitute for a catalog if the team uses the catalog in daily operations.

For the pilot, list the asset checks and metadata currently emitted, then retain or reproduce them after the Hydra run. Compare check failures under a duplicate key, missing partition and wrong schema. Ask who reads the lineage graph during incident response and whether they can still identify the upstream source after a migration. If lineage is essential, keep Dagster as the asset layer and let Hydra own a bounded ETL implementation inside it.

Further reading: Dagster asset catalog ↗

###### Partitions and backfills create historical semantics

Dagster partitioned assets can materialize selected dates, customers or other keys, and backfills run historical partitions. A Hydra job can receive parameters, but a cron schedule alone will not reproduce partition selection, backfill orchestration or per-partition status. Before migrating a partitioned asset, record the partition definition, input selection, output path and behavior when a historical partition is rerun after newer data has arrived.

Test three partitions, including one missing source interval and one late correction. Pass the partition key explicitly to Hydra and confirm the job reads and writes only that partition. Then rerun an older key and compare Dagster’s materialization history and the target rows. If the Hydra destination mode replaces a whole table where Dagster expects one partition to change, keep Dagster’s orchestration and redesign the publishing boundary before any cutover.

Further reading: Dagster asset jobs ↗

###### Schedules and sensors are separate from ETL execution

Dagster can start asset jobs through schedules and sensors. A sensor may react to an external file, upstream event or changing state rather than a fixed time. Hydra workflows and triggers can start projects, but a replacement must preserve the actual event condition, time zone, concurrency and missed-event behavior. A schedule with the same cron text is only one piece of that contract. Keep the Dagster automation while first testing Hydra as the computation behind an asset.

Create event fixtures for one normal event, a duplicate event and an event arriving while the prior run is still active. Observe which Dagster run starts and what partition or parameter it receives. If a future Hydra trigger is proposed, execute the same cases and compare target writes. Where a specialized Dagster sensor remains necessary, the mixed architecture is a successful outcome: Dagster owns automation and Hydra owns supported ETL logic.

Further reading: Dagster schedules and sensors ↗

###### Invocation needs a checked process boundary

The practical integration path is to install Hydra in the Dagster execution environment and call hdrctl from an asset or op with a checked subprocess. Project files, connector packages and credentials must be available to the worker process, not merely the webserver. Pin the Hydra version and pass an explicit project path and partition identifier. Capture stdout, stderr and exit status without logging secrets. If the command fails, the asset run must fail.

Test this in the same container or worker used in production. First validate the Hydra project, then run it against a separate target and query the result. Force a missing mount, bad credential and invalid input. A successful local shell command is insufficient if the Dagster deployment isolates workers or uses a different filesystem. The integration should include a precise packaging and secret-injection plan, not just a Python code fragment.

Further reading: Dagster shell integration ↗

###### Retries can duplicate materializations or writes

Dagster may retry an asset step after failure, while Hydra may also retry a job or workflow step. If both layers retry without a shared idempotency rule, an append load or external action can execute twice. Record the retry owner, maximum attempts and the point at which the destination commits. For a table with upsert, confirm the key; for a partitioned file, confirm whether the retry replaces exactly one partition. The two systems’ success statuses must refer to the same published data.

Inject a destination failure after some rows have been written, then allow the configured retry. Compare row counts, unique keys and Dagster materialization events before and after. Repeat with a permanent validation error that should not be retried indefinitely. Operators need a rule for replaying only the failed partition or stage. This is why “can Dagster orchestrate Hydra?” requires a recovery design as well as a subprocess example.

Further reading: Dagster asset jobs ↗

###### Hybrid observability should connect both run histories

Dagster users may investigate an asset through the webserver, its materialization metadata and upstream graph. Hydra provides job validation and run reports. In a hybrid design, store a shared batch or partition identifier in both places and expose the Hydra report path from the Dagster run. An operator should be able to move from a failed Dagster asset to the exact Hydra input, transformation step and destination attempt without searching unrelated logs.

Define a small run ledger: Dagster run ID, asset key, partition key, Hydra job revision, source snapshot, target schema, accepted rows, rejected rows and checksum. Test a successful run, a source failure and a wrong-schema result. The monitoring rule should alert on a stale asset as well as on a failed process. This evidence helps a professional decide whether the mixed architecture remains supportable after several teams and schedules are added.

Further reading: Dagster webserver and asset catalog ↗

###### A full replacement must justify losing asset capabilities

A simple linear Dagster job that mostly launches one ETL script may be a candidate for a Hydra workflow. An estate built around partitioned assets, checks, sensors, materialization history and cross-team lineage is a very different case. Classify each required feature as reproducible in Hydra, retained through another system, redesigned or unsupported. Then compare a normal run, a failed run, a backfill and an upstream change. A feature table without runtime evidence is insufficient.

The decision record should identify the asset graph being replaced, its owners, consumers and operational commitments. Keep Dagster when its catalog and automation remain valuable; let Hydra replace the ETL computation where it fits. If a complete migration is approved, document how lineage and checks will be discovered and who owns the new runbook. The outcome should be stated for the selected graph and data product, since other assets may have different requirements.

Further reading: Dagster asset jobs ↗

###### Cutover and rollback should be partition-aware

During a pilot, keep the original Dagster asset producing its published target while Hydra writes an isolated equivalent for the same partition keys. Reconcile each partition by business key and compare asset checks. At cutover, stop only the selected schedule or sensor, record the last materialized partition and enable the new path. If Dagster remains as wrapper, avoid enabling a second Hydra trigger that can race the asset run.

Rollback should restore the prior asset implementation or schedule, point consumers to the previous target and reconcile partitions written during the change. Do not simply rerun every historical partition; that can duplicate append writes or overwrite corrected data. Keep the old code and target until an interruption drill has passed. The runbook should name the precise command, table query and operator responsible for declaring recovery complete.

Further reading: Dagster schedules and sensors ↗

##### Worked evaluation: a partitioned customer asset

Suppose Dagster materializes a customer_metrics asset daily, with an upstream raw_customers asset, a freshness expectation, checks on unique customer IDs and a downstream dashboard asset. The asset is partitioned by date and triggered by a schedule. Record the graph, partition definition, checks, materialization metadata, storage target and consumer before proposing Hydra. A Hydra job may compute the daily table, but replacing the Dagster asset wrapper would also affect lineage, run history and backfills. These are separate migration decisions.

For the hybrid design, keep the Dagster asset definition and call hdrctl from its compute function. Pass the partition key explicitly, point Hydra to an isolated destination and require a successful exit status. Before emitting a materialization, query the target partition for expected columns, non-null keys and row count. Attach the Hydra run report path and batch ID to Dagster metadata. This keeps the catalog useful while moving supported extraction and transformation logic into declarative Hydra job files.

Use three partition fixtures: a normal day, a day with a null customer ID and a historical day with a late correction. Run the old asset and Hydra-backed asset against separate targets. Compare rows by customer ID, output schema, check results and freshness signals. Rerun the historical partition and ensure neither implementation overwrites unrelated dates. If the Hydra destination mode affects the entire table rather than a selected partition, redesign the publish boundary before calling it equivalent.

Introduce a destination outage after Hydra has written part of a partition. Dagster should mark the asset run failed and prevent downstream assets from treating the partition as fresh. Retry the selected partition and compare unique keys and materialization events. Also test a validation error that should not be retried as a transient outage. If Dagster and Hydra both have retries configured, make one layer the owner for this boundary to avoid duplicate loads and confusing incident history.

To evaluate a full Dagster replacement, add a sensor-driven run and a backfill of two historical partitions. Compare event handling, partition selection, lineage, checks and operational visibility under the proposed Hydra workflow. A simple schedule may map cleanly while a custom sensor or asset catalog dependency may not. Keep Dagster where those capabilities are central; the successful outcome may be an integration in which Dagster orchestrates and Hydra computes.

At cutover, preserve the prior asset implementation, schedule and target. Record the last partition produced by the old computation and the first produced by Hydra. A rollback restores the prior asset body or consumer target, reconciles affected partitions and re-runs checks before declaring recovery. The evaluation report should identify exactly which asset and graph boundary changed. That is the actionable answer to searches about Dagster assets, Hydra ETL jobs, partition backfills and coexistence.

Related product documentation: Dagster asset jobs and partitions ↗

##### Decision criteria for an existing Dagster deployment

A Dagster decision should name the asset key and graph boundary. Moving the compute body to Hydra while preserving the asset wrapper is a materially different change from retiring Dagster’s catalog, checks and automation. Record partitions, freshness expectations, downstream assets and materialization metadata for the candidate. If the organization uses those features to operate data products, a hybrid design can retain them while simplifying the supported ETL implementation. The evaluation must explain which layer owns each responsibility.

Historical partitions are an essential test. A current-day fixture may match while a backfill overwrites the wrong table or fails to reproduce an old partition. Pass a partition key explicitly, verify the target location and rerun an earlier partition after a correction. Compare Dagster checks and lineage as well as rows. If a sensor starts the asset, test duplicate and late events. These cases provide far stronger evidence than a single successful materialization or a comparison of Python against YAML length.

The support plan should link a Dagster run ID to the Hydra report, target partition and data-quality result. Decide which layer retries a failed write and when an asset may be marked materialized. Preserve the old asset implementation and target until a rollback drill has passed. A professional reader can then judge whether Hydra is best used as the ETL body inside Dagster or whether a bounded workflow can be moved entirely without losing required asset operations.

##### Where each approach fits

##### Keep Dagster when

Keep Dagster where consumers rely on the asset graph, partitions or materialization history.

##### Evaluate Hydra when

Move a linear intermediate transformation that does not need to be an independently tracked asset.

##### Should you replace Dagster with Hydra ETL?

Keep Dagster where consumers rely on the asset graph, partitions or materialization history. Move a linear intermediate transformation that does not need to be an independently tracked asset. For a first test, classify real data assets versus intermediate frames. See the complete integration plan.

##### Frequently asked questions about Dagster and Hydra ETL

These answers cover product fit, data movement, orchestration, migration testing and rollback. Check the linked product documentation for version-specific behavior.

Can Hydra replace a Dagster asset?
Hydra can produce the same physical dataset for some ETL workloads, but it does not automatically replace the asset key, materialization history, partition status or lineage. Keep those requirements explicit when considering migration.

How it works: A Dagster asset names a data product with materialization and lineage metadata. A Hydra job can produce the underlying table or file, but replacing the asset also requires deciding how Dagster consumers receive status, partition and metadata.

Practical check: Identify the asset key, partitions, checks, upstream dependencies and downstream consumers. Pilot Hydra as the producer while Dagster retains the asset wrapper. Compare the materialized data and metadata after a successful and failed run.

Pitfall to avoid: Do not treat the output table alone as the entire asset contract. Removing a Dagster asset can break lineage views, schedules or sensors even when the rows are identical. Preserve observability until a replacement is proven.
Can Dagster run a Hydra job?
Yes. An asset or op can invoke hdrctl through a checked subprocess or shell integration. The execution environment needs the CLI, project files and access to the same data sources and destinations.

How it works: A Dagster op or asset can invoke hdrctl, making Hydra responsible for ETL execution while Dagster maintains asset materialization and scheduling. The CLI return status must determine the Dagster run outcome.

Practical check: Package a pinned Hydra project, pass partition key and environment explicitly, and capture the Hydra report as Dagster metadata. Verify that a failed load does not emit a successful materialization. Retry with the same immutable input.

Pitfall to avoid: Avoid a wrapper that logs an error but returns success. Do not enable a second Hydra schedule for the same asset. Keep secrets in the runtime’s secret facility rather than asset source code.
What happens to Dagster lineage?
It remains in Dagster only for assets still represented and materialized there. A Hydra job report is not the same as an asset graph. A hybrid design can retain the Dagster asset key while delegating computation to Hydra.

How it works: Dagster lineage connects asset keys, partitions and materialization events. A standalone Hydra job has its own execution report but does not automatically preserve those Dagster relationships.

Practical check: Inventory asset dependencies and downstream sensors before migration. If Dagster remains, materialize the asset after Hydra succeeds and attach run ID, row count and output URI. If Dagster is removed, design equivalent discovery and impact tracking.

Pitfall to avoid: Do not assume a table name is sufficient lineage. Losing partition-aware materialization events can make backfills and incident diagnosis harder. Keep metadata continuity through the pilot.

For a partitioned asset, preserve the relationship between the specific Hydra run and its Dagster materialization event. Include the source partition, target version and validation status so backfills and incident reviews remain traceable after the compute implementation changes.
How should partitions be passed to Hydra?
Pass a stable partition key or date as an explicit parameter and use it in source filtering and output paths. Test normal, late and missing partitions before replacing partitioned Dagster automation.

How it works: Dagster partitions identify slices such as dates or regions. Hydra needs the selected partition as an explicit run parameter and must constrain extraction and destination writes to that slice.

Practical check: Pass the partition key and interval bounds into Hydra. Test adjacent dates, daylight-saving boundaries and an overlapping rerun. Verify that the output partition contains only the expected keys and that another partition remains unchanged.

Pitfall to avoid: A global replace during a partition retry can delete unrelated history. Do not derive the partition from wall-clock now, especially during backfill. Record the partition in both run histories.
Should sensors move to Hydra triggers?
Only after their event, run-key, deduplication and failure behavior is mapped. In a first pilot, keep the Dagster sensor and invoke Hydra inside the resulting run.

How it works: Dagster sensors evaluate external conditions and can launch asset runs with cursors. Hydra triggers may cover some schedules or events, but sensor state and run-key deduplication need explicit migration.

Practical check: Document the sensor cursor, event payload, polling interval and idempotency key. Test duplicate and delayed events before switching ownership. Keep Dagster as the sensor when its custom logic remains valuable.

Pitfall to avoid: Do not replace a stateful sensor with a simple cron because both run frequently. That can miss late events or process incomplete files. Preserve one authoritative event owner.
Can I consolidate intermediate Dagster assets?
Possibly, when they are implementation details rather than published data products. Confirm that no checks, consumers, partition reports or audits rely on their individual materializations.

How it works: Intermediate assets may exist for reuse, caching, lineage or checks. A single Hydra job can consolidate private intermediates, but shared assets remain contracts for other consumers.

Practical check: Map each intermediate asset’s readers, checks and materialization frequency. Consolidate only those without external consumers, then compare final rows and diagnostic visibility. Retain an output boundary where teams need independent access.

Pitfall to avoid: Removing an asset can hide a meaningful quality gate or force expensive recomputation. Do not optimize the graph purely by reducing nodes; measure reuse and failure isolation.
How do asset checks interact with Hydra?
Keep Dagster checks around the output produced by Hydra or replace them with an explicitly reviewed quality mechanism. Do not mark an asset successful based only on a zero exit code if the target data contract needs verification.

How it works: Dagster asset checks report data quality separately from materialization. A Hydra job can run validation, but the result must be surfaced to Dagster if existing consumers or alerts depend on check status.

Practical check: List checks, thresholds, severity and blocking behavior. Execute the same fixture through both paths, including a deliberately bad batch. Attach Hydra validation results to the Dagster asset or migrate alerts deliberately.

Pitfall to avoid: Do not mark an asset materialized when a required check failed. A count-only comparison can miss null, uniqueness or freshness failures. Define whether failed quality checks block publication.

If a check is advisory rather than blocking, preserve that distinction. Operators need to see both the materialization and the failed check; otherwise a green job can conceal a quality regression that Dagster previously highlighted.
Is Hydra simpler than Dagster for every pipeline?
No. Hydra may simplify a small source-to-destination ETL chain. Dagster’s asset model and catalog can make a complex data product graph easier to understand and operate.

How it works: Simplicity depends on the graph and organization. Hydra can make a focused ETL pipeline concise, while Dagster provides asset-oriented lineage, partitions and software-defined asset operations that may be central to the team.

Practical check: Compare time to implement, operate and debug one actual pipeline. Include partition backfill, checks, ownership and observability. Consider a hybrid asset that delegates data processing to Hydra before considering platform replacement.

Pitfall to avoid: Do not generalize from YAML line counts or a single isolated table. A platform migration can remove important metadata and operational practices even if the ETL code becomes shorter.
Does the simulator model asset lineage?
No. It computes one sample transformation locally. It does not run Dagster, record materializations, evaluate checks or show partition history.

How it works: The browser simulator shows a small data transformation and code illustration. It does not create Dagster assets, evaluate their checks or model partition lineage and daemon scheduling.

Practical check: Use it to inspect transformation intent, then test a real Dagster asset backed by Hydra. Compare materialization metadata, partition behavior, errors and output data in the actual runtime.

Pitfall to avoid: Do not cite simulator timing as a Dagster benchmark. It excludes daemon, executor, storage and network behavior. Keep any performance comparison tied to a documented dataset and hardware.
What is a safe rollback after a hybrid pilot?
Keep the previous asset implementation. Disable the Hydra call, restore the original compute path and rematerialize affected partitions while preserving the same Dagster asset keys for consumers.

How it works: A hybrid pilot can roll back by restoring the prior asset implementation and consumer target while retaining its asset key and schedule. The processed partition boundary determines what must be replayed.

Practical check: Save the previous code, resource configuration and target snapshot. Stop Hydra writes, point the asset back to the old implementation, and reconcile affected partitions. Verify both data and materialization status before closing the pilot.

Pitfall to avoid: Do not overwrite the old target during the trial. If the old asset remains green while the new producer fails, dashboards may show misleading freshness. Keep pilot materializations distinguishable.

###### Migration and integration questions

How do you run a Hydra ETL job from Dagster?
Invoke hdrctl from a Dagster op or asset execution environment, capture its exit status and surface logs. Declare the resulting table or file as the asset boundary so downstream materializations wait for success.

How it works: Dagster can launch a Hydra ETL project from an asset or op. A stable partition and batch ID link the two reports, while the process status determines whether Dagster emits a materialization.

Practical check: Pin the Hydra version and project artifact. Pass partition bounds and environment, capture structured output and attach row count and target URI to asset metadata. Test a failed command and a repeated run.

Pitfall to avoid: Do not place credentials in CLI arguments or log full environment variables. A subprocess wrapper that swallows a nonzero exit can falsely publish a Dagster asset.

Save the actual target version in asset metadata, not just the intended table name, so a failed or retried run can be distinguished from the published one.
Can Hydra ETL replace Dagster?
Hydra can coordinate supported ETL workflows, while Dagster provides asset-oriented orchestration and lineage. Consider replacement only for a bounded workflow whose asset graph, schedules and operational needs can be reproduced.

How it works: Hydra can replace the transformation and loading work behind some Dagster assets, but Dagster also models lineage, partitions, checks and orchestration across many systems. Replacement scope is per graph and consumer need.

Practical check: Inventory which Dagster features are actually used. Pilot one asset with realistic partitioning and checks, then compare operation and recovery with the hybrid design. Keep Dagster where its asset semantics remain valuable.

Pitfall to avoid: Avoid a universal replacement claim based on a small pipeline. Removing a central asset can break downstream schedules or metadata consumers without changing the final table’s contents.

Keep asset owners involved in the decision.
How do Dagster assets map to Hydra jobs?
A Hydra job can produce a table or file corresponding to an asset, but Dagster asset definitions also encode dependencies, metadata and materialization history. Record those before moving ownership to a Hydra workflow.

How it works: A Dagster asset represents a named data product; a Hydra job performs an ETL process. One asset may call one job, or a job may publish several outputs that need separate asset boundaries.

Practical check: Map asset keys and partitions to Hydra outputs and run IDs. Preserve the declared upstream dependencies in Dagster if it remains the orchestrator. Compare output schema, row counts and quality checks.

Pitfall to avoid: Do not map solely by matching names. A single Hydra job may update multiple tables, causing Dagster to mark an asset complete before every output is ready. Define an atomic publish signal.

Record multi-output publication order.
Can Dagster orchestrate Hydra YAML pipelines?
Yes. Keep Dagster as the schedule owner and call the Hydra CLI in a task or asset, with the project files and secrets present in the run environment.

How it works: Dagster can orchestrate Hydra YAML through a task that invokes the Hydra CLI with explicit project and environment settings. Dagster owns the run graph; Hydra owns the ETL semantics.

Practical check: Use an immutable deployment artifact, pass partition parameters and propagate exit status. Save the Hydra report alongside Dagster metadata and set a timeout appropriate to the job. Test worker interruption and retry.

Pitfall to avoid: Avoid duplicate schedules and mutable latest images. A retry against a changed input or code version cannot reproduce the original run. Keep the input snapshot and runtime pinned.
How do Dagster schedules and sensors compare with Hydra triggers?
Compare the event source, time zone, missed-run behavior, concurrency and retry policy. A simple cron schedule may migrate easily, while a custom sensor requires a separate design and test.

How it works: Dagster schedules launch runs by time, while sensors react to observed state and may retain cursors. Hydra triggers can cover some events, but the filtering and deduplication contract must be checked separately.

Practical check: Record schedule timezone, partition mapping, sensor cursor and run key. Simulate a late file, duplicate event and missed interval. Choose one trigger owner after comparison and monitor for unexpected extra runs.

Pitfall to avoid: Do not replace a sensor with a cron just because both run daily. Polling logic may wait for completeness. A duplicate launch can cause an append target to double rows.
What happens to Dagster lineage if a pipeline moves to Hydra?
Dagster lineage is not automatically transferred by replacing an asset body with a Hydra job. Keep an asset wrapper or create an explicit metadata integration if lineage and materialization history must remain visible.

How it works: Lineage in Dagster includes upstream and downstream asset relationships plus materialization history. Moving processing to Hydra does not automatically move that metadata; it must be preserved in Dagster or replaced intentionally.

Practical check: Keep a Dagster asset wrapper during the pilot and attach Hydra run ID, schema and row count. Test that downstream assets start only after Hydra publishes successfully. Document an alternative lineage source before removing the wrapper.

Pitfall to avoid: A data table with correct rows can still be operationally invisible. Losing lineage hinders impact analysis, backfills and ownership. Do not remove metadata producers without consumer review.

Export historical metadata before retiring an asset wrapper.
Should Dagster remain in a Hydra ETL architecture?
Keep Dagster when asset cataloging, partitioned assets, sensors or cross-system orchestration are central. Hydra can own the ETL implementation of selected assets while Dagster keeps the graph.

How it works: Dagster can remain the asset catalog and scheduler while Hydra handles the ETL implementation. This is often a low-risk boundary because only one asset’s compute step changes initially.

Practical check: Choose an asset with a bounded input and clear checks. Run Hydra into a separate target, then attach the result as a Dagster materialization after validation. Keep one retry policy and a stable partition key.

Pitfall to avoid: Do not leave Dagster and Hydra both scheduling the same data product. Duplicate ownership complicates incident response. Record which platform’s status is authoritative for consumers.
How do Dagster partitions affect a Hydra migration?
Record partition keys, partition windows and backfill semantics. Pass the partition context explicitly to the Hydra run and compare outputs for normal, late and replayed partitions before cutover.

How it works: Partition migration must preserve slice identity, interval boundaries and write isolation. A Hydra job receives those values through parameters; it does not infer a Dagster partition solely from the table name.

Practical check: Pass the Dagster partition key, start and end timestamps and output path explicitly. Test a backfill and an overlapping retry. Verify that the target updates only the intended partition and that checks remain partition-aware.

Pitfall to avoid: A global replace or default current date can corrupt unrelated partitions. Beware timezone conversions at midnight. Log the effective interval in both systems for diagnosis.
What should a Dagster-to-Hydra pilot verify?
Verify output rows and types, asset dependency order, failure visibility, retry behavior and lineage requirements. Test at least one failed run and one rerun, not only a successful first materialization.

How it works: A useful pilot verifies data parity, asset metadata, retries and checks. A single happy-path materialization proves only that the wrapper can call Hydra once.

Practical check: Use a fixture with nulls, duplicates and late updates. Compare schema, keys and aggregates after two runs; fail a check deliberately and confirm no false materialization. Measure resource use and operator recovery time.

Pitfall to avoid: Avoid only comparing row count. Wrong key selection or changed null semantics can pass. Include a rollback drill and ensure the old asset code remains deployable.

Add one partition backfill to the trial before cutover.
How do you roll back from a Hydra-owned Dagster asset?
Preserve the prior asset implementation and its storage target. Stop the new Hydra schedule, restore the Dagster asset body or prior deployment and reconcile any partitions or rows produced during the transition.

How it works: Rolling back a Hydra-owned asset restores the prior compute implementation, target route and partition processing position. Dagster materialization metadata must continue to describe the data consumers actually read.

Practical check: Stop the Hydra writer, restore the old asset code and resource configuration, and rerun only affected partitions. Compare target checksums and freshness metadata before republishing. Keep the pilot output isolated for investigation.

Pitfall to avoid: Do not report a successful Dagster materialization for a target that has already been switched back or failed validation. Concurrent writers and stale metadata can make a rollback look complete when consumers still see mixed data.

Sources and method
The product descriptions were checked against the vendor references below and the Hydra DSL documentation. The comparison concerns the stated workflow, not all features or editions. The browser simulator is neither an engine run nor a performance benchmark.

Dagster: asset jobs ↗

Dagster asset jobs ↗

Dagster schedules and sensors ↗

Dagster webserver and asset catalog ↗

Dagster shell integration ↗

02 / Try

#### Dagster vs Hydra: sample pipeline

#### Same small batch, two definitions

Read 14 sample orders, keep amounts above 50, sum by status and sort by total. Right-click inside either editor or use ⋯ for its line actions. Edit the Hydra threshold to recalculate the result; the source threshold follows where the displayed example includes one. The browser models this fixture and does not run either product.

Browser simulation

DagsterAsset-oriented orchestration
⧉↓⬡⤢⋯

from dagster import asset, Definitions

@asset
def orders_by_status():
orders = read_orders()
big = orders[orders.amount > 50]
return big.groupby("status").amount.sum()

defs = Definitions(assets=[orders_by_status])
CopyDownloadIllustrative example

Hydra ETLYAML job files
✓▶⇢⧉⤢⋯

# sources.yaml
sources:
orders:
type: csv
extract:
table: data/orders.csv

# pipeline.yaml
pipeline:
from: orders
to: report

# transformations.yaml
steps:
- cast:
mapping: { amount: float }
- filter:
expr: "amount > 50"
- aggregate:
by: [status]
agg:
total: { func: sum, col: amount }
- sort:
by: [total]
ascending: false

# destinations.yaml
destinations:
report:
type: csv
load:
table: data/by_status.csv
mode: replace
Run sampleResetCopyDownload textRunnable ZIP

Lines in these examples Dagster / Hydra

Files representedExample / 4 Hydra files

Run scope14 browser-local rows

Line counts are live counts of the text shown above, not a product benchmark. The Dagster pane is illustrative and is not executed. The Hydra pane shows four files in one editor for comparison; only the displayed cast, filter, aggregate and sort operations are simulated. “Download text” includes your edits; “Runnable ZIP” contains the original four files and input CSV, validated with Hydra 0.22.0.

##### Simulated run result
×

StatusTotal

×

03 / Integrate

#### Introduce Hydra in a Dagster environment

Start with a reversible pilot. Keep the current system running until the new output and failure behavior are verified.

##### Before you change a schedule or destination

A Dagster asset/job selection with upstream and downstream asset keys.

Schedules, sensors, partitions, checks and materialization metadata for that selection.

A Hydra job with a separate destination and a stable path in the Dagster execution environment.

A frozen fixture and acceptance query for the published asset.

##### Step-by-step integration and migration

01

###### Classify assets

Draw the Dagster asset graph around the candidate. Mark published data products, consumers, partitions and checks. Choose a private linear intermediate chain for a replacement pilot, or retain the final asset as Dagster-owned for a hybrid pilot.

02

###### Build the Hydra ETL slice

Implement the source-to-destination operation in Hydra YAML and validate it strictly. Use a separate target so the existing asset remains untouched. Test on a frozen input and compare the final table or file by business key.

03

###### Invoke from the existing asset

Install hdrctl in the Dagster execution environment and call it from an asset or op with a checked subprocess. Pass an explicit partition or batch identifier. Keep Dagster’s schedule or sensor active and do not add a second Hydra trigger.

04

###### Verify before materialization

After hdrctl succeeds, query or read the destination to confirm the expected partition, row count and schema. Only then report the Dagster asset as materialized. Preserve existing asset checks and metadata where they still apply.

05

###### Test historical and failed runs

Run a normal partition, a missing partition and a retry after an intentional Hydra failure. Compare Dagster run state, Hydra output, asset check result and any duplicate materialization events.

06

###### Choose the long-term graph

Keep Dagster when its asset catalog, lineage and automation are valuable. If moving a whole chain to a Hydra workflow, document replacement observability and disable the corresponding Dagster schedule only after parallel evidence.

##### A Dagster asset that delegates ETL to Hydra

import subprocess
import dagster as dg

@dg.asset
def orders_by_status():
subprocess.run(
["hdrctl", "validate", "/srv/hydra/orders", "--strict"],
check=True,
)
subprocess.run(
["hdrctl", "run", "/srv/hydra/orders"],
check=True,
)
# Verify the output before treating the asset as materialized.

defs = dg.Definitions(assets=[orders_by_status])

Adapt the paths, project files and credentials to your deployment. The runnable orders fixture ZIP is a safe starting point for the Hydra side; its local YAML was validated with Hydra 0.22.0.

##### Acceptance checks before cutover

The Dagster asset fails if hdrctl exits nonzero.

Materialization is recorded only after output verification.

Partition and freshness expectations still hold.

Existing asset checks and downstream dependencies remain valid.

Dagster and Hydra do not schedule duplicate builds.

##### Rollback plan

Restore the prior asset implementation or job revision, disable the Hydra invocation and rematerialize only affected partitions. Preserve the existing Dagster asset keys, checks and schedule definitions during the pilot so downstream consumers continue to recognize the asset.

##### Practical pitfalls

Do not collapse a meaningful asset graph into one opaque job.

Preserve partition and materialization semantics.

Compare lineage needs before migration.

Build the pilot
Use the CLI reference to create and validate a project, then use the DSL guide for source, transformation and destination syntax.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra ETL vs dbt — slug: /migrate/dbt/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All comparisons
Compare with Hydra ETL
Explore Hydra CLI ↗

Compare & migrate/dbt

Product comparison · Warehouse transformation

### Hydra ETL vs dbt

dbt transforms data in a warehouse using SQL models and provides tests, documentation and lineage features. Hydra moves and transforms data across sources and destinations. They overlap for simple transformations, but often work better together: Hydra can prepare or load data while dbt retains warehouse models and tests.

Scope: A simple warehouse model versus a Hydra extract-transform-load job. Reviewed 17 November 2026

Comparison Simulator Migration & integration

01 / Compare

#### Where the tools overlap and diverge

Short answer
dbt transforms data in a warehouse using SQL models and provides tests, documentation and lineage features. Hydra moves and transforms data across sources and destinations. They overlap for simple transformations, but often work better together: Hydra can prepare or load data while dbt retains warehouse models and tests.

Product contextCapabilitiesDetailed analysisTechnical evaluationWorked exampleDecision20 questions

##### What dbt does, and what Hydra changes

dbt and Hydra overlap at the word “transformation,” but their data boundaries differ. dbt models transform data inside a supported warehouse or database using SQL and materializations. Its graph also includes tests, sources, snapshots, exposures and documentation. Hydra can read from supported systems, transform with its DSL and write to destinations, then orchestrate project jobs and actions. A dbt estate should usually be integrated before any model is considered for replacement.

The most common useful boundary is an ingestion handoff: Hydra loads or prepares a source table, then dbt builds the downstream analytical models. This keeps dbt’s model tests and exposures intact. A second boundary is a file export after dbt, which Hydra can deliver to another destination. Replacing a dbt model is justified only when the model is simple, isolated and its test and lineage responsibilities are reassigned.

The sample simulator filters and aggregates a tiny order file. A dbt SQL model could produce the same final rows in a warehouse, but the browser example does not represent dbt materialization, incremental models, warehouse optimizer behavior or test execution. Those are significant parts of a production comparison.

##### What both can do

Declare repeatable transformations

Keep definitions in Git

Build dependency-aware data workflows

##### Key differences

AreadbtHydra ETL

ComputeSQL executed by the warehouseHydra engine executes ETL steps

Data movementModels operate on warehouse dataJobs read and write supported sources and destinations

QualityBuilt-in model and data testing ecosystemJob validation and run reports; different test surface

Best fitWarehouse modeling and analytics contractsCross-system ETL and workflow coordination

##### Detailed comparison for a production decision

###### Transformation location and compute

dbt compiles model SQL and asks the warehouse to execute it. That makes the warehouse’s SQL dialect, access control, materialization and optimizer part of the result. Hydra executes its supported ETL steps in its engine and can write to a warehouse or file. A comparison should specify whether the data is already in a warehouse or must first be moved there.

If the source is a CSV and the target is another file, dbt would require a loading boundary before its SQL model. If the source is already a warehouse table with many downstream models, dbt can be a natural place to keep the transformation. Count all components required for the full workflow, but do not attribute an unrelated ingestion tool’s behavior to dbt itself.

Product documentation: dbt data tests ↗

###### Tests, lineage and consumers

dbt data tests can assert conditions on models, sources, snapshots and seeds. Exposures describe downstream uses such as dashboards. The ref() graph makes dependencies explicit and lets teams select related models. Removing one model can therefore break a test, a selector, a consumer or documentation even when its SQL is short.

Before moving a model, inspect its parents, children, tests and exposures. If it is a published analytical contract, keep it in dbt. A Hydra job can own ingestion or pre-cleanup and leave the dbt model as the authoritative published dataset.

Product documentation: dbt data tests ↗

###### Incremental and historical behavior

An incremental dbt model uses SQL filters and often a unique key so subsequent runs process only the intended rows. Snapshots serve historical change tracking. A Hydra upsert may keep a target current, but it does not automatically reproduce an incremental model’s is_incremental() predicate or snapshot history.

If replacing a model, test first build, a second build with a changed row, a full refresh and late-arriving data. Inspect the resulting table and downstream dependencies. For history, compare validity intervals or snapshot semantics explicitly; a current-state table is not a substitute for a historical one.

Product documentation: dbt incremental models ↗

###### A practical shared architecture

Hydra can own a bounded extract-and-load job into a raw or staging table. On successful completion, the existing scheduler can call dbt build for the relevant model selection. dbt build runs selected resources and their tests according to its selection rules. This keeps one quality gate for warehouse models while Hydra owns the cross-system movement.

Define one handoff contract: table name, schema, update cadence, transaction visibility and the condition that means data is ready. Keep a single schedule owner. If dbt already runs through Airflow, it may be simplest to add a Hydra task before the dbt task rather than moving the entire schedule.

Product documentation: dbt build command ↗

###### When to migrate a simple model

A model that only filters and groups a single source may be a reasonable Hydra candidate if no downstream ref(), test, exposure or BI reader depends on the intermediate relation. Even then, verify data types, null grouping, sort order and destination mode. The existence of a short SQL query does not itself make migration beneficial.

Prefer coexistence when dbt’s tests, documentation and lineage are already delivering value. A migration should remove a concrete operational cost or simplify a cross-system boundary; it should not remove a working analytical contract to make a comparison chart look favorable.

Product documentation: dbt exposures ↗

##### Technical evaluation: dbt and Hydra ETL in production

###### dbt and Hydra operate at different data boundaries

dbt normally transforms relations that already exist in a warehouse or query engine. Its models use SQL and references to define a dependency graph. Hydra ETL can read from a supported file, database or API source, apply supported transformations and write to a destination. The first architecture question is therefore where the data becomes available to SQL. If an upstream system requires extraction and transport, a dbt model alone does not perform that transport; if the data is already in the warehouse, a second ETL engine may add no value.

Draw the actual path from source application to raw landing table, staging model, mart and dashboard. Mark the system that owns each boundary. A useful Hydra-plus-dbt pattern is Hydra loading a clearly named staging relation and dbt building its existing SQL models from that relation. A replacement pattern is narrower: move one simple model into Hydra only when its SQL, materialization, tests and lineage requirements can all be retained or consciously redesigned. This distinction answers “Hydra vs dbt” without pretending the tools have identical jobs.

Further reading: dbt build ↗

###### Materialization is part of the model contract

A dbt model may be a view, table, incremental table or ephemeral expression. The SQL alone does not describe the entire behavior. A view recalculates when queried; a table is persisted at build time; an incremental model selects and writes a subset on later runs. Hydra destination modes describe how a job writes a supported target, but they do not automatically recreate dbt materialization, warehouse-specific SQL compilation or adapter behavior.

For the candidate model, record its materialization, unique key, source filters, pre- and post-hooks, target schema and consumers. Run the original model twice and inspect both its relation type and rows. Rebuild the candidate as a Hydra job in a separate schema, then compare a changed source row and a repeated run. A migration that produces the right first snapshot but turns a live view into a stale table changes the product contract even if every value matched at the moment of comparison.

Further reading: dbt incremental models ↗

###### Incremental models, snapshots and history are distinct

dbt incremental models can keep a current-state table by processing new or changed rows. Snapshots capture versions over time and answer a different question: what a row looked like at an earlier point. Hydra upsert can update destination keys, but it does not create a historical snapshot contract or choose the correct source delta by itself. A technical comparison must separate extraction window, current-state update and historical preservation rather than calling all three “incremental loading”.

Design a test with a customer moving from trial to active and then to cancelled, including a late correction to the first state. Compare the current-state table and any history table after each run. Document how the existing dbt snapshot decides that a value changed, which timestamp it records and whether the candidate Hydra design must keep dbt snapshotting downstream. Often the best integration is to preserve the snapshot and make Hydra improve the upstream feed; replacing history machinery is unnecessary risk.

Further reading: dbt incremental models and snapshots ↗

###### The unique key needs an explicit quality test

A dbt incremental model can use unique_key to match incoming rows to existing rows. That configuration does not by itself guarantee the source key is unique or non-null. Hydra upsert similarly depends on a stable destination key. The correct migration conversation is about the business grain: one row per order, per order line, per customer and date, or another combination. A key that works on a tiny sample may collide in production.

Add source fixtures with duplicate keys, null keys and a correction to an existing key. Run dbt data tests or equivalent assertions on the staging relation, then observe the chosen dbt incremental strategy and Hydra destination behavior. Compare not just the final count but which version wins and whether an error is raised. If the key definition changes during migration, downstream joins and metrics can change silently. Record the key and its data test as part of the published contract.

Further reading: dbt unique_key ↗

###### dbt tests are a quality gate, not just documentation

dbt data tests can assert properties such as uniqueness, non-nullness and accepted values, including custom SQL assertions. They often gate a downstream build or alert a team that a source contract has changed. If Hydra replaces a dbt model or starts feeding it, those tests should remain in the run sequence or be deliberately replaced with equivalent checks. A successful Hydra process exit means the job ran; it does not prove the warehouse data satisfies all business constraints.

In a shared architecture, run Hydra into staging, then execute dbt build for the relevant models and tests. Capture both exit codes and make the scheduler fail if either stage fails. Test a deliberately duplicated business key and an unexpected status value. The result should show where the bad row is detected and whether any downstream mart was published. This gives the reader a concrete answer to “can Hydra ETL replace dbt tests?”: only with an explicitly implemented quality gate, not merely by translating SQL.

Further reading: dbt data tests ↗

###### Lineage and exposures identify affected consumers

dbt ref() and source() calls make model dependencies visible, while exposures can document downstream dashboards or applications. A dbt model that seems trivial in isolation may be the input to a dozen other models or a dashboard with a contractual refresh time. Before changing its producer, inspect the graph around it and list direct and indirect consumers. The integration boundary should be placed where a stable relation can be published without silently changing column names, grain or freshness.

For a pilot, keep the existing dbt relation name untouched. Let Hydra write to a new staging schema, point a test dbt environment at it and build only the affected graph. Compare model results and test outcomes, then review exposure freshness with the consumer owner. If the project uses dbt documentation as a catalog, note where Hydra-produced tables will be described. A migration plan that ignores lineage can pass row-level tests and still disrupt governance and discovery.

Further reading: dbt exposures ↗

###### Warehouse pushdown changes the performance equation

dbt sends SQL to the warehouse, so joins and aggregates execute where the data resides and use that engine’s optimizer, storage and permissions. Hydra can use its supported execution engines and connectors, but pulling a large warehouse table out to transform it may cost transfer time and memory. A claim that one tool is faster because one example has fewer lines is meaningless. The relevant question is which operations execute where, on how many rows and at what resource cost.

Benchmark a representative partition, not a tiny CSV. Capture source rows scanned, bytes transferred, elapsed time, peak memory and destination rows. If the transformation is a warehouse-specific SQL model, keeping dbt may avoid unnecessary movement. If the job crosses systems and applies a bounded transform before loading, Hydra may simplify the transport and preparation stage. State the data volume and environment in any published comparison so a professional can judge whether it resembles their workload.

Further reading: dbt build ↗

###### A second run exposes write-mode differences

Initial equality is weak evidence for an incremental model. The second run should update an existing key, add a new one and include a row outside the expected incremental predicate. Compare both the dbt model’s final relation and the Hydra target. If dbt uses merge, inspect how duplicate keys within the new batch are handled. If Hydra uses upsert, verify the database constraint and null-key behavior. Record which system selects the input delta and which system writes the result.

A third run should fail after some work has begun. Observe whether the published relation changed, whether dbt or Hydra can be rerun safely and whether a model test catches the incomplete state. If the failure recovery differs, design a staging-and-publish boundary instead of claiming identical semantics. The migration guide should explain these experiments because production data teams care about idempotency and recovery more than a one-time SQL-to-YAML translation.

Further reading: dbt incremental models ↗

###### One orchestrator should own the Hydra-to-dbt sequence

A common hybrid deployment keeps dbt models and uses Hydra to extract, clean and load their source data. The sequence is simple in principle: validate the Hydra project, run the ingestion job, verify the staging table, run dbt build and inspect tests. In production, ownership matters. If both tools independently schedule at 06:00, dbt may read yesterday’s staging data or run during an incomplete load. A single orchestrator should control dependencies and retries.

Assign a batch or partition identifier and publish it only after the Hydra load succeeds. Pass the same identifier to the dbt build where the model supports a bounded selection. Test a Hydra failure: dbt must not start. Then test a dbt test failure: the run must be marked unsuccessful without rerunning extraction unnecessarily. Keep logs and run IDs connected so an operator can distinguish ingestion defects from model defects. This is the concrete integration path for a team already invested in dbt.

Further reading: dbt build command ↗

###### Choose replacement only after an explicit decision record

A dbt model should move to Hydra only when the source and destination are supported, SQL semantics are reproducible, its materialization can be matched, quality tests remain effective and downstream lineage has an owner. This often describes a small preparation model, not a large warehouse mart. Document the alternative of keeping dbt and feeding it better data from Hydra. A neutral comparison is more useful than a universal “Hydra replaces dbt” assertion.

The decision record should name the candidate model, current materialization, key, source relation, tests, affected exposures, sample data, output diff and operational owner. It should also state the rollback: stop the Hydra producer, restore the old source relation or model definition, rerun dbt tests and reconcile the cutover interval. If the team cannot prove the same grain and freshness, keep the existing dbt model while improving the ingestion boundary first.

Further reading: dbt exposures ↗

##### Worked evaluation: a daily revenue model

Suppose a dbt project builds a daily_revenue model from staged orders, groups by order_date and country, and publishes totals to a dashboard. The model has a not_null test on order_date, a uniqueness test on the date-country grain and an exposure for the dashboard. Its materialization is incremental with a unique key. A Hydra pilot must begin by recording these properties, because translating the SELECT statement alone would omit the source freshness expectation, materialization behavior, tests and affected consumer. Capture a baseline build and the physical destination relation.

The lowest-risk integration leaves the dbt model in place. Hydra reads a supported upstream source, casts amount, filters invalid orders and loads a separate staging table. The dbt source declaration is then pointed to that table in a test environment. Run hdrctl validate and the ingestion job, verify the staging schema, then run dbt build for the affected graph. This sequence answers how Hydra ETL and dbt work together: Hydra owns transport and preparation; dbt retains warehouse SQL, tests and lineage. A single orchestrator must own the dependency so dbt never reads half-loaded staging data.

For a replacement experiment, build a separate Hydra target at the same grain. Use orders on two dates in two countries, including a refund, null country and duplicated order ID. Compare grouped totals, row keys, column types and rounding. Run the existing dbt tests against the candidate relation where possible. A matching total can hide one missing refund and one duplicate sale that cancel each other, so compare source-to-group reconciliation as well as final sums. A developer should be able to trace which raw orders contributed to each published total.

On the second run, change an order amount, add a new order and leave one old order untouched. Inspect the dbt incremental predicate, merge strategy and unique key, then the Hydra source-read rule and destination write mode. If Hydra rereads the full input and upserts, that may be acceptable for a small table but expensive for a large warehouse. If it reads only new timestamps, it may miss a late correction. The test needs an explicit update and late-arrival policy; “incremental” is not a complete technical specification.

Deliberately fail the staging load and confirm dbt does not build from stale or partial data. Then let Hydra succeed and make the dbt uniqueness test fail. The orchestrator should report the overall run as failed without repeating extraction unnecessarily. Capture both run IDs and the last valid published model. This drill demonstrates whether the hybrid pipeline protects the dashboard during failures and whether operators can restart the failed stage without duplicate writes.

A full model migration is justified only if the warehouse SQL, tests, freshness, materialization and exposure contract can be preserved or deliberately replaced. For most established dbt estates, keeping dbt for the revenue model and inserting Hydra upstream is the more targeted change. At cutover, preserve the previous staging relation and dbt configuration; rollback restores the source reference and reruns tests before republishing the dashboard. The conclusion is based on a named model, not a universal claim that YAML ETL supersedes warehouse modeling.

Related product documentation: dbt incremental models and tests ↗

##### Decision criteria for an existing dbt deployment

A final dbt review should distinguish model logic from warehouse governance. A SQL transformation may be easy to restate as Hydra steps while its tests, documentation, lineage and exposures remain embedded in dbt. Record whether the team actually intends to move those responsibilities. If not, integrate Hydra as a source producer and retain dbt for the published model. This protects downstream users who rely on dbt’s graph to understand where a metric came from and when it was last built.

Evaluate compute cost using the real warehouse and row volumes. A dbt model can push a large join to the warehouse; pulling that relation through an external engine may increase transfer and memory cost. Conversely, a small cross-system preparation job may be easier to run before data reaches the warehouse. Compare bytes scanned, bytes moved, elapsed time and target freshness for the same input interval. No general speed ranking follows from the orders simulator or the length of a YAML file.

The design record should name the source relation, model grain, materialization, unique key, tests, exposure and owner. For a hybrid pipeline, add the Hydra staging contract and orchestration dependency. For replacement, show the old and new output diff across first run, update, late arrival and failure. If a dbt test still supplies the decisive quality gate, keep it in the sequence. This makes the comparison useful for an engineer choosing an architecture rather than a vendor winner.

A change in ownership also changes who approves SQL or YAML reviews. Document whether analysts can still see the model logic and lineage they use to validate a metric. Keep the dbt source and model documentation current when Hydra begins producing a staging table. Add a runbook entry for a stale staging table, a failing dbt test and a corrected historical partition. These practices maintain the trustworthiness of the published metric after the integration, which is the real reason to compare the two tools.

##### Where each approach fits

##### Keep dbt when

Keep dbt models with tests, exposures, documentation or downstream ref() consumers.

##### Evaluate Hydra when

Use Hydra for ingestion, file/database movement and simple pre-warehouse cleanup.

##### Should you replace dbt with Hydra ETL?

Keep dbt models with tests, exposures, documentation or downstream ref() consumers. Use Hydra for ingestion, file/database movement and simple pre-warehouse cleanup. For a first test, identify the boundary between ingestion and dbt models. See the complete integration plan.

##### Frequently asked questions about dbt and Hydra ETL

These answers cover product fit, data movement, orchestration, migration testing and rollback. Check the linked product documentation for version-specific behavior.

Is Hydra ETL a replacement for dbt?
Usually it is a complement. dbt specializes in warehouse SQL models and their tests, documentation and lineage. Hydra can move and prepare data before dbt. Replace a model only if its consumers and quality contract have been inventoried and the new behavior has been verified.

How it works: dbt models transform relations through SQL in a warehouse; Hydra can move and transform data across supported files, databases and APIs. Replacing a dbt model also affects materialization, tests, lineage and consumers. The sensible unit of assessment is one model with its dependency graph, not the dbt project as a whole.

Practical check: Record source(), ref(), materialization, unique_key, tests, exposures and the physical table or view. Select a simple model, build an isolated Hydra target and compare values and schema after a first load and an update. Keep dbt for models whose warehouse SQL or governance features remain essential.

Pitfall to avoid: Do not call a matching first-run table a replacement if the dbt view should remain live or a snapshot should preserve history. A Hydra upsert does not reproduce a dbt incremental predicate. Remove no dbt test or exposure until its replacement is documented and the affected consumer has approved the change.
Where should Hydra hand data to dbt?
Use an explicit staging table or file that dbt can declare as a source. Document its schema, update cadence and readiness condition. Run dbt only after the Hydra job has completed successfully.

How it works: The most useful handoff is often a warehouse staging table. Hydra owns extraction, casts and load into that table; dbt declares it as a source and continues to build models and tests. The boundary is a committed relation with a known schema, grain and freshness signal.

Practical check: Create a new staging schema, run Hydra into it, verify required columns and row count, then point a test dbt source declaration at it. Execute dbt build for the affected graph and inspect failing tests. Record a shared batch ID and make the orchestrator wait for the Hydra load before starting dbt.

Pitfall to avoid: Do not let dbt read a table while Hydra is replacing it or while an incremental load is incomplete. A schedule at the same clock time is not a dependency. Avoid giving Hydra and dbt ownership of the same published relation; consumers should see a single clear publication point.
Can Hydra execute dbt models directly?
Hydra can be placed in a workflow that invokes an external command where the deployment supports that action, or an existing scheduler can call hdrctl followed by dbt. This guide uses the second, transparent pattern and does not imply a special dbt connector.

How it works: Hydra does not interpret dbt SQL model files as its own transformation language. A workflow can invoke an external command where supported, while an existing scheduler can run hdrctl and dbt in sequence. The dbt runtime, adapter, warehouse credentials and project remain necessary for dbt models.

Practical check: Keep the dbt project versioned and run the exact dbt build selector used by the current deployment after Hydra succeeds. Capture both exit codes and report locations. Test a missing dbt profile and failing model test to ensure the overall run is marked failed and downstream publication is blocked.

Pitfall to avoid: Do not claim that a Hydra job automatically gains dbt tests, macros or ref() dependencies by calling a command. Two tool processes create two failure boundaries and secret sources. Decide which orchestrator retries each stage and confirm that a dbt retry does not needlessly reread the original API or duplicate the Hydra load.
Should I remove dbt tests when moving ingestion to Hydra?
No. Keep model and source tests during the pilot. They are a valuable acceptance gate for the new ingestion path and may catch type, null or duplicate changes that row counts miss.

How it works: dbt data tests may enforce unique keys, non-null values, accepted categories or custom SQL conditions. Moving ingestion upstream to Hydra does not invalidate those requirements; the new staging data should still be tested before downstream models are published.

Practical check: List tests attached to the affected source and models. Run Hydra against a fixture with duplicate ID, missing required field and unexpected status, then execute dbt build or the relevant tests. Confirm that failures are visible to the orchestrator and that a bad staging batch does not replace a known-good mart.

Pitfall to avoid: A successful Hydra exit code proves execution, not the validity of every business constraint. Do not remove dbt tests solely because Hydra has schema declarations. Schema validation and data-quality assertions answer different questions, and a shifted null or duplicate can pass a parser while breaking an analyst’s metric.
What happens to dbt ref() dependencies?
They remain in dbt if the models remain. Before deleting any model, inspect its downstream ref() users, selectors and exposures. A Hydra output table is not automatically a drop-in replacement for a dbt graph node.

How it works: ref() expresses dependencies between dbt models and lets dbt build them in graph order. Hydra jobs and workflows have their own dependency definitions. Replacing a model can change the graph seen by dbt documentation, tests and downstream selectors even when the physical table name stays the same.

Practical check: Inspect the parent and child models of the candidate and list any exposures. Keep the original model in a test branch while Hydra writes an isolated relation. Run the affected dbt graph against that relation and compare compiled SQL outputs, tests and downstream marts. Update documentation only after the dependency boundary is approved.

Pitfall to avoid: Do not delete a model without checking ref() calls, selectors and exposures. A dashboard may depend on a relation that was previously rebuilt under dbt control. If lineage matters, retain a dbt staging wrapper or document the Hydra-produced source in dbt so the graph remains understandable.
Does Hydra upsert equal a dbt incremental model?
No. A dbt incremental model has a SQL selection predicate, materialization rules and possibly a unique key. A Hydra upsert describes destination writes. Compare first, repeated, late and full-refresh runs before treating them as equivalent.

How it works: A dbt incremental model uses SQL predicates to select new or changed rows and a materialization strategy to update the warehouse. Hydra upsert governs destination key conflicts for a supported target. Neither setting alone defines the other system’s source selection, history or merge semantics.

Practical check: Run an initial batch, update one existing key, add a new key and submit a late correction. Record the dbt is_incremental() predicate, unique_key and merge strategy, then Hydra’s source window and upsert key. Compare final values and scan volume after each run. Include a repeated run to verify idempotency.

Pitfall to avoid: Do not infer equivalence from both tables having one row per key. A stale incremental predicate can miss a late update even when upsert is configured. A null or duplicate unique key can also produce unexpected rows. If history is required, a dbt snapshot is a separate contract that a current-state upsert does not provide.
Can dbt still own transformations after Hydra is added?
Yes. This is often the preferred design: Hydra ingests and performs limited pre-cleanup, then dbt builds warehouse models and runs tests. Each layer has a clear output contract.

How it works: dbt can remain the owner of warehouse SQL transformations after Hydra is added. Hydra may prepare or load a supported upstream source, while dbt keeps models, tests and exposures. This is often the least disruptive architecture for a team that already reviews and operates dbt projects.

Practical check: Define the Hydra landing table’s schema, grain and freshness objective. Run Hydra first, validate the table, then run selected dbt models and tests. Give one scheduler the dependency and retry policy. Reconcile a shared batch identifier from source snapshot to final mart and confirm the dashboard sees only fully built data.

Pitfall to avoid: Do not move a model merely to increase the amount of Hydra YAML. A warehouse-specific join may perform better inside dbt’s SQL engine. Avoid two independent schedules or a shared mutable staging table that dbt can query mid-load. Keep a clear owner for each transformation rule.
How do I avoid duplicate schedules?
Choose one scheduler for the combined chain. Disable the previous loader’s trigger only after the Hydra path has succeeded in parallel, and ensure dbt is invoked once per completed input batch.

How it works: Duplicate schedules are an orchestration defect: Hydra may still load when dbt has already started, or dbt may build twice against the same data. A valid integration needs a causal dependency, not simply matching cron expressions.

Practical check: Choose a single schedule owner, define “Hydra load committed” as the condition to launch dbt and make a failed Hydra run block dbt. Test a late upstream load, a zero-row successful batch and a dbt test failure. Record which stage may be retried alone and how the run ledger links both reports.

Pitfall to avoid: Do not let both tools publish the same final table. Avoid fixed sleep delays that assume ingestion always finishes on time. A full-chain retry after only dbt fails may reread the source and duplicate append loads. Document restart rules and target idempotency before turning on production automation.
Can the browser simulator benchmark dbt against Hydra?
No. It uses 14 local sample rows and executes neither dbt SQL on a warehouse nor the Hydra engine. It is useful for understanding the displayed transformation, not for cost or performance claims.

How it works: The browser simulator operates on a small built-in orders fixture; it does not run dbt SQL in a warehouse or the Hydra ETL engine. Its line count and sample output illustrate one pipeline shape, not query optimizer behavior, data transfer cost or runtime throughput.

Practical check: Benchmark with the actual warehouse adapter, representative partitions and identical input snapshot. Capture rows and bytes scanned, bytes transferred, elapsed time, peak memory and output freshness. Run both a normal and changed-row batch. State which transformations execute inside the warehouse and which require moving data outside it.

Pitfall to avoid: Do not rank tools by a toy sample or lines of syntax. dbt may push a large aggregate to the warehouse while an external process must read substantial data. Conversely, a bounded cross-system load can favor Hydra. Publish measurements only when the data volume, environment and cost basis are reproducible.
What is the safe rollback if the new ingestion fails?
Restore the previous loader or source table, keep the dbt project unchanged and rerun the selected dbt models. An isolated Hydra staging target allows this without repairing dbt model definitions.

How it works: A rollback for Hydra ingestion retains the old dbt source relation and model configuration. Consumers should keep reading a known-good mart until the new staging feed has passed tests. Recovery includes data interval reconciliation, not merely restoring a YAML pointer.

Practical check: Record the last valid dbt build, its source relation and batch ID. If Hydra ingestion fails, stop the new feed, point the test or production dbt source back to the previous relation and rerun selected models and tests. Compare key counts and freshness before reopening dashboard reads. Keep the previous staging data through the observation period.

Pitfall to avoid: Do not allow a failed Hydra load to replace the old staging table with partial data. A subsequent dbt build may pass syntax checks but publish stale or incomplete metrics. Avoid replaying a full append load without checking keys and the last committed interval. Make the fallback source and command explicit.

###### Migration and integration questions

How do Hydra ETL and dbt work together?
Hydra can extract and prepare data across systems, then load a staging table that dbt uses as a source. dbt can retain warehouse models, tests and documentation while one orchestrator owns the sequence and failure policy.

How it works: A typical division is Hydra for supported extraction and preparation, dbt for warehouse modeling and tests. The handoff is a staging relation with stable name, types and grain. One orchestration layer controls the sequence and treats either stage’s failure as a failed overall run.

Practical check: Map the source system to Hydra sources.yaml, cast and filter rules to transformations.yaml and a staging destination to destinations.yaml. Validate, run and query the target. Declare the table in dbt sources, execute dbt build and verify the downstream model plus tests. Tag both runs with one batch or partition ID.

Pitfall to avoid: Do not use two clocks in place of a dependency or expose a staging table while it is being replaced. A model can be correct but fresh only for yesterday’s source. Keep dbt quality gates and lineage visible; moving ingestion does not make them redundant.
Should Hydra replace dbt models?
Usually keep dbt models when warehouse SQL, lineage and tests are important. Evaluate a Hydra replacement only for a small transformation whose inputs, output contract and operational behavior can be reproduced and verified.

How it works: Many dbt models are not good replacement candidates because they rely on warehouse SQL, adapter-specific macros, incremental materialization or a graph of tests and exposures. Hydra should be evaluated on one supported transformation with a clearly defined output contract.

Practical check: Select a simple model with limited downstream consumers. Save compiled SQL, relation type, key, expected rows and tests. Build a separate Hydra job and compare first load, changed data, late correction and failed run. Have the owner of the model and its consumers approve any change in freshness or materialization.

Pitfall to avoid: A shorter Hydra job does not guarantee lower cost or identical results. It may move computation out of the warehouse and lose a view’s live semantics. Do not retire the dbt model until its quality checks, documentation and lineage have an explicit replacement or are deliberately retained.
Can Hydra ETL run before dbt build?
Yes, through a controlled workflow or external scheduler that runs Hydra, checks its exit status and then starts dbt build. Make sure the dbt source reads the committed Hydra target and that retries do not create duplicate loads.

How it works: Hydra can precede dbt build in a single controlled run. The dbt command should start after the Hydra destination commits and after a staging check confirms schema and row count. An orchestrator can be an existing scheduler, a workflow or another explicitly owned process.

Practical check: In deployment, validate the Hydra project, run it, inspect the staging target, then run dbt build with a selector limited to affected models. Check both exit statuses. Inject a Hydra destination failure and confirm dbt does not start; inject a dbt test failure and confirm extraction is not automatically repeated.

Pitfall to avoid: A shell script that ignores the first command’s exit code may launch dbt on stale data. A fixed delay cannot account for variable ingestion time. Avoid retrying the complete sequence after a dbt-only failure if Hydra append is not idempotent. Record where each report is stored.
What is the difference between dbt incremental models and Hydra upsert?
A dbt incremental model governs SQL selection and warehouse writes inside dbt. Hydra upsert governs writes to a supported destination; it does not automatically reproduce the model SQL, unique key policy or incremental predicates.

How it works: A dbt incremental model combines a source predicate with warehouse materialization. A Hydra upsert is a target write behavior. Similar final tables can arise from different source scans, costs and late-data handling. A history-preserving dbt snapshot is another, separate requirement.

Practical check: Record is_incremental(), unique_key, incremental strategy and the source’s update field. Test a new row, an update, a late correction and a duplicate key in both systems. Compare target rows and the amount of data read. If the Hydra design uses a full bounded reread, state that cost explicitly; if it uses a watermark, test restart and tie handling.

Pitfall to avoid: Do not equate the words “incremental” and “upsert.” A key collision may update the correct row while the source query still misses another changed record. Null unique keys and out-of-order timestamps deserve explicit fixtures. If the old model preserves historical states, a current-state Hydra table cannot replace that history.
How do you map dbt tests to a Hydra migration?
Preserve existing dbt tests against the new staging table where possible. Add explicit checks for row counts, unique keys, nulls and freshness, and keep dbt test failures visible to the scheduler.

How it works: dbt tests are executable assertions attached to sources and models. Hydra validation checks job configuration and supported schema behavior, but it is not automatically a substitute for every business-level uniqueness, accepted-value or referential test.

Practical check: Inventory tests in the affected dbt graph and run them against the Hydra-fed staging table. Create fixtures that violate each critical rule. Compare which stage fails, what alert is sent and whether the published mart remains unchanged. Retain custom SQL tests where they describe a data contract that the Hydra DSL does not express.

Pitfall to avoid: Do not remove tests simply because a new ETL job validates before running. A valid YAML file can load duplicate business keys, while a schema-consistent row can contain an invalid status. Keep the quality gate in the orchestrated sequence and make downstream publication depend on its success.
Can dbt transform data from a Hydra ETL pipeline?
Yes. Configure Hydra to load a warehouse staging table, declare that table as a dbt source and run dbt after the load completes. Validate the column types and load mode before allowing dependent models to build.

How it works: dbt can transform any supported relation available to its warehouse adapter, including a table Hydra has loaded. Hydra provides the upstream transport and ETL preparation; dbt continues to compile and execute warehouse SQL models.

Practical check: Load Hydra output into a staging schema with a stable column contract. Declare it as a dbt source in a test environment, then build the dependent models. Check column types, grain, nulls and freshness after two runs. Keep separate target schemas until the data owner has accepted the result.

Pitfall to avoid: Do not point dbt at a table that Hydra truncates mid-run without a safe publish boundary. A green dbt build can reflect stale rows if ingestion did not finish. Also watch for type drift: an amount loaded as text may compile in SQL yet aggregate incorrectly or fail later.
Is Hydra ETL an alternative to dbt for cross-system data movement?
Hydra can read supported files and databases and write to supported destinations, while dbt primarily transforms data already available to the SQL engine. Connector and transformation requirements determine which product owns each stage.

How it works: dbt primarily transforms data already accessible to a SQL engine. Hydra can connect supported files, APIs and databases and write across systems. The alternative or complement question depends on where data starts and where the transformation should execute.

Practical check: Trace one data product from original source to warehouse. Mark extraction, transport, staging, SQL modeling, tests and published relation. Evaluate Hydra for the cross-system stages, and keep dbt for models that benefit from warehouse compute, lineage or tests. Benchmark representative data movement and query cost before moving a large transformation.

Pitfall to avoid: Do not call dbt a general extractor or Hydra a universal warehouse optimizer. A cross-system job can be a strong Hydra fit even when every downstream model remains dbt-owned. Conversely, a warehouse-local SQL model may be simpler and cheaper left in dbt. Decide at the data boundary rather than by product label.
How do you migrate a dbt model to Hydra YAML?
Freeze the model SQL, materialization, tests and expected output. Translate only supported operations, compare all output columns and key behavior on a representative fixture, and retain dbt for SQL constructs the Hydra DSL does not express.

How it works: Migrating a model requires translating SQL semantics and its materialization contract, not just its SELECT clause. ref() dependencies, adapter-specific functions, incremental predicates, tests and exposures can affect the result and the operational graph.

Practical check: Save compiled model SQL, relation type, schema, key, source data and expected output. Rebuild supported casts, filters, joins or aggregates in a Hydra job targeting a new relation. Compare sorted rows, types, second-run update and failure behavior. Run surviving dbt tests against the candidate relation and review downstream consumers before cutover.

Pitfall to avoid: A SQL expression may have warehouse-specific null or date semantics that a Hydra step does not match. A view becomes stale if replaced by a periodically written table. Do not drop the old model while dashboards or dbt selectors still reference it; stage the change and preserve a rollback path.
What are the main risks of replacing dbt with Hydra?
The risks include losing warehouse-specific SQL behavior, materialization semantics, tests, documentation or lineage. Audit those dependencies before moving a model and retain a rollback path to the original relation.

How it works: The risks span correctness, performance and governance: different SQL semantics, target write mode, source selection, test coverage, lineage and freshness. A model’s apparent simplicity can hide a large downstream graph or a specialized adapter behavior.

Practical check: Create a requirement matrix for the candidate model with input, output grain, materialization, tests, exposures, run duration and failure policy. Rank each item as reproduced, retained or redesigned. Execute a fixture with nulls, duplicate keys, late changes and a failed load. Include a production-sized benchmark if large tables are involved.

Pitfall to avoid: Do not measure only output count or YAML length. A moved aggregate can read far more bytes outside the warehouse, and an omitted dbt test can publish an invalid metric. If several required features remain dbt-owned, use Hydra upstream rather than forcing a full replacement for the sake of consolidation.
How do you roll back a Hydra and dbt integration?
Keep the prior dbt source relation and build configuration. Stop the new Hydra load, restore the original source reference or target table, then rerun dbt tests and models against the verified input.

How it works: Rollback restores the prior Hydra source feed or dbt model relationship and a known-good published relation. The choice depends on what moved: ingestion, a model or both. Source and target ownership should be recorded before cutover.

Practical check: Keep the previous dbt source relation and model revision. On failure, stop the new Hydra schedule, restore the source pointer or old model, run dbt build and tests, and compare the affected partitions to the last valid result. Reconcile batches written during the transition before reopening dashboard reads.

Pitfall to avoid: Do not blindly rerun an append load or overwrite the only copy of a staging relation. A rollback that restores code but not data can leave the mart inconsistent. Preserve the old target and batch ledger during the observation period, and rehearse a failure before the production switch.

Sources and method
The product descriptions were checked against the vendor references below and the Hydra DSL documentation. The comparison concerns the stated workflow, not all features or editions. The browser simulator is neither an engine run nor a performance benchmark.

dbt: data tests ↗

dbt data tests ↗

dbt incremental models ↗

dbt exposures ↗

dbt build command ↗

02 / Try

#### dbt vs Hydra: sample pipeline

#### Same small batch, two definitions

Read 14 sample orders, keep amounts above 50, sum by status and sort by total. Right-click inside either editor or use ⋯ for its line actions. Edit the Hydra threshold to recalculate the result; the source threshold follows where the displayed example includes one. The browser models this fixture and does not run either product.

Browser simulation

dbtWarehouse transformation
⧉↓⬡⤢⋯

-- models/orders_by_status.sql
select status, sum(amount) as total
from {{ ref("stg_orders") }}
where amount > 50
group by status
order by total desc
CopyDownloadIllustrative example

Hydra ETLYAML job files
✓▶⇢⧉⤢⋯

# sources.yaml
sources:
orders:
type: csv
extract:
table: data/orders.csv

# pipeline.yaml
pipeline:
from: orders
to: report

# transformations.yaml
steps:
- cast:
mapping: { amount: float }
- filter:
expr: "amount > 50"
- aggregate:
by: [status]
agg:
total: { func: sum, col: amount }
- sort:
by: [total]
ascending: false

# destinations.yaml
destinations:
report:
type: csv
load:
table: data/by_status.csv
mode: replace
Run sampleResetCopyDownload textRunnable ZIP

Lines in these examples dbt / Hydra

Files representedExample / 4 Hydra files

Run scope14 browser-local rows

Line counts are live counts of the text shown above, not a product benchmark. The dbt pane is illustrative and is not executed. The Hydra pane shows four files in one editor for comparison; only the displayed cast, filter, aggregate and sort operations are simulated. “Download text” includes your edits; “Runnable ZIP” contains the original four files and input CSV, validated with Hydra 0.22.0.

##### Simulated run result
×

StatusTotal

×

03 / Integrate

#### Introduce Hydra in a dbt environment

Start with a reversible pilot. Keep the current system running until the new output and failure behavior are verified.

##### Before you change a schedule or destination

A dbt project with the selected model’s parents, children, tests and exposures inventoried.

The warehouse source table or file Hydra will produce, and a staging target for the pilot.

A frozen input fixture and expected model output.

A clear schedule owner and credentials for Hydra and dbt without placing passwords in project files.

##### Step-by-step integration and migration

01

###### Trace the dbt graph

Use the dbt project to identify source(), ref(), model materialization, tests, snapshots and exposures for the target area. Record whether a dashboard or another model reads the table directly. This defines what Hydra must not disturb.

02

###### Choose the boundary

The low-risk choice is Hydra ingestion into a staging relation followed by the existing dbt models. Only consider moving a simple model when it has no important downstream dbt contract. Create a new schema or table for the pilot.

03

###### Build the Hydra ingestion job

Define source, pipeline and destination YAML and any necessary cast or cleaning steps. Validate the project with hdrctl validate --strict. Confirm that the destination table matches the columns and types expected by dbt source definitions.

04

###### Run the chain once

Run the Hydra job, then run dbt build for a narrow selection. Keep the commands serial so dbt starts only after Hydra reports success. Save both logs and the target data for comparison.

05

###### Exercise quality gates

Run the model’s existing dbt tests, freshness checks where configured, and any downstream model selection. Test a malformed row and a delayed batch. Compare warehouse row counts and source freshness against the previous ingestion path.

06

###### Assign ownership and cut over

Choose whether Hydra, the existing orchestrator or dbt platform scheduling starts the chain. Disable the duplicate trigger. Keep dbt model definitions, tests and exposures unless a separate reviewed change explicitly retires them.

##### Hydra ingestion followed by dbt model build

# Run in one existing scheduler or deployment script.
hdrctl validate /srv/hydra/ingest_orders --strict
hdrctl run /srv/hydra/ingest_orders
dbt build --project-dir /srv/dbt --select orders_by_status+
# dbt must point at the staging relation written by Hydra.
# Do not start dbt when hdrctl exits nonzero.

Adapt the paths, project files and credentials to your deployment. The runnable orders fixture ZIP is a safe starting point for the Hydra side; its local YAML was validated with Hydra 0.22.0.

##### Acceptance checks before cutover

dbt source relation has the expected schema and freshness.

Selected dbt tests still pass after Hydra ingestion.

Downstream ref() models and exposures remain intact.

Second run does not duplicate records or change materialization unexpectedly.

One scheduler owns the chain.

##### Rollback plan

Stop the new Hydra ingestion schedule, restore the previous source table or loader, and rerun the existing dbt build selection. Preserve dbt models, tests and exposure definitions throughout the pilot so rollback does not require rebuilding the analytical graph.

##### Practical pitfalls

Do not remove a dbt model referenced by other models.

Do not imply Hydra replaces dbt tests or exposures.

Avoid running the same schedule in two places.

Build the pilot
Use the CLI reference to create and validate a project, then use the DSL guide for source, transformation and destination syntax.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra ETL vs dlt — slug: /migrate/dlt/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All comparisons
Compare with Hydra ETL
Explore Hydra CLI ↗

Compare & migrate/dlt

Product comparison · Python ELT library

### Hydra ETL vs dlt

dlt is a Python-first library for extracting, normalizing and loading data. Hydra is a YAML-defined ETL engine with explicit transformations and workflows. Both move data; the better fit depends on whether your team wants Python sources and automatic schema handling or reviewed declarative jobs.

Scope: Compare ingestion and transformation for a small batch pipeline, not every dlt connector or destination. Reviewed 17 November 2026

Comparison Simulator Migration & integration

01 / Compare

#### Where the tools overlap and diverge

Short answer
dlt is a Python-first library for extracting, normalizing and loading data. Hydra is a YAML-defined ETL engine with explicit transformations and workflows. Both move data; the better fit depends on whether your team wants Python sources and automatic schema handling or reviewed declarative jobs.

Product contextCapabilitiesDetailed analysisTechnical evaluationWorked exampleDecision20 questions

##### What dlt does, and what Hydra changes

The first design question is where the difficult work lives. A dlt source can be a Python generator, a resource or a structured source with its own configuration. dlt then extracts, normalizes and loads records, maintains schema information and can restore state from a destination. Hydra starts from a declared source and applies a named sequence of ETL operations before writing a declared destination. Those models overlap for ordinary batch data movement, but they place customization in different places.

A team with many bespoke REST APIs may value dlt’s Python surface and incremental loading more than a shorter manifest. A team whose workload is stable CSV, SQL or another Hydra-supported connector may value explicit transformations and a project workflow that reviewers can inspect without reading extraction code. Decide per pipeline, not per logo. A useful inventory records source type, cursor, destination write mode, schema policy, transformation logic, schedule and downstream readers.

The browser simulator deliberately reduces this comparison to 14 CSV orders. It can demonstrate the shape of a declarative transformation and how a changed filter threshold affects the output. It cannot compare connector breadth, dlt state recovery, schema evolution, nested records or throughput. Those are acceptance tests for a real migration, not numbers that can be inferred from a toy file.

##### What both can do

Move data from a source to a destination

Support repeatable pipelines and load behavior

Run from a developer environment or automation

##### Key differences

AreadltHydra ETL

AuthoringPython sources, resources and pipeline.run()YAML jobs: source, steps and destination

SchemaSchema inference and evolution are centralExplicit schema and drift policies where supported

TransformPython maps, filters and downstream toolsBuilt-in row and table operations in the job

Best fitCustom APIs and Python-centric extractionReviewable file/database ETL and workflow actions

##### Detailed comparison for a production decision

###### Extraction and connector ownership

dlt accepts resources, generators and iterable data. That is particularly useful when the source needs pagination, authentication renewal, nested response handling or custom Python before rows can be produced. The pipeline call turns those records into load packages for the destination. In Hydra, source declarations make routine extraction visible in YAML; any source-specific behavior must be supported by the connector or implemented separately.

For an integration pilot, document the exact dlt resource and the destination table it creates. If that resource is a nontrivial API client, retain dlt for extraction and let Hydra read the landed table or a controlled export. Rewriting the API client first would mix an extraction rewrite with an ETL migration and make any row mismatch hard to diagnose.

Product documentation: dlt pipeline execution ↗

###### Schema evolution and contracts

dlt can evolve destination schemas as new fields appear, and schema contracts can freeze, discard or evolve changes at table, column and type level. Those modes are part of the behavior of a production pipeline. Hydra has schema declarations and drift handling for supported sources, but a similarly named setting should not be assumed to have identical nested-table or coercion semantics.

Test at least three fixtures: a new optional field, a changed type and a missing expected field. Record whether each system adds a column, rejects a row, discards a value or fails the run. Compare the resulting destination schema as well as the row count. A successful run that silently changes a column is not a successful migration if a downstream model expects the old contract.

Product documentation: dlt schema contracts ↗

###### Incremental state and load disposition

dlt uses pipeline state, incremental cursors and write dispositions such as append, replace and merge. Hydra also has load modes, but a load mode describes target writes; it does not by itself reproduce a dlt cursor or the replay of a partially processed source. The first full load can look identical while the second run diverges.

Write down the dlt state identifier, cursor column, initial cursor value, primary or merge key and late-arrival policy. Run a first batch, then an update to an existing key, then a delayed record older than the current cursor. Observe both destination and state after each run. This sequence reveals whether a direct Hydra replacement is suitable or whether dlt should remain the ingestion layer.

Product documentation: dlt pipeline execution ↗

###### Transformation and review

A dlt resource may map or filter items before load, while heavier transformations commonly take place in Python or a downstream SQL tool. Hydra places supported operations such as cast, filter, aggregate and sort in the job definition. The difference matters when a reviewer needs to answer which rows were dropped and where a derived column was created.

Translate only operations whose Hydra behavior you can verify. For a CSV amount column, cast to a numeric type before summing; treating text as numeric is a common source of apparently successful but wrong results. Save input fixtures and expected output in version control, then run the same fixture through both pipelines during the pilot.

Product documentation: dlt resource configuration ↗

###### Operations and fit

dlt exposes load information and pipeline state for diagnosing ingestion. Hydra exposes validation, CLI runs and workflow reports for its jobs. Neither product should be judged solely by lines of code. Recovery after a network interruption, behavior under schema drift and visibility of the failed row matter more than a short example.

Keep dlt where Python extraction and its state model are the value. Evaluate Hydra where the source and destination are supported and the transformation is mostly declarative. A mixed architecture is valid: dlt loads a raw table, Hydra validates and transforms it, and one orchestrator owns the schedule and retry boundary.

Product documentation: dlt pipeline execution ↗

##### Technical evaluation: dlt and Hydra ETL in production

###### The unit of migration is a resource, not a Python file

A dlt project can hide several data products behind one Python module. A source groups resources, while each resource can yield records, set hints, select a table name and carry its own extraction configuration. A Hydra job has a more explicit source-to-destination boundary. Before comparing dlt and Hydra ETL, list the actual resources invoked by pipeline.run(), the tables they create and the downstream consumers of each table. Counting Python files against YAML files is not an architecture assessment.

For every resource, record whether its code merely selects data or whether it performs authentication renewal, pagination, response flattening, error recovery or custom throttling. The latter behaviors belong to the extraction contract. If Hydra does not express them through a supported connector, a replacement job would need additional code or an upstream landing step. Leaving dlt in charge of a custom API while Hydra processes its landed rows is a legitimate design, not a failed migration.

A useful pilot deliberately chooses one flat resource and one target. Preserve its resource name, table name, primary key and destination schema, then run the old and new paths against the same immutable snapshot. Record not only rows written but source requests made, retry behavior and any source records that were skipped. This turns the question “can Hydra replace dlt?” into a test of one named data contract.

Further reading: dlt resources ↗

###### Extract, normalize and load are distinct dlt stages

dlt separates extraction, normalization and loading. Extracted data becomes load packages; normalization applies an inferred schema; loading sends jobs to the destination. This matters when a run fails after extraction. The next dlt invocation may continue a pending load package rather than reread the API. A Hydra rerun must be evaluated against the same failure point, because a green rerun that re-fetches mutable source data can produce a different result.

For a controlled failure drill, capture the source snapshot and destination state before the run. Interrupt the destination after a subset of records has been prepared, restore it and observe which records are read or written again. Compare destination keys and values, not just the final count. Also inspect any duplicate side effects in the source system, especially when extraction itself calls a rate-limited endpoint.

The migration decision should state where the durable replay boundary lives. It may be a dlt load package, an immutable file, a staging table or an external queue. Hydra can operate after a durable landing boundary even when preserving dlt package semantics would be costly. Documenting that boundary makes the recovery story intelligible to operators and gives the architecture a precise rollback point.

Further reading: How dlt works ↗

###### Incremental extraction and destination upsert solve different problems

A dlt incremental resource can remember a last value and request only later source records. Its state is not the same thing as the destination write disposition. Hydra upsert can update a row already in a database, but it cannot by itself know which API page or source timestamp to request next. The first full run may look identical while the second run is wrong if the new path does not request a changed or late-arriving record.

Build a fixture with an initial order, an update to that order, a new order and a late-arriving order whose timestamp precedes the current cursor. Record what dlt extracts, what Hydra extracts and what each destination contains after every run. Then repeat after a process restart. If the old job uses a composite cursor or custom resource state, include that logic in the inventory rather than treating it as incidental Python.

A direct replacement is reasonable only when the new source-read strategy is documented and tested. Some teams may prefer a full bounded query plus idempotent upsert; others may need an external watermark. Both have cost and correctness consequences. Choose based on update frequency, source size, API limits and late data. A matching target table after the first run is insufficient evidence that ongoing ingestion will match.

Further reading: dlt state ↗

###### Merge keys, load packages and replay semantics

dlt append, replace and merge write dispositions describe materially different destination behavior. Merge can use primary or merge keys and may choose a strategy suited to the destination. Hydra append, replace and upsert are also write modes, but a similar label does not establish identical handling of duplicates, null keys or a partially failed batch. The migration inventory must include the actual key definition and any table-specific dlt hints.

Use a four-row challenge set: one new key, one existing key with changed values, two rows with the same key in one input batch, and one null key if the source permits it. Compare the final relation, rejected records and run status. Repeat the challenge after an intentional interruption. A row-count comparison alone misses updates that silently keep the wrong value or duplication that is masked by a downstream view.

Where dlt merge preserves a current-state table and a history or staging layer, decide which layer Hydra is meant to replace. A Hydra job can be valuable after dlt replication without replacing its merge logic. State this as a boundary choice in the technical design: source capture, raw landing, current-state table, transformation and published table can each have a different owner.

Further reading: dlt merge loading ↗

###### Schema contracts require field-level acceptance tests

dlt schema contracts can govern new tables, new columns and data-type changes separately. A resource can allow one category of evolution while freezing another. Hydra has schema and drift settings for supported connectors, but their names should never be used as an equivalence table without execution evidence. A professional comparison names the exact source change and observes what happens to both the run and the destination schema.

Prepare three versions of the same record: one gains an optional field, one changes a numeric value to text and one omits a required field. Feed each through the existing dlt resource under its configured contract and through the candidate Hydra job. Record whether a field is accepted, discarded, coerced or causes failure. Check physical types and nullability in the destination; an application-level success log can conceal a schema change that breaks a consumer.

If the contract is deliberately permissive, record who approves downstream schema changes. If it is strict, preserve the failure and alert path. Engineers need to know which entity can evolve, which rule fires, whether a dropped value is visible in the report and whether previous rows remain readable after the change. The phrase “supports schema drift” alone does not specify any of these behaviors.

Further reading: dlt schema contracts ↗

###### Nested JSON is a migration boundary of its own

A dlt resource can normalize nested documents into related destination tables. Those tables may use generated identifiers and linkage columns that downstream SQL depends on. A flat CSV example says nothing about this behavior. Before moving a nested API pipeline to Hydra, export a representative parent with two children, a parent with no children and a later update that changes one child. List every resulting table and key relationship.

The acceptance test should compare parent cardinality, child cardinality, key stability and behavior when an array is empty or reordered. An apparently equivalent flatten or explode operation can change which values are repeated and how a downstream join reconstructs the source document. If preserving the normalized relational shape would require bespoke code, keep the dlt extraction and normalization stage and migrate a later transformation instead.

The replacement decision is conditional on the exact connector and document shape. The recommended pilot therefore starts with a flat resource while separately documenting a nested-resource evaluation. Keep the current normalization stage until parent-child keys, array handling and updates have passed a dedicated comparison. This avoids treating all dlt pipelines as if they have the same migration effort or the same relational output contract.

Further reading: How dlt works ↗

###### Transformation ownership and reviewability

dlt resources can transform items in Python before loading, and many teams continue the transformation in SQL or another tool. Hydra places supported casts, filters, joins, aggregates and load settings in the job definition. The useful comparison is therefore where a business rule is defined, how it is tested and who can review it. A short YAML file is not automatically clearer if an important API normalization step remains hidden in a helper script.

Create a rule inventory for the pilot: input column, source type, conversion, filter predicate, null policy, grouping key and output type. Match each rule to the dlt resource code or downstream transformation and to a Hydra step. A test fixture should include boundary values such as zero, negative numbers, empty strings, malformed dates and duplicate keys. Save the expected output alongside the job so future reviews can detect accidental changes.

A team can split responsibility deliberately. Python stays with extraction code that benefits from unit tests and libraries; Hydra carries the supported ETL transformations and an explicit destination. The architecture is valuable only when this division is visible in documentation and operational logs. Avoid claiming that declarative authoring removes the need to test data semantics.

Further reading: dlt resource configuration ↗

###### Secrets, environments and reproducible runs

The same pipeline can behave differently across local development, staging and production because credentials, source scopes and destination names change. dlt projects commonly read configuration and secrets from their environment. A Hydra migration must list these values explicitly and avoid embedding tokens in YAML or test fixtures. Record the connection endpoint, database, schema, table and credential source for each environment, while redacting actual secret values.

Run the pilot with a dedicated read-only source credential and a writable staging target. Make paths absolute in automation, pin the Hydra version used for verification and store non-secret parameters in version control. Before comparing results, confirm both systems read the same database snapshot or exported file. Otherwise a difference attributed to dlt versus Hydra may merely be a difference in environment or time of extraction.

When cutover is planned, check secret rotation, network access and filesystem permissions in the actual runner. A developer laptop success does not establish that the production worker can reach the source or that its target account can perform the chosen load mode. Record the tested service account, network route and destination privileges so the deployment review can distinguish application behavior from an environment-specific failure.

Further reading: dlt pipeline execution ↗

###### Observability should follow records across the handoff

A dlt run reports extraction and loading progress and keeps traces and load-package information. Hydra has validation and job execution reports. During a dual-run pilot, assign a batch identifier that appears in the input snapshot, both logs and the comparison report. This lets an operator answer which source interval produced a target row and whether a failed retry has already written it.

Measure at least input count, accepted count, output count, unique-key count, null count for critical fields and a checksum or deterministic comparison for important columns. Separate a source extraction failure from a schema rejection and a destination write failure. If dlt is retained upstream, define how a failed Hydra stage is retried without resyncing the source and how the two run IDs are correlated.

The operational decision should include who receives alerts, how a run is replayed and what evidence closes an incident. A line-count simulator cannot answer those questions. The real pilot should produce a small runbook with the exact command, expected report location, target table query and rollback action so the new architecture is supportable by someone other than its author.

Further reading: dlt pipeline execution ↗

###### A decision record for replacement versus coexistence

After testing, classify each dlt resource as replace, retain or redesign. Replace a flat supported source when Hydra can meet the source, transformation, schema and recovery contract. Retain custom API extraction when Python and dlt state provide essential behavior. Redesign when the current pipeline itself has undefined ownership, hidden side effects or unstable target semantics. This classification is more useful than a blanket winner between tools.

A written decision record should include the candidate resource name, input and output contracts, failure scenarios tested, connector limitations, expected operating cost, owner and rollback trigger. Attach a diff of sorted output rows from the parallel run. If the decision is coexistence, describe the landing table or file and which scheduler starts each stage. If it is replacement, identify the date after which the old state can safely be archived.

The answer to “dlt vs Hydra ETL” then becomes conditional but actionable: dlt is strongest where its Python extraction and state handling are needed; Hydra is worth piloting where a supported source-to-destination ETL job benefits from explicit YAML transformations and workflows. This conclusion is grounded in observed behavior, not in a generic feature checklist.

Further reading: dlt state ↗

##### Worked evaluation: an incremental orders API

Imagine a dlt resource that reads an orders endpoint with an updated_at cursor and writes an orders table using merge on order_id. Its first run loads orders 101 and 102. On the next day, order 101 changes status, order 103 arrives and order 104 appears late with an earlier updated_at value. The baseline is not just the final three or four rows. Capture the actual API requests, cursor value before and after each run, the dlt schema, the merge key and the load package information. These observations tell you what a replacement would need to preserve.

The Hydra candidate should be built against a separate staging target. First determine whether its Web API connector can reproduce the endpoint authentication, pagination and throttling. If it cannot, retain the dlt resource and let Hydra read the landed table; this is the integration variant. If it can, specify how the next source window will be selected. A destination upsert on order_id handles target updates, but it does not make order 104 visible if extraction never requested its page. Write down the proposed watermark and lookback policy before any parallel run.

Create a frozen response fixture for the first two runs. The second response includes a new status for 101, a new 103 and the late 104. Run dlt and Hydra on copies of the fixture and compare output sorted by order_id, including status, amount and source timestamp. Then insert a duplicate 103 inside one batch and a null amount. Observe whether the dlt schema contract, Hydra schema or destination constraint rejects or coerces those values. The expected result must be written before execution, or a mistaken output can be rationalized after the fact.

Now interrupt the destination while the second batch is loading. dlt may resume a pending load package; the Hydra route may reread the snapshot and replay its own write. Restore the destination and rerun each side separately. Compare final keys, values and state, not just success messages. If the API is mutable, use the frozen fixture for this test so a changed endpoint response cannot confound recovery behavior. Record whether a failed run advances extraction position and whether an operator can safely start it again.

The result can support three decisions. Replace the flat dlt resource if connector behavior, cursor handling, schema and replay all match the contract. Integrate Hydra after dlt when Python extraction and its state remain valuable but the downstream transformation benefits from declarative steps. Retain dlt alone when the transformation is trivial or when another stage already supplies the needed quality controls. The outcome is about the selected orders flow; it says nothing about other dlt resources with nested JSON or different endpoints.

At cutover, preserve the dlt pipeline state and previous target for a defined observation period. Disable one schedule, record the last cursor and first Hydra batch, and reconcile orders updated during that interval. A rollback restores consumers to the prior target and resumes dlt from its saved state after checking for duplicates or missed changes. This six-part experiment turns common search questions about dlt incremental loading, schema evolution, Hydra upsert and migration safety into one reviewable engineering decision.

Related product documentation: dlt incremental state and loading ↗

##### Decision criteria for an existing dlt deployment

A final design review should ask who owns API contracts after the pilot. If the dlt resource currently adjusts to pagination or authentication changes, moving extraction to Hydra shifts that maintenance responsibility. If dlt remains upstream, the landing table becomes a formal interface: name its schema owner, freshness objective and change process. This is a more durable comparison than the count of configuration lines. The chosen boundary should allow a new engineer to identify which component must change when an API field is renamed or a destination rejects a value.

Cost should be assessed on real source behavior. A full reread may be simple but expensive for a rate-limited API; a cursor can reduce requests but must account for late changes. Document request count, data transferred, storage used for staging and time to recover after failure. The Hydra pilot should be benchmarked with the same source interval and connector limits as dlt. If these numbers are unknown, mark the cost conclusion as unverified rather than inferring it from a toy CSV execution.

The acceptance report should state the strongest reason for each outcome: replace, integrate or retain. For replacement, prove cursor, schema and replay behavior. For integration, prove the handoff and single-owner retry policy. For retention, explain which Python extraction or normalization capability remains necessary. This structure lets a reader apply the analysis to their own dlt pipeline without interpreting a promotional claim as a guarantee of compatibility.

##### Where each approach fits

##### Keep dlt when

Keep dlt when custom Python extraction, its incremental state, or destination schema evolution is central to the pipeline.

##### Evaluate Hydra when

Pilot Hydra on a bounded CSV or SQL job whose transformation is already expressible with Hydra steps.

##### Should you replace dlt with Hydra ETL?

Keep dlt when custom Python extraction, its incremental state, or destination schema evolution is central to the pipeline. Pilot Hydra on a bounded CSV or SQL job whose transformation is already expressible with Hydra steps. For a first test, inventory the dlt resources, state and write dispositions used by one pipeline. See the complete integration plan.

##### Frequently asked questions about dlt and Hydra ETL

These answers cover product fit, data movement, orchestration, migration testing and rollback. Check the linked product documentation for version-specific behavior.

What is the main difference between dlt and Hydra ETL?
dlt is a Python library whose resources produce records for extraction, normalization and loading. Hydra describes supported sources, transformations and destinations in YAML jobs and can coordinate them in workflows. For a custom API, Python extraction may be an advantage; for a stable batch job, an explicit manifest may be easier to review.

How it works: The comparison concerns the boundary where behavior is defined. dlt resources and pipeline state live in Python and can normalize records before loading; Hydra jobs declare supported extraction, ordered transformations and a destination in YAML. Either tool can move rows, but they offer different ways to express custom source logic and recover from failures.

Practical check: List one real pipeline’s resource names, destination tables, incremental cursor, schema contract, transformations and schedule. Mark which parts are Python-specific and which match Hydra connectors and steps. Run the same immutable input through separate targets, then compare values, types and the second run. This establishes fit for an actual workload rather than a generic product category.

Pitfall to avoid: Do not choose by lines of code or a first successful load. A short dlt resource may call substantial helper code; a short Hydra manifest may rely on an external API preprocessor. Include those dependencies, their tests and their operating cost. If the source is specialized, retain dlt upstream and evaluate Hydra after a durable landing table.
Can Hydra replace a dlt REST API source?
Only if the Hydra connector can express the API’s authentication, pagination, rate limits and response shape. A generic “web API” label does not prove parity. Keep the dlt resource when custom Python handles those details and introduce Hydra after the data lands.

How it works: A dlt REST API resource can implement authentication renewal, pagination, rate limiting, nested response handling and source-specific retries in Python. Hydra’s Web API connector is useful only when its documented options cover the particular endpoint. Connector names alone do not establish that they request the same records or preserve the same error behavior.

Practical check: Capture a real but low-risk API trace: request method, page token, response shape, retry-after handling and the page on which extraction ends. Recreate it with Hydra against a staging target. Test an expired token, an empty page, a rate-limit response and a partial network failure. Compare both requested pages and final rows before removing the dlt resource.

Pitfall to avoid: A flat sample response can hide late pages, changed tokens and nested objects. Do not replace a working API client based on a CSV fixture or one successful request. If Hydra lacks one required source behavior, keep dlt extraction and expose a stable table or immutable file as Hydra input. That still permits a useful downstream ETL migration.
Does a Hydra upsert replace dlt incremental loading?
No. Upsert controls writes at the destination; incremental extraction controls which source records are read. Test cursor advancement, late arrivals, updates and retry state before treating the behaviors as equivalent.

How it works: dlt incremental state controls which source records are requested on later runs. Hydra upsert controls how a supported destination handles matching keys after records arrive. A target table can therefore look correct after an initial full load even when the candidate Hydra job has no way to discover future source updates or late records.

Practical check: Run an initial batch, update one source key, add one new key and introduce a record older than the current cursor. Inspect the dlt state before and after, the records each path reads and the destination values after each run. If Hydra uses a bounded full read, quantify source cost; if it uses a watermark, document its persistence and lookback.

Pitfall to avoid: Do not use “upsert” as shorthand for incremental extraction. A missing source watermark can skip changes, while a naïve timestamp predicate can miss rows whose update time is delayed or unchanged. A retry can also replay records. Decide separately who tracks source position, who writes destination keys and how an interrupted run advances each state.
How should schema drift be compared?
Use fixtures with a new field, a type change and a missing field. Compare both pipeline status and the physical destination schema. dlt schema contracts and Hydra drift policies must be mapped by observed behavior rather than by similar names.

How it works: dlt schema contracts can treat new tables, columns and type changes independently. Hydra schema declarations and drift policies apply to supported source behavior with their own rules. The same phrase “schema drift” does not promise identical coercion, nested-table creation or destination DDL. The physical relation matters as much as the process exit status.

Practical check: Prepare three fixture versions: a new optional field, an existing numeric field supplied as text and a required field omitted. Run each under the production dlt contract and candidate Hydra policy. Record accepted values, rejected rows, warning or error, and destination column type after each step. Include a downstream query that depends on the old schema.

Pitfall to avoid: Avoid concluding from a green run that a schema is compatible. One engine may drop an unknown field while another adds it; both can finish successfully but produce different contracts. Also test a nested array separately, because a parent-child table created by dlt is not equivalent to a flattened or JSON-text column in a Hydra target.
Can dlt and Hydra run in the same project?
They can run in the same deployment or be chained by an external scheduler, provided the handoff is a defined table or file. One component should own triggering and retries so a failed transformation does not accidentally rerun ingestion twice.

How it works: The tools can cooperate across a defined data boundary: dlt extracts and loads into a stable table or file, then Hydra reads it for supported transformations and publication. The arrangement is safe when one component owns each write and one scheduler controls the sequence. It is not necessary to force all data movement into a single runtime.

Practical check: Name the landing object, its schema, freshness signal and batch identifier. Configure Hydra to start only after dlt completes that batch, write to a separate target and emit a report tied to the dlt run ID. Test a dlt failure, a zero-row batch and a Hydra failure after successful ingestion; rerun only the stage that failed.

Pitfall to avoid: Do not let both tools write the same table during a pilot or run independent schedules at the same clock time. A green Hydra job may read stale dlt data if the upstream load is late. Preserve dlt state and keep target ownership clear so recovery does not repeat source requests or publish an incomplete batch.
Should I migrate nested JSON normalization to Hydra first?
Usually not. Nested-record normalization can create child tables and special keys in dlt. Start with a flat, stable source and verify its semantics before attempting nested data.

How it works: dlt can normalize a nested document into related tables, with keys that permit a parent row and child rows to be joined later. Hydra array handling and schema options may produce another shape. Changing a nested source is therefore a relational-contract migration, not merely a parser swap. The downstream SQL may depend on generated child-table names and linkage columns.

Practical check: Build a fixture with a parent containing two children, another with an empty array and an update that changes one child. Compare all resulting tables, parent-child keys, row counts and reconstruction queries. Migrate a flat resource first, then evaluate nested normalization as a separate project with its own acceptance criteria and consumer review.

Pitfall to avoid: Avoid starting with nested JSON because an apparently correct parent table can hide missing children or unstable generated keys. A flatten or explode step may duplicate parent values or lose empty arrays. If those semantics cannot be reproduced with supported Hydra steps, keep dlt normalization upstream and migrate only later transformations.
What should be compared after the first successful run?
Run a second and third batch with updates, duplicates and late-arriving records. Count rows by key, inspect changed values and record how each tool resumes after a deliberately interrupted load.

How it works: A first successful run establishes that both paths can process one snapshot, but it does not establish incremental behavior, idempotency, schema evolution or failure recovery. Those differences become visible on a second and third run. The proper unit of comparison is the sequence of source changes and resulting target states.

Practical check: After the baseline, update an existing key, insert a new one, submit a duplicate, add a column and interrupt the destination. Save sorted target extracts after every stage. Compare row identity, column types, nulls, state or watermark, and requests made to the source. Define the expected result in advance so a mismatch is not rationalized afterward.

Pitfall to avoid: A count-only check can pass when the wrong row was updated or one missing row is offset by a duplicate. A process exit code can pass while the physical schema changed. Use deterministic key-by-key comparisons and inspect the state that controls the next extraction, especially when the source is mutable or rate-limited.
Which tool is better for a Python-heavy team?
A team that already writes and tests custom Python extractors may prefer dlt’s programming model. Hydra is attractive when the workload fits its supported DSL and the team wants operations expressed and reviewed declaratively.

How it works: dlt’s Python resource model is comfortable when source behavior is naturally coded, tested and reviewed as Python. Hydra’s declarative steps are attractive when a stable connector and known ETL operations cover the work. Team skill matters, but the source and recovery contract matter more than language preference.

Practical check: Take one Python-heavy resource and one ordinary file or SQL pipeline. Estimate the custom code, test surface and runbook each would require under both approaches. Have maintainers review the equivalent dlt and Hydra implementations and identify where a business rule is easiest to locate. Confirm operational ownership of the remaining Python helper code.

Pitfall to avoid: Do not equate YAML with no code or Python with unnecessary complexity. A declarative job can still depend on a script for a specialized API; a dlt pipeline can be concise and well tested. Choose per resource and document the boundary if the team keeps dlt extraction while moving a downstream transformation to Hydra.
Can the browser simulator measure dlt performance?
No. It executes neither dlt nor the Hydra engine. It models one small Hydra transformation on sample rows and shows line counts for the displayed examples, which are not a throughput or cost benchmark.

How it works: The browser simulator uses a small, fixed orders fixture and executes neither the dlt runtime nor the Hydra engine. It illustrates transformation shape and the effect of changing a filter threshold. It cannot measure network extraction, dlt normalization, source state, destination loading, recovery time or throughput.

Practical check: For performance evidence, run both implementations with the same source snapshot, destination class, network conditions and representative volume. Record records and bytes read, elapsed time, peak memory, API requests and target rows. Repeat the test, include an update batch and state the connector versions. Use the simulator only to understand the displayed example, not as a benchmark.

Pitfall to avoid: Line counts and a browser Run button can imply a speed or operating-cost advantage that has not been measured. A shorter file might rely on an external scheduler or helper. Do not extrapolate from 14 rows to a high-volume API or a nested source. Publish only results whose input, environment and measurement method can be reproduced.
What is the safest rollback after a dlt migration pilot?
Preserve the original dlt pipeline, state and destination. Stop the new schedule, restore downstream reads to the old target and resume dlt from the saved state. Avoid deleting or rewriting state during the pilot.

How it works: A dlt rollback depends on preserving the original pipeline state, configuration and destination through the Hydra observation period. The state determines where dlt resumes extraction; the old target gives consumers a known-good relation. If the new path writes to an isolated target, switching reads back is simpler than reconstructing data from a partially changed shared table.

Practical check: Before cutover, record the last dlt cursor, destination row count and consumer query. At rollback, stop the Hydra schedule, restore consumer reads to the dlt target, resume dlt from preserved state and reconcile records changed during the cutover window. Test this procedure on a staging interval, including an interrupted run, before deleting or archiving anything.

Pitfall to avoid: Do not reset dlt state or point both runtimes at the same target during a pilot. A forced full refresh can create duplicate rows or excessive API traffic, while a shared target obscures who wrote each value. Also avoid replaying the entire interval blindly; compare keys and source timestamps to decide which records still need processing.

###### Migration and integration questions

How do you migrate a dlt pipeline to Hydra ETL?
Inventory the dlt resources, state, destination tables and write dispositions first. Rebuild one supported, flat pipeline as four Hydra job files, validate it, and compare two or more runs against a separate target before changing the schedule.

How it works: A dlt-to-Hydra migration translates one resource contract into a supported source, transformation sequence, pipeline and destination. The inventory must include Python extraction behavior, state, schema rules and write disposition. A single YAML file cannot stand in for all of those responsibilities unless the chosen resource is genuinely simple.

Practical check: Export the dlt schema and state, freeze a source snapshot, build a Hydra job in a new project and run strict validation. Compare the first load, an update batch, a late record and a deliberate failure. Save SQL queries or file diffs used to compare targets. Move the schedule only after these acceptance checks and an operator review pass.

Pitfall to avoid: Avoid migrating several resources together before learning which difference causes a mismatch. Do not alter the production dlt destination or state to make a pilot look successful. If a custom API source is not covered by Hydra, keep dlt as ingestion and define a stable landing boundary; the downstream Hydra migration can still be valuable.
Can Hydra ETL replace dlt incremental cursors?
A Hydra destination upsert does not create an extraction cursor. Keep the dlt incremental resource or add an explicit source watermark mechanism, then test updates and late records before claiming equivalent incremental behavior.

How it works: A dlt cursor or custom state value is a source checkpoint. It can be committed with loaded data, whereas Hydra destination upsert addresses row conflict at the target. Replacing the cursor requires an explicit strategy for selecting future source records, preserving the watermark and recovering after a failed extraction.

Practical check: Record the existing cursor field, sort order, initial value, lookback window and state identifier. Test an updated row with a later timestamp, a late row with an older timestamp and two rows sharing a cursor value. Restart the process between runs. Compare which records dlt and the Hydra candidate request and whether target keys remain current.

Pitfall to avoid: A predicate such as updated_at greater than last_value can miss equal-timestamp or delayed records. Resetting the cursor may trigger an expensive full extraction. Do not claim equivalent incremental loading until the candidate path documents state persistence, tie handling, late data and replay after a partial target write.
How do dlt schema contracts compare with Hydra schema drift policies?
Both can constrain data shape, but their rules and scope differ. Exercise the same added, removed and type-changed columns in both systems and compare the run outcome and physical destination schema.

How it works: dlt schema contracts distinguish changes to tables, columns and types, with modes such as evolve and freeze. Hydra drift handling is defined for its supported connectors and may report or adapt changes differently. Similar vocabulary is insufficient: compare actual behavior for the same records and destination.

Practical check: Use a versioned fixture with a new field, a removed field and a type change. Capture dlt’s exception or accepted record and Hydra’s warning or failure, then inspect the physical table DDL. Repeat for a nested child record if the production resource creates related tables. Write an acceptance table with each change and the required outcome.

Pitfall to avoid: A field silently omitted by one system and added by the other can break downstream models despite equal row counts. Also check when the contract is applied: first load into an existing table may behave differently from a later schema evolution. Keep the old schema and consumer query available until the candidate passes the full change matrix.
Can Hydra transform data loaded by dlt?
Yes, when dlt lands a table or file readable by a Hydra source connector. Define a clear handoff, make Hydra write to a separate target and decide which scheduler owns retries so ingestion is not repeated unexpectedly.

How it works: Hydra can transform a table or file produced by dlt when a supported source connector can read its shape. The two systems then have distinct responsibilities: dlt manages extraction, normalization and state; Hydra manages supported business transformations and the published destination. This is often less risky than rewriting a custom API resource.

Practical check: Document the handoff relation and its minimum schema, unique key and freshness timestamp. Give Hydra a separate destination, start it after the dlt load completes and verify that it reads the intended batch. Link run IDs in logs. Test a new field and a zero-row upstream load to ensure Hydra either handles them by policy or fails clearly.

Pitfall to avoid: Do not let Hydra read a partially loaded table or treat a fixed time delay as a completion signal. If dlt schema evolution changes the landing shape, a Hydra cast or select step can fail after ingestion succeeded. Agree on who approves source schema changes and how a failed downstream transformation is retried without rerunning the API extraction.
Is dlt or Hydra better for a custom paginated API?
dlt is often the easier fit when a Python resource already handles pagination, authentication renewal or unusual response shapes. Evaluate Hydra only after verifying that its Web API connector expresses the exact behavior required by that endpoint.

How it works: A custom paginated API makes extraction behavior central to the choice. A dlt resource can implement Python logic for page tokens, rate limits, authentication refresh and irregular payloads. Hydra is suitable only if its connector settings or a controlled preprocessor reproduce those behaviors. The ETL transformation that follows is a separate decision.

Practical check: Test a normal multi-page response, an empty page before the end, an expired token, a retry-after response and a nested payload. Log requests and resulting keys while withholding credentials from output. Compare the source records each path produces before comparing transformed destinations. If the Hydra connector cannot express the API, retain dlt and hand off a durable table.

Pitfall to avoid: A one-page success can conceal missing later pages or repeated first pages. A retry that ignores rate-limit guidance may cause the source to block access. Avoid making a broad connector-parity claim from a generic Web API label. The safe pilot measures the exact endpoint and source contract, including how it behaves when a page fails halfway.
How do you compare dlt merge with Hydra upsert?
Use the same primary key and a fixture containing a new row, an updated row and a duplicate. Compare final rows, null handling and error behavior; similarly named write modes do not guarantee identical semantics.

How it works: dlt merge can use keys and a destination-specific strategy, while Hydra upsert uses a supported destination’s key-based write behavior. Both may keep one current row per business key, but the handling of duplicate incoming keys, nulls, deletes and failed batches can differ. Their source extraction state is independent of the write strategy.

Practical check: Build a batch with a new key, an existing key with changed amount, two versions of one key and a null key if allowed. Run each system into isolated tables with the intended constraints. Compare the winning value, rejected rows and committed state. Interrupt a later batch and rerun to expose partial-write or replay differences.

Pitfall to avoid: Do not infer equivalence from a first-run row count or the label “merge.” A dlt merge key can be configured per table, including nested tables, while Hydra destination settings may target another grain. Document the exact key and update policy. If history or delete handling is required, test it explicitly before replacing the existing loader.
What should a dlt-to-Hydra proof of concept include?
Include the source schema, an initial full load, a changed record, a late record, a schema change and an interrupted run. Record expected outputs and recovery behavior, rather than judging the proof of concept by YAML length.

How it works: A proof of concept should demonstrate one selected pipeline’s data contract and recovery behavior, not a general platform verdict. The test must include extraction, schema, transformation and destination semantics because a correct transformation on an incomplete source feed is still an incorrect pipeline.

Practical check: Prepare an immutable input, expected target rows, schema DDL, key definition and runbook. Execute first load, update, duplicate, late record, new field and interrupted load. Compare rows by business key and inspect state after each phase. Record versions, resource use and the exact Hydra command so another engineer can reproduce the result.

Pitfall to avoid: Avoid a pilot that only shows a green validation result or a pretty YAML diff. Validation cannot prove a source API delivered every page or that a late update reached the target. Also avoid changing the source snapshot between runs; use controlled fixtures or a transactionally consistent export so mismatches can be attributed to behavior rather than timing.
Can a dlt pipeline and a Hydra workflow share a schedule?
They can be coordinated by one scheduler with a defined table or file handoff. Give one component responsibility for triggering and retrying each stage, and keep the old schedule disabled only after the replacement path is verified.

How it works: One scheduler can coordinate a dlt pipeline and a Hydra job. The safe order is to finish a dlt load, confirm its landed object is committed, run Hydra against that object and publish a target only after validation. dlt and Hydra should not independently trigger the same batch.

Practical check: Choose an owner for the schedule and retries, then pass a batch ID through both stages. Test upstream failure, downstream failure and a zero-row successful load. The runbook should say whether to rerun dlt, Hydra or both, and should include the dlt state ID, landing table and Hydra report location.

Pitfall to avoid: Two schedules set to 06:00 can race: Hydra may read yesterday’s data while dlt is still loading. A blanket retry of the whole chain can also resync an API and append duplicates when only the transformation failed. Use an explicit completion dependency and separate target ownership; preserve dlt state throughout the pilot.
Does Hydra automatically normalize nested JSON like dlt?
Do not assume so. dlt normalization can produce related tables and generated keys; test the nested record shape and downstream schema explicitly before replacing that extraction path.

How it works: dlt normalization can split nested JSON into related tables with generated linkage keys. Hydra array handling may keep an array, flatten columns, explode rows or serialize JSON depending on the job. These results are different relational contracts even when the source document is the same.

Practical check: Use parent documents with two children, an empty array and an updated child. Compare the dlt parent and child tables to each proposed Hydra output, then run the downstream join used by consumers. Record whether generated keys remain stable across reordering and updates. Only move the nested resource if the required output shape can be reproduced and verified.

Pitfall to avoid: A parent table can look correct while child rows are lost or duplicated. Do not assume `flatten` or `explode` recreates dlt child-table keys, and do not use a JSON text column if consumers expect relational children. Retain dlt normalization upstream when those key relationships are essential, then evaluate Hydra for a later bounded transformation.
How do you roll back from Hydra to dlt?
Preserve the original dlt state and target through the pilot. Stop the Hydra schedule, route consumers back to the original target and resume dlt from its saved state after checking for records written during the cutover window.

How it works: Rollback restores both control and data: the scheduler, source checkpoint and consumer target. Keeping dlt state means the original extractor can resume at a known point, while preserving its target gives readers a stable relation. A new Hydra target should remain isolated until the cutover is deliberately accepted.

Practical check: Record the last successful dlt state value and last published batch before enabling Hydra. If the new path fails, stop its trigger, point consumers to the old table and reconcile updates that arrived during the pilot. Restart dlt from preserved state and compare keys, values and timestamps for the cutover interval before declaring recovery complete.

Pitfall to avoid: Do not delete dlt state, rerun a full refresh automatically or leave both paths writing the published table. Any of these can create duplicates, missed updates or an untraceable mixed target. A rollback drill should be performed in staging, with the exact commands and queries written down for the operator who will execute it.

Sources and method
The product descriptions were checked against the vendor references below and the Hydra DSL documentation. The comparison concerns the stated workflow, not all features or editions. The browser simulator is neither an engine run nor a performance benchmark.

dlt: How dlt works ↗

dlt pipeline execution ↗

dlt schema contracts ↗

dlt resource configuration ↗

02 / Try

#### dlt vs Hydra: sample pipeline

#### Same small batch, two definitions

Read 14 sample orders, keep amounts above 50, sum by status and sort by total. Right-click inside either editor or use ⋯ for its line actions. Edit the Hydra threshold to recalculate the result; the source threshold follows where the displayed example includes one. The browser models this fixture and does not run either product.

Browser simulation

dltPython ELT library
⧉↓⬡⤢⋯

import dlt

@dlt.resource(name="orders")
def orders():
yield from read_orders() # your Python extractor

pipeline = dlt.pipeline(
pipeline_name="orders", destination="duckdb"
)
info = pipeline.run(orders())
CopyDownloadIllustrative example

Hydra ETLYAML job files
✓▶⇢⧉⤢⋯

# sources.yaml
sources:
orders:
type: csv
extract:
table: data/orders.csv

# pipeline.yaml
pipeline:
from: orders
to: report

# transformations.yaml
steps:
- cast:
mapping: { amount: float }
- filter:
expr: "amount > 50"
- aggregate:
by: [status]
agg:
total: { func: sum, col: amount }
- sort:
by: [total]
ascending: false

# destinations.yaml
destinations:
report:
type: csv
load:
table: data/by_status.csv
mode: replace
Run sampleResetCopyDownload textRunnable ZIP

Lines in these examples dlt / Hydra

Files representedExample / 4 Hydra files

Run scope14 browser-local rows

Line counts are live counts of the text shown above, not a product benchmark. The dlt pane is illustrative and is not executed. The Hydra pane shows four files in one editor for comparison; only the displayed cast, filter, aggregate and sort operations are simulated. “Download text” includes your edits; “Runnable ZIP” contains the original four files and input CSV, validated with Hydra 0.22.0.

##### Simulated run result
×

StatusTotal

×

03 / Integrate

#### Introduce Hydra in a dlt environment

Start with a reversible pilot. Keep the current system running until the new output and failure behavior are verified.

##### Before you change a schedule or destination

A named dlt pipeline and its current destination, with a reproducible input fixture.

The dlt cursor, write disposition, schema contract and merge key, if any.

A separate Hydra staging output that cannot overwrite the production table.

Hydra CLI installed where the handoff command will run, with the same credentials policy as the existing pipeline.

##### Step-by-step integration and migration

01

###### Freeze the current contract

Export the dlt schema, current state and destination DDL. Capture two representative runs, including one with a changed record. Record row counts, keys, null rates and the exact query or file consumers use. Without this baseline, a clean Hydra run can still hide a semantic regression.

02

###### Pick a handoff

For coexistence, leave the dlt resource unchanged and expose its landed table or an immutable export to Hydra. For replacement, choose a dlt resource that reads a Hydra-supported source without custom Python pagination or nested normalization. Do not change both extraction and loading in the same first experiment.

03

###### Build and validate the Hydra job

Create sources.yaml, pipeline.yaml, transformations.yaml and destinations.yaml for the chosen input. Point the destination to a new table or file. Start with the downloadable orders fixture to prove the local CLI, then change one connection at a time. Run hdrctl validate with strict checks before reading real data.

04

###### Run parallel comparisons

Feed the same frozen snapshot to dlt and Hydra. Compare keys, values, output schema and rejected rows, not just total row count. Repeat with an added field, a changed type and an empty value so the schema contract difference is visible.

05

###### Test the second run

Insert a new record, update an existing key and supply a late record. Compare the dlt state and target with the Hydra target. If Hydra needs an external watermark or preprocessing step, document that component explicitly before moving the schedule.

06

###### Cut over one owner

Choose which process starts the pipeline and owns retries. Keep dlt state and configuration available until the Hydra run has completed several normal cycles and a recovery drill. Disable the old schedule only after the new path has demonstrated equivalent results.

##### A minimal handoff after the existing dlt load

# In a script or scheduler that already runs the dlt pipeline:
python load_with_dlt.py
hdrctl validate /srv/hydra/orders --strict
hdrctl run /srv/hydra/orders
# Configure Hydra sources.yaml to read the table/file dlt wrote.
# Configure Hydra destinations.yaml to write a separate staging target.

Adapt the paths, project files and credentials to your deployment. The runnable orders fixture ZIP is a safe starting point for the Hydra side; its local YAML was validated with Hydra 0.22.0.

##### Acceptance checks before cutover

First and second runs have expected key counts and no duplicate keys.

Destination types and nullable columns match the published contract.

A late-arriving row follows the agreed policy.

An interrupted run can be retried without data loss or duplication.

The previous schedule is disabled only after the new one succeeds.

##### Rollback plan

Stop the new scheduler, point consumers back to the original dlt destination, and resume the dlt pipeline from its preserved state. Do not reset or delete dlt state during the pilot; a clean rollback depends on it.

##### Practical pitfalls

Do not assume dlt incremental state maps automatically to Hydra.

Do not infer parity from a CSV-only simulation.

Test schema evolution separately.

Build the pilot
Use the CLI reference to create and validate a project, then use the DSL guide for source, transformation and destination syntax.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra ETL vs Flowman — slug: /migrate/flowman/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All comparisons
Compare with Hydra ETL
Explore Hydra CLI ↗

Compare & migrate/Flowman

Product comparison · Declarative Spark ETL

### Hydra ETL vs Flowman

Flowman and Hydra both use declarative YAML for ETL. Flowman builds data flows on Apache Spark; Hydra executes supported ETL jobs through its own engine. Flowman is the better fit when distributed Spark computation is required. Hydra is worth evaluating for smaller file and database workloads.

Scope: A simple batch mapping, not a Spark-scale benchmark. Reviewed 17 November 2026

Comparison Simulator Migration & integration

01 / Compare

#### Where the tools overlap and diverge

Short answer
Flowman and Hydra both use declarative YAML for ETL. Flowman builds data flows on Apache Spark; Hydra executes supported ETL jobs through its own engine. Flowman is the better fit when distributed Spark computation is required. Hydra is worth evaluating for smaller file and database workloads.

Product contextCapabilitiesDetailed analysisTechnical evaluationWorked exampleDecision20 questions

##### What Flowman does, and what Hydra changes

Flowman is a declarative ETL framework powered by Apache Spark. Its specifications describe physical relations, mappings, targets and jobs. Hydra also uses declarative configuration, but its supported ETL operations run in the Hydra engine. The engines are a decisive difference: a Spark workload may depend on distributed compute, partitioning and Hive or Delta integrations that a small Hydra job cannot simply inherit.

The strongest migration candidates are bounded file or JDBC jobs whose input size and transformations fit Hydra’s engine and connector set. Flowman jobs that create relations or manage schemas need special attention because moving the data flow may leave schema-management responsibilities behind. The useful coexistence pattern is to keep Flowman for Spark-scale builds and let Hydra own a small adjacent ingestion or delivery job.

The simulator’s 14 orders are intentionally favorable to a local ETL engine. It is not a performance comparison with Spark, and neither execution plan nor memory use is measured. A professional decision requires a representative data volume and a realistic run schedule.

##### What both can do

Declarative ETL definitions

Named inputs, transformations and outputs

Git-friendly project files

##### Key differences

AreaFlowmanHydra ETL

EngineApache SparkHydra engine

ModelRelations, mappings, targets and jobsSources, transformations, destinations and workflows

ScaleDistributed Spark workloadsAssess against actual data and available engine backends

OperationSpark runtime and Flowman executionHydra CLI, project and triggers

##### Detailed comparison for a production decision

###### Relations and connection contracts

Flowman relations define physical data sources and sinks, including connection and schema information. Some relation types can create tables or perform schema management. In Hydra, sources and destinations describe connections and extraction or load behavior. The same table name may hide different coercion, DDL or overwrite semantics.

For every candidate, record relation type, format, schema, partition columns and creation behavior. Test both read and write sides with nulls, incompatible values and missing columns. If Flowman currently creates a Hive or JDBC table, assign that DDL responsibility explicitly before Hydra takes over the data movement.

Product documentation: Flowman relations ↗

###### Mapping graph versus transformation steps

Flowman mappings represent a data flow and can be composed into targets. Hydra transformation steps can express many common row and table operations, but the evaluation strategy and intermediate data model differ. A named Flowman mapping reused by several targets should not be collapsed into one Hydra step without checking every consumer.

Draw the Flowman mapping graph, including filters, joins, aggregations and sort requirements. Translate one target at a time, preserving grouping keys and output schema. Compare results by stable business key; Spark output order is not generally a meaningful equality criterion unless sorting is part of the contract.

Product documentation: Flowman mappings ↗

###### Spark scale and engine selection

Flowman’s Spark foundation can distribute transformations across a cluster. Hydra’s available engine backends and deployment topology must be tested on the actual workload. A toy line-count comparison says nothing about 500 GB joins, shuffle cost, memory pressure or partitioned output.

Benchmark with representative row count, column width, skew and destination format. Record elapsed time, peak memory, failure recovery and cost for both systems. If the Spark job is genuinely distributed, keep it in Flowman and migrate adjacent small jobs first.

Product documentation: Flowman framework overview ↗

###### Jobs, targets and parameters

A Flowman job lists targets to build, and Flowman determines build order from dependencies. Job parameters can influence the processing date or output. A Hydra workflow explicitly sequences jobs and actions. To migrate, map target dependencies and each parameter’s effective value, not just the final target name.

Exercise a normal date, an empty date and a historical rerun. Confirm that filters and partition destinations use the same range. If Flowman’s dependency discovery builds a shared target once, ensure the Hydra workflow does not run it twice or publish partially built outputs.

Product documentation: Flowman jobs ↗

###### Operational coexistence

Flowman may continue to own large transformations while Hydra performs a small preflight, file normalization or downstream delivery. A stable file or database table is the handoff. The upstream job’s completion status must be observed before Hydra reads the output.

During migration, keep the old Flowman job and its scheduler entry available. Do not decommission Spark infrastructure based on a successful small-file pilot. The operational benefit only exists when the complete set of dependent jobs and workloads has been accounted for.

Product documentation: Flowman jobs ↗

##### Technical evaluation: Flowman and Hydra ETL in production

###### Flowman projects separate relations, mappings, targets and jobs

Flowman describes data locations and schemas as relations, transformations as mappings, writing as targets and execution as jobs. Hydra ETL expresses a source, ordered transformation steps, destination and optional workflow. Both are declarative, but their objects have different responsibilities. A Flowman relation may be reused by several mappings, while a target may control physical table creation and partition writes. A migration inventory must therefore follow references from the selected job through every mapping to the relations and targets it uses.

Create a dependency diagram for one bounded Flowman target: input relation, intermediate mappings, output relation, job phase and downstream consumer. Record each file format, path, JDBC connection, schema and partition key. A direct Hydra job is plausible when that chain uses supported connectors and transformations at a manageable volume. A Spark-heavy chain with complex partitioning may be better left in Flowman while Hydra handles a smaller downstream table or export.

Further reading: Flowman mappings ↗

###### Lazy mapping resolution changes how the graph executes

Flowman can resolve upstream mappings when a target requires their result, so the apparent project file order is not necessarily execution order. A Hydra transformation list is ordered within a job. Before translation, expand the actual Flowman mapping graph and identify where filters, joins, aggregations and caches occur. A straight-line YAML rewrite may compute an operation earlier or on a different set of rows, changing results or memory use.

Use a fixture with a filter before a join, a duplicate join key and a null grouping value. Compare the Flowman target with a Hydra job that implements the intended logical order. Inspect intermediate counts if possible. If a Flowman mapping is reused by multiple targets, decide whether Hydra should materialize it once or repeat it in separate jobs. That choice affects performance, freshness and the possibility of inconsistent downstream results.

Further reading: Flowman mappings ↗

###### Spark execution is a decisive architectural difference

Flowman runs on Apache Spark and can use distributed execution for large relations. Hydra may use pandas or DuckDB for supported transformations, but that does not make it a drop-in Spark runtime. A data set that fits on a developer machine may spill or fail at production width, skew or join cardinality. The comparison should state row count, byte size, key skew, join type and runtime environment before discussing speed or operational simplicity.

Benchmark a representative partition under the actual memory limit. Capture elapsed time, peak memory, input and output bytes, and the number of workers or executors involved. Test the worst wide row and the most frequent join key, not only a uniform sample. Keep Flowman for distributed workloads when Spark’s scale is required. Evaluate Hydra for bounded jobs where the simpler runtime can meet both correctness and performance requirements without an invented benchmark claim.

Further reading: Flowman framework ↗

###### Relation schemas and physical ownership matter

A Flowman relation specifies a physical location or connection and can describe a schema. The same relation may be read by one mapping and written by a target in another job. Hydra sources and destinations can address a similar file or table, but the migration must determine which system creates the physical object, changes its DDL and validates its contents. If both systems believe they own the target schema, a pilot can succeed once and fail after a schema evolution.

Record the relation kind, format, path or database, schema definition, partition fields and write permissions. Run the existing Flowman job on a frozen input, then create a separate Hydra target with the same intended contract. Compare column names, types, nullability and partition paths as well as row values. A target that returns the same CSV rows but drops a required Parquet schema or partition layout is not a production-equivalent replacement.

Further reading: Flowman relations ↗

###### Target phases include more than writing rows

A Flowman relation target can participate in phases such as CREATE, BUILD, VERIFY, TRUNCATE and DESTROY. The BUILD phase writes the mapping result, while other phases can prepare or check the physical relation. Hydra load modes describe destination writes but do not automatically represent every Flowman lifecycle phase. A migration plan must explicitly preserve required DDL creation, verification and cleanup, either in a Hydra workflow, database migration or retained Flowman step.

Trace the actual job invocation and list which phases run in production. Make the pilot fail before BUILD, during BUILD and before VERIFY. Observe whether a partial relation remains and what the next run does. If Flowman VERIFY is the control that prevents an empty target from being published, implement an equivalent check before cutover. This detail turns a generic “Flowman vs Hydra YAML” page into an operationally useful comparison.

Further reading: Flowman relation target ↗

###### Partition behavior and file count affect consumers

Flowman targets can write specific or dynamic partitions and control parallelism, which influences the number of output files. Downstream Spark or warehouse jobs may rely on that partition directory structure, even if the table rows are identical. A Hydra replacement needs to preserve the required partition key, overwrite scope and file format, or the consumer contract must be deliberately changed. A full-table replace is not the same as overwriting one processing-date partition.

Use two dates and one late record in the fixture. Run Flowman for the second date and inspect both partition directories before and after. Run Hydra against an isolated output and compare which partitions change, row counts, path names and file formats. If Hydra cannot reproduce the partition contract, keep Flowman for that target or add a separate publishing stage. This is a strong reason to assess migrations target by target rather than counting YAML lines.

Further reading: Flowman relation target ↗

###### Parameter substitution needs a historical-run test

Flowman projects may use variables such as a processing date in relation paths, SQL or target partitions. Hydra parameters and environment values can express supported variable uses, but the actual replacement must preserve which date is processed and where it is written. A workflow scheduled tomorrow may need to process yesterday’s partition; a manual backfill may need a date months earlier. A default of the current clock time can silently corrupt a migration.

Record each Flowman variable, its source and its use in the graph. Run the same historical date through the old job and candidate Hydra job, then compare input selection and output partition. Test a missing parameter and an invalid date. Make the run fail before writing when a required value is absent. The migration record should show the exact command and environment used for a backfill, not simply say that both products support parameters.

Further reading: Flowman jobs ↗

###### A shared architecture can preserve Spark where it is needed

A mixed Flowman-Hydra architecture is credible when Flowman performs a distributed upstream mapping and publishes a stable file or table, while Hydra executes a bounded downstream transformation or workflow action. The handoff should specify format, schema, partition, freshness and ownership. If Flowman is still needed for a large join, forcing that join into Hydra solely to claim platform consolidation would increase risk and might increase resource cost.

Set one orchestrator to trigger the stages. It should start Hydra only after the relevant Flowman target has passed its verification phase. Pass a processing date or batch identifier, then reconcile output counts across the boundary. Test an empty Flowman partition, a failed Spark job and a failed Hydra destination. The consumer must continue reading the previous published result until the new run is complete. This is a concrete integration path for a Flowman estate.

Further reading: Flowman relation target ↗

###### A proof of concept must include scale and skew

The first Flowman-to-Hydra pilot can use a small fixture to prove semantic equivalence, but the decision requires a second test with representative volume. Choose a target with supported connectors and a known business key. Compare output values, nulls and schema on the small set. Then benchmark a production-sized partition with realistic join skew, wide rows and expected concurrency. A correct one-minute demo cannot establish that a large Spark job is safe to run in a single-process ETL engine.

Record resource limits, elapsed time, memory, spill or failure behavior and output file count. If the Hydra run meets the service objective with headroom, it may be an appropriate replacement for that specific target. If it does not, retain Flowman and consider a downstream Hydra integration instead. Publishing the test conditions prevents misleading claims about relative performance and gives technical readers a model they can reproduce in their environment.

Further reading: Flowman framework ↗

###### Cutover and rollback should preserve relation contracts

For a selected target, keep Flowman writing the production relation while Hydra writes an isolated equivalent through several cycles. Reconcile every partition and confirm downstream queries against both outputs. At cutover, stop one writer, record the last processing date or batch, publish the new target and verify its schema and path. Avoid changing both the target location and consumer logic in the same uncontrolled step.

Rollback requires the old Flowman project, runtime and relation configuration to remain available. Stop Hydra, restore the consumer to the original relation and reprocess only the partitions written during the cutover window. Confirm row counts and schema after recovery. If the output is partitioned, rollback one partition at a time rather than truncating a whole table. This procedure is a meaningful answer to “how to migrate Flowman to Hydra” because it names the data boundary and recovery action.

Further reading: Flowman relation target ↗

##### Worked evaluation: a partitioned Spark target

Assume a Flowman project reads two large relations, filters sales for a processing date, joins them to product metadata, aggregates revenue and writes a partitioned Parquet target through Spark. The relation, mapping, target and job definitions jointly describe the behavior. Capture the actual dependency graph, physical schemas, partition key, target mode, parallelism and job phases. A Hydra replacement cannot be judged from the fact that both systems use YAML or from a small CSV sample. The question is whether this particular target’s semantics and scale fit Hydra.

Start with a frozen small fixture containing two processing dates, a duplicate product key, a missing product and a late sales correction. Run Flowman and save the target partition files and a sorted row extract. Build a Hydra job with supported source, join, filter, aggregate and destination steps pointing to an isolated target. Compare revenue values, null behavior, join cardinality, column types and partition paths. A duplicate product key can multiply sales rows; a matching grand total on one fixture does not prove the join was translated correctly.

Next run a second processing date and inspect which output partitions changed. Flowman’s relation target can write a specific partition and participate in CREATE, BUILD and VERIFY phases. A Hydra full-table replace would be incorrect if it erased the first date. If Hydra cannot reproduce the partition write contract, keep the target in Flowman or add a separate publishing stage. Record the exact target phase that verifies data exists, and ensure the new path has an equivalent quality gate before consumers read it.

After semantic tests pass, benchmark a representative production partition with real row width, join skew and expected concurrency. Capture bytes read, elapsed time, peak memory, spill behavior and output file count. Flowman uses distributed Spark execution; Hydra’s available engine and memory profile are different. A correct local result is a prerequisite, not a performance verdict. If the job exceeds Hydra’s practical limits, retaining Flowman for the heavy stage is a sound outcome, while Hydra may still process a smaller downstream export.

Fail the target midway through BUILD and observe which files or table rows remain. Retry both implementations and compare the final partition. Then run the historical processing date again with a late correction and check whether only that partition changes. Include the Flowman variable supplying the date and the Hydra parameter that replaces it. The operations runbook should specify how to identify an incomplete partition and prevent its publication, not merely how to restart the command.

The decision record should say whether the selected target is replaced, integrated or retained, supported by output diff, partition check and representative benchmark. At cutover, stop one writer, preserve the old Flowman project and reconcile the last processed date. Rollback restores the previous relation for affected partitions and reruns only the uncovered interval. The decision should identify the target and volume tested, so it can be reassessed if Spark scale or partition requirements later change.

Related product documentation: Flowman relation target and partitioning ↗

##### Decision criteria for an existing Flowman deployment

A Flowman decision needs both a semantic and a scale verdict. The semantic verdict compares relation schemas, mapping outputs, target phases and partition contracts. The scale verdict compares a representative Spark run with the proposed Hydra execution under realistic memory, skew and concurrency. A pass on one axis does not imply a pass on the other. A small CSV fixture can validate joins and filters, while a production-sized partition is needed to judge whether leaving Spark is operationally sensible.

Document output file layout as part of the contract. Flowman parallelism and partition settings can influence the number and placement of files, which affects downstream jobs even if aggregate rows match. If Hydra produces different paths or rewrites unrelated partitions, retain Flowman for that target or add a publishing stage. If the output is only a modest unpartitioned table, Hydra may be a simpler owner. The decision must name the selected target rather than claim compatibility for every Flowman project.

The final record should show the relation and mapping graph, schema diff, per-partition row comparison, resource benchmark, failure drill and rollback steps. Keep the Spark project deployable until the new target has survived several cycles. Where Flowman remains upstream, define a verified handoff to Hydra instead of two independent schedules. This gives a technical reader an evaluation method they can repeat with their own data size and target constraints.

##### Where each approach fits

##### Keep Flowman when

Keep Flowman for workloads whose performance or behavior depends on distributed Spark.

##### Evaluate Hydra when

Try Hydra on a small file or database mapping whose operators exist in the Hydra DSL.

##### Should you replace Flowman with Hydra ETL?

Keep Flowman for workloads whose performance or behavior depends on distributed Spark. Try Hydra on a small file or database mapping whose operators exist in the Hydra DSL. For a first test, list Flowman relations, mappings, targets and job schedules. See the complete integration plan.

##### Frequently asked questions about Flowman and Hydra ETL

These answers cover product fit, data movement, orchestration, migration testing and rollback. Check the linked product documentation for version-specific behavior.

How are Flowman and Hydra similar?
Both support declarative ETL definitions. Flowman uses relations, mappings, targets and jobs on Apache Spark; Hydra uses sources, transformations, destinations and workflows in its own engine.

How it works: Both tools describe data processing declaratively, but Flowman builds on Spark concepts such as relations, mappings and jobs, while Hydra uses its own sources, transformations, destinations and orchestration. Similar YAML does not imply identical runtime behavior.

Practical check: Compare a concrete pipeline end to end: input schema, transformation result, output schema, resource use and recovery. Record the Spark version and execution mode as part of the Flowman baseline. Use representative data sizes.

Pitfall to avoid: Do not compare only configuration length. Spark partitioning, shuffle and distributed execution can dominate a real workload. A small browser sample cannot establish replacement suitability for a large Spark job.
Can Hydra replace a Spark-scale Flowman job?
Only after a representative performance and correctness test. A small CSV example cannot establish parity for distributed joins, shuffles or large partitioned output.

How it works: A Spark-scale Flowman job may rely on distributed joins, shuffles and storage connectors. Hydra execution must be assessed against the actual data volume and engine capabilities; conceptual step parity is not performance parity.

Practical check: Benchmark one representative partition with realistic skew, row width and target write behavior. Measure wall time, peak memory, spill, source pressure and output parity. Preserve the Spark path while testing an isolated Hydra target.

Pitfall to avoid: Do not infer scale from a toy CSV run. A transformation that fits in memory on a sample can fail when a global operation gathers millions of rows. Keep Spark for workloads whose measured requirements exceed the replacement path.
What is a Flowman relation?
It describes a physical source or sink and may include connection and schema behavior. When moving to Hydra, map both access and any table-creation or schema-conversion responsibility.

How it works: A Flowman relation names a source or sink abstraction and may include format, schema and connection options. Hydra separates source extraction and destination loading, so relation attributes need explicit mapping.

Practical check: Inventory every relation’s location, format, partitioning, schema and credentials. Map a read relation to a Hydra source and a write relation to a destination. Compare field types and nullability with a small fixture.

Pitfall to avoid: Do not assume a relation path or schema is interpreted identically. Default CSV header handling, timestamps or partition discovery can alter rows. Test the effective relation, not just the YAML spelling.
Do Flowman mappings map one-to-one to Hydra steps?
Not always. A Flowman mapping can be reused and can express a graph. A Hydra transformation step is part of a job sequence. Translate the behavior of each target and its consumers, not only names.

How it works: Flowman mappings can chain operations and materialize intermediate relations. Hydra transformations may express equivalent logic in different steps, and some Flowman functions may require another engine or custom implementation.

Practical check: Write the expected table after each mapping, including order, nulls and types. Rebuild the logic in Hydra step by step and compare fixtures. Check whether an intermediate relation is consumed elsewhere before removing it.

Pitfall to avoid: Avoid a one-to-one translation based on operation names. Window boundaries, aggregate null behavior and type coercion may differ. A visually similar pipeline can produce subtly different totals.

Also compare whether a mapping materializes an intermediate dataset or merely defines a lazy relation. That distinction changes when an error appears and how much work a retry repeats.
How should Flowman job parameters be migrated?
Record every parameter that changes source filtering, target partition or date range. Map it to a Hydra parameter and test normal and historical runs with the same effective value.

How it works: Flowman job parameters may resolve across project configuration and runtime arguments. Hydra parameters and environments have their own precedence and interpolation, so values must be mapped explicitly.

Practical check: Create a matrix of parameter name, type, default, environment override and run override. Test dev and prod with a safe target. Verify the resolved partition, source path and destination before a write.

Pitfall to avoid: An inherited default can point a test to the production schema. Do not place secrets in YAML examples or command history. Validate missing required parameters as a failure, not an empty string.
Can Flowman and Hydra coexist?
Yes. Keep Flowman for large Spark workloads and use Hydra for a bounded adjacent ETL job. Connect them through a completed file or table and one scheduler owner.

How it works: Flowman can continue processing Spark-heavy stages while Hydra handles smaller ETL jobs, validation or publishing. The integration boundary is a durable table or file with a known schema and completion signal.

Practical check: Make Flowman publish a versioned output and trigger Hydra only after it is complete. Pass an immutable batch URI and reconcile row counts and checksums. Document which system owns a failed handoff.

Pitfall to avoid: Avoid shared writes to the same target during a pilot. A Spark task may still be committing when Hydra reads. Keep the old consumer route available until the new output has been checked.
What happens to Flowman-managed schemas?
Someone must own DDL and schema migration after a target moves. Do not assume a Hydra load automatically creates, alters or converts a table exactly as a Flowman relation did.

How it works: Flowman-managed schemas may influence relation reads and writes, while Hydra applies its own extraction and destination mappings. The consumer-visible schema is the contract to preserve.

Practical check: Capture the effective DDL, field order, types, precision, nullability and partition columns. Feed edge cases such as empty strings and timezone offsets through both paths. Compare values and schema metadata.

Pitfall to avoid: Counts are insufficient. Silent decimal precision loss, changed null handling or renamed columns can break downstream analytics. Do not cut over until consumers accept the new schema explicitly.

Document downstream schema consumers before changing field names.
What metrics matter in a Flowman comparison?
Correctness, schema, representative elapsed time, memory, cluster cost, partition behavior and recovery. Code length or 14-row browser output is not a performance measure.

How it works: A meaningful comparison includes data correctness, operational reliability and resource cost. Spark may trade startup overhead for distributed throughput; Hydra may be efficient for smaller, focused jobs.

Practical check: Measure full run time, input and output rows, CPU, peak memory, spill, retries and operator recovery on the same data. Repeat after a warm and cold start. Include cluster and database load.

Pitfall to avoid: Do not compare only elapsed time from different hardware or target settings. Compression, partition count and network location can dominate results. Publish the benchmark conditions with any conclusion.
Does the simulator execute Spark?
No. It models one tiny transformation in the browser and does not start Flowman, Spark or the Hydra engine.

How it works: The simulator illustrates a shared transformation example but does not start Spark or a Flowman runtime. It shows conceptual configuration and local results, not distributed execution behavior.

Practical check: Use it to inspect the mapping, then run Flowman and Hydra in controlled environments against a representative partition. Compare output rows and resources and report the runtime versions.

Pitfall to avoid: Do not claim Spark performance parity from the browser. The simulator omits shuffle, executor memory, cluster scheduling and storage locality. Its line count is a readability cue only.
How can a Flowman migration be rolled back?
Retain the original project and schedule entry. Restore the Flowman target as the consumer source and rerun the affected parameter range after checking for partial Hydra output.

How it works: Rollback restores the Flowman job, its input checkpoint and the previously published output. A Hydra pilot should write separately so the old Spark output remains a known-good fallback.

Practical check: Version the target and record the cutover batch. If the new path fails, stop its trigger, switch consumers to the old output and replay only missing batches in Flowman. Reconcile keys and aggregates.

Pitfall to avoid: Do not let both jobs publish to one table during recovery. A delayed Spark commit can overwrite the new result. Preserve the cluster configuration and dependencies until a rollback rehearsal passes.

###### Migration and integration questions

How do you migrate a Flowman job to Hydra ETL?
Inventory Flowman relations, mappings, targets, jobs and Spark-specific settings. Translate one small supported pipeline into Hydra job files, then compare output schema and rows using the same snapshot.

How it works: Migration translates the observed Flowman job contract into Hydra sources, transformations and destinations. Relations and mappings are design inputs; there is no reliable blind YAML conversion.

Practical check: Capture effective input schema, each intermediate result, target DDL and schedule. Build a Hydra job for one bounded pipeline, compare outputs and failure recovery, then move the schedule and consumer pointer.

Pitfall to avoid: A syntax-level port can miss Spark SQL semantics, partition filtering or hidden defaults. Use edge-case fixtures and a realistic volume test before removing Flowman from the path.

Keep a versioned output manifest.
Can Hydra replace Flowman Spark execution?
Hydra should not be presented as a general Spark replacement. Evaluate it for smaller supported ETL workloads; retain Flowman where distributed Spark processing, scale or Spark-specific operators are required.

How it works: Hydra may replace a Flowman workload when its engine and connectors meet the measured data and latency requirements. Flowman’s Spark execution can remain important for wide, distributed transformations.

Practical check: Test data skew, global aggregates, joins and output load on a representative dataset. Observe peak memory and failure recovery. Keep a hybrid option in which Spark produces a bounded relation for Hydra.

Pitfall to avoid: Avoid treating a successful small batch as evidence of large-volume equivalence. If a global step gathers data in one process, memory behavior can change abruptly. Decide from measurements.
How do Flowman relations map to Hydra sources and destinations?
A Flowman relation can represent input or output data depending on its role in the job. Map each relation to a Hydra source or destination only after checking location, format, schema and write behavior.

How it works: A read relation can become a Hydra source; a write relation can become a destination. Format options, partition discovery and schema rules do not necessarily map to a single property.

Practical check: For each relation, list URI, format, header, delimiter, compression, schema and partition columns. Run a fixture containing nulls and quoted delimiters. Verify both extracted rows and target schema.

Pitfall to avoid: Do not silently rely on connector defaults. Different CSV parsing or timestamp handling may yield valid but wrong data. Test the exact format and encoding from production.

Where one Flowman relation acts as both an intermediate input and a final sink, split those roles in the Hydra design and document which process owns each persisted copy.
How do Flowman mappings compare with Hydra transformations?
Flowman mappings define a chain of operations over relations; Hydra transformations define ordered job steps. Compare filters, joins, aggregates and type casts on representative rows, including nulls and duplicates.

How it works: Flowman mappings describe transformations over Spark relations; Hydra steps describe operations over its data pipeline. Equivalent business logic may require a different sequence of operations and explicit intermediate checks.

Practical check: Specify expected rows after filter, join, aggregate and cast. Compare null and duplicate behavior at every boundary. Preserve a Flowman intermediate relation if another workflow consumes it.

Pitfall to avoid: Do not translate by operation name alone. Join multiplicity, string comparison and numeric precision can differ. Validate final and intermediate results with keys, not only totals.

Compare row ordering only when consumers depend on it.
Is Flowman or Hydra better for large data volumes?
Flowman uses Spark for distributed workloads. Hydra may use pandas or DuckDB for supported jobs, but performance and memory depend on workload shape; benchmark the actual data and environment before deciding.

How it works: The better fit depends on workload shape. Distributed Spark execution can handle large shuffles, while Hydra may reduce complexity for moderate data and direct ETL workflows. Neither label determines the outcome.

Practical check: Benchmark a normal day and a peak day, including source read, transformation and target commit. Record cluster resources, memory, elapsed time and operator intervention. Evaluate maintenance cost alongside throughput.

Pitfall to avoid: Do not generalize from one synthetic dataset. Skewed keys and wide records can reverse performance conclusions. State the measured limits and keep a fallback for workloads outside them.

Include database write pressure in resource measurements.
What is a practical Flowman-to-Hydra handoff?
Flowman can keep a Spark-heavy upstream stage and write a stable file or table that Hydra reads for a smaller downstream task. Set one writer per target and verify the handoff schema.

How it works: A practical handoff uses a durable Flowman output as Hydra input, with an explicit success marker and schema contract. This allows a staged migration without replacing the Spark-heavy segment immediately.

Practical check: Publish a versioned file or table, validate its schema and checksum, then invoke Hydra with that version as a parameter. Propagate a batch ID across both reports and gate consumers on Hydra success.

Pitfall to avoid: Avoid reading a live output directory before Spark commits all partitions. Partial data can appear plausible. Ensure cleanup does not delete the batch before Hydra retry finishes.

A manifest should state expected partitions and row counts so Hydra can reject an incomplete Spark output before publishing anything downstream.
Does Hydra understand Flowman YAML files?
No direct format compatibility is claimed. Both tools use YAML, but their schemas and runtime concepts differ; migrate semantics into Hydra files rather than copying Flowman configuration.

How it works: Hydra does not execute Flowman project, relation or mapping YAML directly. The business transformation must be expressed in Hydra’s supported DSL or kept as an external Flowman stage.

Practical check: Use the Flowman configuration to derive a functional specification. Recreate one source, transformation and destination at a time, validating each against fixtures. Keep original files for comparison and rollback.

Pitfall to avoid: Renaming YAML keys is not migration. Runtime semantics and connector options may differ. Do not delete Flowman definitions until the replacement has passed data parity and volume checks.
What is a safe first Flowman-to-Hydra pilot?
Choose a modest CSV or database job with a simple filter, aggregate and destination, no Spark-only feature and a frozen fixture. Compare rows, types, runtime memory and rerun behavior.

How it works: A safe pilot is bounded, observable and reversible. It should represent the risky transformation or connector without requiring a whole Spark estate to move at once.

Practical check: Choose one partition with joins, nulls and realistic volume. Write Hydra output to a separate target, compare keys, aggregates and schema, then simulate an interrupted run and replay. Record runtime resources.

Pitfall to avoid: A toy happy-path file will not expose shuffle or schema issues. Conversely, starting with the largest production job makes diagnosis expensive. Select a representative slice.

Keep the selected input partition frozen throughout the comparison.
How should Flowman partitioning be handled in Hydra?
Record partition keys, file layout and downstream expectations. Test whether the proposed Hydra output preserves the required partition contract; otherwise keep that stage in Flowman.

How it works: Flowman partitioning may determine which files are read and how Spark distributes work. Hydra must receive the intended partition filter or versioned input and produce an output that preserves consumer partition semantics.

Practical check: Document partition keys, timezone, late arrivals and overwrite policy. Test two adjacent partitions and an overlapping replay. Compare row placement and ensure a replace operation affects only the intended slice.

Pitfall to avoid: Do not replace an entire table when the old job overwrote one partition. This can erase history. Avoid assuming a directory name alone guarantees partition pruning or output isolation.
How do you roll back a Flowman migration?
Keep the original Spark job and output available. Stop the Hydra schedule, restore consumers to the Flowman target and reconcile writes made since the last matching checkpoint.

How it works: Rollback reactivates the Flowman process and restores published data from a known version. The input partition and cutover time determine what must be replayed.

Practical check: Keep Spark artifacts, configuration and credentials intact. Stop Hydra writes, restore consumer routing, then rerun only missing partitions. Compare checksums and schema before declaring recovery complete.

Pitfall to avoid: Do not allow late Flowman and Hydra runs to publish to the same relation concurrently. A successful rollback command is insufficient if consumers still point to the new target.

Verify restored consumer routing.

Sources and method
The product descriptions were checked against the vendor references below and the Hydra DSL documentation. The comparison concerns the stated workflow, not all features or editions. The browser simulator is neither an engine run nor a performance benchmark.

Flowman: declarative Spark ETL ↗

Flowman framework overview ↗

Flowman relations ↗

Flowman mappings ↗

Flowman jobs ↗

02 / Try

#### Flowman vs Hydra: sample pipeline

#### Same small batch, two definitions

Read 14 sample orders, keep amounts above 50, sum by status and sort by total. Right-click inside either editor or use ⋯ for its line actions. Edit the Hydra threshold to recalculate the result; the source threshold follows where the displayed example includes one. The browser models this fixture and does not run either product.

Browser simulation

FlowmanDeclarative Spark ETL
⧉↓⬡⤢⋯

# Flowman configuration map (illustrative)
relations:
orders: { kind: file, format: csv }
mappings:
filtered: { kind: filter, input: orders }
grouped: { kind: aggregate, input: filtered }
targets:
report: { mapping: grouped, relation: report }

See Flowman docs for complete runnable syntax.
CopyDownloadIllustrative example

Hydra ETLYAML job files
✓▶⇢⧉⤢⋯

# sources.yaml
sources:
orders:
type: csv
extract:
table: data/orders.csv

# pipeline.yaml
pipeline:
from: orders
to: report

# transformations.yaml
steps:
- cast:
mapping: { amount: float }
- filter:
expr: "amount > 50"
- aggregate:
by: [status]
agg:
total: { func: sum, col: amount }
- sort:
by: [total]
ascending: false

# destinations.yaml
destinations:
report:
type: csv
load:
table: data/by_status.csv
mode: replace
Run sampleResetCopyDownload textRunnable ZIP

Lines in these examples Flowman / Hydra

Files representedExample / 4 Hydra files

Run scope14 browser-local rows

Line counts are live counts of the text shown above, not a product benchmark. The Flowman pane is illustrative and is not executed. The Hydra pane shows four files in one editor for comparison; only the displayed cast, filter, aggregate and sort operations are simulated. “Download text” includes your edits; “Runnable ZIP” contains the original four files and input CSV, validated with Hydra 0.22.0.

##### Simulated run result
×

StatusTotal

×

03 / Integrate

#### Introduce Hydra in a Flowman environment

Start with a reversible pilot. Keep the current system running until the new output and failure behavior are verified.

##### Before you change a schedule or destination

A Flowman project inventory: relations, mappings, targets, jobs and scheduler entries.

Representative input size and data distribution, not only a sample fixture.

A separate staging output and an explicit owner for DDL/schema management.

Hydra-supported source and destination types for the selected target.

##### Step-by-step integration and migration

01

###### Classify by compute requirement

Separate small file/JDBC mappings from jobs that need distributed Spark, Hive or Delta behavior. Pick a bounded job for the pilot and record typical and peak volume, row width and skew. Leave cluster-scale jobs in Flowman.

02

###### Map relations and DDL

For the selected target, document read relation, output relation, schema, partitioning and whether Flowman creates or alters physical tables. Decide which system will own that DDL after migration.

03

###### Translate one mapping chain

Convert the needed filter, cast, join and aggregate operations into Hydra transformations, keeping a separate destination. Validate the YAML and run a frozen fixture before using production-scale data.

04

###### Compare outputs and resource use

Compare row-level values, nulls and target schema. Then benchmark on representative data. Capture elapsed time and memory, especially for joins and aggregate skew. A correct small fixture is necessary but not sufficient.

05

###### Preserve job parameter behavior

Map Flowman processing-date and environment parameters to Hydra parameters or source filters. Test a historical run and ensure the same partition or date range is produced.

06

###### Cut over one target

Disable only the selected Flowman scheduler entry after repeated successful Hydra runs. Retain the Flowman project and Spark runtime for other jobs and for rollback until every dependent target has been reviewed.

##### Validate and run the bounded Hydra replacement

# First export a frozen input from a Flowman relation.
# Configure Hydra sources.yaml for that file or supported JDBC table.
hdrctl validate /srv/hydra/flowman_small_job --strict
hdrctl run /srv/hydra/flowman_small_job
# Compare against the Flowman target in a separate staging location.
# Benchmark representative volume before switching the schedule.

Adapt the paths, project files and credentials to your deployment. The runnable orders fixture ZIP is a safe starting point for the Hydra side; its local YAML was validated with Hydra 0.22.0.

##### Acceptance checks before cutover

Result values and schema match, not only row counts.

Any Flowman-created table has an explicit new DDL owner.

Historical parameters produce the same range.

Representative data fits the Hydra runtime envelope.

Spark-scale Flowman jobs remain unaffected.

##### Rollback plan

Re-enable the selected Flowman scheduler entry, point consumers back to its original target and rerun the affected parameter range. Keep Flowman relation definitions and Spark infrastructure intact until the corresponding Hydra target has passed production-scale and recovery tests.

##### Practical pitfalls

Do not use this toy example as a Spark performance benchmark.

Preserve schema and partition semantics.

Keep Spark-scale jobs on their suitable runtime.

Build the pilot
Use the CLI reference to create and validate a project, then use the DSL guide for source, transformation and destination syntax.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra ETL vs Kestra — slug: /migrate/kestra/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All comparisons
Compare with Hydra ETL
Explore Hydra CLI ↗

Compare & migrate/Kestra

Product comparison · YAML orchestration

### Hydra ETL vs Kestra

Kestra and Hydra both describe workflows in YAML. Kestra is a broad orchestration platform with tasks and triggers; Hydra combines ETL jobs with workflows. For ETL-heavy projects compare the whole data path, not only how short the YAML looks.

Scope: Kestra flow orchestration and a Hydra workflow/job for a small batch pipeline. Reviewed 17 November 2026

Comparison Simulator Migration & integration

01 / Compare

#### Where the tools overlap and diverge

Short answer
Kestra and Hydra both describe workflows in YAML. Kestra is a broad orchestration platform with tasks and triggers; Hydra combines ETL jobs with workflows. For ETL-heavy projects compare the whole data path, not only how short the YAML looks.

Product contextCapabilitiesDetailed analysisTechnical evaluationWorked exampleDecision20 questions

##### What Kestra does, and what Hydra changes

Kestra and Hydra both make YAML central to authoring, but they apply it at different levels. A Kestra flow contains tasks, inputs, outputs, triggers and error behavior for broad automation. Hydra jobs describe supported ETL operations and Hydra workflows sequence jobs and actions. A team should compare the actual work performed by Kestra tasks with Hydra ETL steps, not conclude equivalence because both files have indentation.

Kestra can remain the orchestrator while a task invokes hdrctl. This is often the safest way to introduce Hydra in a Kestra estate: the flow keeps its schedule, retries, plugin integrations and execution history, while Hydra owns a bounded ETL transformation. A full move is narrower and requires a check of triggers, concurrency, task plugins and failure states.

The browser simulator runs neither Kestra nor Hydra. It is a local example of filter, cast, aggregate and sort. It does not model Kestra worker execution, task plugins, event triggers, flow inputs or output storage.

##### What both can do

YAML workflow definitions

Schedules and triggers

Task dependencies and run monitoring

##### Key differences

AreaKestraHydra ETL

Primary roleGeneral workflow orchestrationETL engine with workflow orchestration

Work unitPlugin tasks in a flowETL jobs and workflow actions

TransformTasks can invoke code or external toolsBuilt-in ETL transformations

SelectionBroad task/plugin reachETL-specific authoring and validation

##### Detailed comparison for a production decision

###### Flow tasks versus ETL steps

Kestra distinguishes runnable tasks that do work from flowable tasks that control orchestration, such as parallel branches, switches and loops. Hydra transformations such as cast, filter and aggregate operate inside a data job. A single Kestra shell or Python task may contain an entire ETL program, while a Hydra job makes many of those operations explicit.

Classify each Kestra task by purpose before translating it. A log or notification belongs to orchestration, a database query may remain a plugin task, and a linear data transformation may become a Hydra job. Do not translate task count to step count; compare the data contract and graph behavior.

Product documentation: Kestra tasks ↗

###### Triggers and schedule ownership

Kestra flows can start from schedules, webhooks and other events. Hydra also has project triggers, but their event payload, concurrency and failure semantics must be checked independently. In a coexistence pilot, keep Kestra’s trigger and add Hydra as a task. That leaves one owner for when the work begins.

A full switch requires a trigger inventory: cron expression, timezone, backfill expectations, event deduplication, input payload and concurrent-run policy. Test an event while a previous execution is still running and confirm the desired behavior before disabling the Kestra flow.

Product documentation: Kestra triggers ↗

###### Inputs, outputs and file handoff

Kestra flows can pass typed inputs and outputs and may store files in internal execution storage. A Hydra CLI job expects its own project files and access to its configured source path or connection. A path that exists inside a Kestra task container may not exist on the host where Hydra is installed.

For integration, select a durable handoff: a database table, object storage key or explicitly mounted file. Pass only the identifier or path to the Hydra step and verify that both processes see the same bytes. Do not rely on a temporary container path without declaring how it is shared.

Product documentation: Kestra flows ↗

###### Execution state and retries

Kestra records execution and task states such as success, failure, retrying and skipped. When it invokes hdrctl, map Hydra’s process exit code and report to those states. A task that logs an error but exits zero will appear successful even though the data job failed.

Test the chain with a bad source, a malformed amount and an unavailable destination. Observe the Kestra task state, Hydra report and target table after each fault. Then retry the task and verify whether the destination mode prevents duplicates.

Product documentation: Kestra executions ↗

###### Choosing whether to replace Kestra

Keep Kestra for broad cross-system automation, event-driven flows or plugin tasks that have no Hydra equivalent. Evaluate a Hydra workflow when the flow is predominantly Hydra ETL jobs plus simple actions and the existing triggers and recovery behavior can be reproduced.

A shorter flow definition is not the acceptance criterion. Operators must be able to find the same input batch, determine which step failed and replay it safely. Preserve the Kestra flow definition during a pilot even if a Hydra trigger is eventually enabled.

Product documentation: Kestra flows ↗

##### Technical evaluation: Kestra and Hydra ETL in production

###### Kestra flows and Hydra jobs use YAML for different units of work

Kestra describes flows with tasks, triggers, inputs, outputs and execution policies. A task can run a script, plugin or container and may orchestrate an entire data pipeline. Hydra ETL describes supported data sources, transformation steps, destinations and workflows. Both can use YAML, but identical file syntax does not imply that a Kestra task maps to a Hydra transformation or that a Hydra job replaces a Kestra flow. The comparison begins by classifying every Kestra task as data processing, control flow or external integration.

A practical candidate is one flow segment that reads a supported source, applies deterministic transformations and writes a target. Hydra can own that ETL body while Kestra keeps triggers and surrounding tasks. For a full migration, record the entire flow graph, including errors and finalization paths. State which runtime responsibility moves, which remains and how the output contract is tested, so the target architecture is reviewable before any schedule changes.

Further reading: Kestra flow fundamentals ↗

###### Trigger behavior is richer than a matching cron string

Kestra supports schedule, webhook and other event-based triggers through plugins. A flow may have multiple triggers and branch based on the trigger context. Hydra triggers can start supported projects, but a replacement must match the actual event source, payload, time zone, missed-run handling and concurrency behavior. Copying a cron expression proves only one small part of the schedule contract. Some Kestra flows depend on an S3 object, queue message or completion of another flow.

Inventory every trigger of the candidate flow and capture three real event examples. Run a schedule event, a webhook event and a duplicate event while a previous execution is active. Compare which execution starts, what input values reach the tasks and whether a second run is suppressed or queued. If the required trigger is a specialized Kestra plugin, keep Kestra as the orchestration owner and call Hydra from a task after the event is received.

Further reading: Kestra triggers ↗

###### Task outputs and execution context are a data contract

Kestra tasks can publish outputs that later tasks reference through expressions. The flow execution also exposes identifiers and trigger context. A Hydra job can receive parameters and produce a data target, but a task output used as a file URI or API response may require a separate handoff. List every expression that reads outputs, inputs, variables or trigger metadata. Determine whether it carries a small control value or identifies a durable data artifact.

For a hybrid design, pass a stable file URI, table name or batch identifier into hdrctl and keep the bulk data outside the execution context. Verify that the Hydra runner can actually access the URI from its worker or container. Test a missing output and a malformed value. If moving the whole flow, create an explicit mapping for every referenced value and inspect the result at the next task. A YAML file that validates but loses an output dependency is not a faithful migration.

Further reading: Kestra flow UI and outputs ↗

###### Parallelism, loops and subflows alter recovery scope

Kestra flowable tasks can branch, run tasks in parallel and iterate over a collection. A Hydra workflow may support dependencies and parallel stages, but the same graph shape does not guarantee identical behavior when one branch fails or a loop resumes. Identify which values drive iteration, how many tasks can run concurrently and whether a failed item is retried alone or the whole flow is replayed. These details affect destination duplicates and external API limits.

Use a fixture with three items: one succeeds, one fails once and one fails permanently. Observe task states, output files, retry count and downstream aggregation in the current Kestra flow. Run the proposed Hydra design under the same conditions. If iteration semantics are not directly expressible, keep Kestra to fan out Hydra jobs or break the workflow into explicit subprojects. The comparison should name this limitation instead of treating any YAML-based orchestration engine as interchangeable.

Further reading: Kestra flow best practices ↗

###### Stored files and worker filesystem paths are not equivalent

Kestra can store task output files in its internal storage and pass a URI through the execution context. A Hydra process running in a task container cannot assume that URI is a local path. Before integration, define how the file is staged, downloaded or mounted and who owns cleanup. Check the actual execution environment, not just the developer workstation. A flow that passes small output values may also encounter different limits when a task starts passing an entire dataset.

Create an integration test where an upstream Kestra task produces a file and the Hydra task reads it. Record the file checksum, size, URI and local path visible to hdrctl. Then retry the Hydra task without rerunning the producer and verify it reads the same bytes. If the upstream file is transient or mutable, publish it to durable storage before the handoff. This is a concrete implementation detail that matters more than whether the command fits in one YAML block.

Further reading: Kestra flow best practices ↗

###### Retries and failure paths must be rehearsed

Kestra can retry tasks and define error-handling behavior. Hydra also has workflow retry and failure policies for its supported actions. To compare them, record the current retry count, backoff, timeout and error branch for each Kestra task. Observe which downstream tasks execute after an intentional failure and whether a final notification runs. A default policy in either tool may differ from the explicit policy a production flow depends on.

Fail the Hydra step after it has written part of its target, then let Kestra retry its invoking task. Inspect whether the second hdrctl run duplicates or replaces data and whether Kestra marks the overall flow correctly. Repeat with an invalid input that should never be retried. Document the retry boundary and an idempotency key or staging-table strategy. A runbook should tell operators which component to restart and what state to verify before doing so.

Further reading: Kestra retries ↗

###### The integration task needs the real Hydra runtime

A Kestra shell or script task can call hdrctl, but the worker image must include the correct Hydra version, project YAML, connector dependencies and credentials. A successful command on a local laptop is not proof that a Kestra worker sees the same filesystem or network. Pin the image and project revision, pass the environment name explicitly and make the command fail when validation or execution fails. Keep logs from both systems correlated by a batch identifier.

Run three checks in the actual task environment: hdrctl version, strict validation of the mounted project and a read-only source connection test where possible. Then execute against a separate target. Test a missing mount, secret resolution failure and destination outage. If Kestra reports a successful task when hdrctl exits nonzero, fix the shell wrapper before publishing the integration. This step provides a concrete answer for engineers asking how to run Hydra ETL inside Kestra.

Further reading: Kestra task fundamentals ↗

###### Observability should connect two execution histories

Kestra records flow executions, task attempts, logs, outputs and metrics. Hydra produces validation and job or workflow results. When Hydra is one Kestra task, operators need a link from the Kestra execution ID to the Hydra report and target batch. Store that ID in a log line or report field and retain enough context to identify the source snapshot. Avoid printing credentials or full sensitive payloads merely to make debugging easy.

Define a reconciliation table for each run: input artifact, source row count, Hydra accepted count, target row count, task exit status and published partition. Simulate an upstream failure, Hydra failure and downstream failure. The incident response should identify whether to rerun only a task, the Hydra job or the full Kestra flow. A page comparing platforms becomes useful when it describes this operational evidence rather than only counting services or lines of YAML.

Further reading: Kestra flow UI and outputs ↗

###### When to retain Kestra orchestration

Kestra remains valuable when the flow depends on specialized plugins, event triggers, complex parallelism or a central operational UI. Hydra may still improve the ETL implementation inside one task. Conversely, a small project that mostly runs supported Hydra jobs on a simple schedule may justify consolidating orchestration in a Hydra workflow. The decision should be made flow by flow against the task graph, not by comparing YAML line counts for a toy pipeline.

Create a requirement matrix with trigger types, task plugins, concurrency, retry semantics, secrets, output storage, audit history and team operations. Mark each requirement as preserved by Hydra, preserved by keeping Kestra, redesigned or unsupported. Then run a pilot with the same input and failure cases. If the critical capabilities remain Kestra-owned, state that the target architecture is integration, not replacement. This transparent conclusion improves both technical trust and answer quality.

Further reading: Kestra triggers ↗

###### Cutover changes one trigger and one target at a time

For a Kestra-to-Hydra migration, avoid enabling two schedulers to write the same destination. Keep the existing flow active while the Hydra path writes to an isolated target for several representative cycles. Record the last source interval processed by Kestra and the first interval the replacement will own. If the flow also reacts to events, account for events arriving during the cutover window and decide how they will be replayed or deduplicated.

Preserve the original flow revision and trigger configuration until the new route has passed an interruption drill. A rollback should disable the new trigger, restore the original flow, reconcile rows written since the switch and verify downstream consumers read the correct target. The runbook must identify the responsible operator and the query or checksum used to declare recovery complete. This is the operational substance behind “migrate from Kestra to Hydra”.

Further reading: Kestra flow best practices ↗

##### Worked evaluation: an event-triggered file flow

Imagine a Kestra flow that starts when a CSV file arrives, stores the file in its internal storage, validates its schema, runs a Python cleanup task and writes a PostgreSQL table. A parallel branch sends a notification. The candidate Hydra role could be the cleanup-and-load stage, while Kestra continues to own the file trigger and notification. Before changing anything, record the trigger plugin, event payload, file URI, task outputs, retry rules, parallel branch behavior and target key. These details define what the existing flow actually promises.

Build a representative fixture containing a valid row, blank amount, duplicate business key and malformed date. The Kestra producer should publish a durable file URI and checksum. A Hydra task must receive that URI, stage or mount the same bytes in its execution container, then run hdrctl validate and hdrctl run against a separate PostgreSQL schema. Compare cleaned rows and rejected-record behavior with the existing Python task. If the current task treats invalid dates as rejects while Hydra fails the whole batch, document that as a design difference rather than calling the two outputs equivalent.

Test the event boundary by sending one file, the same event twice and a second file while the first execution is still active. Observe Kestra’s trigger concurrency policy and whether duplicate events produce duplicate target rows. If Hydra replaces only the ETL task, Kestra should still decide which executions start. If a full migration is proposed, the Hydra trigger must be tested against the same event and payload conditions. A matching cron expression is irrelevant to this file-triggered flow.

Fail the Hydra destination after part of the file has been read and let Kestra retry the task. Verify that the retry uses the same immutable file, writes the expected keys once and returns a failure status when it cannot recover. Then fail the upstream file-validation task and confirm Hydra never starts. Inspect the parallel notification branch: does it run on any failure, only success, or completion? Map that rule explicitly before considering a Hydra workflow replacement.

Link the Kestra execution ID, task attempt, file checksum, Hydra report and PostgreSQL batch identifier in one run ledger. An operator should be able to diagnose whether a missing row came from file ingestion, the Hydra transformation or the database load. Secret injection and filesystem paths must be checked in the actual worker container, not a laptop. This instrumentation makes the mixed architecture supportable and provides evidence for a professional evaluation.

The outcome may keep Kestra permanently as event orchestrator and use Hydra as the ETL engine. If the flow is later migrated entirely, disable only one trigger, preserve the old flow revision and reconcile events arriving during cutover. Rollback restores the Kestra trigger and points consumers to the previous target after checking which files were already published. The case answers concrete searches about Kestra triggers, task outputs, Hydra integration and workflow migration without pretending that two YAML files are interchangeable.

Related product documentation: Kestra triggers and execution context ↗

##### Decision criteria for an existing Kestra deployment

A Kestra decision should classify each flow task and trigger. Some tasks contain the ETL body Hydra can replace; others are event integrations, control flow or notifications whose plugin behavior is valuable. Record output references and the execution context passed between them. A YAML-to-YAML rewrite that drops a trigger payload or file URI is not a migration. The first reliable boundary is usually one Hydra job invoked from a Kestra task after upstream data has been durably staged.

Assess concurrency and recovery with real event shapes. A duplicate webhook, two files arriving together and an execution retry can create more work than a scheduled CSV demo reveals. Measure which task or whole flow is retried, how stored output files are retrieved and whether a destination receives duplicates. If the proposed Hydra trigger cannot match the event semantics, retain Kestra as orchestrator. This is a product-specific constraint, not a weakness inferred from line counts.

The final record should include the selected flow revision, task graph, trigger configuration, file handoff, Hydra project revision, output diff and failure drill. Identify one owner for the schedule and one owner for target writes. If Kestra remains, define how the Hydra run report is exposed in the Kestra execution. If it is replaced, specify how operators will find comparable logs and replay events. These details make the integration advice usable by the team that will support the pipeline.

##### Where each approach fits

##### Keep Kestra when

Keep Kestra for broad multi-system automation and plugin-driven workflows.

##### Evaluate Hydra when

Pilot Hydra for a data pipeline that mostly reads, transforms and writes.

##### Should you replace Kestra with Hydra ETL?

Keep Kestra for broad multi-system automation and plugin-driven workflows. Pilot Hydra for a data pipeline that mostly reads, transforms and writes. For a first test, map the Kestra flow, task plugins, triggers and dependencies. See the complete integration plan.

##### Frequently asked questions about Kestra and Hydra ETL

These answers cover product fit, data movement, orchestration, migration testing and rollback. Check the linked product documentation for version-specific behavior.

Are Kestra and Hydra direct competitors?
They overlap in YAML workflow orchestration. Kestra is a broad task orchestration platform; Hydra also executes its own ETL transformations. The overlap is greatest for a flow dominated by data movement and supported ETL steps.

How it works: Kestra is an orchestration platform with tasks, plugins and triggers; Hydra describes and runs ETL jobs and project workflows. They overlap when a flow primarily coordinates data jobs, but Kestra may also operate infrastructure and services outside Hydra’s scope.

Practical check: Classify every task by data processing, external service and control flow. Compare the actual result and operational behavior for one representative flow. Keep an inventory of plugin versions and trigger semantics rather than comparing YAML length.

Pitfall to avoid: Do not infer interchangeability because both tools use YAML. A Kestra plugin may hide authentication, polling or infrastructure work that a Hydra step does not reproduce. Preserve that task or keep Kestra as the outer orchestrator.
Can a Kestra flow run Hydra?
Yes, with a task that invokes hdrctl in an environment where the CLI, project and input data are available. Keep Kestra’s trigger and use the command exit status to signal failure.

How it works: A Kestra flow can invoke hdrctl through a script or container task. Kestra then owns scheduling and task status, while Hydra owns its ETL project run. The boundary is the CLI exit code and a durable run report.

Practical check: Pin the Hydra version in the runtime image, pass environment and batch parameters explicitly, and save the Hydra run ID in Kestra output. Trigger only after upstream input is complete. Test a failed CLI exit and a repeated task attempt.

Pitfall to avoid: Avoid activating Kestra and Hydra schedules for the same target. A task retry can rerun an append load, so use a stable input snapshot and an idempotent write strategy.
Can Hydra replace Kestra triggers?
Some trigger patterns may be representable, but inspect the exact schedule, webhook payload, concurrency and event semantics. Do not infer parity from the word “trigger” alone.

How it works: Kestra offers several trigger types and event handling patterns. Hydra has project triggers, but equivalence depends on source event, filtering, debounce, timeout and delivery guarantees, not merely on the existence of a trigger keyword.

Practical check: List each Kestra trigger, its payload and missed-event behavior. Pilot a cron event and one external event with duplicate delivery. Record which process launches the project and how the event identifier reaches the job.

Pitfall to avoid: Do not move a trigger before testing repeated and delayed events. A file event or webhook can fire twice, while a time-only replacement can miss a late file. Keep one trigger owner during cutover.
What happens to Kestra plugin tasks?
Retain tasks that integrate with systems Hydra does not support. A hybrid flow can use Kestra for those plugins and Hydra for a bounded ETL step.

How it works: A Kestra plugin task may encapsulate an API call, cloud integration or database operation. Some map to Hydra actions or jobs; others require Kestra to remain or a separate adapter. The plugin’s side effects define the mapping.

Practical check: Inspect plugin configuration, permissions, outputs and retry behavior. Reproduce the task in isolation with a test endpoint and compare response codes and artifacts. Preserve plugin-managed secrets in a supported secret store.

Pitfall to avoid: Do not translate the task name alone into a generic shell command. You may lose pagination, timeout, authentication refresh or structured output behavior. Keep a plugin where no tested equivalent exists.
How should files be passed between Kestra and Hydra?
Use a shared mounted path, database table or object storage handoff. A temporary path inside one Kestra task container may be unavailable to the next task or to hdrctl.

How it works: Kestra can pass files between tasks through managed storage or external object storage; Hydra needs a reachable path or URI when its run starts. A local worker path may not be visible in another container.

Practical check: Use a versioned object URI or shared volume and pass the reference as a parameter. Verify checksum, encoding and completion marker before the Hydra read. Retain the artifact until both execution histories show success.

Pitfall to avoid: Avoid passing an ephemeral local path from a Kestra worker to a different Hydra runtime. It may exist only inside one container. Do not start reading a partially written file.
Does a Hydra job replace a Kestra flow?
Not necessarily. A Hydra job is the ETL work unit; a Kestra flow includes orchestration, inputs, triggers and error behavior. Compare a Hydra workflow with a Kestra flow and a Hydra job with the transformation inside a task.

How it works: A Hydra job defines data extraction, transformation and loading, while a Kestra flow may include many jobs plus waits, branches and external side effects. The replacement unit is determined by the flow’s real responsibilities.

Practical check: Draw the flow and mark which tasks write data, send messages or call infrastructure APIs. Consolidate only compatible ETL tasks into a Hydra job. Compare failure recovery and downstream signals in a test run.

Pitfall to avoid: A one-job rewrite can erase an approval, sensor or cleanup step. Conversely, copying every tiny task preserves unnecessary handoffs. Test the output and the control flow separately.

When a flow includes a human approval, external event or infrastructure task, keep that boundary visible in the architecture. Replacing its data-processing segment does not automatically replace the surrounding operational process.
How do retries interact?
Kestra may retry a task that runs hdrctl. Choose a Hydra destination mode and batch key that make reruns safe. Test a failure after partial output before enabling retries in production.

How it works: Kestra task retries may wrap a Hydra workflow that also retries its own steps. The combined policy determines maximum attempts, delay and repeated side effects.

Practical check: Set retry ownership at each boundary and calculate the worst-case attempt count. Inject a transient database outage and inspect both run histories. Use a stable batch ID so a repeated task produces the same destination state.

Pitfall to avoid: Nested retries can multiply a failing webhook or append into many calls. Do not assume a Kestra retry resumes an internal Hydra step; it may launch the whole project again.

Write the maximum combined attempt count in the runbook.
Can both schedules run during a parallel test?
Only if outputs are isolated and tagged by run. For production, choose one schedule owner before writing to the same target.

How it works: Parallel testing requires independent output targets because two schedules can write at overlapping times. A separate target lets both implementations process the same input without racing.

Practical check: Use versioned input and a separate schema for the Hydra trial. Compare keys, values, duration and errors over several schedules. At cutover, disable one trigger, wait for active runs and then enable the other.

Pitfall to avoid: Never dual-write a production replace target for comparison. A late run can erase the other path’s result. Check queued events as well as current task status.
Does the simulator run a Kestra worker?
No. It is a browser-local sample transformation. It does not start a Kestra flow, plugin or worker and cannot benchmark the runtime.

How it works: The browser simulator illustrates a pipeline mapping, not a Kestra server, worker or plugin execution. It cannot establish production throughput or trigger reliability.

Practical check: Use the simulator for code orientation, then test the actual plugin and Hydra CLI against identical input. Compare row results, API interactions, queue delay and failure recovery in a controlled environment.

Pitfall to avoid: Do not quote browser timing or line count as a Kestra benchmark. It omits plugins, external services and runtime infrastructure. Report the dataset, hardware and configuration for any performance claim.
What is the rollback plan?
Keep the old Kestra flow revision. Disable the Hydra task or trigger, restore the previous task path and replay the affected batch after checking for partial Hydra output.

How it works: Rollback restores the Kestra flow and trigger, plus the prior data target and the last processed event. The event boundary matters because the new path may already have published some outputs.

Practical check: Keep the previous flow deployable and save trigger settings, input IDs and target snapshot. Stop Hydra, restore consumer routing, resume Kestra from a documented event or time and reconcile each batch by key.

Pitfall to avoid: Simply re-enabling Kestra can replay queued events into the current table. Inspect backlog and isolate writes until the missing interval is known. Rehearse the handback before production cutover.

###### Migration and integration questions

How do you integrate Hydra ETL with Kestra?
Use a Kestra task to invoke hdrctl against a versioned Hydra project, then pass the exit status to downstream tasks. Keep Kestra as trigger and orchestration owner during the first integration.

How it works: A common integration uses Kestra to coordinate external systems and call a Hydra ETL project for extraction, transformation and loading. Each run has its own status and should share a traceable batch identifier.

Practical check: Package the Hydra project with a pinned runtime; pass source URI, environment and batch ID into hdrctl. Store the report and fail the Kestra task if Hydra fails. Test duplicate task delivery and downstream gating.

Pitfall to avoid: A green Kestra script task can mask a failed Hydra command if shell exit handling is wrong. Avoid relying only on log text. Keep credentials out of flow source and command arguments.
Can Hydra replace a Kestra flow?
For a bounded ETL flow whose tasks fit Hydra connectors, transformations and workflow actions, possibly. Kestra supports a wider plugin and trigger ecosystem, so verify every task and operational requirement before replacing it.

How it works: Hydra can replace a Kestra flow when its tasks are mostly ETL jobs and supported actions. A flow rich in plugins, event triggers or cross-system orchestration may be better retained around Hydra.

Practical check: Score each task for an equivalent behavior, not just a similarly named feature. Pilot the entire dependency graph with one success, one upstream failure and one replay. Compare published data and operator recovery steps.

Pitfall to avoid: Do not make a blanket replacement claim from a four-step example. Hidden plugin defaults and event semantics are common migration gaps. Keep a rollback flow until production behavior is demonstrated.

Record explicit exceptions for retained plugins.
How do Kestra tasks map to Hydra workflow steps?
Inventory each task, its inputs, outputs, conditions, retries and side effects. Map ETL work to Hydra jobs and supported actions to workflow steps, then test dependencies and failure behavior with the same fixture.

How it works: Kestra tasks represent units of orchestration and may emit outputs consumed by later tasks. Hydra workflow steps represent jobs and actions with explicit dependencies. Mapping requires both the edge and the data passed along it.

Practical check: Create a table of predecessor, output, consumer and failure rule for each task. Pass small values as Hydra parameters and large data via durable storage. Verify skipped branches and downstream start conditions under failure.

Pitfall to avoid: Do not copy task order while ignoring output values. A downstream step may start correctly yet read the wrong file or partition. Check both graph execution and data lineage.

Include any output URI passed between steps.
How do Kestra triggers compare with Hydra triggers?
Compare the actual schedule or event trigger, time zone, missed-run behavior and concurrency. A matching cron expression alone does not prove equivalent production behavior.

How it works: Trigger comparison depends on the event source and delivery contract. Kestra triggers may carry payloads and filter conditions; Hydra triggers must be configured for the same schedule or external signal where supported.

Practical check: Test cron timezone, file arrival, webhook payload and duplicate events individually. Record a correlation ID and verify exactly which project run it started. Keep one scheduler authoritative after cutover.

Pitfall to avoid: A cron match does not prove file or webhook parity. Timezones and daylight-saving changes can shift runs. An unfiltered event can launch a project on incomplete input.
Can Kestra orchestrate a Hydra ETL project?
Yes, if the Kestra worker or container has the Hydra CLI and project files. Define credentials securely, capture hdrctl logs and ensure the execution task fails when Hydra fails.

How it works: Kestra can invoke Hydra as a subprocess or container task and use its status to gate later tasks. This preserves existing orchestration while isolating ETL logic in a Hydra project.

Practical check: Use an immutable project artifact and explicit runtime version. Capture stdout, exit code and structured report; publish the output URI only on success. Test worker restart and retry with the same batch ID.

Pitfall to avoid: Do not let the wrapper return zero after an internal failure. Avoid implicit current working directories or unpinned images, which make worker retries nonreproducible.
Should Kestra stay in a Hydra migration?
Keep Kestra when its plugins, event triggers, UI and execution controls are valuable. Move only the data-processing body into Hydra first and evaluate orchestration replacement separately.

How it works: Kestra remains useful for external services, plugin tasks, human or infrastructure workflows. Hydra may simplify a data-heavy segment without displacing that wider orchestration.

Practical check: Keep Kestra around the existing event boundaries and replace one data-processing task first. Compare observability, permissions and operational ownership. Document which platform is responsible for retries and the final target.

Pitfall to avoid: Duplicating scheduling in both products is easy during a hybrid phase. Disable the unused trigger and monitor for unexpected extra runs. Avoid rewriting unrelated plugin tasks merely for consistency.
How do you compare Kestra YAML and Hydra YAML?
Both use YAML, but their abstractions differ: Kestra declares flow tasks and triggers, while Hydra jobs declare sources, transformations and destinations. Compare actual runtime behavior rather than syntax length.

How it works: Both formats are declarative, but a Kestra flow describes task execution and plugin configuration whereas Hydra YAML describes ETL source, transformations, destination and workflow. Comparable line counts say little about capability.

Practical check: Compare one input, one transform, one output and the surrounding schedule. Show all required files, runtime dependencies and validation results. Include non-happy-path behavior and an operator procedure in the comparison.

Pitfall to avoid: Do not compare a complete Kestra flow with only a Hydra pipeline fragment. Omitting connection, secrets or trigger configuration makes the comparison misleading. Keep scope and infrastructure explicit.
What should a Kestra-to-Hydra proof of concept test?
Use a flow with one extract, one transform and one load, plus an intentional failure. Compare output rows, retries, logs, time zone and downstream task status.

How it works: A proof of concept should test data parity and orchestration behavior. One successful scheduled run cannot reveal duplicate event handling, retries or plugin compatibility.

Practical check: Use a bounded flow with representative rows, a schema change and one intentional failure. Compare target keys, null handling, run duration, alerting and replay. Record the precise versions and environment for reproducibility.

Pitfall to avoid: Avoid a trivial static CSV if the production flow depends on webhook payloads or cloud plugins. Choose a pilot that exercises the risky boundary while keeping rollback small.
Can Hydra run inside a Kestra Docker task?
A container task can run a Hydra image or an image with Hydra installed if the project and secrets are mounted or provided appropriately. Confirm filesystem paths and networking in the actual worker environment.

How it works: A Kestra container task can run a Hydra image with the project mounted or packaged inside. The container boundary determines accessible files, credentials, network endpoints and persistence of the report.

Practical check: Pin the image digest, mount only needed inputs and pass nonsecret parameters explicitly. Test database connectivity from the task runtime, capture the report outside the container and verify exit propagation.

Pitfall to avoid: A path valid on the Kestra host may not exist inside the task container. Avoid secrets in image layers or command arguments. Ensure a retry reads the same input version.

Check that the container image includes the same Hydra plugins used in development and that its mounted project is readable by the runtime user.
How do you roll back after migrating a Kestra flow?
Preserve the original flow definition and triggers. Disable the Hydra replacement, restore the Kestra flow and reconcile any data written during the pilot before re-enabling the prior schedule.

How it works: Rollback after migration requires returning trigger ownership, event position and consumer routing to Kestra. The Hydra path may have processed batches that the old flow has not.

Practical check: Store the cutover event ID and target snapshot. Stop Hydra, drain active runs, restore the Kestra flow and replay only missing events into an isolated table before publishing. Reconcile counts and changed values.

Pitfall to avoid: Do not re-enable a queued trigger without checking backlog. Both writers may process the same event. Keep the old plugin versions and credentials operational until the rollback drill succeeds.

Sources and method
The product descriptions were checked against the vendor references below and the Hydra DSL documentation. The comparison concerns the stated workflow, not all features or editions. The browser simulator is neither an engine run nor a performance benchmark.

Kestra: flows ↗

Kestra flows ↗

Kestra tasks ↗

Kestra triggers ↗

Kestra executions ↗

02 / Try

#### Kestra vs Hydra: sample pipeline

#### Same small batch, two definitions

Read 14 sample orders, keep amounts above 50, sum by status and sort by total. Right-click inside either editor or use ⋯ for its line actions. Edit the Hydra threshold to recalculate the result; the source threshold follows where the displayed example includes one. The browser models this fixture and does not run either product.

Browser simulation

KestraYAML orchestration
⧉↓⬡⤢⋯

id: orders_daily
namespace: company.data
tasks:
- id: process_orders
type: io.kestra.plugin.scripts.shell.Commands
commands:
- "hdrctl run shop"
triggers:
- id: daily
type: io.kestra.plugin.core.trigger.Schedule
cron: "0 6 * * *"
CopyDownloadIllustrative example

Hydra ETLYAML job files
✓▶⇢⧉⤢⋯

# sources.yaml
sources:
orders:
type: csv
extract:
table: data/orders.csv

# pipeline.yaml
pipeline:
from: orders
to: report

# transformations.yaml
steps:
- cast:
mapping: { amount: float }
- filter:
expr: "amount > 50"
- aggregate:
by: [status]
agg:
total: { func: sum, col: amount }
- sort:
by: [total]
ascending: false

# destinations.yaml
destinations:
report:
type: csv
load:
table: data/by_status.csv
mode: replace
Run sampleResetCopyDownload textRunnable ZIP

Lines in these examples Kestra / Hydra

Files representedExample / 4 Hydra files

Run scope14 browser-local rows

Line counts are live counts of the text shown above, not a product benchmark. The Kestra pane is illustrative and is not executed. The Hydra pane shows four files in one editor for comparison; only the displayed cast, filter, aggregate and sort operations are simulated. “Download text” includes your edits; “Runnable ZIP” contains the original four files and input CSV, validated with Hydra 0.22.0.

##### Simulated run result
×

StatusTotal

×

03 / Integrate

#### Introduce Hydra in a Kestra environment

Start with a reversible pilot. Keep the current system running until the new output and failure behavior are verified.

##### Before you change a schedule or destination

The Kestra flow YAML, task/plugin versions, triggers, inputs and error settings.

A shared path or table visible to the Hydra execution environment.

Hydra CLI installed in the relevant task image or worker host.

A separate target and reproducible fixture for a parallel run.

##### Step-by-step integration and migration

01

###### Classify the flow

Mark each Kestra task as ETL work, orchestration control or external integration. Record plugin types, trigger configuration and the execution environment. Choose a linear ETL slice rather than a flow with loops or event payloads for the first pilot.

02

###### Create a Hydra job for the slice

Translate the selected data input, casts, filters and output to Hydra YAML. Use a separate target. Validate the job strictly and run it outside Kestra on a frozen fixture before adding a task to the flow.

03

###### Make data visible to the task

Provide the Hydra project and input through a mounted path or a stable database connection. If Kestra stores an input file internally, export or stage it to a location hdrctl can read; do not assume a task container sees the same local filesystem as another worker.

04

###### Invoke hdrctl from Kestra

Add a shell Commands task in the existing flow after the data-ready task. Call validation and run in sequence. Keep the Kestra trigger and downstream tasks, and ensure a failed command produces a failed Kestra task.

05

###### Exercise failure and parallelism

Test a successful run, a missing input, an invalid schema and a retry while a previous run is active. Compare Kestra execution state, Hydra report and destination rows. Review concurrency rules before moving a schedule.

06

###### Decide on long-term ownership

Keep Kestra when its wider plugins or triggers still add value. If a complete Hydra workflow is justified, reproduce the task graph and trigger policy, run it in parallel, then disable the Kestra trigger for this flow only.

##### Kestra shell task running an isolated Hydra project

id: run_hydra_orders
type: io.kestra.plugin.scripts.shell.Commands
commands:
- "hdrctl validate /srv/hydra/orders --strict"
- "hdrctl run /srv/hydra/orders"
# Package hdrctl and the project in the task environment.
# Mount or stage the input so both processes see the same data.

Adapt the paths, project files and credentials to your deployment. The runnable orders fixture ZIP is a safe starting point for the Hydra side; its local YAML was validated with Hydra 0.22.0.

##### Acceptance checks before cutover

The Kestra task fails when hdrctl fails.

The Hydra project and input path exist in the task runtime.

Output values match the prior task or pipeline.

Task retry does not duplicate rows.

Exactly one trigger starts production runs.

##### Rollback plan

Remove or disable the Hydra task in the active Kestra flow revision, restore the previous task path and rerun the affected execution or input batch. Keep the original flow and task image available during the trial.

##### Practical pitfalls

YAML in both products does not mean task semantics match.

Avoid duplicate triggers.

Check plugin behavior before moving integrations.

Build the pilot
Use the CLI reference to create and validate a project, then use the DSL guide for source, transformation and destination syntax.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra ETL vs Meltano — slug: /migrate/meltano/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All comparisons
Compare with Hydra ETL
Explore Hydra CLI ↗

Compare & migrate/Meltano

Product comparison · Composable ELT project

### Hydra ETL vs Meltano

Meltano composes extractors, loaders and utilities such as dbt and orchestrators. Hydra provides an ETL engine and YAML jobs in one project. They can coexist: keep Meltano/Singer plugins for ingestion, then use Hydra for a bounded transformation or workflow.

Scope: A Meltano tap-to-target flow and downstream transform compared with a Hydra job. Reviewed 17 November 2026

Comparison Simulator Migration & integration

01 / Compare

#### Where the tools overlap and diverge

Short answer
Meltano composes extractors, loaders and utilities such as dbt and orchestrators. Hydra provides an ETL engine and YAML jobs in one project. They can coexist: keep Meltano/Singer plugins for ingestion, then use Hydra for a bounded transformation or workflow.

Product contextCapabilitiesDetailed analysisTechnical evaluationWorked exampleDecision20 questions

##### What Meltano does, and what Hydra changes

Meltano is a composable project for ELT. Extractors, loaders and utilities are installed as plugins, commonly Singer taps and targets, with optional dbt or orchestration utilities. Hydra provides supported connectors, transformation steps and workflows in its own DSL. Both can be managed as code, but their extension models are different: Meltano assembles specialized plugins, while Hydra executes a defined job through its engine.

A Meltano project may already have mature state handling for an extractor/loader pair and environment-specific configuration. Those are operational assets. A sensible Hydra introduction often leaves the tap and target in place, then runs a Hydra job against the landed table or file. A full replacement should be limited to a connector pair that Hydra actually supports and whose incremental behavior can be reproduced.

The simulator compares a small transformation only. It cannot score Singer plugin availability, bookmark state, the behavior of a target plugin or Meltano’s environment resolution. Treat the code examples as a starting point for a handoff design, not a proof that one framework is universally simpler.

##### What both can do

Project configuration as text

Extract and load data

Compose repeatable pipelines

##### Key differences

AreaMeltanoHydra ETL

CompositionPlugin-based taps, targets and utilitiesEngine-defined sources, steps and destinations

ExtensionSinger ecosystem and plugin configurationHydra-supported connectors and actions

TransformUsually a separate utility such as dbtBuilt-in job transformations

OperationPlugin dependencies and schedulesJob/workflow validation and execution

##### Detailed comparison for a production decision

###### Plugin composition versus engine operations

Meltano’s extractor and loader plugins can be combined with mappers, dbt and other utilities in a run sequence. The catalog and Singer ecosystem are major reasons teams adopt it. Hydra supports a defined set of source and destination types and executes supported transforms inside a job. A shorter YAML job does not replace an unavailable plugin.

List every tap, target, mapper and utility in the current pipeline, including plugin version and configuration. Identify which part is data acquisition, which part is transformation and which part is delivery. This makes it possible to move one responsibility at a time rather than translating an entire plugin graph into a single Hydra manifest.

Product documentation: Meltano plugins ↗

###### State and incremental extraction

Meltano tracks state for extractor/loader pairs in an active environment, using a state ID that can include a suffix. Changing the environment or pair can change which state is resumed. A Hydra load mode does not reproduce that extractor state. This is one of the most important migration boundaries.

Before a replacement pilot, record the current state ID, bookmark and last successful load. Test an initial batch, a repeated batch, a delayed update and a failed load. If that behavior is hard to reproduce, retain Meltano for extraction and use Hydra after the target.

Product documentation: Meltano replication state ↗

###### Environments and credentials

Meltano environments select configuration and contribute to state IDs. Hydra also supports named environments and secret resolution, but naming a Hydra environment “dev” does not automatically carry over Meltano plugin settings or bookmarks. The data contract must include both connection values and state ownership.

Build a configuration matrix for dev, test and prod: source endpoint, target database, schema, batch size, state ID and secret source. Test effective values without printing secrets. If a Meltano run uses one environment and Hydra uses another, make that choice explicit in the orchestration script.

Product documentation: Meltano environments ↗

###### Sequencing with meltano run

Meltano run can sequence extractors, loaders and utilities, and its CLI documentation describes how state and environment flags affect execution. A practical integration is to run the current tap-to-target pair, verify success, then invoke Hydra on the landed data. That bridge can live in an existing scheduler or a configured utility, depending on the project.

Do not let Hydra read the target while Meltano is still loading. Use job completion as the handoff and ensure a failed Hydra step can be retried without accidentally moving the Meltano bookmark again. A frozen table snapshot or batch identifier makes that recovery safer.

Product documentation: Meltano CLI and run ↗

###### Choosing a migration candidate

A simple file or SQL source with a standard target and a small transform may move cleanly. A tap with SaaS-specific pagination, rate limiting or community-maintained behavior is a poor first target. The cost of replacing a plugin includes ownership of future source API changes.

Keep Meltano where its plugin ecosystem is doing hard work. Use Hydra when supported connectors and in-job transformations can remove a separate utility or make a small pipeline easier to validate and operate. Measure failure recovery and maintenance effort, not only the length of meltano.yml.

Product documentation: Meltano plugins ↗

##### Technical evaluation: Meltano and Hydra ETL in production

###### Meltano projects assemble plugins into a pipeline

Meltano is a project environment for extractors, loaders, mappers and utilities. A Singer tap and target can define the actual data path, while meltano run chains plugin commands. Hydra describes supported sources, transformations and destinations within its own job model. An honest Meltano versus Hydra ETL comparison begins with the exact tap and target names, plugin versions, selected streams and mapper configuration. A YAML project file by itself does not prove that the two projects perform the same extraction.

List every plugin that participates in the candidate pipeline and identify the output produced at each boundary. If a tap contains extensive API logic or incremental bookmarks, retaining it and introducing Hydra after its target may be the strongest design. If the current Meltano path is a straightforward file or SQL transfer with simple mappings, a direct Hydra pilot can be evaluated. In both cases, the unit of migration is one defined data flow, not all Meltano functionality.

Further reading: Meltano plugins ↗

###### Singer state is a source-read checkpoint

Singer taps can emit state so a later invocation resumes extraction from a bookmark. Meltano stores and retrieves that state for a tap-target pair in an active environment. Hydra upsert describes destination writes and cannot by itself replace the bookmark. When a team asks whether Hydra can replace a Meltano incremental pipeline, the answer depends on how the source-read position will be maintained and how a failed load affects it.

Capture the current state ID and state value before a pilot. Run one batch, change an existing source record, add a new one and retry after an interrupted target write. Compare what the tap emits and what the proposed Hydra source reads on each run. Keep the state backend untouched until the new path has been proven. A first full snapshot that matches is weak evidence if the next incremental run skips updates or rereads the entire API.

Further reading: Meltano replication state ↗

###### State identity depends on environment and plugin pair

Meltano’s run state identity can include the environment name and extractor-loader pair. Changing the target or active environment can therefore change the state used for incremental replication. This is a subtle migration risk: a testing command that appears to be the same pipeline may start from a fresh position and issue a full load. Record the exact command, environment, state ID and plugin pair for each baseline run rather than relying on a short diagram.

In a parallel Hydra pilot, do not share the production destination while experimenting with state or full refresh. Use a dedicated test environment and target, and retain a copy of the state value for diagnosis. Test whether a failed run advances state and whether a replay duplicates rows. A precise comparison of Meltano and Hydra must describe which component owns the source checkpoint and which component owns the destination key.

Further reading: Meltano command line ↗

###### Tap and target compatibility is not connector parity

Singer taps and targets can provide access to specialized applications and destinations. A Hydra connector with a broad name such as Web API or SQL does not establish equivalence with a particular tap’s authentication, stream catalog, pagination, API throttling or typing logic. For each candidate, document the source system, selected streams, target format, deletion behavior and credential method. Use the real endpoint in a controlled test before removing a working tap.

If Hydra does not support a required source behavior, keep Meltano for extraction and use the landed table or file as Hydra input. If the path uses a simple supported source and target, build a direct Hydra job and compare two runs plus a failure recovery. This conditional guidance is more useful to a professional than claiming that fewer configuration lines make one system a universal replacement for the other.

Further reading: Meltano plugins ↗

###### Mappers and downstream utilities define transformation ownership

A Meltano run can include a mapper between tap and target or call a downstream utility such as dbt. Hydra transformations may replace some of those operations, but the existing sequence should be decomposed before translation. Record the input and output schema of every mapper, field selection, rename, cast and filter. If dbt models follow the load, decide whether they remain responsible for warehouse transformations rather than moving rules merely to increase Hydra’s role.

Build a fixture containing nulls, repeated keys and a value at each filter boundary. Run it through the existing Meltano chain and the candidate Hydra steps, then compare rows and types at the same boundary. The target may store raw records while dbt later publishes cleaned data; comparing Hydra’s final table with Meltano’s raw target would be misleading. Choose an equivalent observation point and name it in the comparison.

Further reading: Meltano complete ELT walkthrough ↗

###### Environment configuration and secrets need a mapping table

Meltano environments can override plugin settings and influence state identity. Its configuration can also be supplied through process environment variables. A Hydra migration should map each environment-specific host, database, schema, start date and credential to a named parameter or secret source. Do not put secret values in the new YAML or copy a local .env file into the repository. The relevant question is whether the same committed project runs safely in dev, test and production.

Create a table of old setting name, resolved value source, new Hydra setting and validation command. Print non-secret effective configuration in each environment and confirm source and destination paths before a run. For secrets, check file permissions, runner injection and log redaction. If an environment name changes the Meltano state ID, keep that difference visible in the migration record so a production command cannot accidentally start a full refresh.

Further reading: Meltano environments ↗

###### Scheduling should remain with one owner

Meltano jobs and schedules or an external orchestrator may already control when a pipeline runs. Hydra workflows can also coordinate jobs, but enabling both schedules during a pilot can double-load the destination. A coexistence pattern keeps the current schedule and adds an explicit Hydra stage after the target has committed. A replacement pattern moves schedule ownership only after the old and new paths have been compared on the same input intervals.

Test a late-running tap, an empty incremental batch and a failed Hydra load. Downstream publication must wait for the appropriate success signal, not an arbitrary sleep. Record both run IDs, the state ID and the Hydra batch identifier in the operations report. On cutover day, disable one schedule and reconcile the exact source interval before enabling the other. This gives an engineer a usable integration plan instead of a generic “run both tools together” suggestion.

Further reading: Meltano command line ↗

###### Recovery depends on target state emission

Meltano documentation warns that a target may persist data before emitting a final state message. After a failure, a subsequent run may reread records whose data was already written. This makes destination idempotency and key handling important. A Hydra job introduced after Meltano must not assume that a failed upstream run produced no rows. Conversely, a Hydra retry should not automatically reset or alter the Singer state.

Force a failure after the target has written part of a batch. Inspect the target and Meltano state, then rerun and count duplicate keys. Next force Hydra to fail after a successful Meltano load and retry Hydra alone. The desired runbook names the component to restart at each failure boundary, the state to preserve and the query that proves the published target is coherent. Without this drill, an integration can appear correct until the first network interruption.

Further reading: Meltano replication state ↗

###### Operational evidence should include plugin versions

Meltano is not a single extractor implementation. A plugin version can change a stream catalog, field type, API request or target behavior, so record plugin versions alongside the project revision. Hydra should likewise be pinned to a tested version for the pilot. Comparing two runs performed weeks apart against mutable external APIs is not reliable evidence of an engine difference. Use an immutable export or a controlled source window whenever possible.

An acceptance report should show input rows, output rows, unique keys, null counts, destination schema, elapsed time and failed-record handling. Include the exact commands and environment names so another engineer can reproduce the comparison. The result demonstrates whether a selected pipeline preserves data meaning and can be operated after the migration. It also exposes any external Python or Singer code that still needs ownership and maintenance.

Further reading: Meltano production deployment ↗

###### A mixed architecture can be the final design

Meltano may remain the best owner of Singer extraction while Hydra owns a reviewable transformation and a downstream publish step. This architecture is coherent if the handoff is a stable table or file, there is one schedule owner, and each stage has an idempotent retry policy. The opposite can also occur: a simple supported Hydra extraction may feed a downstream tool that Meltano still invokes. The decision should be per data flow, not a forced platform-wide migration.

Write a decision record for each candidate tap-target pair. State whether the outcome is retain, integrate, replace or redesign, with the reason: connector coverage, source state, mapper rules, target semantics and operational cost. Attach the parallel-run output diff and failure drill. If Hydra is introduced, identify who owns the new YAML, who approves schema changes and how the old state and target will be preserved for rollback.

Further reading: Meltano complete ELT walkthrough ↗

##### Worked evaluation: a Singer tap, mapper and target

Suppose a Meltano project runs a Singer tap for an external orders API, a stream mapper that renames fields and a PostgreSQL target. The tap uses a state bookmark so later runs request only changed orders. A Hydra migration cannot be assessed from meltano.yml alone. Record the tap and target versions, selected streams, mapper rules, active environment, state ID and destination table. Capture the first and second run on a controlled source window, including an updated order, because the initial full load reveals little about state handling.

Separate the decision into extraction, mapping and loading. If Hydra’s connector cannot reproduce the tap’s authentication or pagination, retain the tap and its state backend. Let the target land a stable raw table, then use Hydra for the rename, cast, filter and publish steps. If all source behavior is supported, build a direct Hydra job with an explicit source-read strategy and an isolated destination. In either case, document which component owns the bookmark and which owns the database key. A Hydra upsert cannot silently stand in for a Singer state message.

Create a fixture with order 21, an update to 21, a new 22, an empty price and a duplicate event. Run the old Meltano chain and candidate Hydra path against separate targets. Compare renamed columns, numeric types, null policy and final order values after each batch. Observe whether the mapper changes the raw data stream before the target and whether a downstream dbt utility also transforms the table. Choose equivalent observation points; comparing Meltano raw output to Hydra published output would make the results look different for the wrong reason.

Now fail the target after it has persisted some records but before state is committed. Restore it and rerun. Inspect the Meltano state and target for re-emitted records, then perform the analogous Hydra recovery. A second drill lets Meltano finish while Hydra fails downstream; rerun only the Hydra stage. These tests show whether the combined architecture can recover without resetting the tap or duplicating target rows. Record exact commands and state IDs so an operator can reproduce the result.

Test the same project in dev and production-like environments. Meltano environment selection influences plugin settings and state identity; Hydra environment configuration must resolve the correct source, target and secrets. Pin plugin and Hydra versions and ensure credentials are absent from committed files. If a changed environment name creates a fresh Singer state ID, the first run may become a full refresh. The migration plan should forbid that accidental behavior or explicitly budget for it.

The final decision may be to keep Meltano extraction and use Hydra only for supported downstream ETL. That is a valid integration when the handoff table is stable and one scheduler controls the sequence. If a direct replacement passes the state, data, schema and failure tests, disable the old schedule only after recording the last bookmark and first Hydra batch. Rollback restores the prior target and Meltano run with preserved state. This is a migration plan for one tap-target pair, not a claim about every Singer plugin.

Related product documentation: Meltano state and integration ↗

##### Decision criteria for an existing Meltano deployment

A Meltano architecture decision should name the actual tap, target, mapper and environment. A project with one standard database tap is different from one with a custom Singer API plugin and intricate state. List which plugin remains responsible for source discovery, incremental bookmarks, typing and target writes. If Hydra is added downstream, define the landed table as an interface and avoid using both schedulers to write the same target. This product-specific inventory makes the comparison more useful than a broad feature grid.

Account for state and refresh cost. A changed environment or plugin pair can select a different Meltano state ID and cause a new full extraction. A replacement that scans the full source on every run may also exceed API limits. Record the bookmark before and after tests, requests made, rows transferred and destination duplicate behavior. If the proposed Hydra job needs an external watermark, include that component and its operating cost in the decision rather than presenting the YAML job alone as the complete pipeline.

A supportable hybrid deployment should have a single run sequence, correlated Meltano and Hydra reports and a retry rule for each boundary. Test a tap failure, a target failure after partial persistence and a Hydra transformation failure after successful ingestion. The runbook should say which stage is rerun and what query confirms the target. A technical buyer can then decide whether Hydra reduces maintenance for their specific transformation without losing the Singer capabilities they already use.

Check the selected tap catalog as well as the resulting target schema when the source adds a field. A mapper may rename or omit it before Hydra ever reads the table. Record whether the change is detected, approved and propagated at the tap, mapper, target and Hydra stages. This field-level test keeps a migration from appearing successful merely because the final row count matches. It also shows where a future engineer should update configuration after an upstream API change.

##### Where each approach fits

##### Keep Meltano when

Keep Meltano where Singer taps or targets solve hard connectivity problems.

##### Evaluate Hydra when

Introduce Hydra for a transformation after a Meltano load or for a simple self-contained ETL job.

##### Should you replace Meltano with Hydra ETL?

Keep Meltano where Singer taps or targets solve hard connectivity problems. Introduce Hydra for a transformation after a Meltano load or for a simple self-contained ETL job. For a first test, list taps, targets, utilities and schedules used in one Meltano pipeline. See the complete integration plan.

##### Frequently asked questions about Meltano and Hydra ETL

These answers cover product fit, data movement, orchestration, migration testing and rollback. Check the linked product documentation for version-specific behavior.

What is the main difference between Meltano and Hydra?
Meltano composes plugins such as Singer extractors and loaders, along with utilities. Hydra runs supported sources, transformation steps and destinations in its own ETL job model. The extension and state models differ even though both can be configured as code.

How it works: Meltano organizes extraction and loading around plugins, commonly Singer taps and targets, while Hydra describes sources, transformations, destinations and orchestration in its own project. The migration boundary is the persisted dataset and its state, not the number of YAML files.

Practical check: Draw the current tap, target, state store, scheduler and downstream models. For one stream, compare source records, update behavior, destination keys and run reports. Keep the plugin version and configuration in the inventory so another engineer can repeat the baseline.

Pitfall to avoid: Do not infer feature equivalence from similar declarative syntax. A tap may include API pagination or authentication logic that a Hydra source does not provide. Retain that tap when its connector behavior is essential and move the transformations or downstream jobs first.
Can Hydra replace a Singer tap?
Only if Hydra supports the specific source behavior, including authentication, pagination, schema and incremental state. A tap with specialized SaaS behavior is often better retained.

How it works: A Singer tap is source-specific extraction code. Its catalog, stream selection, bookmarks and state messages determine which records are read on subsequent runs. A Hydra source can substitute only if it can reproduce the required API or database extraction behavior and restart safely.

Practical check: Choose one stream with a stable cursor. Capture the Singer catalog, state JSON, selected fields and several update cycles. Load into a separate Hydra table, then compare key coverage, late updates, null values and API call volume before moving the consumer.

Pitfall to avoid: A successful first full load does not establish incremental equivalence. Do not discard Singer state or switch the production target until the new extractor has survived an interruption and a replay without losing or duplicating records.
Can a Meltano target feed a Hydra job?
Yes. Let Meltano finish the tap-to-target load, then point Hydra at a stable landed table or file. Keep the Hydra output separate during the pilot and make one scheduler own the sequence.

How it works: A Meltano target can land rows in a database or file that Hydra then treats as a source. This handoff preserves the mature tap and target while allowing Hydra to handle cleaning, joins, quality checks or publishing.

Practical check: Make the landed relation immutable per run or expose a completion marker. Start Hydra only after the Meltano run reports success, record the source batch ID in Hydra, and reconcile input count with accepted and rejected rows. Keep target credentials limited to the staging schema.

Pitfall to avoid: Avoid reading a table while the target is still writing it. A partially populated batch can look like valid input and create a misleading success. Define who retries the handoff and ensure the retry uses the same batch identifier.
What happens to Meltano state IDs?
They stay with the extractor/loader pair and active Meltano environment. Hydra does not inherit them. Record the exact state ID and bookmark before any replacement experiment.

How it works: Singer state identifies the extraction position, often per stream and bookmark. Hydra upsert controls how extracted rows affect destination keys. These are different controls: one limits reading, the other determines writing.

Practical check: Persist the last Singer state alongside each completed batch and its target row count. For a Hydra replacement, document a separate cursor strategy, inclusivity rule and replay window. Test records sharing the same timestamp and updates arriving after the bookmark advanced.

Pitfall to avoid: Do not translate a Singer state ID into a destination primary key. Resetting state can cause a costly full replay, while advancing it before a durable load can lose rows. Preserve the last acknowledged state until end-to-end reconciliation passes.
Can I use dbt, Meltano and Hydra together?
Yes, with explicit boundaries. Meltano can ingest, Hydra can perform a bounded ETL or delivery step, and dbt can model warehouse data. Decide which tool owns each transformation and avoid duplicated schedules.

How it works: The tools can occupy separate layers: Meltano collects data, Hydra transforms and orchestrates selected jobs, and dbt models warehouse relations. Each layer has its own execution history and failure boundary.

Practical check: Assign one owner for scheduling and retrying each handoff. Use a batch identifier across Meltano runs, Hydra reports and dbt invocations. Compare the published table schema before and after each layer and let downstream work start only after the upstream result is committed.

Pitfall to avoid: Avoid two tools independently rebuilding the same production relation. A failure can leave the consumer reading a mixture of generations. Define a staging-to-published promotion point and keep transformation logic in one place per output.
Does a Hydra environment map directly to a Meltano environment?
No. Names may be similar, but configuration resolution and state tracking differ. Map endpoints, secrets, schema and state separately, then test the effective values in every environment.

How it works: An environment in Meltano scopes plugin and project settings; a Hydra environment resolves its own parameters, connections and secrets. Matching names such as dev and prod do not guarantee matching effective values or secret precedence.

Practical check: Create a mapping table for source endpoint, destination schema, schedule, credentials and runtime parameter in each environment. Run the same small data sample in both dev configurations. Print only nonsecret resolved settings and verify network access before promoting to prod.

Pitfall to avoid: Never copy a Meltano environment file wholesale into Hydra or embed a password in the comparison document. An unnoticed default can send a test run to production. Keep secret names explicit and validate the effective destination before every trial.
Which Meltano pipeline should migrate first?
Choose a standard file or SQL extractor and target with a stable flat schema, limited transformation and a replayable fixture. Avoid a stateful SaaS tap as the first candidate.

How it works: The safest first candidate is a bounded stream with a known source, stable cursor and independently checkable target. It exposes extraction, state and load differences without making many consumers depend on the experiment.

Practical check: Rank pipelines by connector complexity, data volume, business impact and rollback cost. Start with a low-risk stream that has meaningful updates and nulls, not only append-only happy-path rows. Save a baseline of counts, keys, duration and schema.

Pitfall to avoid: Avoid choosing the smallest stream solely because it is easy. A trivial snapshot cannot validate incremental state, duplicate handling or schema drift. Conversely, a critical multi-stream pipeline is a poor first test because diagnosis and rollback become entangled.
How do I retry only the Hydra step?
Use a durable handoff table or immutable export produced by Meltano. When Hydra fails, rerun it against that same completed batch instead of automatically repeating extraction and advancing state.

How it works: A Hydra step should be retryable from a durable Meltano output without rerunning the tap. This requires a stable batch identity and a destination write strategy that produces the same result on repetition.

Practical check: Record the finished Meltano run ID and landing path. Retry Hydra against that exact snapshot with a replace, keyed upsert or versioned target appropriate to the table. Compare the destination before and after a second run to confirm no extra rows.

Pitfall to avoid: If the source is a mutable landing table, a retry may read a newer batch and no longer reproduce the failure. Avoid overlapping schedulers and keep the prior snapshot until Hydra and downstream checks have completed.
Can the simulator benchmark Meltano plugins?
No. It executes neither a Singer tap nor a Meltano target. It models 14 rows locally and explains one Hydra transformation sequence.

How it works: The browser simulator shows the illustrated transformation and code shape; it does not install Meltano, invoke a Singer tap, or measure a target plugin. Connector behavior depends on the source service, rate limits and state protocol.

Practical check: Use the simulator to inspect the shared example, then benchmark both systems with the same source snapshot and destination schema. Measure extraction requests, rows per second, memory, retry outcomes and target reconciliation with production-like volumes.

Pitfall to avoid: Do not treat shorter YAML or a fast in-browser run as evidence that a production API connector will be faster. The simulator cannot reveal pagination bugs, authentication refresh, late data or network throttling.
What is a safe rollback?
Retain the original Meltano project, plugins, environment and state. Stop the new Hydra step and restore the previous downstream target or utility. Do not reset Meltano state to recover a Hydra-only failure.

How it works: Rollback restores the prior writer and its source position, not just an old configuration file. A Meltano run may have advanced Singer state while Hydra was processing its landed records.

Practical check: Save the last acknowledged Singer state, target snapshot and cutover time. Keep the Meltano schedule disabled but recoverable during the pilot. If Hydra fails, point consumers at the old target, resume Meltano from the saved state and reconcile the transition window by key.

Pitfall to avoid: Do not run both paths into the same production table during rollback. Divergent schema or upsert rules can hide duplicates. Keep staging isolated and rehearse a failure after extraction but before publish.

###### Migration and integration questions

How do you integrate Hydra ETL with Meltano?
Meltano can keep Singer extraction and loading while Hydra reads a stable landed table or file for transformation. Alternatively, one scheduler can invoke a Hydra project after a successful Meltano run with a documented handoff.

How it works: A practical integration keeps Meltano as the extractor and exposes its completed target to a Hydra job. Hydra can then validate, transform and publish the result through its own workflow, with an explicit handoff between run histories.

Practical check: Use a stable landing table or versioned file, pass the Meltano run ID as a Hydra parameter and make the Hydra workflow depend on a completion signal. Validate source count, target count and schema, then publish through a controlled promotion step.

Pitfall to avoid: Avoid a time-only trigger that assumes Meltano always finishes before Hydra starts. Network throttling or retries will break that assumption. Define timeout and ownership for the handoff, and make duplicate event delivery harmless.
Can Hydra replace Meltano taps and targets?
Only for source and destination behavior that Hydra connectors actually support. Singer taps and targets can encode specialized APIs and state, so evaluate each plugin rather than replacing a Meltano project wholesale.

How it works: Replacing a tap and target requires both source extraction parity and destination write parity. Hydra may cover a simple database path while a specialized Singer plugin still handles service-specific cursors, nested records or API quotas.

Practical check: List the tap catalog, state behavior, target mapping and transformations separately. Pilot each stream against a separate destination. Include an update, deletion if relevant, renamed field and interrupted run; compare keys and schema after at least two cycles.

Pitfall to avoid: Do not equate the availability of a JDBC or HTTP connector with parity for a vendor API. A connector gap can silently omit nested records or exceed rate limits. Keep the mature plugin until the actual stream contract passes.
How does Singer state compare with a Hydra upsert?
Singer state tracks extraction position; upsert controls target writes. Preserve the tap state and verify source changes and replay before removing the Meltano extraction stage.

How it works: Singer state is a source checkpoint; Hydra upsert is a target merge policy. Used together, state limits extraction while upsert makes overlapping replays less harmful, provided the target has a reliable key.

Practical check: Test the same timestamp on two records and a late update to an earlier record. Use an inclusive replay window and deterministic key mapping. Confirm that a repeated batch updates existing rows instead of creating duplicates, and store the checkpoint only after a successful load.

Pitfall to avoid: A keyed upsert cannot recover a row the extractor never reads. Advancing the bookmark too early or using a nonunique key still causes loss or incorrect overwrites. Reconcile source and target independently.
How do Meltano environments map to Hydra environments?
Inventory environment-specific plugin settings and secret values. Recreate the required non-secret parameters and credential references in Hydra, then run the same fixture in each environment to confirm resolution.

How it works: Both products support named runtime contexts, but their configuration resolution and secrets are separate. A Meltano prod setting does not automatically become a Hydra prod parameter, and a name match does not imply identical connection values.

Practical check: For each environment, compare source host, database, destination schema, schedule, feature flags and credential references. Run a dry validation and a small read-only query where supported. Keep a signed mapping of expected values for deployment review.

Pitfall to avoid: Beware of environment variables inherited from a shell or CI runner overriding an intended test value. Never show resolved secret values in logs. Verify the target schema explicitly before any command that can write data.
Can Meltano run a Hydra ETL job?
A Meltano command or an external orchestrator can invoke hdrctl after the relevant Singer load succeeds. Treat the command as a separate stage with its own exit code, logs and retry policy.

How it works: Meltano can invoke a Hydra command as part of a larger pipeline, or an external scheduler can coordinate both. Hydra still owns the semantics of its job, including source extraction, transformation and load.

Practical check: Wrap the Hydra CLI with a script that propagates exit code, logs run ID and passes environment and batch parameters. Execute only after Meltano has completed the landing step. Make a failed Hydra run block downstream publication and permit replay of the same input.

Pitfall to avoid: A command that prints an error but exits zero can create a false green pipeline. Avoid nested schedulers with independent retries unless their boundaries are documented, or one failure may multiply executions unexpectedly.
Should Meltano or Hydra own data extraction?
Keep Meltano when a mature Singer tap already solves a difficult source or state problem. Use Hydra extraction where its connector covers the source and the team values a declarative end-to-end job.

How it works: Ownership depends on connector fit. Meltano is strong when a Singer tap already handles difficult API behavior; Hydra may own extraction for supported sources when a single job can manage the complete flow coherently.

Practical check: Evaluate the source contract: authentication refresh, pagination, incremental cursor, rate limiting, deletion handling and schema evolution. Compare the operational burden of each owner and decide per stream. Keep the handoff stable even if extraction ownership changes later.

Pitfall to avoid: Avoid a blanket decision based on product labels. Moving a specialized tap merely to simplify the diagram can increase maintenance and data loss risk. Conversely, retaining redundant extraction layers can make debugging unnecessarily complex.
How do you migrate a Meltano pipeline to Hydra YAML?
List every tap, target, mapper, schedule and state backend. Rebuild one supported path in Hydra, compare target data after a full and incremental run, and document any Singer-specific behavior left outside Hydra.

How it works: A Meltano pipeline may encode plugin configuration, state, transformations and orchestration in distinct places. Hydra YAML should be derived from the effective behavior of the pipeline, not mechanically translated line by line.

Practical check: Document source fields, bookmark, normalization, target keys, schedule and expected output first. Build a Hydra source, transformation and destination for one stream. Run both against the same fixture, compare rows and failure recovery, then migrate scheduling last.

Pitfall to avoid: A syntax-only port misses implicit plugin defaults and external environment variables. Record those defaults before removing the old runner. Do not cut over until repeated runs, schema changes and interrupted loads produce acceptable results.
What should be tested before replacing a Meltano target?
Test primary keys, schema changes, nulls, write disposition and restart after interruption. The same record count can hide differences in table shape or duplicate handling.

How it works: A target may normalize names, types, timestamps or nested documents before writing. Replacement requires matching the consumer-visible schema and load behavior, not merely inserting the same number of records.

Practical check: Capture the target DDL, primary keys, nullability and type conversions. Feed a fixture with empty strings, high-precision numbers, timezone offsets and nested values. Compare output schema and row values after initial, update and replay runs.

Pitfall to avoid: Counts alone can conceal wrong values or lost precision. A replacement that turns a timestamp into local time or a decimal into float may pass a superficial check while breaking downstream models.
Can Meltano and Hydra share the same destination?
They can, but simultaneous writes make a pilot hard to judge and can create conflicts. Start with separate target tables or schemas, then designate a single writer when the output contract is verified.

How it works: Two writers can coexist only with explicit isolation or a proven concurrency contract. Meltano and Hydra may disagree on keys, transactions and table replacement, so simultaneous writes to one relation are unsafe by default.

Practical check: Use separate schemas or versioned tables for a parallel pilot. Reconcile keys and aggregates, then redirect consumers through a view or controlled rename. Disable the old writer before enabling the new one on the published target.

Pitfall to avoid: Do not use shared-table dual writes as a quick parity test. A replace operation can erase the other writer’s data, and independent upserts can produce nondeterministic final values. Preserve a rollback snapshot.
How do you roll back a Meltano-to-Hydra migration?
Preserve Meltano configuration and Singer state, stop the Hydra schedule and restore consumers to the previous target. Replay only the uncommitted interval using the original tap and target.

How it works: Rollback from Meltano to Hydra restores extraction checkpoint, target ownership and downstream routing. It must account for records written during the pilot and for the last Singer state that was acknowledged.

Practical check: Keep the old pipeline deployable and its state backed up. On failure, stop Hydra, route reads to the old target, resume Meltano at the agreed checkpoint and replay the transition interval. Validate key counts and changed values before ending the incident.

Pitfall to avoid: Do not simply re-enable a schedule. If the old state is stale, it may replay widely; if advanced too far, it may skip records. Document the recovery window and rehearse it before the production cutover.

Sources and method
The product descriptions were checked against the vendor references below and the Hydra DSL documentation. The comparison concerns the stated workflow, not all features or editions. The browser simulator is neither an engine run nor a performance benchmark.

Meltano: plugins ↗

Meltano plugins ↗

Meltano CLI and run ↗

Meltano environments ↗

Meltano replication state ↗

02 / Try

#### Meltano vs Hydra: sample pipeline

#### Same small batch, two definitions

Read 14 sample orders, keep amounts above 50, sum by status and sort by total. Right-click inside either editor or use ⋯ for its line actions. Edit the Hydra threshold to recalculate the result; the source threshold follows where the displayed example includes one. The browser models this fixture and does not run either product.

Browser simulation

MeltanoComposable ELT project
⧉↓⬡⤢⋯

# meltano.yml (illustrative plugin selection)
plugins:
extractors:
- name: tap-csv
loaders:
- name: target-postgres

# Run the EL load, then a separate transform:
# meltano run tap-csv target-postgres
# dbt run --select orders_by_status
CopyDownloadIllustrative example

Hydra ETLYAML job files
✓▶⇢⧉⤢⋯

# sources.yaml
sources:
orders:
type: csv
extract:
table: data/orders.csv

# pipeline.yaml
pipeline:
from: orders
to: report

# transformations.yaml
steps:
- cast:
mapping: { amount: float }
- filter:
expr: "amount > 50"
- aggregate:
by: [status]
agg:
total: { func: sum, col: amount }
- sort:
by: [total]
ascending: false

# destinations.yaml
destinations:
report:
type: csv
load:
table: data/by_status.csv
mode: replace
Run sampleResetCopyDownload textRunnable ZIP

Lines in these examples Meltano / Hydra

Files representedExample / 4 Hydra files

Run scope14 browser-local rows

Line counts are live counts of the text shown above, not a product benchmark. The Meltano pane is illustrative and is not executed. The Hydra pane shows four files in one editor for comparison; only the displayed cast, filter, aggregate and sort operations are simulated. “Download text” includes your edits; “Runnable ZIP” contains the original four files and input CSV, validated with Hydra 0.22.0.

##### Simulated run result
×

StatusTotal

×

03 / Integrate

#### Introduce Hydra in a Meltano environment

Start with a reversible pilot. Keep the current system running until the new output and failure behavior are verified.

##### Before you change a schedule or destination

The Meltano project’s plugin list, versions, environment and state ID.

A stable target table or file for the handoff.

A frozen input and expected output, including an incremental second batch.

Hydra CLI and credentials on the execution host, with a separate output target.

##### Step-by-step integration and migration

01

###### Inventory the run chain

Read meltano.yml and record extractors, loaders, mappers, utilities, schedules and environments. Determine the state ID for the exact extractor/loader pair. Save the previous successful run result and target schema.

02

###### Keep the extraction stable

For coexistence, run the existing Meltano tap and target unchanged. Mark the target table or exported file as ready only after meltano run succeeds. Do not start with a tap rewrite.

03

###### Add a Hydra job downstream

Define Hydra source, transformations and destination. Point the source at Meltano’s landed data and the destination at a new staging target. Validate strictly and run one frozen batch.

04

###### Test incremental and repeat behavior

Run Meltano again with new and updated source records, then run Hydra again. Compare business keys and values and confirm the Meltano bookmark advanced only for successful extraction. Repeat a Hydra failure without repeating the tap unnecessarily.

05

###### Unify the schedule boundary

Place the two commands in one existing orchestrator or a carefully configured Meltano utility sequence. Record which tool owns alerts, retries and the batch identifier. Avoid starting the same pair through both a Meltano schedule and a separate Hydra trigger.

06

###### Replace only a supported pair

If a full replacement is still useful, choose one simple tap/target pair. Compare source extraction and target writes on parallel outputs over several cycles. Preserve plugin configuration and state until rollback is no longer required.

##### A transparent Meltano-to-Hydra handoff

# Example for a configured Meltano project and active dev environment.
meltano --environment=dev run tap-orders target-postgres
hdrctl validate /srv/hydra/orders --strict
hdrctl run /srv/hydra/orders
# Hydra reads the table written by target-postgres.
# A scheduler should stop if either command fails.

Adapt the paths, project files and credentials to your deployment. The runnable orders fixture ZIP is a safe starting point for the Hydra side; its local YAML was validated with Hydra 0.22.0.

##### Acceptance checks before cutover

Meltano state ID and bookmark are recorded for each run.

Hydra starts only after the target load completes.

Repeated runs do not duplicate destination business keys.

Environment values and secret sources are mapped explicitly.

A Hydra-only retry does not re-extract data.

##### Rollback plan

Stop the Hydra downstream command and return consumers to the original Meltano target or transform utility. Preserve Meltano plugin versions, environment and state ID throughout the pilot so extraction can continue from the previous bookmark.

##### Practical pitfalls

Do not assume every Singer tap is available in Hydra.

Keep one owner for the schedule.

Preserve state and bookmarks when touching incremental extraction.

Build the pilot
Use the CLI reference to create and validate a project, then use the DSL guide for source, transformation and destination syntax.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra ETL vs Talend — slug: /migrate/talend/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All comparisons
Compare with Hydra ETL
Explore Hydra CLI ↗

Compare & migrate/Talend

Product comparison · Visual data integration

### Hydra ETL vs Talend

Talend Studio builds data integration Jobs from linked components. Hydra defines jobs in YAML and runs built-in ETL steps. Talend is stronger when its component ecosystem and visual mappings are essential; Hydra suits smaller pipelines that a team wants to review as text.

Scope: A Talend Studio data integration Job compared with a Hydra batch job. Reviewed 17 November 2026

Comparison Simulator Migration & integration

01 / Compare

#### Where the tools overlap and diverge

Short answer
Talend Studio builds data integration Jobs from linked components. Hydra defines jobs in YAML and runs built-in ETL steps. Talend is stronger when its component ecosystem and visual mappings are essential; Hydra suits smaller pipelines that a team wants to review as text.

Product contextCapabilitiesDetailed analysisTechnical evaluationWorked exampleDecision20 questions

##### What Talend does, and what Hydra changes

Talend Studio Jobs are designed as connected components. Components can extract, filter, map, aggregate, route rejected rows and load targets, while context variables select different environment values. Hydra describes an ETL job through source, pipeline, transformation and destination YAML files. The comparison is therefore not “visual versus text” alone: connector behavior, metadata propagation, rejection paths and deployment controls must all be examined.

A complex Talend estate may contain reusable Joblets, tMap expressions, Java routines, context groups and Talend Management Console schedules. A small file-to-file Job may use only a handful of components. Those two cases have very different migration costs. The first Hydra pilot should select a Job with a stable schema, a single output and no proprietary or custom Java component. Record what the Job actually writes, including rejected rows and side effects.

The simulator presents a component map because a Talend Job is not normally represented by a single hand-written script. Its apparent line count cannot be compared fairly with YAML. Treat the map as a guide to the operation sequence and use the actual Talend Job export and runtime results for a professional evaluation.

##### What both can do

Connect inputs to outputs

Filter and map records

Run repeatable data integration jobs

##### Key differences

AreaTalendHydra ETL

AuthoringVisual component graph in Talend StudioVersioned YAML files

ExecutionTalend Job runtime and generated codeHydra ETL engine and CLI

CoverageBroad component palette and enterprise integrationOnly Hydra-supported connectors and transformations

ReviewInspect component configuration and graphReview a text diff of the job definition

##### Detailed comparison for a production decision

###### Component graph and transformation semantics

Talend’s component palette provides dedicated building blocks. A tFileInputDelimited to tMap to tAggregateRow to tFileOutputDelimited chain may look similar to a Hydra source, cast/filter/aggregate steps and destination. But the Talend graph also carries row links, error links, component order and component-specific settings. A visual resemblance does not prove the same output.

During migration, map each input and output link, not just each component name. Check tMap expression language, null behavior, lookup join strategy, sort ordering and reject links. If a Talend component emits two outputs, a single linear Hydra job may not preserve that routing without a second job or explicit intermediate target.

Product documentation: Talend components for Jobs ↗

###### Schemas, metadata and rejected rows

Talend schema metadata can define field types, lengths, date formats and nullable flags at the component level. Hydra source schema, casts and destination settings must be chosen to reproduce the intended contract. A field typed as string in a CSV may look correct in a preview yet fail when an amount is aggregated or loaded into a numeric SQL column.

Create a fixture with valid records, one malformed number, one missing mandatory value and one duplicate business key. Capture Talend’s main and reject outputs separately. In Hydra, decide explicitly whether the equivalent behavior is failure, cleaning, filling or a separate reject path. Count every input row: accepted, rejected and duplicated.

Product documentation: Talend components for Jobs ↗

###### Contexts, secrets and deployment

Talend context variables allow a Job to run with values for development, test or production. Values can also be loaded dynamically. Hydra has project parameters, named environments and secret resolution, but their precedence and storage are not a byte-for-byte copy of Talend contexts. A migration must include a mapping table for each setting, its source and its effective value at run time.

Do not place database passwords in YAML merely because the new job is text based. Test the same job under dev and prod-like settings with separate credentials and targets. Capture how both systems log failures so connection details or secrets are not exposed in run reports.

Product documentation: Talend contexts and variables ↗

###### Coexistence inside a Talend Job

Talend tSystem can invoke a system command as part of a larger Job. That provides a reversible integration path: keep the existing upstream Talend components, materialize a file or staging table, then call hdrctl on a separate Hydra job. Talend remains the scheduler and failure owner while the ETL slice is evaluated.

This bridge needs operational discipline. Use an absolute Hydra project path, ensure hdrctl is installed on the same execution host or container, supply credentials through approved environment or secret mechanisms, and propagate the exit code. Configure the Talend link so a failed Hydra command cannot be reported as an overall success.

Product documentation: Talend tSystem component ↗

###### When a full replacement is a poor fit

Talend installations often carry connectors, data quality rules, reusable components and administrative processes that go far beyond a simple row transform. Replacing those capabilities requires workload-specific evidence. Keep Jobs that depend on unsupported connectors, complex routing or Java routines in Talend while simpler Jobs move incrementally.

The professional question is not whether the YAML is shorter. Ask whether the same dataset is produced, whether bad rows and retries are handled, whether operations staff can diagnose a failed run, and whether downstream consumers see the same contract. If any of those answers is unknown, keep the Talend Job in control.

Product documentation: Talend components for Jobs ↗

##### Technical evaluation: Talend and Hydra ETL in production

###### A Talend Job is a graph of runtime behavior

A Talend Studio Job is assembled from components and connections, but the diagram alone is not the complete contract. A tMap may contain expressions, lookup joins, multiple output tables and rejection paths. PreJob and PostJob components can prepare or clean up external state. Triggers can change what happens after success or failure. A Hydra ETL replacement therefore begins with the exported Job design and a run trace, not a screenshot of five visible boxes. Enumerate every component, connection, schema and side effect before deciding which portion belongs in a Hydra job.

For a practical assessment, label every Talend connection as main, lookup, reject, output or control flow. Record row counts at each branch and the exact destination for every emitted row. Then pick one linear path with a stable source and one main output for the first Hydra pilot. A complex tMap with three lookups and two reject streams is a different migration problem from a filter followed by a file writer, even if both are described as “Talend ETL”.

Further reading: Talend row connections ↗

###### Component mapping must preserve type and null semantics

A Talend tFilterRow expression, tMap expression and tAggregateRow grouping can often be described with Hydra filter, calculate, join or aggregate steps. The names are not a semantic mapping. Talend component schemas may declare Java types, patterns and nullable fields; its generated code may evaluate expressions in a particular order. A Hydra job reads values through its connector and transformation engine. Explicit casts and null rules are necessary before comparing numeric totals or date filters, especially when the original source is a delimited file.

Build a fixture that includes a null lookup key, a blank string, a malformed date, a decimal at the rounding boundary and duplicate business keys. Run the Talend Job and the candidate Hydra job against separate targets. Compare rows by a stable key, including precision and nullability. If an operation cannot be represented with Hydra’s documented DSL, leave that transformation in Talend or implement a separately tested boundary; do not quietly change the business rule to fit a shorter YAML example.

Further reading: Talend components ↗

###### tMap is often several transformations and outputs at once

Talend tMap is frequently the center of an integration Job rather than a simple column mapper. It can combine input flows, maintain lookup tables, evaluate expressions and route rows to several outputs. A professional Talend versus Hydra comparison should decompose that behavior into a rule inventory: source column, lookup key, join cardinality, expression, filter, default value, output schema and reject condition. Only after that inventory can an engineer decide whether one Hydra job, several jobs or a retained Talend stage is appropriate.

A good regression test makes every tMap path execute at least once. Include an unmatched lookup, a duplicate lookup key, a row that matches the main output, and a row sent to each reject or alternative output. Save the Talend result for every path, not only the final published table. If Hydra produces the same main table but drops a rejection path that operators rely on, the migration is incomplete. This is why component-count and line-count comparisons are weak evidence for a production Job.

Further reading: Talend tMap properties ↗

###### Rejected rows form part of the published contract

Talend Jobs often expose an error or reject connection that captures records failing parsing, lookup or validation. Some teams use these rows for remediation and reprocessing, so they are an operational product rather than incidental logs. A Hydra replacement must specify where rejected records go, what reason is attached and whether the primary load continues or fails. If the Hydra DSL cannot reproduce a particular row-routing behavior directly, document the gap and keep a separate controlled quarantine mechanism.

Reconcile input rows as accepted, rejected and intentionally filtered, with no unexplained remainder. Test at least a malformed source line, missing mandatory field, invalid cast and destination constraint violation. Determine whether the original Talend Job continues, retries, or aborts for each case. The comparison should include the number and identity of rejected rows and the exact point at which the failure becomes visible to the scheduler. A green main output can coexist with a broken quality process.

Further reading: Talend row connections ↗

###### Context variables are a deployment interface

Talend contexts can select hostnames, schemas, file paths and thresholds per environment. They may also contain or reference credentials. Before moving a Job, export the context groups and list every variable read by a component or routine. Separate values that belong in version-controlled Hydra environment configuration from values that must come from a secret store or process environment. A single hard-coded path in a proof of concept can obscure a production Job that actually runs in several regions or tenants.

Run the new job in dev, test and production-like settings without changing its committed YAML between environments. Check the resolved source and target names and confirm credentials are absent from logs and Git status. For a Talend Job with multiple context groups, state which group corresponds to each Hydra environment and which values have no direct equivalent. The migration plan should name who rotates secrets, how the runner receives them and how an incorrect environment is prevented from writing to the wrong target.

Further reading: Talend contexts and variables ↗

###### Talend scheduling and Hydra execution are separate concerns

A Talend estate may deploy Jobs through a management platform, an external scheduler or scripts. The Job’s execution graph and the schedule that starts it should be inventoried separately. Hydra can execute a supported ETL job from hdrctl and can coordinate workflows, but replacing a Talend Job does not automatically replace the organization’s monitoring, alerting or release process. For a first integration, keep the current scheduler and call Hydra only after the upstream handoff is ready.

If a Talend Job invokes hdrctl through tSystem, give the command an absolute project path and ensure a nonzero Hydra exit code fails the Talend Job. Capture both Talend execution ID and Hydra run report location. Test a missing input file, invalid YAML and denied destination write. A scheduler that reports success while Hydra failed is an integration defect. Only after this boundary behaves correctly should the team consider moving schedule ownership from Talend to Hydra.

Further reading: Talend tSystem ↗

###### Custom routines and Joblets change the migration cost

Reusable Talend Joblets and Java routines can carry validation, formatting and business logic that is not visible from the top-level component chain. Search the exported Job for calls to these artifacts, then inspect their inputs, exceptions and side effects. A replacement that counts only top-level components may miss a routine that normalizes customer identifiers or a Joblet that sends a notification on rejection. Such logic needs its own test and destination in the Hydra design.

Classify each custom element as a supported Hydra transformation, a separately retained script, or a reason to keep the Talend Job. For a retained script, define its invocation, input/output format, version and failure contract. Do not call an arbitrary Java routine “just a cast” without a fixture demonstrating equivalence. The decision record should include the maintenance owner and test coverage for each custom element, because a shorter Hydra manifest can still depend on substantial external code.

Further reading: Talend components ↗

###### Schema and destination write behavior need separate review

Talend output components can create, append, truncate or update destination data according to their settings. Some Jobs rely on pre-job DDL or database-specific SQL. Hydra load modes may cover append, replace and upsert for supported destinations, but transaction boundaries and key-conflict behavior need direct verification. Inventory table creation, indexes, primary keys, column types, commit size and any staging-table swap in the current Job before translating the destination block.

Use two runs to expose differences. The first loads new rows; the second changes a previously loaded key and includes a duplicate in the incoming batch. Then make the third batch fail and inspect whether earlier batches remain committed. Compare the exact target DDL and row values. If Talend’s Job owns DDL changes or runs stored procedures, retain those operations explicitly until a Hydra replacement has an approved database migration strategy. The target table is a contract with consumers, not merely a sink.

Further reading: Talend components ↗

###### A Talend-to-Hydra pilot should have objective exit criteria

The most useful pilot is narrow enough to finish and broad enough to reveal data semantics. Select a Job with a supported connector pair, deterministic transformation, defined schema and known downstream consumer. Freeze a representative input snapshot and retain the original Talend run output. The acceptance matrix should include row identity, order-independent values, numeric tolerance, nulls, rejects, second-run behavior and recovery after a destination failure. Record each expected result before running Hydra.

Set explicit exit criteria: every mandatory path is accounted for, output contracts match, the run can be replayed safely, credentials remain outside source control, and operations can find the failing step. A pilot that merely produces a file is not enough. If a gap appears, classify it as a connector limitation, transformation difference, deployment issue or deliberate redesign. This makes the comparison useful to a technical buyer and prevents an unqualified claim that Hydra replaces Talend as a whole.

Further reading: Talend components ↗

###### Cutover and rollback preserve the old Job until evidence is stable

A Talend-to-Hydra cutover should change one schedule and one published target at a time. Run the candidate job in parallel against a separate table or file for several normal cycles, including a day with missing or malformed source data. Compare outputs and alert behavior after each cycle. At cutover, record the last Talend input interval and the first Hydra interval so neither is omitted or processed twice. Keep the exported Job and its context configuration deployable during the observation window.

Rollback means more than clicking the old schedule back on. Check whether Hydra has already written rows that Talend would write again, restore consumer reads to the previous target, and replay only the uncovered interval. Document who performs this action and which query proves the target is coherent. If the old Job depends on a stateful source or a temporary file, preserve that state through the pilot. A migration guide earns trust by specifying these details, not by ending with “switch when ready”.

Further reading: Talend contexts and variables ↗

##### Worked evaluation: a customer enrichment Job

Consider a Talend Job that reads orders.csv, looks up each customer in a database, calculates net_amount and writes accepted rows to PostgreSQL. Unmatched customer IDs travel through a reject connection into a review file. The visible graph may show tFileInputDelimited, tMap and an output component, but the real contract includes the lookup join type, tMap expression, output schemas, rejected-row reason, context variables and pre-job database setup. Export the Job and capture a run with accepted and rejected examples before creating the Hydra candidate.

Use a fixture with four orders: one normal customer, one missing customer, one duplicate lookup key and one blank amount. Save the exact Talend accepted output and reject file. A Hydra design may use a CSV source, a database-backed lookup or staged customer file, a join, cast and calculate step, then a PostgreSQL destination. Before coding, decide where unmatched rows will go. If a single Hydra job does not emit an equivalent reject stream, add a separate validated quarantine path or keep the Talend component that owns it. Do not claim parity based only on the accepted table.

Run the two implementations against isolated schemas with the same frozen customer snapshot. Sort rows by order_id and compare net_amount to an agreed decimal tolerance, customer identifiers, null handling and write timestamps. Check that the duplicate lookup row does not multiply an order unexpectedly. Reconcile four input orders as accepted, rejected or intentionally filtered. When a Talend expression uses a Java routine, create a focused test of that routine’s edge cases before replacing it with a Hydra cast or calculation. The replacement must match the business result, not merely the diagram.

Repeat the run after changing the customer name and adding a new order with an existing key. The Talend output component’s update mode and Hydra destination upsert may handle the key differently; inspect the final relation and unique constraint. Then fail the third batch by making PostgreSQL unavailable. Observe whether either system committed earlier rows, which status the scheduler receives and how the operator can retry. A green second run is not enough unless duplicates and partial commits have been checked.

Map the Talend context group used in each environment to Hydra environment values and secret references. Verify that dev points to a dev customer table and an isolated destination, while production credentials never appear in committed YAML. If Talend remains the scheduler, a tSystem bridge must call hdrctl with an absolute project path and propagate nonzero exit codes. Test a missing YAML file and denied target write to prove that the Talend Job fails visibly instead of declaring an empty or partial result successful.

The decision record should identify which Talend components are removed, retained or replaced, including every reject and error path. Keep the original Job and contexts deployable until several cycles and a recovery drill have passed. At cutover, record the final Talend input interval and first Hydra interval; restore the old output and replay only the uncovered data if rollback is needed. This case shows why a serious Talend versus Hydra comparison must analyze tMap, rejects, contexts and database write semantics together.

Related product documentation: Talend tMap and row connections ↗

##### Decision criteria for an existing Talend deployment

The final Talend review should include a component coverage table that lists every source, transformation, target, routine and control path in the selected Job. Mark each as reproduced in Hydra, retained in Talend, externalized or unsupported. A top-level component count is insufficient because tMap expressions and Joblets may carry substantial logic. Attach a fixture that executes every relevant branch. This table is the practical bridge between a visual Job design and an auditable Hydra YAML implementation.

Operations should review deployment differences as carefully as row values. Who packages the Job, injects contexts, starts it, retains logs and responds to failures today? Who will perform those tasks after Hydra takes over? A tSystem bridge may be an excellent intermediate step because it preserves the existing schedule, but it also creates two logs and two runtime dependencies. Define the report link and support owner so an incident does not become a search across unrelated systems.

A successful migration decision requires an explicit rejection-path statement. If Talend sends invalid rows to a review queue or file, demonstrate where those rows appear under Hydra and how a corrected row is replayed. If this cannot be reproduced, the correct decision may be to keep that Job in Talend while moving simpler Jobs first. This limitation is valuable to a professional reader because it protects data quality and avoids a misleading one-to-one component mapping.

Review one production Job with its actual owner before publishing the replacement. Ask which context values are changed during incidents, which rejection file is checked first and which database query confirms that the load completed. Translate those practices into the Hydra runbook or preserve the Talend operation that supplies them. The correct migration scope is the smallest Job whose data, failure and support contracts can be reproduced. That answer is more precise than a feature claim about all Talend components and gives a technical buyer a realistic first project.

##### Where each approach fits

##### Keep Talend when

Keep Talend for complex component-specific integrations, existing operational controls and visual Job design.

##### Evaluate Hydra when

Start with a small Talend Job made of file input, filter, aggregation and file output.

##### Should you replace Talend with Hydra ETL?

Keep Talend for complex component-specific integrations, existing operational controls and visual Job design. Start with a small Talend Job made of file input, filter, aggregation and file output. For a first test, export the Job design and record component settings, context variables and schema. See the complete integration plan.

##### Frequently asked questions about Talend and Hydra ETL

These answers cover product fit, data movement, orchestration, migration testing and rollback. Check the linked product documentation for version-specific behavior.

Can Hydra import a Talend Studio Job automatically?
This guide does not claim an automatic Job importer. Talend component graphs, expressions, contexts and reject links need an explicit mapping. Start with a small Job and compare actual output before considering a wider migration.

How it works: A Talend Studio Job is a component graph with settings, schemas, triggers and sometimes custom Java routines. Hydra has no implied one-click importer for that design. Translation requires interpreting the operations and their runtime effects, then expressing the supported parts as Hydra source, transformation, pipeline and destination files.

Practical check: Export one bounded Job and enumerate every component and connection, including pre-job and reject paths. Save a representative input and all outputs before rebuilding anything. Translate a linear path first, validate the Hydra YAML and compare the two outputs by business key. Record any component that remains Talend-owned.

Pitfall to avoid: Do not infer success because the top-level graph looks similar or a generated YAML file parses. tMap expressions, context variables and routines can hide important rules. An importer that merely matches component names would miss those details. Keep the original Job deployable until data, failure and rollback tests pass.
What is the closest Hydra equivalent of tMap?
There is no universal one-to-one equivalent. A simple tMap expression may translate to select, rename, cast, calculate, filter or join steps. Multiple output links and Java expressions may require more than one Hydra job or a retained Talend component.

How it works: tMap is not a single column-selection step. It may join lookup flows, calculate expressions, route multiple outputs and reject unmatched rows. A Hydra equivalent may require a sequence of select, cast, join, calculate and filter operations, plus a separate path for rejects when the original Job publishes them.

Practical check: Open tMap configuration and list every input, join key, expression, output schema and rejection condition. Build a fixture that reaches each output branch: matched, unmatched, duplicate lookup and invalid value. Translate each rule into a named Hydra step and compare accepted plus rejected rows. Check join cardinality before inspecting final aggregates.

Pitfall to avoid: A correct-looking main output can hide missing reject rows or multiplied records from a duplicate lookup. Do not collapse a multi-output tMap into one destination without an explicit redesign. Preserve decimal and date conversion rules; defaults used by one engine can make the same input produce different values.
Can Talend call Hydra without replacing the Job?
Yes. A Talend tSystem component can run hdrctl on the execution host. Use an absolute path, make credentials available securely, and ensure a nonzero Hydra exit code fails the Talend Job.

How it works: Talend can invoke external commands through components such as tSystem. This creates a coexistence boundary where the existing Job owns scheduling and upstream preparation while Hydra executes a supported ETL segment. The command’s exit code and the visibility of its logs determine whether this is a reliable integration.

Practical check: Install the pinned Hydra CLI in the Talend runner environment, stage the project at an absolute path and call hdrctl validate followed by hdrctl run. Route Hydra output to a separate target. Test a valid run, missing project file and denied database write. Confirm Talend reports failure on a nonzero Hydra exit and records the Hydra report location.

Pitfall to avoid: Do not assume the Talend development machine and production runtime share filesystem mounts, network routes or credentials. A shell command that succeeds manually can fail as a Job task. Also avoid hiding the Hydra status behind a wrapper that always exits zero; the scheduler may publish an incomplete target.
How do Talend contexts map to Hydra environments?
List each Talend context variable, its default and any dynamically loaded value. Map nonsecret settings to Hydra parameters or environment configuration, and secrets to Hydra’s secret resolution. Test effective values in each environment rather than assuming identical precedence.

How it works: Talend context groups select environment-specific connection names, paths and thresholds. Hydra environments and parameters can carry non-secret variants, while credentials require an appropriate secret source. The mapping is per variable use: a value read by a tMap expression may be a business rule, not merely infrastructure configuration.

Practical check: Export all contexts for the candidate Job and build a table of variable name, source, default, usage and destination. Map dev, test and prod settings to Hydra without changing committed YAML between runs. Validate the resolved source and target names in each environment. Keep secret values out of Git, logs and example files.

Pitfall to avoid: Copying a production context into YAML can leak credentials or point a test run at the wrong database. A similarly named variable may be used by several components. Inspect every reference, including routines and pre-job steps, before declaring the context migration complete. Test an unset required parameter and make it fail before writing.
What happens to Talend reject rows?
They must be accounted for explicitly. Capture the Talend reject link output and decide whether the Hydra job should fail, clean, skip or write an equivalent reject target. Equal main-row counts alone do not prove equal error behavior.

How it works: Talend row connections can separate main output from rejected records. Reject streams may be used to repair source data and replay it later. Their schema and reason codes form an operational contract alongside the primary target. A Hydra job must reproduce or deliberately redesign that handling.

Practical check: Run the original Job with malformed date, missing lookup and invalid numeric value. Save both main and reject outputs and reconcile them against input IDs. Define where Hydra writes or reports each rejected row, how an operator retrieves it and how a corrected row is retried. Compare reason categories, not only reject counts.

Pitfall to avoid: Dropping rejected rows silently can make the published table appear cleaner while losing data. Failing the whole Hydra job where Talend quarantined a row may also change service levels. Document which behavior is desired and who approves the change. Do not move a Job until every required row path has a tested destination.
Is YAML easier to review than a Talend Job?
A small linear job may be easier to diff as YAML, but that is a review preference, not an objective quality score. Talend visual graphs can be clearer for branching flows. Evaluate review and troubleshooting with the real Job your team owns.

How it works: Text diffs of Hydra YAML can make supported ETL rules easier to inspect, while Talend Studio exposes a visual graph and component configuration. Reviewability depends on where business logic actually resides. A short YAML manifest with a large script is not automatically easier to audit than a well-structured Talend Job.

Practical check: Ask two reviewers to locate a filter, a join condition, a cast and the load mode in both implementations. Include routines, Joblets and helper scripts in the comparison. Record how many files and UI panels they must inspect and whether the expected output fixture is present. Use a code review that checks data semantics rather than format preference.

Pitfall to avoid: Do not equate YAML with simple or visual authoring with opaque. An overlooked Talend component setting or external Hydra script can defeat either review process. Preserve a rule inventory and tests alongside the replacement. The review should make it possible to predict output on an edge-case fixture before running the Job.
Can Hydra replace Talend’s connector catalog?
Only where Hydra supports the exact source and destination behavior required by the Job. A Talend connector may include application-specific semantics that a generic file or SQL connector does not reproduce.

How it works: Talend has a broad component catalog for databases, files, applications and control tasks. Hydra supports a defined set of connectors and transformations. A component family name is not evidence that Hydra reproduces every authentication, schema, transaction or error option of a particular Talend component.

Practical check: List the exact source and target component versions and settings for one Job. Check Hydra’s documented connector features against those settings, then run a low-risk connection test with the same data type and credential method. Include pagination, CDC or stored procedures if used. Classify unsupported behavior as retained, externalized or a blocker.

Pitfall to avoid: Avoid claiming catalog-level parity from a CSV-to-CSV example. A specialized application connector may be the reason Talend is used. Migrating that component first increases risk and obscures Hydra’s value on simpler Jobs. Keep Talend where its connector behavior is essential while assessing other data flows independently.
Which Talend Job should migrate first?
Choose a deterministic file or database Job with one main output, stable schema and no custom Java or specialized connector. Avoid complex tMap branching, CDC and data-quality routing in the first pilot.

How it works: A good first candidate is a bounded Job with a stable schema, supported source and target, deterministic transform and one main output. It should have a known owner and a saved baseline. This minimizes simultaneous changes to connector, transformation, deployment and data-quality behavior.

Practical check: Choose a file or SQL Job that filters, casts or aggregates, with no custom Java routine or complex reject graph. Freeze input and output fixtures, document the current schedule and build an isolated Hydra target. Run twice, including a changed row, then force one destination failure. Use these results to refine the translation method before selecting harder Jobs.

Pitfall to avoid: Do not choose the most complex or politically important Job as a proof of concept. A pilot with several proprietary connectors can fail for reasons unrelated to Hydra’s ETL model. Conversely, a trivial one-row file copy proves little. Select a Job that exercises at least one meaningful business rule and a realistic load mode.
How should numeric and date fields be tested?
Create boundary fixtures with empty values, invalid dates, decimals and large numbers. Compare parsed types and final destination values. Explicit Hydra casts are important when CSV input begins as text.

How it works: Talend components can parse numbers and dates with configured patterns, locale and nullable types. Hydra connectors and casts may use different defaults. A text field that looks numeric can be misread; a timestamp without a time zone can shift when written to a database.

Practical check: Create fixtures with empty string, null, comma decimal, negative amount, leap-day date and time-zone boundary. Record Talend’s accepted value or reject reason for each. Configure Hydra casts explicitly and compare physical target types and values. Decide a numeric tolerance before running aggregates and verify that the same row contributes to each total.

Pitfall to avoid: Do not check only aggregate totals. Two parsing errors can cancel one another, and a date shifted across midnight can move a row into the wrong partition. Also do not assume blank and null mean the same thing in both tools. Preserve the original pattern and locale rules or document the intentional contract change.
What is a safe Talend rollback plan?
Retain the original Job and context definitions. Stop the Hydra call or schedule, restore the original destination link and rerun the affected batch using Talend’s existing operational procedure.

How it works: Rollback requires the old Talend Job, contexts, schedule and target to remain available while Hydra runs in isolation. Restoring a schedule alone may replay rows already written during cutover. The data interval and destination ownership must be reconciled before declaring recovery.

Practical check: Before switch, record last Talend input interval, target row count and schema. If Hydra fails, disable its trigger, restore consumer reads to the old target and run Talend only for uncovered intervals. Compare keys, values and rejects after replay. Rehearse this in staging with a partial-write failure and name the operator who owns the action.

Pitfall to avoid: Do not delete the Job export or overwrite the old target during a pilot. Avoid simultaneous writers and blind full reruns. If Talend used an external watermark or pre-job file move, preserve that state as part of rollback. A database table restored without its reject or audit output may still be incomplete.

###### Migration and integration questions

How do you migrate a Talend Studio Job to Hydra ETL?
Export the Job design and inventory components, schemas, context variables, rejection flows and schedules. Translate one bounded path into Hydra source, transformation, pipeline and destination files, then compare outputs from identical input snapshots.

How it works: Migration translates the selected Job’s behavior, not its visual layout. Component settings, schemas, contexts, expressions, rejected rows, scheduling and destination writes all matter. Hydra files should be created for a chosen path only after those parts have been inventoried and a baseline result saved.

Practical check: Export the Job, draw its data and control paths, select a supported linear slice and create Hydra source, transformations, pipeline and destination files. Validate strictly and run against a separate target. Compare accepted and rejected records by key across normal, edge and retry cases. Move one schedule after a documented acceptance review.

Pitfall to avoid: A successful first run does not establish parity for a tMap lookup, context resolution or second-run upsert. Do not remove Talend until operators can trace failures in the new reports and execute a rollback. If an unsupported component remains, explicitly keep it in the architecture rather than hiding it in a script.
Which Talend components map to Hydra transformations?
A simple tFilterRow may map to filter and a basic tAggregateRow to aggregate, subject to expression and type checks. Components such as tMap can combine mapping, joins and rejects, so they need an operation-by-operation review rather than a single replacement.

How it works: Some Talend components map conceptually to Hydra steps: filters to filter, aggregates to aggregate and simple field maps to select or calculate. The mapping is conditional on expression language, types, null behavior and component configuration. One Talend component may expand to several Hydra operations.

Practical check: For each component, write its input schema, output schema, exact expression, side effects and error path. Translate a single component chain and test rows at boundary values. Check whether a join changes cardinality and whether a cast rejects malformed input. Use a mapping table with “verified”, “retained” and “unsupported” statuses rather than a list of similar names.

Pitfall to avoid: Do not assume tMap equals select or tFileOutput equals a generic destination. Talend components can bundle lookup, DDL and transaction behavior. A superficially similar Hydra step may produce the right sample rows but fail on nulls or duplicates. Keep component-specific settings visible in the acceptance test and migration decision.
Can Hydra import a Talend Job automatically?
This guide does not claim an automatic Talend importer. A safe migration starts from documented component settings and observed output, then translates only behavior supported by the Hydra DSL.

How it works: An automatic import would need to understand Talend’s component graph, expressions, generated code, routines, contexts and side effects. The current guide describes a controlled translation workflow rather than claiming such an importer exists. Automation can assist with inventory, but it cannot by itself prove semantic equivalence.

Practical check: Treat any generated candidate as a draft. Compare its YAML with the exported Job and a component inventory, then run a fixture covering every branch. Have the Job owner approve the mapping of contexts, rejects and destination modes. Save the output diff and unresolved items before enabling the new path.

Pitfall to avoid: Do not accept syntactically valid YAML as proof that the Talend Job has been imported. A missing reject output or pre-job SQL command may not cause an immediate syntax error. Avoid sending production credentials or proprietary routines into an unreviewed conversion process. Keep the original Job deployable through the pilot.
How do Talend context variables map to Hydra parameters and secrets?
Separate public environment settings from credentials. Map non-secret values to Hydra parameters or environment configuration and credentials to a secret source, then test dev and production resolution independently.

How it works: Contexts may hold both public settings and secrets. Hydra parameters, environment configuration and secret references play different roles: a threshold may be a run parameter, a hostname an environment setting and a password a secret. The mapping must preserve how each value is resolved at runtime.

Practical check: Create a field-by-field table from Talend context name to Hydra placeholder or secret reference. Test dev and prod-like runs with different thresholds and targets, while redacting credentials. Confirm that an unset secret fails before data is written and that git status shows no local credential file. Pin the environment name in deployment commands.

Pitfall to avoid: Do not copy a context export wholesale into source control. A default Talend context value may point to production, and a Hydra job that silently falls back to it can write to the wrong system. Inspect every context use in tMap, pre-job components and custom routines, not just obvious database connections.
What happens to Talend reject rows during migration?
Do not discard them silently. Identify each reject connection and the conditions that send rows there, then reproduce or explicitly redesign the error output and compare accepted plus rejected row counts.

How it works: Rejected rows may be routed by a Talend component or tMap output with their own schema. During migration, they remain a data product if users inspect or replay them. A Hydra implementation must specify whether it quarantines a row, fails the batch or deliberately excludes it.

Practical check: Construct separate cases for parse failure, unmatched lookup, invalid business rule and database constraint error. Compare the original reject record, reason and timestamp with the candidate output. Reconcile every input ID to accepted, rejected or intentionally filtered. Write a correction-and-replay procedure for a rejected row before cutover.

Pitfall to avoid: A total row-count match can hide lost rejects if an unrelated duplicate offsets them. Do not merge all failure reasons into a generic log line when operators need to repair source data. If the DSL cannot express the required reject path, retain Talend for that part or add a separately tested quarantine stage.
Is Hydra ETL a replacement for Talend Data Integration?
Hydra can replace a bounded supported batch Job, but Talend has a broad component ecosystem and enterprise operations that may remain necessary. Decide Job by Job using connector coverage, mapping semantics and run controls.

How it works: Hydra can replace a bounded supported Talend data integration Job, not the entire Talend platform by default. Talend may supply specialized connectors, visual design, routines, governance and deployment controls that a particular team relies on. The migration decision must be Job-specific.

Practical check: Inventory the Job’s components and operational dependencies, then classify each as supported by Hydra, retained externally or unsupported. Run the same source snapshot through both paths and compare outputs, rejects, schema and recovery. Estimate the work to operate the replacement, including secret injection, scheduling and support. Keep Talend for Jobs whose essential components remain unmatched.

Pitfall to avoid: Do not decide from a feature checklist or a small CSV simulator. A component may be present in both products but handle retries or DDL differently. Avoid broad platform consolidation until several representative Jobs have passed their own acceptance tests. A mixed estate can be a deliberate and maintainable final architecture.
Can Talend and Hydra run side by side?
Yes. Talend can continue extracting from a specialized system while Hydra reads its landed file or table. Use separate output targets during the pilot and make the handoff contract explicit.

How it works: Side-by-side operation is useful for evaluation when each runtime writes to an isolated target. Talend can continue to own a specialized source or scheduler while Hydra executes a supported downstream ETL job. A durable table or file boundary makes the responsibilities clear.

Practical check: Freeze one input interval, run Talend to its existing target and Hydra to a staging schema, then compare sorted rows and schema. If Talend calls Hydra, propagate exit status and link reports. If both run from an external scheduler, define a completion dependency and batch ID. Test delayed upstream completion and one downstream failure.

Pitfall to avoid: Do not enable both schedules to write the published target or assume a fixed clock offset proves Talend has finished. Shared targets obscure attribution and create race conditions. Keep one writer per target and one owner for retrying each stage. Separate source extraction from downstream transformation when diagnosing a mismatch.
How do you compare Talend tMap with a Hydra job?
List every tMap input, output, expression, lookup and rejection condition. Build a small fixture that exercises every branch, then compare result rows and types after translating those parts into supported Hydra steps.

How it works: A tMap comparison must include all inputs, lookup joins, expressions and output branches. Hydra may express the logic as several steps or several jobs; a one-component-to-one-step mapping is rarely reliable. Join cardinality and reject behavior are especially likely to alter output rows.

Practical check: Build a branch coverage fixture: matched lookup, missing lookup, duplicate lookup, invalid expression input and each named output. Record Talend’s main and reject rows before translation. Create a rule-by-rule map to Hydra steps, then compare sorted outputs and types at each branch. Review any custom Java method called from tMap separately.

Pitfall to avoid: A duplicate lookup can multiply rows while aggregate totals look plausible. A missing lookup may become null rather than a reject. Do not infer equivalence from the accepted table alone, and do not collapse two Talend outputs into one Hydra destination without approval of the data-quality contract.
How should a Talend-to-Hydra cutover be tested?
Run the old Job and new Hydra job on the same frozen input, including empty values, malformed rows and duplicate keys. Compare data, rejects, logs, rerun behavior and downstream reads before moving the production schedule.

How it works: Cutover testing must cover more than initial output equality. It must establish that the Hydra path processes the same source interval, handles update keys and rejects, signals failures to the scheduler and can be restarted safely. Context resolution and production runner permissions are part of the test.

Practical check: Run parallel targets over several normal cycles and one edge-case batch. Compare rows, schema, rejects and logs by batch ID. Force a source failure, database outage and retry after partial write. Confirm the old Job and new Hydra path agree on accepted data and that operators can find the exact failing step. Approve one schedule switch only afterward.

Pitfall to avoid: Do not test only on a developer workstation or only with a valid file. The production runner may have different mounts, secrets and network routes. Avoid switching the consumer table and schedule simultaneously without a recorded rollback point. A green load with missing reject output is still a failed migration.
What is the rollback plan after replacing a Talend Job?
Keep the Talend artifact, contexts and scheduler configuration available. Stop the Hydra schedule, restore consumers to the original Talend output and replay only the input interval that was not already committed.

How it works: Rollback restores the old Job’s schedule, context and published destination while accounting for work already completed by Hydra. The original Job artifact and its target should be preserved through an observation window. A mixed target makes recovery harder, which is why pilots should write separately.

Practical check: Record the last Talend batch ID, Hydra first batch ID, target key count and consumer location before cutover. On failure, disable Hydra, point consumers to the old target and replay only missing intervals through Talend. Query updated keys and rejected rows before reopening downstream reads. Rehearse the plan in staging with one deliberately failed batch.

Pitfall to avoid: Avoid a blind rerun of the full Job after Hydra has already written some rows; append modes can duplicate data. Do not delete Talend contexts or routines before the rollback window closes. If pre-job SQL altered a shared table, account for that DDL change in the recovery plan as well as the row data.

Sources and method
The product descriptions were checked against the vendor references below and the Hydra DSL documentation. The comparison concerns the stated workflow, not all features or editions. The browser simulator is neither an engine run nor a performance benchmark.

Talend: components for Jobs ↗

Talend components for Jobs ↗

Talend contexts and variables ↗

Talend tSystem component ↗

02 / Try

#### Talend vs Hydra: sample pipeline

#### Same small batch, two definitions

Read 14 sample orders, keep amounts above 50, sum by status and sort by total. Right-click inside either editor or use ⋯ for its line actions. Edit the Hydra threshold to recalculate the result; the source threshold follows where the displayed example includes one. The browser models this fixture and does not run either product.

Browser simulation

TalendVisual data integration
⧉↓⬡⤢⋯

Talend Studio Job (visual component graph)

tFileInputDelimited (orders.csv)
→ tFilterRow (amount > 50)
→ tAggregateRow (group by status; sum amount)
→ tSortRow (total descending)
→ tFileOutputDelimited (by_status.csv)

This is a component map, not Talend source code.
CopyDownloadIllustrative example

Hydra ETLYAML job files
✓▶⇢⧉⤢⋯

# sources.yaml
sources:
orders:
type: csv
extract:
table: data/orders.csv

# pipeline.yaml
pipeline:
from: orders
to: report

# transformations.yaml
steps:
- cast:
mapping: { amount: float }
- filter:
expr: "amount > 50"
- aggregate:
by: [status]
agg:
total: { func: sum, col: amount }
- sort:
by: [total]
ascending: false

# destinations.yaml
destinations:
report:
type: csv
load:
table: data/by_status.csv
mode: replace
Run sampleResetCopyDownload textRunnable ZIP

Lines in these examples Talend / Hydra

Files representedConfiguration map / 4 Hydra files

Run scope14 browser-local rows

Line counts are live counts of the text shown above, not a product benchmark. The Talend pane is illustrative and is not executed. The Hydra pane shows four files in one editor for comparison; only the displayed cast, filter, aggregate and sort operations are simulated. “Download text” includes your edits; “Runnable ZIP” contains the original four files and input CSV, validated with Hydra 0.22.0.

##### Simulated run result
×

StatusTotal

×

03 / Integrate

#### Introduce Hydra in a Talend environment

Start with a reversible pilot. Keep the current system running until the new output and failure behavior are verified.

##### Before you change a schedule or destination

A Talend Job export or screenshots of every component and row link.

The input and output schema, context groups, secret sources and reject flow.

A representative fixture with valid and invalid records.

Hydra CLI installed on the host that will execute tSystem, if coexistence is the chosen route.

##### Step-by-step integration and migration

01

###### Document the Job graph

List components in run order, including pre- and post-job components, lookups, reject links and triggers. Record every expression and context variable. The first pilot should have one source, one main output and a simple deterministic transform.

02

###### Preserve Talend output

Run the current Job on a frozen input and save the main output, rejected rows, schema and Job log. Do not replace the Talend destination yet. These artifacts become the acceptance reference for Hydra.

03

###### Create a parallel Hydra job

Map the input to sources.yaml, the main transformation to transformations.yaml and the output to a separate destination. Reproduce casts and null handling explicitly. Use hdrctl validate --strict before the first run; then run against the same frozen input.

04

###### Compare row paths

Compare sorted output by business key, not display order. Reconcile row counts across accepted and rejected paths, numeric rounding, date parsing and duplicates. If Talend produces multiple outputs, build and test each target separately.

05

###### Integrate through tSystem if useful

For coexistence, leave Talend scheduling in place and add a tSystem component after the source handoff. Call hdrctl with an absolute path and verify that nonzero status fails the Talend Job. Keep the Hydra destination isolated until the comparison is clean.

06

###### Switch a single Job

Move only this Job’s trigger after several clean cycles. Map Talend contexts to Hydra environments and parameters, document the new secret source, and keep the original Job deployable for rollback.

##### Command for a Talend tSystem bridge

# Configure tSystem on the same host as the Hydra CLI.
# Command text (Linux example):
hdrctl validate /srv/hydra/orders --strict && hdrctl run /srv/hydra/orders
# Feed Hydra from a Talend staging file/table.
# Keep the output separate until row and reject counts match.

Adapt the paths, project files and credentials to your deployment. The runnable orders fixture ZIP is a safe starting point for the Hydra side; its local YAML was validated with Hydra 0.22.0.

##### Acceptance checks before cutover

Talend main and reject counts reconcile with Hydra outcomes.

The effective dev/test/prod values match the context mapping.

A Hydra failure produces a failing Talend Job status.

No secrets appear in YAML or logs.

The original Job remains deployable.

##### Rollback plan

Disable the new Hydra call or schedule, restore the Talend output link and rerun the preserved Talend Job on the affected batch. Keep the frozen fixture and original context configuration until the replacement has proven stable.

##### Practical pitfalls

A component graph is not a single YAML file: preserve connection and rejection semantics.

Review context variables and secrets independently.

Do not claim Talend components have one-to-one Hydra equivalents.

Build the pilot
Use the CLI reference to create and validate a project, then use the DSL guide for source, transformation and destination syntax.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Playground — slug: /playground/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

﻿

### Playground
no install needed
Guided Project

↗ Share⇩ Export

Examples 5–10 ready cases per source ▶ Run pipeline

Pipeline builderHide⌄

orders

CSV source

→

filter → aggregate → sort

3 transformations

→

out

CSV · replace

Ready

Sources

sources.yaml· where data comes fromgenerated
sources:
orders:
type: csv
connection: {}
extract:
table: ./data/orders.csv
batch_size: 100

transformations.yamledit me✓
Actions ⌄
↶UndoCtrl Z ↷RedoCtrl ⇧ Z

✓Validate document ✦Fix automatically

↗Open in Hydra Studio

＋ step ▾

transformations:
steps:
- filter:
expr: amount > 50
- aggregate:
by: [status]
agg:
total: { func: sum, col: amount }
orders: { func: count, col: order_id }
- sort:
by: [total]
ascending: false

Ctrl + Space autocompleteTab insertorders · source schema

pipeline.yaml· the job manifestgenerated
version: "1.0"
pipeline:
name: orders_pipeline
from: orders
to: out
transformations: transformations

destinations.yaml· where data goesgenerated
destinations:
out:
type: csv
connection: {}
load:
table: ./out/by_status.csv
mode: replace

Destinations live

Target — set by example, or pick type + mode

Output preview

Run output — CLI · API · StudioHide⌄

›_ CLI { } API ◧ Studio interactive

$↵ enter

POSTGET Send

// response appears here

simulator — coming next
The same job becomes a visual workflow on the Studio canvas. We'll design the Studio simulator in a later pass.
Open in Studio ↗

DiscussionHide⌄

Powered by GitHub Discussions — sign in with GitHub · 2 comments

PS

priya-s2 days ago

The type × mode picker is great — I didn't realise a CSV can't upsert until it got greyed out. Nice guardrail.

👍 7

HY

hydra-teammaintainer1 day ago

Thanks! That matrix comes straight from each connector's declared capabilities.

👍 4

you

Comment

✦Ask me :)
Ask Hydra · powered by HydraLMsimulated×

Send

⌫CutCtrl X □CopyCtrl C ▣PasteCtrl V

{ }Format YAML ✦Show suggestionsCtrl Space

×

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## VS Code extension — slug: /vscode/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Write manifests faster

### VS Code extension

Context-aware completion, live validation and ready-to-fill skeletons for the five Hydra manifests. The extension runs nothing: it speeds up authoring and flags structural mistakes. Cross-file consistency stays the job of hdrctl validate.

#### What you get

Three mechanisms

COMPLETION

##### Keys that match the context

The offered keys depend on where the cursor sits. A MySQL source offers host and port; a web_api source offers base_url and pagination. Enumerated values come with their explanation.

VALIDATION

##### Mistakes shown as you type

Unknown key, wrong type, value outside the allowed set, missing required field, unsatisfied conditional rule. Errors are underlined in the editor and listed in the Problems panel.

SNIPPETS

##### Skeletons instead of blank files

32 prefixes, all starting with h. Type hsrc-pg and press Tab to get a complete PostgreSQL source, then Tab through the fields. Fixed-value fields open a dropdown.

#### Before you start

Visual Studio Code 1.75 or laterCheck under Help then About

Python 3.9 or laterUsed to build the package, not to run the extension

The Hydra repositoryThe extension lives in VS Code Extension/

#### Pick a manifest

What the editor knows about each file

sources.yamldestinations.yamlpipeline.yamltransformations.yamlworkflow.yaml

jobs/orders/sources.yaml

sources:
src_orders:
type: mysql connection:
host: ${ENV:DB_HOST} port: 3306 database: ${ENV:DB_NAME} extract:
table: orders batch_size: 10000 # 10 to 100000

destinations:
dst_dwh:
type: postgresql load:
table: fact_orders mode: upsert key: [id] # required by upsert batch_size: 5000

version: "1.0" pipeline:
from: src_orders to: dst_dwh

steps:
- select:
columns: [id, amount, status]
- filter:
expr: "status == 'paid'"
- cast:
mapping:
amount: float # int float str bool date datetime

workflow:
name: "daily_sales_etl" trigger:
type: schedule cron: "0 8 * * *" # required by schedule steps:
- name: "extract" type: job job: "./jobs/extract" depends_on: []

Type first. Once type is set, the keys offered under connection change with it — host and port for a database, base_url and pagination for an API.

#### Install

Three steps, about two minutes

01

##### Install the YAML engine
30 SEC

The Red Hat YAML extension provides the language server that reads the Hydra schemas. VS Code installs it on its own, since it is declared as a dependency, but you can add it first.

Copy$ code --install-extension redhat.vscode-yaml

What you should see
The extension appears under Ctrl+Shift+X, or a message saying it is already installed.

02

##### Build the package
10 SEC

A .vsix file is a ZIP archive. The build script assembles it with the Python standard library, so neither Node, npm nor vsce is needed.

Copy# from the VS Code Extension directory $ python build_vsix.py

What you should see
The list of packaged files, then the path to install.

Package built: hydra-etl-0.1.2.vsix (42.0 KB, 12 entries)
extension/schemas/sources.schema.json
extension/snippets/hydra.json
...

[image: The extension directory in Windows Explorer, listing hydra-etl-0.1.2.vsix next to the schemas, snippets and examples folders.]

The file appears in the extension directory. Take the highest version — earlier builds are kept but only the latest matters.

03

##### Install the package
30 SEC

Install it from VS Code, never from the file explorer. Two routes lead to the same result — pick either.

###### A From the command line

Copy$ code --install-extension hydra-etl-0.1.2.vsix

Run it from the extension directory.

If code is not recognised, run Shell Command: Install 'code' command in PATH from the command palette first.

###### B From the Extensions panel

Open Ctrl Shift X.

Click the ... menu at the top of the panel.

Choose Install from VSIX… and pick the file.

[image: The Extensions panel overflow menu open in VS Code, with the Install from VSIX entry at the bottom of the list.]

Install from VSIX… sits at the bottom of the overflow menu.

Whichever route you took, reload with Ctrl Shift P, then Developer: Reload Window.

Trap
Do not double-click the .vsix in the file explorer: Windows hands it to the Visual Studio installer, which refuses it. Do not copy the folder into the extensions directory either — since VS Code 1.74 a directory missing from the registry is ignored at startup, silently.

What you should see
A notification confirming the installation, and the extension in the installed list.

04

##### Confirm it is active
15 SEC

Open Ctrl Shift X and search for Hydra.

Check the name, the version and the publisher on the card.

What you should see
HYDRA ETL, version 0.1.2, published by Bechir Bejaoui. The full identifier is Bechir Bejaoui.hydra-etl — it contains a space, so quote it when passing it to a shell.

[image: The HYDRA ETL extension card in the VS Code Extensions panel, showing version 0.1.2 and the publisher name, with the extension README open beside it.]

The card carries the red hydra mark. The pane on the right is this README, rendered by VS Code.

#### Test it

Five checks, about five minutes

Open the examples/ folder of the extension in VS Code. It ships correct manifests and a set of deliberately faulty ones, each error documented in a comment.

T1

##### Errors are caught
1 MIN

Open examples/invalid_examples/destinations.yaml.

Open the Problems panel with Ctrl Shift M.

Repeat with workflow.yaml and transformations.yaml.

What you should see
Sixteen entries in total, each pointing at the right line. The offending keys are underlined in the editor, and the file tab carries the error count.

[image: VS Code showing destinations.yaml with underlined keys, and the Problems panel below listing four schema errors with their line and column.]

Each entry names the schema that raised it and gives a line and column. Missing property "key" is the conditional rule on upsert firing.

[image: Right-click menu on a Problems panel entry, offering Fix and Explain.]

Right-clicking an entry offers Fix and Explain — these come from VS Code, not from the extension.

T2

##### Correct files stay silent
30 SEC

Open the four files under examples/valid_job/.

Open examples/valid_workflow/workflow.yaml.

Look at the Problems panel again.

What you should see
No entry at all. A warning here means the schema is stricter than the engine — worth reporting.

T3

##### Completion follows the context
1 MIN

This is the check that matters: it proves the conditional schemas are wired correctly.

In examples/valid_job/sources.yaml, replace type: mysql with type: web_api.

Delete the contents of the connection: block, keeping the key itself.

Put the cursor on an indented empty line below it and press Ctrl Space.

What you should see
Typing web on the type line already offers web_api. Once it is set, the keys under connection switch from host, port, database, user and password to base_url, auth and pagination.

[image: The sources.yaml editor with type set to web, and a completion popup offering web_api.]

Values are completed too, not just keys.

[image: The same file after switching to web_api, with the connection block now holding url, auth, type and key.]

The connection block now carries API keys instead of database ones.

T4

##### Snippets expand
1 MIN

Create an empty file named sources.yaml.

Type sources:

On a new line, press Esc, then type hsrc-pg and press Tab.

Press Tab again to move between fields.

Tip
The Esc matters. On an empty line the schema opens its own key suggestions, and that popup captures the Tab before the snippet does. Dismissing it first lets the prefix expand. Typing h then Ctrl Space lists all 32 prefixes.

What you should see
A complete PostgreSQL source, cursor on the source name. On the table or query field, a dropdown opens.

[image: A sources.yaml file with the prefix hsr typed, and the suggestion list showing the Hydra snippets, hsrc-pg highlighted as the PostgreSQL source.]

Every prefix starts with h, and each carries the manifest it belongs to.

T5

##### Schemas match the engine
1 MIN

The same checks, run without opening the editor. Useful in continuous integration.

Copy$ pip install jsonschema pyyaml
$ python examples/check_schemas.py

What you should see
Every schema valid, correct manifests clean, faulty ones caught.

=== 1. Schema validity ===
[ OK ] destinations.schema.json
...
PASSED — every check succeeded.

#### Expected errors

What the faulty examples advertise

FileErrorsOne of them

destinations.yaml4Missing property "key" — upsert needs one

transformations.yaml7"integer" is not one of int, float, str, bool, date, datetime

workflow.yaml5"cron" is a required property

#### Troubleshooting

The extension is not listed after installing

Copying the folder into the extensions directory no longer works. Since VS Code 1.74, extensions.json acts as the registry, and a directory missing from it is ignored at startup without any message.

Install through the .vsix instead, then remove the stray copy.

The VSIX installer refuses the file

The window titled VSIX Installer belongs to Visual Studio, not to VS Code. Windows opens it on double-click.

Close it and install from inside VS Code, through Install from VSIX or the code command.

No completion and no errors at all

The YAML language server has not taken over. Check the language mode in the status bar reads YAML, then reload the window once more — the server sometimes needs a second cycle to pick up schemas from a freshly installed extension.

Suggestions disappear while filling in a snippet

The extension sets editor.suggest.snippetsPreventQuickSuggestions to false by default. A workspace or user setting can override it.

A connector type is underlined but the job runs

Connectors supplied by a plugin are not part of the offered list. They are accepted without error, so this should not happen — report the case with the manifest.

#### Known limitations

Version 0.1.0

Validation is structural only. Whether pipeline.from matches a declared source, or a step directory exists, is checked by hdrctl validate.

The schemas were written from the Pydantic models by hand and may drift as the DSL evolves.

Plugin connectors do not appear in the offered types, though they are accepted.

Snippets apply to every YAML file. The h prefix keeps collisions rare.

#### Next

Read the grammar→Every manifest block the schemas are built from, field by field. Use the CLI→Validate, test and run what you just wrote in the editor. Build your first job→CSV in, two operations, CSV out — the complete guided example.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---
