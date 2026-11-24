# Evidence: Hydra Studio node palette: sources, transformations, destinations and actions (lesson 6, slug 04-use-the-palette)
Upgraded 2026-11-22 against Hydra ETL 0.22.0 (Studio source in the Hydra repository).

| ID | Statement | Type | Evidence | Status |
|---|---|---|---|---|
| E1 | Node counts: studio/src/lib/nodeRegistry.ts (13 source_*, 20 transform_*, 10 dest_*, 10 action category incl. Job) | FACT | Studio source | VERIFIED (source) |
| E2 | Workflow palette hides the Job action from Actions: NodePalette.tsx line 261-262 | FACT | Studio source | VERIFIED (source) |
| E3 | Screenshots of this lesson | EXPERIENCE | taken with Hydra ETL 0.17 era Studio | TO REDO (capture_studio.py) |
| E4 | Step-by-step UI wording kept from the previous version | EXPERIENCE | not re-run in the 0.22 UI | MANUAL, to re-check while retaking screenshots |
# Lesson 04 — Use the palette — evidence (2026-11-23)

Environment: Windows, Hydra ETL 0.22.0, Studio on :5678, project `studio-course` (two-jobs stage).
Source of truth: `Hydra/studio/src/components/canvas/NodePalette.tsx` (categories, counts, default open state).

| Item | Type | Proof |
|---|---|---|
| Palette counts: workflow scene Actions 9, Control Flow 2, Containers 3, Jobs (n), Projects 24; job scene Sources 13, Transformations 20, Destinations 10 | EXPERIENCE | captures `palette-*-collapsed-*` |
| Action dialogs (Log, Webhook, Email, Python inline/file, SSH, Set Param, Assign Param) | EXPERIENCE | 8 dialog captures |
| Script transformation dialog | EXPERIENCE | `dialog-script-transformation-open-light` |
| Bash dimmed on Windows | EXPERIENCE | `palette-actions-expanded-workflow-light` (reused) |
| Bash/PowerShell platform split (Linux/macOS vs Windows) | FACT | runner.py, Hydra profile |
| Linux palette screenshot and Bash dialog | DROPPED | cannot be captured on Windows |

Capture spec: `lessons/04-use-the-palette/captures.json` (16 shots), run by `run/run-block-04.bat`.
Selector note: palette headers are `button` with label and count in separate spans; use `button:has(span:text-is("Label"))`.
Build: 176 pages, 23 images resolved, JSON-LD and FAQPage present.
