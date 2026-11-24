"""Block 'Fallback' (lessons 47, 48, 49): writes the lesson HTML, Astro pages, hub entries, capture templates.
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

# ----------------------------------------------------------------------------------------------- 47
F47 = "studio-fallback-conditions-when-on-failure"
FUNCS = [("file_exists('path')", "the file exists"), ("file_size('path')", "size of the file, for example <code>file_size('in.csv') &lt; 1MB</code>"),
 ("file_age('path')", "time since the last change, for example <code>file_age('in.csv') &gt; 24h</code>"), ("source_available('name')", "the source answers (connection test, or the file is there)"),
 ("destination_available('name')", "the destination answers (or its folder is writable)"), ("url_ok('url')", "the URL answers with HTTP 2xx or 3xx"),
 ("secret_defined('name')", "the secret is set in <code>.hydra/secrets</code> or in the environment"), ("previous.rows", "rows written by the previous workflow"),
 ("previous.status", "<code>success</code>, <code>failed</code>, <code>skipped</code>, <code>inactive</code> or <code>none</code>")]
d47 = dict(n=47, slug="fallback-conditions-when-on-failure", eyebrow="Fallback conditions", where="Execution order → Fallback editor", minutes=20, needs="a project with fallbacks",
 title="Fallback Conditions: when and on_failure | Hydra ETL", h1plain="Fallback conditions in Hydra ETL: when, on_failure and on_probe_error",
 h1="Fallback conditions in Hydra ETL: when, on_failure and on_probe_error",
 meta="Write the when condition of a Hydra ETL fallback, handle a check that cannot answer and trigger a backup after a failure. Tested on Hydra ETL 0.22.", crumb="Fallback conditions",
 lead="A fallback is only as good as its condition. Write the test, decide what a failed test means, and choose whether a failure also calls the backup.",
 quick="A Hydra ETL fallback has three settings. <code>when</code> is the condition tested just before the workflow starts, built from <code>file_exists()</code>, <code>file_size()</code>, <code>file_age()</code>, <code>previous.rows</code> and similar. <code>on_probe_error</code> says what to do when a check cannot answer. <code>on_failure: true</code> also calls the backup after a failure that published nothing.",
 goal="Write a valid <code>when</code> condition, read the error when it is not valid, decide what a check that cannot answer means, and let a failed workflow call its backup.",
 project="The <code>fallback-demo</code> copy of <code>fallbackproject</code> from lesson 46, with its three fallbacks: <code>wf_load</code> (backup <code>wf_load_backup</code>, when the file is missing or under 100 bytes), <code>wf_report</code> (backup <code>wf_report_quarantine</code>, when <code>previous.rows &lt; 10</code>, also after a failure) and <code>wf_archive</code> (backup <code>wf_archive_alt</code>, when <code>file_age('Data/stamp.txt') &gt; 30s</code>).",
 h2="How do I write the condition of a fallback in Hydra ETL?", jsonsteps=["Read what a condition can test", "Write a condition with the assistant", "Read the error of an invalid condition", "Decide what a check that cannot answer means", "Call the backup after a failure"],
 faq=[("Which functions can a fallback condition use?", "file_exists, file_size, file_age, source_available, destination_available, url_ok, secret_defined, db.load and the four cdc functions, plus the values previous.rows and previous.status. Conditions combine them with and, or, not and comparisons."),
      ("What happens when a fallback check cannot answer?", "By default the workflow is kept and Hydra ETL prints a warning. Set on_probe_error to replace, shown in Studio as use the fallback, to run the backup instead."),
      ("Does a fallback run after a failure?", "Only with on_failure: true, and only if the failed workflow published nothing, either because nothing was loaded or because rollback undid everything."),
      ("Which units can a condition use?", "Durations such as 500ms, 30s, 5m, 24h and 7d, and sizes such as 10KB, 5MB and 1GB.")],
 related=[("/studio/declare-a-fallback-workflow", "Declare a fallback workflow"), ("/studio/set-timeouts-on-workflows", "Set a timeout on a workflow"), ("/studio/dry-run-and-use-fallback", "Dry run and --use-fallback"), ("/dsl/workflow-yaml", "workflow.yaml reference")],
 next=("The next lesson sets a maximum duration on a workflow, which also counts as a failure that a fallback can answer.", '<a class="primary" href="/studio/set-timeouts-on-workflows">Set a timeout <span aria-hidden="true">→</span></a>'),
 tips=[("TIP", "Write the condition as the situation in which the main workflow must <b>not</b> run."), ("TIP", "Paths are relative to the project folder, not to the job folder."),
       ("TRAP", "<code>file_exist()</code> is not <code>file_exists()</code>: an unknown function stops the project before it runs."), ("TRAP", "A fallback that publishes to a different file is allowed. Hydra ETL warns you, so check that it is intended.")],
 end=[("Condition", "A green check mark after the <code>when</code> field"), ("Error", "A red message that names the function you misspelled"), ("Probe error", "<code>keep</code> prints a warning, <code>replace</code> runs the backup"), ("After a failure", "A failed <code>wf_report</code> is replaced by <code>wf_report_quarantine</code>")],
 wrong=[("Red cross after the condition", "Unknown function or wrong number of arguments", "Read the message under the field, then pick the function from the assistant"), ("The backup never runs", "The condition is false, or the check cannot answer and <code>on_probe_error</code> is <code>keep</code>", "Run with <code>hdrctl run . -v</code> and read the <code>fallback not needed</code> line"), ("The project stops after a failure", "The failed workflow had already published data", "Add <code>rollback: true</code> to the workflow so everything is undone first")],
 steps=[])
d47["steps"] = [
 step(1, "Read what a condition can test", "Know the closed list of functions before you write one.", ["Open the fallback editor of <code>wf_load</code> (the lifebuoy button).", "Open the function list of the assistant under the <b>when</b> field.", "Read the help shown for each function."], "when: not file_exists('Data/orders.csv')",
  "<p>A condition is a small language, read by Hydra ETL itself: never Python. Operators are <code>and</code>, <code>or</code>, <code>not</code>, parentheses and the comparisons <code>==</code> <code>!=</code> <code>&lt;</code> <code>&lt;=</code> <code>&gt;</code> <code>&gt;=</code>. Durations are written <code>500ms</code>, <code>30s</code>, <code>5m</code>, <code>24h</code>, <code>7d</code> and sizes <code>10KB</code>, <code>5MB</code>, <code>1GB</code>. These are the functions a project can use without a database:</p>" + table(["Function", "True or measured"], [(f"<code>{a}</code>", b) for a, b in FUNCS]) + "<p>Database and change-data-capture functions (<code>db.load</code>, <code>cdc.lag</code>, <code>cdc.status</code> and others) exist as well; they need a database source.</p>",
  "The assistant shows a join, a <b>not</b> box, a function list, an argument field and an <b>Insert</b> button.", None,
  [fig(F47, "condition-assistant-insert-row", "The fallback editor of wf_load with the assistant row open on the file_size function.", "The assistant builds the condition piece by piece.")]),
 step(2, "Write a condition with the assistant", "Build a condition without typing the syntax.", ["Pick a function in the <b>Condition function</b> list.", "Type its argument.", "Select <b>Insert</b>."], "file_size('Data/orders.csv') < 100",
  "<p>The assistant completes the <b>when</b> field and keeps what you already wrote. Select the <b>not</b> box to negate the test, and the <b>or</b> or <b>and</b> list to join it to the previous one. The field checks as you type.</p>",
  "The field is updated and ends with a green check mark.", None, []),
 step(3, "Read the error of an invalid condition", "Recognize a condition that Hydra ETL refuses.", ["Replace <code>file_exists</code> with <code>file_exist</code> in the <b>when</b> field.", "Read the red mark and the message."], "file_exist('Data/orders.csv')",
  "<p>Studio shows the message in red. The same condition in <code>thread.yaml</code> stops <code>hdrctl run</code> before anything runs:</p>",
  "A red cross, and a message that names the unknown function and lists the valid ones.",
  "❌ Project cannot run:\n  err   — workflows/thread.yaml: thread.0.workflows.0.fallback.when: unknown function file_exist() — use one of: source_available(), destination_available(), file_exists(), file_size(), file_age(), url_ok(), secret_defined(), db.load(), …\n\n  err   — workflows/thread.yaml: thread.1.workflows.0.fallback.when: file_age() takes 1 argument(s), got 0",
  [fig(F47, "condition-error-message-red", "The fallback editor of wf_load with the condition file_exist marked with a red cross and an error message.", "A misspelled function is refused as you type.")]),
 step(4, "Decide what a check that cannot answer means", "Choose between keeping the workflow and calling the backup when the test itself fails.", ["Open the fallback editor of <code>wf_archive</code>.", "Open the list <b>if a check cannot answer</b>.", "Choose <b>keep wf_archive</b> or <b>use the fallback</b>."], "on_probe_error: keep | replace",
  "<p>The condition of <code>wf_archive</code> reads <code>Data/stamp.txt</code>, which does not exist, so the check cannot answer. With <code>keep</code> (the default) the workflow runs and Hydra ETL warns you. With <code>replace</code> the backup runs, and the reason is printed.</p>",
  "A list with two choices, <b>keep wf_archive</b> and <b>use the fallback</b>.",
  "keep:\n⚠  wf_archive: fallback check failed (file_age('Data/stamp.txt'): file not found (…/Data/stamp.txt)); keeping wf_archive\n\nreplace:\n↪  Fallback: wf_archive → wf_archive_alt — check failed: file_age('Data/stamp.txt'): file not found (…/Data/stamp.txt)",
  [fig(F47, "on-probe-error-replace-menu", "The fallback editor of wf_archive with the if a check cannot answer list set to use the fallback.", "The setting sits at the end of the editor.")]),
 step(5, "Call the backup after a failure", "Let a workflow that fails without publishing anything be replaced.", ["Open the fallback editor of <code>wf_report</code>.", "Check <b>also after a failure</b>.", "Save and run the project."], "on_failure: true",
  "<p>The checkbox reads <b>also after a failure (only if nothing was published)</b>. Its tooltip is precise: the first replacement runs if the workflow fails, or exceeds its max time, without leaving anything published. That means nothing loaded and nothing done outside Hydra ETL, or everything undone by <code>rollback: true</code>. If the workflow had already published data, the project stops and says why. In the project of this lesson, <code>wf_report</code> has <code>rollback: true</code>; with <code>Data/finalize.csv</code> missing, its last step fails:</p>",
  "The box is checked on <code>wf_report</code>. After the failure, Hydra ETL undoes the steps, then runs the backup and carries on.",
  "✓  Step 'build_report' OK\n✓  Step 'share' OK\n✗  Step 'finalize' FAILED: ValueError: CSVConnector [src]: source file not found.\n↩  Step 'share' undone\n↩  Step 'build_report' undone\n↯  Workflow 'wf_report' failed (&lt;duration&gt;), nothing published — replaced by wf_report_quarantine\n↪  Fallback: wf_report → wf_report_quarantine — wf_report failed without publishing anything\n▶  Workflow  wf_report_quarantine  (fallback, in place of wf_report)\n✓  Workflow 'wf_report_quarantine' OK\n✅ Project completed — 3/4 workflow(s) OK",
  [fig(F47, "on-failure-checkbox-wf-report", "The fallback editor of wf_report with the also after a failure box checked.", "The failure option is a checkbox, saved as on_failure: true."), ])]
# ----------------------------------------------------------------------------------------------- 48
F48 = "studio-set-timeouts-on-workflows"
d48 = dict(n=48, slug="set-timeouts-on-workflows", eyebrow="Timeouts", where="Execution order → max", minutes=15, needs="a project with a slow workflow",
 title="Workflow Timeout in Hydra ETL Studio | Hydra ETL", h1plain="Set a timeout on a workflow in Hydra ETL Studio", h1="Set a timeout on a workflow in Hydra ETL Studio",
 meta="Set a maximum duration on a Hydra ETL workflow, see when it stops and read the timeout in the run. Tested on Hydra ETL 0.22.", crumb="Set a timeout",
 lead="A workflow that never ends is a failure you notice too late. Give it a maximum duration, and Hydra ETL stops it at the next safe point.",
 quick="To set a timeout on a Hydra ETL workflow, type a duration such as <code>5s</code>, <code>5m</code> or <code>1h</code> in the <b>max</b> field of the workflow in <b>Execution order</b> and save. It is written as <code>timeout:</code> in <code>thread.yaml</code>. Beyond it, the workflow is stopped at the next step or batch and counts as failed.",
 goal="Set a maximum duration on one workflow, run it, and read exactly when and how it stops. A fallback can answer a timeout like any other failure.",
 project="The <code>fallback-demo</code> copy of <code>fallbackproject</code>, with <code>wf_conflict</code> alone in the thread. It runs <code>build_report</code>, waits 30 seconds with a <code>delay</code> action, then runs <code>finalize</code>. It has <code>rollback: true</code>.",
 h2="How do I set a timeout on a workflow in Hydra ETL?", jsonsteps=["Find the max field", "Type a duration", "Save and run", "Read how it stopped", "Read the timeout in thread.yaml"],
 faq=[("How do I set a timeout on a Hydra ETL workflow?", "Type a duration such as 30s, 5m or 1h in the max field of the workflow in Execution order, or add a timeout line to the workflow in workflows/thread.yaml."),
      ("Does the timeout stop a step in the middle?", "No. The workflow is stopped at the next step or batch. A long step finishes before the stop takes effect."),
      ("What happens to the workflow after a timeout?", "It counts as failed. With rollback: true its finished steps are undone, and a fallback with on_failure: true can run in its place."),
      ("Does a fallback run have its own timeout?", "The limit applies to the workflow and to each fallback run in its place, according to the tooltip of the max field in Studio.")],
 related=[("/studio/declare-a-fallback-workflow", "Declare a fallback workflow"), ("/studio/fallback-conditions-when-on-failure", "Fallback conditions"), ("/studio/dry-run-and-use-fallback", "Dry run and --use-fallback"), ("/dsl/workflow-yaml", "workflow.yaml reference")],
 next=("The last lesson of this block rehearses everything without running a workflow, and forces a fallback on demand.", '<a class="primary" href="/studio/dry-run-and-use-fallback">Dry run and --use-fallback <span aria-hidden="true">→</span></a>'),
 tips=[("TIP", "Pick a limit well above the normal duration, so it only stops a real problem."), ("TIP", "An empty <b>max</b> field means no limit."),
       ("TRAP", "The stop happens at the <b>next step or batch</b>. A single long step runs to the end, as the 30-second wait does here."), ("TRAP", "A timeout in <code>thread.yaml</code> applies to the project run, not to <code>hdrctl workflow run</code> of a single workflow.")],
 end=[("Field", "<b>max</b> holds a duration such as <code>5s</code> and is not red"), ("YAML", "A <code>timeout: 5s</code> line under the workflow"), ("Run", "The workflow fails with <code>timed out after 5s</code>"), ("Rollback", "The finished step is undone")],
 wrong=[("The <b>max</b> field turns red", "The duration is not valid", "Write a number and a unit: <code>30s</code>, <code>5m</code> or <code>1h</code>"), ("The run lasts longer than the limit", "A step was still running when the limit passed", "The stop is applied at the next step or batch"), ("The timeout is ignored", "The workflow was run alone", "Run the project: <code>hdrctl run .</code>")],
 steps=[])
d48["steps"] = [
 step(1, "Find the max field", "Locate where a workflow's duration limit is set.", ["Open <b>Project settings → Execution order</b>.", "Find the <b>max</b> field on the row of the workflow."], "Execution order → wf_conflict → max",
  "<p>The field sits on the workflow row, between <b>wait</b> and the lifebuoy. Its tooltip explains it: the maximum duration of the workflow and of each fallback run in its place, written <code>30s</code>, <code>5m</code> or <code>1h</code>; empty means no limit.</p>", "One stage with <code>wf_conflict</code> and an empty <b>max</b> field.", None, []),
 step(2, "Type a duration", "Give the workflow five seconds.", ["Select the <b>max</b> field.", "Type <code>5s</code>.", "Check the border stays normal."], "5s",
  "<p>A red border means the value cannot be read. Five seconds is deliberately short: <code>wf_conflict</code> waits 30 seconds, so the limit will be exceeded.</p>", "<code>5s</code> in the field, with a normal border.", None,
  [fig(F48, "workflow-timeout-field-filled", "The Execution order panel with the max field of wf_conflict set to 5s.", "The limit is one short field per workflow.")]),
 step(3, "Save and run", "Write the limit and start the project.", ["Select <b>Save</b>.", "Go back to the project and select <b>Run project</b>.", "Open the run."], "hdrctl run .",
  "<p>The run lasts about 30 seconds because the <code>delay</code> step cannot be interrupted.</p>", "A run that ends in <b>Failed</b>.", None, []),
 step(4, "Read how it stopped", "Understand when the stop happened and what was undone.", ["Read the failed run.", "Open the failed step."], "hdrctl run .",
  "<p>The timeout is announced at the moment it expires, then enforced at the next step. Because the workflow has <code>rollback: true</code>, the step that had finished is undone:</p>", "The run page reads <b>Failed</b> with <b>0 ok / 1</b>. The step carries a <b>timed out</b> badge and the message <b>timed out after 5s (timeout in workflows/thread.yaml) (changes undone)</b>.",
  "▶  Workflow  wf_conflict\n⏳  wf_conflict: timed out after 5s — stopping at the next step or batch\n   ✓  Step 'build_report' OK (&lt;duration&gt;)\n   ✓  Step 'wait' OK (30.0s)\n   ↩  Step 'build_report' undone\n✗  Workflow 'wf_conflict' failed (30.4s): timed out after 5s (timeout in workflows/thread.yaml) (changes undone)\n❌ Project failed — failed: wf_conflict",
  [fig(F48, "run-timeout-failed-detail", "The run detail page of a project whose workflow wf_conflict failed after exceeding its 5 second timeout.", "The run shows the failure and its reason.")]),
 step(5, "Read the timeout in thread.yaml", "See the same limit as text.", ["Open <b>Hydra DSL</b> or the file <code>workflows/thread.yaml</code>."], "timeout: 5s",
  "<p>This is the form written by Studio, validated with Hydra ETL 0.22.0:</p><pre class=\"out\">thread:\n  - mode: sequential\n    workflows:\n      - name: wf_conflict\n        active: true\n        timeout: 5s</pre>", "A <code>timeout</code> line under the workflow it limits.", None, [])]
# ----------------------------------------------------------------------------------------------- 49
F49 = "studio-dry-run-and-use-fallback"
d49 = dict(n=49, slug="dry-run-and-use-fallback", eyebrow="Dry run", where="hdrctl run --dry-run · --use-fallback", minutes=15, needs="a project with fallbacks",
 title="hdrctl dry-run and --use-fallback | Hydra ETL", h1plain="Rehearse fallbacks in Hydra ETL: --dry-run and --use-fallback", h1="Rehearse fallbacks in Hydra ETL: --dry-run and --use-fallback",
 meta="Check a Hydra ETL fallback with hdrctl run --dry-run, then force it with --use-fallback without moving a file. Tested on Hydra ETL 0.22.", crumb="Dry run and --use-fallback",
 lead="You should not have to delete a file to find out whether your backup works. Print the plan, then force the switch.",
 quick="Run <code>hdrctl run . --dry-run</code> to print the execution plan, with a <code>↪ fallback</code> line under each workflow that has one, and write nothing. Run <code>hdrctl run . --use-fallback wf_load</code> to force the backup of <code>wf_load</code> without changing any file. The option applies to a project, not to a single job.",
 goal="Print the plan of a project with fallbacks, read its warnings, force a fallback on demand and recognize the two refusals.",
 project="The <code>fallback-demo</code> copy of <code>fallbackproject</code> with its three fallbacks, <code>Data/orders.csv</code> present and <code>Data/stamp.txt</code> absent.",
 h2="How do I rehearse a fallback in Hydra ETL?", jsonsteps=["Print the plan with --dry-run", "Check the project in Studio", "Force a fallback with --use-fallback", "Read the chain reaction", "Recognize the refusals"],
 faq=[("What does hdrctl run --dry-run do with fallbacks?", "It prints the execution plan with a fallback line under each workflow that has one, validates the project and writes nothing."),
      ("How do I force a fallback in Hydra ETL?", "Run hdrctl run . --use-fallback followed by the name of the workflow that declares it, for example wf_load."),
      ("Can I use --use-fallback on a single job?", "No. Hydra ETL refuses it: the option applies to a project, hdrctl run followed by a project folder."),
      ("Why did a second fallback run after I forced the first?", "Conditions are tested in order. After wf_load_backup loaded 8 rows, previous.rows < 10 was true for wf_report, so its own fallback ran too.")],
 related=[("/studio/declare-a-fallback-workflow", "Declare a fallback workflow"), ("/studio/fallback-conditions-when-on-failure", "Fallback conditions"), ("/studio/set-timeouts-on-workflows", "Set a timeout on a workflow"), ("/cli", "The hdrctl command line")],
 next=("This block is complete. The next lessons of the course cover the Condition and Delay nodes inside a workflow.", '<a class="primary" href="/studio">Back to the course map <span aria-hidden="true">→</span></a>'),
 tips=[("TIP", "Run <code>--dry-run</code> after every change to <code>thread.yaml</code>."), ("TIP", "<code>-v</code> prints a line for each fallback that was <b>not</b> needed, with the value that was measured."),
       ("TRAP", "<code>--use-fallback</code> forces one workflow only. Later conditions are still tested and can switch too."), ("TRAP", "A dry run validates and plans. It does not test that the backup's data exists.")],
 end=[("Plan", "A <code>↪ fallback</code> line under each workflow with a fallback"), ("Warning", "A warning when a backup writes elsewhere"), ("Forced", "<code>forced (--use-fallback)</code> in the switch line"), ("Refusals", "Two clear errors, no run")],
 wrong=[("<code>has no fallback in workflows/thread.yaml</code>", "The name is not a workflow that declares a fallback", "Use the main workflow's name, not the backup's"), ("<code>applies to a project … not to a single job</code>", "A job folder was given", "Give the project folder: <code>hdrctl run .</code>"), ("No <code>↪ fallback</code> line in the plan", "The fallback block is not in <code>thread.yaml</code>", "Declare it in Execution order and save")],
 steps=[])
d49["steps"] = [
 step(1, "Print the plan with --dry-run", "See every fallback of the project before anything runs.", ["Open a terminal in the project folder.", "Run the command below.", "Read the plan."], "hdrctl run . --dry-run",
  "<p>A dry run validates the project and prints the plan. Each fallback appears under its workflow, with its condition. A warning appears when the backup publishes somewhere else than the workflow it replaces.</p>", "A plan with three <code>↪ fallback</code> lines, one warning, and <b>Dry run OK</b>.",
  "Stage 1/2 — sequential\n   •  wf_load  (1: load_orders)\n      ↪  fallback: wf_load_backup (if not file_exists('Data/orders.csv') or file_size('Data/orders.csv') &lt; 100)\n   •  wf_report  (3: build_report, share, finalize)\n      ↪  fallback: wf_report_quarantine (if previous.rows &lt; 10; on failure)\nStage 2/2 — sequential\n   •  wf_archive  (1: archive)\n      ↪  fallback: wf_archive_alt (if file_age('Data/stamp.txt') &gt; 30s)\n⚠  workflows/thread.yaml: workflow 'wf_report' fallback: 'wf_report_quarantine' writes to ['csv:../../outputs/quarantine.csv'] instead of [...] (fine for a quarantine workflow; otherwise check it)\n\n✅ Dry run OK: the project is valid. Nothing was executed.",
  [fig(F49, "terminal-dry-run-fallback-plan", "The Studio terminal after hdrctl run . --dry-run, ending with Dry run OK.", "The terminal built into Studio runs the same command.")]),
 step(2, "Check the project in Studio", "Get the same validation from the interface.", ["Open <b>Project settings → Execution order</b>.", "Select <b>Check</b>."], "Execution order → Check",
  "<p>Check validates the project like a dry run, and shows the same warning.</p>", "A green line <b>Ready: wf_load → wf_report → wf_archive</b> followed by the warning about <code>wf_report_quarantine</code>.", None,
  [fig(F49, "project-check-quarantine-warning", "The Execution order panel after Check, with a Ready line and a warning about wf_report_quarantine.", "Check and --dry-run report the same things.")]),
 step(3, "Force a fallback with --use-fallback", "Switch to a backup without touching the data.", ["Name the workflow that declares the fallback.", "Run the command.", "Read the switch line."], "hdrctl run . --use-fallback wf_load",
  "<p><code>Data/orders.csv</code> is still there. The switch line says why the backup ran:</p>", "<code>forced (--use-fallback)</code> in the first line, then the backup under its own name. The Studio terminal shows only the end of a long output: scroll up to read the first lines.",
  "↪  Fallback: wf_load → wf_load_backup — forced (--use-fallback)\n▶  Workflow  wf_load_backup  (fallback, in place of wf_load)\n   ✓  Step 'load_orders_backup' OK (&lt;duration&gt;)\n✓  Workflow 'wf_load_backup' OK (&lt;duration&gt;)",
  [fig(F49, "terminal-use-fallback-forced-run", "The Studio terminal after hdrctl run . --use-fallback wf_load, showing the forced switch.", "The end of the forced run. The first lines, with the switch itself, scroll above.")]),
 step(4, "Read the chain reaction", "Understand why a second fallback ran.", ["Read the lines after the first switch."], "hdrctl run . --use-fallback wf_load",
  "<p>The backup of <code>wf_load</code> loads 8 rows, not 20. The condition of <code>wf_report</code> is <code>previous.rows &lt; 10</code>, so it is now true:</p>", "A second switch for <code>wf_report</code>, caused by the rows the backup wrote.",
  "↪  Fallback: wf_report → wf_report_quarantine — previous.rows = 8\n▶  Workflow  wf_report_quarantine  (fallback, in place of wf_report)\n✓  Workflow 'wf_report_quarantine' OK\n✅ Project completed — 3/3 workflow(s) OK", []),
 step(5, "Recognize the refusals", "Know the two errors you will meet.", ["Force a backup by its own name.", "Pass a job folder instead of a project."], "hdrctl run . --use-fallback wf_archive_alt",
  "<p>Hydra ETL refuses both before running anything:</p>", "An error, and no run.",
  "❌ Project cannot run:\n  err   — --use-fallback wf_archive_alt: workflow 'wf_archive_alt' has no fallback in workflows/thread.yaml\n\nhdrctl run jobs/load_orders --use-fallback wf_load\n❌ --use-fallback applies to a project (hdrctl run &lt;project&gt;), not to a single job: jobs/load_orders", [])]

LESSONS = [d47, d48, d49]
for d in LESSONS:
    (ROOT/"src/_mock"/f"studio-lesson-{d['n']}-{d['slug']}.main.html").write_text(lesson(d), encoding="utf-8")
    (ROOT/"src/pages/studio"/f"{d['slug']}.astro").write_text(astro(d), encoding="utf-8")
hub = ROOT/"src/data/studio-lessons.js"; s = hub.read_text(encoding="utf-8")
for title, slug in [("Fallback conditions: when, on_failure, on_probe_error", d47["slug"]), ("Set timeouts on workflow steps", d48["slug"]), ("Dry run and --use-fallback", d49["slug"])]:
    old = f'{{"label":'
    i = s.index(f'"title": "{title}"'); j = s.rfind('{"label"', 0, i)
    if s[j:j+8] == '{"label"': s = s[:j] + f'{{"slug": "{slug}", ' + s[j+1:]
hub.write_text(s, encoding="utf-8")
print("lessons written:", [d["slug"] for d in LESSONS])
