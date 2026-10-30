"""Run the chapter commands in a temporary copy of this example."""
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

from verify_output import ROOT, verify


def run(project, *args):
    environment = dict(os.environ, PYTHONDONTWRITEBYTECODE="1",
                       PYTHONUTF8="1", HYDRA_LANG="en",
                       HYDRA_ENV="", HYDRA_ENGINE="pandas")
    command = [sys.executable, "-B", "-m", "hydra_etl.cli.hdrctl", *args]
    result = subprocess.run(command, cwd=project, env=environment,
                            capture_output=True, text=True, encoding="utf-8",
                            errors="replace", timeout=60)
    if result.returncode:
        raise RuntimeError(f"{' '.join(args)} failed:\n{result.stdout}\n{result.stderr}")
    print(f"PASS: hdrctl {' '.join(args)}")


def check():
    with tempfile.TemporaryDirectory(prefix="hydra-first-project-") as directory:
        project = Path(directory) / "first_project"
        shutil.copytree(ROOT, project, ignore=shutil.ignore_patterns(
            ".venv", "__pycache__", "*.pyc", "outputs", ".env", ".env.*", "secrets"))
        (project / "outputs").mkdir()
        run(project, "run", ".", "--dry-run")
        if list((project / "outputs").iterdir()):
            raise ValueError("Dry run wrote an output file")
        run(project, "run", "jobs/job1")
        verify(project)
        run(project, "run", ".")
        verify(project)
        output = project / "outputs" / "orders.csv"
        initial = output.read_bytes()
        run(project, "run", ".")
        if output.read_bytes() != initial:
            raise ValueError("Repeated run changed the result")
        print("PASS: replace mode keeps repeated runs identical.")
        run(project, "run", ".", "--env", "prod")
        verify(project, "prod")
        if output.read_bytes() != initial:
            raise ValueError("Production run altered the default output")
        production = project / "outputs" / "orders-prod.csv"
        production.write_text(production.read_text().replace("80.0", "81.0"),
                              encoding="utf-8")
        try:
            verify(project, "prod")
        except ValueError:
            print("PASS: verification rejects an incorrect total.")
        else:
            raise ValueError("Verification accepted an incorrect total")
    print("PASS: all example checks completed; temporary data removed.")


if __name__ == "__main__":
    try:
        check()
    except (OSError, ValueError, RuntimeError, subprocess.SubprocessError) as error:
        sys.exit(f"FAIL: {error}")
