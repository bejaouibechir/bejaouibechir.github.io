# mongodb_schema

Whitebook companion: **GITHUB gh-02-01**, chapter **02-jobs-part1.md**.

**Status: blocked draft for local review.** Hydra 0.16.0 parses the source
`schema` but does not forward it to the MongoDB connector. This example must
not be presented as a working end-to-end job until that issue is resolved.
See [VERIFICATION.md](VERIFICATION.md).

## What the example demonstrates

Read the paid documents from `hydra_whitebook_02.orders` and write
`outputs/paid_orders.csv`.

| Declared field | Document path | Expected behavior |
| --- | --- | --- |
| `order_id` | `_id` | Rename the string identifier |
| `customer_name` | `customer.name` | Read a nested field |
| `city` | `customer.city` | Read a second nested field |
| `amount` | `total` | Read a numeric value |
| `tags` | `tags` | Encode the array as JSON text |

The explicit `mode: manual` makes the declared output columns easy to inspect.
Extra document fields are excluded. The source filter excludes the pending
order. The only transformation sorts by `order_id`, making the CSV repeatable.

The schema policies are declared but this example does not demonstrate drift
enforcement or compare policy modes.

## Files

- [sources.yaml](sources.yaml): connection, filter and schema.
- [destinations.yaml](destinations.yaml): CSV destination in replace mode.
- [pipeline.yaml](pipeline.yaml): source and destination IDs.
- [transformations.yaml](transformations.yaml): deterministic ordering.
- [data/orders.json](data/orders.json): four synthetic documents.
- [scripts/seed.py](scripts/seed.py): repeatable seeding without dropping the collection.
- [docker-compose.yml](docker-compose.yml): MongoDB 7 on localhost port 27019.
- [expected/paid_orders.csv](expected/paid_orders.csv): three expected output rows.
- [scripts/verify_output.py](scripts/verify_output.py): compare every output field.

## Install and inspect locally

Use Python 3.10 or later. Run commands from this folder.

```bash
python -m venv .venv
```

| Terminal | Activate |
| --- | --- |
| PowerShell | `.venv\Scripts\Activate.ps1` |
| Windows Command Prompt | `.venv\Scripts\activate.bat` |
| macOS / Linux | `source .venv/bin/activate` |

```bash
python -m pip install -r requirements.txt
python tests/check_offline.py
python scripts/check_schema_forwarding.py
```

The offline check tests Hydra's document normalizer directly. The forwarding
probe intercepts connector construction without connecting to MongoDB; it
currently exits with code 1 and explains the missing schema.

## Intended end-to-end run

**These steps require a Hydra release that passes the forwarding probe.**
The pinned version will need to be updated and the complete job retested.

```bash
docker compose up -d --wait
python scripts/seed.py
hdrctl run . --dry-run
hdrctl run .
python scripts/verify_output.py
```

The seed script updates only the four fixture IDs in the dedicated collection.
It refuses to proceed if unrelated documents are present. No collection or
database is dropped.

MongoDB has no authentication in this disposable local example and binds only
to `127.0.0.1`. No production data or credentials are needed.

Repeat the job and verification to check replace mode. To stop MongoDB while
retaining its data:

```bash
docker compose down
```

To remove this example's database volume as well:

```bash
docker compose down -v
```
