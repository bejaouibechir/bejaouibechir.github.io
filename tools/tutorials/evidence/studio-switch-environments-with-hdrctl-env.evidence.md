# Evidence — switch-environments-with-hdrctl-env (Environments)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows, probe `run-probe-envx.bat` (log `block-envx.log`, data `envx-gen/`). HYDRA_HOME redirected to `envx-probe/fake-home`: nothing written in the author's ~/.hydra.

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | `env set` without --env writes common file `env` | EXPERIENCE | log #set common |
| E2 | `env create prod` creates env.prod + environments/prod.yaml | EXPERIENCE | log #create prod |
| E3 | `env list` counts variables / parameter values / secrets | EXPERIENCE | log #list |
| E4 | `${ENV:NAME}` resolved in a log step; prod overrides common, common keeps REGION | EXPERIENCE | log #run default / #run prod |
| E5 | unknown `--env staging` falls back to common, no warning | EXPERIENCE | log #run unknown env |
| E6 | undefined variable fails step: "Missing environment variable: REGION" | EXPERIENCE | log #unset |
| E7 | `env unset` twice: "REGION is not defined for (common)" | EXPERIENCE | log |
| E8 | rename/delete move both files, backup in `_backups` of the home folder | EXPERIENCE | log #rename #delete #files |
| E9 | HYDRA_ENV selects an env | FACT (help text of `env list`, loader) | not run |
| E10 | HYDRA_HOME redirects the settings folder | FACT + EXPERIENCE | loader.py; all files landed in fake-home |

Not tested: Studio Environments panel, HYDRA_ENV, `${ENV:}` inside a job source, `--env-file`.
