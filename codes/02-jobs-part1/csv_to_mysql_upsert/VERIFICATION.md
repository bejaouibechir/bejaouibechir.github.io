# Verification — GITHUB gh-02-02

Date: 2026-11-07. Status: **local integration passed; awaiting user review**.

## Tested environment

- Published hydra-etl 0.19.1, installed in an isolated Python 3.13 environment.
- MySQL 8.4 in Docker, with localhost port 3312.
- mysql-connector-python 26.10.0.
- Real Hydra CLI; no engine changes or substituted load implementation.

## Completed checks

1. Docker Compose configuration accepted; database initialized from docker/init.sql.
2. Authenticated connection as etl; the products table contained the two expected seed rows.
3. `hdrctl validate jobs/products` passed.
4. `hdrctl test jobs/products` passed.
5. First `hdrctl run jobs/products` succeeded:
   SKU-001 changed from Notebook (old), 10.00, quantity 2 to Notebook, 12.50, quantity 4;
   SKU-002 and SKU-003 were inserted; SKU-099 remained unchanged.
6. Second run of the unchanged CSV succeeded and retained exactly the same four rows.
7. The independent verifier compared all SKU, name, Decimal price, and quantity values.

## Deliberate differences from the article

The user approved a comma-separated CSV. The inspected local Hydra 0.19.1 code
still interpreted connection.delimiter set to a semicolon as a comma. This example
uses the default comma separator and does not patch that engine behavior.

The CSV path is relative to jobs/products, and the dedicated local MySQL port is
3312. These adjustments are documented in the README. The job retains src_products,
db_products, shop.products, mode: upsert, and key: [sku].

## Scope

The complete data path was tested locally from Windows against MySQL in Docker.
Linux/macOS README installation commands were not separately executed.
No Killercoda activity, Git commit, push, or article-placeholder replacement was performed.
Only the secrets template is included; the populated secret used for testing remains
outside the delivery directory.
