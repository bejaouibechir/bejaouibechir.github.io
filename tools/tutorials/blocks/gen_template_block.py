"""Lesson 'Tour the pages' (plan n. 4): new lesson, slug tour-the-pages."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
src = (R/"tools/tutorials/blocks/gen_jobs_block.py").read_text(encoding="utf-8")
exec(src.split("F6, F7, F9 =")[0])   # helpers: fig, head, step, rules, table, tail, CTA
SLUG = "start-from-a-template"
FT = "studio-templates"
faq = [
 ("What templates does Hydra Studio include?", "Hydra ETL 0.22 lists three workflow templates in the ETL category: CSV → CSV, API → Database and Parallel ETL. Each card shows a short description, its YAML and a button that copies the YAML."),
 ("Does a template create jobs for me?", "No. A template is a workflow file. It refers to jobs by path, for example ./jobs/extract and ./jobs/load, and does not include them: you create those jobs in your project."),
 ("How do I copy a template?", "Select Copy YAML on its card. Studio copies the whole workflow to the clipboard and shows Copied for a moment. Paste it into a workflow file of your project."),
 ("Which template runs on a schedule?", "API → Database. Its trigger is a schedule with the cron expression 0 8 * * *, and it ends with a webhook action that is skipped if it fails. The two other templates start manually."),
 ("What does depends_on do in a template?", "It makes a step wait for the steps it names. In Parallel ETL, the load step depends on both extractions, so it starts only after both finish."),
]
s = head(10, 65, "Start from a template", "Start from a Hydra Studio workflow template: View YAML and Copy YAML",
 "Studio ships three ready-made workflows. Open them, read their YAML, and copy the one closest to what you need instead of starting from a blank file.",
 '<span class="mono">Templates</span><span>about 10 minutes</span><span>Studio running</span>',
 "The <b>Templates</b> page of Hydra Studio lists three workflow templates: CSV → CSV, API → Database and Parallel ETL. Select <b>View YAML</b> to read one and <b>Copy YAML</b> to copy it. A template is a workflow file: the jobs it refers to are yours to create.",
 "Open the Templates page, read the YAML of each template, tell the three apart, and copy one.",
 "Studio running at <code>http://127.0.0.1:5678</code>. No project is needed to read the templates.")
s = s.replace("Published 4 November 2026", "Published 23 November 2026")
s = _re.sub(r'  <div class="callout"><b>Course project</b>.*?</div>\n', '', s, count=1, flags=_re.S) if False else s
import re as _re
s = _re.sub(r'  <div class="callout"><b>Course project</b>.*?</div>\n', '', s, count=1, flags=_re.S)
s = _re.sub(r'<h3>Prerequisites</h3><ul>.*?</ul>', '<h3>Prerequisites</h3><ul><li>Hydra ETL 0.22 installed with the server extra and <code>hdrctl serve</code> running. See <a href="/studio/install-and-start">Install and start</a>.</li></ul>', s, count=1, flags=_re.S)
s += "  <h2>How do I use a Hydra Studio template?</h2>\n\n"
s += step(1, "Open the Templates page", "Find the ready-made workflows.",
 ["Select <b>Templates</b> in the sidebar.", "Read the three cards."],
 "Sidebar → Templates",
 "<p>The title reminds you of the count, <b>3 ready-to-use workflow templates</b>. Every card carries a name, an <b>ETL</b> category badge and one line that says what the workflow does.</p>",
 "Three cards, each with a View YAML button on the left and a Copy YAML button on the right.",
 "CSV → CSV        Reads a CSV file, applies a transformation, writes a CSV file.\nAPI → Database   Fetches data from a REST API and loads it into a database.\nParallel ETL     Two extractions run in parallel, then a load that waits for both.",
 fig(FT, "templates-copy-yaml-buttons-dark", "The three template cards of Hydra Studio in the dark theme: CSV to CSV, API to Database and Parallel ETL, each with a View YAML button and a Copy YAML button.", "The three cards, with <b>View YAML</b> and <b>Copy YAML</b>."))
s += step(2, "Read the YAML of CSV → CSV", "See the smallest workflow: two jobs in a row.",
 ["Select <b>View YAML</b> on the CSV → CSV card.", "Read it, then select <b>Hide YAML</b>."],
 "CSV → CSV → View YAML",
 "<p>The workflow starts manually and has two steps of type <code>job</code>. The second one names the first in <code>depends_on</code>, so it runs afterwards. The jobs are referenced by path and are not part of the template.</p>",
 "The YAML opens under the card, in a scrollable block.",
 'version: "1.0"\nworkflow:\n  name: csv_to_csv\n  trigger:\n    type: manual\n  steps:\n    - name: extract_csv\n      type: job\n      job: ./jobs/extract\n    - name: load_csv\n      type: job\n      job: ./jobs/load\n      depends_on: [extract_csv]',
 fig(FT, "templates-csv-to-csv-yaml-open-light", "The Templates page of Hydra Studio in the light theme with the YAML of the CSV to CSV template expanded under its card: a manual trigger, an extract_csv job and a load_csv job that depends on it.", "The YAML of <b>CSV → CSV</b>, expanded."))
s += step(3, "Tell the three templates apart", "Pick the template whose shape matches your need.",
 ["Select <b>View YAML</b> on the two other cards.", "Compare the trigger and the steps."],
 "API → Database · Parallel ETL → View YAML",
 "<p>The three templates differ by their trigger and by the way steps depend on each other.</p>" + table(["Template","Trigger","Steps"], [
  ["<b>CSV → CSV</b>", "<code>manual</code>", "<code>extract_csv</code> then <code>load_csv</code>"],
  ["<b>API → Database</b>", "<code>schedule</code>, cron <code>0 8 * * *</code>", "<code>fetch_api</code>, <code>load_db</code>, then a <code>webhook</code> action <code>notify</code> that is skipped if it fails (<code>on_failure: skip</code>)"],
  ["<b>Parallel ETL</b>", "<code>manual</code>", "<code>extract_a</code> and <code>extract_b</code> side by side, then <code>load</code> which depends on both"]]) + "<p>A <code>schedule</code> trigger runs only while <code>hdrctl serve</code> is running.</p>",
 "Each YAML starts with <code>version: \"1.0\"</code> and a <code>workflow:</code> block.",
 "api_to_db      trigger: schedule  cron: \"0 8 * * *\"\nparallel_etl   load depends_on: [extract_a, extract_b]")
s += step(4, "Copy the template", "Take the YAML to your own project.",
 ["Select <b>Copy YAML</b> on the card you chose.", "Paste it into a new file in the <code>workflows</code> folder of your project."],
 "Copy YAML",
 "<p>Studio copies the whole workflow to the clipboard and shows <b>Copied</b> for a moment. The pasted file refers to jobs such as <code>./jobs/extract</code> and <code>./jobs/load</code>, which you create in your project. In the API → Database template, replace the webhook URL, which the template writes as <code>{{ env.WEBHOOK_URL }}</code>, with your own. The lessons on jobs and workflows show how to build those jobs.</p>",
 "The button label changes to Copied, then returns to Copy YAML.",
 "Copied")
s += rules([("TIP", "Read the YAML before you copy it: the step names, the trigger and the job paths are what you will edit."),
 ("TIP", "Start from <b>CSV → CSV</b> for a first workflow: it has two steps and no schedule."),
 ("TRAP", "A template does not include its jobs. A workflow that points to <code>./jobs/extract</code> needs a job of that name in your project."),
 ("TIP", "The schedule of <b>API → Database</b> only fires while <code>hdrctl serve</code> runs.")])
s += tail([["Templates page", "Three cards: CSV → CSV, API → Database, Parallel ETL"], ["View YAML", "Opens the workflow under its card"], ["Copy YAML", "Shows Copied, then Copy YAML again"], ["Reading", "You can tell the trigger and the dependencies of each template"]],
 [["Copy YAML does nothing", "The browser blocks clipboard access", "Select View YAML and copy the text by hand"], ["The pasted workflow cannot find its jobs", "Templates do not include jobs", "Create the jobs the paths name"], ["The Templates page is empty", "No template is available", "The page then shows No templates"], ["The scheduled workflow does not start", "No server is running", "Keep <code>hdrctl serve</code> running"]],
 faq,
 '<li><a href="/studio/tour-the-pages">Tour the Studio pages</a></li><li><a href="/studio/08-see-the-yaml">Read the YAML Studio generates</a></li><li><a href="/studio/12-compose-jobs">Compose jobs in a workflow</a></li><li><a href="/dsl">Hydra DSL reference</a></li>',
 "You can read and copy a workflow. The next lessons build the jobs it needs.",
 '<a class="primary" href="/studio/05-add-a-source">Create a job <span aria-hidden="true">→</span></a>') + CTA
(R/"src/_mock/studio-lesson-10-start-from-a-template.main.html").write_text(s, encoding="utf-8")
t = (R/"src/pages/studio/all-or-nothing-load.astro").read_text(encoding="utf-8")
HEAD = "Start from a Hydra Studio workflow template: View YAML and Copy YAML"
DESC = "Open the three Hydra Studio workflow templates, read their YAML and copy the one you need. CSV to CSV, API to Database and Parallel ETL. Hydra ETL 0.22."
steps = ["Open the Templates page", "Read the YAML of CSV → CSV", "Tell the three templates apart", "Copy the template"]
t = t.replace("studio-lesson-42-all-or-nothing-load.main.html", "studio-lesson-10-start-from-a-template.main.html")
t = t.replace("all-or-nothing-load", SLUG)
t = re.sub(r'headline: "[^"]*"', lambda m: 'headline: '+json.dumps(HEAD), t, 1)
t = re.sub(r'(description: ")[^"]*(", datePublished)', lambda m: m.group(1)+DESC+m.group(2), t, 1)
t = re.sub(r"steps: \[.*?\],\n", lambda m: "steps: "+json.dumps(steps, ensure_ascii=False)+",\n", t, 1, flags=re.S)
t = re.sub(r"  faq: \[.*?\n  \],\n", lambda m: "  faq: [\n"+"".join(f"    [{json.dumps(q, ensure_ascii=False)}, {json.dumps(x, ensure_ascii=False)}],\n" for q, x in faq)+"  ],\n", t, 1, flags=re.S)
t = t.replace('["All-or-nothing load", ', '["Start from a template", ')
t = re.sub(r'<BaseLayout title="[^"]*" exactTitle="[^"]*" description="[^"]*"', '<BaseLayout title="Start from a Hydra Studio template" exactTitle="Hydra Studio Workflow Templates | Hydra ETL" description="'+DESC+'"', t, 1)
(R/("src/pages/studio/"+SLUG+".astro")).write_text(t, encoding="utf-8")
p = R/"src/data/studio-lessons.js"; h = p.read_text(encoding="utf-8")
h = h.replace('{"label": "Start from a template", "group"', '{"slug": "'+SLUG+'", "label": "Start from a template", "group"', 1)
h = h.replace('"title": "Start a job from a template", "description": "Pick a ready-made job in Templates and adapt it."', '"title": "Start from a workflow template", "description": "Read the three ready-made workflows in Templates, and copy one."', 1)
p.write_text(h, encoding="utf-8")
print("ok", len(s))
