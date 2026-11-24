# Evidence — start-a-project-with-a-webhook (Webhook trigger)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows, probe `run-probe-hook.bat` (log `block-hook.log`, data `hook-gen/`). Server on port 5688 in the probe, default 5678 in the lesson. HYDRA_HOME redirected. Token of the probe is a throwaway; the lesson shows `<token>`.

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | validate warns "secret 'hooks.deploy' is not set yet" then "Triggers valid" | EXPERIENCE | log #validate |
| E2 | `trigger token` stores secret, prints token once + URL; 2nd run refuses, `--rotate` hint | EXPERIENCE | log #token #token again |
| E3 | project.json id present at init (aa9187f9), `/api/projects/open` returns same id | EXPERIENCE | log #open |
| E4 | no token → 401 "token required…"; wrong → 401 "invalid token"; right → 202 {"trigger","status":"started","origin":"webhook"} ; Bearer works; unknown name → 404 | EXPERIENCE | log |
| E5 | history origins: manual (trigger fire, no token), webhook x2; ~2.4-2.7 s | EXPERIENCE | log #history |
| E6 | 503 when token never created | FACT (triggers.py) | not tested, stated |
| E7 | request data not passed to the project | FACT (triggers.py docstring) | not tested |
| E8 | watch does not run webhooks | FACT (list API `note`: "called through hdrctl serve") | `watch` not run with webhook |
| E9 | "do not expose serve to the internet" | OPINION (our recommendation) | — |
| E10 | open.json form of the call | EXPERIENCE (probe built the same body with ConvertTo-Json) | log #open |

Not tested: 503 answer, `--env` token, Studio Triggers tab, rate limits.
