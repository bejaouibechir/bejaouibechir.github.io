"""Check exact MySQL contents; uses the same interpreter as installed Hydra."""
import argparse
from decimal import Decimal
import json
from pathlib import Path
import sys
import time

import mysql.connector

ROOT = Path(__file__).resolve().parents[1]


def password():
    path = ROOT / ".hydra/secrets"
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("MYSQL_PASSWORD="):
            return line.split("=", 1)[1]
    raise ValueError("Copy .hydra/secrets.example to .hydra/secrets first.")


def connect():
    return mysql.connector.connect(host="127.0.0.1", port=3312, user="etl",
                                   password=password(), database="shop",
                                   connection_timeout=5)


def read_rows():
    connection = connect()
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT sku, name, unit_price, quantity FROM products ORDER BY sku")
        return cursor.fetchall()
    finally:
        connection.close()


def verify(phase):
    expected = json.loads((ROOT / "expected" / f"{phase}.json").read_text())
    expected_rows = [(r["sku"], r["name"], Decimal(r["unit_price"]), r["quantity"])
                     for r in expected]
    actual = read_rows()
    if actual != expected_rows:
        raise ValueError(f"Unexpected table contents. Expected {expected_rows!r}; got {actual!r}")
    for row in actual:
        print(row)
    print(f"PASS: {phase}; all {len(actual)} rows match exactly.")


def wait():
    deadline = time.monotonic() + 180
    last_error = None
    while time.monotonic() < deadline:
        try:
            # Also wait for initialization of the products table, not just ping.
            read_rows()
            print("Ready: the etl user can read shop.products.")
            return
        except mysql.connector.Error as error:
            last_error = error
            time.sleep(2)
    raise TimeoutError(f"MySQL initialization did not finish: {last_error}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("phase", choices=("wait", "before", "after"))
    args = parser.parse_args()
    try:
        wait() if args.phase == "wait" else verify(args.phase)
    except Exception as error:
        sys.exit(f"FAIL: {error}")
