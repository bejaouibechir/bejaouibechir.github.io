"""Block R3 scenarios (lessons 60 and 61): writes the lesson HTML, Astro pages, hub entries, capture templates.
Run from tools/tutorials:  python3 blocks/gen_fallback_block.py   (python3 on Linux/macOS, py on Windows)"""
import json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parents[3]            # hydra-site
T = ROOT / "tools" / "tutorials"
AUTH = '<p class="byline">By <a href="https://github.com/bejaouibechir" rel="author">Bechir Bejaoui</a> (<a href="https://www.linkedin.com/in/bejaoui-bechir-06b2452b/" rel="author noopener">LinkedIn</a>) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (CLI outputs on Linux and Windows; Studio screens on Windows)</p>'
TOTAL = 65
def esc(s): return s
def fig(folder, n, alt, cap): return f'      <figure class="shot"><img src="@@{folder}/{n}@@" width="0" height="0" loading="lazy" decoding="async" alt="{alt}" /><figcaption>{cap}</figcaption></figure>'
def step(i, title, obj, actions, cmd, body, see, out=None, figs=()):
    acts = "".join(f"<li>{a}</li>" for a in actions)
    o = f'<pre class="out">{out}</pre>' if out else ""
    return f'''<div class="step">
  <h3><i>{i:02d}</i>{title}</h3>
  <h4>Objective</h4><p>{obj}</p>
  <h4>Actions</h4><ol>{acts}</ol>
  <pre class="cmd">{cmd}</pre>
  {body}
  <div class="expect"><b>What you should see</b><p>{see}</p>{o}
{chr(10).join(figs)}
  </div>
</div>
'''
def table(head, rows):
    h = "".join(f"<th>{x}</th>" for x in head)
    r = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in row) + "</tr>" for row in rows)
    return f"<table><thead><tr>{h}</tr></thead><tbody>{r}</tbody></table>"
def lesson(d):
    tips = "".join(f'<p data-kind="{k}">{t}</p>' for k, t in d["tips"])
    faq = "".join(f"<h3>{q}</h3><p>{a}</p>" for q, a in d["faq"])
    rel = "".join(f'<li><a href="{h}">{t}</a></li>' for h, t in d["related"])
    nxt = d["next"]
    return f'''<div class="crumbs"><a href="/get-started">Get started</a><span>›</span><a href="/studio">Hydra Studio</a><span>›</span><span>Lesson {d["n"]}</span></div>
<div class="lesson-head"><div class="eyebrow"><span></span>Lesson {d["n"]} of {TOTAL} · {d["eyebrow"]}</div><h1>{d["h1"]}</h1><p class="lead">{d["lead"]}</p>
{AUTH}</div>
<div class="lesson-meta"><span class="mono">{d["where"]}</span><span>about {d["minutes"]} minutes</span><span>{d["needs"]}</span></div>
<section class="doc">
<div class="callout"><b>Quick answer</b><p>{d["quick"]}</p></div>
<h2>What will you learn in this lesson?</h2>
<h3>Goal</h3><p>{d["goal"]} Hydra ETL is unrelated to Meta's Hydra configuration library and to the PostgreSQL extension of the same name.</p>
<div class="callout"><b>Project used here</b><p>{d["project"]}</p></div>
<h3>Prerequisites</h3><ul><li>Hydra ETL 0.22 installed with the server extra, and <code>hdrctl serve</code> running: Studio is then at <code>http://127.0.0.1:5678</code>. See <a href="/studio/02-check-the-api">lesson 3, Check the API</a> if the top bar does not say <b>API online</b>.</li><li>A project with a fallback declared. See <a href="/studio/declare-a-fallback-workflow">lesson 46, Declare a fallback workflow</a>.</li></ul>
<h2>{d["h2"]}</h2>
{"".join(d["steps"])}
<div class="rules">
  <h5>Tips and tricks</h5>
  {tips}
</div>
<h2>What should I have at the end?</h2>{table(["Verification","Expected result"], d["end"])}
<h2>What if something goes wrong?</h2>{table(["Symptom","Cause","Fix"], d["wrong"])}
<h2>Frequently asked questions</h2>
{faq}
<h2>Related lessons</h2>
<ul class="linklist">{rel}</ul>
<h2>Next lesson</h2><p>{nxt[0]}</p>
<div class="lesson-nav">{nxt[1]}<a href="/studio">Back to the course map</a></div>
<div class="cta"><b>Try Hydra ETL</b><p>Install it in a minute, or explore a job in your browser first.</p><a class="primary" href="/get-started">Get started</a><a href="/playground">Open the Playground</a><a href="/license">Commercial license</a></div>
</section>
'''
def astro(d):
    a = (ROOT/"src/pages/studio/12-compose-jobs.astro").read_text(encoding="utf-8")
    a = a.replace("studio-lesson-12-compose-jobs.main.html", f"studio-lesson-{d['n']}-{d['slug']}.main.html")
    art = f'const article = {{ headline: {json.dumps(d["h1plain"])}, description: {json.dumps(d["meta"])}, datePublished: \'2026-11-23\', dateModified: \'2026-11-23\', author: \'Bechir Bejaoui\' }};'
    a = re.sub(r"const article = \{.*?\};", lambda m: art, a, count=1, flags=re.S)
    block = f'''path: '/studio/{d["slug"]}/',
  name: article.headline,
  steps: {json.dumps(d["jsonsteps"])},
  faq: {json.dumps([[q, re.sub("<[^>]+>", "", an)] for q, an in d["faq"]])},
  crumbs: [['Get started', '/get-started'], ['Hydra Studio', '/studio'], [{json.dumps(d["crumb"])}, '/studio/{d["slug"]}/']],
'''
    a = re.sub(r"path: '/studio/12-compose-jobs/',\n  name: article.headline,\n  steps: \[.*?\],\n  faq: \[.*?\n  \],\n  crumbs: \[.*?\],\n", lambda m: block, a, count=1, flags=re.S)
    a = re.sub(r'<BaseLayout title="[^"]*" exactTitle="[^"]*" description="[^"]*"', lambda m: f'<BaseLayout title={json.dumps(d["h1plain"])} exactTitle={json.dumps(d["title"])} description={json.dumps(d["meta"])}', a, count=1)
    return a.replace('activeSlug="12-compose-jobs"', f'activeSlug="{d["slug"]}"')
