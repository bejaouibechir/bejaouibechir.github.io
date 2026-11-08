"""Run every Hydra transformation example and compare it with its recorded CSV."""
import argparse
import csv
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
JOBS = sorted(path for path in (ROOT / "jobs").iterdir() if path.is_dir())


def read_csv(path):
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        return reader.fieldnames, list(reader)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("jobs", nargs="*", help="Operation names; defaults to all 20")
    args = parser.parse_args()
    known = {job.name: job for job in JOBS}
    names = args.jobs or list(known)
    unknown = set(names) - set(known)
    if unknown:
        parser.error(f"Unknown operation(s): {', '.join(sorted(unknown))}")
    failures = []
    for name in names:
        job = known[name]
        result = subprocess.run(
            [sys.executable, "-B", "-m", "hydra_etl.cli.hdrctl", "run", str(job)],
            cwd=ROOT, text=True, capture_output=True, encoding="utf-8",
            env=dict(os.environ, HYDRA_LANG="en", PYTHONUTF8="1"), timeout=120,
        )
        actual = job / "outputs" / "result.csv"
        expected = ROOT / "expected" / f"{name}.csv"
        if result.returncode or not actual.exists():
            failures.append(name)
            print(f"FAIL {name}: Hydra exit {result.returncode}\n{result.stdout[-1200:]}\n{result.stderr[-500:]}")
        elif read_csv(actual) != read_csv(expected):
            failures.append(name)
            print(f"FAIL {name}: result differs from expected/{name}.csv")
        else:
            print(f"PASS {name}")
    print(f"{len(names) - len(failures)}/{len(names)} jobs passed")
    return bool(failures)


if __name__ == "__main__":
    sys.exit(main())