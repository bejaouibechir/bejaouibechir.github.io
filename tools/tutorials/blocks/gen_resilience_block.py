"""Block R2 resilience (lessons 42 to 45): writes the lesson HTML, Astro pages, hub entries, capture templates.
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
def fix_pre(html, d):
    return html.replace(PRE2, d["prereq2"])
RELCOMMON = [("/dsl/workflow-yaml", "workflow.yaml reference"), ("/cli", "The hdrctl command line")]
# ----------------------------------------------------------------------------------------------- 42
F42 = "studio-all-or-nothing-load"
d42 = dict(n=42, slug="all-or-nothing-load", eyebrow="All-or-nothing load", where="destinations.yaml → atomic", minutes=20, needs="the resilience-demo project",
 prereq2='<li>The <code>resilience-demo</code> copy of <code>fallbackproject</code>: the job <code>atomic_demo</code> loads <code>Data/big.csv</code> (2,500 rows, one invalid) into <code>outputs/atomic_demo.csv</code>.</li>',
 title="All-or-Nothing Load in Hydra ETL | Hydra ETL", h1plain="Make a load all-or-nothing in Hydra ETL Studio", h1="Make a load all-or-nothing in Hydra ETL Studio",
 meta="Keep a destination file untouched when a batch fails in the middle of a load, and see what happens when you turn it off. Tested on Hydra ETL 0.22.", crumb="All-or-nothing load",
 lead="A load that fails at batch three should not leave you with two batches of new data and a broken file. Make it all or nothing.",
 quick="A Hydra ETL load is all-or-nothing when the destination setting <code>atomic</code> is on. If one batch fails, the destination keeps its previous content. In replace mode it is on by default; <code>atomic: false</code> turns it off, and the batches already written then stay in the file.",
 goal="Load a file in batches, make one batch fail, check that the destination still holds its previous content, then turn the protection off to see the difference.",
 project="The <code>resilience-demo</code> copy of <code>fallbackproject</code>. The job <code>atomic_demo</code> reads <code>Data/big.csv</code> in batches of 1,000 rows, casts <code>amount</code> to an integer and replaces <code>outputs/atomic_demo.csv</code>, which holds one line, <code>OLD,0</code>. Row 2,200 of <code>big.csv</code> contains <code>abc</code> instead of a number.",
 h2="How do I make a load all-or-nothing in Hydra ETL?", jsonsteps=["Find the atomic setting", "Run a load that fails", "Turn all-or-nothing off", "Fix the data and load again"],
 faq=[("What does all-or-nothing mean in Hydra ETL?", "If a batch fails during a load, the destination keeps exactly what it had before the run. Nothing from the batches already processed is published."),
      ("Is all-or-nothing on by default?", "In replace mode, yes. In our test of a CSV destination in replace mode, the file kept its previous content after a failure in the third batch. The default differs by destination type, and the dialog states it in the label of the setting."),
      ("What happens with atomic set to false?", "The batches that succeeded stay in the destination. In our test the file held 2,001 lines, the header and the 2,000 rows of the first two batches."),
      ("Which batch failed in the test?", "The third. With batches of 1,000 rows, row 2,200 is the 200th row of the third batch, and the error message points at position 199 of that batch.")],
 related=[("/studio/roll-back-a-failed-workflow", "Roll back a failed workflow"), ("/studio/declare-undo-actions", "Declare the undo of an action"), ("/studio/resolve-conflicts-and-recover", "Resolve conflicts and recover")] + RELCOMMON,
 next=("The next lesson goes one level up: it undoes the steps of a whole workflow when one of them fails.", '<a class="primary" href="/studio/roll-back-a-failed-workflow">Roll back a failed workflow <span aria-hidden="true">→</span></a>'),
 tips=[("TIP", "Keep the default for replace mode. Turn <b>atomic</b> off only when partial progress is useful and you can restart from it."), ("TIP", "Set <code>batch_size</code> on the source: smaller batches fail earlier and waste less work."),
       ("TRAP", "All-or-nothing protects <b>one destination</b>. A workflow that wrote other files before the failure needs a rollback, the subject of the next lesson."), ("TRAP", "Remove <code>atomic: false</code> after the experiment: leaving it off in a shared project hides the problem.")],
 end=[("Failed run", "The workflow fails on <code>cast</code> and names the column and the value"), ("Protected file", "<code>outputs/atomic_demo.csv</code> still holds <code>OLD,0</code>"), ("Unprotected file", "With <code>atomic: false</code> the file has 2,001 lines"), ("Clean load", "With a valid file, the destination has 2,501 lines")],
 wrong=[("The file changed although the run failed", "<code>atomic: false</code> is set on the destination", "Remove the line, or set <code>atomic: true</code>"), ("The run does not fail", "<code>Data/big.csv</code> is the valid file", "Copy <code>Data/big_bad.csv</code> over it"), ("Nothing about batches in the log", "The source has no <code>batch_size</code>", "Add <code>batch_size: 1000</code> to the source extract settings")],
 steps=[])
d42["steps"] = [
 step(1, "Find the atomic setting", "Find where all-or-nothing is set for this destination.", ["Open a terminal in the project folder.", "Print the destination file of the job."], "Get-Content jobs\\atomic_demo\\destinations.yaml",
  "<p>The setting is called <code>atomic</code>. Here it is absent, so the default applies: in replace mode, all-or-nothing. In Studio, the dialog of a database destination (MySQL, PostgreSQL and the others that support it) has a list <b>All-or-nothing</b> with the choices <b>default</b>, <b>yes</b> and <b>no</b>. A CSV destination has no such list: you write <code>atomic:</code> in the YAML file, under <code>load:</code>.</p>", "The destination <code>dst</code> of type <code>csv</code>, with <code>mode: replace</code> and no <code>atomic</code> line.",
  "version: '1.0'\ndestinations:\n  dst:\n    type: csv\n    connection: {}\n    load:\n      table: ../../outputs/atomic_demo.csv\n      mode: replace",
  [fig(F42, "terminal-destination-yaml-replace", "The Studio terminal showing jobs/atomic_demo/destinations.yaml, a CSV destination in replace mode without an atomic line.", "No atomic line: the default applies.")]),
 step(2, "Run a load that fails", "See the destination protected from a failure in the middle of a load.", ["Open a terminal in the project folder.", "Run the workflow.", "Print the destination file."], "hdrctl workflow run wf_atomic_demo",
  "<p>Two batches of 1,000 rows are valid. The third fails when it reaches row 2,200. Without protection the first two batches would already be in the file.</p>", "A failed workflow, and a file that still holds its single old line.",
  "✗  Step 'atomic_demo' FAILED: ValueError: Step 1/1: cast: cannot convert column='amount' to type='int': Unable to parse string &quot;abc&quot; at position 199\n❌ Workflow 'wf_atomic_demo' FAILED in &lt;duration&gt; — Step 'atomic_demo' failed: ValueError: Step 1/1: cast: cannot convert column='amount' to type='int': Unable to parse string &quot;abc&quot; at position 199\n\nid,amount\nOLD,0",
  [fig(F42, "terminal-atomic-load-failed", "The Studio terminal after a failed load of wf_atomic_demo, followed by the content of outputs/atomic_demo.csv.", "The run fails, and the old file is intact.")]),
 step(3, "Turn all-or-nothing off", "Measure what the protection saves you.", ["Add <code>atomic: false</code> under <code>load:</code> in <code>jobs/atomic_demo/destinations.yaml</code>.", "Run the workflow again.", "Count the lines of the file."], "atomic: false",
  "<p>The workflow fails on the same row, but the destination now holds what the first two batches wrote:</p>", "The same error, and a file that is no longer the old one.",
  "❌ Workflow 'wf_atomic_demo' FAILED in &lt;duration&gt; — Step 'atomic_demo' failed: ValueError: …\n\nlines in outputs/atomic_demo.csv: 2001", []),
 step(4, "Fix the data and load again", "Finish with a clean load.", ["Remove the <code>atomic: false</code> line.", "Replace <code>Data/big.csv</code> with the valid file.", "Run the workflow."], "hdrctl workflow run wf_atomic_demo",
  "<p>With 2,500 valid rows, the workflow completes and replaces the file in one piece.</p>", "A completed workflow and a file of 2,501 lines.",
  "✓  Step 'atomic_demo' OK (&lt;duration&gt;)\n✅ Workflow 'wf_atomic_demo' completed in &lt;duration&gt; — 1/1 steps OK\n\nlines in outputs/atomic_demo.csv: 2501", [])]
# ----------------------------------------------------------------------------------------------- 43
F43 = "studio-roll-back-a-failed-workflow"
d43 = dict(n=43, slug="roll-back-a-failed-workflow", eyebrow="Rollback", where="Workflow toolbar → Rollback", minutes=20, needs="the resilience-demo project",
 prereq2='<li>The <code>resilience-demo</code> project, where <code>wf_report</code> builds a report, shares a copy and then runs <code>finalize</code>. The file <code>Data/finalize.csv</code> is renamed so that the last step fails.</li>',
 title="Roll Back a Failed Workflow in Hydra ETL | Hydra ETL", h1plain="Roll back a failed workflow in Hydra ETL Studio", h1="Roll back a failed workflow in Hydra ETL Studio",
 meta="Turn on rollback so that a failed Hydra ETL workflow undoes its finished steps, last one first. Tested on Hydra ETL 0.22.", crumb="Roll back a failed workflow",
 lead="When step three of three fails, steps one and two have already changed things. Rollback puts them back, last step first.",
 quick="Turn on <b>Rollback</b> in the workflow toolbar, or write <code>rollback: true</code> in the workflow file. If a step fails, Hydra ETL undoes the finished steps, the last one first. Jobs are undone automatically; an action must say how it is undone.",
 goal="Turn rollback on, give an action its undo, make the last step fail and check that the files are back in their previous state.",
 project="The <code>resilience-demo</code> project with <code>wf_report</code>: <code>build_report</code> (a job that replaces <code>outputs/report.csv</code>), <code>share</code> (a python action that copies the report to <code>outputs/share</code>, with an undo that deletes the copy) and <code>finalize</code> (a job that fails because <code>Data/finalize.csv</code> is missing).",
 h2="How do I roll back a failed workflow in Hydra ETL?", jsonsteps=["Turn rollback on", "Give an action its undo", "Make the last step fail", "Check that everything is back", "Read rollback in the workflow file"],
 faq=[("What does rollback do in Hydra ETL?", "When a step of the workflow fails, Hydra ETL undoes the steps already finished, the last one first. The workflow is then reported as failed with the mention that its changes were undone."),
      ("Are jobs undone automatically?", "Yes. In our test, build_report restored the previous report file. A job that writes a file keeps a backup of the previous version, and rollback puts it back."),
      ("What about actions?", "An action acts outside Hydra ETL, so Hydra ETL cannot guess how to reverse it. With rollback on, each action must declare an undo, or undo: none. The next lesson shows how."),
      ("Does rollback run when a step succeeds?", "No. It runs when a step fails, and it undoes the steps that had finished before.")],
 related=[("/studio/all-or-nothing-load", "All-or-nothing loads"), ("/studio/declare-undo-actions", "Declare the undo of an action"), ("/studio/resolve-conflicts-and-recover", "Resolve conflicts and recover"), ("/studio/declare-a-fallback-workflow", "Declare a fallback workflow")] + RELCOMMON[:1],
 next=("The next lesson explains how to tell Hydra ETL how an action is undone, and what the validation says when you forget.", '<a class="primary" href="/studio/declare-undo-actions">Declare the undo of an action <span aria-hidden="true">→</span></a>'),
 tips=[("TIP", "Run <code>hdrctl workflow validate</code> after turning rollback on: it lists every action that has no undo."), ("TIP", "Rollback and a fallback work together: after a rollback, <code>on_failure: true</code> can start a backup, as in lesson 47."),
       ("TRAP", "Rollback undoes what Hydra ETL did. It cannot undo a side effect you did not declare, such as a message already sent."), ("TRAP", "The failed step is not undone, only the steps finished before it.")],
 end=[("Toolbar", "The button reads <b>Rollback on</b>"), ("Run", "<code>✗ Step 'finalize' FAILED</code> followed by two <code>↩ … undone</code> lines"), ("Report", "<code>outputs/report.csv</code> has its previous content"), ("Share", "<code>outputs/share</code> no longer holds a copy")],
 wrong=[("The button reads <b>Rollback off</b>", "The workflow has no <code>rollback: true</code>", "Select the button, it saves the workflow"), ("Validation refuses the workflow", "An action has no undo", "Open the action and set its <b>Undo</b>, see the next lesson"), ("The failed step is not undone", "Only the steps finished before it are undone", "Make the failing step safe to retry instead")],
 steps=[])
d43["steps"] = [
 step(1, "Turn rollback on", "Switch the protection on for one workflow.", ["Open the workflow <code>wf_report</code> in the editor.", "Select <b>Rollback</b> in the toolbar until it reads <b>Rollback on</b>."], "rollback: true",
  "<p>The button saves the workflow when you select it. Its tooltip says what it does: if the workflow fails, undo the steps already done, the last one first; jobs automatically, actions with their <b>Undo</b> setting.</p>", "A highlighted button reading <b>Rollback on</b>.", None,
  [fig(F43, "workflow-rollback-toolbar-on", "The workflow editor of wf_report with the Rollback button on in the toolbar.", "Rollback is one button in the workflow toolbar.")]),
 step(2, "Give an action its undo", "Say how to reverse the action that copies the report.", ["Double-click the <code>share</code> node.", "Find the <b>Undo (if the workflow rolls back)</b> section.", "Read the action chosen there."], "undo: python",
  "<p>The <code>share</code> action copies the report into <code>outputs/share</code>. Its undo is a second python action that deletes the copy. Hydra ETL runs it only if a later step fails.</p>", "A <b>Run an action: python</b> choice, with the script that removes the copy.", None,
  [fig(F43, "undo-editor-share-dialog", "The dialog of the share action with the Undo section set to run a python action.", "The undo is configured next to the action it reverses.")]),
 step(3, "Make the last step fail", "Provoke the failure that triggers the rollback.", ["Rename <code>Data/finalize.csv</code> so that the job cannot read it.", "Run the workflow."], "hdrctl workflow run wf_report",
  "<p><code>build_report</code> and <code>share</code> succeed. <code>finalize</code> fails. Hydra ETL then undoes <code>share</code>, and <code>build_report</code>, in that order.</p>", "Two checkmarks, a failure, two undo lines, and a failed workflow marked <b>changes undone</b>.",
  "✓  Step 'build_report' OK (&lt;duration&gt;)\n✓  Step 'share' OK (&lt;duration&gt;)\n✗  Step 'finalize' FAILED: ValueError: CSVConnector [src]: source file not found.\n↩  Step 'share' undone\n↩  Step 'build_report' undone\n❌ Workflow 'wf_report' FAILED in &lt;duration&gt; — Step 'finalize' failed: ValueError: CSVConnector [src]: source file not found. … (changes undone)",
  [fig(F43, "terminal-rollback-failed-run", "The Studio terminal after a failed run of wf_report, with the two undone steps.", "The steps are undone in reverse order.")]),
 step(4, "Check that everything is back", "Verify the state instead of trusting the log.", ["List <code>outputs/share</code>.", "Open <code>outputs/report.csv</code>."], "Get-ChildItem outputs\\share",
  "<p>The shared copy is gone, and the report holds what it held before the run. The temporary backup that the job used is removed.</p>", "An empty <code>outputs/share</code> folder and a report identical to the one before the run.", None, []),
 step(5, "Read rollback in the workflow file", "See the same setting as text.", ["Open <b>Hydra DSL</b> or the file <code>workflows/wf_report.yaml</code>."], "rollback: true",
  "<p>The setting is one line at the level of the workflow, next to <code>trigger</code>. The action carries its own <code>undo</code>:</p><pre class=\"out\">workflow:\n  name: wf_report\n  rollback: true\n  steps:\n    - name: share\n      type: action\n      action: python\n      params:\n        script: …\n      undo:\n        action: python\n        params:\n          script: import os; os.remove('outputs/share/report.csv')</pre>", "A <code>rollback: true</code> line and an <code>undo</code> block under the action.", None, [])]
# ----------------------------------------------------------------------------------------------- 44
F44 = "studio-declare-undo-actions"
d44 = dict(n=44, slug="declare-undo-actions", eyebrow="Undo actions", where="Action dialog → Undo", minutes=20, needs="the resilience-demo project",
 prereq2='<li>The <code>resilience-demo</code> project. Its workflow <code>wf_bad_rollback</code> has <code>rollback: true</code> and a python action <code>notify</code> with no undo.</li>',
 title="Declare the Undo of an Action in Hydra ETL | Hydra ETL", h1plain="Declare the undo of an action in Hydra ETL Studio", h1="Declare the undo of an action in Hydra ETL Studio",
 meta="Tell Hydra ETL how to reverse a python, bash or other action, or that there is nothing to reverse, and read the validation error. Tested on Hydra ETL 0.22.", crumb="Declare the undo of an action",
 lead="Hydra ETL can restore a file it wrote. It cannot guess how to reverse a command you ran. You must say it, or say there is nothing to say.",
 quick="With <code>rollback: true</code>, every action needs an <code>undo</code>: either the action that reverses it, or <code>undo: none</code> when there is nothing to reverse. Without it, <code>hdrctl workflow validate</code> refuses the workflow and names the step.",
 goal="Read the refusal of a workflow whose action has no undo, set the undo in the Studio dialog, and see the validation pass.",
 project="The <code>resilience-demo</code> project and its workflow <code>wf_bad_rollback</code>: <code>build_report</code> (a job) then <code>notify</code>, a python action that prints <code>done</code>. The workflow has <code>rollback: true</code>.",
 h2="How do I declare the undo of an action in Hydra ETL?", jsonsteps=["Read the refusal", "Open the action dialog", "Choose its undo", "Read the undo in the workflow file", "Validate again"],
 faq=[("Why does Hydra ETL refuse my workflow with rollback on?", "Because an action acts outside Hydra ETL. The message names the step and says to add undo with the action that reverses it, or undo: none when there is nothing to reverse."),
      ("When should I use undo: none?", "When the action has no effect to reverse, for example a notification that only prints a line. If it does change something, write the action that reverses it."),
      ("Which actions can serve as an undo?", "The Studio list offers bash, powershell, python, webhook, ssh, email and log."),
      ("What does hdrctl workflow undo do?", "It finishes an interrupted rollback. When nothing is pending, it answers that there is nothing to undo; it does not undo a workflow that completed.")],
 related=[("/studio/roll-back-a-failed-workflow", "Roll back a failed workflow"), ("/studio/resolve-conflicts-and-recover", "Resolve conflicts and recover"), ("/studio/all-or-nothing-load", "All-or-nothing loads")] + RELCOMMON,
 next=("The last lesson of this block covers the case where the undo itself cannot run, because someone changed a file by hand.", '<a class="primary" href="/studio/resolve-conflicts-and-recover">Resolve conflicts and recover <span aria-hidden="true">→</span></a>'),
 tips=[("TIP", "The undo of an action should be safe to run twice."), ("TIP", "Write the undo when you write the action, while you still remember what it changes."),
       ("TRAP", "<code>undo: none</code> is a statement, not a default. Use it only when it is true."), ("TRAP", "<code>hdrctl workflow undo</code> does not reverse a workflow that finished: it only completes a rollback that was interrupted.")],
 end=[("Refusal", "<code>Invalid workflow: rollback: true, but some steps cannot be undone</code>"), ("Dialog", "The <b>Undo</b> list shows <b>Nothing to undo</b> or an action"), ("File", "A line <code>undo: none</code> or an <code>undo</code> block under the action"), ("Validation", "<code>Workflow valid — no errors detected</code>")],
 wrong=[("The refusal still appears after you set the undo", "The workflow was not saved", "Save it, then validate again"), ("The <b>Undo</b> list is missing in the dialog", "The node is a job, which is undone automatically", "Open an action node"), ("<code>Nothing to undo for 'wf_report'</code>", "No rollback was interrupted", "This is the expected answer: nothing is pending")],
 steps=[])
d44["steps"] = [
 step(1, "Read the refusal", "Know what Hydra ETL says when an action has no undo.", ["Open a terminal in the project folder.", "Validate the workflow."], "hdrctl workflow validate wf_bad_rollback",
  "<p>The check happens before any run, so nothing is executed and nothing needs to be repaired.</p>", "An invalid workflow, with the name of the step and what to add.",
  "❌ Invalid workflow: rollback: true, but some steps cannot be undone:\n  - step 'notify': the 'python' action acts outside Hydra; with rollback: true add undo: (the action that reverses it) or undo: none (nothing to reverse)",
  [fig(F44, "terminal-validate-undo-refused", "The Studio terminal after hdrctl workflow validate wf_bad_rollback, showing the refusal for the step notify.", "The refusal names the step and the two ways out.")]),
 step(2, "Open the action dialog", "Find the Undo section of the action.", ["Open <code>wf_bad_rollback</code> in the editor.", "Double-click the <code>notify</code> node.", "Scroll to <b>Undo (if the workflow rolls back)</b>."], "Undo (if the workflow rolls back)",
  "<p>The list reads <b>Not set (required when the workflow has rollback on)</b>. That is the state that triggers the refusal.</p>", "A dashed frame with the <b>Undo action</b> list set to <b>Not set</b>.", None,
  [fig(F44, "undo-editor-not-set-dialog", "The dialog of the notify action with the Undo list showing Not set.", "Not set is the state that the validation refuses.")]),
 step(3, "Choose its undo", "Say that there is nothing to reverse.", ["Open the <b>Undo action</b> list.", "Choose <b>Nothing to undo</b>.", "Save the workflow."], "undo: none",
  "<p>The <code>notify</code> action only prints a line, so there is nothing to reverse. If it created a file, you would choose <b>Run an action</b>, then the action and its settings, as <code>share</code> does in the previous lesson.</p>", "<b>Nothing to undo</b> shown in the list.", None,
  [fig(F44, "undo-editor-nothing-selected", "The dialog of the notify action with the Undo list set to Nothing to undo.", "Nothing to undo is an explicit choice.")]),
 step(4, "Read the undo in the workflow file", "See the same choice as text.", ["Open <b>Hydra DSL</b> or <code>workflows/wf_bad_rollback.yaml</code>."], "undo: none",
  "<p>The line sits at the level of the step, after <code>params</code>:</p><pre class=\"out\">    - name: notify\n      type: action\n      action: python\n      params:\n        script: print('done')\n      undo: none\n      depends_on:\n        - build_report</pre>", "An <code>undo: none</code> line under <code>notify</code>.", None, []),
 step(5, "Validate again", "Confirm that the workflow is accepted, and see what the undo command answers.", ["Validate the workflow.", "Run <code>hdrctl workflow undo</code> on a workflow that finished normally."], "hdrctl workflow validate wf_bad_rollback",
  "<p>The command <code>hdrctl workflow undo</code> finishes an interrupted rollback. With nothing pending, it says so:</p>", "A valid workflow, and the answer <b>Nothing to undo</b>.",
  "✅ Workflow valid — no errors detected.\n\n$ hdrctl workflow undo wf_report\nNothing to undo for 'wf_report'.", [])]
# ----------------------------------------------------------------------------------------------- 45
F45 = "studio-resolve-conflicts-and-recover"
d45 = dict(n=45, slug="resolve-conflicts-and-recover", eyebrow="Conflict and recovery", where="hdrctl workflow undo · .hydra/undo", minutes=25, needs="the resilience-demo project",
 prereq2='<li>The <code>resilience-demo</code> project. Its workflow <code>wf_conflict</code> builds a report, waits 30 seconds, then runs <code>finalize</code>, which fails. During the wait, <code>outputs/report.csv</code> is edited by hand.</li>',
 title="Resolve a Rollback Conflict in Hydra ETL | Hydra ETL", h1plain="Resolve a rollback conflict and recover in Hydra ETL", h1="Resolve a rollback conflict and recover in Hydra ETL",
 meta="When a rollback finds a file changed by someone else, Hydra ETL refuses to overwrite it. Read the journal and recover safely. Tested on Hydra ETL 0.22.", crumb="Resolve conflicts and recover",
 lead="What if someone edits the file while your workflow runs, and then the workflow fails? Hydra ETL will not overwrite their change. It stops, and tells you how to continue.",
 quick="If a rollback finds that a file changed after the run wrote it, Hydra ETL does not restore it, keeps a journal in <code>.hydra/undo/&lt;workflow&gt;.json</code> and refuses to run the workflow again. Review the file, then run <code>hdrctl workflow undo &lt;workflow&gt;</code>, or delete the journal if the data is fine.",
 goal="Provoke a rollback conflict, read the three messages Hydra ETL prints, and leave the project in a state where the workflow runs again.",
 project="The <code>resilience-demo</code> project and <code>wf_conflict</code>: <code>build_report</code>, a 30-second <code>delay</code> action named <code>wait</code>, then <code>finalize</code>, which fails because <code>Data/finalize.csv</code> is missing. The workflow has <code>rollback: true</code>. This lesson adds one line, <code>MANUAL,1</code>, to <code>outputs/report.csv</code> during the wait.",
 h2="How do I recover from a rollback conflict in Hydra ETL?", jsonsteps=["Run the workflow and edit the file during the wait", "Read the failed rollback", "Try to run the workflow again", "Try to finish the undo", "Recover"],
 faq=[("Why did Hydra ETL not undo my step?", "The file it would restore changed after the run wrote it, by size or by date. Restoring the old version would destroy that change, so Hydra ETL leaves the file as it is."),
      ("Where does Hydra ETL keep what is left to undo?", "In .hydra/undo/ followed by the workflow name and .json, inside the project. The file lists each step still to undo."),
      ("Why can I not run the workflow again?", "Because a previous run stopped before undoing its changes. Running again could build on a half-undone state, so Hydra ETL asks you to finish the undo first."),
      ("Does putting the file back as it was fix the conflict?", "Not in our test. After removing our added line by hand, the undo still stopped, because the date of the file had changed as well.")],
 related=[("/studio/roll-back-a-failed-workflow", "Roll back a failed workflow"), ("/studio/declare-undo-actions", "Declare the undo of an action"), ("/studio/all-or-nothing-load", "All-or-nothing loads"), ("/studio/dry-run-and-use-fallback", "Dry run and --use-fallback")] + RELCOMMON[1:],
 next=("This block is complete. The next lessons of the course combine fallback, retry and undo in two scenarios.", '<a class="primary" href="/studio">Back to the course map <span aria-hidden="true">→</span></a>'),
 tips=[("TIP", "Read the journal before deleting it: it names every step that is still waiting to be undone."), ("TIP", "The leftover <code>.report.csv.hydra-bak-…</code> file in <code>outputs</code> is the backup of the previous report. Keep it until you have decided."),
       ("TRAP", "Deleting the journal tells Hydra ETL the data is fine. If it is not, the old version is lost."), ("TRAP", "A manual change and a rollback do not mix. Do not edit the destination of a running workflow.")],
 end=[("Failure", "<code>✗ Step 'build_report' not undone</code> with the reason"), ("Journal", "A file <code>.hydra/undo/wf_conflict.json</code>"), ("Refusal", "The workflow refuses to run and names the command to finish the undo"), ("Recovery", "After you delete the journal, the workflow validates and runs again")],
 wrong=[("The workflow refuses to run", "A journal is waiting in <code>.hydra/undo</code>", "Run <code>hdrctl workflow undo</code>, or delete the journal if the data is fine"), ("<code>hdrctl workflow undo</code> stops at the same step", "The file is still different from what the run wrote", "Decide which version you keep, then delete the journal"), ("You want your manual line and the old report", "The undo keeps the changed file and the backup next to it", "Merge them by hand, then delete the journal")],
 steps=[])
d45["steps"] = [
 step(1, "Run the workflow and edit the file during the wait", "Create the conflict on purpose.", ["Run <code>wf_conflict</code>.", "While it waits, add a line to <code>outputs/report.csv</code>.", "Wait for the failure."], "hdrctl workflow run wf_conflict",
  "<p>The report is built, then the workflow sleeps for 30 seconds. You have time to change the file. Then <code>finalize</code> fails, and the rollback starts.</p>", "A step that succeeded, a wait of 30 seconds, and a failure on <code>finalize</code>.", None, []),
 step(2, "Read the failed rollback", "Understand why the report was not restored.", ["Read the lines after the failure."], "hdrctl workflow run wf_conflict",
  "<p>The <code>build_report</code> job would restore the previous report, but the file no longer matches what the run wrote. Hydra ETL keeps your change.</p>", "A <b>not undone</b> line with the reason, and a failed workflow that tells you how to continue.",
  "✓  Step 'build_report' OK (&lt;duration&gt;)\n✓  Step 'wait' OK (30.0s)\n✗  Step 'finalize' FAILED: ValueError: CSVConnector [src]: source file not found.\n✗  Step 'build_report' not undone: …/outputs/report.csv changed after this run wrote it (size or date): not restored, to keep the other changes\n❌ Workflow 'wf_conflict' FAILED in &lt;duration&gt; — … rollback stopped: …/outputs/report.csv changed after this run wrote it (size or date): not restored, to keep the other changes. Finish it with: hdrctl workflow undo wf_conflict", []),
 step(3, "Try to run the workflow again", "See that Hydra ETL protects the half-undone state.", ["Run the workflow again."], "hdrctl workflow run wf_conflict",
  "<p>Every step is skipped, and the message names the journal and the command to use:</p>", "A failed workflow, with the path of the journal.",
  "⏭  Step 'build_report' skipped\n⏭  Step 'wait' skipped\n⏭  Step 'finalize' skipped\n❌ Workflow 'wf_conflict' FAILED in &lt;duration&gt; — a previous run of 'wf_conflict' stopped before undoing its changes (…/.hydra/undo/wf_conflict.json). Finish it with: hdrctl workflow undo wf_conflict — or delete that file if the data is fine.",
  [fig(F45, "terminal-conflict-run-refused", "The Studio terminal after a second run of wf_conflict, refused because of the undo journal.", "The second run is refused until the journal is dealt with.")]),
 step(4, "Try to finish the undo", "Use the command that the message gave you.", ["Run <code>hdrctl workflow undo</code>.", "Read the answer."], "hdrctl workflow undo wf_conflict",
  "<p>The file is still different from what the run wrote, so the undo stops again and keeps the journal. This is the right answer: the command never overwrites a change.</p>", "The same <b>not undone</b> line, and a message saying that the rest is kept in the journal.",
  "✗  Step 'build_report' not undone: …/outputs/report.csv changed after this run wrote it (size or date): not restored, to keep the other changes\n❌ Workflow 'wf_conflict': undo stopped at 'build_report': … The rest is kept in …/.hydra/undo/wf_conflict.json.",
  [fig(F45, "terminal-workflow-undo-stopped", "The Studio terminal after hdrctl workflow undo wf_conflict, which stops at build_report.", "The undo stops again: the file is still not the one the run wrote.")]),
 step(5, "Recover", "Decide which version you keep and leave the project clean.", ["Compare <code>outputs/report.csv</code> with the backup <code>.report.csv.hydra-bak-…</code>.", "Keep the version you want.", "Delete <code>.hydra/undo/wf_conflict.json</code>."], ".hydra/undo/wf_conflict.json",
  "<p>The journal is a small file that lists the steps waiting to be undone. Once you delete it, the workflow is free to run again. Validate it to check:</p>", "The workflow validates, and the next run starts normally.",
  "✅ Workflow valid — no errors detected.", [])]
LESSONS = [d42, d43, d44, d45]
for d in LESSONS:
    (ROOT/"src/_mock"/f"studio-lesson-{d['n']}-{d['slug']}.main.html").write_text(fix_pre(lesson(d), d), encoding="utf-8")
    (ROOT/"src/pages/studio"/f"{d['slug']}.astro").write_text(astro(d), encoding="utf-8")
hub = ROOT/"src/data/studio-lessons.js"; s = hub.read_text(encoding="utf-8")
for label, slug in [("All-or-nothing load", d42["slug"]), ("Rollback", d43["slug"]), ("Undo actions", d44["slug"]), ("Conflict and recovery", d45["slug"])]:
    key = f'"label": "{label}", "group": "Orchestration and resilience"'
    i = s.index(key); j = s.rfind("{", 0, i)
    if not s[j:].startswith('{"slug"'): s = s[:j] + f'{{"slug": "{slug}", ' + s[j+1:]
s = s.replace('"title": "Undo a finished workflow", "description": "Undo actions and the hdrctl workflow undo command."', '"title": "Declare the undo of an action", "description": "Say how each action is reversed with undo or undo: none, and finish an interrupted rollback."')
hub.write_text(s, encoding="utf-8")
print("lessons written:", [d["slug"] for d in LESSONS])
