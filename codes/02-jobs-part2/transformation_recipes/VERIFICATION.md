# Verification — GITHUB gh-02-06

Date: 2026-11-08. Tested against the installed published hydra-etl 0.19.1 package in an isolated Python environment. All five jobs ran, and a second `scripts/compare.py` run passed **5/5** with complete CSV comparison and semantic assertions.

`days_without_sales` correctly returns the two store/day pairs lacking sales. `period_change` produces missing growth for each store's first month and 25%, -20%, 20% for later months. `running_share` uses an explicit numeric cast so the window calculations succeed on CSV input. No engine code changed. No commit or push was made.