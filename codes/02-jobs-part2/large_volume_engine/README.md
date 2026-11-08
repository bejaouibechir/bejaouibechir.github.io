# Large-volume engine

Companion example for **GITHUB gh-02-05** in `02-jobs-part2.md`.

Three complete Hydra jobs read the same generated CSV and perform the same `cast` and `aggregate` steps. Only `transformations.engine` changes: `auto`, `pandas`, or `duckdb`. With the default five million rows, `auto` exceeds Hydra's two-million-row CSV threshold and selects DuckDB when its extra is installed. All variants must yield the same four country totals in `expected/result.csv`.

The generator writes rows incrementally, so it does not hold the dataset in memory. The generated 35 MB file is excluded from Git.

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python scripts\generate.py
.\.venv\Scripts\python scripts\compare.py
```

On Linux/macOS, use `.venv/bin/python`. To inspect or run a single variant:

```powershell
cat jobs\auto\transformations.yaml
.\.venv\Scripts\python -m hydra_etl.cli.hdrctl run jobs\auto --profile
```

`compare.py` runs each job with `--profile`, records its log in `jobs/<engine>/output/profile.log`, checks which engine Hydra selected, compares every result cell with `expected/result.csv`, and checks that all three outputs agree. To compare one or two variants, pass their names, such as `compare.py pandas duckdb`. Environment overrides `HYDRA_ENGINE` and `HYDRA_LARGE_VOLUME_ROWS` are cleared for the subprocess so this example tests the declared YAML and the default threshold.

The CSV source reads `amount` as text; the explicit `cast` makes the sum numeric. The profile shows engine choice and step timing. Execution time and memory use vary by machine; the example checks correctness and selection, not a speedup.