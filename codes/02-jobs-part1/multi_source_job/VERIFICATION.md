# Verification — GITHUB gh-02-03

Date: 2026-11-08. Status: **local end-to-end checks passed; awaiting user review**.

## Environment

Published hydra-etl 0.19.1 in a new isolated Python 3.13 environment on Windows.
Pandas 3.1.1. No database, Docker service, secret, or engine modification required.

## Executed checks

- Actual `hdrctl validate .` passed.
- Actual `hdrctl test .` passed.
- Actual `hdrctl run .` passed twice.
- After each run, an independent CSV verifier checked column order, all five rows,
  every ID, customer name, city, and numeric amount.
- Both runs produced exactly the same expected result; replace did not accumulate rows.

## Verified join behavior

- Pipeline source: orders; destination: dwh_orders.
- The join references the declared customers source by ID, with key customer_id.
- C001 enriches both ORD-001 and ORD-003.
- ORD-004, referencing absent customer C999, is retained by the left join.
- Customer C004, which has no order, does not produce an output row.
- The output has customer_name and city fields supplied by the second source.

The initial test exposed literal nan text in CSV fields for the unmatched customer.
The final transformations.yaml includes an explicit fill_null operation replacing
those two missing values with empty strings. The final two-run check passed with
that operation. No output rewriting outside Hydra is used.

## Scope

The complete file-to-file path was tested locally on Windows using the published
package. Linux/macOS installation commands were not separately executed.
The helpers verify values rather than merely accepting a successful CLI exit.
No commit, push, or article-placeholder replacement is included.
