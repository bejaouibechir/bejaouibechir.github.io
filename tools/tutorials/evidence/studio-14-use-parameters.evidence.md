# Evidence: Use parameters in Hydra Studio: Set Param and Assign Param (lesson 28, slug 14-use-parameters)
Upgraded 2026-11-22 against Hydra ETL 0.22.0 (Studio source in the Hydra repository).

| ID | Statement | Type | Evidence | Status |
|---|---|---|---|---|
| E1 | Set Param fails if it already exists: nodeRegistry.ts description | FACT | Studio source | VERIFIED (source) |
| E2 | {{ param:name }} syntax: kept from previous version; ExpressionBuilder references param placeholders | FACT | Studio source | VERIFIED (source) |
| E3 | Screenshots of this lesson | EXPERIENCE | taken with Hydra ETL 0.17 era Studio | TO REDO (capture_studio.py) |
| E4 | Step-by-step UI wording kept from the previous version | EXPERIENCE | not re-run in the 0.22 UI | MANUAL, to re-check while retaking screenshots |
