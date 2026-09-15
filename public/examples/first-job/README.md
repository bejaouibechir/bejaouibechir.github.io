# Hydra Studio first job

This package contains the four manifests and input data used by the `/firstjob` workshop.

## Project layout

Place the files in the Studio workspace with this structure:

```text
first-project/
├── data/
│   └── orders.csv
├── output/
├── jobs/
│   └── first-job-example/
│       ├── sources.yaml
│       ├── destinations.yaml
│       ├── transformations.yaml
│       └── pipeline.yaml
└── workflows/
    └── first-workflow/
```

The job reads twelve orders, keeps paid orders with a positive amount, normalizes the region, and writes eight rows to `output/orders_clean.csv`.
