"""Lesson 'Create a workflow' (plan n. 33): slug create-a-workflow."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])
FW = "studio-createwf"
FW = "studio-import-job"

faq = [
 ("How do I bring a job written elsewhere into a Hydra ETL workflow?", "Open the workflow in Studio, choose the Workflow configuration tab, then Import and Import a job, and pick the job folder. In our test on Hydra ETL 0.22, the folder refunds-job, with four YAML files at its root, added a node of the same name to the canvas."),
 ("Which files does the folder need?", "Four files at its root: sources.yaml, transformations.yaml, destinations.yaml and pipeline.yaml. With transformations.yaml missing, Studio showed an alert that lists the missing file and added nothing."),
 ("What does Save write?", "In our test, Save created the folder jobs/refunds-job in the project with the four files, rewritten by Studio (they start with version: '1.0' and the source and destination gain connection: {}), and added a step to the workflow file that points to ../jobs/refunds-job. The data folder of the original job is not copied."),
 ("What is the name of the step that Import creates?", "A generated name, job_ followed by a number (job_1795508669807 in our test), not the name of the folder. The node label shows the folder name."),
 ("Does the imported job run?", "Yes, once its data is in place. We copied an orders.csv into jobs/refunds-job/data and ran the workflow: both steps were OK in 2.0 seconds and the output file refunds.csv was written."),
]
s = common(22, "Import a job", "Import a job into a Hydra ETL workflow",
 "Import a job folder into a workflow from the Import menu, save it into the project, and run it.",
 '<span class="mono">Import</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "The <b>Import</b> menu of the workflow editor takes a folder with four YAML files and adds a job node to the canvas. <b>Save</b> then writes the job into the <code>jobs</code> folder of the project and a step into the workflow file.",
 "Check a job folder, import it, save the workflow, read what Save wrote, run it, and read the alert for a folder with a missing file.",
 "How do I import a job into a workflow?")
s = s.replace('<li>A project with a few workflows, such as the one built in <a href="/studio/run-steps-in-sequence-or-in-parallel">Stages</a>. The screenshots use that project plus a <code>cleanup</code> workflow that is not in the thread.</li>', '<li>A project with a workflow open in the editor. The screenshots use the course project; the save and run tests used a new project from <code>hdrctl init</code>.</li><li>A job folder written elsewhere, with four YAML files at its root. The one below is called <code>refunds-job</code>.</li>')
s += step(1, "Check the job folder", "Four files at the root.",
 ["Create a folder <code>refunds-job</code> with the four files below.", "Run the validation on it."],
 "hdrctl validate refunds-job",
 "<p><code>sources.yaml</code>:</p><pre class=\"cmd\">sources:\n  src_orders:\n    type: csv\n    extract:\n      table: data/orders.csv\n      batch_size: 50000</pre><p><code>transformations.yaml</code>:</p><pre class=\"cmd\">steps:\n  - select:\n      columns: [order_id, customer, amount, status]\n  - filter:\n      expr: \"status == 'refunded'\"</pre><p><code>destinations.yaml</code>:</p><pre class=\"cmd\">destinations:\n  dest_refunds:\n    type: csv\n    load:\n      table: ../../outputs/refunds.csv\n      mode: replace</pre><p><code>pipeline.yaml</code>:</p><pre class=\"cmd\">pipeline:\n  from: src_orders\n  to: dest_refunds</pre>",
 "<code>DSL valid</code>, with no error.",
 "  ok  sources.yaml                         — Pydantic valid\n  ok  destinations.yaml                    — Pydantic valid\n  ok  transformations.yaml                 — Pydantic valid\n  ok  pipeline.from                        — resolved: src_orders\n  ok  pipeline.to                          — resolved: dest_refunds\n\n  ✅ DSL valid — no errors detected.")
s += step(2, "Open the Import menu", "It lives in the workflow tab.",
 ["Open your workflow in Studio.", "Select the <b>Workflow configuration</b> tab.", "Select <b>Import</b>, then <b>Import a job</b>."],
 "Import → Import a job",
 "<p>The menu has one entry. It opens the folder picker of your system, which no screenshot can show: choose the job folder itself, not its parent.</p>",
 "The folder picker opens.",
 "",
 fig(FW, "import-menu-import-a-job-light", "The Import menu of the workflow editor, open under the toolbar, with one entry named Import a job and the hint Select a job folder (4 YAML files) and add a node to the canvas.", "The <b>Import</b> menu."))
s += step(3, "Read the new node", "The folder name becomes the label.",
 ["Pick the <code>refunds-job</code> folder.", "Look at the right of the canvas."],
 "refunds-job",
 "<p>A job node named after the folder appears, and the job joins the <b>Jobs</b> list of the palette. The grey line under the name is an internal id, <code>job_</code> followed by a number. A small red alert icon sits on the node. Nothing is saved yet: according to the source, the import only builds the job in the editor until you save.</p>",
 "A third node on the canvas.",
 "",
 fig(FW, "import-job-node-on-canvas-dark", "The workflow canvas after importing the folder refunds-job: a third job node named refunds-job sits to the right of first-job and second-job, with a small red alert icon, and refunds-job is listed under Jobs in the palette.", "The imported job, next to the two jobs of the course project."))
s += step(4, "Save and read what was written", "Test it in a new project.",
 ["Select <b>Save</b> (we did this in a new project, not in the course project).", "Open the project folder."],
 "Save",
 "<p>Save wrote the job into <code>jobs/refunds-job</code>. Studio rewrites the four files rather than copying them: in our test they start with <code>version: '1.0'</code>, the source and the destination gain <code>connection: {}</code>, and <code>pipeline.yaml</code> gains a name and <code>transformations: transformations</code>. Save also added a step to the workflow file, with a generated name. The <code>data</code> folder of the original job is not copied.</p><pre class=\"cmd\">  steps:\n  - name: job1\n    type: job\n    job: ../jobs/job1\n  - name: job_1795508669807\n    type: job\n    job: ../jobs/refunds-job</pre>",
 "<code>jobs/refunds-job</code> with four files, and a second step in the workflow.",
 "jobs\\job1\njobs\\refunds-job\n    destinations.yaml\n    pipeline.yaml\n    sources.yaml\n    transformations.yaml")
s += step(5, "Add the data and run it", "The job needs its input file.",
 ["Put an <code>orders.csv</code> in <code>jobs/refunds-job/data</code>.", "Run the workflow from the project folder."],
 "hdrctl workflow run workflows\\workflow1.yaml",
 "<p>Both steps ran. The new job wrote <code>outputs/refunds.csv</code>, the path of its destination, relative to the job folder.</p>",
 "Both steps OK.",
 "  ✓  Step 'job1' OK (1.9s)\n  ✓  Step 'job_1795508669807' OK (2.0s)\n\n  ✅ Workflow 'workflow1' completed in 2.0s — 2/2 steps OK")
s += step(6, "Read the alert for a missing file", "Try a folder with three files.",
 ["Copy the folder without <code>transformations.yaml</code>.", "Import it."],
 "Import → Import a job",
 "<p>Studio shows a browser alert, not a message in the page, and imports nothing. Close it and fix the folder.</p>",
 "An alert that lists the missing file.",
 "Missing files at the folder root:\ntransformations.yaml")
s += rules([("TIP", "Run <code>hdrctl validate</code> on the folder first: Import reads the four files, so a valid folder avoids surprises."),
 ("TIP", "Copy the data folder yourself when you import a job into another project."),
 ("TRAP", "Only the four files at the root of the folder are read. Files in sub-folders are ignored, according to the source."),
 ("TRAP", "The step name is generated (<code>job_</code> and a number), so a log that names it does not name your job. Rename it in the workflow file if you want a readable log."),
 ("TRAP", "The red alert icon stayed on the node after Save in our test, although the workflow validated and ran. Trust the validation and the run, not the icon.")])
s += tail([["Menu", "Workflow configuration → Import → Import a job"], ["Folder", "sources, transformations, destinations, pipeline (.yaml) at its root"], ["Result", "a node named after the folder, not saved yet"], ["Save", "writes jobs/NAME and a step job: ../jobs/NAME"], ["Not copied", "the data folder"]],
 [["Missing files at the folder root: transformations.yaml", "A required file is not at the root of the chosen folder", "Add the file, or choose the job folder itself"], ["Small red icon on the imported node", "Studio does not see a job path on the node", "It stayed after Save in our test; validate and run to be sure"]],
 faq, REL + '<li><a href="/studio/12-compose-jobs">Compose jobs</a></li><li><a href="/studio/handle-step-failures-with-on-failure">Handle a failing step with on_failure</a></li><li><a href="/studio/manage-jobs-and-parameters-from-the-cli">Manage projects</a></li>',
 "One menu entry, four files, one Save. Not covered here: renaming the generated step, and what a close without Save does.",
 '<a class="primary" href="/studio/create-a-workflow">Back to Create a workflow <span aria-hidden="true">→</span></a>') + CTA
publish(22, "import-a-job-into-a-workflow", "Import a job", s,
 "Import a job into a Hydra ETL workflow", "Import a job into a Hydra ETL workflow", "Hydra Studio: Import a Job into a Workflow | Hydra ETL",
 "Import a job folder into a Hydra ETL workflow from the Import menu, save it into the project and run it. Tested with Hydra ETL 0.22 on Windows.",
 ["Check the job folder", "Open the Import menu", "Read the new node", "Save and read what was written", "Add the data and run it", "Read the alert for a missing file"], faq,
 "Import a job", "Import a job folder from the Import menu, save it into the project and run it.")
