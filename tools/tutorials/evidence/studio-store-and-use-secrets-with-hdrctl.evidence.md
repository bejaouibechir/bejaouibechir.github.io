# Evidence — store-and-use-secrets-with-hdrctl (Secrets)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows, probe `run-probe-sec.bat` (log `block-sec.log`, data `sec-gen/`). Values are made up.

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | `secret set --stdin`, `list` (name, scope, ••••••), file `.hydra/secrets` has name=value in clear | EXPERIENCE | log #set #list #file |
| E2 | `.gitignore` from `hdrctl init` lists .hydra/secrets and secrets.* | EXPERIENCE | log #gitignore |
| E3 | `${SECRET:api.token}` in log step: masked `[MASKED]` default | EXPERIENCE | log #run masked |
| E4 | hidden: "[1 line(s) hidden: they contain a secret]"; plain shows value + warning | EXPERIENCE | log |
| E5 | env var API_TOKEN wins over the file | EXPERIENCE | log #run env var wins |
| E6 | `--env prod` → `.hydra/secrets.prod`, run with --env prod reads it | EXPERIENCE | log #set prod #run prod |
| E7 | errors: Missing secret, not found in secrets, empty value | EXPERIENCE | log |
| E8 | 3-char value saved without error; MIN_LENGTH 4 for masking | EXPERIENCE (save) + FACT (masking.py) | log #short; masking not run |
| E9 | masking changes display only | FACT | masking.py docstring |
| E10 | SOPS / vaults | UNVERIFIED | not tested, named as not covered |

Not tested: use in a job source (connection), `hdrctl run --secrets-file`, sops.
