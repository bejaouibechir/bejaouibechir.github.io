# Evidence: Use the Hydra Studio bottom panel (lesson 7, slug use-the-bottom-panel)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows, project `studio-course` on :5678.
Source: `studio/src/pages/workflows/WorkflowEditor.tsx` (bottom panel ~l.2536-2610), `components/canvas/{CanvasToolbox,TerminalTabs,TerminalPanel,ParametersPanel,SecretsPanel}.tsx`.

| Item | Type | Proof |
|---|---|---|
| Toolbar button titled "Logs panel" opens the panel; Run opens it too | FACT | CanvasToolbox.tsx, WorkflowEditor.tsx (setLogsOpen) |
| Tabs LOGS, PARAMETERS, SECRETS, TERMINAL; close cross; splitter 120-520 px | FACT | WorkflowEditor.tsx; captures |
| LOGS empty message; SUCCESS/FAILED badge after a run | FACT + EXPERIENCE | capture (empty), code (badge) |
| PARAMETERS: help text, columns, Add parameter / Save, "No parameter yet." | EXPERIENCE | capture |
| parameters.yaml and environments/<env>.yaml | EXPERIENCE | help text in the tab |
| SECRETS: .hydra/secrets, ${SECRET:name}, env var UPPER_CASE wins, values never displayed | EXPERIENCE | help text in the tab |
| TERMINAL: tab "pwsh 1", +, close all, right-click Clear/Copy/Paste/Save | FACT + EXPERIENCE | TerminalTabs/Panel.tsx; capture |
| `hdrctl --version` -> hydra 0.22.0 / Hydra ETL Framework / Python 3.13.7 | EXPERIENCE | capture (prompt shortened with `function prompt`) |
| Shortcut opening the terminal from a Bash/PowerShell/SSH action node | FACT (code) | WorkflowEditor.tsx l.2245; not captured |
| Log content of a real run | NOT COVERED | see lesson "Review a run" |

Captures: `lessons/bottom-panel/captures.json`, `run/run-block-bp.bat`. Generator: `blocks/gen_bottom_panel_block.py`. Build: 178 pages.
