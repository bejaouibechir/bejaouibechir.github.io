"""Lesson 'thread.yaml' (plan n. 59): slug orchestrate-from-thread-yaml."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])
FT = "studio-thread"
T_A = esc((R/"tools/tutorials/thread-demo/workflows/thread.yaml").read_text(encoding="utf-8").rstrip())
faq = [
 ("What is thread.yaml in a Hydra project?", "thread.yaml is the file workflows/thread.yaml. It lists the workflows of a project in stages, each sequential or parallel, with optional waits, timeouts, fallbacks and loops. hdrctl run reads it, and so does the Execution order tab of Studio."),
 ("How do I validate thread.yaml?", "Run hdrctl run . --dry-run in the project folder. It validates the thread and every workflow it names, prints the execution plan, and runs nothing. hdrctl workflow validate does not accept thread.yaml: it expects a workflow file."),
 ("What formats do delays and timeouts accept?", "A number of seconds, or a duration written as 500ms, 30s, 5m or 1h. In our test 1s, 2s and 30s were accepted and 5x was rejected with a message listing the valid formats."),
 ("Which keys does a stage accept?", "A stage accepts mode, delay_after and workflows. A workflow accepts name, active, delay_before, timeout and fallback. Any other key is rejected: our typo modee was reported as an extra input that is not permitted."),
 ("What happens if workflows/thread.yaml does not exist?", "Studio says that no thread.yaml exists yet and that the workflows run in alphabetical order until you save. This lesson did not test that case from the command line."),
]
s = common(59, "thread.yaml", "Orchestrate a Hydra project from thread.yaml",
 "thread.yaml orders the workflows of a Hydra project. Read every key, validate the file with a dry run, and learn the four messages you will meet when it is wrong.",
 '<span class="mono">thread.yaml</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<code>workflows/thread.yaml</code> is the orchestration file of a Hydra project: a list of <b>stages</b>, each with a mode and its workflows, plus optional <b>loops</b>. Validate it with <code>hdrctl run . --dry-run</code>, which prints the plan and runs nothing.",
 "Read the keys of thread.yaml, validate a full example with a dry run, and read four error messages.",
 "How do I orchestrate a project from thread.yaml?")
s += step(1, "Read the keys", "Know what the file can say.",
 ["Open <code>workflows/thread.yaml</code> of a project.", "Match each line with the table below."],
 "workflows\\thread.yaml",
 "<table><thead><tr><th>Level</th><th>Keys</th></tr></thead><tbody><tr><td>File</td><td><code>version</code>, <code>thread</code>, <code>loops</code></td></tr><tr><td>Stage</td><td><code>mode</code> (<code>sequential</code> or <code>parallel</code>), <code>delay_after</code>, <code>workflows</code></td></tr><tr><td>Workflow</td><td><code>name</code>, <code>active</code>, <code>delay_before</code>, <code>timeout</code>, <code>fallback</code></td></tr><tr><td>Fallback</td><td><code>use</code>, <code>when</code>, <code>on_failure</code>, <code>on_probe_error</code></td></tr><tr><td>Loop</td><td><code>from</code>, <code>to</code>, <code>times</code>, <code>delay</code></td></tr></tbody></table><p>The keys come from the thread model of Hydra ETL 0.22. This example uses most of them; each <code>name</code> is a file of <code>workflows</code>:</p><pre class=\"cmd\">" + T_A + "</pre>",
 "A file with three stages, a timeout, a fallback and a wait.",
 "")
s += step(2, "Validate with a dry run", "See the plan before anything runs.",
 ["Open a terminal in the project folder.", "Run the command below."],
 "hdrctl run . --dry-run",
 "<p>A dry run loads <code>thread.yaml</code> and every workflow it names, then prints the plan. Waits, timeouts and fallbacks appear under their workflow. For stages see <a href=\"/studio/run-steps-in-sequence-or-in-parallel\">Stages</a>, for loops <a href=\"/studio/repeat-workflows-with-loops\">Repeat workflows with loops</a>.</p>",
 "The three stages, a timeout line, a fallback line, a wait line, and <b>Dry run OK</b>.",
 "Execution plan\nStage 1/3 — sequential\n   •  prepare  (1: say_prepare)\nStage 2/3 — parallel  then wait 1s\n   •  load_sales  (1: work_load_sales)\n      ⌛ timeout 30s: beyond it, the workflow fails\n      ↪ fallback: cleanup (on failure)\n   •  load_stock  (1: work_load_stock)\n      ◷ waits 2s before starting (after the stage starts)\nStage 3/3 — sequential\n   •  report  (1: say_report)\n\nDry run OK: the project is valid. Nothing was executed.",
 fig(FT, "thread-yaml-dry-run-execution-plan-light", "The Studio terminal after hdrctl run with the dry-run option on a project with three stages: the plan lists each workflow, a timeout of 30s, a fallback named cleanup on failure, and a wait of 2s before a workflow starts.", "The plan printed by the dry run."))
s += step(3, "Read the error messages", "Recognize the four common mistakes.",
 ["Break the file on purpose, one change at a time, and run the dry run again.", "Compare each message with the table below."],
 "hdrctl run . --dry-run",
 "<p>Each message starts with <code>workflows/thread.yaml</code> and a position. Positions count from zero: <code>thread.1</code> is the second stage and <code>workflows.1</code> the second workflow of that stage.</p><table><thead><tr><th>Change</th><th>Message</th></tr></thead><tbody><tr><td><code>modee</code> instead of <code>mode</code></td><td><code>thread.1.modee: Extra inputs are not permitted</code></td></tr><tr><td><code>delay_before: 5x</code></td><td><code>thread.1.workflows.1.delay_before: invalid delay '5x' (use a number of seconds or 30s, 5m, 1h)</code></td></tr><tr><td>A loop that goes forward</td><td><code>loop prepare -&gt; report: 'report' must come before 'prepare' in the thread (a loop goes back)</code></td></tr><tr><td><code>times: 0</code></td><td><code>loops.0.times: Input should be greater than or equal to 1</code></td></tr></tbody></table>",
 "A red line <b>Project … cannot run</b> followed by an <code>err</code> line with the message.",
 "Project 'thread-demo-loop' cannot run:\nerr   — workflows/thread.yaml: loop prepare -> report: 'report' must come before 'prepare' in the thread (a loop goes back)",
 fig(FT, "thread-yaml-invalid-loop-error-dark", "The Studio terminal after hdrctl run with the dry-run option on a thread whose loop goes forward: a message says the project cannot run because report must come before prepare in the thread.", "A loop that goes forward is refused."))
s += step(4, "Edit it in Studio instead", "Use the visual editor for the same file.",
 ["Open <b>Settings</b> → <b>Project settings</b> → <b>Execution order</b>.", "Use <b>Define</b>, <b>Preview</b> and <b>Check</b>."],
 "Execution order",
 "<p>The Execution order tab edits this same file. See <a href=\"/studio/define-the-execution-order\">Define</a>, <a href=\"/studio/preview-the-execution-order\">Preview</a> and <a href=\"/studio/check-the-execution-order\">Check</a>.</p>",
 "The tab header shows <code>workflows/thread.yaml</code>.",
 "Execution order   workflows/thread.yaml")
s += rules([("TIP", "Run <code>hdrctl run . --dry-run</code> before the first real run and after every edit of the file."),
 ("TIP", "Read the position in a message from zero: <code>thread.1.workflows.1</code> is the second workflow of the second stage."),
 ("TRAP", "<code>hdrctl workflow validate</code> rejects <code>thread.yaml</code> with unknown key 'thread': it validates workflow files only."),
 ("TRAP", "A typo in a key is an error, not a silent default: keys that the model does not know are refused.")])
s += tail([["Plan", "The dry run prints stages, waits, timeouts and fallbacks"], ["Valid", "Dry run OK says nothing was executed"], ["Invalid", "Project cannot run, then one err line per problem"], ["Studio", "Execution order edits the same file"]],
 [["Extra inputs are not permitted", "A key is misspelled or misplaced", "Compare with the key table above"], ["invalid delay", "The value is not a number or 500ms, 30s, 5m, 1h", "Rewrite the delay"], ["must come before", "A loop goes forward", "Swap from and to"], ["Workflow has no file", "A name does not match a file in workflows", "Create the file or fix the name"]],
 faq, REL + '<li><a href="/studio/define-the-execution-order">Define the execution order</a></li><li><a href="/studio/check-the-execution-order">Check the execution order</a></li><li><a href="/studio/dry-run-and-use-fallback">Dry run and --use-fallback</a></li>',
 "You can read, validate and fix thread.yaml. Next, see what starts a project with triggers.",
 '<a class="primary" href="/studio/dry-run-and-use-fallback">Dry run <span aria-hidden="true">→</span></a>') + CTA
publish(59, "orchestrate-from-thread-yaml", "thread.yaml", s,
 "Orchestrate a Hydra project from thread.yaml", "Orchestrate a Hydra project from thread.yaml", "Hydra thread.yaml: Keys, Dry Run and Errors | Hydra ETL",
 "Every key of workflows/thread.yaml in Hydra ETL, validated with hdrctl run --dry-run, plus the four error messages you will meet. Tested with Hydra ETL 0.22.",
 ["Read the keys", "Validate with a dry run", "Read the error messages", "Edit it in Studio instead"], faq,
 "Orchestrate from thread.yaml", "Read, validate and fix the project-level orchestration file.")
