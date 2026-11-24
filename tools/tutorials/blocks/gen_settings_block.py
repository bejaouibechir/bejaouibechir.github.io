"""Lesson 'Tour the pages' (plan n. 4): new lesson, slug tour-the-pages."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
src = (R/"tools/tutorials/blocks/gen_jobs_block.py").read_text(encoding="utf-8")
exec(src.split("F6, F7, F9 =")[0])   # helpers: fig, head, step, rules, table, tail, CTA
SLUG = "global-and-project-settings"
FT, FS = "studio-tour-the-pages", "studio-settings"
faq = [
 ("What is the difference between Global settings and Project settings in Hydra Studio?", "Global settings apply to every project: the data viewer row count, the environments saved on your machine and the job sync interval. Project settings belong to one project and are written in its files: execution order, parameters, secrets and triggers."),
 ("Where does Studio save each setting?", "The editor preferences are kept in this browser. Environment variables go to ~/.hydra on your machine. The execution order goes to workflows/thread.yaml, parameters to parameters.yaml and environments/<env>.yaml, secrets to .hydra/secrets and triggers to triggers.yaml."),
 ("Are secrets shared with my team through Git?", "No. Secrets are saved in .hydra/secrets and .hydra/secrets.<env>, which Git ignores, so they stay on this machine. Parameters, the execution order and triggers are project files that everyone who opens the project receives."),
 ("How do I open the settings of a project?", "Select Settings in the sidebar, then the Project settings tab, and choose a project in the list. You can also open the address /settings/project/<project id>, and append ?tab=parameters, secrets or triggers."),
 ("When do triggers run?", "Triggers run while hdrctl serve is running, which is Studio itself, or while hdrctl watch runs. The Studio panel states that they do not run in both on the same project."),
]
s = head(31, 65, "Settings", "Hydra Studio settings: global preferences and project settings",
 "Studio keeps its settings in two places. Learn which ones apply everywhere, which belong to a project, and which file each of them ends up in.",
 '<span class="mono">Settings</span><span>about 15 minutes</span><span>a project in Studio</span>',
 "Hydra Studio has <b>Global settings</b> for every project and <b>Project settings</b> for one project. Global settings hold the data viewer, the environments and the job sync interval. Project settings hold the execution order, parameters, secrets and triggers, each saved in its own file.",
 "Visit the two Settings tabs, tell which setting is global and which is per project, and know the file each project setting writes.",
 "Studio running with the <code>studio-course</code> project. The pictures of the project settings come from it.")
s = s.replace("Published 4 November 2026", "Published 23 November 2026")
s += "  <h2>Where do I change a setting in Hydra Studio?</h2>\n\n"
s += step(1, "Open Global settings", "See what applies to every project.",
 ["Select <b>Settings</b> at the bottom of the sidebar.", "Stay on the <b>Global settings</b> tab."],
 "Sidebar → Settings → Global settings",
 "<p>Three things live here. The <b>data viewer</b> row count (10 by default) sets how many rows <b>View data</b> shows when you right-click a destination. The <b>Environments</b> card holds variables shared by every project on the machine. The <b>job files sync</b> interval sets how often an open job is compared with its files on disk. The editor preferences stay in this browser, while the environments are saved on this machine.</p>",
 "A page with the data viewer field, the Environments card and the sync interval.",
 "Data viewer: 10 rows (default: 10)\nEnvironments: Common · dev · prod\nJob files sync: 5 seconds",
 fig(FT, "settings-page-global-settings-light", "The Global settings tab of Hydra Studio in the light theme: the data viewer row count, the Common, dev and prod environments with a variable table, and the job files sync interval.", "<b>Global settings</b>."))
s += step(2, "Read the Environments card", "Understand how shared variables are organized.",
 ["Select <b>Common</b>, then <b>dev</b>, and compare the variable tables.", "Select <b>New environment</b> to see the name box, then cancel."],
 "Global settings → Environments",
 "<p>Variables in <b>Common</b> apply to every environment, saved in <code>~/.hydra/env</code>. Each other tab, such as <code>dev</code>, adds variables saved in <code>~/.hydra/env.&lt;name&gt;</code>. A run loads the common variables first, then those of the active environment. Use a variable as <code>${ENV:NAME}</code> in a field. Names accept letters, digits and underscores and cannot start with a digit; Studio flags duplicates. A later lesson builds an environment from scratch.</p>",
 "Tabs for Common and each environment, a table of names and values, and a <b>New environment</b> button that opens a name box.",
 "Common   ~/.hydra/env\ndev      ~/.hydra/env.dev",
 fig(FS, "settings-global-new-environment-box-dark", "The Environments card of Hydra Studio Global settings in the dark theme, with the Common tab selected, a name box open after New environment and the variable table below.", "The name box after <b>New environment</b>, before anything is saved."))
s += step(3, "Open Project settings", "Reach the settings of one project.",
 ["Select the <b>Project settings</b> tab.", "Choose <b>studio-course</b> in the list."],
 "Settings → Project settings",
 "<p>Without a project, the tab only offers a list and a Projects button. Once a project is chosen, the header shows its name and folder, the active environment with a <b>Manage</b> link, a project list and <b>Back to the project</b>. Four tabs follow: <b>Execution order</b>, <b>Parameters</b>, <b>Secrets</b> and <b>Triggers</b>. The address <code>/settings/project/&lt;project id&gt;</code> opens a project directly.</p>",
 "A list reading Choose a project, then the four tabs once a project is selected.",
 "Project settings\nChoose a project…",
 fig(FS, "settings-project-choose-project-light", "The Project settings tab of Hydra Studio in the light theme with no project open: a Choose a project list and a Projects button.", "<b>Project settings</b> before a project is chosen."))
s += step(4, "Read the Execution order tab", "See where the order of workflows is set for the whole project.",
 ["Stay on <b>Execution order</b>.", "Read the stage line, then the workflow line."],
 "Project settings → Execution order",
 "<p>The order is saved in <code>workflows/thread.yaml</code> for everyone who opens the project. Workflows are grouped in stages: inside a stage they run one after the other or in parallel, and each workflow can wait before it starts or be given a longest running time. <b>Define</b> edits the order, <b>Preview</b> shows it, <b>Check</b> validates it and the button shows <b>Saved</b> once written. <b>Loops</b> can replay a part of the thread. A later lesson covers the execution order in detail.</p>",
 "One stage, sequential, holding <code>first-workflow</code>, with wait and max fields.",
 "Stage 1  sequential  then wait 0\n☑ first-workflow  wait 0  max none",
 fig(FS, "settings-project-execution-order-dark", "The Execution order tab of the Project settings of studio-course in the dark theme: Stage 1, sequential, holding first-workflow, with Define, Preview, Check and Saved buttons and a Loops section.", "<b>Execution order</b> of <code>studio-course</code>."))
s += step(5, "Read Parameters, Secrets and Triggers", "Know what each remaining tab writes, and for whom.",
 ["Select <b>Parameters</b>, then <b>Secrets</b>, then <b>Triggers</b>.", "Read the grey note under the project name each time."],
 "Project settings → Parameters · Secrets · Triggers",
 "<p>The note under the project name says where a tab saves. <b>Parameters</b> go to <code>parameters.yaml</code> and <code>environments/&lt;env&gt;.yaml</code>, for everyone who opens the project. <b>Secrets</b> go to <code>.hydra/secrets</code> and <code>.hydra/secrets.&lt;env&gt;</code>, ignored by Git: this machine only. <b>Triggers</b> go to <code>triggers.yaml</code>: what starts the whole project, by time, file, data change, webhook or the end of another project. They run under <code>hdrctl serve</code> or <code>hdrctl watch</code>. The Parameters and Secrets tabs are the same panels as in the bottom panel of the editor.</p>",
 "Three tabs, each with a note, and empty lists on a new project.",
 "Parameters  → parameters.yaml, environments/<env>.yaml\nSecrets     → .hydra/secrets (git-ignored)\nTriggers    → triggers.yaml",
 fig(FS, "settings-project-parameters-tab-light", "The Parameters tab of the Project settings of studio-course in the light theme, with an empty table and the Add parameter and Save buttons.", "<b>Parameters</b>.") + fig(FS, "settings-project-secrets-tab-dark", "The Secrets tab of the Project settings of studio-course in the dark theme: scope list, explanation of the .hydra/secrets file, an empty list and the name and value fields.", "<b>Secrets</b>.") + fig(FS, "settings-project-triggers-tab-light", "The Triggers tab of the Project settings of studio-course in the light theme, with Refresh and Add a trigger buttons, an empty list and the History section.", "<b>Triggers</b>."))
s += rules([("TIP", "Read the grey note under the project name: it tells where the current tab writes and who receives the change."),
 ("TIP", "Open <code>/settings/project/&lt;project id&gt;?tab=triggers</code> to land on a tab directly."),
 ("TRAP", "Secrets do not travel with the project. A colleague who opens the project from Git has to add their own."),
 ("TIP", "Environment variables of Global settings are shared by every project on this machine: keep names specific.")])
s += tail([["Global settings", "Data viewer rows, Environments, job files sync interval"], ["Project settings", "Four tabs: Execution order, Parameters, Secrets, Triggers"], ["Files", "thread.yaml, parameters.yaml, environments/<env>.yaml, .hydra/secrets, triggers.yaml"], ["Secrets", "Git ignores them: this machine only"]],
 [["Project settings shows only a list", "No project is chosen", "Choose one in the list, or open it from the Overview"], ["The page says the project is not open", "Studio has not opened that project", "Open it from the Overview first"], ["A variable name is refused", "Names accept letters, digits and underscores only", "Rename it, without a leading digit"], ["A colleague lacks a secret", "Secrets are not committed", "Each machine adds its own secret values"]],
 faq,
 '<li><a href="/studio/tour-the-pages">Tour the Studio pages</a></li><li><a href="/studio/use-the-bottom-panel">Use the bottom panel</a></li><li><a href="/studio/14-use-parameters">Use parameters</a></li><li><a href="/studio/set-timeouts-on-workflows">Set timeouts on workflows</a></li>',
 "You know where every setting lives. The next lessons build parameters and environments in a real project.",
 '<a class="primary" href="/studio/14-use-parameters">Use parameters <span aria-hidden="true">→</span></a>') + CTA
(R/"src/_mock/studio-lesson-31-global-and-project-settings.main.html").write_text(s, encoding="utf-8")
t = (R/"src/pages/studio/all-or-nothing-load.astro").read_text(encoding="utf-8")
HEAD = "Hydra Studio settings: global preferences and project settings"
DESC = "Find every Hydra Studio setting: global preferences, environments, execution order, parameters, secrets and triggers, and the file each one writes. Hydra ETL 0.22."
steps = ["Open Global settings", "Read the Environments card", "Open Project settings", "Read the Execution order tab", "Read Parameters, Secrets and Triggers"]
t = t.replace("studio-lesson-42-all-or-nothing-load.main.html", "studio-lesson-31-global-and-project-settings.main.html")
t = t.replace("all-or-nothing-load", SLUG)
t = re.sub(r'headline: "[^"]*"', lambda m: 'headline: '+json.dumps(HEAD), t, 1)
t = re.sub(r'(description: ")[^"]*(", datePublished)', lambda m: m.group(1)+DESC+m.group(2), t, 1)
t = re.sub(r"steps: \[.*?\],\n", lambda m: "steps: "+json.dumps(steps, ensure_ascii=False)+",\n", t, 1, flags=re.S)
t = re.sub(r"  faq: \[.*?\n  \],\n", lambda m: "  faq: [\n"+"".join(f"    [{json.dumps(q, ensure_ascii=False)}, {json.dumps(x, ensure_ascii=False)}],\n" for q, x in faq)+"  ],\n", t, 1, flags=re.S)
t = t.replace('["All-or-nothing load", ', '["Settings", ')
t = re.sub(r'<BaseLayout title="[^"]*" exactTitle="[^"]*" description="[^"]*"', '<BaseLayout title="Hydra Studio settings" exactTitle="Hydra Studio Settings: Global and Project | Hydra ETL" description="'+DESC+'"', t, 1)
(R/("src/pages/studio/"+SLUG+".astro")).write_text(t, encoding="utf-8")
p = R/"src/data/studio-lessons.js"; h = p.read_text(encoding="utf-8")
h = h.replace('{"label": "Settings", "group"', '{"slug": "'+SLUG+'", "label": "Settings", "group"', 1)
p.write_text(h, encoding="utf-8")
print("ok", len(s))
