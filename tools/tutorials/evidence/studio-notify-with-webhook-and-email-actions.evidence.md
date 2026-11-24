# Evidence — notify-with-webhook-and-email-actions (Actions 2)
Verified 2026-11-24, Hydra ETL 0.22.0, Windows, probe `run-probe-act2.bat` (log `block-act2.log`, data `act2-gen/`, local server `mock_services.py` HTTP 8099 + SMTP 1025). Windows locale is French: connection-error text truncated in the lesson.

| ID | Claim | Type | Proof |
|---|---|---|---|
| E1 | webhook POST with headers/body (JSON text) OK in 0.1 s; server logged X-Demo=yes, Content-Type json, body | EXPERIENCE | log #wf-hook, #requests.log |
| E2 | 404 → "HTTPError: HTTP Error 404: Not Found" | EXPERIENCE | log |
| E3 | closed port → "URLError: <urlopen error [WinError 10061] …>" (FR text) | EXPERIENCE | log |
| E4 | headers invalid JSON → "'headers' is not valid JSON (Expecting property name…)" | EXPERIENCE | log |
| E5 | no url → "Invalid workflow … action 'webhook' requires parameter 'url'" before run | EXPERIENCE | log |
| E6 | email via local SMTP: OK 1.5 s; sender/recipient/subject received, body base64 UTF-8 | EXPERIENCE | log #mail.txt |
| E7 | no `to` → "action 'email' requires parameter 'to'"; closed port → ConnectionRefusedError | EXPERIENCE | log |
| E8 | defaults localhost:1025; username/password/use_tls | FACT (runner.py) | not tested |
| E9 | YAML objects accepted for headers/body | FACT (runner.py comment) | not tested |
| E10 | `${SECRET:…}` in headers/password | UNVERIFIED | hedged in text ("did not test") |
| E11 | SSH | NOT COVERED | stated |

Hub row: label kept "Actions 2", title/description overwritten by publish() (Webhook and email actions).
