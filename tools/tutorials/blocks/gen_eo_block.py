"""Lessons 'Execution order' Define / Preview / Check (plan n. 34, 35, 36)."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
src = (R/"tools/tutorials/blocks/gen_jobs_block.py").read_text(encoding="utf-8")
exec(src.split("F6, F7, F9 =")[0])   # helpers
FS = "studio-execution-order"
esc = lambda x: x.replace("<","&lt;").replace(">","&gt;")
T_DEMO = esc((R/"tools/tutorials/eo-demo/workflows/thread.yaml").read_text(encoding="utf-8").rstrip())
T_FULL = esc((R/"tools/tutorials/eo-full/workflows/thread.yaml").read_text(encoding="utf-8").rstrip())
T_BAD = esc((R/"tools/tutorials/eo-bad/workflows/thread.yaml").read_text(encoding="utf-8").rstrip())
PRE = ('<h3>Prerequisites</h3><ul><li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>'
       '<li>A project with a few workflows, such as the one built in <a href="/studio/run-steps-in-sequence-or-in-parallel">Stages</a>. The screenshots use that project plus a <code>cleanup</code> workflow that is not in the thread.</li></ul>')
def common(num, label, h1, lead, meta, quick, goal, h2):
    s = head(num, 65, label, h1, lead, meta, quick, goal, "Hydra ETL 0.22 with Studio running, and a project with workflows.")
    s = s.replace("Published 4 November 2026", "Published 23 November 2026")
    s = re.sub(r'  <div class="callout"><b>Course project</b>.*?</div>\n', '', s, count=1, flags=re.S)
    s = re.sub(r'<h3>Prerequisites</h3><ul>.*?</ul>', PRE, s, count=1, flags=re.S)
    return s + "  <h2>" + h2 + "</h2>\n\n"
def publish(num, slug, label, s, HEAD, TITLE, EXACT, DESC, steps, faq, hubtitle, hubdesc):
    (R/("src/_mock/studio-lesson-%02d-%s.main.html" % (num, slug))).write_text(s, encoding="utf-8")
    t = (R/"src/pages/studio/all-or-nothing-load.astro").read_text(encoding="utf-8")
    t = t.replace("studio-lesson-42-all-or-nothing-load.main.html", "studio-lesson-%02d-%s.main.html" % (num, slug))
    t = t.replace("all-or-nothing-load", slug)
    t = re.sub(r'headline: "[^"]*"', lambda m: 'headline: '+json.dumps(HEAD), t, 1)
    t = re.sub(r'(description: ")[^"]*(", datePublished)', lambda m: m.group(1)+DESC+m.group(2), t, 1)
    t = re.sub(r"steps: \[.*?\],\n", lambda m: "steps: "+json.dumps(steps, ensure_ascii=False)+",\n", t, 1, flags=re.S)
    t = re.sub(r"  faq: \[.*?\n  \],\n", lambda m: "  faq: [\n"+"".join(f"    [{json.dumps(q, ensure_ascii=False)}, {json.dumps(x, ensure_ascii=False)}],\n" for q, x in faq)+"  ],\n", t, 1, flags=re.S)
    t = t.replace('["All-or-nothing load", ', '["%s", ' % label)
    t = re.sub(r'<BaseLayout title="[^"]*" exactTitle="[^"]*" description="[^"]*"', '<BaseLayout title="'+TITLE+'" exactTitle="'+EXACT+'" description="'+DESC+'"', t, 1)
    (R/("src/pages/studio/"+slug+".astro")).write_text(t, encoding="utf-8")
    p = R/"src/data/studio-lessons.js"; h = p.read_text(encoding="utf-8")
    h = re.sub(r'\{"label": "%s", "group": ("[^"]*"), "command": ("[^"]*"), "title": "[^"]*", "description": "[^"]*"\}' % re.escape(label),
               lambda m: '{"slug": "%s", "label": "%s", "group": %s, "command": %s, "title": "%s", "description": "%s"}' % (slug, label, m.group(1), m.group(2), hubtitle, hubdesc), h, 1)
    p.write_text(h, encoding="utf-8")
    print("ok", slug, len(s))
REL = '<li><a href="/studio/run-steps-in-sequence-or-in-parallel">Run workflows in sequence or in parallel</a></li><li><a href="/studio/repeat-workflows-with-loops">Repeat workflows with loops</a></li><li><a href="/studio/global-and-project-settings">Project settings and Global settings</a></li>'

# ---------- DEFINE ----------
faq = [
 ("Where do I edit the execution order in Hydra Studio?", "Open Settings, then Project settings, then the Execution order tab, and keep Define selected. The tab edits the file workflows/thread.yaml of the project, which hdrctl run reads."),
 ("How do I add a workflow to the thread in Studio?", "Workflows that exist in the project but are not in the thread are listed after the words Not in the thread. Click one to add it at the end. The Save button then becomes active."),
 ("How do I skip a workflow without deleting it?", "Untick the checkbox in front of its name. Studio treats an unticked workflow as skipped. The cross at the end of its row removes it from the thread and keeps the workflow file."),
 ("Does the execution order apply to a single workflow?", "No. It orders the workflows of a whole project. A workflow run on its own from the canvas, or with hdrctl workflow run, does not use thread.yaml."),
 ("What happens if I leave the page with unsaved changes?", "Studio asks for confirmation before you leave or reload the tab, according to the Studio source. This lesson did not trigger that prompt."),
]
s = common(34, "Execution order: Define", "Define the execution order of a Hydra project in Studio",
 "The Define tab of Execution order edits workflows/thread.yaml: stages, modes, waits, skipped workflows and loops. Read it, add a workflow and see what Save means.",
 '<span class="mono">Execution order</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<b>Execution order</b> is a tab of <b>Project settings</b> that edits <code>workflows/thread.yaml</code>. Its <b>Define</b> view lists the stages of the project; each stage has a mode, a wait and its workflows, and a Loops box repeats part of the thread.",
 "Open Define, read a stage, add a workflow that is not yet in the thread, and see how Studio flags a change that is not saved.",
 "How do I define the execution order in Studio?")
s += step(1, "Open Execution order", "Find the editor of thread.yaml.",
 ["Click <b>Settings</b> in the sidebar, then <b>Project settings</b>.", "Stay on the <b>Execution order</b> tab and select <b>Define</b>."],
 "Settings → Project settings → Execution order → Define",
 "<p>The header repeats the file name, <code>workflows/thread.yaml</code>, and the project page says the order is saved there for everyone who opens the project. The button at the top right reads <b>Saved</b> while nothing has changed.</p>",
 "One box per stage, a Loops box at the bottom, and a <b>Saved</b> button.",
 "Execution order   workflows/thread.yaml   [Define] [Preview]   Check   Saved\nStage 1  sequential  then wait 0\nStage 2  parallel    then wait 1s\nStage 3  sequential  then wait 0",
 fig(FS, "execution-order-define-stages-and-loops-light", "The Define tab of Execution order in Hydra Studio Project settings: three stages with their mode, wait fields and workflows, an Add stage button, a Not in the thread list, and a Loops box with one loop.", "The <b>Define</b> tab of a project with three stages and one loop."))
s += step(2, "Read a stage", "Know every control on a row.",
 ["Read <b>Stage 2</b>: its mode list says <code>parallel</code> and <b>then wait</b> says <code>1s</code>.", "Read a workflow row: checkbox, name, <b>wait</b>, <b>max</b>, then the lifebuoy, arrows and cross buttons."],
 "thread.yaml",
 "<p>The stage mode and the wait after the stage are <code>mode</code> and <code>delay_after</code> in the file. On a row, <b>wait</b> pauses before that workflow starts, <b>max</b> is its maximum duration and the lifebuoy adds a fallback workflow. The arrows move a workflow up or down and the cross removes it from the thread without deleting its file. This is the thread behind the screenshot:</p><pre class=\"cmd\">" + T_DEMO + "</pre>",
 "The same three stages as the YAML above.",
 "")
s += step(3, "Add a workflow", "Put a workflow that is not run yet into the thread.",
 ["Under the stages, find <b>Not in the thread (not run)</b>.", "Click <b>+ cleanup</b>."],
 "+ cleanup",
 "<p>The workflow joins the list and the button at the top right changes from <b>Saved</b> to <b>Save</b>: the change exists only in the editor until you save it. Our click added <code>cleanup</code> after <code>report</code>, in stage 3.</p>",
 "<code>cleanup</code> appears in a stage, and <b>Save</b> is enabled.",
 "Stage 3  sequential  then wait 0\n  [x] report\n  [x] cleanup\nSave",
 fig(FS, "execution-order-define-unsaved-change-dark", "The Define tab after adding the cleanup workflow to the thread: the workflow joins the list and the Save button is enabled because the change is not saved yet.", "<code>cleanup</code> added to stage 3, not saved yet."))
s += step(4, "Repeat part of the thread", "Use the Loops box.",
 ["In the <b>Loops</b> box, read the sentence: <b>After</b> a workflow, <b>go back to</b> another, for a number of <b>passes in total</b>, with a <b>pause before each repeat</b>.", "Click <b>Add loop</b> to create a new one."],
 "Loops → Add loop",
 "<p>The box in the screenshot reads: after <code>report</code> go back to <code>prepare</code>, 2 passes in total, pause <code>1s</code>. It is the <code>loops</code> entry of <code>thread.yaml</code> covered in <a href=\"/studio/repeat-workflows-with-loops\">Repeat workflows with loops</a>. Studio offers the last workflow as the starting point and the first one as the destination; change both lists to fit.</p>",
 "A loop row with two lists, a number and a pause field.",
 "After [report] go back to [prepare] — passes in total [2] pause before each repeat [1s]")
s += step(5, "Save, then check", "Write the file.",
 ["Click <b>Save</b>.", "Continue with the <b>Preview</b> and <b>Check</b> lessons to see the result before running."],
 "Save",
 "<p><b>Save</b> writes <code>workflows/thread.yaml</code>. Pressing <b>Check</b> while there are unsaved changes saves them first, according to the Studio source.</p>",
 "The button goes back to <b>Saved</b>.",
 "Saved")
s += rules([("TIP", "Untick a workflow instead of removing it while you debug: its place in the order is kept."),
 ("TIP", "Type waits as <code>500ms</code>, <code>30s</code>, <code>5m</code> or <code>1h</code>. Studio outlines a wrong value in red and shows the accepted formats."),
 ("TRAP", "Fallback workflows do not appear under <b>Not in the thread</b>: they run only in place of the workflow that declares them."),
 ("TRAP", "Changes stay in the editor until you press <b>Save</b>. Reloading the page can lose them.")])
s += tail([["Location", "Settings → Project settings → Execution order"], ["Stages", "Each stage shows its mode, wait and workflows"], ["Edit", "Adding a workflow enables Save"], ["Saved", "The button reads Saved when the file is written"]],
 [["A workflow is missing from the list", "It is not in the thread, or it is a fallback", "Look under Not in the thread, or open its owner's fallback"], ["The wait field turns red", "The value is not a number or a duration", "Use 500ms, 30s, 5m or 1h"], ["Save stays disabled", "No change, or a field is invalid", "Fix the red field, then save"], ["The tab shows no workflows", "The project has no workflows folder", "Create workflows first, see the Stages lesson"]],
 faq, REL + '<li><a href="/studio/preview-the-execution-order">Preview the execution order</a></li>',
 "You can set the order of a project. Next, read it as a diagram.",
 '<a class="primary" href="/studio/preview-the-execution-order">Preview the order <span aria-hidden="true">→</span></a>') + CTA
publish(34, "define-the-execution-order", "Execution order: Define", s,
 "Define the execution order of a Hydra project in Studio", "Define the execution order of a Hydra project", "Hydra Execution Order: Define Stages in Studio | Hydra ETL",
 "Edit workflows/thread.yaml from Studio: stages, parallel mode, waits, skipped workflows and loops in the Define tab. Tested with Hydra ETL 0.22.",
 ["Open Execution order", "Read a stage", "Add a workflow", "Repeat part of the thread", "Save, then check"], faq,
 "Define the execution order", "Set stages, modes, waits and loops in Project settings.")

# ---------- PREVIEW ----------
faq = [
 ("What does the Preview tab show?", "Preview draws the thread as a diagram, from left to right: one column per stage, parallel workflows stacked, waits as diamonds, loops as a dashed arrow and fallbacks as dashed blocks. It draws what is in the editor."),
 ("How do I see which workflows run in parallel?", "Parallel workflows are stacked in the same column. In our project, load_sales sits above load_stock, between prepare and report."),
 ("What do the clock and hourglass mean?", "The clock marks a wait before a workflow starts, and the hourglass its maximum duration. In our test the diagram showed 2s on load_stock and 30s on load_sales."),
 ("Does Preview run anything?", "No. It only draws the thread. To rehearse the order from a terminal without running workflows, use hdrctl run with --dry-run."),
 ("Can I open a workflow from the diagram?", "Yes, according to the legend under the diagram and the Studio source: a click on a block opens that workflow. This lesson did not click a block."),
]
s = common(35, "Execution order: Preview", "Preview the execution order of a Hydra project",
 "The Preview tab draws workflows/thread.yaml as a diagram: stages, parallel blocks, waits, loops and fallbacks. Read it before you run anything.",
 '<span class="mono">Preview</span><span>about 5 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<b>Preview</b> turns the execution order into a diagram that reads from left to right. Stages are columns, parallel workflows are stacked, a diamond is a wait, a dashed blue arrow is a loop and a dashed orange block is a fallback. Nothing is run.",
 "Open Preview, read each symbol, and compare a plain thread with one that has a wait, a maximum duration and a fallback.",
 "How do I preview the execution order?")
s += step(1, "Open Preview", "See the thread as a diagram.",
 ["Open <b>Settings</b> → <b>Project settings</b> → <b>Execution order</b>.", "Click <b>Preview</b> next to <b>Define</b>."],
 "Execution order → Preview",
 "<p>The diagram follows the stages left to right: <code>prepare</code>, then <code>load_sales</code> and <code>load_stock</code> stacked, then <code>report</code>. A diamond labeled <code>1s</code> sits between stage 2 and stage 3, and a dashed arrow goes back from <code>report</code> to <code>prepare</code> with the label <code>×2</code> and its own <code>1s</code> pause.</p>",
 "Four blocks, a diamond, and a dashed loop arrow.",
 "prepare → [ load_sales / load_stock ] → ◇ 1s → report\n          ╰─ loop ×2 · 1s ─ back to prepare",
 fig(FS, "execution-order-preview-diagram-dark", "The Preview tab of Execution order: boxes for prepare, load_sales, load_stock and report from left to right, the two loads stacked, a one second wait marker and a dashed loop arrow.", "The diagram of the Stages project, with a loop."))
s += step(2, "Read the legend", "Learn the symbols.",
 ["Read the text under the diagram.", "Match each symbol with the YAML key behind it."],
 "thread.yaml",
 "<p>The legend says: stages run in order from left to right, stacked blocks run in parallel, a diamond is a wait before the next stage, a dashed blue arrow is a loop, and a dashed orange block under a workflow is its fallback. A clock on a block is a wait before it starts and an hourglass is its maximum duration. Behind them are <code>delay_after</code>, <code>loops</code>, <code>fallback</code>, <code>delay_before</code> and <code>timeout</code>.</p><pre class=\"cmd\">" + T_DEMO + "</pre>",
 "The same thread as the diagram.",
 "")
s += step(3, "See a wait, a timeout and a fallback", "Compare with a richer thread.",
 ["Open the Preview of a thread like the one below.", "Find the orange block under <code>load_sales</code>, the <code>30s</code> badge and the <code>2s</code> clock on <code>load_stock</code>."],
 "Execution order → Preview",
 "<p><code>load_sales</code> has <code>timeout: 30s</code> and a fallback that runs <code>cleanup</code> on failure. <code>load_stock</code> waits <code>2s</code> before it starts. The diagram marks each one on its block.</p><pre class=\"cmd\">" + T_FULL + "</pre>",
 "A dashed orange block named <code>cleanup</code> labeled <code>on failure</code>, a <code>30s</code> badge and a <code>2s</code> badge.",
 "load_sales  ⌛ 30s\n  └ on failure → cleanup\nload_stock  ◷ 2s",
 fig(FS, "execution-order-preview-wait-timeout-fallback-light", "The Preview tab of a thread with a wait before a workflow, a maximum duration and a fallback workflow shown as a dashed orange block below load_sales.", "Wait, timeout and fallback in the diagram."))
s += rules([("TIP", "Open Preview after every structural change: a misplaced stage is obvious in a diagram and easy to miss in a list."),
 ("TIP", "Use Preview to explain a project to someone else before sharing the YAML."),
 ("TRAP", "Preview draws the thread in the editor, saved or not. Save before you rely on it for a run."),
 ("TRAP", "A diagram cannot tell whether a workflow succeeds. Use <b>Check</b> for the files and <code>--dry-run</code> for the plan.")])
s += tail([["Diagram", "Stages left to right, parallel blocks stacked"], ["Waits", "A diamond between stages, a clock on a block"], ["Loop", "A dashed arrow with its passes and pause"], ["Fallback", "A dashed orange block under its workflow"]],
 [["The diagram is empty", "The thread has no workflow", "Add workflows in the Define tab"], ["A block has no badge", "No wait or timeout is set on it", "Set wait or max in Define"], ["The loop arrow is missing", "The thread has no loops", "Add a loop in Define"], ["Preview disagrees with the file", "Changes are not saved", "Save, then reopen Preview"]],
 faq, REL + '<li><a href="/studio/define-the-execution-order">Define the execution order</a></li><li><a href="/studio/check-the-execution-order">Check the execution order</a></li>',
 "You can read an execution order at a glance. Next, check that every workflow in it exists.",
 '<a class="primary" href="/studio/check-the-execution-order">Check the order <span aria-hidden="true">→</span></a>') + CTA
publish(35, "preview-the-execution-order", "Execution order: Preview", s,
 "Preview the execution order of a Hydra project", "Preview the execution order of a Hydra project", "Preview the Hydra Execution Order Before a Run | Hydra ETL",
 "Read the Preview diagram of workflows/thread.yaml in Hydra Studio: stages, parallel blocks, waits, loops and fallbacks. Tested with Hydra ETL 0.22.",
 ["Open Preview", "Read the legend", "See a wait, a timeout and a fallback"], faq,
 "Preview the execution order", "Read the diagram of stages, waits, loops and fallbacks.")

# ---------- CHECK ----------
faq = [
 ("What does Check do in Execution order?", "Check validates the project before any run. It reports a green Ready line when the thread is usable, or red lines naming the problem. According to the Hydra source, it looks for missing workflow files, workflows that cannot be loaded, missing job folders and missing fallback files."),
 ("What does the Ready line mean?", "It lists the active workflows in order and the number of loops, for example prepare, load_sales, load_stock, report and one loop. In our test it appeared in green under the Loops box."),
 ("How is a missing workflow reported?", "As a red line: workflows/thread.yaml: workflow 'ghost' has no file workflows/ghost.yaml. In the Define tab the workflow is also tagged file missing."),
 ("Does Check run my workflows?", "No. It validates the files before a run and runs nothing. A dry run from the terminal, hdrctl run --dry-run, gives the same safety with a printed plan."),
 ("Does Check save my changes?", "Yes, when there are unsaved changes. According to the Studio source, Check saves first and then validates. The button is disabled while a wait or loop value is invalid."),
]
s = common(36, "Execution order: Check", "Check the execution order of a Hydra project for errors",
 "The Check button of Execution order validates workflows/thread.yaml before a run. See the green Ready line and the red message for a missing workflow.",
 '<span class="mono">Check</span><span>about 5 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<b>Check</b> validates the execution order before any workflow runs. A valid thread gets a green <b>Ready</b> line that lists the workflows in order. A thread that names a workflow without a file gets a red line with the exact file path that is missing.",
 "Press Check on a valid thread, then on a broken one, and read each message.",
 "How do I check the execution order?")
s += step(1, "Check a valid thread", "See what a good result looks like.",
 ["Open <b>Settings</b> → <b>Project settings</b> → <b>Execution order</b>.", "Click <b>Check</b> at the top right."],
 "Execution order → Check",
 "<p>A green line appears under the Loops box. It lists the active workflows in order and counts the loops.</p>",
 "A green line starting with a check mark.",
 "✓ Ready: prepare → load_sales → load_stock → report (+ 1 loop)",
 fig(FS, "execution-order-check-ready-result-light", "The Execution order tab after pressing Check on a valid thread: a green line says Ready, then lists the workflows in order and the number of loops.", "Check on a valid thread."))
s += step(2, "Break the thread on purpose", "Name a workflow that has no file.",
 ["Use a thread like the one below, where <code>ghost</code> has no <code>workflows/ghost.yaml</code> and <code>load_sales</code> falls back to a missing <code>backup</code>.", "Open it in Define: <code>ghost</code> carries a red <b>file missing</b> tag."],
 "thread.yaml",
 "<p>Studio already flags the missing file in Define. The thread is:</p><pre class=\"cmd\">" + T_BAD + "</pre>",
 "A red <b>file missing</b> tag next to <code>ghost</code>.",
 "[x] ghost  ⚠ file missing")
s += step(3, "Press Check", "Read the error.",
 ["Click <b>Check</b>."],
 "Execution order → Check",
 "<p>The result turns red and gives the file and the problem. In our test only the missing <code>ghost</code> file was reported, although <code>backup</code> is missing too: the check stopped at the first problem. Fix it, then check again to see the next one.</p>",
 "A red line with a cross and the path of the missing file.",
 "✗ workflows/thread.yaml: workflow 'ghost' has no file workflows/ghost.yaml",
 fig(FS, "execution-order-check-errors-result-dark", "The Execution order tab after pressing Check on a thread that names a missing workflow file and a missing fallback file: red lines give the exact messages.", "Check on a broken thread: the missing file is named."))
s += step(4, "Fix and check again", "Get back to Ready.",
 ["Remove <code>ghost</code> from the thread with its cross, or create <code>workflows/ghost.yaml</code>.", "Press <b>Check</b> again until the line is green."],
 "Execution order → Check",
 "<p>Removing a workflow from the thread keeps its file. Repeat until the green <b>Ready</b> line appears; then run the project with <code>hdrctl run .</code>.</p>",
 "A green line again.",
 "✓ Ready: …")
s += rules([("TIP", "Press <b>Check</b> before every run of a project, especially after renaming or deleting a workflow file."),
 ("TIP", "An orange warning line can appear under the result. It does not block the run; read it, for example when a fallback writes somewhere different."),
 ("TRAP", "Check validates files, not data. A workflow can pass and still fail on its first row."),
 ("TRAP", "The check stops at the first problem found: a green result needs a second pass after each fix.")])
s += tail([["Valid", "A green Ready line lists the workflows and loops"], ["Invalid", "A red line names the missing file"], ["Order", "The check stops at the first problem"], ["Next", "Run the project with hdrctl run ."]],
 [["Check is disabled", "A wait, max or loop value is invalid", "Fix the red field"], ["Workflow has no file", "The name in the thread does not match a file", "Create the file or remove the workflow from the thread"], ["Fallback has no file", "A fallback names a missing workflow", "Create it or edit the fallback"], ["Ready but the run fails", "Check does not run workflows", "Read the run logs and use a dry run"]],
 faq, REL + '<li><a href="/studio/define-the-execution-order">Define the execution order</a></li><li><a href="/studio/preview-the-execution-order">Preview the execution order</a></li><li><a href="/studio/dry-run-and-use-fallback">Dry run and --use-fallback</a></li>',
 "You can validate an execution order before a run. Next, rehearse the whole project with a dry run.",
 '<a class="primary" href="/studio/dry-run-and-use-fallback">Dry run <span aria-hidden="true">→</span></a>') + CTA
publish(36, "check-the-execution-order", "Execution order: Check", s,
 "Check the execution order of a Hydra project for errors", "Check the execution order of a Hydra project", "Check the Hydra Execution Order for Errors | Hydra ETL",
 "Press Check in Hydra Studio to validate workflows/thread.yaml before a run: the green Ready line, and the red message for a missing workflow. Tested with Hydra ETL 0.22.",
 ["Check a valid thread", "Break the thread on purpose", "Press Check", "Fix and check again"], faq,
 "Check the execution order", "Find missing workflows before a run.")
