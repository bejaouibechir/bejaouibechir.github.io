# Evidence — run-hydra-in-production-with-hdrctl-serve (vérifié le 24/11/2026, Hydra ETL 0.22.0, Windows)

| ID | Affirmation | Type | Preuve |
|---|---|---|---|
| E1 | `workflow validate` accepte `trigger: type: schedule` + `cron: "* * * * *"` | FACT | `block-prod.log` (« Workflow valid ») |
| E2 | `hdrctl serve --no-studio --port 5689 --workspace .\ws` : bannière « Studio disabled », API, Docs, Workdir | FACT | `block-prod.log` (serve log) |
| E3 | `POST /api/projects/open` {path, adopt} renvoie id, name, path | FACT | `block-prod.log` |
| E4 | `GET /api/health` : status ok, version 0.22.0, studio disabled | FACT | `block-prod.log` |
| E5 | 3 runs planifiés à 07:32:00, 07:33:00, 07:34:00 UTC, status success, trigger schedule | FACT | `GET /api/runs` |
| E6 | Runs en mémoire, perdus au redémarrage | EXPERIENCE | registre point 21 (24/11) |
| E7 | `?workflow_name=` filtre | CLAIM (code `routers/runs.py`), non testé | dit dans la FAQ |
| E8 | Non testés : redémarrage/reboot, `--host`, proxy, fuseau du cron | UNVERIFIED | dit dans la leçon |
Probe : `run/run-probe-prod.bat` (`prod-gen/workflow1.yaml`, `prod-probe`). Première exécution : le remplacement PowerShell du workflow avait échoué (YAML invalide, message vu), refait par copie de fichier.
