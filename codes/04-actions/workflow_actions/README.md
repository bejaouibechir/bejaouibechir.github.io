# workflow_actions

Companion example for GITHUB gh-04-01 in 04-actions.md. One Hydra workflow declares all 11 actions and a CSV job. The default Linux run executes 10 actions; PowerShell is declared but disabled because Hydra runs Bash on Linux/macOS and PowerShell on Windows.

## Run on Linux or macOS with Python 3.12+ and Docker Compose

    python3 -m venv .venv
    . .venv/bin/activate
    python -m pip install -r requirements.txt
    docker compose up -d --wait
    python scripts/demo.py

The demo checks the CSV output, archive, Python result, HTTP request, captured email and SSH receipt. Mailpit's UI is at http://127.0.0.1:8025 and the request inspector is at http://127.0.0.1:8088/requests. All ports bind to localhost. The SSH password is disposable and only used by this local container.

On Windows, change workflows/all_actions.yaml by disabling archive_bash and enabling archive_powershell. The remaining actions are platform independent. Run the workflow with hdrctl run . after installing dependencies and starting Docker Compose. The supplied demo.py asserts the Linux selection and is intended for Linux/macOS.

Stop the services with docker compose down -v. Output files are ignored by Git.
