# Evidence: Hydra Studio containers: Sequence, Error Scope and Retry Scope (lesson 39, slug 13-handle-failure)
Upgraded 2026-11-22 against Hydra ETL 0.22.0 (Studio source in the Hydra repository).

| ID | Statement | Type | Evidence | Status |
|---|---|---|---|---|
| E1 | on_failure fail|skip|continue and retry {max, delay, backoff}: workflowSerializer.ts (WorkflowStep, RetryPolicy); container exclusion; explicit child value wins (code comment) | FACT | Studio source | VERIFIED (source) |
| E2 | Screenshots of this lesson | EXPERIENCE | taken with Hydra ETL 0.17 era Studio | TO REDO (capture_studio.py) |
| E3 | Step-by-step UI wording kept from the previous version | EXPERIENCE | not re-run in the 0.22 UI | MANUAL, to re-check while retaking screenshots |
