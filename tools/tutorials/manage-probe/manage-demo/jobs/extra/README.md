# Job: extra

Template: `csv`

## Files

- `sources.yaml` — where the data comes from
- `destinations.yaml` — where the data goes
- `pipeline.yaml` — which source feeds which destination
- `transformations.yaml` — DSL transformations (optional)
- `.env` — credentials (copy it from `.env.example` when present)

## Commands

```bash
hdrctl validate extra   # check the YAML files
hdrctl test     extra   # check the connections
hdrctl run      extra   # run this job alone
```
