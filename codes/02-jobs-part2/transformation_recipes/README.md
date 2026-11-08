# Transformation recipes

Companion example for **GITHUB gh-02-06** in `02-jobs-part2.md`. Five independent jobs answer the five questions in the Recipes section. Each job has `sources.yaml`, `transformations.yaml`, `destinations.yaml`, and `pipeline.yaml`; its sample inputs are under `data/`, and its expected output is under `expected/`.

| Job | Main CSV | Additional CSVs | Expected result |
| --- | --- | --- | --- |
| `latest_order` | `orders.csv` | — | One latest order per customer: IDs 3, 4, 5. |
| `period_change` | `revenue.csv` | — | Growth versus each store's previous month: 25%, -20%, 20%, with missing first-month growth. |
| `running_share` | `orders.csv` | — | Running amounts and cumulative share of each country total. |
| `days_without_sales` | `stores.csv` | `calendar.csv`, `daily_sales.csv` | S1 on Jan 2 and S2 on Jan 1 have no sale. |
| `clean_enrich_aggregate` | `contacts.csv` | `crm_accounts.csv` | Segment counts: premium 2, standard 1, unknown 1. |

The `running_share` job adds `cast: {mapping: {amount: float}}` before the article's window step. CSV data is read as text, and `cumsum` and `sum` need numeric values. The other recipes follow the article's operations. `days_without_sales` uses the article's `amount != amount` expression; it was tested with the installed Hydra ETL 0.19.1 package. The CSV writer renders missing numeric results as `nan` in the examples.

Install and compare all five jobs:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python scripts\compare.py
```

On Linux/macOS, use `.venv/bin/python`. To run a single job manually:

```powershell
.\.venv\Scripts\python -m hydra_etl.cli.hdrctl run jobs\days_without_sales
cat jobs\days_without_sales\outputs\result.csv
```

The generated files in `jobs/*/outputs/` are ignored by Git. The checker reruns Hydra, compares the complete CSV with its reference, and asserts the key business result for each recipe.