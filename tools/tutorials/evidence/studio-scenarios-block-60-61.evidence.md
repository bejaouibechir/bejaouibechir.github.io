# Evidence — block R3 (lessons 60–61), verified 2026-11-23, Hydra ETL 0.22.0

Runs: Linux (cloud container) and Windows (`block-scenarios-60-61.log`, evidence_scenarios.py). Studio run pages captured on Windows.

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | Dry run of the 4-workflow project: 3 fallback lines, 1 warning (quarantine writes elsewhere), `Dry run OK` | EXPERIENCE | Linux + Windows |
| E2 | Nominal run 4/4 OK; wf_flaky answers on attempt 3 (retry max 3, delay 1) in ~2.1 s | EXPERIENCE | Linux + Windows (2.4–3.1 s) |
| E3 | Retry visible as `WARNING [call_service] failed, retry n/3 in 1s` in the Studio step log; not in CLI project output | EXPERIENCE | run page capture; CLI |
| E4 | Orders missing: `↪ Fallback wf_load → wf_load_backup`, then `previous.rows = 8` switches wf_report | EXPERIENCE | Linux; Windows (backup + quarantine ran); Studio badges |
| E5 | Service down beyond retries: wf_flaky failed, `⏭ wf_archive — not run`, project failed | EXPERIENCE | Linux + Windows |
| E6 | finalize missing: `↩ share`, `↩ build_report`, `↯ … replaced by wf_report_quarantine`, project 4/5 OK | EXPERIENCE | Linux + Windows |
| E7 | timeout 3s + retry delay 4: `⏳ … timed out after 3s`, workflow failed, project failed | EXPERIENCE | Linux + Windows |
| E8 | wf_flaky placed before wf_report would make `previous.rows` = 0 and trigger the report fallback | EXPERIENCE | Linux (first design) |

Notes: Windows evidence log shows `?` for arrows and drops `↪`/`│` lines because of the pipe encoding of the evidence script, not the engine. To confirm: none blocking.
