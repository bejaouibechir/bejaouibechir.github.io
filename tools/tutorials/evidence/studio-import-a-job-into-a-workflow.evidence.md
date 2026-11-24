# Evidence — import-a-job-into-a-workflow (maquette 22) — 24/11/2026, Hydra ETL 0.22.0, Windows, Studio (Edge, Playwright)

| ID | Affirmation | Type | Preuve |
|---|---|---|---|
| E1 | Menu Import → « Import a job » (« Select a job folder (4 YAML files) → add a node to the canvas ») | FACT | capture `import-menu-import-a-job-light.png` |
| E2 | Import d'un dossier à 4 fichiers : nœud `refunds-job` ajouté (3 nœuds), job listé dans la palette, sous-libellé `job_<nombre>`, petite icône rouge | FACT | `imp-probe.json`, capture `import-job-node-on-canvas-dark.png` |
| E3 | Dossier sans `transformations.yaml` : alert « Missing files at the folder root:\ntransformations.yaml », rien importé (3 nœuds avant/après le 2e import = 2 → 3 seulement avec le bon dossier) | FACT | `imp-probe.json` (`alert_broken`) |
| E4 | Save (projet neuf `imp-demo`) : `jobs/refunds-job` avec 4 fichiers réécrits (`version: '1.0'`, `connection: {}`, `pipeline.name`, `transformations: transformations`) ; `workflow1.yaml` reçoit le step `job_1795508669807` / `job: ../jobs/refunds-job` ; le dossier `data` n'est pas copié | FACT | `imp-save.json`, fichiers de `imp-probe/imp-demo` |
| E5 | Après ajout de `data/orders.csv` : `hdrctl validate` OK, `workflow validate` OK, run 2/2 steps OK en 2,0 s, `outputs/refunds.csv` écrit | FACT | `block-imp3.log` |
| E6 | L'icône rouge reste après Save, le workflow est « Valid » et s'exécute | FACT (capture `imp-saved.png`) | `imp-gen/imp-saved.png` |
| E7 | Seuls les 4 fichiers à la racine sont lus ; l'import ne persiste rien avant Save | CLAIM (code `WorkflowEditor.tsx`), « before Save » non testé sur disque | dit « according to the source » |
| E8 | Non testés : renommage du step, fermeture sans Save, import en scène Job, onglet du job importé dans Jobs configuration (la capture montrait first-job, retirée) | UNVERIFIED | non publié |
Probes : `run-probe-imp.bat` (import + alert), `run-probe-imp2.bat` (Save), `run-probe-imp3.bat` (run), `run-block-imp.bat` (captures, étape `upload_dir` ajoutée à `capture_studio.py`).
