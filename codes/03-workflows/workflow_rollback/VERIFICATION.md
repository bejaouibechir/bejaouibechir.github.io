# Verification — GITHUB gh-03-01

Date: 2026-11-09. Local draft; no commit or push.

Tested with published hydra-etl[postgres] 0.19.1, PostgreSQL 16 in Docker Compose, and the real hdrctl CLI. The workflow and both jobs validated. The demo hid only data/payments.csv during the run, so the third job failed before publishing. Hydra reported automatic rollback: notify was undone by the cancel webhook, then load_invoices was undone by deleting its two appended rows. The webhook server observed /notify followed by /cancel. Both PostgreSQL tables contained their original (1, 100) row afterwards; the undo journal was absent; the payment CSV was restored. scripts/demo.py reported PASS.

The Compose database was started and became healthy locally. A published-site embedding and remote GitHub push have not been done. No Hydra engine files were modified.
