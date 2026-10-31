"""Compare the output CSV with the expected schema and values."""
import csv
from decimal import Decimal
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
COLUMNS = ["order_id", "customer_name", "city", "amount", "tags"]


def read_rows(path):
    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames != COLUMNS:
            raise ValueError(f"Expected columns {COLUMNS}; got {reader.fieldnames}.")
        rows = []
        for row in reader:
            if None in row or any(row.get(key) in (None, "") for key in COLUMNS):
                raise ValueError("Missing or extra CSV fields.")
            tags = json.loads(row["tags"])
            if not isinstance(tags, list) or not all(isinstance(tag, str) for tag in tags):
                raise ValueError("tags must contain a JSON array of strings.")
            rows.append((row["order_id"], row["customer_name"], row["city"],
                         Decimal(row["amount"]), tags))
        return rows


def verify(path=None):
    path = path or ROOT / "outputs/paid_orders.csv"
    if read_rows(path) != read_rows(ROOT / "expected/paid_orders.csv"):
        raise ValueError("Output values or row order differ from the expected paid orders.")
    print("PASS: three paid orders, nested fields and JSON arrays match.")


if __name__ == "__main__":
    try:
        verify()
    except (OSError, ValueError, ArithmeticError) as error:
        sys.exit(f"FAIL: {error}")
