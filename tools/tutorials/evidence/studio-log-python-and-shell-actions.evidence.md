# Evidence: Log, Python and shell actions (lesson 26, slug log-python-and-shell-actions)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows. Probe `probe-actions/` (`run-probe-actions.bat`, `probe-actions.log`).
| Item | Type | Proof |
|---|---|---|
| 11 actions list | FACT | Hydra profile (workflow/runner.py handlers) |
| Log / Python / PowerShell dialogs | EXPERIENCE | captures (Log, Python reused from lesson 04) |
| python params: script or file_path, working_dir, timeout default 60 | FACT | runner.py `_action_python` |
| validate OK; run: say_hello 0.0s, run_python 0.1s (Python 3.13.7), run_powershell 0.4s; 3/3 OK in 0.6s | EXPERIENCE | log + terminal capture |
| PowerShell dialog subtitle "Runs a PowerShell script (Windows)" | EXPERIENCE | capture |
| Bash action | NOT RUN | Windows only; see registry point 14 (WSL) |
| Job action | not covered | see lesson Compose jobs |
| On failure list default "fail (default)" | EXPERIENCE | capture; other choices not covered |
Hub row title/description updated. Build: 184 pages. Generator `blocks/gen_actions1_block.py`, spec `lessons/actions1/captures.json`, bat `run-block-act.bat`.
