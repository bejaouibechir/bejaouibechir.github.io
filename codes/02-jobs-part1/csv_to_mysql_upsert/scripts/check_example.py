"""Run a real two-pass integration check against a fresh example database."""
import os
from pathlib import Path
import subprocess
import sys

from verify import verify, wait

ROOT = Path(__file__).resolve().parents[1]


def cli(*args):
    env = dict(os.environ, HYDRA_LANG="en", PYTHONUTF8="1", PYTHONDONTWRITEBYTECODE="1")
    for name in ("MYSQL_PASSWORD", "HYDRA_SECRETS_FILE", "HYDRA_ENV"):
        env.pop(name, None)
    result = subprocess.run(
        [sys.executable, "-B", "-m", "hydra_etl.cli.hdrctl", *args],
        cwd=ROOT, env=env, capture_output=True, text=True,
        encoding="utf-8", errors="replace", timeout=120)
    if result.returncode:
        raise RuntimeError(result.stdout + result.stderr)
    print("PASS: hdrctl " + " ".join(args))


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    try:
        wait()
        verify("before")
        cli("validate", "jobs/products")
        cli("test", "jobs/products")
        for number in (1, 2):
            cli("run", "jobs/products")
            verify("after")
            print(f"PASS: run {number}; updated values and no duplicate SKU.")
    except Exception as error:
        sys.exit(f"FAIL: {error}")
