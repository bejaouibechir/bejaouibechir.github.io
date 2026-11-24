"""Lesson 'Tour the pages' (plan n. 4): new lesson, slug tour-the-pages."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
src = (R/"tools/tutorials/blocks/gen_jobs_block.py").read_text(encoding="utf-8")
exec(src.split("F6, F7, F9 =")[0])   # helpers: fig, head, step, rules, table, tail, CTA
SLUG = "log-python-and-shell-actions"
FA, F4 = "studio-actions1", "studio-04-use-the-palette"
YAML = open(R/"tools/tutorials/probe-actions/workflows/wf_actions.yaml", encoding="utf-8").read().rstrip()
NL = len(YAML.splitlines())
faq = [
 ("What actions can a Hydra workflow run?", "Hydra ETL 0.22 has eleven actions: bash, powershell, python, ssh, webhook, email, log, delay, condition, set_param and assign_param. A step runs one of them with type action, an action name and a params block."),
 ("How do I run a Python script in a workflow?", "Use the python action with an inline script in params.script, or a .py file in params.file_path. Optional keys are working_dir and timeout, which defaults to 60 seconds."),
 ("Why is the Bash action unavailable on Windows?", "Each shell action is tied to an operating system: Bash runs on Linux and macOS, PowerShell on Windows. The palette shows the other one dimmed. Use Python when a step must run everywhere."),
 ("Where does the output of a step go?", "The log action writes its message to the run, and a Python or PowerShell step shows what it prints under the step. In our test each message appeared right below its step."),
 ("What does On failure do?", "Every action dialog has an On failure list whose default is fail. It decides what the workflow does when the step fails. The Resolve conflicts and recover lessons cover the other choices."),
]
s = head(26, 65, "Actions 1", "Run Log, Python and shell actions in a Hydra Studio workflow",
 "Actions run work that is not a job: write a log line, run Python, or call PowerShell. Build a three step workflow and read each message in the run.",
 '<span class="mono">Actions</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "A Hydra workflow runs an <b>action</b> as a step: <code>log</code> writes a message, <code>python</code> runs a script on any system, <code>powershell</code> runs a command on Windows and <code>bash</code> on Linux or macOS. In our test, a log, a Python and a PowerShell step ran in 0.6 seconds.",
 "Read three action dialogs, write a workflow that chains a log, a Python and a PowerShell step, and run it.",
 "Hydra ETL 0.22 installed. The run uses only the command line; Studio is optional. The commands are the Windows ones.")
s = s.replace("Published 4 November 2026", "Published 23 November 2026")
import re as _re
s = _re.sub(r'  <div class="callout"><b>Course project</b>.*?</div>\n', '', s, count=1, flags=_re.S)
s = _re.sub(r'<h3>Prerequisites</h3><ul>.*?</ul>', '<h3>Prerequisites</h3><ul><li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>PowerShell on Windows. Bash steps need Linux or macOS and were not run in this lesson.</li></ul>', s, count=1, flags=_re.S)
s += "  <h2>How do I run actions in a Hydra workflow?</h2>\n\n"
s += step(1, "Open the Log action", "Start with the simplest action.",
 ["Open a workflow in <b>Workflow configuration</b>.", "In the palette, expand <b>Actions</b>.", "Drag <b>Log</b> onto the canvas and double-click it."],
 "Palette → Actions → Log",
 "<p>The Log action writes one message to the run. Its dialog has a step name, an <b>On failure</b> list, a <b>Run condition (when)</b> and the <b>Message</b>. Every action shares this frame.</p>",
 "A dialog whose subtitle says it writes a message to the run logs.",
 "Log   ACTION   Writes a message to the run logs",
 fig(F4, "dialog-log-action-open-light", "The Log action dialog of Hydra Studio in the light theme, with a step name, an on-failure list, a run condition and a message field.", "The <b>Log</b> dialog."))
s += step(2, "Open the Python action", "See the one action that runs on every system.",
 ["Drag <b>Python</b> onto the canvas and double-click it.", "Select <b>Inline script</b>, then <b>.py file</b>."],
 "Palette → Actions → Python",
 "<p>Python takes an inline script or the path of a <code>.py</code> file, plus an optional working directory and a timeout of 60 seconds by default. It has no platform badge: it runs on Windows, Linux and macOS.</p>",
 "A code editor for the inline script, and a path field for the file.",
 "Python   ACTION   Inline script · .py file",
 fig(F4, "dialog-python-inline-open-dark", "The Python action dialog of Hydra Studio in the dark theme, in Inline script mode, with a code editor, a working directory and a timeout.", "The <b>Python</b> dialog, inline mode."))
s += step(3, "Open the PowerShell action", "Know what a shell action asks for, and when it is dimmed.",
 ["Drag <b>PowerShell</b> onto the canvas and double-click it.", "Read the <b>PowerShell command</b>, <b>Working directory</b> and <b>Timeout</b> fields."],
 "Palette → Actions → PowerShell",
 "<p>On Windows, PowerShell is active and <b>Bash</b> is dimmed in the palette; on Linux or macOS the pair is reversed. The dialog says <i>Runs a PowerShell script (Windows)</i>. The <b>Bash</b> action takes a Bash command in the same way but was not run here, because this lesson was tested on Windows.</p>",
 "A dialog with a required command field, a working directory with a Browse button, and a timeout.",
 "PowerShell   ACTION   Runs a PowerShell script (Windows)",
 fig(FA, "powershell-action-dialog-command-field-light", "The PowerShell action dialog of Hydra Studio in the light theme: step name, on failure list, run condition, the required PowerShell command field, working directory with a Browse button, timeout, and the Undo section.", "The <b>PowerShell</b> dialog."))
s += step(4, "Write a workflow with three actions", "See the three actions as YAML.",
 ["Create a folder <code>actions-demo</code> with a <code>workflows</code> folder inside.", "Save the YAML below as <code>workflows\\wf_actions.yaml</code>."],
 "workflows\\wf_actions.yaml",
 "<p>Each step has <code>type: action</code>, an <code>action</code> name and a <code>params</code> block, and depends on the previous step. The Python script uses a YAML block (<code>|</code>) so that it can span lines.</p><pre class=\"cmd\">" + YAML.replace("<","&lt;").replace(">","&gt;") + "</pre>",
 "A file of %d lines." % NL,
 "")
s += step(5, "Validate and run", "See the three messages in the run.",
 ["Open a terminal in the <code>actions-demo</code> folder.", "Run the two commands below, one after the other."],
 "hdrctl workflow validate workflows\\wf_actions.yaml\nhdrctl workflow run workflows\\wf_actions.yaml",
 "<p>Validation prints a confirmation. The run then executes the three steps in order and shows each message under its step.</p>",
 "Three steps OK, each followed by its message, and a summary line.",
 "Workflow valid — no errors detected.\n\nWorkflow  wf_actions\n\n✓  Step 'say_hello' OK (0.0s)\n   | Hello from the log action\n✓  Step 'run_python' OK (0.1s)\n   | Python 3.13.7\n✓  Step 'run_powershell' OK (0.4s)\n   | Hello from PowerShell\n\nWorkflow 'wf_actions' completed in 0.6s — 3/3 steps OK",
 fig(FA, "actions-workflow-run-terminal-output-dark", "The Hydra Studio terminal in the dark theme after running wf_actions: the log, Python and PowerShell steps are OK, each followed by its message, and the workflow completed in 0.6s with 3 of 3 steps OK.", "The same run, from the Studio terminal."))
s += rules([("TIP", "Use <b>Python</b> when a workflow must run on several systems: it is the only script action that does not depend on the host."),
 ("TIP", "Keep long scripts in a <code>.py</code> file and point <code>file_path</code> at it."),
 ("TRAP", "A shell action fails on the wrong system: PowerShell needs Windows, Bash needs Linux or macOS."),
 ("TIP", "Chain steps with <code>depends_on</code>, otherwise they may run side by side.")])
s += tail([["Dialogs", "Log, Python and PowerShell share the same frame"], ["Validation", "<code>hdrctl workflow validate</code> prints Workflow valid"], ["Run", "Three steps OK, each with its message"], ["Total", "The workflow completes with 3/3 steps OK"]],
 [["The Bash action is dimmed", "You are on Windows", "Use PowerShell, or Python for a portable step"], ["The Python step fails", "The script raises an error or exceeds the timeout", "Run the script alone, then raise <code>timeout</code> if needed"], ["No message under a step", "The step printed nothing", "Print or write a log message from the step"], ["Workflow file not found", "The path is wrong", "Run the command from the folder that holds <code>workflows</code>"]],
 faq,
 '<li><a href="/studio/use-the-palette">Use the node palette</a></li><li><a href="/studio/wait-with-the-delay-node">Wait with the Delay node</a></li><li><a href="/studio/branch-with-the-condition-node">Branch with the Condition node</a></li><li><a href="/studio/12-compose-jobs">Compose jobs in a workflow</a></li>',
 "You can run scripts and log messages from a workflow. Next, call a service or reach another machine with the Webhook, Email and SSH actions.",
 '<a class="primary" href="/studio/12-compose-jobs">Compose jobs <span aria-hidden="true">→</span></a>') + CTA
(R/"src/_mock/studio-lesson-26-log-python-and-shell-actions.main.html").write_text(s, encoding="utf-8")
t = (R/"src/pages/studio/all-or-nothing-load.astro").read_text(encoding="utf-8")
HEAD = "Run Log, Python and shell actions in a Hydra Studio workflow"
DESC = "Run Log, Python and PowerShell actions in a Hydra ETL workflow: read the dialogs, write the YAML and run it. Commands tested on Windows, Hydra ETL 0.22."
steps = ["Open the Log action", "Open the Python action", "Open the PowerShell action", "Write a workflow with three actions", "Validate and run"]
t = t.replace("studio-lesson-42-all-or-nothing-load.main.html", "studio-lesson-26-log-python-and-shell-actions.main.html")
t = t.replace("all-or-nothing-load", SLUG)
t = re.sub(r'headline: "[^"]*"', lambda m: 'headline: '+json.dumps(HEAD), t, 1)
t = re.sub(r'(description: ")[^"]*(", datePublished)', lambda m: m.group(1)+DESC+m.group(2), t, 1)
t = re.sub(r"steps: \[.*?\],\n", lambda m: "steps: "+json.dumps(steps, ensure_ascii=False)+",\n", t, 1, flags=re.S)
t = re.sub(r"  faq: \[.*?\n  \],\n", lambda m: "  faq: [\n"+"".join(f"    [{json.dumps(q, ensure_ascii=False)}, {json.dumps(x, ensure_ascii=False)}],\n" for q, x in faq)+"  ],\n", t, 1, flags=re.S)
t = t.replace('["All-or-nothing load", ', '["Actions 1", ')
t = re.sub(r'<BaseLayout title="[^"]*" exactTitle="[^"]*" description="[^"]*"', '<BaseLayout title="Log, Python and shell actions in Hydra Studio" exactTitle="Hydra Workflow Actions: Log, Python, PowerShell | Hydra ETL" description="'+DESC+'"', t, 1)
(R/("src/pages/studio/"+SLUG+".astro")).write_text(t, encoding="utf-8")
p = R/"src/data/studio-lessons.js"; h = p.read_text(encoding="utf-8")
h = h.replace('{"label": "Actions 1", "group"', '{"slug": "'+SLUG+'", "label": "Actions 1", "group"', 1)
h = h.replace('"title": "Actions: Job, Log, Bash, PowerShell, Python", "description": "Run a job, write a log line or execute a script from a workflow."', '"title": "Log, Python and shell actions", "description": "Write a log line or run a Python or PowerShell script from a workflow."', 1)
p.write_text(h, encoding="utf-8")
print("ok", len(s))
