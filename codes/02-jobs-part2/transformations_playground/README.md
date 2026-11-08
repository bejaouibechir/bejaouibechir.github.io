# Transformations playground

Companion example for **GITHUB gh-02-04** in `02-jobs-part2.md`.

The 20 folders in `jobs/` demonstrate the 20 Hydra DSL transformation operations. Every job reads the same `data/orders.csv`. The main data contains the four orders from the article, with `created_at`, `tags`, and `tax` added for operations that need them. The first country has surrounding spaces so `trim` is visible. The fourth amount is empty. `join`, `merge`, and `union` additionally read a small secondary CSV in `data/`.

Each job has its own four Hydra YAML files and writes `jobs/<operation>/outputs/result.csv`. Its reference output is `expected/<operation>.csv`.

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python scripts\compare.py
.\.venv\Scripts\python scripts\compare.py filter window
```

On Linux/macOS, use `.venv/bin/python` instead. To inspect a single job manually:

```powershell
.\.venv\Scripts\python -m hydra_etl.cli.hdrctl run jobs\filter
```

The CSV reader treats `amount` as text because one value is empty. Jobs using arithmetic, comparisons, sums or numeric ordering start with `cast: {mapping: {amount: float}}`. Some examples also use `trim` to remove source whitespace before grouping or comparing countries. These preparation steps precede the named operation in `transformations.yaml`.

`merge` uses complete update rows keyed by `id`; its secondary source includes one changed row and one new row. `join` uses customer IDs; `union` adds one order. The outputs are generated data and may display missing cells as `nan` under Hydra 0.19.1. The checker compares CSV headers and cell values with the recorded reference.

The reference outputs were captured from the installed Hydra ETL 0.19.1 package and reviewed for the example's key behaviors. No engine file is part of this example.