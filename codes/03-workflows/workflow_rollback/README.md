# workflow_rollback

Companion example for GITHUB gh-03-01 in 03-workflows.md.

This three-step workflow uses rollback: true: load_invoices appends to PostgreSQL, notify calls a loopback webhook with an undo webhook, and load_payments is made to fail. Both database jobs declare load.key: [id], required for append rollback. The demo script temporarily renames payments.csv, runs the real Hydra CLI, verifies the cancel webhook and restored tables, then restores the CSV. No HTTP request leaves 127.0.0.1.

## Files

- workflows/rollback_demo.yaml: three ordered steps.
- jobs/: complete CSV to PostgreSQL jobs.
- data/: example input CSVs.
- docker-compose.yml and docker/init.sql: disposable PostgreSQL 16 and baseline rows.
- .hydra/secrets.example: credential template; secrets is ignored by Git.
- scripts/make_last_step_fail.py: arm or restore the last-step failure.
- scripts/demo.py: local webhook server, workflow runner and independent checks.
- expected/rollback.json: expected observable result.

## Run (Python 3.12+ and Docker Compose)

Linux/macOS:

    python3 -m venv .venv
    source .venv/bin/activate
    python -m pip install -r requirements.txt
    cp .hydra/secrets.example .hydra/secrets
    docker compose up -d --wait --wait-timeout 300
    python scripts/demo.py

Windows PowerShell:

    py -3 -m venv .venv
    .\.venv\Scripts\python.exe -m pip install -r requirements.txt
    Copy-Item .hydra/secrets.example .hydra/secrets
    docker compose up -d --wait --wait-timeout 300
    .\.venv\Scripts\python.exe scripts/demo.py

Run from this example's root. The Hydra workflow itself fails intentionally; the demo prints PASS only if both tables and the webhook are undone, the journal is absent and the CSV is restored. A second demo run should also pass.

To inspect before running: hdrctl workflow validate rollback_demo; hdrctl validate jobs/load_invoices; hdrctl validate jobs/load_payments.

After review, remove the disposable database with docker compose down -v. If a process stops before the CSV is restored, run python scripts/make_last_step_fail.py restore. If a journal remains, inspect it before hdrctl workflow undo rollback_demo.
