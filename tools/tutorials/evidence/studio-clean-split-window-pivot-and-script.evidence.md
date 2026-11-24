# Evidence: Transformations 2 (/studio/clean-split-window-pivot-and-script/)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows. Log `block-tr2.log`; probe `run/run-probe-tr2.bat`; data `tr2-gen/`, working copy `tr2-probe/`.

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | clean (columns, case lower): 3 read / 3 written, spaces removed, lower case | EXPERIENCE | #t-clean |
| E2 | text_to_rows sep ";": 3 -> 5 rows, other columns copied unchanged (spaces kept) | EXPERIENCE | #t-split |
| E3 | window row_number, cumsum, lag(default 0) with partition_by/order_by after cast | EXPERIENCE | #t-window output |
| E4 | pivot sum: 4 -> 2 rows, columns named 1 and 2 | EXPERIENCE | #t-pivot |
| E5 | unpivot id_vars/var_name/value_name: 2 -> 4 rows, order m1 then m2 | EXPERIENCE | #t-unpivot |
| E6 | script vectorized total = qty*price: 25.0, 20.0, 17.5 | EXPERIENCE | #t-script |
| E7 | `import os` refused: "Step 2/2: script: 'import' interdit dans le code" (French message) | EXPERIENCE | #t-script-bad |
| E8 | clean without columns applies to all text columns | CLAIM (source comment), not tested | parser/transform.py |
| E9 | cumsum needs numeric; Window rules | CLAIM (window.py docstring); partly shown (cast first) | window.py |

Not covered/tested: trim, transpose, merge, union (multi-input), script mode `row`, DuckDB engine behavior, pivot with several aggfunc. No screenshots: text-only lesson.