PRE2 = '<li>A project with fallbacks declared. See <a href="/studio/declare-a-fallback-workflow">lesson 46, Declare a fallback workflow</a>.</li>'
def fix_pre(html, d): return html.replace(PRE2, d["prereq2"])
RELC = [("/dsl/workflow-yaml", "workflow.yaml reference"), ("/cli", "The hdrctl command line")]
THREAD = "version: '1.0'\\nthread:\\n  - mode: sequential\\n    workflows:\\n      - name: wf_load\\n        fallback: …\\n      - name: wf_report\\n        fallback: …\\n  - mode: sequential\\n    workflows:\\n      - name: wf_flaky\\n        timeout: 20s\\n      - name: wf_archive\\n        fallback: …"
# ----------------------------------------------------------------------------------------------- 60
F60 = "studio-build-a-resilient-pipeline"
d60 = dict(n=60, slug="build-a-resilient-pipeline", eyebrow="Scenario", where="Execution order · hdrctl run", minutes=30, needs="the resilient-pipeline project",
 prereq2='<li>Lessons 42 to 49 of this course: fallback, timeout, all-or-nothing, rollback and undo. This scenario uses them together in one project.</li>',
 title="Build a Resilient ETL Pipeline in Hydra ETL | Hydra ETL", h1plain="Build a resilient ETL pipeline in Hydra ETL Studio", h1="Build a resilient ETL pipeline in Hydra ETL Studio",
 meta="Combine fallback, retry, timeout, rollback and undo in one Hydra ETL project, check it with a dry run and run it. Tested on Hydra ETL 0.22.", crumb="Build a resilient pipeline",
 lead="One protection is a feature. Five protections that fit together are a pipeline you can leave running. Build one, and prove it with a dry run.",
 quick="A resilient Hydra ETL project protects each failure where it happens: a <code>fallback</code> for a missing input, a <code>retry</code> for a flaky call, <code>rollback: true</code> with <code>undo</code> for a workflow that publishes in several steps, and a <code>timeout</code> for a workflow that can hang. <code>hdrctl run . --dry-run</code> checks them all before anything runs.",
 goal="Assemble four workflows into a project with a fallback, a retry, a rollback with an undo and a timeout, check the whole plan without running it, then run it.",
 project="The <code>resilient-pipeline</code> copy of <code>fallbackproject</code>, plus one workflow, <code>wf_flaky</code>, whose python step fails twice before it answers. Stage 1 runs <code>wf_load</code> then <code>wf_report</code>. Stage 2 runs <code>wf_flaky</code> then <code>wf_archive</code>.",
 h2="How do I make a Hydra ETL pipeline resilient?", jsonsteps=["Match each failure to a protection", "Add a fallback to the load", "Add a retry to the flaky call", "Make the report safe to undo", "Limit the duration of the flaky workflow", "Check the whole project", "Run the project"],
 faq=[("How do I make a Hydra ETL project resilient?", "Protect each failure at the place where it happens: a fallback for a missing or empty input, retry for a call that sometimes fails, rollback with undo for a workflow that publishes in several steps, and a timeout for a workflow that can hang. Then check the plan with hdrctl run . --dry-run."),
      ("Does a retry show up in the log?", "In the Studio run page, yes: the step log has a WARNING line for each retry, such as retry 1/3 in 1s. The command line output of hdrctl run prints only the final result of the step. In our test the step failed twice and answered on the third attempt, one second apart, and the workflow lasted about two seconds."),
      ("What does a dry run check in a project with protections?", "It validates the project, prints each workflow with its fallback and condition, and warns when a backup writes somewhere else than the workflow it replaces. It runs nothing."),
      ("Why is wf_flaky not before wf_report?", "The condition previous.rows refers to the workflow just before. A workflow that writes no rows between the load and the report would make previous.rows equal 0 and trigger the report fallback by mistake.")],
 related=[("/studio/all-or-nothing-load", "All-or-nothing loads"), ("/studio/roll-back-a-failed-workflow", "Roll back a failed workflow"), ("/studio/declare-a-fallback-workflow", "Declare a fallback workflow"), ("/studio/break-it-then-recover", "Break it, then recover")] + RELC[:1],
 next=("The next scenario breaks this project on purpose, one failure at a time, and reads how each protection reacts.", '<a class="primary" href="/studio/break-it-then-recover">Break it, then recover <span aria-hidden="true">→</span></a>'),
 tips=[("TIP", "Add one protection at a time and run <code>--dry-run</code> after each: the plan shows what changed."), ("TIP", "Put a workflow that writes no rows after the workflows that a <code>previous.rows</code> condition watches."),
       ("TRAP", "A retry cannot fix a wrong input: it only repeats the call. Keep retries for failures that pass by themselves."), ("TRAP", "The timeout counts the retry delays. A short limit with long delays stops the workflow before the last attempt.")],
 end=[("Plan", "A <code>↪ fallback</code> line under <code>wf_load</code>, <code>wf_report</code> and <code>wf_archive</code>"), ("Dry run", "<code>Dry run OK: the project is valid. Nothing was executed.</code>"), ("Run", "<code>Project completed — 4/4 workflow(s) OK</code>"), ("Retry", "The flaky call answers on its third attempt")],
 wrong=[("A fallback runs although nothing failed", "A <code>previous.rows</code> condition sees a workflow that writes no rows", "Move that workflow elsewhere, or test another value"), ("The dry run warns about <code>wf_report_quarantine</code>", "The backup writes to another file", "Expected for a quarantine workflow; otherwise check the destination"), ("The flaky workflow fails with a timeout", "Attempts and delays exceed the limit", "Raise <code>timeout</code> or shorten the delays")],
 steps=[])
