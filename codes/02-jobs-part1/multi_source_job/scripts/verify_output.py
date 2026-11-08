"""Verify column order, every row and amount, and left-join behavior."""
import csv
from decimal import Decimal
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
COLUMNS = ["order_id", "customer_id", "amount", "customer_name", "city"]


def read(path):
    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames != COLUMNS:
            raise ValueError(f"Unexpected columns in {path.name}: {reader.fieldnames}")
        return list(reader)


def verify():
    actual = read(ROOT / "outputs/enriched_orders.csv")
    expected = read(ROOT / "expected/enriched_orders.csv")
    if len(actual) != len(expected):
        raise ValueError(f"Expected five orders; found {len(actual)}.")
    for index, (row, wanted) in enumerate(zip(actual, expected), start=1):
        for column in COLUMNS:
            if column == "amount":
                matches = Decimal(row[column]) == Decimal(wanted[column])
            else:
                matches = row[column] == wanted[column]
            if not matches:
                raise ValueError(f"Row {index}, {column}: expected {wanted[column]!r}, got {row[column]!r}")
    print("PASS: five orders, correct enrichment, unmatched order retained, unused customer excluded.")


if __name__ == "__main__":
    try:
        verify()
    except Exception as error:
        sys.exit(f"FAIL: {error}")
