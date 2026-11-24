"""Lesson 'Tour the pages' (plan n. 4): new lesson, slug tour-the-pages."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
src = (R/"tools/tutorials/blocks/gen_jobs_block.py").read_text(encoding="utf-8")
exec(src.split("F6, F7, F9 =")[0])   # helpers: fig, head, step, rules, table, tail, CTA
F = "studio-tour-the-pages"
faq = [
 ("What pages does Hydra Studio have?", "Hydra ETL 0.22 has six entries in the sidebar: Overview, Runs, Templates and Insights at the top, then Settings and Help at the bottom. Jobs and workflows have no page of their own: you open them from a project on the Overview."),
 ("Where are my jobs if there is no Jobs page?", "Inside a project. Open the project from the Overview, open a workflow, and use Jobs configuration to edit a job and Workflow configuration to orchestrate jobs."),
 ("Why is the Runs page empty?", "Runs lists the runs the server has recorded. On a fresh Studio it shows No runs, with the filter tabs All, Running, Success, Failed and Pending, and fills in as soon as a workflow is executed."),
 ("Why does Insights show only zeros?", "Insights counts the same runs as the Runs page. With no run recorded, Total runs, Successful, Failed and Running read 0 and the average duration shows a dash."),
 ("Is the Help page available?", "Not yet. In Hydra ETL 0.22 the page holds a single card saying that help is coming in a future sprint. Use the Documentation link on the Overview instead."),
]
s = head(4, 65, "Tour the pages", "Tour the Hydra Studio pages: Overview, Runs, Templates, Insights and Settings",
 "Studio has six pages in its sidebar. Visit each one once, learn what it is for and where your jobs really live, so you never hunt for a page that does not exist.",
 '<span class="mono">Pages</span><span>about 10 minutes</span><span>Studio running</span>',
 "Hydra Studio has six pages, all in its sidebar: <b>Overview</b> (your projects), <b>Runs</b> (run history), <b>Templates</b> (ready-made workflows), <b>Insights</b> (run counters), <b>Settings</b> and <b>Help</b>. There is no Jobs page: you edit jobs inside a project.",
 "Open each sidebar page once, read what it shows, and know which one to use for which task.",
 "Hydra Studio running at <code>http://127.0.0.1:5678</code>. The pictures of this lesson come from a clean Studio with its sample project.")
s += "  <h2>How do I find my way around Hydra Studio?</h2>\n\n"
s += step(1, "Start from the Overview", "Know where every project begins.",
 ["Select <b>Overview</b> in the sidebar.", "Read the project list on the left.", "Read the <b>Get started</b> card on the right."],
 "Sidebar → Overview",
 "<p>The Overview lists your projects, with a search box, and offers three starting actions: <b>Clone a repository</b> (disabled in 0.22, marked coming soon), <b>Open a project</b> for an existing folder, and <b>Create a project</b>. A <b>Links</b> card points to the documentation and GitHub, and a <b>Statistics</b> card counts projects, active runs and the success rate.</p>",
 "A project list and a Get started card. A project you select opens its workflows and jobs.",
 "Get started: Clone a repository (disabled) · Open a project · Create a project\nStatistics: Projects · Active runs · Success rate",
 fig(F, "overview-page-start-actions-light", "The Overview page of Hydra Studio in the light theme: the project list with one sample project, and the Get started, Links and Statistics cards.", "The <b>Overview</b>: projects on the left, actions and statistics on the right."))
s += step(2, "Read the Runs page", "Find where runs are recorded.",
 ["Select <b>Runs</b>.", "Read the filter tabs above the list."],
 "Sidebar → Runs",
 "<p>Runs shows the runs recorded by the server, with a summary count at the right of the title. Five tabs filter the list: <b>All</b>, <b>Running</b>, <b>Success</b>, <b>Failed</b> and <b>Pending</b>. Before any execution it shows an empty state.</p>",
 "On a fresh Studio, the empty state tells you to execute a workflow.",
 "0 total · 0 running · 0 success · 0 failed\nNo runs\nExecute a workflow to see runs here.",
 fig(F, "runs-page-run-history-dark", "The Runs page of Hydra Studio in the dark theme: the All, Running, Success, Failed and Pending filter tabs above an empty state reading No runs.", "The <b>Runs</b> page before the first execution."))
s += step(3, "Browse the templates", "Start from a ready-made workflow instead of a blank canvas.",
 ["Select <b>Templates</b>.", "Select <b>View YAML</b> on a card to read it.", "Select <b>Copy YAML</b> to copy it."],
 "Sidebar → Templates",
 "<p>Hydra ETL 0.22 ships three templates: <b>CSV → CSV</b> (reads a CSV file, applies a transformation, writes a CSV file), <b>API → Database</b> (fetches data from a REST API and loads it into a database) and <b>Parallel ETL</b> (two extractions run in parallel, then a load that waits for both). Each card shows its YAML and copies it to the clipboard.</p>",
 "Three cards, each with a View YAML and a Copy YAML button.",
 "3 ready-to-use workflow templates\nCSV → CSV · API → Database · Parallel ETL",
 fig(F, "templates-page-job-templates-light", "The Templates page of Hydra Studio: three cards named CSV to CSV, API to Database and Parallel ETL, each with View YAML and Copy YAML buttons.", "The <b>Templates</b> page and its three cards."))
s += step(4, "Check the Insights counters", "Read what Insights actually measures.",
 ["Select <b>Insights</b>.", "Read the four counters and the average duration."],
 "Sidebar → Insights",
 "<p>Insights is a small summary of the run history: <b>Total runs</b>, <b>Successful</b>, <b>Failed</b> and <b>Running</b>, plus the <b>average duration</b> in seconds. It reads the same runs as the Runs page, so it stays at zero until something has run.</p>",
 "Four counters and one line. On a fresh Studio, all counters read 0 and the average duration shows a dash.",
 "0 Total runs · 0 Successful · 0 Failed · 0 Running\nAverage duration: — s",
 fig(F, "insights-page-run-counters-dark", "The Insights page of Hydra Studio in the dark theme: four counters reading 0, for total, successful, failed and running runs, and the line Average duration.", "<b>Insights</b>: counters and average duration."))
s += step(5, "Open Settings", "Know which settings are global and which belong to a project.",
 ["Select <b>Settings</b> at the bottom of the sidebar.", "Compare the <b>Global settings</b> and <b>Project settings</b> tabs."],
 "Sidebar → Settings",
 "<p><b>Global settings</b> apply to every project: the number of rows of the data viewer (10 by default), the environments shared by every project on the machine, and the interval at which an open job is compared with its files on disk (5 seconds by default). Environment variables are saved on the machine, not in the browser. <b>Project settings</b> belong to the current project. A later lesson covers environments and secrets in detail.</p>",
 "Two tabs. The first one shows the data viewer, the environments (Common, dev, prod) and the job sync interval.",
 "Global settings · Project settings\nData viewer: 10 rows · Environments: Common, dev, prod · Job files sync: 5 seconds",
 fig(F, "settings-page-global-settings-light", "The Settings page of Hydra Studio, Global settings tab: the data viewer row count, the Common, dev and prod environments with a table of variables, and the job files sync interval.", "<b>Settings</b>, Global settings tab."))
s += step(6, "Notice Help, and shrink the sidebar", "Know what is not there yet, and win some screen width.",
 ["Select <b>Help</b>: read the card.", "Select the <b>‹</b> button at the top of the sidebar to collapse it.", "Select the arrow that appears to expand it again."],
 "Sidebar → Help · ‹",
 "<p>Help is a placeholder in 0.22: a single card says that help is coming in a future sprint. The sidebar collapses to a column of icons, and Studio remembers your choice in this browser. The <b>+</b> button next to it returns to the Overview, where you create a project.</p>",
 "The collapsed sidebar keeps the same six entries as icons; hover an icon to read its name.",
 "Help — coming in a future sprint",
 fig(F, "sidebar-expanded-five-entries-light", "The expanded sidebar of Hydra Studio: the Hydra logo with plus, search and collapse buttons, then Overview, Runs, Templates and Insights.", "The expanded sidebar.") + fig(F, "sidebar-collapsed-icons-only-dark", "The collapsed sidebar of Hydra Studio in the dark theme: only icons remain, with an arrow at the top to expand it.", "The collapsed sidebar.") + fig(F, "help-page-studio-help-dark", "The Help page of Hydra Studio in the dark theme: a single card reading Help, coming in a future sprint.", "The <b>Help</b> placeholder."))
s += rules([("TIP", "Jobs and workflows have no sidebar page: open a project from the <b>Overview</b>, then a workflow."),
 ("TIP", "Collapse the sidebar when you work on a wide canvas. Studio remembers it for this browser."),
 ("TRAP", "Do not wait for the Runs or Insights page to fill by itself: both stay empty until a workflow or a job has been executed."),
 ("TIP", "Templates are a quick way to read how a workflow is written: select <b>View YAML</b> before you copy it.")])
s += tail([["Sidebar entries", "Overview, Runs, Templates, Insights, then Settings and Help"], ["Overview", "Project list and the Get started card"], ["Templates", "Three cards: CSV → CSV, API → Database, Parallel ETL"], ["Insights", "Four counters and an average duration, all empty on a fresh Studio"]],
 [["No Jobs page in the sidebar", "Jobs are edited inside a project", "Open a project from the Overview, then <b>Jobs configuration</b>"], ["Runs and Insights show nothing", "No run is recorded yet", "Execute a workflow, then reload the page"], ["Clone a repository cannot be selected", "The action is disabled in 0.22", "Use <b>Open a project</b> on a cloned folder"], ["The sidebar shows only icons", "It is collapsed", "Select the arrow at its top to expand it"]],
 faq,
 '<li><a href="/studio/02-check-the-api">Check the Studio API connection</a></li><li><a href="/studio/01-open-a-project">Create a project and its first workflow</a></li><li><a href="/studio/03-read-the-canvas">Read the Studio canvas</a></li><li><a href="/get-started">Get started with Hydra ETL</a></li>',
 "You know the six pages. The next lesson opens a project and reads its canvas: nodes, ports and edges.",
 '<a class="primary" href="/studio/03-read-the-canvas">Read the canvas <span aria-hidden="true">→</span></a>') + CTA
(R/"src/_mock/studio-lesson-04-tour-the-pages.main.html").write_text(s, encoding="utf-8")
# astro page from a template page
t = (R/"src/pages/studio/all-or-nothing-load.astro").read_text(encoding="utf-8")
HEAD = "Tour the Hydra Studio pages: Overview, Runs, Templates, Insights and Settings"
DESC = "Tour the six pages of Hydra Studio: Overview, Runs, Templates, Insights, Settings and Help. Learn what each one is for. Tested on Hydra ETL 0.22."
steps = ["Start from the Overview", "Read the Runs page", "Browse the templates", "Check the Insights counters", "Open Settings", "Notice Help, and shrink the sidebar"]
t = t.replace("studio-lesson-42-all-or-nothing-load.main.html", "studio-lesson-04-tour-the-pages.main.html")
t = t.replace("all-or-nothing-load", "tour-the-pages")
t = re.sub(r'headline: "[^"]*"', lambda m: 'headline: '+json.dumps(HEAD), t, 1)
t = re.sub(r'(description: ")[^"]*(", datePublished)', lambda m: m.group(1)+DESC+m.group(2), t, 1)
t = re.sub(r"steps: \[.*?\],\n", lambda m: "steps: "+json.dumps(steps, ensure_ascii=False)+",\n", t, 1, flags=re.S)
t = re.sub(r"  faq: \[.*?\n  \],\n", lambda m: "  faq: [\n"+"".join(f"    [{json.dumps(q, ensure_ascii=False)}, {json.dumps(x, ensure_ascii=False)}],\n" for q, x in faq)+"  ],\n", t, 1, flags=re.S)
t = re.sub(r'\["All-or-nothing load", ', '["Tour the pages", ', t)
t = re.sub(r'<BaseLayout title="[^"]*" exactTitle="[^"]*" description="[^"]*"', '<BaseLayout title="Tour the Hydra Studio pages" exactTitle="Hydra Studio Pages: Overview, Runs, Templates | Hydra ETL" description="'+DESC+'"', t, 1)
(R/"src/pages/studio/tour-the-pages.astro").write_text(t, encoding="utf-8")
# hub entry
p = R/"src/data/studio-lessons.js"; h = p.read_text(encoding="utf-8")
h = h.replace('{"label": "Tour the pages", "group"', '{"slug": "tour-the-pages", "label": "Tour the pages", "group"', 1)
p.write_text(h, encoding="utf-8")
print("ok", len(s))
