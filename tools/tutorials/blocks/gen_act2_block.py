"""Lesson 'Other triggers' : slug run-triggers-with-hdrctl-watch."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

import html as _html
MOCK = _html.escape((R/"tools/tutorials/act2-gen/mock_services.py").read_text(encoding="utf-8").strip(), quote=False)
faq = [
 ("How do I call a URL from a Hydra ETL workflow?", "Add a step of type action with action webhook and the params url, method, headers and body. The step sends the request and succeeds when the server answers with a 2xx status. In our test on Hydra ETL 0.22 on Windows, a POST with a JSON body reached a local server in 0.1 seconds."),
 ("How do I write headers and body in the YAML?", "As text that holds JSON, for example headers: \"{\\\"X-Demo\\\": \\\"yes\\\"}\". Studio saves them that way. According to the source, a YAML object is accepted too, but we tested the text form only. The request always carries Content-Type: application/json."),
 ("What happens when the server answers 404 or is down?", "The step fails with the error of the HTTP client: HTTPError: HTTP Error 404: Not Found, or URLError with the connection error. The text of a connection error follows the language of your system."),
 ("How do I send an email from a workflow?", "Use action email with smtp_host, smtp_port, to, subject and body. It sends through an SMTP server. We tested it against a local test server on port 1025, and the message arrived with the right sender, recipient and subject."),
 ("Which parameters are required?", "url for a webhook and to for an email. Without them, hdrctl workflow run stops before the run with: action 'webhook' requires parameter 'url', or action 'email' requires parameter 'to'."),
]
HOOK_YAML = 'version: "1.0"\nworkflow:\n  name: wf-hook\n  trigger:\n    type: manual\n  steps:\n    - name: notify\n      type: action\n      action: webhook\n      params:\n        url: http://127.0.0.1:8099/hook\n        method: POST\n        headers: "{\\"X-Demo\\": \\"yes\\"}"\n        body: "{\\"event\\": \\"load_done\\", \\"rows\\": 14}"'
MAIL_YAML = 'version: "1.0"\nworkflow:\n  name: wf-mail\n  trigger:\n    type: manual\n  steps:\n    - name: send_mail\n      type: action\n      action: email\n      params:\n        smtp_host: 127.0.0.1\n        smtp_port: 1025\n        from_addr: hydra@example.test\n        to: team@example.test\n        subject: "Load finished"\n        body: "14 rows were written."'
s = common(27, "Actions 2", "Send a webhook and an email from a Hydra ETL workflow",
 "Two actions tell the outside world that a workflow ran: webhook calls a URL, email sends a message. Test both against a local server.",
 '<span class="mono">webhook, email</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "The <code>webhook</code> action sends an HTTP request to a URL, and the <code>email</code> action sends a message through an SMTP server. Both are steps of type <code>action</code>, and a refused call or a closed port fails the step.",
 "Start a local test server, send a webhook with a header and a JSON body, send an email, and read what each failure looks like.",
 "How do I send a webhook and an email from a workflow?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A project: <code>hdrctl init act2-demo</code>. Workflow files go in <code>act2-demo/workflows</code>.</li><li>Python, for the local test server. Nothing leaves your machine.</li>')
s += step(1, "Start a local test server", "Something to call.",
 ["Save the script below as <code>mock_services.py</code>, next to the project folder.", "Run it in a second terminal and leave it open."],
 "py mock_services.py",
 "<p>The script listens for HTTP on port 8099 and for SMTP on port 1025. It writes each HTTP request to <code>requests.log</code> and each email to <code>mail.txt</code>. It answers 404 on any path that starts with <code>/missing</code>.</p><pre class=\"cmd\">" + MOCK + "</pre>",
 "No output: the script waits.",
 "(nothing printed)")
s += step(2, "Send a webhook", "Write the step.",
 ["Create <code>workflows/wf-hook.yaml</code> with the content below.", "Run it."],
 "hdrctl workflow run workflows\\wf-hook.yaml",
 "<p><code>headers</code> and <code>body</code> are text that holds JSON. The method is POST unless you set another one.</p><pre class=\"cmd\">" + _html.escape(HOOK_YAML, quote=False) + "</pre>",
 "The step is OK. The success line has no message from the server.",
 "✓  Step 'notify' OK (0.1s)\n\n✅ Workflow 'wf-hook' completed in 0.1s — 1/1 steps OK")
s += step(3, "Check what the server received", "Read requests.log.",
 ["Open <code>requests.log</code>, written by the test server."],
 "type requests.log",
 "<p>The server received the header and the body, and the content type is JSON.</p>",
 "One line with the header and the body.",
 'POST /hook | X-Demo=yes | Content-Type=application/json | body={"event": "load_done", "rows": 14}')
s += step(4, "Read the webhook errors", "Four cases.",
 ["Change <code>url</code> to <code>http://127.0.0.1:8099/missing</code> and run it.", "Change it to a port nobody listens on, <code>8097</code>.", "Set <code>headers</code> to <code>\"{not json\"</code>.", "Remove <code>url</code>."],
 "hdrctl workflow run workflows\\wf-hook.yaml",
 "<p>The first three fail during the run. The last one is refused before the run starts. The text of the connection error is in the language of your Windows: ours was French, so we show only its first part.</p>",
 "Four different messages.",
 "✗  Step 'notify' FAILED: HTTPError: HTTP Error 404: Not Found\n✗  Step 'notify' FAILED: URLError: <urlopen error [WinError 10061] ...>\n✗  Step 'notify' FAILED: ValueError: Action webhook 'notify': 'headers' is not valid JSON (Expecting property name enclosed in double quotes: line 1 column 2 (char 1))\n\n❌ Invalid workflow: ...\n  - steps.0: Step 'notify': action 'webhook' requires parameter 'url'")
s += step(5, "Send an email", "Same shape, other action.",
 ["Create <code>workflows/wf-mail.yaml</code> with the content below.", "Run it."],
 "hdrctl workflow run workflows\\wf-mail.yaml",
 "<p>Without <code>smtp_host</code> and <code>smtp_port</code>, the action uses <code>localhost</code> and port 1025, according to the source. Add <code>username</code>, <code>password</code> and <code>use_tls: true</code> for a real server: we did not test them.</p><pre class=\"cmd\">" + _html.escape(MAIL_YAML, quote=False) + "</pre>",
 "The step is OK in about 1.5 seconds.",
 "✓  Step 'send_mail' OK (1.5s)")
s += step(6, "Check the email and its failures", "Read mail.txt.",
 ["Open <code>mail.txt</code>.", "Run a workflow without <code>to</code>, then one with a closed port."],
 "type mail.txt",
 "<p>The test server saved the sender, the recipient and the subject. The text of the body is encoded in base64, which is normal for an email in UTF-8. A missing <code>to</code> is refused before the run. A closed port fails the step.</p>",
 "Sender, recipient, subject, then the error cases.",
 "## mail from:<hydra@example.test>\n## rcpt to:<team@example.test>\nFrom: hydra@example.test\nTo: team@example.test\nSubject: Load finished\n\n❌ Invalid workflow: ...\n  - steps.0: Step 'send_mail': action 'email' requires parameter 'to'\n\n✗  Step 'send_mail' FAILED: ConnectionRefusedError: [WinError 10061] ...")
s += rules([("TIP", "Put a webhook or an email at the end of a workflow, or on a failure branch, so that you hear about a run without opening Studio."),
 ("TIP", "Use <code>${SECRET:name}</code> for a token in <code>headers</code> and for an SMTP <code>password</code>: see <a href=\"/studio/store-and-use-secrets-with-hdrctl\">Store and use secrets</a>. We did not test a secret in these two parameters."),
 ("TRAP", "A webhook step succeeds on any 2xx answer, and the answer is not shown. A failing business result behind a 200 is not detected."),
 ("TRAP", "<code>headers</code> must be valid JSON text: one missing quote fails the step with <code>is not valid JSON</code>."),
 ("TRAP", "The SSH action needs a remote machine. This lesson does not cover it.")])
s += tail([["Webhook", "action: webhook, params: url, method, headers, body"], ["Email", "action: email, params: smtp_host, smtp_port, to, subject, body"], ["Required", "url (webhook), to (email)"], ["Test", "local server on 8099 (HTTP) and 1025 (SMTP)"]],
 [["HTTPError: HTTP Error 404: Not Found", "The server has no such path", "Check the url"], ["URLError / ConnectionRefusedError", "Nothing listens on that host and port", "Start the server, or fix host and port"], ["'headers' is not valid JSON", "The text is not a JSON object", "Write it as {\"Name\": \"value\"}"], ["requires parameter 'url' / 'to'", "A required parameter is missing", "Add it in params"]],
 faq, REL + '<li><a href="/studio/log-python-and-shell-actions">Log, Python and shell actions</a></li><li><a href="/studio/start-a-project-with-a-webhook">Start a project from a webhook</a></li><li><a href="/studio/resolve-conflicts-and-recover">Resolve conflicts and recover</a></li>',
 "Two actions that reach outside the workflow. Not covered here: SSH, and a real SMTP server with a login.",
 '<a class="primary" href="/studio/log-python-and-shell-actions">Back to Actions 1 <span aria-hidden="true">→</span></a>') + CTA
publish(27, "notify-with-webhook-and-email-actions", "Actions 2", s,
 "Send a webhook and an email from a Hydra ETL workflow", "Send a webhook and an email from a Hydra ETL workflow", "Hydra Webhook and Email Actions in a Workflow | Hydra ETL",
 "Call a URL with the webhook action and send a message with the email action, test both locally and read the errors. Tested with Hydra ETL 0.22.",
 ["Start a local test server", "Send a webhook", "Check what the server received", "Read the webhook errors", "Send an email", "Check the email and its failures"], faq,
 "Webhook and email actions", "Call a URL and send an email from a workflow, test both against a local server and read the errors.")
