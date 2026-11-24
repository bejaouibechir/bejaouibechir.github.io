"""Lesson 'Manage projects' : slug manage-jobs-and-parameters-from-the-cli."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])
faq = [
 ("How do I add a job to a workflow from the command line?", "Run hdrctl job add <job> <workflow>. It creates jobs/<job>/ from a template and adds a step of type job at the end of the workflow, after the previous step. Add -p N to choose the position."),
 ("What does detaching a job do?", "hdrctl job detach <job> <workflow> removes the step and keeps the job folder in jobs/. The steps that ran after it now run after its own predecessors. hdrctl job list then shows the job as free."),
 ("Where is a project parameter stored?", "Its type, default value and description are in parameters.yaml at the project root. The value for an environment is in environments/<env>.yaml. Both are written by hdrctl param set."),
 ("How do I use a parameter in a job?", "Write {{ param:NAME }} where the value goes, for example in a filter expression. In our test a job with value > {{ param:min_value }} wrote 2 rows with the default 0, and 1 row with the value 150 of the prod environment."),
 ("How do I run a job with an environment?", "Add --env NAME to hdrctl run. We ran hdrctl run jobs\\job1 --env prod, and the job used the prod value of the parameter."),
]
s = common(39, "Manage projects", "Manage the jobs and parameters of a Hydra project",
 "Add, attach and detach jobs in a workflow, and give a parameter a default value and a value per environment, all with hdrctl.",
 '<span class="mono">hdrctl job · hdrctl param</span><span>about 20 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<code>hdrctl job</code> adds, attaches, detaches and lists the jobs of a project. <code>hdrctl param</code> declares parameters in <code>parameters.yaml</code> and gives them a value per environment. A job reads a parameter with <code>{{ param:NAME }}</code>.",
 "Create a project, add a job to its workflow, move and detach it, then declare a parameter and run a job with two values of it.",
 "How do I manage the jobs and parameters of a project?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed. Create a project with <code>hdrctl init manage-demo</code> and open a terminal in it. See <a href="/studio/install-and-start">Install and start</a> and <a href="/studio/anatomy-of-a-job">Anatomy of a job</a>.</li>')
s += step(1, "List the jobs", "See each job and the workflows that use it.",
 ["Run the command below in the project folder."],
 "hdrctl job list",
 "<p>A new project has one job, <code>job1</code>, used by <code>workflow1</code>. A job that no workflow uses is shown as free.</p>",
 "One job, in workflow1.",
 "job1  ✓ in: workflow1\n\n1 job(s), 0 free")
s += step(2, "Add a job to a workflow", "Create it and attach it in one command.",
 ["Run the command below.", "Open <code>workflows/workflow1.yaml</code>."],
 "hdrctl job add extra workflow1",
 "<p>The job <code>extra</code> is created in <code>jobs/extra</code> with the default template, and attached at the end of the workflow. The workflow file now has a second step that depends on the first.</p><pre class=\"cmd\">  steps:\n    - name: job1\n      type: job\n      job: ../jobs/job1\n      depends_on: []\n      on_failure: fail\n    - name: extra\n      type: job\n      job: ../jobs/extra\n      depends_on: [job1]\n      on_failure: fail</pre>",
 "A message saying the job was attached at position 2, after <code>job1</code>.",
 "Job 'extra' created — jobs\\extra\nJob 'extra' attached to workflow 'workflow1', position 2.\nRuns after step 'job1'.")
s += step(3, "Detach and attach at a position", "Move a job without editing YAML.",
 ["Run <code>hdrctl job detach extra workflow1</code>.", "Run <code>hdrctl job attach extra workflow1 -p 1</code>.", "Read <code>workflows/workflow1.yaml</code> again."],
 "hdrctl job detach extra workflow1\nhdrctl job attach extra workflow1 -p 1",
 "<p>Detaching keeps the folder: <code>extra</code> becomes free. Attaching at position 1 puts it first, and <code>job1</code> now depends on it (<code>depends_on: [extra]</code>).</p>",
 "<code>extra</code> free, then attached as the first step.",
 "Job 'extra' is now free: its folder is kept in jobs/.\n\nJob 'extra' attached to workflow 'workflow1', position 1.\nFirst step of the workflow.\nStep 'job1' now runs after 'extra'.")
s += step(4, "Declare a parameter", "A name, a type and a default.",
 ["Run the command below.", "Run <code>hdrctl param list</code>.", "Open <code>parameters.yaml</code>."],
 "hdrctl param set min_value 0 --type int --description \"Smallest value kept\"",
 "<p>The parameter is written in <code>parameters.yaml</code>. Before this command, <code>param list</code> answers <code>No parameters</code>.</p><pre class=\"cmd\">version: '1.0'\nparameters:\n  min_value:\n    type: int\n    default: 0\n    description: Smallest value kept</pre>",
 "A table with <code>min_value</code>, <code>int</code> and <code>0</code>.",
 "NAME       TYPE  DEFAULT\nmin_value  int   0")
s += step(5, "Use the parameter in a job", "Replace a fixed value by a placeholder.",
 ["In <code>jobs/job1/transformations.yaml</code>, change the filter to the line below.", "Run the job."],
 "      expr: \"value > {{ param:min_value }}\"\n\nhdrctl run jobs\\job1",
 "<p>The sample data has three rows, one of them with a negative value. With the default 0 the job reads three rows and writes two.</p>",
 "<code>Pipeline completed successfully</code>, 3 rows read and 2 written.",
 "Rows read   : 3\nRows written: 2")
s += step(6, "Give the parameter a value per environment", "Run the same job with another value.",
 ["Run the command below.", "Run the job with <code>--env prod</code>.", "Run <code>hdrctl param unset min_value --env prod</code> to remove the value."],
 "hdrctl param set min_value 150 --env prod\nhdrctl run jobs\\job1 --env prod",
 "<p>The value goes to <code>environments/prod.yaml</code>. With 150 only the row with <code>200</code> stays: one row written. The <code>param list</code> table gets a <code>prod</code> column, and after <code>unset</code> the cell shows that the default is inherited.</p>",
 "1 row written, <code>2,Bob,200.0</code>.",
 "NAME       TYPE  DEFAULT  prod\nmin_value  int   0        150\n\nRows read   : 3\nRows written: 1\n\nid,name,value\n2,Bob,200.0")
s += rules([("TIP", "Run <code>hdrctl job list</code> after each change. A job that is <code>free</code> is not run by any workflow."),
 ("TIP", "After attaching or detaching, check the project with <code>hdrctl run . --dry-run</code>, as the command itself suggests."),
 ("TRAP", "<code>job detach</code> keeps the folder and <code>job add</code> creates one from a template. Neither deletes your work."),
 ("TRAP", "Cast a CSV column before you compare it to a parameter, as in the first transformations lesson. The text of a CSV is not a number.")])
s += tail([["Jobs", "hdrctl job list | add | attach | detach"], ["Parameters", "hdrctl param list | set | unset"], ["Placeholder", "{{ param:NAME }}"], ["Environment", "hdrctl run ... --env NAME"]],
 [["Job not found", "The job folder does not exist", "Run hdrctl job list"], ["Workflow not found", "The workflow name is wrong", "Run hdrctl workflow list"], ["Parameter not replaced", "The name differs from parameters.yaml", "Run hdrctl param list"], ["Same result with --env", "The environment has no value", "Run hdrctl param list and read its column"]],
 faq, REL + '<li><a href="/studio/create-a-workflow">Create a workflow</a></li><li><a href="/studio/14-use-parameters">One placeholder, two values, two results</a></li><li><a href="/studio/global-and-project-settings">Project settings and Global settings</a></li>',
 "You can manage jobs and parameters without opening Studio. Next, see how triggers start a project.",
 '<a class="primary" href="/studio/declare-project-triggers">Triggers <span aria-hidden="true">→</span></a>') + CTA
publish(39, "manage-jobs-and-parameters-from-the-cli", "Manage projects", s,
 "Manage the jobs and parameters of a Hydra project", "Manage the jobs and parameters of a Hydra project", "Hydra Jobs and Parameters: hdrctl job, param | Hydra ETL",
 "Add, attach and detach jobs in a workflow, and set project parameters per environment with hdrctl job and hdrctl param. Tested with Hydra ETL 0.22.",
 ["List the jobs", "Add a job to a workflow", "Detach and attach at a position", "Declare a parameter", "Use the parameter in a job", "Give the parameter a value per environment"], faq,
 "Manage projects", "Add, attach and detach jobs, and set project parameters per environment, from the command line.")
