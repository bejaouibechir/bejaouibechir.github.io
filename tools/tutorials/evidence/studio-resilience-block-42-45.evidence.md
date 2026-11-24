# Evidence — block R2 (lessons 42–45), verified 2026-11-23, Hydra ETL 0.22.0

Sources: SCENARIO.md of fallbackproject (Tests 7–11); runs on Linux (cloud container) and Windows (`evidence-resilience.log`, Python 3.13); Studio source (NodeConfigDialog.tsx, WorkflowEditor.tsx, RunDetail.tsx).

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | atomic default in replace mode: failure in batch 3 leaves `OLD,0`; `atomic: false` leaves 2001 lines; valid file gives 2501 | EXPERIENCE | Linux + Windows runs. Message differs: Linux `'abc'`, Windows `"abc"` (pandas); lesson shows Windows |
| E2 | CSV destination has no All-or-nothing list in Studio; DB destinations do (default/yes/no) | FACT | NodeConfigDialog.tsx `dest_csv` has only path + storage fields; atomic on dest_mysql etc. |
| E3 | rollback: `✓ build_report`, `✓ share`, `✗ finalize`, `↩ share undone`, `↩ build_report undone`, `(changes undone)`; report restored, share empty, no backup left | EXPERIENCE | Linux + Windows |
| E4 | validate refuses python action without undo; `undo: none` passes | EXPERIENCE | Linux + Windows |
| E5 | `hdrctl workflow undo` on a completed workflow: `Nothing to undo for 'wf_report'.` (does not undo a finished workflow; hub title corrected) | EXPERIENCE | Linux + Windows |
| E6 | Manual edit during wf_conflict wait: `not undone … changed after this run wrote it (size or date)`, journal `.hydra/undo/wf_conflict.json`, rerun refused (steps skipped + message), `workflow undo` stops again; removing the added line by hand did not clear it (date changed) | EXPERIENCE | Linux; Windows (journal, rerun, undo) |
| E7 | Studio: Rollback button (`Rollback on/off`), Undo section in action dialog (Not set / Nothing to undo / Run an action) | FACT | screenshots 43/44 |

To confirm before publication: none blocking. Not tested: undo with an action other than python; Studio run page "↩ Undo: …" row (not captured).
Fix applied during the block: hub entries for Rollback/Undo/Conflict carried fallback slugs (bug from gen_fallback_block.py) — corrected.
