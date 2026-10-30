# first_project

Runnable companion to **Hydra DSL Whitebook, Chapter 01**, placeholder **gh-01-02**.

This example follows the project layout created by `hdrctl init`, adapted to the chapter's `daily` workflow. It is not the untouched generated template.

## Setup

Install Python 3.10 or later. Copy this entire folder, including the hidden `.hydra/` directory. Open a terminal here.

```bash
python -m venv .venv
```

Activate the environment:

| Terminal | Command |
| --- | --- |
| PowerShell | `.venv\Scripts\Activate.ps1` |
| Windows Command Prompt | `.venv\Scripts\activate.bat` |
| macOS / Linux | `source .venv/bin/activate` |

```bash
python -m pip install -r requirements.txt
```

No database, Docker, credentials, or external service is required.

## Run the chapter's commands

Run every command from this folder.

```bash
# Run the job alone; check its four output rows.
hdrctl run jobs/job1
python scripts/verify_output.py

# Validate the project without executing its actions.
hdrctl run . --dry-run

# Run daily: load_orders, then notify.
hdrctl run .
python scripts/verify_output.py

# Apply the production parameter overrides.
hdrctl run . --env prod
python scripts/verify_output.py --env prod
```

The job casts numeric columns, keeps orders above `min_price`, calculates `total = price * qty`, and writes a CSV. The dependent log action records "Orders loaded."

| Environment | Filter | Output | Rows |
| --- | --- | --- | --- |
| Default | `price > 0` | `outputs/orders.csv` | 4 |
| `prod` | `price > 10` | `outputs/orders-prod.csv` | 2 |

`replace` mode prevents duplicate rows on reruns. Production writes a separate file.

## Files to explore

| Resource | Purpose |
| --- | --- |
| [.hydra/project.json](.hydra/project.json) | Project marker |
| [Data/orders.csv](Data/orders.csv) | Five input orders |
| [sources.yaml](jobs/job1/sources.yaml) | CSV input |
| [transformations.yaml](jobs/job1/transformations.yaml) | Cast, filter, calculate |
| [destinations.yaml](jobs/job1/destinations.yaml) | Parameterized CSV output |
| [pipeline.yaml](jobs/job1/pipeline.yaml) | Source-to-destination connection |
| [daily.yaml](workflows/daily.yaml) | Chapter workflow |
| [thread.yaml](workflows/thread.yaml) | Workflow execution order |
| [parameters.yaml](parameters.yaml) | Defaults |
| [prod.yaml](environments/prod.yaml) | Production overrides |
| [expected/orders.csv](expected/orders.csv) | Expected default result |
| [expected/orders-prod.csv](expected/orders-prod.csv) | Expected production result |
| [verify_output.py](scripts/verify_output.py) | Output checker |

CSV paths are relative to `jobs/job1/`; the workflow's job path is relative to `workflows/`. Keep these folders together.

Only the project marker is versioned inside `.hydra/`. Generated outputs and local runtime files are ignored.

## Check the complete example

```bash
python scripts/check_example.py
```

This runs the chapter commands in a temporary copy, checks both outputs, repeatability, dry-run behavior, and rejection of an incorrect total.
