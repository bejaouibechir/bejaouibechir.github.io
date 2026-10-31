# Verification - blocked draft

Checked on 2026-10-31 with the published Hydra ETL 0.16.0 package.

## Confirmed engine blocker

Command:

```bash
python scripts/check_schema_forwarding.py
```

Observed result (exit code 1):

```text
Hydra version: 0.16.0
Parsed schema mode: manual
Forwarded configuration keys: connection, extract, type
BLOCKED: the declared schema is not forwarded intact to the connector.
```

The real source parser accepts the schema. The real executor's
`_build_connector` method then forwards only `type`, `connection` and
`extract`. The test intercepts connector construction in memory to inspect
that boundary; it does not connect to a database or patch installed files.

Source inspection confirms that MongoDB defaults to `mode: auto` when
`schema` is absent. Consequently the declared field mappings in this job
cannot be relied on during a normal `hdrctl run .`.

This same omission is present in the local engine source reviewed. No engine
files were modified.

## Checks that passed

`python tests/check_offline.py` tests the actual document normalizer directly:

- Three paid documents normalize to the expected five columns.
- Nested customer name and city paths produce the expected strings.
- Arrays become valid JSON text, including an empty array.
- An extra source field is omitted from the declared output.
- Incorrect names, incorrect cities and missing records fail CSV verification.

The Python scripts parse successfully. README resource links resolve.
The Docker Compose configuration validates.

These are isolated checks. They do not constitute a MongoDB-to-CSV integration
test. The seed script, database startup and complete job remain untested against
a live MongoDB server.

## Scope and limitations

This example uses manual field declarations. It does not demonstrate hybrid
schema merging, array explosion, schema drift enforcement or field defaults.
Those behaviors need separate checks before being documented as working.

## Before publication

A separately authorized engine change must forward the complete source schema.
Then test the example with a published release containing that change, update
the dependency pin, run MongoDB and the seed script, execute the job twice, and
verify the CSV after each run. Confirm that reseeding retains exactly four
documents and that only three paid orders are exported.

Keep this resource marked as a draft and retain the Whitebook placeholder until
the author has reviewed a functioning example.
