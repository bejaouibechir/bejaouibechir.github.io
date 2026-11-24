"""Lesson 'Loops and pauses' (plan n. 38): new lesson, slug repeat-workflows-with-loops."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
src = (R/"tools/tutorials/blocks/gen_jobs_block.py").read_text(encoding="utf-8")
exec(src.split("F6, F7, F9 =")[0])
SLUG = "repeat-workflows-with-loops"
FS = "studio-loops"
P = R/"tools/tutorials/loops-demo/workflows"
THREAD = (P/"thread.yaml").read_text(encoding="utf-8").rstrip()
FETCH = (P/"fetch.yaml").read_text(encoding="utf-8").rstrip()
esc = lambda x: x.replace("<","&lt;").replace(">","&gt;")
faq = [
 ("How do I repeat a workflow in Hydra?", "Add a loops list to workflows/thread.yaml. Each loop has a from workflow, a to workflow, times and an optional delay. Hydra replays the workflows from to up to from, in thread order."),
 ("Does times count the first run?", "Yes. times is the total number of passes. In our test, times: 2 over two workflows ran four workflows in all, and times: 3 ran six."),
 ("How do I pause between passes?", "Set delay on the loop, for example delay: 1s. The run prints a line saying it is waiting before the next pass. delay accepts seconds or durations such as 500ms, 30s, 5m or 1h."),
 ("Can I check a loop without running it?", "Yes. hdrctl run with --dry-run prints the execution plan, including a line for each loop with its passes and its wait, and runs nothing. It also confirms that the project is valid."),
 ("What happens if a workflow fails inside a loop?", "The engine's thread documentation says a failure stops the project, loops included. This lesson only ran successful workflows, so it did not reproduce a failure."),
]
s = head(38, 65, "Loops and pauses", "Repeat Hydra workflows with loops in thread.yaml",
 "A loop in thread.yaml replays part of a project several times, with a pause before each new pass. Add one, preview it with a dry run, and run it.",
 '<span class="mono">loops</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "A <b>loop</b> in <code>workflows/thread.yaml</code> replays a run of workflows <code>times</code> times, in total, and waits <code>delay</code> before each new pass. In our test, two workflows with <code>times: 2</code> and <code>delay: 1s</code> ran four times in 1.6 seconds.",
 "Add a loop to a project, read it in a dry run, run it, and see how <code>times</code> and <code>delay</code> behave.",
 "Hydra ETL 0.22 installed. A project folder with a <code>workflows</code> folder, as in the <a href=\"/studio/run-steps-in-sequence-or-in-parallel\">Stages</a> lesson. The commands are the Windows ones.")
s = s.replace("Published 4 November 2026", "Published 23 November 2026")
s = re.sub(r'  <div class="callout"><b>Course project</b>.*?</div>\n', '', s, count=1, flags=re.S)
s = re.sub(r'<h3>Prerequisites</h3><ul>.*?</ul>', '<h3>Prerequisites</h3><ul><li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A project folder (a folder with a <code>.hydra</code> subfolder) and the stages of the <a href="/studio/run-steps-in-sequence-or-in-parallel">Stages</a> lesson.</li></ul>', s, count=1, flags=re.S)
s += "  <h2>How do I repeat workflows with a loop?</h2>\n\n"
s += step(1, "Write two small workflows", "Have a portion to repeat.",
 ["In the <code>workflows</code> folder, create <code>fetch.yaml</code> and <code>check.yaml</code>.", "Give each one a single Python step that does nothing, so that the output stays short."],
 "workflows\\fetch.yaml",
 "<p><code>check.yaml</code> is the same file with <code>check</code> in place of <code>fetch</code>.</p><pre class=\"cmd\">" + esc(FETCH) + "</pre>",
 "Two files in <code>workflows</code>.", "")
s += step(2, "Add a loop", "Say which portion repeats, how often, and how long to wait.",
 ["Create <code>workflows\\thread.yaml</code> with the content below.", "Read the <code>loops</code> block: <code>from</code> is the last workflow of the repeated portion and <code>to</code> the first."],
 "workflows\\thread.yaml",
 "<p>One stage runs <code>fetch</code> then <code>check</code>. The loop replays the portion from <code>fetch</code> to <code>check</code> for <code>2</code> passes in all, and waits <code>1s</code> before the second one. <code>to</code> must come before <code>from</code> in the thread, or be the same workflow.</p><pre class=\"cmd\">" + esc(THREAD) + "</pre>",
 "A file of %d lines." % len(THREAD.splitlines()), "")
s += step(3, "Preview the plan", "Check the loop before running anything.",
 ["Open a terminal in the project folder.", "Run the command below."],
 "hdrctl run . --dry-run",
 "<p>A dry run prints the execution plan and runs nothing. A loop appears as one line under the stage it belongs to.</p>",
 "The stage, its two workflows, a loop line, and a confirmation.",
 "Project loops-demo — 2 workflow(s) in 1 stage(s)\n\nDRY-RUN mode — no data will be written\n\nExecution plan\nStage 1/1 — sequential\n   •  fetch  (1: fetch)\n   •  check  (1: check)\n↻  loop check → fetch, 2 pass(es), waiting 1s\n\nDry run OK: the project is valid. Nothing was executed.",
 fig(FS, "loops-dry-run-execution-plan-light", "The Studio terminal after hdrctl run with the dry-run option: the execution plan lists stage 1 with the workflows fetch and check, then a loop line with 2 passes and a one second wait, and says the project is valid and nothing was executed.", "The dry run lists the loop under its stage."))
s += step(4, "Run the project", "See the passes and the pause.",
 ["Run the command below."],
 "hdrctl run .",
 "<p>The stage runs once, a loop line announces the next pass and its wait, then the stage runs again. Each workflow header shows its pass, such as <code>pass 1/2</code>.</p>",
 "Two passes, a loop line between them, and a summary of four workflow runs.",
 "Stage 1/1 — sequential\n▶ Workflow  fetch  (pass 1/2)\n  ✓ Step 'fetch' OK (0.2s)\n✓ Workflow 'fetch' OK (0.2s)\n▶ Workflow  check  (pass 1/2)\n  ✓ Step 'check' OK (0.2s)\n✓ Workflow 'check' OK (0.2s)\n\n↻ Loop check → fetch: pass 2/2 — waiting 1s\n\nStage 1/1 — sequential\n▶ Workflow  fetch  (pass 2/2)\n…\nProject 'loops-demo' completed in 1.6s — 4/4 workflow(s) OK",
 fig(FS, "loops-run-terminal-output-dark", "The Studio terminal after hdrctl run in a project whose thread.yaml repeats two workflows: pass 1 of 2, a loop line announcing a one second wait, then pass 2 of 2, and a project summary with 4 of 4 workflows OK.", "The run, with the loop line between the passes."))
s += step(5, "Change the number of passes", "See that times counts every pass.",
 ["Set <code>times: 3</code> in <code>thread.yaml</code>.", "Run <code>hdrctl run .</code> again."],
 "times: 3\nhdrctl run .",
 "<p><code>times</code> is the total number of passes, the first included. With <code>3</code>, the loop line appears twice, and each wait adds one second.</p>",
 "Three passes and a summary of six workflow runs.",
 "Loop check → fetch: pass 2/3 — waiting 1s\n…\nLoop check → fetch: pass 3/3 — waiting 1s\n…\nProject 'loops-demo' completed in 2.0s — 6/6 workflow(s) OK")
s += rules([("TIP", "Run <code>hdrctl run . --dry-run</code> after every change to <code>loops</code>: the plan shows the passes and the wait without running anything."),
 ("TIP", "Use <code>delay</code> to give a system time to settle between two passes. It accepts <code>500ms</code>, <code>30s</code>, <code>5m</code> or <code>1h</code>."),
 ("TRAP", "<code>times: 1</code> means no repeat: it counts the first pass. To run a portion twice, write <code>times: 2</code>."),
 ("TRAP", "<code>to</code> must come before <code>from</code> in the thread. A loop that goes forward is refused with <code>a loop goes back</code> in the message; see the <a href=\"/studio/orchestrate-from-thread-yaml\">thread.yaml</a> lesson.")])
s += tail([["Plan", "The dry run shows a loop line with its passes and wait"], ["Run", "Workflow headers show pass 1/2 and pass 2/2"], ["Wait", "A loop line says waiting 1s before each new pass"], ["Total", "Four workflow runs for times 2, six for times 3"]],
 [["The workflows run only once", "The loops block is missing, or times is 1", "Add the loop and set times to the total number of passes"], ["The project is reported invalid", "A loop names a workflow that is not in the thread, or to comes after from", "Use workflow names from the thread and put to before from"], ["The loop never seems to wait", "delay is missing", "Add delay to the loop"]],
 faq,
 '<li><a href="/studio/run-steps-in-sequence-or-in-parallel">Run workflows in sequence or in parallel</a></li><li><a href="/studio/wait-with-the-delay-node">Wait with the Delay node</a></li><li><a href="/studio/dry-run-and-use-fallback">Dry run and --use-fallback</a></li><li><a href="/studio/12-compose-jobs">Compose jobs in a workflow</a></li>',
 "You can repeat part of a project and pause between passes. Next, set a timeout so that a stuck workflow cannot block a loop.",
 '<a class="primary" href="/studio/set-timeouts-on-workflows">Set timeouts <span aria-hidden="true">→</span></a>') + CTA
(R/"src/_mock/studio-lesson-38-repeat-workflows-with-loops.main.html").write_text(s, encoding="utf-8")
t = (R/"src/pages/studio/all-or-nothing-load.astro").read_text(encoding="utf-8")
HEAD = "Repeat Hydra workflows with loops in thread.yaml"
DESC = "Repeat part of a project with loops in thread.yaml, pause between passes, and preview the plan with a dry run. Tested on Windows, Hydra ETL 0.22."
steps = ["Write two small workflows", "Add a loop", "Preview the plan", "Run the project", "Change the number of passes"]
t = t.replace("studio-lesson-42-all-or-nothing-load.main.html", "studio-lesson-38-repeat-workflows-with-loops.main.html")
t = t.replace("all-or-nothing-load", SLUG)
t = re.sub(r'headline: "[^"]*"', lambda m: 'headline: '+json.dumps(HEAD), t, 1)
t = re.sub(r'(description: ")[^"]*(", datePublished)', lambda m: m.group(1)+DESC+m.group(2), t, 1)
t = re.sub(r"steps: \[.*?\],\n", lambda m: "steps: "+json.dumps(steps, ensure_ascii=False)+",\n", t, 1, flags=re.S)
t = re.sub(r"  faq: \[.*?\n  \],\n", lambda m: "  faq: [\n"+"".join(f"    [{json.dumps(q, ensure_ascii=False)}, {json.dumps(x, ensure_ascii=False)}],\n" for q, x in faq)+"  ],\n", t, 1, flags=re.S)
t = t.replace('["All-or-nothing load", ', '["Loops and pauses", ')
t = re.sub(r'<BaseLayout title="[^"]*" exactTitle="[^"]*" description="[^"]*"', '<BaseLayout title="Repeat Hydra workflows with loops" exactTitle="Hydra thread.yaml Loops: Repeat Workflows | Hydra ETL" description="'+DESC+'"', t, 1)
(R/("src/pages/studio/"+SLUG+".astro")).write_text(t, encoding="utf-8")
p = R/"src/data/studio-lessons.js"; h = p.read_text(encoding="utf-8")
h = h.replace('{"label": "Loops and pauses", "group"', '{"slug": "'+SLUG+'", "label": "Stages", "group"', 1)
h = h.replace('"title": "Loops and delays between steps", "description": "Repeat a step and wait between runs."', '"title": "Repeat workflows with loops", "description": "Replay part of a project several times, with a pause before each new pass."', 1)
p.write_text(h, encoding="utf-8")
print("ok", len(s))
