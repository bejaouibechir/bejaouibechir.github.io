# csv_to_mysql_upsert

Companion example for **GITHUB gh-02-02** in **02-jobs-part1.md**.

Read a product CSV and upsert into MySQL, matching rows by `sku`.
The first run updates an existing product and inserts two new products.
Running the unchanged file again keeps exactly the same four rows.

## Differences from the article snippet

This approved runnable variant uses a **comma-separated CSV**, rather than the
article's semicolon-separated file. The inspected Hydra 0.19.1 connector still
ignores `connection.delimiter`; no engine code is patched here.

The job lives in `jobs/products`, so its source path is `../../data/products.csv`.
MySQL is exposed on localhost port **3312** to avoid an existing service on 3306.
Source and destination IDs, `mode: upsert`, and `key: [sku]` match the article.
No transformations file is needed for this direct copy.

## Files

- `jobs/products/`: sources, destinations, and pipeline YAML.
- `data/products.csv`: three input products.
- `docker-compose.yml` and `docker/init.sql`: dedicated MySQL 8.4 service and seed table.
- `.hydra/secrets.example`: template for the ignored local secrets file.
- `expected/`: exact before/after rows.
- `scripts/verify.py`: independent MySQL verification.
- `scripts/check_example.py`: real CLI validation, connection test, and two runs.

## 1. Install Hydra

Run commands from this example's root. Python 3.12 or newer and Docker Compose
are required. Use the same virtual environment for Hydra and the verification scripts.

Linux/macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .hydra/secrets.example .hydra/secrets
chmod 600 .hydra/secrets
```

Windows PowerShell (no activation required):

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .hydra/secrets.example .hydra/secrets
```

On Windows, use `.\.venv\Scripts\python.exe` for `python` and
`.\.venv\Scripts\hdrctl.exe` for `hdrctl` in the commands below.

The credentials are for this disposable local example only. The secrets template
matches the Compose configuration; `.hydra/secrets` is ignored by Git.

## 2. Start MySQL

```bash
docker compose up -d --wait --wait-timeout 300
python scripts/verify.py wait
python scripts/verify.py before
```

Initialization creates a primary key on `sku` and two initial products. MySQL's
upsert needs a matching primary/unique key; declaring `key: [sku]` alone does
not create that database constraint. Initialization runs only on an empty volume.

## 3. Validate and run

```bash
hdrctl validate jobs/products
hdrctl test jobs/products
hdrctl run jobs/products
python scripts/verify.py after
```

| SKU | Before | After first run |
| --- | --- | --- |
| SKU-001 | Notebook (old), 10.00, quantity 2 | Notebook, 12.50, quantity 4 |
| SKU-002 | Absent | Keyboard, 29.95, quantity 3 |
| SKU-003 | Absent | Mouse, 8.75, quantity 6 |
| SKU-099 | Legacy product, 5.00, quantity 1 | Unchanged |

## 4. Run the same file again

```bash
hdrctl run jobs/products
python scripts/verify.py after
```

The same four products remain. Existing keys are matched instead of duplicated.
Products absent from the CSV are retained; upsert does not replace the table.

For automated verification from the original seed state, use
`python scripts/check_example.py` instead of manually performing steps 3–4.
It refuses to accept an already modified baseline.

## Stop

```bash
docker compose stop
```

This preserves the database volume. To repeat from the original seed, use a new
disposable database; the scripts never silently reset existing data.
