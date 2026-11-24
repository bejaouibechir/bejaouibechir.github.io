"""Lesson 'Other triggers' : slug run-triggers-with-hdrctl-watch."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

faq = [
 ("How do I start a Hydra ETL project from another system?", "Declare a trigger of type webhook, create its token with hdrctl trigger token NAME, run hdrctl serve, and call POST /api/projects/PROJECT_ID/triggers/NAME/webhook with the token in a header. In our test on Hydra ETL 0.22, a valid call answered 202 and the project ran in about 2.5 seconds."),
 ("Where do I put the token?", "In the header X-Hydra-Token, or in Authorization: Bearer. Both worked in our test. The token is stored as a secret named in the trigger, in .hydra/secrets of the project."),
 ("What answers do I get when the call is wrong?", "A call with no token answered 401, token required. A wrong token answered 401, invalid token. An unknown trigger name answered 404, no webhook trigger. We read the 503 answer, for a token that was never created, in the source and did not test it."),
 ("Can I send data with the webhook?", "According to the source, nothing from the request is passed to the project: the call only starts the run. We did not test sending a body."),
 ("Does the webhook trigger work with hdrctl watch?", "No. According to the list output, a webhook is called through hdrctl serve. hdrctl watch is for time, file and source triggers."),
]
s = common(55, "Webhook trigger", "Start a Hydra ETL project from a webhook",
 "A webhook trigger lets another system start your project with one HTTP call. Declare it, create a token, run hdrctl serve and call the URL.",
 '<span class="mono">hdrctl trigger token</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "A trigger of type <code>webhook</code> starts the project when another system sends <code>POST /api/projects/ID/triggers/NAME/webhook</code> with the right token. <code>hdrctl serve</code> must be running.",
 "Declare a webhook trigger, create its token, start the server, register the project, call the webhook with and without the right token, and read the history.",
 "How do I start a Hydra ETL project with a webhook?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed with the server extra. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A project: <code>hdrctl init webhook-demo</code>. The project id is in <code>.hydra/project.json</code>.</li><li><code>curl.exe</code> (Windows) or <code>curl</code>, to make the calls.</li>')
s += step(1, "Declare the trigger", "Name a secret for the token.",
 ["Create <code>triggers.yaml</code> at the root of the project with the content below.", "Run <code>hdrctl trigger validate</code>."],
 "hdrctl trigger validate",
 "<p>The <code>token</code> line does not hold a value: it names a <a href=\"/studio/store-and-use-secrets-with-hdrctl\">secret</a>. Until the secret exists, validation passes with a warning.</p><pre class=\"cmd\">version: \"1.0\"\ntriggers:\n  - name: deploy\n    type: webhook\n    token: ${SECRET:hooks.deploy}</pre>",
 "A warning, then <code>Triggers valid</code>.",
 "⚠  trigger 'deploy': secret 'hooks.deploy' is not set yet (hdrctl trigger token deploy)\n\n✅ Triggers valid — 1 trigger(s)")
s += step(2, "Create the token", "Copy it once.",
 ["Run the command below.", "Copy the token now: it is not shown again."],
 "hdrctl trigger token deploy",
 "<p>The command generates a token, stores it in <code>.hydra/secrets</code> as <code>hooks.deploy</code>, prints it once, and prints the URL to call. A second run refuses to overwrite it: add <code>--rotate</code> to replace the token.</p>",
 "The token on a line of its own, then the URL.",
 "✅ Token saved as secret 'hooks.deploy' in ...\\.hydra\\secrets\n  Copy it now, it is not shown again:\n\n    <your token>\n\n  Call (hdrctl serve running):\n    POST http://127.0.0.1:5678/api/projects/aa9187f9/triggers/deploy/webhook\n    X-Hydra-Token: <token>\n\n❌ Secret 'hooks.deploy' is already set\n  To replace it: hdrctl trigger token deploy --rotate")
s += step(3, "Start the server and register the project", "The webhook is served by hdrctl serve.",
 ["Start the server in a second terminal: <code>hdrctl serve</code>.", "Save <code>open.json</code> as shown below, then register the project with the second command."],
 "hdrctl serve\ncurl.exe -s -X POST -H \"Content-Type: application/json\" -d @open.json http://127.0.0.1:5678/api/projects/open",
 "<p>The server finds a project by its id. <code>/api/projects/open</code> registers an existing folder and returns its id: <code>aa9187f9</code> in our test, the same as in <code>.hydra/project.json</code>. Save this as <code>open.json</code> first, with the full path of your project (backslashes doubled):</p><pre class=\"cmd\">{\"path\": \"C:\\\\path\\\\to\\\\webhook-demo\", \"adopt\": true}</pre>",
 "A JSON answer with the id, the name and the path.",
 "{\"id\":\"aa9187f9\",\"name\":\"webhook-demo\",\"description\":\"\",\"path\":\"C:\\\\...\\\\webhook-demo\",\"created_at\":\"2026-11-24T06:56:37.880118+00:00\"}")
s += step(4, "Call the webhook", "Send the token in a header.",
 ["Replace the id and the token in the command below.", "Run it."],
 "curl.exe -i -X POST -H \"X-Hydra-Token: <token>\" http://127.0.0.1:5678/api/projects/aa9187f9/triggers/deploy/webhook",
 "<p>The server answers at once, before the run ends: <code>202 Accepted</code> means the run started. You can also send <code>Authorization: Bearer &lt;token&gt;</code>; it worked the same in our test.</p>",
 "<code>HTTP/1.1 202 Accepted</code> and a JSON body.",
 "HTTP/1.1 202 Accepted\n\n{\"trigger\":\"deploy\",\"status\":\"started\",\"origin\":\"webhook\"}")
s += step(5, "Read the refusals", "Three wrong calls.",
 ["Call the URL with no header.", "Call it with a wrong token.", "Call it with the right token but another trigger name."],
 "curl.exe -i -X POST -H \"X-Hydra-Token: wrong-token-value\" http://127.0.0.1:5678/api/projects/aa9187f9/triggers/deploy/webhook",
 "<p>Each refusal has its own status and message, and starts nothing.</p>",
 "401, 401 and 404.",
 "HTTP/1.1 401 Unauthorized\n{\"detail\":\"token required (X-Hydra-Token or Authorization: Bearer)\"}\n\nHTTP/1.1 401 Unauthorized\n{\"detail\":\"invalid token\"}\n\nHTTP/1.1 404 Not Found\n{\"detail\":\"no webhook trigger 'nope'\"}")
s += step(6, "Read the history", "See who started each run.",
 ["In the project folder, run the command below."],
 "hdrctl trigger history",
 "<p>The last column is the origin. In our test, <code>hdrctl trigger fire deploy</code> gave <code>manual</code> and the two good calls gave <code>webhook</code>. Note that <code>trigger fire</code> needs no token: it is run from your own machine.</p>",
 "Three runs, one manual and two webhook.",
 "✓ 2026-11-24T06:56:43+00:00  deploy           manual  2.5s\n✓ 2026-11-24T06:57:19+00:00  deploy           webhook  2.74s\n✓ 2026-11-24T06:57:26+00:00  deploy           webhook  2.39s")
s += rules([("TIP", "Rotate the token with <code>--rotate</code> when it may have leaked, then update the caller."),
 ("TIP", "Keep the token in the secret store of the system that calls you, not in its code."),
 ("TRAP", "The token is shown once. If you lose it, run <code>hdrctl trigger token NAME --rotate</code>."),
 ("TRAP", "The call starts the run and returns 202 before it ends. A success answer does not mean the run succeeded: check <code>hdrctl trigger history</code>."),
 ("TRAP", "Anything on the network that reaches the server and has the token can start the project. Do not expose <code>hdrctl serve</code> to the internet without a proxy that you control.")])
s += tail([["Trigger", "type: webhook, token: ${SECRET:name}"], ["Token", "hdrctl trigger token NAME [--rotate]"], ["Call", "POST /api/projects/ID/triggers/NAME/webhook"], ["Header", "X-Hydra-Token or Authorization: Bearer"], ["Answers", "202 started, 401 token, 404 unknown"]],
 [["token required", "No X-Hydra-Token or Bearer header", "Add the header"], ["invalid token", "The token does not match the secret", "Copy it again, or rotate it"], ["no webhook trigger 'x'", "The name is wrong, the type is not webhook, or the trigger is disabled", "Check hdrctl trigger list"], ["Project 'id' not found", "The server does not know the project", "Register it with POST /api/projects/open"]],
 faq, REL + '<li><a href="/studio/declare-project-triggers">Declare project triggers</a></li><li><a href="/studio/store-and-use-secrets-with-hdrctl">Store and use secrets</a></li><li><a href="/studio/launch-a-job-from-the-cli-and-the-api">Launch a job from the CLI and the API</a></li>',
 "One trigger, one token, one URL. Not covered here: sending data with the call, and the 503 answer when the token was never created.",
 '<a class="primary" href="/studio/declare-project-triggers">Back to Triggers <span aria-hidden="true">→</span></a>') + CTA
publish(55, "start-a-project-with-a-webhook", "Webhook trigger", s,
 "Start a Hydra ETL project from a webhook", "Start a Hydra ETL project from a webhook", "Hydra Webhook Trigger: Start a Project by HTTP | Hydra ETL",
 "Declare a webhook trigger, create a token, run hdrctl serve and call the URL to start a project. Tested with Hydra ETL 0.22 on Windows.",
 ["Declare the trigger", "Create the token", "Start the server and register the project", "Call the webhook", "Read the refusals", "Read the history"], faq,
 "Webhook trigger", "Declare a webhook trigger, create its token and start a project with one HTTP call.")
