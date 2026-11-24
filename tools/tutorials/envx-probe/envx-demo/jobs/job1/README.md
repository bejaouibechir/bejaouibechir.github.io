# Job: job1

Template: `csv`

## Files

- `sources.yaml` — where the data comes from
- `destinations.yaml` — where the data goes
- `pipeline.yaml` — which source feeds which destination
- `transformations.yaml` — DSL transformations (optional)
- `.env` — credentials (copy it from `.env.example` when present)

## Commands

```bash
hdrctl validate job1   # check the YAML files
hdrctl test     job1   # check the connections
hdrctl run      job1   # run this job alone
```
