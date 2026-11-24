
### Added

- **Snowflake destination** (`type: snowflake` in `destinations.yaml`): `append`, `replace` and `upsert`.
  - Every value is sent as text and converted by Snowflake into the type of the target column: no integer or
    decimal goes through a float (`NUMBER(p, s)`, `FLOAT`, `DATE`, `TIME`, `TIMESTAMP_NTZ` / `_TZ` / `_LTZ`,
    `VARIANT` / `OBJECT` / `ARRAY` from dict / list or JSON text, `BINARY`).
  - A missing table is created at the first batch, with types taken from the data (integers `NUMBER(38,0)`,
    decimals `NUMBER(38,s)`, datetimes with a time zone `TIMESTAMP_TZ`, dict / list `VARIANT`…). Simple column
    names are written without quotes, so Snowflake stores them in upper case (`order_id` → `ORDER_ID`).
  - Columns are matched with the table's columns regardless of case. Two columns of the data that only differ
    by case, or a column the table does not have, are refused with the list of the table's columns.
  - `replace` deletes and inserts in one transaction (all-or-nothing by default). `upsert` runs a `MERGE` on
    `load.key`: a row without a key value is refused (it would be added again at every run), and when a batch
    holds the same key twice the last row wins. The deletes of a PostgreSQL CDC source are applied.
  - Snowflake commits every DDL statement at once: when an all-or-nothing load fails, the table it created is
    dropped.
  - `rollback: true` in a workflow undoes a Snowflake load, as for the other databases.
- Studio — **Snowflake** destination node: account, key pair or password, warehouse, database, schema, role,
  table, mode, upsert key and all-or-nothing.
- MCP server — `hydra_list_connectors` lists Snowflake as a source and a destination.

### Changed

- Studio — **Global settings** and **Project settings** are displayed twice as large: the text (11 to 13 px)
  was hard to read, and the page had room to spare. On a narrow screen, the project header and the execution
  order wrap to the next line instead of overlapping.
