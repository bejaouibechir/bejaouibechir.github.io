"""Lesson 'Stages' (plan n. 37): new lesson, slug run-steps-in-sequence-or-in-parallel."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
src = (R/"tools/tutorials/blocks/gen_jobs_block.py").read_text(encoding="utf-8")
exec(src.split("F6, F7, F9 =")[0])   # helpers: fig, head, step, rules, table, tail, CTA
SLUG = "run-steps-in-sequence-or-in-parallel"
FS = "studio-stages"
P = R/"tools/tutorials/probe-stages/workflows"
THREAD = (P/"thread.yaml").read_text(encoding="utf-8").rstrip()
SALES = (P/"load_sales.yaml").read_text(encoding="utf-8").rstrip()
esc = lambda x: x.replace("<","&lt;").replace(">","&gt;")
faq = [
 ("What is a stage in thread.yaml?", "A stage is one entry of the thread list in workflows/thread.yaml. It has a mode, sequential or parallel, and a list of workflows. Stages run one after the other, and hdrctl run reads them in order."),
 ("How do I run two workflows at the same time in Hydra?", "Put them in the same stage with mode: parallel. In our test, two workflows of 2.2 seconds each finished together, and the whole project took 3.3 seconds instead of 5.4 with the same stage set to sequential."),
 ("What does delay_after do?", "delay_after pauses the project after a stage, before the next one starts. It takes a number of seconds or a duration such as 500ms, 30s, 5m or 1h. The run prints a line saying it is waiting."),
 ("How do I skip a workflow without deleting it?", "Add active: false to the workflow in thread.yaml. The run prints that the workflow is inactive and skipped, and counts only the others. In our test, 3 of 3 remaining workflows ran."),
 ("What happens when a workflow in a stage fails?", "The Studio Execution order page states that a failed workflow stops the project. This lesson only ran successful workflows, so it did not reproduce a failure."),
]
s = head(37, 65, "Stages", "Run Hydra workflows in sequence or in parallel with stages",
 "Stages in thread.yaml decide which workflows run one after another and which run together. Build four workflows, run them, and measure what parallel saves.",
 '<span class="mono">thread.yaml</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "A Hydra project runs its workflows in <b>stages</b>, declared in <code>workflows/thread.yaml</code>. A <code>sequential</code> stage runs its workflows one after the other and a <code>parallel</code> stage runs them together. In our test, two 2-second workflows took 3.3 seconds in a parallel stage and 5.4 seconds in a sequential one.",
 "Write a project with three stages, run it with <code>hdrctl run</code>, compare parallel with sequential, and skip a workflow with <code>active: false</code>.",
 "Hydra ETL 0.22 installed. The run uses only the command line. The commands are the Windows ones.")
s = s.replace("Published 4 November 2026", "Published 23 November 2026")
s = re.sub(r'  <div class="callout"><b>Course project</b>.*?</div>\n', '', s, count=1, flags=re.S)
s = re.sub(r'<h3>Prerequisites</h3><ul>.*?</ul>', '<h3>Prerequisites</h3><ul><li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A project folder: a folder that contains a <code>.hydra</code> subfolder. <a href="/studio/01-open-a-project">Create a project</a> shows how to make one in Studio.</li></ul>', s, count=1, flags=re.S)
s += "  <h2>How do I run workflows in stages?</h2>\n\n"
s += step(1, "Write four small workflows", "Have something to order.",
 ["In the <code>workflows</code> folder of the project, create <code>prepare.yaml</code>, <code>load_sales.yaml</code>, <code>load_stock.yaml</code> and <code>report.yaml</code>.", "Give <code>load_sales</code> and <code>load_stock</code> a Python step that waits 2 seconds; give the other two a <b>log</b> step."],
 "workflows\\load_sales.yaml",
 "<p>The two loads stand for slow work. <code>load_stock</code> is identical except for its name and message. <code>prepare</code> and <code>report</code> each hold one <code>log</code> step.</p><pre class=\"cmd\">" + esc(SALES) + "</pre>",
 "Four files in <code>workflows</code>.",
 "")
s += step(2, "Declare the stages", "Say which workflows wait for which.",
 ["Create <code>workflows\\thread.yaml</code> with the content below.", "Read it from top to bottom: one stage per dash under <code>thread</code>."],
 "workflows\\thread.yaml",
 "<p>Three stages. Stage 1 runs <code>prepare</code>. Stage 2 is <code>parallel</code>: <code>load_sales</code> and <code>load_stock</code> start together, then the project waits <code>1s</code> (<code>delay_after</code>). Stage 3 runs <code>report</code>. Each <code>name</code> is the file name in <code>workflows</code>, without <code>.yaml</code>.</p><pre class=\"cmd\">" + esc(THREAD) + "</pre>",
 "A file of %d lines." % len(THREAD.splitlines()),
 "")
s += step(3, "Run the project", "Watch the stages go by.",
 ["Open a terminal in the project folder.", "Run the command below."],
 "hdrctl run .",
 "<p>In a project folder, <code>hdrctl run .</code> runs every workflow in the order of <code>thread.yaml</code>. Each stage prints a header with its number and mode. In the parallel stage, both workflows start before either one finishes.</p>",
 "Three stage headers, every workflow OK, a one second wait, and a final summary.",
 "Stage 1/3 — sequential\n▶ Workflow  prepare\n  ✓ Step 'say_prepare' OK (0.0s)\n  | Prepare: folders ready\n✓ Workflow 'prepare' OK (0.0s)\n\nStage 2/3 — parallel\n▶ Workflow  load_sales\n▶ Workflow  load_stock\n  ✓ Step 'work_load_sales' OK (2.2s)\n  | load_sales done\n✓ Workflow 'load_sales' OK (2.2s)\n  ✓ Step 'work_load_stock' OK (2.2s)\n  | load_stock done\n✓ Workflow 'load_stock' OK (2.2s)\n  Waiting 1s before the next stage\n\nStage 3/3 — sequential\n▶ Workflow  report\n  ✓ Step 'say_report' OK (0.0s)\n  | Report: all loads finished\n✓ Workflow 'report' OK (0.0s)\n\nProject 'stages-demo' completed in 3.3s — 4/4 workflow(s) OK",
 fig(FS, "stages-parallel-run-terminal-output-light", "The Hydra Studio terminal after hdrctl run in a project with three stages: a sequential stage, a parallel stage running two workflows at once, then a sequential stage, finishing in 3.3 seconds with 4 of 4 workflows OK.", "The run in the Studio terminal. The two loads start together."))
s += step(4, "Compare with a sequential stage", "Measure what parallel saves.",
 ["In <code>thread.yaml</code>, change the second stage to <code>mode: sequential</code>.", "Run <code>hdrctl run .</code> again."],
 "mode: sequential\nhdrctl run .",
 "<p>The two loads now run one after the other. Each still takes about 2 seconds, so the stage takes the sum instead of the longest.</p>",
 "<code>load_stock</code> starts only after <code>load_sales</code> ends, and the total grows.",
 "Stage 2/3 — sequential\n▶ Workflow  load_sales\n  ✓ Step 'work_load_sales' OK (2.2s)\n  | load_sales done\n✓ Workflow 'load_sales' OK (2.2s)\n▶ Workflow  load_stock\n  ✓ Step 'work_load_stock' OK (2.1s)\n  | load_stock done\n✓ Workflow 'load_stock' OK (2.1s)\n  Waiting 1s before the next stage\n…\nProject 'stages-demo' completed in 5.4s — 4/4 workflow(s) OK",
 fig(FS, "stages-sequential-run-terminal-output-dark", "The Hydra Studio terminal in the dark theme after hdrctl run in a project where all three stages are sequential: load_sales ends before load_stock starts and the project completes in 5.4 seconds.", "The same project with the second stage sequential."))
s += step(5, "Skip a workflow", "Keep a workflow in the file but leave it out of the run.",
 ["Set the second stage back to <code>parallel</code>.", "Under <code>load_stock</code>, add <code>active: false</code>.", "Run <code>hdrctl run .</code> again."],
 "      - name: load_stock\n        active: false\nhdrctl run .",
 "<p><code>active: false</code> is the way to leave a workflow out while debugging, without deleting its line. The run names it and does not count it.</p>",
 "A line saying <code>load_stock</code> is inactive, and one workflow fewer in the summary.",
 "Stage 2/3 — parallel\n▶ Workflow  load_sales\n  ✓ Step 'work_load_sales' OK (2.2s)\n  | load_sales done\n✓ Workflow 'load_sales' OK (2.2s)\n  load_stock — inactive, skipped\n…\nProject 'stages-demo' completed in 3.2s — 3/3 workflow(s) OK")
s += rules([("TIP", "Put workflows that do not depend on each other in a <code>parallel</code> stage, and keep ordered work in separate <code>sequential</code> stages."),
 ("TIP", "Use <code>delay_after</code> to leave a system time to settle between two stages. It accepts <code>500ms</code>, <code>30s</code>, <code>5m</code> or <code>1h</code>."),
 ("TRAP", "Parallel only helps when the work waits. Two workflows that share one slow resource, such as the same database, can take as long as running them in sequence."),
 ("TIP", "Edit the order in Studio instead of YAML: <a href=\"/studio/global-and-project-settings\">Project settings</a> has an Execution order tab for this file.")])
s += tail([["Run", "<code>hdrctl run .</code> prints Stage 1/3, 2/3 and 3/3 with their modes"], ["Parallel", "Both workflows of the stage start before either one finishes"], ["Time", "3.3 seconds in parallel against 5.4 sequentially"], ["Skip", "An inactive workflow is named and not counted"]],
 [["The project is treated as a single job", "The folder has no <code>.hydra</code> subfolder, or has job files at its root", "Run the command from a project folder, with workflows in <code>workflows</code>"], ["A workflow is not found", "The <code>name</code> does not match a file in <code>workflows</code>", "Use the file name without <code>.yaml</code>"], ["Parallel is not faster", "The workflows are short, or wait on the same resource", "Measure each workflow alone before choosing the mode"], ["A workflow does not run", "It has <code>active: false</code>", "Remove the line or set it to <code>true</code>"]],
 faq,
 '<li><a href="/studio/12-compose-jobs">Compose jobs in a workflow</a></li><li><a href="/studio/wait-with-the-delay-node">Wait with the Delay node</a></li><li><a href="/studio/global-and-project-settings">Project settings and Global settings</a></li><li><a href="/studio/start-from-a-template">Start from a workflow template</a></li>',
 "You can run workflows in order, in parallel, and leave one out. Next, repeat part of a project and pause between steps.",
 '<a class="primary" href="/studio">Back to the lessons <span aria-hidden="true">→</span></a>') + CTA
(R/"src/_mock/studio-lesson-37-run-steps-in-sequence-or-in-parallel.main.html").write_text(s, encoding="utf-8")
t = (R/"src/pages/studio/all-or-nothing-load.astro").read_text(encoding="utf-8")
HEAD = "Run Hydra workflows in sequence or in parallel with stages"
DESC = "Declare stages in thread.yaml, run workflows in sequence or in parallel with hdrctl run, and compare timings. Tested on Windows, Hydra ETL 0.22."
steps = ["Write four small workflows", "Declare the stages", "Run the project", "Compare with a sequential stage", "Skip a workflow"]
t = t.replace("studio-lesson-42-all-or-nothing-load.main.html", "studio-lesson-37-run-steps-in-sequence-or-in-parallel.main.html")
t = t.replace("all-or-nothing-load", SLUG)
t = re.sub(r'headline: "[^"]*"', lambda m: 'headline: '+json.dumps(HEAD), t, 1)
t = re.sub(r'(description: ")[^"]*(", datePublished)', lambda m: m.group(1)+DESC+m.group(2), t, 1)
t = re.sub(r"steps: \[.*?\],\n", lambda m: "steps: "+json.dumps(steps, ensure_ascii=False)+",\n", t, 1, flags=re.S)
t = re.sub(r"  faq: \[.*?\n  \],\n", lambda m: "  faq: [\n"+"".join(f"    [{json.dumps(q, ensure_ascii=False)}, {json.dumps(x, ensure_ascii=False)}],\n" for q, x in faq)+"  ],\n", t, 1, flags=re.S)
t = t.replace('["All-or-nothing load", ', '["Stages", ')
t = re.sub(r'<BaseLayout title="[^"]*" exactTitle="[^"]*" description="[^"]*"', '<BaseLayout title="Run Hydra workflows in sequence or in parallel" exactTitle="Hydra Stages: Sequential and Parallel Workflows | Hydra ETL" description="'+DESC+'"', t, 1)
(R/("src/pages/studio/"+SLUG+".astro")).write_text(t, encoding="utf-8")
p = R/"src/data/studio-lessons.js"; h = p.read_text(encoding="utf-8")
h = h.replace('{"label": "Stages", "group"', '{"slug": "'+SLUG+'", "label": "Stages", "group"', 1)
h = h.replace('"title": "Run steps in sequence or in parallel", "description": "Stages, parallel steps and where they pay off."', '"title": "Run workflows in sequence or in parallel", "description": "Declare stages in thread.yaml, run workflows together and measure what parallel saves."', 1)
p.write_text(h, encoding="utf-8")
print("ok", len(s))
