# Verification

Tested locally with hydra-etl 0.19.1:

- hdrctl run . --env dev: filter_orders passed; publish_orders skipped.
- hdrctl run . --env prod: both jobs passed.
- python scripts/check_outputs.py: all three expected CSV comparisons passed; published_dev.csv was absent.
- hdrctl run . --env dev --param min_amount=100 --param env_label=dev_override: filtered output contained only ID 3.

The CSV amount column needs an explicit cast to int before the numeric filter; the example includes it. No Hydra engine file was changed.