d60["steps"] = [
 step(1, "Match each failure to a protection", "Decide what protects what, before touching a file.", ["Read the table.", "Note which workflow each row concerns."], "failure → protection",
  "<p>Each protection answers one kind of failure:</p>" + table(["What can go wrong", "Protection", "Where it is set", "Lesson"], [
   ["The input file is missing or too small", "<code>fallback</code> on <code>wf_load</code>", "Execution order, lifebuoy button", "46, 47"], ["A call to a service fails now and then", "<code>retry</code> on the step", "Retry Scope, or <code>retry:</code> in the workflow", "—"],
   ["A late step fails after earlier ones published", "<code>rollback: true</code> and <code>undo</code>", "Workflow toolbar, action dialog", "43, 44"], ["A workflow never ends", "<code>timeout</code>", "<b>max</b> field in Execution order", "48"],
   ["A load stops in the middle", "<code>atomic</code>", "Destination", "42"]]),
  "A plan that you can read at a glance. Nothing to run yet.", None, []),
 step(2, "Add a fallback to the load", "Switch to a backup when the input is not usable.", ["Open <b>Project settings → Execution order</b>.", "Select the lifebuoy of <code>wf_load</code>.", "Choose <code>wf_load_backup</code> and type the condition."], "when: not file_exists('Data/orders.csv') or file_size('Data/orders.csv') < 100",
  "<p>This is lesson 46 in one line. The backup loads 8 rows from <code>Data/orders_backup.csv</code>. The same lifebuoy on <code>wf_report</code> sets <code>on_failure: true</code> and the condition <code>previous.rows &lt; 10</code>, and on <code>wf_archive</code> the condition <code>file_age('Data/stamp.txt') &gt; 30s</code>.</p>", "A lifebuoy button on <code>wf_load</code>, <code>wf_report</code> and <code>wf_archive</code>.", None,
  [fig(F60, "execution-order-resilient-project", "The Execution order panel with two stages and the protections of the resilient pipeline.", "Four workflows, three fallbacks and one timeout in the thread.")]),
 step(3, "Add a retry to the flaky call", "Let a step try again before failing the workflow.", ["Open <code>wf_flaky</code>.", "Add <code>retry</code> to the step, or drop a <b>Retry Scope</b> around it.", "Save."], "retry: {max: 3, delay: 1}",
  "<p><code>max</code> is the number of retries <b>after</b> the first failure, <code>delay</code> is the wait in seconds. A Retry Scope created in Studio starts with <code>max: 3</code> and <code>delay: 5</code>. The step of this scenario fails twice and answers on the third attempt:</p><pre class=\"out\">    - name: call_service\n      type: action\n      action: python\n      retry:\n        max: 3\n        delay: 1\n      params:\n        script: …</pre>", "A <code>retry</code> block on the step.", None, []),
 step(4, "Make the report safe to undo", "Undo a half-published report if a later step fails.", ["Open <code>wf_report</code> and check that <b>Rollback</b> reads <b>on</b>.", "Check that the <code>share</code> action has an undo."], "rollback: true",
  "<p>This is lessons 43 and 44. <code>wf_report</code> builds a report, shares a copy, then runs <code>finalize</code>. If <code>finalize</code> fails, the copy is deleted and the report is restored.</p>", "<b>Rollback on</b> in the toolbar, and a python undo on <code>share</code>.", None, []),
 step(5, "Limit the duration of the flaky workflow", "Stop a call that never answers.", ["Type <code>20s</code> in the <b>max</b> field of <code>wf_flaky</code>.", "Save."], "timeout: 20s",
  "<p>Twenty seconds leaves room for the three attempts and their delays (about 2 seconds) with a wide margin.</p><pre class=\"out\">thread:\n  - mode: sequential\n    workflows:\n      - name: wf_flaky\n        active: true\n        timeout: 20s</pre>", "<code>20s</code> in the <b>max</b> field, with a normal border.", None, []),
 step(6, "Check the whole project", "Validate every protection without running anything.", ["Select <b>Check</b> in Execution order.", "Open a terminal in the project folder and run the dry run."], "hdrctl run . --dry-run",
  "<p>The plan lists each workflow with its fallback. The warning is expected: the quarantine workflow writes to its own file.</p>", "A plan with three fallbacks, one warning and <b>Dry run OK</b>.",
  "Stage 1/2 — sequential\n   •  wf_load  (1: load_orders)\n      ↪  fallback: wf_load_backup (if not file_exists('Data/orders.csv') or file_size('Data/orders.csv') &lt; 100)\n   •  wf_report  (3: build_report, share, finalize)\n      ↪  fallback: wf_report_quarantine (if previous.rows &lt; 10; on failure)\nStage 2/2 — sequential\n   •  wf_flaky  (1: call_service)\n   •  wf_archive  (1: archive)\n      ↪  fallback: wf_archive_alt (if file_age('Data/stamp.txt') &gt; 30s)\n⚠  workflows/thread.yaml: workflow 'wf_report' fallback: 'wf_report_quarantine' writes to ['csv:../../outputs/quarantine.csv'] instead of […] (fine for a quarantine workflow; otherwise check it)\n✅ Dry run OK: the project is valid. Nothing was executed.",
  [fig(F60, "project-check-resilient-ready", "The Execution order panel after Check, with the Ready line.", "Check validates the whole project.")]),
 step(7, "Run the project", "See every protection stay quiet when nothing is wrong.", ["Go back to the project.", "Select <b>Run project</b>.", "Open the run."], "hdrctl run .",
  "<p>With good data, no fallback is used. If a step needed a retry, the run page shows a WARNING line for it in the step log. The only warning concerns <code>wf_archive</code>: its condition reads <code>Data/stamp.txt</code>, which does not exist, so Hydra ETL keeps the workflow (<code>on_probe_error: keep</code>).</p>", "Four workflows OK, and a run page with no fallback badge.",
  "▶  Workflow  wf_load\n   ✓  Step 'load_orders' OK (&lt;duration&gt;)\n▶  Workflow  wf_report\n   ✓  Step 'build_report' OK\n   ✓  Step 'share' OK\n   ✓  Step 'finalize' OK\n▶  Workflow  wf_flaky\n   ✓  Step 'call_service' OK\n⚠  wf_archive: fallback check failed (file_age('Data/stamp.txt'): file not found (…)); keeping wf_archive\n▶  Workflow  wf_archive\n   ✓  Step 'archive' OK\n✅ Project 'resilient-pipeline' completed in &lt;duration&gt; — 4/4 workflow(s) OK",
  [fig(F60, "run-project-resilient-nominal-detail", "The run detail page of the resilient pipeline, with four workflows succeeded.", "A clean run: no protection was needed.")])]
