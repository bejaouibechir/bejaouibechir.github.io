# Evidence — configure-snowflake-bigquery-and-cdc-sources (vérifié le 24/11/2026, Hydra ETL 0.22.0, Windows)

| ID | Affirmation | Type | Preuve |
|---|---|---|---|
| E1 | `validate` accepte les 4 sources (Snowflake, BigQuery, PG CDC, MySQL CDC) sans serveur | FACT | `block-adv.log` |
| E2 | Snowflake, compte fictif : « connection failed … invalid peer certificate », 13,4 s (texte tronqué « … ») | FACT | `block-adv.log` |
| E3 | BigQuery : « driver is not installed… pip install "hydra-etl[bigquery]" », 1,6 s | FACT | `block-adv.log` |
| E4 | PG CDC port fermé : « database connection failed … Connection refused », 3,6 s, mot de passe en `***` | FACT | `block-adv.log` |
| E5 | MySQL CDC : même échec en 4,0 s, texte en français (langue de Windows) | FACT | `block-adv.log` |
| E6 | Prérequis serveur CDC (REPLICATION ; log_bin ROW/FULL) | CLAIM (docstrings des connecteurs), non testé | dit dans la FAQ |
| E7 | MongoDB : incohérence `table`/`collection` | EXPERIENCE (`block-adv.log`, `block-adv2.log`) | point 31, hors leçon sauf FAQ |
Probe : `run/run-probe-adv.bat` (`adv-gen/jobs/*`). Snowflake : la connexion tente le réseau vers l'hôte Snowflake même avec un compte fictif (pas de login abouti).
