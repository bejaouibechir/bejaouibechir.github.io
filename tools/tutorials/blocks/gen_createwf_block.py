"""Lesson 'Create a workflow' (plan n. 33): slug create-a-workflow."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])
FW = "studio-createwf"
faq = [
 ("How do I create a workflow in a Hydra project?", "Run hdrctl workflow add <name> in the project folder. It creates workflows/<name>.yaml with no steps and a manual trigger, and adds the workflow at the end of the last stage of workflows/thread.yaml."),
 ("What happens if I give no name?", "Hydra invents one. In our test the name was workflow- followed by eight characters, workflow-109f7411, and the workflow was added like any other."),
 ("Does the new workflow run in the project?", "Yes, as soon as it is in the thread. A workflow with no steps runs in 0.0 seconds and counts 0 of 0 steps. The dry run lists it with a zero between parentheses."),
 ("How do I delete a workflow?", "Run hdrctl workflow remove <name>. It asks for confirmation unless you add -y. It deletes the file and removes the workflow from workflows/thread.yaml. Jobs are not deleted."),
 ("Can I import an existing workflow file?", "According to the Studio source, a workflow file that sits in the workflows folder but not in thread.yaml is listed under Not in the thread in Execution order, where one click adds it. We did not test this with a file copied from elsewhere. The Studio Import button, which brings in a job, has its own lesson."),
]
s = common(33, "Create a workflow", "Create a workflow in a Hydra project with hdrctl",
 "hdrctl workflow add creates an empty workflow and puts it in thread.yaml for you. Add one, read the file, run it and remove it.",
 '<span class="mono">workflow add</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<code>hdrctl workflow add archive</code> creates <code>workflows/archive.yaml</code> with no steps and adds it to the last stage of <code>thread.yaml</code>. <code>hdrctl workflow list</code> shows every workflow in thread order, and <code>hdrctl workflow remove</code> deletes one.",
 "List the workflows of a project, add one, read the file it creates, check it, and remove it.",
 "How do I create a workflow?")
s = s.replace('<li>A project with a few workflows, such as the one built in <a href="/studio/run-steps-in-sequence-or-in-parallel">Stages</a>. The screenshots use that project plus a <code>cleanup</code> workflow that is not in the thread.</li>', '<li>A project with a few workflows, such as the one built in <a href="/studio/run-steps-in-sequence-or-in-parallel">Stages</a>.</li>')
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li>')
s += step(1, "List the workflows", "See the order the project follows.",
 ["Open a terminal in the project folder.", "Run the command below."],
 "hdrctl workflow list",
 "<p>The list follows the thread. Each line gives the stage number, its mode, the workflow, its status and its number of steps.</p>",
 "Four workflows, three stages.",
 "1·sequential   prepare     ✓ active  1 step(s)\n2·parallel     load_sales  ✓ active  1 step(s)\n2·parallel     load_stock  ✓ active  1 step(s)\n3·sequential   report      ✓ active  1 step(s)\n\n4 workflow(s) found")
s += step(2, "Add a workflow", "Create <code>archive</code>.",
 ["Run the command below."],
 "hdrctl workflow add archive",
 "<p>Hydra creates the file and adds the workflow at the end of the <b>last</b> stage. In our project that is stage 3, which is sequential, so <code>archive</code> runs after <code>report</code>. The command also rewrites <code>thread.yaml</code>: it adds explanatory comments at the top and an <code>active: true</code> line to every workflow.</p>",
 "A green line saying the workflow was created, the stage it joined, and a hint for the next step.",
 "✔ Workflow 'archive' created — workflows\\archive.yaml\nAdded to workflows/thread.yaml, stage 3 (sequential).\nNext: attach jobs with hdrctl job attach <job> archive, then check with hdrctl run . --dry-run",
 fig(FW, "workflow-add-command-output-light", "The Studio terminal after hdrctl workflow add archive: a message says the workflow archive was created in workflows, that it was added to thread.yaml in stage 3, and suggests attaching jobs.", "<code>workflow add</code> in the Studio terminal."))
s += step(3, "Read the new file", "Know what an empty workflow looks like.",
 ["Open <code>workflows\\archive.yaml</code>."],
 "workflows\\archive.yaml",
 "<p>The file holds a name, an empty description, a manual trigger and an empty list of steps. Add steps by hand, or open the workflow in Studio.</p><pre class=\"cmd\">version: \"1.0\"\nworkflow:\n  name: archive\n  description: \"\"\n  trigger:\n    type: manual\n  steps: []</pre>",
 "A file of seven lines with <code>steps: []</code>.",
 "")
s += step(4, "Check it and list again", "Confirm the project still holds together.",
 ["Run <code>hdrctl workflow validate workflows\\archive.yaml</code>.", "Run <code>hdrctl run . --dry-run</code>.", "Run <code>hdrctl workflow list</code> again."],
 "hdrctl workflow validate workflows\\archive.yaml\nhdrctl run . --dry-run\nhdrctl workflow list",
 "<p>An empty workflow is valid. The dry run lists it with <code>(0)</code>, its number of steps, and running it alone completes with <code>0/0 steps OK</code>. In the list, <code>archive</code> comes last with <code>0 step(s)</code>.</p>",
 "<code>Workflow valid</code>, a plan that ends with <code>archive (0)</code>, and five workflows in the list.",
 "Workflow valid — no errors detected.\n\nStage 3/3 — sequential\n   •  report  (1: say_report)\n   •  archive  (0)\nDry run OK: the project is valid. Nothing was executed.\n\n3·sequential   archive  ✓ active  0 step(s)\n5 workflow(s) found",
 fig(FW, "workflow-list-in-thread-order-dark", "The Studio terminal after hdrctl workflow list: five workflows listed with their stage, mode, active status and step count, the new archive workflow last with zero steps.", "<code>workflow list</code> after the add."))
s += step(5, "Let Hydra name it, then remove one", "See the unnamed form and the cleanup.",
 ["Run <code>hdrctl workflow add</code> without a name.", "Run <code>hdrctl workflow remove archive -y</code>."],
 "hdrctl workflow add\nhdrctl workflow remove archive -y",
 "<p>Without a name, Hydra generates one, here <code>workflow-109f7411</code>. Yours will differ. <code>remove</code> deletes the file and the thread entry; without <code>-y</code> it asks for confirmation first.</p>",
 "A generated name, then two <code>ok</code> lines for the removal.",
 "✔ Workflow 'workflow-109f7411' created — workflows\\workflow-109f7411.yaml\n\nok  Deleted workflows\\archive.yaml\nok  Removed from workflows/thread.yaml\n✔ Workflow 'archive' removed.")
s += rules([("TIP", "Pass a clear name: it becomes the file name and appears in <code>thread.yaml</code>, the plan and the run logs."),
 ("TIP", "After adding, check the project with <code>hdrctl run . --dry-run</code>, as the command itself suggests."),
 ("TRAP", "A new workflow lands in the <b>last</b> stage. If that stage is parallel, the new workflow starts with the others. Move it in the <a href=\"/studio/define-the-execution-order\">Define</a> tab."),
 ("TRAP", "<code>workflow remove</code> deletes the file for good. Use <code>-y</code> only when you are sure.")])
s += tail([["Create", "workflow add writes workflows/<name>.yaml"], ["Order", "The workflow joins the last stage of thread.yaml"], ["Check", "Valid, listed with zero steps, runs 0/0"], ["Remove", "The file and the thread entry disappear"]],
 [["No project found", "The command ran outside a project folder", "Run it from the folder that holds .hydra"], ["Name already exists", "A workflow file has this name", "Choose another name"], ["The workflow runs too early", "It joined a parallel last stage", "Move it in Execution order"], ["Dry run shows (0)", "The workflow has no steps yet", "Add steps in the YAML or in Studio"]],
 faq, REL + '<li><a href="/studio/define-the-execution-order">Define the execution order</a></li><li><a href="/studio/orchestrate-from-thread-yaml">Orchestrate from thread.yaml</a></li><li><a href="/studio/12-compose-jobs">Compose jobs in a workflow</a></li>',
 "You can create, check and remove workflows from the command line. Next, put jobs in them.",
 '<a class="primary" href="/studio/12-compose-jobs">Compose jobs <span aria-hidden="true">→</span></a>') + CTA
publish(33, "create-a-workflow", "Create a workflow", s,
 "Create a workflow in a Hydra project with hdrctl", "Create a workflow in a Hydra project", "Hydra Create a Workflow: hdrctl workflow add | Hydra ETL",
 "Create an empty workflow with hdrctl workflow add, see where it lands in thread.yaml, list, check and remove it. Tested with Hydra ETL 0.22.",
 ["List the workflows", "Add a workflow", "Read the new file", "Check it and list again", "Let Hydra name it, then remove one"], faq,
 "Create a workflow", "Add an empty workflow with hdrctl, see where it lands in thread.yaml, and remove it.")
