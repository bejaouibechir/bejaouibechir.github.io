# multi_source_job

Companion example for **GITHUB gh-02-03**, chapter **02-jobs-part1.md**.

A single job declares two CSV sources. The pipeline selects **orders** as its main
flow. A **join** reads the additional declared source **customers** and enriches
each matching order. The destination ID remains **dwh_orders**; this self-contained
example writes a CSV, so it needs no database, Docker service, or secret.

## How the sources are connected

```yaml
# pipeline.yaml
version: "1.0"
pipeline:
  from: orders
  to: dwh_orders
```

```yaml
# First step in transformations.yaml
join:
  right: customers
  key: customer_id
  how: left
```

`right: customers` refers to the source ID in sources.yaml, not a filename.
Declaring a second source does not make the pipeline read two main flows.
Hydra applies transformations.yaml between orders and dwh_orders.

This is a job-level data transformation, not a workflow routing operation.

## Sample data

- Five orders, including two belonging to customer C001.
- Four customers, with unique customer_id values.
- Order ORD-004 references C999, which is absent from customers.
- Customer C004 has no orders.

A left join preserves ORD-004 with empty customer_name and city fields. C004
does not create an extra output row. The unique customer IDs make this a
many-orders-to-one-customer join; duplicate keys on the right could multiply rows.

The fill_null step explicitly converts missing customer fields to empty strings
before writing the CSV. Without that step, this tested CSV output contains the
literal text nan for the unmatched customer.

Both files use commas and text IDs, keeping the join-key types consistent.
The explicit batch size of 100 accommodates this small fixture.

## Install

Run commands from this folder, which is the job directory.

Linux/macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Windows PowerShell:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

On Windows, use `.\.venv\Scripts\python.exe` for `python` and
`.\.venv\Scripts\hdrctl.exe` for `hdrctl` below.

## Run and inspect

```bash
hdrctl validate .
hdrctl test .
hdrctl run .
python scripts/verify_output.py
```

The result is outputs/enriched_orders.csv:

| order_id | customer_id | amount | customer_name | city |
| --- | --- | ---: | --- | --- |
| ORD-001 | C001 | 49.90 | Alice | Paris |
| ORD-002 | C002 | 20.00 | Bob | London |
| ORD-003 | C001 | 15.50 | Alice | Paris |
| ORD-004 | C999 | 8.00 | | |
| ORD-005 | C003 | 0.00 | Carol | Lyon |

The select step fixes the output column order, and sort orders the rows by order_id.
The destination uses replace: repeating the job rewrites the same five-row result.

```bash
hdrctl run .
python scripts/verify_output.py
```

For automated validation, a connection test, and two actual runs:

```bash
python scripts/check_example.py
```

## Files

- sources.yaml: both declared sources.
- transformations.yaml: named-source left join, null handling, column selection, and sort.
- destinations.yaml: dwh_orders CSV destination.
- pipeline.yaml: one main source and one destination.
- data/: orders and customers fixtures.
- expected/enriched_orders.csv: exact expected output.
- scripts/: independent output verification and real CLI checks.
- VERIFICATION.md: tested version, results, and limitations.
