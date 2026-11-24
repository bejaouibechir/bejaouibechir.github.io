"""Lessons 'Sub-projects' (40) and 'Sub-project parameters' (41)."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

# ================= Lesson A: Sub-projects =================
faqA = [
 ("How does a Hydra project call another project?", "With a workflow step of type project. The step has a name and a project path, for example project: ../child. The path is read from the root of the calling project. Both projects are ordinary Hydra projects, each with its own .hydra folder."),
 ("What does the calling project print?", "The step is reported like any other, and the steps of the called project appear under it. In our test: Step 'call_child' OK, then the called workflow and its job."),
 ("Can a project call itself?", "No. With project: . the run stops before it starts with the message the project calls itself. The same check applies to a loop through several projects, according to the source; we tested only the direct case."),
 ("What happens if the project folder does not exist?", "The run stops with project folder not found, followed by the path as given and the folder it resolved to. The dry run reports the same error."),
 ("Does a dry run run the called project?", "In our test the dry run printed Dry run OK for the calling project and did not list the steps of the called project."),
]
s = common(40, "Sub-projects", "Call a Hydra project from another project",
 "A workflow step of type project runs another project. Build a master and a child, run the master, and read what happens when the path is wrong.",
 '<span class="mono">type: project</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "A workflow step with <code>type: project</code> and <code>project: ../child</code> runs another project after the steps it depends on. The calling project prints the called project's steps under the step, and refuses a missing folder or a project that calls itself.",
 "Create two projects side by side, call the second from the first, run the first and read the two errors you will meet.",
 "How do I call a project from a project?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>Basics of workflows and jobs: <a href="/studio/manage-jobs-and-parameters-from-the-cli">Manage the jobs and parameters of a project</a>.</li>')
s += step(1, "Create two projects", "A child and a master, in the same folder.",
 ["Open a terminal in an empty folder.", "Run the two commands below."],
 "hdrctl init child\nhdrctl init master",
 "<p>Each command creates a full project with <code>job1</code> and <code>workflow1</code>. The two folders sit side by side, so the master reaches the child with <code>../child</code>.</p>",
 "Two lines, <code>Project 'child' created</code> and <code>Project 'master' created</code>.",
 "Project 'child' created (workflow1 with job1).\nProject 'master' created (workflow1 with job1).")
s += step(2, "Run the child alone", "Check that it works before you call it.",
 ["Open a terminal in the <code>child</code> folder.", "Run the command below."],
 "hdrctl run .",
 "<p>The child is a normal project. Calling it from another project adds nothing to the child.</p>",
 "<code>Project 'child' completed</code> with 1/1 workflow OK.",
 "Project 'child' completed in 2.1s — 1/1 workflow(s) OK")
s += step(3, "Add a project step to the master", "A step that runs another project.",
 ["Open <code>master/workflows/workflow1.yaml</code>.", "Add the second step below, after <code>job1</code>."],
 "master/workflows/workflow1.yaml",
 "<p>The step has no <code>job</code> and no <code>action</code>: its type is <code>project</code> and <code>project</code> holds the path of the folder. <code>depends_on</code> works as for any step.</p><pre class=\"cmd\">  steps:\n    - name: job1\n      type: job\n      job: ../jobs/job1\n      depends_on: []\n      on_failure: fail\n    - name: call_child\n      type: project\n      project: ../child\n      depends_on: [job1]</pre>",
 "A workflow with two steps.",
 "")
s += step(4, "Run the master", "Read the called project under its step.",
 ["Open a terminal in the <code>master</code> folder.", "Run the command below."],
 "hdrctl run .",
 "<p>The master runs <code>job1</code>, then <code>call_child</code>. The workflow and the job of the child are listed under the step. The dry run, <code>hdrctl run . --dry-run</code>, answers <code>Dry run OK</code>.</p>",
 "Both steps OK and <code>Project 'master' completed</code>.",
 "Workflow  workflow1\n  Step 'job1' OK (1.4s)\n  Step 'call_child' OK (0.1s)\n    ✓ workflow1 (0.0s)\n        ✓ job1\nWorkflow 'workflow1' OK (1.5s)\nProject 'master' completed in 1.5s — 1/1 workflow(s) OK")
s += step(5, "Read the two errors", "A wrong path and a loop.",
 ["Change <code>project</code> to <code>../nothing</code> and run <code>hdrctl run .</code>.", "Change it to <code>.</code> and run again."],
 "hdrctl run .",
 "<p>Both errors stop the run before any step starts. The first gives the path you wrote and the folder it resolved to. The second shows that a project cannot call itself.</p>",
 "Two <code>Project 'master' cannot run</code> boxes.",
 "step 'call_child': project folder not found: ../nothing (resolved from the project root: ...\\nothing)\n\nstep 'call_self': the project calls itself")
s += rules([("TIP", "Run the child alone first. A failure is easier to read there than under the step of the master."),
 ("TIP", "Keep related projects in sibling folders and use relative paths such as <code>../child</code>."),
 ("TRAP", "The path is read from the root of the calling project, not from the workflow file. <code>../child</code> works from <code>master/</code>."),
 ("TRAP", "Each project keeps its own <code>.hydra</code> folder and its own parameters and secrets.")])
s += tail([["Step", "type: project, project: ../child"], ["Order", "depends_on, as for any step"], ["Output", "Child steps listed under the step"], ["Errors", "Folder not found, project calls itself"]],
 [["project folder not found", "The path does not resolve from the project root", "Check the path against the master folder"], ["the project calls itself", "project points to the current project", "Point to another project"], ["Step type error", "A job or action key was mixed in", "Keep only project keys in a project step"], ["Child fails", "A step of the child failed", "Run the child alone and read its error"]],
 faqA, REL + '<li><a href="/studio/pass-parameters-to-a-sub-project">Pass parameters to a sub-project</a></li><li><a href="/studio/launch-a-job-from-the-cli-and-the-api">Launch a job from the CLI and the API</a></li><li><a href="/studio/create-a-workflow">Create a workflow</a></li>',
 "A project can be a step of another project. Next, hand values to the called project and read results back.",
 '<a class="primary" href="/studio/pass-parameters-to-a-sub-project">Pass parameters <span aria-hidden="true">→</span></a>') + CTA
publish(40, "call-a-project-from-a-project", "Sub-projects", s,
 "Call a Hydra project from another project", "Call a Hydra project from another project", "Hydra Sub-projects: Call a Project in a Project | Hydra ETL",
 "Run a Hydra project from another project with a workflow step of type project, and read the two errors you will meet. Tested with 0.22.",
 ["Create two projects", "Run the child alone", "Add a project step to the master", "Run the master", "Read the two errors"], faqA,
 "Call a project from a project", "Run another project from a workflow step, and read what a wrong path or a loop gives.")

# ================= Lesson B: Sub-project parameters =================
faqB = [
 ("How do I pass a value to a sub-project?", "Add params to the project step, for example params: {min_value: 150}. The called project reads it as its parameter min_value. In our test the called job kept only the row above 150."),
 ("How do I read a result from a sub-project?", "List the parameter names in outputs on the step. The called project must publish them, for example with a set_param action. After the step, read them with {{ project:STEP.param.NAME }}."),
 ("What else can I read after the step?", "{{ project:STEP.status }} and {{ project:STEP.rows }}. In our test they gave success and 1 row for a step named call_child."),
 ("What if the sub-project does not publish an output?", "The step fails with project child did not publish nope, and tells you to set the output with set_param or assign_param."),
 ("What if I pass a parameter the sub-project does not declare?", "In our test nothing happened: the run succeeded and the value was not used. Check the name with hdrctl param list in the called project."),
]
s = common(41, "Sub-project parameters", "Pass parameters to a Hydra sub-project and read results back",
 "Send a value to a called project with params, publish a result from it with set_param, and read the result in the calling project.",
 '<span class="mono">params · outputs</span><span>about 20 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<code>params</code> on a project step hand values down to the called project. <code>outputs</code> names the parameters it must publish, and <code>{{ project:STEP.param.NAME }}</code> reads them in the calling project after the step.",
 "Give the child a parameter, pass a value from the master, publish a result from the child and read it back.",
 "How do I pass parameters to a sub-project?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>The <code>child</code> and <code>master</code> projects of <a href="/studio/call-a-project-from-a-project">Call a project from a project</a>.</li><li>Parameters in a job: <a href="/studio/manage-jobs-and-parameters-from-the-cli">Manage the jobs and parameters of a project</a>.</li>')
s += step(1, "Give the child a parameter", "A value the master will set.",
 ["Open a terminal in the <code>child</code> folder.", "Run the command below.", "In <code>jobs/job1/transformations.yaml</code>, change the filter expression to the line below."],
 "hdrctl param set min_value 0 --type int\n\n      expr: \"value > {{ param:min_value }}\"",
 "<p>With the default 0, the sample job keeps the rows above zero: two of the three.</p>",
 "The message saying the default value was saved in <code>parameters.yaml</code>.",
 "min_value: the default value saved in parameters.yaml")
s += step(2, "Publish a result from the child", "A set_param step at the end of the child workflow.",
 ["Open <code>child/workflows/workflow1.yaml</code>.", "Add the step below after <code>job1</code>."],
 "child/workflows/workflow1.yaml",
 "<p>The <code>set_param</code> action creates a parameter at run time. Here it is named <code>result_rows</code>. A caller can ask for it by name.</p><pre class=\"cmd\">    - name: publish\n      type: action\n      action: set_param\n      params:\n        name: result_rows\n        value: 2\n        type: int\n      depends_on: [job1]</pre>",
 "A child workflow with two steps, <code>job1</code> and <code>publish</code>.",
 "")
s += step(3, "Pass a value and ask for the result", "params down, outputs up.",
 ["Open <code>master/workflows/workflow1.yaml</code>.", "Replace the project step with the two steps below."],
 "master/workflows/workflow1.yaml",
 "<p><code>params</code> sets <code>min_value</code> in the child. <code>outputs</code> asks the child to publish <code>result_rows</code>. The <code>log</code> step reads three values of the project step, named after it.</p><pre class=\"cmd\">    - name: call_child\n      type: project\n      project: ../child\n      params:\n        min_value: 150\n      outputs: [result_rows]\n      depends_on: [job1]\n    - name: show\n      type: action\n      action: log\n      params:\n        message: \"child {{ project:call_child.status }}, {{ project:call_child.rows }} row(s), published {{ project:call_child.param.result_rows }}\"\n      depends_on: [call_child]</pre>",
 "Two new steps in the master workflow.",
 "")
s += step(4, "Run the master", "See the value go down and the result come back.",
 ["Open a terminal in the <code>master</code> folder.", "Run the command below.", "Open <code>child/jobs/job1/data/output.csv</code>."],
 "hdrctl run .",
 "<p>The log line shows the status of the child, the rows it wrote and the published value. The output file of the child holds only the row above 150.</p><pre class=\"cmd\">id,name,value\n2,Bob,200.0</pre>",
 "A log line starting with <code>child success</code>.",
 "Step 'call_child' OK (0.1s)\nStep 'show' OK (0.0s)\nchild success, 1 row(s), published 2\nProject 'master' completed in 1.5s — 1/1 workflow(s) OK")
s += step(5, "Read the failures", "An output that is not published, and a wrong name.",
 ["Change <code>outputs</code> to <code>[nope]</code> and run again.", "In another test, replace <code>{{ project:call_child.param.result_rows }}</code> by <code>{{ param:result_rows }}</code>."],
 "hdrctl run .",
 "<p>An output that the child does not publish fails the step. A plain <code>{{ param:... }}</code> does not see the result of a project step: use the <code>project:</code> form.</p>",
 "Two failed runs with the messages below.",
 "Step 'call_child' failed: project child did not publish nope (outputs: set them with set_param / assign_param, or declare them)\n\nStep 'show' failed: ParameterError: unresolved parameter: 'result_rows'")
s += rules([("TIP", "Name project steps clearly: the step name is part of the placeholder, as in <code>project:call_child.status</code>."),
 ("TIP", "Pass only what the child declares. Check its names with <code>hdrctl param list</code> in the child folder."),
 ("TRAP", "A value that you pass and the child does not declare is accepted without a message. A typo then keeps the default."),
 ("TRAP", "According to the source, <code>params</code> and <code>variables</code> may not carry secrets: a project keeps its own. We did not test this.")])
s += tail([["Down", "params on the project step"], ["Up", "outputs plus set_param in the child"], ["Read", "{{ project:STEP.param.NAME }}"], ["Also", "STEP.status and STEP.rows"]],
 [["did not publish", "The child never set the output", "Add a set_param step in the child"], ["unresolved parameter", "A plain param placeholder was used", "Use project:STEP.param.NAME"], ["Default value used", "The parameter name does not match", "Run hdrctl param list in the child"], ["Step fails on secrets", "A secret was passed in params", "Let the child use its own secrets"]],
 faqB, REL + '<li><a href="/studio/call-a-project-from-a-project">Call a project from a project</a></li><li><a href="/studio/14-use-parameters">One placeholder, two values, two results</a></li><li><a href="/studio/manage-jobs-and-parameters-from-the-cli">Manage the jobs and parameters of a project</a></li>',
 "Values go down with params and results come back with outputs. Next, see what starts a project.",
 '<a class="primary" href="/studio/declare-project-triggers">Triggers <span aria-hidden="true">→</span></a>') + CTA
publish(41, "pass-parameters-to-a-sub-project", "Sub-project parameters", s,
 "Pass parameters to a Hydra sub-project and read results back", "Pass parameters to a Hydra sub-project", "Hydra Sub-project Parameters: params and outputs | Hydra ETL",
 "Pass values to a called Hydra project with params, publish a result with set_param and read it with project placeholders. Tested with 0.22.",
 ["Give the child a parameter", "Publish a result from the child", "Pass a value and ask for the result", "Run the master", "Read the failures"], faqB,
 "Pass parameters to a sub-project", "Hand values down with params, publish a result with set_param and read it back.")