# ----------------------------------------------------------------------------------------------- 61
F61 = "studio-break-it-then-recover"
d61 = dict(n=61, slug="break-it-then-recover", eyebrow="Scenario", where="hdrctl run · Runs page", minutes=30, needs="the resilient-pipeline project",
 prereq2='<li>The project of the previous scenario, <a href="/studio/build-a-resilient-pipeline">lesson 60, Build a resilient pipeline</a>.</li>',
 title="Break It, Then Recover: Hydra ETL Failures | Hydra ETL", h1plain="Break a Hydra ETL pipeline on purpose, then recover", h1="Break a Hydra ETL pipeline on purpose, then recover",
 meta="Delete an input, make a service fail, break a late step and hang a workflow, then read how each Hydra ETL protection reacts. Tested on Hydra ETL 0.22.", crumb="Break it, then recover",
 lead="You only know that a protection works when you have seen it trigger. Break the pipeline four ways, and read what each protection does.",
 quick="Break the resilient project on purpose: delete the input, so a fallback loads the backup; make the service fail beyond its retries, so the project stops; break the last step of the report, so it is rolled back and replaced by a quarantine workflow; shorten the timeout, so the workflow is stopped. Each case prints a different line.",
 goal="Cause four failures, read the line that tells which protection reacted, and put the project back in its working state.",
 project="The <code>resilient-pipeline</code> project of lesson 60. Each failure is created by renaming a file or editing one value, and undone afterwards.",
 h2="How do I test the failure handling of a Hydra ETL project?", jsonsteps=["Delete the input file", "Make the service fail beyond its retries", "Break the last step of the report", "Make a workflow exceed its timeout", "Put the project back"],
 faq=[("How do I test a Hydra ETL fallback?", "Make its condition true on purpose, for example by renaming the input file, run the project and look for the line starting with a fallback arrow. A dry run alone does not test it."),
      ("What happens when a retried step still fails?", "The workflow fails, and the project stops. In our test wf_archive, which follows wf_flaky, did not run, and the project ended as failed."),
      ("Why did the report fallback run after I deleted the input?", "The backup of wf_load loads 8 rows, and the condition of wf_report is previous.rows < 10. The two fallbacks chain."),
      ("Is the failed report published?", "No. In our test the share was deleted and the report restored before the quarantine workflow ran, so nothing was left published.")],
 related=[("/studio/build-a-resilient-pipeline", "Build a resilient pipeline"), ("/studio/dry-run-and-use-fallback", "Dry run and --use-fallback"), ("/studio/resolve-conflicts-and-recover", "Resolve conflicts and recover"), ("/studio/set-timeouts-on-workflows", "Set a timeout on a workflow")] + RELC[1:],
 next=("You have reached the end of the orchestration and resilience block. The course continues with AI and MCP.", '<a class="primary" href="/studio">Back to the course map <span aria-hidden="true">→</span></a>'),
 tips=[("TIP", "Break one thing at a time and put it back before the next test."), ("TIP", "Read the arrows: <code>↪</code> is a fallback, <code>↩</code> an undo, <code>↯</code> a failure answered by a backup."),
       ("TRAP", "A fallback that works in the dry run can still fail at run time if its own data is missing."), ("TRAP", "Do not leave a file renamed after a test: the next run starts from a broken state.")],
 end=[("Missing input", "<code>↪ Fallback: wf_load → wf_load_backup</code>, then a second switch on <code>wf_report</code>"), ("Failing service", "<code>Project failed — failed: wf_flaky</code>"), ("Broken last step", "Two <code>↩</code> lines, then <code>↯</code> and a quarantine workflow"), ("Timeout", "<code>timed out after 3s</code> on <code>wf_flaky</code>")],
 wrong=[("Nothing changed after the rename", "The file name has another case or folder", "Check the path in the condition: it is relative to the project"), ("The project keeps failing after the tests", "A file is still renamed, or the timeout is still short", "Undo each change from the last step of this lesson"), ("<code>a previous run … stopped before undoing</code>", "A rollback was interrupted", "See the lesson on conflicts and recovery")],
 steps=[])
