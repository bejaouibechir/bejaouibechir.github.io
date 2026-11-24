# Evidence — connect-claude-code-to-hydra-etl-with-mcp (maquette 62) — 24/11/2026, Hydra ETL 0.22.0, Windows, Python 3.13.7, mcp 2.3.0

| ID | Affirmation | Type | Preuve |
|---|---|---|---|
| E1 | `pip install "hydra-etl[mcp]"` dans un venv neuf : hydra-etl 0.22.0 + mcp 2.3.0 | FACT | `block-mcp.log` (pip show) |
| E2 | `hdrctl mcp setup` écrit `.mcp.json` à la racine du projet (« created »), affiche Python, Workspace, notes .gitignore ; seul fichier écrit (code `mcp/setup.py`) | FACT | `block-mcp.log` + code |
| E3 | Contenu de `.mcp.json` : `type: stdio`, command = python du venv, args `-m hydra_etl.mcp --workspace <projet>` | FACT | `block-mcp.log` |
| E4 | 2e exécution et exécution depuis `jobs/` : « unchanged » ; `--path nope` : « Folder not found: nope » | FACT | `block-mcp.log` |
| E5 | `.mcp.json` invalide jamais écrasé ; serveurs existants conservés | CLAIM (code), non testé | `setup.py` |
| E6 | Client stdio (SDK 2.3.0) : 21 outils, drapeaux read-only / destructive (delete, run_job, run_workflow = destructive) | FACT | `block-mcp2.log` |
| E7 | Chemin `../outside` et `C:/Windows` refusés (« REFUSED — Path outside the workspace… », « Absolute path refused… ») ; YAML invalide refusé ; delete refusé tant qu'un workflow utilise le job | FACT | `block-mcp2.log` |
| E8 | `hydra_run_job` sur job1 : 3 lignes lues, 2 écrites, `data/output.csv` | FACT | `block-mcp2.log` |
| E9 | delete déplace vers `.hydra/trash` ; write_job valide avant d'écrire ; mode HTTP sans authentification | CLAIM (code), non testé | `server.py` |
| E10 | Non testés : Claude Code lui-même (`claude`, `/mcp`, approbation), autres clients, mode HTTP, `.mcp.json` invalide | UNVERIFIED | dit dans la leçon |
Probes : `run-probe-mcp.bat`, `run-probe-mcp2.bat`, client `mcp-gen/mcp_client.py`. Aucun fichier de config utilisateur touché (`.mcp.json` dans `mcp-probe/mcp-demo` seulement).
