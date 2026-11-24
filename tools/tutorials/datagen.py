#!/usr/bin/env python3
"""Deterministic sample data for Hydra Studio tutorials (standard library only).

This file is copied next to each lesson's setup.py so a lesson folder is self-contained.

Command line:
    py datagen.py orders data/orders.csv --rows 20
    py datagen.py orders data/big_bad.csv --rows 2500 --bad-row 2200
    py datagen.py customers data/customers.csv --rows 12
    py datagen.py events data/events.json --rows 30
    py datagen.py sqlite data/shop.db
"""
from __future__ import annotations

import argparse
import csv
import json
import pathlib
import random
import sqlite3
from datetime import date, timedelta

CUSTOMERS = ["Acme Retail", "Blue Harbor", "Cedar Foods", "Delta Parts", "Evergreen Co",
             "Fjord Supply", "Granite Labs", "Harvest Moon"]
COUNTRIES = ["US", "CA", "GB", "DE", "FR"]
PRODUCTS = [("Notebook", 4.5), ("Desk lamp", 24.0), ("Backpack", 39.9), ("Headset", 59.0),
            ("Monitor stand", 32.5), ("Keyboard", 49.0)]
STATUSES = ["paid", "paid", "paid", "pending", "refunded"]


def _rng(seed: int) -> random.Random:
    return random.Random(seed)


def _ensure(path) -> pathlib.Path:
    p = pathlib.Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    return p


def orders_rows(rows: int = 20, seed: int = 42, start_id: int = 1001):
    r = _rng(seed)
    d0 = date(2026, 1, 5)
    for i in range(rows):
        product, price = r.choice(PRODUCTS)
        qty = r.randint(1, 6)
        yield {
            "order_id": start_id + i,
            "customer": r.choice(CUSTOMERS),
            "country": r.choice(COUNTRIES),
            "product": product,
            "quantity": qty,
            "unit_price": f"{price:.2f}",
            "amount": f"{qty * price:.2f}",
            "order_date": (d0 + timedelta(days=r.randint(0, 120))).isoformat(),
            "status": r.choice(STATUSES),
        }


def write_orders_csv(path, rows: int = 20, seed: int = 42, bad_row: int | None = None) -> pathlib.Path:
    """Write an orders CSV. `bad_row` (1-based data row) gets 'abc' as its quantity, to trigger a cast error."""
    p = _ensure(path)
    with p.open("w", newline="", encoding="utf-8") as f:
        w = None
        for n, row in enumerate(orders_rows(rows, seed), 1):
            if bad_row == n:
                row = dict(row, quantity="abc")
            if w is None:
                w = csv.DictWriter(f, fieldnames=list(row))
                w.writeheader()
            w.writerow(row)
    return p


def write_customers_csv(path, rows: int = 8, seed: int = 7) -> pathlib.Path:
    r = _rng(seed)
    p = _ensure(path)
    with p.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["customer", "country", "segment", "since"])
        for name in CUSTOMERS[:rows]:
            w.writerow([name, r.choice(COUNTRIES), r.choice(["retail", "wholesale"]),
                        (date(2022, 1, 1) + timedelta(days=r.randint(0, 900))).isoformat()])
    return p


def write_events_json(path, rows: int = 30, seed: int = 11) -> pathlib.Path:
    r = _rng(seed)
    p = _ensure(path)
    events = [{"event_id": i + 1, "user": f"user{r.randint(1, 9)}",
               "action": r.choice(["view", "click", "purchase"]),
               "value": round(r.random() * 100, 2)} for i in range(rows)]
    p.write_text(json.dumps(events, indent=2), encoding="utf-8")
    return p


def write_sqlite(path, orders: int = 40, seed: int = 42) -> pathlib.Path:
    """A small SQLite database with `customers` and `orders` tables."""
    p = _ensure(path)
    if p.exists():
        p.unlink()
    con = sqlite3.connect(p)
    con.execute("CREATE TABLE customers (customer TEXT PRIMARY KEY, country TEXT)")
    r = _rng(seed)
    con.executemany("INSERT INTO customers VALUES (?, ?)", [(c, r.choice(COUNTRIES)) for c in CUSTOMERS])
    con.execute("""CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer TEXT, country TEXT, product TEXT,
                   quantity INTEGER, unit_price REAL, amount REAL, order_date TEXT, status TEXT)""")
    con.executemany(
        "INSERT INTO orders VALUES (?,?,?,?,?,?,?,?,?)",
        [(int(o["order_id"]), o["customer"], o["country"], o["product"], o["quantity"],
          float(o["unit_price"]), float(o["amount"]), o["order_date"], o["status"])
         for o in orders_rows(orders, seed)])
    con.commit()
    con.close()
    return p


def main(argv=None) -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("kind", choices=["orders", "customers", "events", "sqlite"])
    ap.add_argument("path")
    ap.add_argument("--rows", type=int)
    ap.add_argument("--seed", type=int)
    ap.add_argument("--bad-row", type=int)
    a = ap.parse_args(argv)
    kw = {k: v for k, v in (("rows", a.rows), ("seed", a.seed)) if v is not None}
    if a.kind == "orders":
        out = write_orders_csv(a.path, bad_row=a.bad_row, **kw)
    elif a.kind == "customers":
        out = write_customers_csv(a.path, **kw)
    elif a.kind == "events":
        out = write_events_json(a.path, **kw)
    else:
        out = write_sqlite(a.path, **({"seed": a.seed} if a.seed is not None else {}))
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
