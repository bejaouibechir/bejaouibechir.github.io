# Verification — GITHUB gh-02-05

Date: 2026-11-08. Tested the published hydra-etl 0.19.1 package with the DuckDB extra in an isolated environment. The generator created exactly 5,000,000 rows (35,000,016 bytes). Hydra estimated 4,999,716 rows, above the default 2,000,000 threshold. `scripts/compare.py` passed **3/3**: auto selected duckdb, pandas selected pandas, duckdb selected duckdb. All three outputs exactly matched the expected four-country CSV: FR 12,500,000, BE 25,000,000, DE 37,500,000, ES 50,000,000; each country had 1,250,000 rows.

Tests used a separate scratch copy, leaving the delivery folder without the generated 35 MB CSV or run logs. No Hydra engine files were changed. No commit or push was made.