"""Lesson 'Other triggers' : slug run-triggers-with-hdrctl-watch."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

faq = [
 ("What does on_failure do in a Hydra ETL workflow?", "It sets what happens to the rest of the workflow when this step fails. The values are fail (the default), skip and continue. In our test on Hydra ETL 0.22, fail stopped the workflow and left the steps after it unrun, skip ran the steps that did not depend on the failed step, and continue also ran the steps that did."),
 ("What is the difference between skip and continue?", "With skip, the steps that depend on the failed step are skipped. With continue, they run anyway. In both cases the steps that do not depend on it run, in our test."),
 ("Does the workflow succeed when I use skip or continue?", "Not in our test. With skip and with continue the run still ended as FAILED, with exit code 1 and an empty reason (None), because one step had failed. According to the source, the workflow succeeds only if every step succeeded."),
 ("How does the Error Scope container of Studio relate to this?", "According to the Studio source (workflowSerializer.ts), an Error Scope copies its on_failure value onto each step it contains, so the YAML carries the same key. We did not test dragging steps into the container."),
 ("What does Hydra ETL say when the value is wrong?", "Validation refuses it and lists the three values: Input should be 'fail', 'skip' or 'continue'."),
]
s = common(52, "Error Scope", "Handle a failing step with on_failure",
 "Set on_failure to fail, skip or continue on a workflow step and read what each one does to the steps around it.",
 '<span class="mono">on_failure</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<code>on_failure</code> is a key of a workflow step. <code>fail</code> stops the workflow, <code>skip</code> skips the steps that depend on the failed step, and <code>continue</code> runs them anyway. The Error Scope container of Studio writes the same key.",
 "Run one workflow three times with a failing step, change <code>on_failure</code> each time, and compare the steps that run.",
 "How do I keep a Hydra ETL workflow going after a step fails?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A project: <code>hdrctl init scope-demo</code>. Work in its <code>workflows</code> folder.</li>')
s += step(1, "Write a workflow with a failing step", "Four steps, one that fails.",
 ["Save the file below as <code>workflows/scope-fail.yaml</code>.", "Run it from the project folder."],
 "hdrctl workflow run workflows\\scope-fail.yaml",
 "<p>The step <code>boom</code> ends the Python script with a non-zero code, so it fails. <code>after_boom</code> depends on it, <code>later</code> depends on <code>independent</code>, and <code>independent</code> depends on nothing. With no <code>on_failure</code> the default is <code>fail</code>.</p><pre class=\"cmd\">version: \"1.0\"\nworkflow:\n  name: scope-fail\n  trigger:\n    type: manual\n  steps:\n    - name: boom\n      type: action\n      action: python\n      params:\n        script: |\n          raise SystemExit(1)\n    - name: after_boom\n      type: action\n      action: log\n      params:\n        message: \"runs after boom\"\n      depends_on: [boom]\n    - name: independent\n      type: action\n      action: log\n      params:\n        message: \"independent step\"\n    - name: later\n      type: action\n      action: log\n      params:\n        message: \"later step\"\n      depends_on: [independent]</pre>",
 "<code>boom</code> fails, the two later steps are skipped, and the workflow fails.",
 "  ✓  Step 'independent' OK (0.0s)\n     │ independent step\n  ✗  Step 'boom' FAILED: Python script exited with code 1\n  ⏭  Step 'after_boom' skipped\n  ⏭  Step 'later' skipped\n\n  ❌ Workflow 'scope-fail' FAILED in 0.1s — Step 'boom' failed: Python script exited with code 1")
s += step(2, "Try skip", "Add one line to boom.",
 ["Copy the file to <code>workflows/scope-skip.yaml</code> and change the name to <code>scope-skip</code>.", "Add <code>on_failure: skip</code> under the <code>boom</code> step, at the same level as <code>action</code>.", "Run it."],
 "hdrctl workflow run workflows\\scope-skip.yaml",
 "<p><code>later</code> now runs, because it does not depend on <code>boom</code>. <code>after_boom</code> is still skipped, because it does.</p>",
 "<code>later</code> runs, <code>after_boom</code> is skipped.",
 "  ✓  Step 'independent' OK (0.0s)\n     │ independent step\n  ✗  Step 'boom' FAILED: Python script exited with code 1\n  ⏭  Step 'after_boom' skipped\n  ✓  Step 'later' OK (0.0s)\n     │ later step\n\n  ❌ Workflow 'scope-skip' FAILED in 0.1s — None")
s += step(3, "Try continue", "Let the dependent step run.",
 ["Copy the file to <code>workflows/scope-continue.yaml</code> and change the name to <code>scope-continue</code>.", "Use <code>on_failure: continue</code> on <code>boom</code>.", "Run it."],
 "hdrctl workflow run workflows\\scope-continue.yaml",
 "<p>Now <code>after_boom</code> runs although the step it depends on failed. Use this for a step that must run whatever happened before, such as a cleanup or a notification.</p>",
 "All steps but <code>boom</code> run.",
 "  ✓  Step 'independent' OK (0.0s)\n     │ independent step\n  ✗  Step 'boom' FAILED: Python script exited with code 1\n  ✓  Step 'after_boom' OK (0.0s)\n     │ runs after boom\n  ✓  Step 'later' OK (0.0s)\n     │ later step\n\n  ❌ Workflow 'scope-continue' FAILED in 0.1s — None")
s += step(4, "Read the end of the run", "The workflow still failed.",
 ["Look at the last line of the skip and continue runs.", "Check the exit code in your shell: <code>echo %ERRORLEVEL%</code> in <code>cmd</code>."],
 "echo %ERRORLEVEL%",
 "<p>In our test, both runs ended with <code>FAILED … — None</code> and exit code 1, although the steps after <code>boom</code> ran. The workflow counts as successful only when every step succeeded. A scheduler or a script that reads the exit code sees a failure.</p>",
 "<code>1</code>.",
 "1")
s += step(5, "Check a wrong value", "Validation names the three values.",
 ["Save a copy of the file with <code>on_failure: ignore</code> on a step.", "Run the validation."],
 "hdrctl workflow validate workflows\\bad-onfail.yaml",
 "<p>The check runs before any step.</p>",
 "A refusal that lists <code>fail</code>, <code>skip</code> and <code>continue</code>.",
 "  ❌ Invalid workflow: Workflow validation error in '...\\workflows\\bad-onfail.yaml':\n  - steps.0.on_failure: Input should be 'fail', 'skip' or 'continue'")
s += rules([("TIP", "Use <code>continue</code> only for steps that must run after a failure, such as a cleanup, and put the check in the step itself."),
 ("TIP", "Use <code>skip</code> when later steps are independent: the rest of the work still gets done."),
 ("TRAP", "<code>skip</code> and <code>continue</code> do not make the workflow succeed. The run ends as failed with exit code 1 and an empty reason (<code>None</code>)."),
 ("TRAP", "With the default <code>fail</code>, steps that do not depend on the failed step can already have run, because steps without dependencies start together. In our test, <code>independent</code> ran before <code>boom</code> was reported."),
 ("TRAP", "Retrying is a different key. See <a href=\"/studio/retry-a-failing-step-with-retry\">Retry a failing step</a>.")])
s += tail([["Key", "on_failure on a step"], ["Values", "fail (default), skip, continue"], ["fail", "stops the workflow, the rest is not run"], ["skip", "skips the steps that depend on it"], ["continue", "runs them anyway"], ["Result", "any failed step makes the workflow fail"]],
 [["Input should be 'fail', 'skip' or 'continue'", "Another value was written", "Use one of the three values"], ["FAILED … — None", "A step failed under skip or continue", "Read the failed step above it"]],
 faq, REL + '<li><a href="/studio/retry-a-failing-step-with-retry">Retry a failing step</a></li><li><a href="/studio/branch-with-the-condition-node">Branch with the Condition node</a></li><li><a href="/studio/diagnose-a-failed-run">Diagnose a failed run</a></li>',
 "One key, three values. Not covered here: dragging steps into an Error Scope in Studio, and failures inside a job step.",
 '<a class="primary" href="/studio/retry-a-failing-step-with-retry">Next: retry a failing step <span aria-hidden="true">→</span></a>') + CTA
publish(52, "handle-step-failures-with-on-failure", "Error Scope", s,
 "Handle a failing step with on_failure", "Handle a failing step with on_failure", "Hydra on_failure: Fail, Skip or Continue | Hydra ETL",
 "Set on_failure to fail, skip or continue on a Hydra ETL workflow step and see what each does to the steps after it. Tested with Hydra ETL 0.22.",
 ["Write a workflow with a failing step", "Try skip", "Try continue", "Read the end of the run", "Check a wrong value"], faq,
 "Error Scope", "Set on_failure to fail, skip or continue and see what each does to the steps after it.")
