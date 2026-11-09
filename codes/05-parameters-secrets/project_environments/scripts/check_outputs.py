"""Compare the two environment runs with the committed expected CSVs."""
from pathlib import Path
import csv

root = Path(__file__).resolve().parents[1]

def rows(path):
    with path.open(newline="", encoding="utf-8-sig") as file:
        return list(csv.DictReader(file))

for name in ("filtered_dev", "filtered_prod", "published_prod"):
    actual = root / "outputs" / f"{name}.csv"
    expected = root / "expected" / f"{name}.csv"
    if not actual.exists():
        raise SystemExit(f"Missing output: {actual}")
    if rows(actual) != rows(expected):
        raise SystemExit(f"Mismatch: {actual} differs from {expected}")
    print(f"PASS {name}")

if (root / "outputs" / "published_dev.csv").exists():
    raise SystemExit("Dev should skip the publish_orders step")
print("PASS dev skips publishing")
