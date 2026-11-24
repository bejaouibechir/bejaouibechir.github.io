# Evidence — handle-step-failures-with-on-failure (52) et retry-a-failing-step-with-retry (53) — 24/11/2026, Hydra ETL 0.22.0, Windows

| ID | Affirmation | Type | Preuve |
|---|---|---|---|
| E1 | `on_failure: fail|skip|continue` ; défaut fail ; valeur inconnue : « Input should be 'fail', 'skip' or 'continue' » | FACT | `block-scope.log` (bad-onfail), `workflow/models.py` |
| E2 | fail : independent OK, boom FAILED, after_boom et later skipped ; skip : later OK, after_boom skipped ; continue : tout sauf boom OK | FACT | `block-scope3.log` |
| E3 | skip et continue : « FAILED … — None », exit 1 (succès = tous les steps réussis) | FACT (observé) + code `runner.py` (`all_success`) | `block-scope3.log` — **à signaler côté produit ? (registre 33)** |
| E4 | retry `{max, delay, backoff: fixed|exponential}` ; clé inconnue : « unknown key 'mx' — did you mean 'max'? Valid keys: backoff, delay, max » | FACT | `block-scope.log` |
| E5 | retry-ok (échoue 2 fois, max 3, delay 1) : OK, 2,6 s ; giveup (max 2, delay 1) : FAILED 2,4 s ; backoff exponentiel : FAILED 3,3 s | FACT | `block-scope.log` |
| E6 | Journaux des essais (« failed, retry 1/3 in 1s », « succeeded after 2 retry(ies) ») visibles par `GET /api/runs` ; la CLI n'affiche que la dernière sortie | FACT | `block-scope2.log` |
| E7 | max = re-tentatives après le premier échec | CLAIM (commentaire `models.py`) cohérent avec E6 | — |
| E8 | Error Scope / Retry Scope de Studio recopient `on_failure` / `retry` sur les steps contenus | CLAIM (`workflowSerializer.ts`), glisser-déposer non testé | dit dans les leçons |
| E9 | Non testés : retry d'un step `job`, `on_failure` d'un step job, message « gave up after N retry(ies) » | UNVERIFIED | non publié |
Probes : `run-probe-scope.bat`, `run-probe-scope2.bat` (`scope-gen/wf/*`). Piège : lire les journaux PowerShell `Out-File` : glyphes en mojibake (lecture UTF-8 → reconstruire les glyphes ✓ ✗ ⏭ ❌ ✅).
