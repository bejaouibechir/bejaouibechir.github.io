"""Lesson 'Tour the pages' (plan n. 4): new lesson, slug tour-the-pages."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
src = (R/"tools/tutorials/blocks/gen_jobs_block.py").read_text(encoding="utf-8")
exec(src.split("F6, F7, F9 =")[0])   # helpers: fig, head, step, rules, table, tail, CTA
F = "studio-bottom-panel"
SLUG = "use-the-bottom-panel"
faq = [
 ("How do I open the bottom panel in Hydra Studio?", "Select the Logs panel button, the terminal icon at the bottom of the vertical toolbar beside the canvas. The panel also opens by itself when you run a job or a workflow. The cross at its right edge closes it."),
 ("What are the four tabs of the bottom panel?", "LOGS shows the log of the last run, PARAMETERS edits the project parameters, SECRETS stores secret values for the project, and TERMINAL opens a shell inside Studio."),
 ("Where does Studio store the parameters and the secrets?", "Parameter defaults are written to parameters.yaml and each environment column to environments/<env>.yaml. Secrets go to .hydra/secrets, a file that Git ignores, and their values are never displayed."),
 ("How do I use a parameter or a secret in a field?", "Write {{ param:name }} for a parameter, or params[\"name\"] in a Script node, and ${SECRET:name} for a secret. An environment variable named in upper case, such as DB_PASSWORD for db.password, wins over the file."),
 ("Can I resize the bottom panel?", "Yes. Drag the thin splitter on its top edge. In Hydra ETL 0.22 the height stays between 120 and 520 pixels."),
]
s = head(7, 65, "Use the bottom panel", "Use the Hydra Studio bottom panel: Logs, Parameters, Secrets and Terminal",
 "Under the canvas sits one panel with four tabs. Open it, read what each tab does, and run a command without leaving Studio.",
 '<span class="mono">Logs · Terminal</span><span>about 10 minutes</span><span>an open job</span>',
 "The Hydra Studio bottom panel has four tabs: <b>LOGS</b> for the last run, <b>PARAMETERS</b> for project parameters, <b>SECRETS</b> for secret values and <b>TERMINAL</b> for a shell. Open it with the Logs panel button in the canvas toolbar.",
 "Open the bottom panel, visit its four tabs, and run <code>hdrctl --version</code> in the Studio terminal.",
 "An open job in Studio, for example <code>first-job</code> of <code>studio-course</code>. The lesson Review a run reads the logs of a real run in detail.")
s += "  <h2>How do I use the bottom panel in Hydra Studio?</h2>\n\n"
s += step(1, "Open the panel", "Find the one button that brings the panel up.",
 ["Open a job in the editor.", "In the vertical toolbar beside the canvas, select the terminal icon: its title is <b>Logs panel</b>.", "Read the four tab names."],
 "Toolbar → Logs panel",
 "<p>The panel docks under the canvas and above the job tabs. Running a job or a workflow opens it as well, on the LOGS tab. The cross at the right of the tab row closes it; the thin line on its top edge resizes it by dragging.</p>",
 "A panel with the tabs LOGS, PARAMETERS, SECRETS and TERMINAL. LOGS is selected.",
 "LOGS  PARAMETERS  SECRETS  TERMINAL",
 fig(F, "bottom-panel-open-with-toolbar-button-light", "The Hydra Studio job editor in the light theme with the bottom panel open under the canvas, showing the LOGS tab, and the Logs panel button in the vertical toolbar.", "The panel open under the canvas of <code>first-job</code>."))
s += step(2, "Read the Logs tab", "Know where the output of a run appears.",
 ["Select the <b>LOGS</b> tab.", "Read the message in the empty panel."],
 "BOTTOM PANEL → LOGS",
 "<p>Before any run, the tab invites you to run something. After a run it shows the log of the last execution, titled with the workflow name, with a <b>SUCCESS</b> or <b>FAILED</b> badge beside the tabs.</p>",
 "An empty panel with a single line.",
 "Run a job or workflow to view logs.",
 fig(F, "bottom-panel-logs-empty-state-light", "The LOGS tab of the Hydra Studio bottom panel in the light theme, empty, with the message Run a job or workflow to view logs.", "The <b>LOGS</b> tab before the first run."))
s += step(3, "Open the Parameters tab", "See where project parameters are declared.",
 ["Select the <b>PARAMETERS</b> tab.", "Read the columns: name, type, default, one per environment, required and description."],
 "BOTTOM PANEL → PARAMETERS",
 "<p>A parameter is declared once and can take a different value per environment. The default is written to <code>parameters.yaml</code>, and each environment column to <code>environments/&lt;env&gt;.yaml</code>. An empty cell inherits the default. Use a parameter as <code>{{ param:name }}</code> in any field, or <code>params[\"name\"]</code> in a Script node. <b>Add parameter</b> creates a row and <b>Save</b> writes the files. A later lesson builds a full example.</p>",
 "On a project without parameters, the table is empty and offers Add parameter and Save.",
 "No parameter yet.\n[ + Add parameter ]  [ Save ]",
 fig(F, "bottom-panel-parameters-tab-dark", "The PARAMETERS tab of the Hydra Studio bottom panel in the dark theme, with an empty table and the Add parameter and Save buttons.", "The <b>PARAMETERS</b> tab of a project without parameters."))
s += step(4, "Open the Secrets tab", "See where secret values live, and why they never show.",
 ["Select the <b>SECRETS</b> tab.", "Read the explanation above the list.", "Open the <b>SECRETS FOR</b> list to see the scopes."],
 "BOTTOM PANEL → SECRETS",
 "<p>Secrets are stored in <code>.hydra/secrets</code>, a file ignored by Git. Use one as <code>${SECRET:name}</code> in any field. An environment variable with the same name in upper case (<code>db.password</code> becomes <code>DB_PASSWORD</code>) wins over the file. Values are never displayed: typing a new value replaces the old one. A secret of an environment wins over the common one when a run uses that environment.</p>",
 "An empty list and two fields, name and value, with an Add button.",
 "SECRETS FOR  Common (all environments)   .hydra/secrets\nNo secret yet.",
 fig(F, "bottom-panel-secrets-tab-light", "The SECRETS tab of the Hydra Studio bottom panel in the light theme: the Common environment scope, the explanation of the .hydra/secrets file, an empty list and the name, value and Add controls.", "The <b>SECRETS</b> tab of a project without secrets."))
s += step(5, "Run a command in the Terminal", "Use a shell without leaving the editor.",
 ["Select the <b>TERMINAL</b> tab.", "Select inside the terminal and type <code>hdrctl --version</code>.", "Press <b>Enter</b>."],
 "hdrctl --version",
 "<p>The terminal opens a shell tab named after the shell, <b>pwsh 1</b> on Windows. The <b>+</b> at the right of the tabs opens another terminal and the cross closes them all. A right-click offers Clear, Copy, Paste and Save. Selecting a single Bash, PowerShell or SSH action node on the workflow canvas also shows a shortcut that opens the terminal on that shell.</p>",
 "The version of Hydra ETL, the Python version, then a new prompt. The prompt of the picture was shortened for the page.",
 "hydra 0.22.0  |  Hydra ETL Framework  |  Python 3.13.7",
 fig(F, "bottom-panel-terminal-tab-dark", "The TERMINAL tab of the Hydra Studio bottom panel in the dark theme, a pwsh 1 tab showing the command hdrctl --version and its result, Hydra ETL 0.22.0 on Python 3.13.7.", "The <b>TERMINAL</b> tab after <code>hdrctl --version</code>."))
s += rules([("TIP", "Keep the panel open while you build a job: running it switches to the LOGS tab by itself."),
 ("TIP", "Use the Terminal for quick checks such as <code>hdrctl validate</code>, so the log of the editor stays on the LOGS tab."),
 ("TRAP", "A secret value is never shown again once saved. Keep your own copy of the value, or type a new one to replace it."),
 ("TIP", "The splitter on the top edge of the panel resizes it. Give the canvas the room when you do not need the panel.")])
s += tail([["Panel opened", "Four tabs: LOGS, PARAMETERS, SECRETS, TERMINAL"], ["Logs tab", "Empty message before the first run"], ["Parameters and Secrets tabs", "Both empty on a project without parameters or secrets"], ["Terminal", "<code>hdrctl --version</code> prints 0.22.0"]],
 [["The panel does not open", "The panel is closed", "Select the <b>Logs panel</b> button in the vertical toolbar"], ["The Terminal tab stays empty", "The shell has not started yet", "Wait a few seconds, then select inside the terminal"], ["A secret appears empty", "Values are never displayed", "Type a new value to replace it"], ["No Logs panel button on the toolbar", "The job editor is not open", "Open a job from the workflow"]],
 faq,
 '<li><a href="/studio/tour-the-pages">Tour the Studio pages</a></li><li><a href="/studio/03-read-the-canvas">Read the Studio canvas</a></li><li><a href="/studio/11-review-a-run">Review a run</a></li><li><a href="/studio/14-use-parameters">Use parameters</a></li>',
 "You know the whole editor frame. The next lessons open a job and build it step by step.",
 '<a class="primary" href="/studio/05-add-a-source">Create a job <span aria-hidden="true">→</span></a>') + CTA
s = s.replace("Published 4 November 2026", "Published 23 November 2026")
(R/"src/_mock/studio-lesson-07-use-the-bottom-panel.main.html").write_text(s, encoding="utf-8")
t = (R/"src/pages/studio/all-or-nothing-load.astro").read_text(encoding="utf-8")
HEAD = "Use the Hydra Studio bottom panel: Logs, Parameters, Secrets and Terminal"
DESC = "Use the Hydra Studio bottom panel: read the Logs, edit Parameters, store Secrets and run commands in the Terminal. Tested on Hydra ETL 0.22."
steps = ["Open the panel", "Read the Logs tab", "Open the Parameters tab", "Open the Secrets tab", "Run a command in the Terminal"]
t = t.replace("studio-lesson-42-all-or-nothing-load.main.html", "studio-lesson-07-use-the-bottom-panel.main.html")
t = t.replace("all-or-nothing-load", SLUG)
t = re.sub(r'headline: "[^"]*"', lambda m: 'headline: '+json.dumps(HEAD), t, 1)
t = re.sub(r'(description: ")[^"]*(", datePublished)', lambda m: m.group(1)+DESC+m.group(2), t, 1)
t = re.sub(r"steps: \[.*?\],\n", lambda m: "steps: "+json.dumps(steps, ensure_ascii=False)+",\n", t, 1, flags=re.S)
t = re.sub(r"  faq: \[.*?\n  \],\n", lambda m: "  faq: [\n"+"".join(f"    [{json.dumps(q, ensure_ascii=False)}, {json.dumps(x, ensure_ascii=False)}],\n" for q, x in faq)+"  ],\n", t, 1, flags=re.S)
t = t.replace('["All-or-nothing load", ', '["Use the bottom panel", ')
t = re.sub(r'<BaseLayout title="[^"]*" exactTitle="[^"]*" description="[^"]*"', '<BaseLayout title="Use the Hydra Studio bottom panel" exactTitle="Hydra Studio Bottom Panel: Logs, Secrets | Hydra ETL" description="'+DESC+'"', t, 1)
(R/("src/pages/studio/"+SLUG+".astro")).write_text(t, encoding="utf-8")
p = R/"src/data/studio-lessons.js"; h = p.read_text(encoding="utf-8")
h = h.replace('{"label": "Bottom panel", "group"', '{"slug": "'+SLUG+'", "label": "Bottom panel", "group"', 1)
p.write_text(h, encoding="utf-8")
print("ok", len(s))