d61["steps"] = [
 step(1, "Delete the input file", "Make the load fallback trigger.", ["Rename <code>Data/orders.csv</code> to <code>orders.csv.off</code>.", "Run the project.", "Open the run."], "hdrctl run .",
  "<p>The condition of <code>wf_load</code> is true, so the backup runs. It loads 8 rows, which makes the condition of <code>wf_report</code> true as well: the two fallbacks chain.</p>", "Two fallback lines, and a project that completes.",
  "↪  Fallback: wf_load → wf_load_backup — file_exists('Data/orders.csv') = false (not found)\n▶  Workflow  wf_load_backup  (fallback, in place of wf_load)\n↪  Fallback: wf_report → wf_report_quarantine — previous.rows = 8\n▶  Workflow  wf_report_quarantine  (fallback, in place of wf_report)\n✅ Project 'resilient-pipeline' completed in &lt;duration&gt; — 4/4 workflow(s) OK",
  [fig(F61, "run-project-orders-missing-fallback", "The run detail page of the resilient pipeline with wf_load and wf_report replaced by their fallbacks.", "Two workflows were replaced by their backups.")]),
 step(2, "Make the service fail beyond its retries", "See what a retry cannot save.", ["Put <code>orders.csv</code> back.", "Replace the script of <code>call_service</code> with <code>raise SystemExit('service unavailable')</code>.", "Run the project."], "hdrctl run .",
  "<p>The step is tried again three times, then fails. <code>wf_flaky</code> has no fallback, so the project stops, and <code>wf_archive</code>, in the same stage, does not run.</p>", "A failed step, a failed workflow and a failed project. In the step log of the run page, three WARNING lines <code>[call_service] failed, retry 1/3 in 1s</code>, <code>2/3</code> and <code>3/3</code> come before the failure.",
  "▶  Workflow  wf_flaky\n   ✗  Step 'call_service' FAILED: Python script exited with code 1: service unavailable\n✗  Workflow 'wf_flaky' failed (&lt;duration&gt;): Step 'call_service' failed: …\n⏭  wf_archive — not run (a previous workflow failed)\n❌ Project 'resilient-pipeline' failed after &lt;duration&gt; — failed: wf_flaky",
  [fig(F61, "run-project-service-failed-stopped", "The run detail page of the resilient pipeline with wf_flaky failed and the project stopped.", "A failure without a fallback stops the project.")]),
 step(3, "Break the last step of the report", "See rollback and the failure fallback work together.", ["Restore the script of <code>call_service</code>.", "Rename <code>Data/finalize.csv</code> to <code>finalize.csv.off</code>.", "Run the project."], "hdrctl run .",
  "<p><code>finalize</code> cannot read its file. Hydra ETL undoes <code>share</code> and <code>build_report</code>, sees that nothing is published, and calls the quarantine workflow. The project goes on.</p>", "Two undo lines, a <code>↯</code> line and a completed project.",
  "   ✗  Step 'finalize' FAILED: ValueError: CSVConnector [src]: source file not found.\n   ↩  Step 'share' undone\n   ↩  Step 'build_report' undone\n↯  Workflow 'wf_report' failed (&lt;duration&gt;), nothing published — replaced by wf_report_quarantine: Step 'finalize' failed: …\n✅ Project 'resilient-pipeline' completed in &lt;duration&gt; — 4/5 workflow(s) OK",
  [fig(F61, "run-project-finalize-undone-replaced", "The run detail page of the resilient pipeline with wf_report failed, undone and replaced by the quarantine workflow.", "The failed report was undone, then replaced.")]),
 step(4, "Make a workflow exceed its timeout", "See the limit stop a slow workflow.", ["Put <code>finalize.csv</code> back.", "Set <code>delay: 4</code> in the retry of <code>call_service</code>, and <code>timeout: 3s</code> on <code>wf_flaky</code>.", "Run the project."], "timeout: 3s",
  "<p>The first attempt fails, the retry waits four seconds, and the limit of three seconds is exceeded.</p>", "A failure that mentions the timeout.",
  "⏳  wf_flaky: timed out after 3s — stopping at the next step or batch\n✗  Workflow 'wf_flaky' failed (4.1s): timed out after 3s (timeout in workflows/thread.yaml): Step 'call_service' failed: Python script exited with code 1: service unavailable (attempt 2)\n❌ Project 'resilient-pipeline' failed after &lt;duration&gt; — failed: wf_flaky", []),
 step(5, "Put the project back", "Leave a working project.", ["Restore every file you renamed.", "Set <code>delay: 1</code> and <code>timeout: 20s</code> again.", "Run <code>hdrctl run . --dry-run</code> and then the project."], "hdrctl run . --dry-run",
  "<p>If a run was interrupted during a rollback, <code>hdrctl workflow undo</code> and the journal in <code>.hydra/undo</code> are covered in the lesson on conflicts and recovery.</p>", "<b>Dry run OK</b>, then four workflows completed.",
  "✅ Dry run OK: the project is valid. Nothing was executed.\n✅ Project 'resilient-pipeline' completed in &lt;duration&gt; — 4/4 workflow(s) OK", [])]
LESSONS = [d60, d61]
for d in LESSONS:
    (ROOT/"src/_mock"/f"studio-lesson-{d['n']}-{d['slug']}.main.html").write_text(fix_pre(lesson(d), d), encoding="utf-8")
    (ROOT/"src/pages/studio"/f"{d['slug']}.astro").write_text(astro(d), encoding="utf-8")
hub = ROOT/"src/data/studio-lessons.js"; s = hub.read_text(encoding="utf-8")
for label, slug in [("Scenario 1", d60["slug"]), ("Scenario 2", d61["slug"])]:
    key = f'"label": "{label}", "group": "Orchestration and resilience"'
    i = s.index(key); j = s.rfind("{", 0, i)
    if not s[j:].startswith('{"slug"'): s = s[:j] + f'{{"slug": "{slug}", ' + s[j+1:]
hub.write_text(s, encoding="utf-8")
print("lessons written:", [d["slug"] for d in LESSONS])
