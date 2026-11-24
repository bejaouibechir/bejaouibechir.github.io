"""Lesson 'Tour the pages' (plan n. 4): new lesson, slug tour-the-pages."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
src = (R/"tools/tutorials/blocks/gen_jobs_block.py").read_text(encoding="utf-8")
exec(src.split("F6, F7, F9 =")[0])   # helpers: fig, head, step, rules, table, tail, CTA
SLUG = "branch-with-the-condition-node"
FD = "studio-condition"
YAML = open(R/"tools/tutorials/probe-cond/workflows/wf_branch.yaml", encoding="utf-8").read().rstrip()
NL = len(YAML.splitlines())
faq = [
 ("What does the Condition node do in Hydra Studio?", "It evaluates a condition and stores the true or false result in a variable. Steps that come after it read that variable in their run condition, written when in YAML, so a step runs only on the matching branch."),
 ("How do I make a step run only when a condition is true?", "Give the Condition node a result variable name, such as big, then set the Run condition (when) of the downstream step to {{ param:big }}. For the opposite branch, use not {{ param:big }}."),
 ("What is the difference between Expression and Structured mode?", "Structured mode compares a left value and a right value with an operator such as ==, !=, <, <=, > or >=, or contains. Expression mode takes a free boolean expression with comparisons, and, or and not, evaluated without running any code."),
 ("What happens to the step on the other branch?", "It is skipped. In our test the run reported Step 'small_batch' skipped, and the workflow still completed with all steps OK."),
 ("Where does the value being compared come from?", "From a project parameter, an environment variable or a runtime parameter, written as {{ param:name }}. In our test a set_param step created count with the value 15 before the condition ran."),
]
s = head(50, 65, "Condition", "Branch a Hydra Studio workflow with the Condition node",
 "The Condition node turns a comparison into a true or false variable. Steps that follow read it in their run condition, so one workflow can take two paths.",
 '<span class="mono">Condition</span><span>about 15 minutes</span><span>Hydra ETL 0.22</span>',
 "The <b>Condition</b> node of Hydra Studio evaluates a comparison and stores the result in a variable. A later step reads it with <code>when: \"{{ param:big }}\"</code> and runs only if it is true. In our test, a count of 15 above 10 ran the <i>big</i> path and skipped the other.",
 "Read the Condition dialog, write a workflow with two branches, run it, and see which step runs and which is skipped.",
 "Hydra ETL 0.22 installed. Studio is optional: the run uses only the command line.")
s = s.replace("Published 4 November 2026", "Published 23 November 2026")
import re as _re
s = _re.sub(r'  <div class="callout"><b>Course project</b>.*?</div>\n', '', s, count=1, flags=_re.S)
s = _re.sub(r'<h3>Prerequisites</h3><ul>.*?</ul>', '<h3>Prerequisites</h3><ul><li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A terminal: PowerShell on Windows.</li></ul>', s, count=1, flags=_re.S)
s += "  <h2>How do I branch a workflow with a Condition?</h2>\n\n"
s += step(1, "Open the Condition dialog", "Read what the node asks for.",
 ["Open a workflow in <b>Workflow configuration</b>.", "Expand <b>Control Flow</b>, drag <b>Condition</b> onto the canvas and double-click it.", "Select <b>Structured</b>."],
 "Palette → Control Flow → Condition",
 "<p>The dialog says it <i>evaluates a condition into a variable (used by downstream when)</i>. The <b>result variable name</b> is the name later steps use, as <code>{{ param:&lt;name&gt; }}</code>. Two modes follow: <b>Expression</b> for a free boolean expression, and <b>Structured</b> for a left value, an operator and a right value.</p>",
 "A dialog with a CONTROL_FLOW badge, the result variable name, the two mode buttons, and the three structured fields.",
 "Condition   CONTROL_FLOW\nResult variable name: check\n[ Expression ] [ Structured ]   {{ param:count }}  ==  10",
 fig(FD, "condition-node-dialog-structured-mode-light", "The Condition node dialog of Hydra Studio in the light theme, Structured mode selected: a step name, a result variable name field, Expression and Structured buttons, and left, operator and right fields.", "The <b>Condition</b> dialog in Structured mode."))
s += step(2, "Write a workflow with two branches", "See the same logic as YAML.",
 ["Create a folder <code>cond-demo</code> with a <code>workflows</code> folder inside.", "Save the YAML below as <code>workflows\\wf_branch.yaml</code>."],
 "workflows\\wf_branch.yaml",
 "<p><code>set_count</code> creates a runtime parameter <code>count</code> with the value 15. <code>check</code> compares it with 10 and stores the result in <code>big</code>. The two log steps both depend on <code>check</code> and carry opposite <code>when</code> guards.</p><pre class=\"cmd\">" + YAML.replace("<","&lt;").replace(">","&gt;") + "</pre>",
 "A file of %d lines." % NL,
 "")
s += step(3, "Validate the workflow", "Check the file before you run it.",
 ["Open a terminal in the <code>cond-demo</code> folder.", "Run the command below."],
 "hdrctl workflow validate workflows\\wf_branch.yaml",
 "<p>Validation checks the actions, keys, parameters and dependencies without running anything.</p>",
 "A confirmation line.",
 "Workflow valid — no errors detected.")
s += step(4, "Run it and read the two branches", "See one path run and the other skipped.",
 ["Run the command below.", "Find the skipped step."],
 "hdrctl workflow run workflows\\wf_branch.yaml",
 "<p>Because 15 is greater than 10, <code>big</code> is true: <code>big_batch</code> runs and logs its message, and <code>small_batch</code> is skipped. Change <code>value: 15</code> to <code>5</code> and run again to take the other path.</p>",
 "Four steps OK, one of them reported as skipped.",
 "✓  Step 'set_count' OK (0.0s)\n✓  Step 'check' OK (0.0s)\n⏭  Step 'small_batch' skipped\n✓  Step 'big_batch' OK (0.0s)\n   | Big batch path\n\nWorkflow 'wf_branch' completed in 0.0s — 4/4 steps OK",
 fig(FD, "condition-workflow-run-terminal-output-dark", "The Hydra Studio terminal in the dark theme after running the wf_branch workflow: set_count and check are OK, small_batch is skipped, big_batch is OK with the message Big batch path, and the workflow completed with 4 of 4 steps OK.", "The same run, from the Studio terminal."))
s += rules([("TIP", "Name the result variable after the question it answers, for example <code>big</code> or <code>file_ready</code>."),
 ("TIP", "Write the opposite branch with <code>not {{ param:name }}</code>."),
 ("TRAP", "A skipped step counts as a normal outcome. The workflow still ends with all steps OK, so check the skipped lines when you read a run."),
 ("TIP", "Keep the <code>depends_on</code> of both branches on the Condition step, so they only start after it has decided.")])
s += tail([["Dialog", "Result variable name, Expression and Structured modes"], ["Validation", "<code>hdrctl workflow validate</code> prints Workflow valid"], ["Run with count 15", "big_batch runs, small_batch is skipped"], ["Run with count 5", "small_batch runs, big_batch is skipped"]],
 [["Both branches run", "A step has no <code>when</code> guard", "Add a <code>when</code> to every step that depends on the condition"], ["Neither branch runs", "The variable name in <code>when</code> differs from the result variable name", "Use the same name in both places"], ["One step shows skipped", "Its <code>when</code> guard is false", "This is the expected outcome on the branch not taken"], ["Workflow file not found", "The path is wrong", "Run the command from the folder that holds <code>workflows</code>"]],
 faq,
 '<li><a href="/studio/wait-with-the-delay-node">Wait with the Delay node</a></li><li><a href="/studio/use-the-palette">Use the node palette</a></li><li><a href="/studio/14-use-parameters">Use parameters</a></li><li><a href="/dsl">Hydra DSL reference</a></li>',
 "You can branch a workflow. Next, learn how to group steps and run them in stages.",
 '<a class="primary" href="/studio/12-compose-jobs">Compose jobs <span aria-hidden="true">→</span></a>') + CTA
(R/"src/_mock/studio-lesson-50-branch-with-the-condition-node.main.html").write_text(s, encoding="utf-8")
t = (R/"src/pages/studio/all-or-nothing-load.astro").read_text(encoding="utf-8")
HEAD = "Branch a Hydra Studio workflow with the Condition node"
DESC = "Branch a Hydra ETL workflow with the Condition node: set a variable, guard steps with when, and see one path run and the other skipped. Hydra ETL 0.22."
steps = ["Open the Condition dialog", "Write a workflow with two branches", "Validate the workflow", "Run it and read the two branches"]
t = t.replace("studio-lesson-42-all-or-nothing-load.main.html", "studio-lesson-50-branch-with-the-condition-node.main.html")
t = t.replace("all-or-nothing-load", SLUG)
t = re.sub(r'headline: "[^"]*"', lambda m: 'headline: '+json.dumps(HEAD), t, 1)
t = re.sub(r'(description: ")[^"]*(", datePublished)', lambda m: m.group(1)+DESC+m.group(2), t, 1)
t = re.sub(r"steps: \[.*?\],\n", lambda m: "steps: "+json.dumps(steps, ensure_ascii=False)+",\n", t, 1, flags=re.S)
t = re.sub(r"  faq: \[.*?\n  \],\n", lambda m: "  faq: [\n"+"".join(f"    [{json.dumps(q, ensure_ascii=False)}, {json.dumps(x, ensure_ascii=False)}],\n" for q, x in faq)+"  ],\n", t, 1, flags=re.S)
t = t.replace('["All-or-nothing load", ', '["Condition", ')
t = re.sub(r'<BaseLayout title="[^"]*" exactTitle="[^"]*" description="[^"]*"', '<BaseLayout title="Branch with the Hydra Studio Condition node" exactTitle="Hydra Studio Condition Node: Branch a Workflow | Hydra ETL" description="'+DESC+'"', t, 1)
(R/("src/pages/studio/"+SLUG+".astro")).write_text(t, encoding="utf-8")
p = R/"src/data/studio-lessons.js"; h = p.read_text(encoding="utf-8")
h = h.replace('{"label": "Condition", "group"', '{"slug": "'+SLUG+'", "label": "Condition", "group"', 1)
p.write_text(h, encoding="utf-8")
print("ok", len(s))
