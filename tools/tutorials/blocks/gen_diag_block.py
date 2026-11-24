"""Lesson 'Diagnose a failure' (plan n. 17): slug diagnose-a-failed-run."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])
FD = "studio-diagnose"
BOOM = esc((R/"tools/tutorials/diag-demo/workflows/boom.yaml").read_text(encoding="utf-8").rstrip())
TH = esc((R/"tools/tutorials/diag-demo/workflows/thread.yaml").read_text(encoding="utf-8").rstrip())
faq = [
 ("How do I find out why a Hydra run failed?", "Open the run in Studio: Runs, then the run itself. The failing step opens by itself and shows a red error message and its log lines. In a terminal, the same message appears on the Step ... FAILED line of hdrctl run."),
 ("What happens to the workflows after the one that failed?", "They do not run. In our test, report came after boom in the thread, and Studio marked it skipped with the log line not run: a previous workflow failed. hdrctl run printed the same reason."),
 ("Where is the Python traceback?", "In the log of the failing step. Our script raised RuntimeError, and the log shows the traceback with the line of the script and the exception name, in the Studio run and in the terminal."),
 ("Should I run again or fix the cause?", "Run again only when the cause may disappear by itself, such as a busy service. When the message names your script, a file or a column, a second run fails the same way: fix the cause first. This is our recommendation, not a Hydra rule."),
 ("How do I run a failed workflow again from Studio?", "The Runs page has a replay button at the end of each row, titled Run again. It starts a new run of the same workflow or project. The old run stays in the list."),
]
s = common(17, "Diagnose a failure", "Diagnose a failed Hydra run in Studio",
 "When a Hydra run fails, Studio opens the failing step for you. Read the run error, the timeline and the traceback, then decide between fixing the cause and running again.",
 '<span class="mono">Runs</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "A failed run in Studio shows a red <b>Run error</b>, a timeline, and the failing step already open with its traceback. The workflows after it are marked skipped. Read the message, then fix the cause, or use <b>Run again</b> only if the failure may be temporary.",
 "Make a run fail on purpose, find the failing step in the terminal and in Studio, and decide what to do.",
 "How do I diagnose a failed run?")
s = s.replace('<li>A project with a few workflows, such as the one built in <a href="/studio/run-steps-in-sequence-or-in-parallel">Stages</a>. The screenshots use that project plus a <code>cleanup</code> workflow that is not in the thread.</li>', '<li>A project with a few workflows, such as the one built in <a href="/studio/run-steps-in-sequence-or-in-parallel">Stages</a>.</li>')
s += step(1, "Make a run fail on purpose", "Have a failure to read.",
 ["Save the file below as <code>workflows\\boom.yaml</code>.", "Put it between two workflows in <code>workflows\\thread.yaml</code>.", "In a terminal, run <code>hdrctl run .</code> from the project folder."],
 "hdrctl run .",
 "<p>The <code>boom</code> workflow has one Python step that raises an error.</p><pre class=\"cmd\">" + BOOM + "</pre><p>The thread runs <code>prepare</code>, <code>boom</code>, then <code>report</code>:</p><pre class=\"cmd\">" + TH + "</pre>",
 "<code>prepare</code> succeeds, <code>boom</code> fails with its traceback, and <code>report</code> does not run.",
 "Workflow  prepare\n  ✓ Step 'say_prepare' OK (0.0s)\nWorkflow  boom\n  ✗ Step 'fail_on_purpose' FAILED: Python script exited with code 1: RuntimeError: boom\n  | Traceback (most recent call last):\n  |   File \"<string>\", line 1, in <module>\n  |     raise RuntimeError(\"boom\")\n  | RuntimeError: boom\nWorkflow 'boom' failed (0.2s): Step 'fail_on_purpose' failed: Python script exited with code 1: RuntimeError: boom\nreport — not run (a previous workflow failed)\nProject 'diag-demo' failed after 0.2s — failed: boom")
s += step(2, "Open the failed run in Studio", "Let Studio point at the failing step.",
 ["Click <b>Runs</b> in the sidebar.", "Click the run named after your project, with the Failed badge."],
 "Runs → the failed run",
 "<p>The page opens on the failing step. From top to bottom: the <b>Failed</b> badge, four cards (started, finished, duration, steps), a red <b>Run error</b> with the short reason, an execution timeline with the failing workflow in red, then the steps. In our test the run was <i>1 ok · 1 skip / 3</i>.</p>",
 "The step <code>boom</code> is open, with a red message and five log lines.",
 "Run error   failed: boom\n#2 boom   0.145s   5 lines\nStep 'fail_on_purpose' failed: Python script exited with code 1: RuntimeError: boom\n#3 report   skipped",
 fig(FD, "diagnose-failed-run-detail-error-dark", "The detail page of a failed project run in Hydra Studio: a Failed badge, the run error, an execution timeline, and the failing step opened with its traceback while the next workflow is marked as skipped.", "The failed run: the failing step is open and the next one is skipped."))
s += step(3, "Read the three clues", "Turn the screen into a diagnosis.",
 ["Read the red message of the step: it names the step and the cause.", "Read the traceback below it: the last line is the exception, here <code>RuntimeError: boom</code>.", "Open the skipped step: its only line says that a previous workflow failed."],
 "boom",
 "<p>The message tells <i>what</i> failed (<code>fail_on_purpose</code>), the traceback tells <i>where</i> (line 1 of the script) and the skipped step tells <i>what did not happen</i> because of it (<code>report</code>). Fix a problem in the script, the file or the data, not in the steps that were skipped.</p>",
 "The same three facts in Studio and in the terminal.",
 "what: Step 'fail_on_purpose' failed\nwhere: File \"<string>\", line 1\nwhy: RuntimeError: boom")
s += step(4, "Find it again, then decide", "Filter the list and choose between fixing and running again.",
 ["On <b>Runs</b>, click the <b>Failed</b> tab.", "After fixing the cause, click the replay button of the row (<b>Run again</b>)."],
 "Runs → Failed",
 "<p>The <b>Failed</b> tab keeps only failed runs. The replay button at the end of the row starts a new run of the same path. Use it after a fix, or when the cause may be temporary. If the message names your script, a file or a column, running again changes nothing: fix the cause first.</p>",
 "One row with a Failed badge and a replay icon.",
 "project:diag-demo   Failed   2/3   0.2s   ↻",
 fig(FD, "diagnose-runs-list-failed-filter-light", "The Runs page of Hydra Studio filtered on Failed: one failed project run with its steps count, start time, duration and the replay button at the end of the row.", "The Failed filter and the replay button."))
s += rules([("TIP", "Start at the failing step, never at the last step: the later ones are only skipped."),
 ("TIP", "Copy the red message with its step name into your notes before fixing; it is the quickest search term later."),
 ("TRAP", "Do not run again in a loop. A deterministic failure, such as a script error, repeats exactly."),
 ("TRAP", "After a restart of <code>hdrctl serve</code> the runs list is empty: copy what you need first. See <a href=\"/studio/read-the-insights-statistics\">Read the Insights statistics</a>.")])
s += tail([["Terminal", "Step ... FAILED, then the traceback, then report not run"], ["Studio", "Run error, timeline and the failing step open"], ["Skipped", "Later workflows say a previous workflow failed"], ["Filter", "The Failed tab lists failed runs only"]],
 [["The run list is empty", "The server restarted, or the run was started in a terminal", "Start the run again from Studio"], ["No traceback appears", "The step failed before running a script", "Read the message of the step"], ["Run again fails the same way", "The cause was not temporary", "Fix the script, file or data first"], ["A later step looks broken", "It was skipped", "Fix the first failure"]],
 faq, '<li><a href="/studio/11-review-a-run">Review a run</a></li><li><a href="/studio/declare-a-fallback-workflow">Declare a fallback workflow</a></li><li><a href="/studio/set-timeouts-on-workflows">Set timeouts on workflows</a></li><li><a href="/studio/read-the-insights-statistics">Read the Insights statistics</a></li>',
 "You can read a failure from the message to the cause. Next, let a project recover by itself with a fallback workflow.",
 '<a class="primary" href="/studio/declare-a-fallback-workflow">Declare a fallback <span aria-hidden="true">→</span></a>') + CTA
publish(17, "diagnose-a-failed-run", "Diagnose a failure", s,
 "Diagnose a failed Hydra run in Studio", "Diagnose a failed Hydra run in Studio", "Hydra Failed Run: Read the Error and Traceback | Hydra ETL",
 "Diagnose a failed Hydra ETL run: the run error, the failing step with its traceback, skipped workflows, and when to run again. Tested with Hydra ETL 0.22.",
 ["Make a run fail on purpose", "Open the failed run in Studio", "Read the three clues", "Find it again, then decide"], faq,
 "Diagnose a failed run", "Read the run error, find the failing step and decide between fixing and running again.")
