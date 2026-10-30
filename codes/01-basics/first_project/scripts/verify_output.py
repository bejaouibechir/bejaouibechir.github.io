"""Compare generated CSV data with the checked-in expected result."""
import argparse
import csv
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COLUMNS = ["id", "customer_id", "price", "qty", "total"]


def read_rows(path):
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames != COLUMNS:
            raise ValueError(f"{path}: unexpected columns {reader.fieldnames}")
        result = []
        for row in reader:
            if None in row or any(row.get(key) in (None, "") for key in COLUMNS):
                raise ValueError(f"{path}: incomplete or extra fields")
            result.append(tuple(Decimal(row[key]) for key in COLUMNS))
        return result


def verify(root=ROOT, environment="default"):
    name = "orders-prod.csv" if environment == "prod" else "orders.csv"
    actual = read_rows(root / "outputs" / name)
    expected = read_rows(root / "expected" / name)
    if actual != expected:
        raise ValueError(f"{name}: output differs from expected rows or row order")
    print(f"PASS: {name} matches all {len(expected)} expected rows.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--env", choices=["default", "prod"], default="default")
    args = parser.parse_args()
    try:
        verify(environment=args.env)
    except (OSError, ValueError, ArithmeticError) as error:
        parser.exit(1, f"FAIL: {error}\n")
