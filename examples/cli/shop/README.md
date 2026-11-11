# shop — Hydra CLI example project

This small project accompanies the [Hydra CLI command reference](https://hydraetl.com/cli/). It uses local CSV files only. No database, server or credentials are needed for the basic commands.

## Contents

- `job1`: the starter CSV job created by `hdrctl init`.
- `load_orders`: reads four orders, keeps those at or above `min_amount`, and writes a CSV.
- `workflow1` and `daily_sales`: one job each, run in that order by `thread.yaml`.
- `environments/{dev,test,prod}.yaml`: thresholds of 0, 25 and 100. The default is 50.
- `triggers.yaml`: a `nightly` schedule and an `on_push` webhook. The webhook token is **not** included; create one with `hdrctl trigger token on_push` before using it.

## Try it

Extract the ZIP, then run these commands from the folder that contains `shop`:

```text
hdrctl list shop
hdrctl validate shop/jobs/load_orders --strict
hdrctl test shop/jobs/job1
hdrctl workflow validate daily_sales --project shop
hdrctl trigger validate --project shop
hdrctl run shop --env dev
hdrctl run shop --env prod -P min_amount=50
```

The two CSV outputs appear at `shop/jobs/job1/data/output.csv` and `shop/jobs/load_orders/data/filtered_orders.csv`. Runs use `replace`, so repeating them does not add duplicate rows.

The project already contains `daily_sales`, `load_orders`, `dev`, `test` and `prod`. To experiment with `add`, `create`, `rename`, `detach` or `remove`, use a new name or extract a fresh copy of the ZIP. `hdrctl trigger fire nightly --project shop` performs a real run. `hdrctl watch shop` stays active, waiting for the schedule; stop it with Ctrl+C.
