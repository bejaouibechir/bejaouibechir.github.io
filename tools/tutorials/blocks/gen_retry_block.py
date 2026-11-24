"""Lesson 'Other triggers' : slug run-triggers-with-hdrctl-watch."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

faq = [
 ("How do I retry a failing step in Hydra ETL?", "Add a retry key to the step with max, delay and, optionally, backoff. In our test on Hydra ETL 0.22, a step that failed twice and then passed ended as OK with max: 3 and delay: 1, and the workflow took 2.6 seconds, two waits of one second."),
 ("Does max count the first try?", "No. max is the number of retries after the first failure, according to the source. With max: 3 a step can run four times. Our flaky step passed on its third run."),
 ("What does exponential backoff do?", "The wait doubles at each retry. With delay: 1 and max: 2, the waits were one second then two seconds: the failing workflow took 3.3 seconds, against 2.4 seconds with fixed waits."),
 ("Where do I see each attempt?", "In the logs of the step, kept by the server. The command line printed only the output of the last attempt in our test. Through the API, the logs showed each failure and the lines failed, retry 1/3 in 1s and succeeded after 2 retry(ies)."),
 ("How does the Retry Scope container of Studio relate to this?", "According to the Studio source (workflowSerializer.ts), a Retry Scope copies its retry settings onto each step it contains, so the YAML carries the same key. We did not test dragging steps into the container."),
]
s = common(53, "Retry Scope", "Retry a failing step with retry",
 "Add a retry policy with max, delay and backoff to a workflow step, then read how many times it runs and how long the workflow waits.",
 '<span class="mono">retry</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<code>retry</code> is a key of a workflow step with three fields: <code>max</code> retries after the first failure, <code>delay</code> in seconds between tries, and <code>backoff</code>, <code>fixed</code> or <code>exponential</code>. The Retry Scope container of Studio writes the same key.",
 "Run a step that fails twice and passes on the third run, then a step that always fails, then compare fixed and exponential waits.",
 "How do I retry a failing step in a Hydra ETL workflow?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A project: <code>hdrctl init scope-demo</code>. Work in its <code>workflows</code> folder.</li>')
s += step(1, "Retry a step that passes the third time", "A script that fails twice.",
 ["Save the file below as <code>workflows/retry-ok.yaml</code>.", "Run it from the project folder."],
 "hdrctl workflow run workflows\\retry-ok.yaml",
 "<p>The script counts its runs in <code>attempts.txt</code> and fails while the count is 2 or less. <code>max: 3</code> allows three retries, and <code>delay: 1</code> waits one second before each one. Delete <code>attempts.txt</code> before you run it again.</p><pre class=\"cmd\">version: \"1.0\"\nworkflow:\n  name: retry-ok\n  trigger:\n    type: manual\n  steps:\n    - name: flaky\n      type: action\n      action: python\n      params:\n        script: |\n          import pathlib\n          p = pathlib.Path(\"attempts.txt\")\n          n = int(p.read_text()) + 1 if p.exists() else 1\n          p.write_text(str(n))\n          print(\"attempt\", n)\n          raise SystemExit(1 if n &lt;= 2 else 0)\n      retry:\n        max: 3\n        delay: 1</pre>",
 "The step is OK, and the workflow lasted about two seconds.",
 "  ✓  Step 'flaky' OK (0.2s)\n     │ attempt 3\n\n  ✅ Workflow 'retry-ok' completed in 2.6s — 1/1 steps OK")
s += step(2, "Read every attempt", "The command line shows only the last one.",
 ["Delete <code>attempts.txt</code>.", "Start the server in a second terminal: <code>hdrctl serve --no-studio --port 5690</code>.", "Save <code>run.json</code> as shown below, run the workflow through the API, wait three seconds, then list the runs."],
 "curl.exe -s -X POST -H \"Content-Type: application/json\" -d @run.json http://127.0.0.1:5690/api/runs",
 "<p>Save this as <code>run.json</code>, with the full path of the workflow (backslashes doubled):</p><pre class=\"cmd\">{\"workflow_path\": \"C:\\\\path\\\\to\\\\scope-demo\\\\workflows\\\\retry-ok.yaml\"}</pre><p>Then <code>curl.exe -s http://127.0.0.1:5690/api/runs</code> returns the run with the logs of each step. The retry lines, in order (the script lines are cut):</p>",
 "The lines <code>failed, retry 1/3 in 1s</code> and <code>succeeded after 2 retry(ies)</code> in the logs of <code>flaky</code>.",
 "INFO   attempt 1\nERROR [flaky] FAILED Python script exited with code 1\nWARNING [flaky] failed, retry 1/3 in 1s\nINFO   attempt 2\nERROR [flaky] FAILED Python script exited with code 1\nWARNING [flaky] failed, retry 2/3 in 1s\nINFO   attempt 3\nINFO [flaky] succeeded after 2 retry(ies)")
s += step(3, "Let the retries run out", "A step that never passes.",
 ["Save <code>workflows/retry-giveup.yaml</code> with the step below and <code>retry: {max: 2, delay: 1}</code>.", "Run it."],
 "hdrctl workflow run workflows\\retry-giveup.yaml",
 "<p>The step is <code>always_fails</code>, a Python action whose script is <code>raise SystemExit(1)</code>. After two retries the step fails for good, and the failure follows its <code>on_failure</code> value, <code>fail</code> by default.</p>",
 "A failed step and a failed workflow after about two seconds.",
 "  ✗  Step 'always_fails' FAILED: Python script exited with code 1\n\n  ❌ Workflow 'retry-giveup' FAILED in 2.4s — Step 'always_fails' failed: Python script exited with code 1")
s += step(4, "Double the wait", "Add exponential backoff.",
 ["Copy the file to <code>workflows/retry-backoff.yaml</code>.", "Add <code>backoff: exponential</code> to the <code>retry</code> block, next to <code>delay: 1</code>.", "Run it."],
 "hdrctl workflow run workflows\\retry-backoff.yaml",
 "<p>The waits are one second, then two. The run lasts a second longer than with a fixed delay.</p>",
 "The same failure after about three seconds.",
 "  ✗  Step 'always_fails' FAILED: Python script exited with code 1\n\n  ❌ Workflow 'retry-backoff' FAILED in 3.3s — Step 'always_fails' failed: Python script exited with code 1")
s += step(5, "Check a typo", "Validation suggests the key.",
 ["Write <code>mx: 2</code> instead of <code>max: 2</code> in a <code>retry</code> block.", "Run the validation."],
 "hdrctl workflow validate workflows\\bad-retry.yaml",
 "<p>The three valid keys are listed.</p>",
 "A refusal with a suggestion.",
 "  ❌ Invalid workflow: Workflow validation error in '...\\workflows\\bad-retry.yaml':\n  - steps.0.retry: retry: unknown key 'mx' — did you mean 'max'? Valid keys: backoff, delay, max")
s += rules([("TIP", "Pick <code>delay</code> from the cause: a few seconds for a busy service, more for a service that restarts."),
 ("TIP", "Put <code>retry</code> on the step that talks to the outside, not on every step."),
 ("TRAP", "Retrying a failure that always happens, such as a missing file or a wrong password, only delays the failure. In our test, a step that could never pass kept the workflow waiting for the whole delay."),
 ("TRAP", "A step that is not safe to run twice, such as one that sends a message, can act twice. Make it safe first, or do not retry it."),
 ("TRAP", "The command line shows only the last attempt. Read the logs of the run when you need to know how many tries it took.")])
s += tail([["Key", "retry on a step"], ["max", "retries after the first failure (0 = none)"], ["delay", "seconds between tries"], ["backoff", "fixed (default) or exponential"], ["After the last retry", "the step follows its on_failure value"]],
 [["unknown key 'mx' — did you mean 'max'?", "A typo in the retry block", "Use max, delay or backoff"], ["Step still FAILED", "Every try failed", "Read the error of the step: retrying does not fix a permanent cause"]],
 faq, REL + '<li><a href="/studio/handle-step-failures-with-on-failure">Handle a failing step with on_failure</a></li><li><a href="/studio/wait-with-the-delay-node">Wait with the Delay node</a></li><li><a href="/studio/diagnose-a-failed-run">Diagnose a failed run</a></li>',
 "One key, three fields. Not covered here: dragging steps into a Retry Scope in Studio, and retrying a job step.",
 '<a class="primary" href="/studio/handle-step-failures-with-on-failure">Back to on_failure <span aria-hidden="true">→</span></a>') + CTA
publish(53, "retry-a-failing-step-with-retry", "Retry Scope", s,
 "Retry a failing step with retry", "Retry a failing step with retry", "Hydra Retry Policy: Retry a Failing Step | Hydra ETL",
 "Add a retry policy with max, delay and exponential backoff to a Hydra ETL workflow step and read how long a run waits. Tested with Hydra ETL 0.22.",
 ["Retry a step that passes the third time", "Read every attempt", "Let the retries run out", "Double the wait", "Check a typo"], faq,
 "Retry Scope", "Add max, delay and backoff to a step and read how long the workflow waits.")
