# Evidence : Declare a fallback workflow (n° 46)

Vérifié le 2026-11-23. Version : Hydra ETL 0.22.0. Projet : copie de `C:\data\fallbackproject` (`fallback-demo`).

| ID | Affirmation publiée | Type | Preuve | Statut |
|---|---|---|---|---|
| E1 | Un fallback se déclare dans `workflows/thread.yaml` : bloc `fallback` avec `use` et `when` sous le workflow | FACT | `fallbackproject/workflows/thread.yaml` ; YAML rejoué avec `hdrctl run . --dry-run` 0.22.0 (Linux, 2026-11-23) | OK |
| E2 | `hdrctl run . --dry-run` affiche `↪ fallback: wf_load_backup (if not file_exists('Data/orders.csv'))` et `✅ Dry run OK` | EXPERIENCE | Sortie reproduite (container Linux, 0.22.0) | OK |
| E3 | Fichier absent : `↪ Fallback: wf_load → wf_load_backup — file_exists('Data/orders.csv') = false (not found)`, puis `wf_load_backup (fallback, in place of wf_load)` | EXPERIENCE | Même run ; `orders_clean.csv` = 8 lignes de données | OK |
| E4 | Fichier présent : `wf_load` s'exécute, aucune ligne de fallback ; 20 commandes | EXPERIENCE | Même run (la sortie `-v` du projet complet donne `file_size = 247`) | OK |
| E5 | `hdrctl workflow list` marque `fallback of wf_load (runs only in its place)` | EXPERIENCE | Sortie sur le projet complet fallbackproject | OK |
| E6 | Interface : bouton bouée « Add a fallback: another workflow that runs in its place » ; liste « + add a workflow… » ; champ `when` (info-bulle « Checked just before the workflow starts. If true, the first replacement runs instead. ») ; onglets Define / Preview ; boutons Check / Save (« Saved ») ; case « also after a failure » = `on_failure` | FACT | Source Studio : `FallbackEditor.tsx`, `ThreadEditor.tsx` (dépôt Hydra) | OK |
| E7 | Un backup hors du thread ne tourne que remplaçant ; l'avertissement « writes to … instead of … » | FACT | Source `ThreadEditor.tsx` (info-bulle) ; sortie dry-run du projet complet | OK |
| E8 | Page de run : `wf_load_backup — fallback of wf_load`, badge `fallback · condition true`, `1 ok / 1` ; Check : `Ready: wf_load` ; Preview : bloc pointillé sous `wf_load` | EXPERIENCE | Captures Windows/Edge du 2026-11-23 (`run-project-fallback-badge`, `fallback-check-ready`, `fallback-preview-tab`) | OK |
| E9 | YAML écrit par Studio après Save : `fallback: use: [wf_load_backup]`, `when: "not file_exists('Data/orders.csv')"` ; sorties `hdrctl` sous Windows identiques à Linux | EXPERIENCE | `block-fallback.log`, `block-fallback-run.log` (Windows, 0.22.0) | OK |

Captures : `run\run-block-fallback.bat` → `public/tutorials/studio-declare-a-fallback-workflow/`, ensuite `wire_images.py`.
