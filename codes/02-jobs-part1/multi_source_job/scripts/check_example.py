"""Exercise the real Hydra CLI twice, using the same sources and manifests."""
import os
from pathlib import Path
import subprocess
import sys

from verify_output import verify

ROOT = Path(__file__).resolve().parents[1]


def cli(*args):
    env = dict(os.environ, HYDRA_LANG="en", PYTHONUTF8="1", PYTHONDONTWRITEBYTECODE="1")
    result = subprocess.run(
        [sys.executable, "-B", "-m", "hydra_etl.cli.hdrctl", *args],
        cwd=ROOT, env=env, capture_output=True, text=True, encoding="utf-8",
        errors="replace", timeout=120)
    if result.returncode:
        raise RuntimeError(result.stdout + result.stderr)
    print("PASS: hdrctl " + " ".join(args))


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    try:
        cli("validate", ".")
        cli("test", ".")
        for number in (1, 2):
            cli("run", ".")
            verify()
            print(f"PASS: run {number}; five rows, no accumulated output.")
    except Exception as error:
        sys.exit(f"FAIL: {error}")
