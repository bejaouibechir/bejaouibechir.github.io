# Evidence: Hydra Studio settings (lesson 31, slug global-and-project-settings)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows, `studio-course` on :5678. Source: `studio/src/pages/Settings.tsx`, `pages/settings/ProjectSettings.tsx`, `components/settings/{EnvironmentsManager,TriggersPanel}.tsx`.

| Item | Type | Proof |
|---|---|---|
| Global vs Project tabs; editor prefs in the browser, environments on the machine | FACT | Settings.tsx comment; page text |
| Data viewer rows (default 10, used by View data); job files sync (default 5 s) | EXPERIENCE | capture text |
| Environments: Common -> ~/.hydra/env, <name> -> ~/.hydra/env.<name>; ${ENV:NAME}; name rules; duplicates flagged | FACT + EXPERIENCE | EnvironmentsManager.tsx, card text |
| New environment box (opened, not saved) | EXPERIENCE | capture |
| Save / rename / delete of an environment | FACT (code), not run | EnvironmentsManager.tsx (delete keeps a copy in ~/.hydra/_backups) |
| Project settings: no-project state, header, 4 tabs, URL /settings/project/<id>?tab= | EXPERIENCE + FACT | captures, ProjectSettings.tsx |
| Execution order -> workflows/thread.yaml; Define/Preview/Check/Saved; stages, wait, max; Loops | EXPERIENCE | capture text |
| Parameters / Secrets / Triggers files and notes | EXPERIENCE | tab notes in captures |
| Triggers run under hdrctl serve or hdrctl watch, not both | CLAIM (panel text) | capture text |

Not modified: no environment, parameter, secret or trigger was created. Captures: `lessons/settings/captures.json`, `run/run-block-set.bat`. Generator: `blocks/gen_settings_block.py`. Build: 180 pages.
