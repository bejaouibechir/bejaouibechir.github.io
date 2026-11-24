# Evidence : bloc Fallback (n° 47, 48, 49)

Vérifié le 2026-11-23, Hydra ETL 0.22.0, projet `fallbackproject` (copie).

| ID | Affirmation | Type | Preuve |
|---|---|---|---|
| F1 | Fonctions et valeurs de `when` : liste fermée (file_exists, file_size, file_age, source_available, destination_available, url_ok, secret_defined, db.load, cdc.*, previous.rows, previous.status) ; unités 500ms/30s/5m/24h/7d et 10KB/5MB/1GB ; opérateurs and/or/not et comparaisons | FACT | `hydra_etl/workflow/conditions.py` (0.22.0) |
| F2 | `file_exist()` refusé : `unknown function file_exist() — use one of: …` ; `file_age()` : `takes 1 argument(s), got 0` | EXPERIENCE | `hdrctl run . --dry-run`, Linux |
| F3 | `on_probe_error` keep → `⚠ … fallback check failed (…); keeping wf_archive` ; replace → `↪ Fallback: wf_archive → wf_archive_alt — check failed: …` | EXPERIENCE | `hdrctl run .` des deux variantes, Linux |
| F4 | `on_failure: true` : `finalize` échoue, `share` et `build_report` défaits, `wf_report` remplacé par `wf_report_quarantine`, 3/4 workflows OK ; sans `on_failure` le projet échoue (`failed: wf_report`) | EXPERIENCE | Linux, `finalize.csv` renommé |
| F5 | Info-bulles Studio : on_failure (« nothing published … rollback: true »), timeout (« stopped at the next step or batch … Empty = no limit ») | FACT | `FallbackEditor.tsx`, `ThreadEditor.tsx` |
| F6 | `timeout: 5s` sur `wf_conflict` : `⏳ timed out after 5s — stopping at the next step or batch`, le pas `wait` dure 30,0 s, `build_report` défait, `failed (30.4s) … (changes undone)` | EXPERIENCE | Linux |
| F7 | `--use-fallback wf_load` : `forced (--use-fallback)`, puis `wf_report` bascule (`previous.rows = 8`) ; refus `has no fallback in workflows/thread.yaml` et `applies to a project … not to a single job` | EXPERIENCE | Linux |
| F8 | Captures et sorties Windows | EXPERIENCE | `block-fallback-47-49.log`, captures Edge (à contrôler) |
