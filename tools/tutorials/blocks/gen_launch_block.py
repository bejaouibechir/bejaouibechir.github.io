"""Lesson 'Other launches' (plan n. 15): slug launch-a-job-from-the-cli-and-the-api."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])
faq = [
 ("How do I run a Hydra job without Studio?", "Run hdrctl run <job folder>, for example hdrctl run jobs/job1. It runs that one job and prints the rows read and written."),
 ("What is the difference between running a job and running a project?", "hdrctl run on a job folder runs that job only. hdrctl run on a project folder, a folder with .hydra, runs the workflows of workflows/thread.yaml in order. In our test the project run took 1.6 seconds and reported 1/1 workflow(s) OK."),
 ("How do I start a run from the API?", "Start hdrctl serve, then send POST /api/runs with a JSON body that holds workflow_path, the path of a workflow file or a project folder. The server answers 202 Accepted with a run_id and the status pending, and the run goes on in the background."),
 ("How do I read the result of an API run?", "Call GET /api/runs. Each run lists its status, its duration and its steps. In our test the run went from pending to success in under a second."),
 ("Can an AI assistant launch a job?", "Hydra ETL ships an MCP server with a hydra_run_job tool. According to its source, it runs hdrctl run on the job folder and returns the log. We did not test it here: the MCP server has its own lesson."),
]
s = common(15, "Other launches", "Launch a Hydra job from the CLI and the API",
 "Run the same job without Studio: from the command line for one job or a whole project, and from the API with one POST request.",
 '<span class="mono">hdrctl run</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<code>hdrctl run jobs/job1</code> runs one job. <code>hdrctl run .</code> runs a whole project, and <code>POST /api/runs</code> starts the same project through the API of <code>hdrctl serve</code>. The engine underneath is the same.",
 "Run a job and a project from the command line, then start the project from the API and read the run back.",
 "How do I launch a job without Studio?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed, and the project built in <a href="/studio/anatomy-of-a-job">Anatomy of a job</a> (a folder created by <code>hdrctl init</code>). See <a href="/studio/install-and-start">Install and start</a>.</li>')
s += step(1, "Run one job", "Launch a job folder from the command line.",
 ["Open a terminal in the project folder.", "Run the command below."],
 "hdrctl run jobs\\job1",
 "<p>The command runs the job alone: its source, its transformations and its destination. The workflow and the thread are not involved.</p>",
 "<code>Pipeline completed successfully</code> with the rows read and written.",
 "Pipeline  job1 — jobs\\job1\nPipeline completed successfully in 2.3s\nRows read   : 3\nRows written: 2")
s += step(2, "Run the whole project", "Launch every workflow of the thread.",
 ["Run the command below from the project folder."],
 "hdrctl run .",
 "<p>A project is a folder that holds <code>.hydra</code>. <code>hdrctl run .</code> runs its workflows in the order of <code>workflows/thread.yaml</code>. This project has one workflow, <code>workflow1</code>, which runs <code>job1</code>.</p>",
 "A stage line, one workflow line and <code>Project ... completed</code> with <code>1/1 workflow(s) OK</code>.",
 "Project launch-demo — 1 workflow(s) in 1 stage(s)\nStage 1/1 — sequential\nWorkflow  workflow1\nWorkflow 'workflow1' OK (1.6s)\nProject 'launch-demo' completed in 1.6s — 1/1 workflow(s) OK")
s += step(3, "Start the API server", "Serve the API that Studio itself uses.",
 ["Open a second terminal.", "Run the command below and leave it open.", "Check the server from the first terminal with <code>curl.exe http://127.0.0.1:5678/api/health</code>."],
 "hdrctl serve",
 "<p>The server listens on port 5678 by default. The health answer gives the version of the engine.</p>",
 "A JSON answer with <code>\"status\":\"ok\"</code> and <code>\"version\":\"0.22.0\"</code>.",
 "{\"message\":\"Hydra ETL API is running\",\"status\":\"ok\",\"version\":\"0.22.0\",\"dsl_version\":\"1.0\",...}")
s += step(4, "Start a run with a POST", "Send the project to the engine.",
 ["Create a file <code>run.json</code> that holds the path of the project folder, with doubled backslashes.", "Run the <code>curl.exe</code> command below from the first terminal."],
 "run.json:\n{\"workflow_path\": \"C:\\\\Users\\\\you\\\\launch-demo\"}\n\ncurl.exe -s -i -X POST -H \"Content-Type: application/json\" -d @run.json http://127.0.0.1:5678/api/runs",
 "<p>The server answers <code>202 Accepted</code> at once, without waiting for the end of the run. The body gives a <code>run_id</code>, which is different on each call, and the status <code>pending</code>. Because the path is a project folder, the run is named <code>project:</code> followed by the folder name.</p>",
 "<code>HTTP/1.1 202 Accepted</code> and a JSON body with <code>\"status\":\"pending\"</code>.",
 "HTTP/1.1 202 Accepted\n{\"run_id\":\"692f87f4\",\"workflow_name\":\"project:launch-demo\",...,\"status\":\"pending\",...,\"trigger\":\"manual\"}")
s += step(5, "Read the run", "Follow the run to its end.",
 ["Wait a few seconds.", "Run the command below."],
 "curl.exe -s http://127.0.0.1:5678/api/runs",
 "<p>The list holds one entry per run, with its status, its duration and one item per step. In our test the run was <code>success</code> after 0.6 seconds, with one step, <code>workflow1</code>, and the log line <code>OK job1</code>. <code>output.csv</code> was written in <code>jobs/job1/data</code>.</p>",
 "A run with <code>\"status\":\"success\"</code> and one step.",
 "[{\"run_id\":\"692f87f4\",\"workflow_name\":\"project:launch-demo\",\"status\":\"success\",\"duration\":0.62,...,\"steps\":[{\"step_name\":\"workflow1\",\"success\":true,...,\"logs\":[\"OK job1\"]}],\"trigger\":\"manual\"}]")
s += rules([("TIP", "Use <code>hdrctl run jobs/job1</code> while you write a job, and <code>hdrctl run .</code> when the thread matters."),
 ("TIP", "Add <code>--dry-run</code> to <code>hdrctl run .</code> to validate the project without running anything."),
 ("TRAP", "In our test the run list of a freshly started server was empty, although two command-line runs had completed before. Runs started from the terminal were not in it. Start a run from the API or from Studio to see it listed."),
 ("TRAP", "A run is not saved on disk by the server: the list is lost when <code>hdrctl serve</code> stops, so read a run before you close the server.")])
s += tail([["One job", "hdrctl run jobs/job1"], ["Project", "hdrctl run ."], ["API", "POST /api/runs with workflow_path"], ["Read", "GET /api/runs"]],
 [["Path not found (404)", "workflow_path does not exist", "Check the path and the doubled backslashes"], ["The list is empty", "The run was started outside this server", "Start it with the POST"], ["Status stays pending", "The run has not finished", "Wait, then read the list again"], ["Connection refused", "hdrctl serve is not running", "Start the server and check the port"]],
 faq, REL + '<li><a href="/studio/10-run-the-job">Four ways to run, one engine underneath</a></li><li><a href="/studio/11-review-a-run">Find a past execution and its result</a></li><li><a href="/studio/anatomy-of-a-job">What a Hydra job is made of</a></li>',
 "One engine, three doors: the terminal, the API and, later, an assistant. Next, review what a run produced.",
 '<a class="primary" href="/studio/11-review-a-run">Review a run <span aria-hidden="true">→</span></a>') + CTA
publish(15, "launch-a-job-from-the-cli-and-the-api", "Other launches", s,
 "Launch a Hydra job from the CLI and the API", "Launch a Hydra job from the CLI and the API", "Hydra Run a Job: hdrctl run and POST /api/runs | Hydra ETL",
 "Run a Hydra job or project with hdrctl run, then start it with POST /api/runs and read the run back. Tested with Hydra ETL 0.22.",
 ["Run one job", "Run the whole project", "Start the API server", "Start a run with a POST", "Read the run"], faq,
 "Launch a job from the CLI and the API", "Run the same job without Studio from the command line and the API, and see where each launch shows up.")
