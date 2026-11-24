"""Lesson 'Tour the pages' (plan n. 4): new lesson, slug tour-the-pages."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
src = (R/"tools/tutorials/blocks/gen_jobs_block.py").read_text(encoding="utf-8")
exec(src.split("F6, F7, F9 =")[0])   # helpers: fig, head, step, rules, table, tail, CTA
SLUG = "wait-with-the-delay-node"
FD = "studio-delay"
YAML = """version: "1.0"
workflow:
  name: wf_wait
  trigger:
    type: manual
  steps:
    - name: before
      type: action
      action: log
      params:
        message: "Before the pause"
    - name: pause
      type: action
      action: delay
      params:
        seconds: 3
      depends_on: [before]
    - name: after
      type: action
      action: log
      params:
        message: "After the pause"
      depends_on: [pause]"""
faq = [
 ("What does the Delay node do in Hydra Studio?", "It pauses the workflow for a number of seconds before the steps that depend on it can start. Its only required setting is Delay (seconds)."),
 ("What is the YAML of a Delay step?", "A step with type action, action delay and a params block holding seconds. In our test a step named pause with seconds: 3 completed in 3.0s."),
 ("Can the delay be shorter than a second?", "Yes. The engine reads the value as a decimal number, so 0.5 waits half a second. A negative value is treated as zero."),
 ("What happens if seconds is not a number?", "The engine stops with an error that names the step and says seconds must be a number. Studio marks the field as required."),
 ("Can I use a parameter for the delay?", "Yes. The field has a {x} button that inserts a parameter reference, so the pause can change from one run to the next."),
]
s = head(51, 65, "Delay", "Wait with the Hydra Studio Delay node: pause a workflow for N seconds",
 "The Delay node makes a workflow wait a fixed number of seconds. Place it between two steps, set the seconds and watch the run take exactly that long.",
 '<span class="mono">Delay</span><span>about 10 minutes</span><span>Hydra ETL 0.22</span>',
 "The <b>Delay</b> node of Hydra Studio pauses a workflow for N seconds before the next step starts. In YAML it is an <code>action: delay</code> step with <code>params.seconds</code>. In our test, a three second delay between two log steps made the run last 3.0 seconds.",
 "Find the Delay node, read its dialog, write the YAML of a delay step, and run a workflow to see the pause.",
 "Hydra ETL 0.22 installed. Studio is optional: the run uses only the command line.")
s = s.replace("Published 4 November 2026", "Published 23 November 2026")
import re as _re
s = _re.sub(r'  <div class="callout"><b>Course project</b>.*?</div>\n', '', s, count=1, flags=_re.S)
s = _re.sub(r'<h3>Prerequisites</h3><ul>.*?</ul>', '<h3>Prerequisites</h3><ul><li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A terminal: PowerShell on Windows.</li></ul>', s, count=1, flags=_re.S)
s += "  <h2>How do I add a delay to a workflow?</h2>\n\n"
s += step(1, "Find the Delay node", "Know where the node lives and what it asks for.",
 ["Open a workflow in <b>Workflow configuration</b>.", "In the palette, expand <b>Control Flow</b>.", "Drag <b>Delay</b> onto the canvas and double-click it."],
 "Palette → Control Flow → Delay",
 "<p>Delay sits in <b>Control Flow</b>, next to <b>Condition</b>. Its dialog states what it does, <i>Waits N seconds before continuing</i>, and asks for four things: a <b>step name</b>, an optional <b>run condition</b> (it runs only if the result of an upstream Condition node is true), the required <b>Delay (seconds)</b> and a read-only <b>node ID</b>. The <b>{x}</b> button beside the seconds inserts a parameter.</p>",
 "A dialog with a CONTROL_FLOW badge and the Delay (seconds) field, marked as required.",
 "Delay   CONTROL_FLOW   Waits N seconds before continuing\nDelay (seconds) *   5",
 fig(FD, "delay-node-dialog-seconds-field-light", "The Delay node dialog of Hydra Studio in the light theme: the step name action_delay_1, an empty run condition, the required Delay in seconds field showing the placeholder 5, and the node ID.", "The <b>Delay</b> dialog."))
s += step(2, "Write a workflow with a pause", "See the same node as YAML.",
 ["Create a folder <code>delay-demo</code> with a <code>workflows</code> folder inside.", "Save the YAML below as <code>workflows\\wf_wait.yaml</code>."],
 "workflows\\wf_wait.yaml",
 "<p>Three steps of type <code>action</code>: a <code>log</code>, a <code>delay</code> and a second <code>log</code>. Each step depends on the previous one with <code>depends_on</code>, so the delay really sits between the two messages.</p><pre class=\"cmd\">" + YAML.replace("<","&lt;") + "</pre>",
 "A file of 23 lines.",
 "")
s += step(3, "Validate the workflow", "Check the file before you run it.",
 ["Open a terminal in the <code>delay-demo</code> folder.", "Run the command below."],
 "hdrctl workflow validate workflows\\wf_wait.yaml",
 "<p>Validation checks the actions, the keys, the parameters and the dependencies without running anything.</p>",
 "A confirmation line.",
 "Workflow valid — no errors detected.")
s += step(4, "Run it and watch the pause", "Measure the delay.",
 ["Run the command below.", "Read the duration of each step."],
 "hdrctl workflow run workflows\\wf_wait.yaml",
 "<p>The first log appears at once, then the run waits for the delay, then the second log appears. The summary reports the total time, which matches the delay because the log steps take no measurable time.</p>",
 "Three steps OK, the pause lasting 3.0 seconds, and a summary line.",
 "Workflow  wf_wait\n\n✓  Step 'before' OK (0.0s)\n   | Before the pause\n✓  Step 'pause' OK (3.0s)\n✓  Step 'after' OK (0.0s)\n   | After the pause\n\nWorkflow 'wf_wait' completed in 3.0s — 3/3 steps OK",
 fig(FD, "delay-workflow-run-terminal-output-dark", "The Hydra Studio terminal in the dark theme after running the wf_wait workflow: the steps before, pause and after are marked OK, the pause lasting 3.0 seconds, and the workflow completed in 3.0s with 3 of 3 steps OK.", "The same run, from the Studio terminal."))
s += rules([("TIP", "Use a delay to wait for something outside Hydra, such as a file that another system is still writing."),
 ("TIP", "Put the seconds in a parameter with the <b>{x}</b> button to change the pause without editing the workflow."),
 ("TRAP", "A delay adds its full duration to every run. Keep it as short as the wait you really need."),
 ("TIP", "Seconds can be decimal: <code>0.5</code> waits half a second.")])
s += tail([["Dialog", "The Delay node asks for Delay (seconds), marked required"], ["Validation", "<code>hdrctl workflow validate</code> prints Workflow valid"], ["Run", "The pause step reports 3.0s"], ["Total", "The workflow completes in 3.0s with 3/3 steps OK"]],
 [["The Delay dialog will not save", "Delay (seconds) is empty", "Enter a number, or a parameter reference"], ["The run fails on the delay step", "seconds is not a number", "Write a plain number such as <code>3</code> or <code>0.5</code>"], ["The pause does not happen", "The step does not sit between the others in depends_on", "Chain the steps with <code>depends_on</code>"], ["Workflow file not found", "The path is wrong", "Run the command from the folder that holds <code>workflows</code>"]],
 faq,
 '<li><a href="/studio/start-from-a-template">Start from a workflow template</a></li><li><a href="/studio/use-the-palette">Use the node palette</a></li><li><a href="/studio/12-compose-jobs">Compose jobs in a workflow</a></li><li><a href="/dsl">Hydra DSL reference</a></li>',
 "You can pause a workflow. The next lesson branches it with the Condition node.",
 '<a class="primary" href="/studio/12-compose-jobs">Compose jobs <span aria-hidden="true">→</span></a>') + CTA
(R/"src/_mock/studio-lesson-51-wait-with-the-delay-node.main.html").write_text(s, encoding="utf-8")
t = (R/"src/pages/studio/all-or-nothing-load.astro").read_text(encoding="utf-8")
HEAD = "Wait with the Hydra Studio Delay node: pause a workflow for N seconds"
DESC = "Pause a Hydra ETL workflow with the Delay node. Set the seconds, read the YAML, and run it to see the pause. Commands tested on Windows, Hydra ETL 0.22."
steps = ["Find the Delay node", "Write a workflow with a pause", "Validate the workflow", "Run it and watch the pause"]
t = t.replace("studio-lesson-42-all-or-nothing-load.main.html", "studio-lesson-51-wait-with-the-delay-node.main.html")
t = t.replace("all-or-nothing-load", SLUG)
t = re.sub(r'headline: "[^"]*"', lambda m: 'headline: '+json.dumps(HEAD), t, 1)
t = re.sub(r'(description: ")[^"]*(", datePublished)', lambda m: m.group(1)+DESC+m.group(2), t, 1)
t = re.sub(r"steps: \[.*?\],\n", lambda m: "steps: "+json.dumps(steps, ensure_ascii=False)+",\n", t, 1, flags=re.S)
t = re.sub(r"  faq: \[.*?\n  \],\n", lambda m: "  faq: [\n"+"".join(f"    [{json.dumps(q, ensure_ascii=False)}, {json.dumps(x, ensure_ascii=False)}],\n" for q, x in faq)+"  ],\n", t, 1, flags=re.S)
t = t.replace('["All-or-nothing load", ', '["Delay", ')
t = re.sub(r'<BaseLayout title="[^"]*" exactTitle="[^"]*" description="[^"]*"', '<BaseLayout title="Wait with the Hydra Studio Delay node" exactTitle="Hydra Studio Delay Node: Pause a Workflow | Hydra ETL" description="'+DESC+'"', t, 1)
(R/("src/pages/studio/"+SLUG+".astro")).write_text(t, encoding="utf-8")
p = R/"src/data/studio-lessons.js"; h = p.read_text(encoding="utf-8")
h = h.replace('{"label": "Delay", "group"', '{"slug": "'+SLUG+'", "label": "Delay", "group"', 1)
p.write_text(h, encoding="utf-8")
print("ok", len(s))
