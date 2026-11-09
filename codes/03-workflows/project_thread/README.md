# project_thread

Companion example for GITHUB gh-03-02 in 03-workflows.md.

The project has five workflow files. Four are in the thread: load_referentials, load_sales, load_stock and build_reports. The fifth, load_sales_backup, is a fallback and stays outside the thread.

The thread has three stages. The middle stage runs sales and stock in parallel, then waits 200 ms before the reports stage. A loop replays the whole parallel stage twice, with a 100 ms pause between passes. load_sales has a one-second timeout and a fallback with on_failure: true.

## Runs

- Normal: sales_delay is 0.1 second. Sales and stock both succeed in each pass. The backup does not run. The final report workflow runs once.
- Timeout fallback: sales_delay is 1.5 seconds. Each sales pass times out before its second step. Hydra marks that pass recovered and runs load_sales_backup in the same slot. Stock still runs in parallel; build_reports runs after the loop and delay.

No database or external service is required. The demo writes runs/normal.json and runs/timeout_fallback.json with each workflow result and timing events.

## Run it (Python 3.12+)

Linux/macOS:

    python3 -m venv .venv
    source .venv/bin/activate
    python -m pip install -r requirements.txt
    python scripts/demo.py

Windows PowerShell:

    py -3 -m venv .venv
    .\.venv\Scripts\python.exe -m pip install -r requirements.txt
    .\.venv\Scripts\python.exe scripts/demo.py

Run from this example's root. The demo uses the installed Hydra 0.19.1 ProjectRunner and asserts the workflow order, parallel starts, loop, stage delay and timeout-triggered fallback. It changes only runtime parameter sales_delay; the YAML files remain unchanged.

For manual inspection, read workflows/thread.yaml, parameters.yaml and the five workflows. The parameter default is the normal 0.1-second case.
